import React from 'react';
import { API_BASE_URL } from '../config/api';
import { 
  Smartphone, 
  Workflow, 
  FileText, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Activity, 
  CheckCircle2, 
  Layers,
  Volume2,
  VolumeX,
  Search
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  isMobileFrame, 
  setIsMobileFrame,
  onOpenDeployModal,
  onOpenCommandPalette,
  onOpenBackendInspector,
  isMuted = false,
  onToggleMute
}) {
  const navTabs = [
    { id: 'diner', label: 'Interrogation', icon: Smartphone, badge: null, glow: 'shadow-lampGlow' },
    { id: 'workflow', label: 'Catalog Ops', icon: Workflow, badge: 'CRON', badgeColor: 'bg-[#7fc79a]/15 text-[#7fc79a] border-[#7fc79a]/30', glow: 'shadow-lampGlow' },
    { id: 'diagrams', label: 'Architecture', icon: Layers, badge: 'DIAGRAMS', badgeColor: 'bg-amber-400/15 text-amber-400 border-amber-400/30', glow: 'shadow-lampGlow' },
    { id: 'tests', label: 'Test Suite', icon: CheckCircle2, badge: '10 PASS', badgeColor: 'bg-[#7fc79a]/20 text-[#7fc79a]', glow: 'shadow-okGlow', customActiveBg: 'bg-[#7fc79a]' },
    { id: 'pitch', label: 'PM Dossier', icon: FileText, badge: null, glow: 'shadow-lampGlow' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0b0c]/90 backdrop-blur-xl border-b border-[#26262a]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Bar: Fixed height, pristine vertical centering, no text wrapping or overflow */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Left Brand & Live Status */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#131315] border border-[#26262a] flex items-center justify-center shadow-inner flex-shrink-0">
              <span className="font-serif italic text-base sm:text-lg text-[#f2b544]">S</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg sm:text-xl tracking-tight text-[#ecebe6] whitespace-nowrap">
                Swiggy Dineout <em className="italic text-[#f2b544] font-serif not-italic">Sentinel</em>
              </span>
              
              {/* Clickable Live Backend Status Badge */}
              <button
                type="button"
                onClick={onOpenBackendInspector}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#131315] hover:bg-[#1c1c20] border border-emerald-500/40 text-[10px] font-mono text-emerald-400 transition-all cursor-pointer shadow-sm hover:border-emerald-500/70"
                title="Inspect Live Node.js Express Backend & PostgreSQL Database"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">LIVE </span>{API_BASE_URL.includes('5000') ? ':5000' : 'API'}
              </button>
            </div>
          </div>

          {/* Center Navigation Tabs - DISPLAYED INLINE ON XL+ SCREENS (1280px+) */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#131315]/80 p-1 rounded-full border border-[#26262a]">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const activeClass = tab.customActiveBg 
                ? `${tab.customActiveBg} text-[#141008] font-bold ${tab.glow}`
                : `bg-[#f2b544] text-[#141008] font-bold ${tab.glow}`;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap ${
                    isActive
                      ? activeClass
                      : 'text-[#8d8c86] hover:text-[#ecebe6] hover:bg-[#26262a]/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                      isActive ? 'bg-[#141008]/20 text-[#141008] border-transparent' : tab.badgeColor
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Quick Actions / Spotlight Pill */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/10 transition-all shadow-sm"
              title="Open Command Palette (⌘K or Ctrl+K)"
            >
              <Search className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span className="hidden lg:inline whitespace-nowrap">⌘K Quick Actions</span>
              <span className="inline lg:hidden whitespace-nowrap text-[11px]">⌘K</span>
            </button>

            {/* Volume Mute Toggle Button */}
            <button
              type="button"
              onClick={onToggleMute}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition-all flex-shrink-0"
              title={isMuted ? "Unmute Sound Synthesizer" : "Mute Sound Synthesizer"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            {/* Phone View Toggle (Desktop Only) */}
            {activeTab === 'diner' && (
              <button
                onClick={() => setIsMobileFrame(!isMobileFrame)}
                className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-[#8d8c86] hover:text-[#ecebe6] bg-[#131315] hover:bg-[#26262a]/60 border border-[#26262a] transition-all whitespace-nowrap"
                title="Toggle Phone Frame View"
              >
                <Smartphone className="w-3 h-3 text-[#f2b544]" />
                <span>{isMobileFrame ? 'Wide Studio' : 'Phone View'}</span>
              </button>
            )}

            {/* Live Deploy Modal Button */}
            <button
              onClick={onOpenDeployModal}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-[#ecebe6] bg-[#131315] hover:bg-[#26262a] border border-[#26262a] hover:border-[#f2b544]/50 transition-all shadow-sm whitespace-nowrap"
            >
              <Zap className="w-3 h-3 text-[#f2b544] flex-shrink-0" />
              <span className="hidden sm:inline">Deploy</span>
            </button>
          </div>

        </div>

      </div>

      {/* Responsive Navigation Track - SHOWN ON SCREENS < 1280px (Laptops, Tablets, Mobile) */}
      <div className="xl:hidden border-t border-[#26262a]/60 bg-[#0e0e10]/95 px-3 py-2">
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar justify-start sm:justify-center">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const activeClass = tab.customActiveBg 
              ? `${tab.customActiveBg} text-[#141008] font-bold ${tab.glow}`
              : `bg-[#f2b544] text-[#141008] font-bold ${tab.glow}`;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap ${
                  isActive
                    ? activeClass
                    : 'text-[#8d8c86] hover:text-[#ecebe6] bg-[#131315] hover:bg-[#26262a]/50 border border-[#26262a]/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                    isActive ? 'bg-[#141008]/20 text-[#141008] border-transparent' : tab.badgeColor
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
