import React, { useState } from 'react';
import {
  Zap,
  Play,
  Download,
  Trash2,
  Copy,
  Check,
  ClipboardPaste,
  Sparkles,
  Music,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  FolderArchive,
  AlertCircle,
} from 'lucide-react';
import { ShopeeVideoItem, RegionInfo } from '../types';

interface DownloaderPanelProps {
  onProcessLinks: (rawText: string, region?: string) => Promise<void>;
  videos: ShopeeVideoItem[];
  currentVideo: ShopeeVideoItem | null;
  onSelectVideo: (video: ShopeeVideoItem) => void;
  onRemoveVideo: (id: string) => void;
  onClearAll: () => void;
  onDownloadZip: () => void;
  isProcessing: boolean;
  zipProgress: { percent: number; label: string } | null;
}

const REGION_TABS = [
  { code: 'ALL', label: 'Semua (5 Negara)', flag: '🌐' },
  { code: 'ID', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'MY', label: 'Malaysia', flag: '🇲🇾' },
  { code: 'SG', label: 'Singapura', flag: '🇸🇬' },
  { code: 'TH', label: 'Thailand', flag: '🇹🇭' },
  { code: 'PH', label: 'Filipina', flag: '🇵🇭' },
];

export const DownloaderPanel: React.FC<DownloaderPanelProps> = ({
  onProcessLinks,
  videos,
  currentVideo,
  onSelectVideo,
  onRemoveVideo,
  onClearAll,
  onDownloadZip,
  isProcessing,
  zipProgress,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) {
        setInputText((prev) => (prev ? prev + '\n' + clip : clip));
      }
    } catch (_) {
      // ignore clipboard permission error
    }
  };

  const loadSampleLinks = () => {
    const samples = [
      'https://sv.shopee.co.id/share-video/5gJBUrnZCQBb0QQtAAAAAA==?af_cost_value=h5_video_page&c=share_web&postId=5gJBUrnZCQBb0QQtAAAAAA==',
      'https://my.shp.ee/v/demo_keyboard_mechanical_my',
      'https://sg.shp.ee/v/demo_desk_setup_sg',
      'https://th.shp.ee/v/demo_fashion_review_th',
      'https://ph.shp.ee/v/demo_beauty_skincare_ph',
    ];
    setInputText(samples.join('\n'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onProcessLinks(inputText, selectedRegion === 'ALL' ? undefined : selectedRegion);
  };

  const handleSingleDownload = (video: ShopeeVideoItem) => {
    const cleanTitle = (video.title || 'shopee_video')
      .replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF\s]/g, '')
      .trim()
      .slice(0, 40)
      .replace(/\s+/g, '_');
    const filename = `${video.region.code}_${video.author}_${cleanTitle}_NoWatermark.mp4`;
    const targetSource = video.cleanDownloadUrl || video.videoUrl;
    const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(targetSource)}&filename=${encodeURIComponent(filename)}`;
    const a = document.createElement('a');
    a.href = proxyUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleAudioDownload = (video: ShopeeVideoItem) => {
    const cleanTitle = (video.title || 'shopee_audio')
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .slice(0, 30)
      .replace(/\s+/g, '_');
    const filename = `${video.region.code}_${video.author}_${cleanTitle}.mp3`;
    const targetSource = video.cleanDownloadUrl || video.videoUrl;
    const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(targetSource)}&filename=${encodeURIComponent(filename)}`;
    const a = document.createElement('a');
    a.href = proxyUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered videos based on region tab
  const filteredVideos =
    selectedRegion === 'ALL'
      ? videos
      : videos.filter((v) => v.region.code === selectedRegion);

  const detectedLinksCount = (
    inputText.match(/https?:\/\/[^\s]+/gi) ||
    inputText.split('\n').filter((l) => l.trim().length > 5)
  ).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#161619] overflow-y-auto">
      {/* Top Header matching reference */}
      <div className="p-6 pb-4 border-b border-[#24242a] bg-[#1a1a20]">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-[#ff4d2d] fill-[#ff4d2d]" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Download Shopee Video
          </h1>
        </div>
        <p className="text-zinc-400 text-xs sm:text-sm">
          Bisa 1 link atau banyak link sekaligus (ID, MY, PH, SG, TH). Hasil video 100% bebas watermark & bukan blur.
        </p>

        {/* Region selector tabs */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {REGION_TABS.map((tab) => (
            <button
              key={tab.code}
              onClick={() => setSelectedRegion(tab.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRegion === tab.code
                  ? 'bg-[#ff4d2d] text-white shadow-md shadow-[#ff4d2d]/30'
                  : 'bg-[#22222a] text-zinc-400 hover:text-zinc-200 hover:bg-[#282832]'
              }`}
            >
              <span>{tab.flag}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Input Card Container */}
        <div className="bg-[#1e1e24] border border-[#2b2b35] rounded-xl p-4 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span className="font-medium text-zinc-300 flex items-center gap-1.5">
                <span>Tempel Link Shopee Video</span>
                {detectedLinksCount > 0 && (
                  <span className="bg-[#ff4d2d]/20 text-[#ff4d2d] font-bold px-2 py-0.5 rounded-full text-[11px]">
                    {detectedLinksCount} Link terdeteksi
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center gap-1 text-zinc-400 hover:text-white px-2 py-1 rounded bg-[#272730] hover:bg-[#30303c] transition-colors"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Tempel</span>
                </button>
                <button
                  type="button"
                  onClick={loadSampleLinks}
                  className="flex items-center gap-1 text-[#ff7456] hover:text-[#ff8d75] px-2 py-1 rounded bg-[#ff4d2d]/10 hover:bg-[#ff4d2d]/20 transition-colors font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Contoh 5 Negara</span>
                </button>
                {inputText && (
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="flex items-center gap-1 text-zinc-500 hover:text-red-400 px-2 py-1 rounded hover:bg-[#272730] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Big Dark Textarea matching reference design */}
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tempel 1 link atau banyak link Shopee Video sekaligus di sini... Contoh:&#10;https://id.shp.ee/v/...&#10;https://sg.shp.ee/v/...&#10;https://my.shp.ee/v/..."
                rows={5}
                className="w-full bg-[#141418] border border-[#2e2e38] rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] font-mono transition-colors"
              />
            </div>

            {/* Submit Action Button */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Format Full HD 1080p • Tanpa Watermark</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !inputText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm bg-gradient-to-r from-[#ff4d2d] to-[#ff6b3d] text-white hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-[#ff4d2d]/30 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengekstrak Video...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Ekstrak & Download ({detectedLinksCount || 1} Link)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Batch ZIP Progress Bar */}
        {zipProgress && (
          <div className="bg-[#1e1e24] border border-[#ff4d2d]/40 rounded-xl p-4 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 mb-2">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-[#ff4d2d]" />
                <span>{zipProgress.label}</span>
              </div>
              <span className="text-[#ff4d2d]">{zipProgress.percent}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff4d2d] to-[#ff7d45] transition-all duration-300"
                style={{ width: `${zipProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Processed Videos List Header */}
        {filteredVideos.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1e1e24]/60 p-3 rounded-xl border border-[#2b2b35]">
              <div>
                <h3 className="text-white text-sm font-bold flex items-center gap-2">
                  <span>Daftar Video Siap Download</span>
                  <span className="bg-[#ff4d2d] text-white text-xs px-2 py-0.2 rounded-full font-bold">
                    {filteredVideos.length} Video
                  </span>
                </h3>
                <p className="text-zinc-400 text-xs">
                  Semua video dalam kualitas Full HD 1080p tanpa watermark
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Download All as ZIP */}
                <button
                  onClick={onDownloadZip}
                  disabled={zipProgress !== null}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#272732] hover:bg-[#323240] text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm"
                >
                  <FolderArchive className="w-4 h-4" />
                  <span>Download Semua (ZIP)</span>
                </button>

                <button
                  onClick={onClearAll}
                  className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-[#272730] transition-colors"
                  title="Hapus Semua Video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 gap-3">
              {filteredVideos.map((video) => {
                const isSelected = currentVideo?.id === video.id;
                return (
                  <div
                    key={video.id}
                    className={`bg-[#1c1c22] border rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all ${
                      isSelected
                        ? 'border-[#ff4d2d] ring-1 ring-[#ff4d2d]/30 bg-[#222026]'
                        : 'border-[#292933] hover:border-[#383845]'
                    }`}
                  >
                    {/* Thumbnail with quick preview trigger */}
                    <div
                      onClick={() => onSelectVideo(video)}
                      className="relative w-full sm:w-28 h-28 sm:h-20 rounded-lg overflow-hidden bg-black shrink-0 cursor-pointer group"
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-[#ff4d2d] text-white flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-white translate-x-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-zinc-300 font-mono px-1.5 py-0.5 rounded">
                        {video.duration}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ff4d2d]/15 text-[#ff4d2d] border border-[#ff4d2d]/30 font-mono">
                          {video.region.flag} {video.region.code}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {video.resolution}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Tanpa Watermark
                        </span>
                      </div>

                      <h4
                        onClick={() => onSelectVideo(video)}
                        className="text-white text-sm font-semibold truncate hover:text-[#ff7456] cursor-pointer"
                        title={video.title}
                      >
                        {video.title}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <span className="text-zinc-300 font-medium">@{video.author}</span>
                        <span>•</span>
                        <span>{video.fileSize}</span>
                        {video.views && (
                          <>
                            <span>•</span>
                            <span>{video.views} tayangan</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2b2b35]">
                      <button
                        onClick={() => onSelectVideo(video)}
                        title="Putar di Pemutar Media"
                        className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          isSelected
                            ? 'bg-[#ff4d2d] text-white'
                            : 'bg-[#262630] hover:bg-[#30303c] text-zinc-300'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden md:inline">Putar</span>
                      </button>

                      <button
                        onClick={() => handleSingleDownload(video)}
                        title="Download MP4 1080p Bebas Watermark"
                        className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#ff4d2d] to-[#ff6b3d] hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#ff4d2d]/20 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>MP4 HD</span>
                      </button>

                      <button
                        onClick={() => handleAudioDownload(video)}
                        title="Download Audio MP3"
                        className="p-2 rounded-lg bg-[#262630] hover:bg-[#30303c] text-zinc-400 hover:text-white transition-colors"
                      >
                        <Music className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => copyUrl(video.id, video.videoUrl)}
                        title="Salin Direct Link MP4"
                        className="p-2 rounded-lg bg-[#262630] hover:bg-[#30303c] text-zinc-400 hover:text-white transition-colors"
                      >
                        {copiedId === video.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => onRemoveVideo(video.id)}
                        title="Hapus dari daftar"
                        className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-[#262630] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state instructions */}
        {filteredVideos.length === 0 && (
          <div className="border border-dashed border-[#2d2d38] rounded-xl p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] mx-auto flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-white text-sm font-semibold mb-1">
                Download Shopee Video Tanpa Watermark
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Mendukung video dari 5 negara (ID, MY, SG, TH, PH). Tempel link Shopee Video (atau klik tombol "Contoh 5 Negara" di atas) lalu klik tombol ekstrak.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
