import React from 'react';
import { Zap, Globe, Settings, PlaySquare, ShieldCheck, Sparkles } from 'lucide-react';

interface SidebarProps {
  activeTab: 'downloader' | 'regions' | 'settings';
  setActiveTab: (tab: 'downloader' | 'regions' | 'settings') => void;
  videoCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  videoCount,
}) => {
  return (
    <aside className="w-64 bg-[#141416] border-r border-[#26262b] flex flex-col justify-between shrink-0 select-none">
      <div className="p-5">
        {/* Logo and Brand */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[#ff5338] text-xl font-black tracking-wide font-mono">
              SHOPEE VIDEO
            </span>
            <span className="bg-[#ff5338]/20 text-[#ff5338] text-[10px] font-bold px-1.5 py-0.5 rounded">
              PRO
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-1 font-medium">
            Pro Multi-Region Downloader
          </p>

          {/* Region tags */}
          <div className="flex items-center gap-1.5 mt-3">
            {['ID', 'MY', 'PH', 'SG', 'TH'].map((code) => (
              <span
                key={code}
                className="text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#1e1e24] text-zinc-400 border border-[#2e2e36]"
              >
                {code}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('downloader')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'downloader'
                ? 'bg-gradient-to-r from-[#ff4d2d] to-[#ff6b3d] text-white shadow-lg shadow-[#ff4d2d]/25'
                : 'text-zinc-300 hover:bg-[#1f1f24] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4" />
              <span>Download Cepat (Banyak Link)</span>
            </div>
            {videoCount > 0 && (
              <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === 'downloader' ? 'bg-white/20 text-white' : 'bg-[#2a2a32] text-zinc-300'
              }`}>
                {videoCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('regions')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'regions'
                ? 'bg-[#26262e] text-white'
                : 'text-zinc-400 hover:bg-[#1f1f24] hover:text-zinc-200'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Multi-Region (5 Negara)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-[#26262e] text-white'
                : 'text-zinc-400 hover:bg-[#1f1f24] hover:text-zinc-200'
            }`}
          >
            <Settings className="w-4 h-4 text-zinc-400" />
            <span>Pengaturan</span>
          </button>
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 m-3 rounded-xl bg-[#1a1a20] border border-[#2b2b35] text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Garansi 100% No Watermark</span>
        </div>
        <p className="text-zinc-400 text-[11px] leading-relaxed">
          Mengambil langsung raw stream MP4 1080p Full HD dari CDN Shopee tanpa logo overlay.
        </p>
      </div>
    </aside>
  );
};
