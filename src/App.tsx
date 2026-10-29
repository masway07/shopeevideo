import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DownloaderPanel } from './components/DownloaderPanel';
import { MediaPlayerPanel } from './components/MediaPlayerPanel';
import { RegionsView } from './components/RegionsView';
import { SettingsView } from './components/SettingsView';
import { ShopeeVideoItem, DownloaderSettings } from './types';
import { downloadVideosAsZip } from './utils/zipDownloader';

export default function App() {
  const [activeTab, setActiveTab] = useState<'downloader' | 'regions' | 'settings'>('downloader');
  const [videos, setVideos] = useState<ShopeeVideoItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<ShopeeVideoItem | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [zipProgress, setZipProgress] = useState<{ percent: number; label: string } | null>(null);
  const [settings, setSettings] = useState<DownloaderSettings>({
    autoPreview: true,
    quality: '1080p',
    filenameFormat: 'standard',
    saveAudioOption: true,
  });

  // Load initial demo videos from API on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const res = await fetch('/api/regions');
        if (res.ok) {
          const data = await res.json();
          if (data.samples && data.samples.length > 0) {
            setVideos(data.samples);
            // Default active video (Shopee Video real sample)
            const initialVideo = data.samples[0];
            setCurrentVideo(initialVideo);
          }
        }
      } catch (err) {
        console.warn('Failed to load initial samples from server:', err);
      }
    }
    loadInitialData();
  }, []);

  // Process entered links
  const handleProcessLinks = async (rawText: string, region?: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, region }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal memproses tautan Shopee Video.');
      }

      const data = await res.json();
      if (data.videos && data.videos.length > 0) {
        // Prepend new videos and remove duplicates by id or url
        setVideos((prev) => {
          const newIds = new Set(data.videos.map((v: ShopeeVideoItem) => v.originalUrl));
          const filteredPrev = prev.filter((v) => !newIds.has(v.originalUrl));
          return [...data.videos, ...filteredPrev];
        });

        if (settings.autoPreview || !currentVideo) {
          setCurrentVideo(data.videos[0]);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Gagal memproses video.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Next and Previous video navigation in player
  const handleNextVideo = () => {
    if (videos.length === 0 || !currentVideo) return;
    const currentIndex = videos.findIndex((v) => v.id === currentVideo.id);
    const nextIndex = (currentIndex + 1) % videos.length;
    setCurrentVideo(videos[nextIndex]);
  };

  const handlePrevVideo = () => {
    if (videos.length === 0 || !currentVideo) return;
    const currentIndex = videos.findIndex((v) => v.id === currentVideo.id);
    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    setCurrentVideo(videos[prevIndex]);
  };

  // Batch download ZIP
  const handleDownloadZip = async () => {
    if (videos.length === 0) return;
    setZipProgress({ percent: 5, label: 'Menyiapkan berkas unduhan...' });

    try {
      await downloadVideosAsZip(videos, (_current, _total, percent, currentName) => {
        setZipProgress({ percent, label: currentName });
      });
    } catch (err: any) {
      alert('Gagal mendownload berkas ZIP: ' + (err.message || 'Unknown error'));
    } finally {
      setTimeout(() => setZipProgress(null), 1500);
    }
  };

  const handleRemoveVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    if (currentVideo?.id === id) {
      const remaining = videos.filter((v) => v.id !== id);
      setCurrentVideo(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleClearAll = () => {
    setVideos([]);
    setCurrentVideo(null);
  };

  const handleSelectCountryDemo = async (sampleUrl: string) => {
    setActiveTab('downloader');
    await handleProcessLinks(sampleUrl);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#101012] text-zinc-100 font-sans select-none">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        videoCount={videos.length}
      />

      {/* 2. Middle Panel: Downloader, Regions, or Settings */}
      <div className="w-[45%] border-r border-[#24242a] flex flex-col h-full overflow-hidden">
        {activeTab === 'downloader' && (
          <DownloaderPanel
            onProcessLinks={handleProcessLinks}
            videos={videos}
            currentVideo={currentVideo}
            onSelectVideo={(video) => setCurrentVideo(video)}
            onRemoveVideo={handleRemoveVideo}
            onClearAll={handleClearAll}
            onDownloadZip={handleDownloadZip}
            isProcessing={isProcessing}
            zipProgress={zipProgress}
          />
        )}

        {activeTab === 'regions' && (
          <RegionsView
            onSelectCountryDemo={handleSelectCountryDemo}
            onBackToDownloader={() => setActiveTab('downloader')}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </div>

      {/* 3. Right Panel: Built-in Media Player (exactly matching screenshot) */}
      <MediaPlayerPanel
        currentVideo={currentVideo}
        onNext={handleNextVideo}
        onPrev={handlePrevVideo}
        onClose={() => setCurrentVideo(null)}
      />
    </div>
  );
}
