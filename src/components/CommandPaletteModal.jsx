import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Smartphone, 
  Workflow, 
  Layers, 
  CheckCircle2, 
  FileText, 
  Play, 
  Eye, 
  Users, 
  Volume2, 
  VolumeX, 
  Building2, 
  ArrowRight, 
  CornerDownLeft, 
  Zap, 
  UtensilsCrossed 
} from 'lucide-react';
import audioService from '../utils/audioService';

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectBill,
  onTriggerAction,
  bills = [],
  isMuted = false,
  billViewMode = 'digital'
}) {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Build command catalog
  const COMMANDS = [
    // 1. Navigation
    {
      id: 'nav-diner',
      category: 'Navigation',
      title: 'Jump to Interrogation (Bill Auditor)',
      subtitle: 'Real-time thermal checks, dual-way OCR, and CCPA strikethroughs',
      icon: Smartphone,
      shortcut: '1',
      action: () => { onNavigateTab('diner'); onClose(); }
    },
    {
      id: 'nav-workflow',
      category: 'Navigation',
      title: 'Jump to Catalog Ops (02:00 AM Cron)',
      subtitle: 'Autonomous PostgreSQL drift reconciliation & partner watchlist',
      icon: Workflow,
      shortcut: '2',
      action: () => { onNavigateTab('workflow'); onClose(); }
    },
    {
      id: 'nav-diagrams',
      category: 'Navigation',
      title: 'Jump to Architecture Diagrams',
      subtitle: 'Multimodal execution pipeline & stakeholder value loop',
      icon: Layers,
      shortcut: '3',
      action: () => { onNavigateTab('diagrams'); onClose(); }
    },
    {
      id: 'nav-tests',
      category: 'Navigation',
      title: 'Jump to Test Harness (10/10 PASS)',
      subtitle: 'Automated legal assertions, dual-pass math & tax tests',
      icon: CheckCircle2,
      shortcut: '4',
      action: () => { onNavigateTab('tests'); onClose(); }
    },
    {
      id: 'nav-pitch',
      category: 'Navigation',
      title: 'Jump to PM Executive Dossier',
      subtitle: 'Comprehensive product memo, unit economics & launch roadmap',
      icon: FileText,
      shortcut: '5',
      action: () => { onNavigateTab('pitch'); onClose(); }
    },

    // 2. Executive Actions
    {
      id: 'act-ocr',
      category: 'Actions',
      title: billViewMode === 'digital' ? 'Switch to Thermal Check (OCR Vision)' : 'Switch to Digital Guest Check',
      subtitle: 'Toggle between clean digital guest check and realistic thermal OCR slip',
      icon: Eye,
      shortcut: 'T',
      action: () => { onTriggerAction('toggle_ocr'); onClose(); }
    },
    {
      id: 'act-split',
      category: 'Actions',
      title: 'Launch FairSplit UPI Drawer',
      subtitle: 'Decouple craft beer charges for non-drinking diners',
      icon: Users,
      shortcut: 'S',
      action: () => { onTriggerAction('launch_fairsplit'); onClose(); }
    },
    {
      id: 'act-voucher',
      category: 'Actions',
      title: 'Download Corporate Expense Voucher',
      subtitle: 'Pre-audited tax invoice for SAP Concur / Zoho Expense',
      icon: Building2,
      shortcut: 'E',
      action: () => { onTriggerAction('download_voucher'); onClose(); }
    },
    {
      id: 'act-cron',
      category: 'Actions',
      title: 'Trigger Nightly 02:00 AM Batch Cron',
      subtitle: 'Poll 14,820 dockets and auto-commit drift updates to catalog',
      icon: Play,
      shortcut: 'C',
      action: () => { onTriggerAction('trigger_cron'); onClose(); }
    },
    {
      id: 'act-audio',
      category: 'Actions',
      title: isMuted ? 'Unmute Sound Effects Synthesizer' : 'Mute Sound Effects Synthesizer',
      subtitle: 'Native Web Audio API clicks, blips, alert dings, and success chimes',
      icon: isMuted ? VolumeX : Volume2,
      shortcut: 'M',
      action: () => { onTriggerAction('toggle_mute'); onClose(); }
    },

    // 3. Switch Bills
    ...(bills.map((bill, idx) => ({
      id: `bill-${bill.id}`,
      category: 'Sample Bills & Scenarios',
      title: `${bill.cuisineEmoji} ${bill.restaurantName}`,
      subtitle: `${bill.scenarioName} · ${bill.locality}`,
      icon: UtensilsCrossed,
      shortcut: `B${idx + 1}`,
      action: () => { 
        onSelectBill(bill.id); 
        onNavigateTab('diner'); 
        onClose(); 
      }
    })))
  ];

  // Filter commands
  const filteredCommands = COMMANDS.filter(cmd => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return cmd.title.toLowerCase().includes(q) || 
           cmd.subtitle.toLowerCase().includes(q) || 
           cmd.category.toLowerCase().includes(q);
  });

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        audioService.playTap();
        setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        audioService.playTap();
        setSelectedIndex(prev => (prev - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          audioService.playTap();
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono text-xs">
      <div 
        className="bg-zinc-950 border border-white/15 rounded-2xl max-w-xl w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-zinc-900/60">
          <Search className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Type a command or jump to case docket... (e.g. 'Toit', 'Cron', 'OCR')"
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-mono"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded border border-white/10">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-zinc-500">
              No matching commands or case dockets found for "{query}".
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = selectedIndex === idx;
              const IconComp = cmd.icon;

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    audioService.playTap();
                    cmd.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-amber-400 text-zinc-950 shadow-md' 
                      : 'text-zinc-300 hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-900 text-amber-400 border border-white/10'
                    }`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-xs truncate">
                        {cmd.title}
                      </div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-zinc-800' : 'text-zinc-500'}`}>
                        {cmd.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 pl-3">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                      isSelected ? 'bg-zinc-950/20 text-zinc-900' : 'bg-zinc-900 text-zinc-400 border border-white/10'
                    }`}>
                      {cmd.category}
                    </span>
                    {cmd.shortcut && (
                      <kbd className={`px-1.5 py-0.5 text-[9px] rounded font-bold ${
                        isSelected ? 'bg-zinc-950 text-amber-400' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-4 py-2 border-t border-white/10 bg-zinc-950 flex items-center justify-between text-[10px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1 py-0.2 bg-zinc-900 rounded border border-white/10 text-zinc-300">↑</kbd> <kbd className="px-1 py-0.2 bg-zinc-900 rounded border border-white/10 text-zinc-300">↓</kbd> to navigate</span>
            <span><kbd className="px-1 py-0.2 bg-zinc-900 rounded border border-white/10 text-zinc-300">↵</kbd> to select</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Zap className="w-3 h-3" />
            <span>Linear Spotlight Active</span>
          </div>
        </div>

      </div>
    </div>
  );
}
