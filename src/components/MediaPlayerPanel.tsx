import React, { useRef, useState, useEffect } from 'react';
import {
  Home,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Share2,
  Check,
  Video,
  X,
  ExternalLink,
} from 'lucide-react';
import { ShopeeVideoItem } from '../types';

interface MediaPlayerPanelProps {
  currentVideo: ShopeeVideoItem | null;
  onNext?: () => void;
  onPrev?: () => void;
  onClose?: () => void;
}

export const MediaPlayerPanel: React.FC<MediaPlayerPanelProps> = ({
  currentVideo,
  onNext,
  onPrev,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.9);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Update video src when currentVideo changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      if (currentVideo) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(false);
      }
    }
  }, [currentVideo?.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const seekRelative = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00.00.00';
    const hrs = Math.floor(timeInSeconds / 3600);
    const mins = Math.floor((timeInSeconds % 3600) / 60);
    const secs = Math.floor(timeInSeconds % 60);
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}.${String(mins).padStart(2, '0')}.${String(secs).padStart(2, '0')}`;
    }
    return `00.${String(mins).padStart(2, '0')}.${String(secs).padStart(2, '0')}`;
  };

  const copyCleanUrl = () => {
    if (!currentVideo) return;
    const url = currentVideo.cleanDownloadUrl || currentVideo.videoUrl;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDirect = () => {
    if (!currentVideo) return;
    const cleanTitle = (currentVideo.title || 'shopee_video')
      .replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF\s]/g, '')
      .trim()
      .slice(0, 40)
      .replace(/\s+/g, '_');
    const filename = `${currentVideo.region.code}_${currentVideo.author}_${cleanTitle}_NoWatermark.mp4`;
    const downloadSrc = currentVideo.cleanDownloadUrl || currentVideo.videoUrl;
    const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(downloadSrc)}&filename=${encodeURIComponent(filename)}`;
    const a = document.createElement('a');
    a.href = proxyUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-[#101012] border-l border-[#26262b] flex flex-col h-full overflow-hidden"
    >
      {/* Top Header bar matching screenshot */}
      <div className="h-14 px-4 border-b border-[#24242a] flex items-center justify-between shrink-0 bg-[#141418]">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            title="Kembali ke beranda"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#22222a] transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-[#ff5338] fill-[#ff5338]" />
              Pemutar Media
            </span>
          </div>
        </div>

        {currentVideo && (
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#ff5338]/15 text-[#ff5338] border border-[#ff5338]/30">
              {currentVideo.region.flag} {currentVideo.region.code} - 1080p No Watermark
            </span>
          </div>
        )}
      </div>

      {/* Main Video Viewport */}
      <div className="flex-1 relative flex flex-col items-center justify-center bg-black overflow-hidden select-none">
        {currentVideo ? (
          <>
            <video
              ref={videoRef}
              src={currentVideo.cleanWebUrl || currentVideo.videoUrl}
              poster={currentVideo.thumbnailUrl}
              playsInline
              loop={isLooping}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {
                if (!isLooping && onNext) onNext();
              }}
              className="max-h-full max-w-full object-contain cursor-pointer"
              onClick={togglePlay}
            />

            {/* In-video floating Watermark-free indicator */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 text-xs text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-medium text-emerald-400">100% Bebas Watermark</span>
              <span className="text-zinc-400">|</span>
              <span className="text-zinc-300 font-mono text-[11px]">{currentVideo.resolution}</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a22] border border-[#2e2e3a] flex items-center justify-center text-zinc-500 mb-4">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-zinc-200 font-semibold text-base mb-1">
              Belum Ada Video Dipilih
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Masukkan link Shopee Video di panel kiri atau klik "Contoh Link 5 Negara" untuk mulai memutar dan mengunduh video tanpa watermark.
            </p>
          </div>
        )}

        {/* Player Controls Overlay (Positioned exactly at bottom like in the screenshot) */}
        {currentVideo && (
          <div className="w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-6 pb-4 px-4 flex flex-col gap-2 shrink-0">
            {/* Scrubber Progress bar */}
            <div className="relative group w-full flex items-center cursor-pointer">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-zinc-700/60 rounded-lg appearance-none cursor-pointer accent-[#ff5338] transition-all hover:h-2"
                style={{
                  background: `linear-gradient(to right, #ff5338 ${(currentTime / (duration || 1)) * 100}%, rgba(82, 82, 91, 0.6) ${(currentTime / (duration || 1)) * 100}%)`,
                }}
              />
            </div>

            {/* Bottom Controls Row matching screenshot */}
            <div className="flex items-center justify-between text-zinc-300 text-xs pt-1">
              {/* Left: Timestamp & Handle */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-zinc-300 font-semibold tracking-wider text-[11px]">
                  {formatTime(currentTime)}
                </span>
                <span
                  title={currentVideo.author}
                  className="font-mono text-zinc-400 max-w-[160px] truncate hover:text-white"
                >
                  {currentVideo.region.code}_{currentVideo.author}
                </span>
              </div>

              {/* Center: Playback Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Reset / Close */}
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.pause();
                      setIsPlaying(false);
                    }
                  }}
                  title="Reset Posisi"
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Prev */}
                <button
                  onClick={onPrev}
                  title="Video Sebelumnya"
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>

                {/* Rewind 10s */}
                <button
                  onClick={() => seekRelative(-10)}
                  title="Mundur 10 Detik"
                  className="flex items-center text-[10px] p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-0.5" />
                  <span>10</span>
                </button>

                {/* Big Circular Play / Pause Button with orange glow */}
                <button
                  onClick={togglePlay}
                  title={isPlaying ? 'Jeda' : 'Putar'}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff4d2d] to-[#ff6b3d] flex items-center justify-center text-white shadow-lg shadow-[#ff4d2d]/40 hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  )}
                </button>

                {/* Forward 10s */}
                <button
                  onClick={() => seekRelative(10)}
                  title="Maju 10 Detik"
                  className="flex items-center text-[10px] p-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <span>10</span>
                  <RotateCw className="w-3.5 h-3.5 ml-0.5" />
                </button>

                {/* Next */}
                <button
                  onClick={onNext}
                  title="Video Berikutnya"
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>

                {/* Loop */}
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  title={isLooping ? 'Ulang Otomatis: Aktif' : 'Ulang Otomatis: Nonaktif'}
                  className={`p-1.5 transition-colors ${
                    isLooping ? 'text-[#ff5338]' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right: Volume & Fullscreen */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 group">
                  <button
                    onClick={toggleMute}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-3.5 h-3.5 text-red-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-14 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ff5338]"
                  />
                </div>

                <button
                  onClick={toggleFullscreen}
                  title="Layar Penuh"
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Details Card at bottom */}
      {currentVideo && (
        <div className="p-4 bg-[#141418] border-t border-[#24242a] shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-semibold truncate mb-1">
                {currentVideo.title}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span className="text-zinc-300 font-medium">@{currentVideo.author}</span>
                <span>•</span>
                <span>{currentVideo.region.flag} {currentVideo.region.name}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{currentVideo.resolution}</span>
                <span>•</span>
                <span className="text-zinc-400">{currentVideo.fileSize}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={copyCleanUrl}
                title="Salin Link Video Bersih"
                className="px-3 py-2 rounded-lg bg-[#22222a] hover:bg-[#2c2c36] text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-[#32323e]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin URL'}</span>
              </button>

              <button
                onClick={downloadDirect}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff4d2d] to-[#ff6b3d] hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#ff4d2d]/25 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download MP4</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
