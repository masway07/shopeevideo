import React from 'react';
import { Settings, ShieldCheck, Check, Info, Film, FileText, Sparkles } from 'lucide-react';
import { DownloaderSettings } from '../types';

interface SettingsViewProps {
  settings: DownloaderSettings;
  setSettings: React.Dispatch<React.SetStateAction<DownloaderSettings>>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
}) => {
  return (
    <div className="flex-1 bg-[#161619] p-6 overflow-y-auto space-y-6">
      <div className="border-b border-[#24242a] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-zinc-300" />
          <h2 className="text-xl font-bold text-white">
            Pengaturan Downloader
          </h2>
        </div>
        <p className="text-zinc-400 text-sm">
          Sesuaikan preferensi kualitas video, format penamaan file, dan kontrol player.
        </p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {/* Quality Preference */}
        <div className="bg-[#1e1e24] border border-[#2b2b35] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#ff4d2d]" />
            <h3 className="text-white font-semibold text-sm">
              Prioritas Resolusi Video
            </h3>
          </div>
          <p className="text-zinc-400 text-xs">
            Pilih resolusi stream MP4 yang akan diekstrak secara default dari server CDN Shopee:
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setSettings(s => ({ ...s, quality: '1080p' }))}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                settings.quality === '1080p'
                  ? 'border-[#ff4d2d] bg-[#ff4d2d]/10 text-white'
                  : 'border-[#2d2d38] bg-[#141418] text-zinc-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white">1080p Full HD</span>
                {settings.quality === '1080p' && (
                  <Check className="w-4 h-4 text-[#ff4d2d]" />
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Kualitas tertinggi, ketajaman maksimal tanpa blur atau artefak kompresi.
              </p>
            </button>

            <button
              onClick={() => setSettings(s => ({ ...s, quality: '720p' }))}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                settings.quality === '720p'
                  ? 'border-[#ff4d2d] bg-[#ff4d2d]/10 text-white'
                  : 'border-[#2d2d38] bg-[#141418] text-zinc-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white">720p HD Standar</span>
                {settings.quality === '720p' && (
                  <Check className="w-4 h-4 text-[#ff4d2d]" />
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Ukuran file lebih hemat, proses download batch lebih cepat.
              </p>
            </button>
          </div>
        </div>

        {/* Filename Format */}
        <div className="bg-[#1e1e24] border border-[#2b2b35] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h3 className="text-white font-semibold text-sm">
              Format Nama File Hasil Download
            </h3>
          </div>
          <p className="text-zinc-400 text-xs">
            Struktur nama file saat menyimpan video satuan maupun file ZIP:
          </p>

          <div className="space-y-2">
            {[
              {
                id: 'standard',
                title: '[Negara]_[Pembuat]_[Judul].mp4',
                desc: 'Contoh: SG_zuzuidcoorperation0_Webcam_Setup.mp4',
              },
              {
                id: 'clean',
                title: 'ShopeeVideo_[Timestamp].mp4',
                desc: 'Contoh: ShopeeVideo_1730000000000.mp4',
              },
            ].map((fmt) => (
              <label
                key={fmt.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#141418] border border-[#2c2c36] hover:border-zinc-500 cursor-pointer text-xs"
              >
                <div>
                  <div className="text-white font-mono font-medium">{fmt.title}</div>
                  <div className="text-zinc-400 text-[11px]">{fmt.desc}</div>
                </div>
                <input
                  type="radio"
                  name="filenameFormat"
                  checked={settings.filenameFormat === fmt.id}
                  onChange={() => setSettings(s => ({ ...s, filenameFormat: fmt.id as any }))}
                  className="accent-[#ff4d2d] w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Auto Preview Toggle */}
        <div className="bg-[#1e1e24] border border-[#2b2b35] rounded-xl p-5 flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold text-sm">
              Otomatis Putar di Pemutar Media
            </h4>
            <p className="text-zinc-400 text-xs mt-0.5">
              Langsung memutar video pertama yang selesai diekstrak ke player di panel kanan.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoPreview}
            onChange={(e) => setSettings(s => ({ ...s, autoPreview: e.target.checked }))}
            className="w-5 h-5 accent-[#ff4d2d] rounded cursor-pointer"
          />
        </div>

        {/* Watermark FAQ Guarantee Card */}
        <div className="bg-[#141418] border border-[#2a2a35] rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
            <Info className="w-4 h-4" />
            <span>Bagaimana cara video Shopee didownload tanpa watermark?</span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Shopee menyimpan master video mentah (raw stream) di server CDN mereka (seperti <code className="text-zinc-300">cv-southeastasia.s-cdn.net</code>). Tanda air/watermark Shopee yang biasa terlihat di aplikasi seluler hanyalah lapisan tampilan dinamis (overlay UI). Downloader ini langsung mengambil file master MP4 asli, sehingga hasil unduhan 100% murni tanpa watermark, tanpa blur logo, dan kualitas Full HD.
          </p>
        </div>
      </div>
    </div>
  );
};
