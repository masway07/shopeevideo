import JSZip from 'jszip';
import { ShopeeVideoItem } from '../types';

export interface ZipProgressCallback {
  (current: number, total: number, percent: number, currentName: string): void;
}

export async function downloadVideosAsZip(
  videos: ShopeeVideoItem[],
  onProgress?: ZipProgressCallback
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('Shopee_Videos_NoWatermark');

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const safeTitle = (video.title || 'shopee_video')
      .replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF\s]/g, '')
      .trim()
      .slice(0, 40)
      .replace(/\s+/g, '_');
    const filename = `${video.region.code}_${video.author}_${safeTitle || 'video'}.mp4`;

    if (onProgress) {
      onProgress(i + 1, videos.length, Math.round(((i + 1) / videos.length) * 80), filename);
    }

    try {
      // Use clean 1080p master without watermark via our backend proxy
      const downloadSource = video.cleanDownloadUrl || video.videoUrl;
      const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(downloadSource)}&filename=${encodeURIComponent(filename)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) {
        throw new Error(`Gagal fetch video ${filename}`);
      }
      const blob = await res.blob();
      folder?.file(filename, blob);
    } catch (err) {
      console.warn(`Error bundling video ${video.id} to zip:`, err);
    }
  }

  if (onProgress) {
    onProgress(videos.length, videos.length, 90, 'Membuat file ZIP...');
  }

  const content = await zip.generateAsync(
    { type: 'blob', compression: 'STORE' },
    metadata => {
      if (onProgress) {
        onProgress(videos.length, videos.length, 90 + Math.round(metadata.percent * 0.1), 'Kompresi...');
      }
    }
  );

  // Trigger download
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `ShopeeVideos_NoWatermark_Batch_${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);

  if (onProgress) {
    onProgress(videos.length, videos.length, 100, 'Selesai!');
  }
}
