import React from 'react';
import { Globe, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface RegionsViewProps {
  onSelectCountryDemo: (countryCode: string) => void;
  onBackToDownloader: () => void;
}

const COUNTRIES = [
  {
    code: 'ID',
    name: 'Indonesia',
    flag: '🇮🇩',
    domain: 'shopee.co.id',
    shortlink: 'id.shp.ee / s.shopee.co.id',
    status: 'Aktif • Full HD',
    sample: 'https://id.shp.ee/v/demo_unboxing_gadget_id',
    desc: 'Mendukung Shopee Video Indonesia, live streaming rekam, dan affiliate video tanpa watermark.',
  },
  {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    domain: 'shopee.com.my',
    shortlink: 'my.shp.ee / s.shopee.com.my',
    status: 'Aktif • Full HD',
    sample: 'https://my.shp.ee/v/demo_keyboard_mechanical_my',
    desc: 'Mendukung konten Shopee Video Malaysia dengan resolusi penuh 1080p.',
  },
  {
    code: 'SG',
    name: 'Singapura',
    flag: '🇸🇬',
    domain: 'shopee.sg',
    shortlink: 'sg.shp.ee / s.shopee.sg',
    status: 'Aktif • Full HD',
    sample: 'https://sg.shp.ee/v/demo_desk_setup_sg',
    desc: 'Mendukung Shopee Video Singapura (SG) seperti contoh SG_zuzuidcoorperation0.',
  },
  {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    domain: 'shopee.co.th',
    shortlink: 'th.shp.ee / s.shopee.co.th',
    status: 'Aktif • Full HD',
    sample: 'https://th.shp.ee/v/demo_fashion_review_th',
    desc: 'Mendukung video Shopee Thailand, konten fashion, beauty, dan elektronik.',
  },
  {
    code: 'PH',
    name: 'Filipina',
    flag: '🇵🇭',
    domain: 'shopee.ph',
    shortlink: 'ph.shp.ee / s.shopee.ph',
    status: 'Aktif • Full HD',
    sample: 'https://ph.shp.ee/v/demo_beauty_skincare_ph',
    desc: 'Mendukung Shopee Video Philippines untuk link shopee.ph dan ph.shp.ee.',
  },
];

export const RegionsView: React.FC<RegionsViewProps> = ({
  onSelectCountryDemo,
  onBackToDownloader,
}) => {
  return (
    <div className="flex-1 bg-[#161619] p-6 overflow-y-auto space-y-6">
      <div className="border-b border-[#24242a] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">
            Dukungan Multi-Region (5 Negara)
          </h2>
        </div>
        <p className="text-zinc-400 text-sm">
          Sistem downloader ini telah terhubung ke server CDN Shopee di seluruh Asia Tenggara untuk mengambil file video asli tanpa kompresi dan watermark.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COUNTRIES.map((c) => (
          <div
            key={c.code}
            className="bg-[#1e1e24] border border-[#2b2b35] rounded-xl p-5 hover:border-[#3d3d4b] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <h3 className="text-white font-bold text-base flex items-center gap-2">
                      <span>{c.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[#ff4d2d]/15 text-[#ff4d2d] font-mono font-bold">
                        {c.code}
                      </span>
                    </h3>
                    <span className="text-zinc-400 text-xs font-mono">{c.domain}</span>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {c.status}
                </span>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                {c.desc}
              </p>

              <div className="bg-[#141418] p-2.5 rounded-lg border border-[#2a2a34] text-xs font-mono text-zinc-400 mb-4 truncate">
                Format: {c.shortlink}
              </div>
            </div>

            <button
              onClick={() => onSelectCountryDemo(c.sample)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#272732] hover:bg-[#ff4d2d] hover:text-white text-zinc-300 font-semibold text-xs transition-colors cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff4d2d] group-hover:text-white" />
              <span>Uji Coba Video {c.name}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-[#1c1c24] to-[#252028] border border-[#ff4d2d]/20 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff4d2d]/20 flex items-center justify-center text-[#ff4d2d] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">
              Teknologi Auto-Detection Region
            </h4>
            <p className="text-zinc-400 text-xs mt-0.5">
              Anda tidak perlu memilih negara secara manual jika memiliki banyak link campuran. Sistem otomatis mendeteksi negara dari domain link (id.shp.ee, sg.shp.ee, my.shp.ee, th.shp.ee, ph.shp.ee) dan menghubungkan ke node CDN terdekat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
