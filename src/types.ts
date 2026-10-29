export interface RegionInfo {
  code: 'ID' | 'MY' | 'SG' | 'TH' | 'PH';
  name: string;
  flag: string;
  domain: string;
  currency: string;
}

export interface ShopeeVideoItem {
  id: string;
  originalUrl: string;
  title: string;
  author: string;
  region: RegionInfo;
  videoUrl: string;
  cleanDownloadUrl?: string;
  cleanWebUrl?: string;
  thumbnailUrl: string;
  duration: string;
  resolution: string;
  fileSize: string;
  noWatermark: boolean;
  views?: string;
  likes?: string;
  soundTitle?: string;
  status: 'ready' | 'downloading' | 'error';
  errorMessage?: string;
}

export interface DownloaderSettings {
  autoPreview: boolean;
  quality: '1080p' | '720p';
  filenameFormat: 'standard' | 'clean' | 'detailed';
  saveAudioOption: boolean;
}
