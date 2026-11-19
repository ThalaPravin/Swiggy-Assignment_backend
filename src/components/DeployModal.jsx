import React from 'react';
import { X, ExternalLink, Zap, Check, Copy } from 'lucide-react';

export default function DeployModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#131315] border border-[#26262a] rounded-2xl max-w-xl w-full p-6 shadow-dossier relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8d8c86] hover:text-[#ecebe6] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#26262a]">
          <div className="w-10 h-10 rounded-full bg-[#f2b544]/15 text-[#f2b544] flex items-center justify-center border border-[#f2b544]/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#ecebe6]">
              Deploy Prototype to Public URL (60 Seconds)
            </h3>
            <p className="text-xs text-[#8d8c86] font-mono mt-0.5">
              Acquire a live hosted URL to attach directly inside the Swiggy Google Form.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs font-mono">
          {/* Method 1: Netlify Drop */}
          <div className="p-4 rounded-xl bg-[#0e0e10] border border-[#26262a] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif text-base text-[#ecebe6] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#f2b544] text-[#141008] font-mono font-bold flex items-center justify-center text-xs">1</span>
                Option A: Drag-and-Drop (Netlify Drop)
              </span>
              <span className="text-[10px] bg-[#7fc79a]/15 text-[#7fc79a] font-bold px-2 py-0.5 rounded border border-[#7fc79a]/30">
                Recommended
              </span>
            </div>
            <p className="text-[#8d8c86]">
              Your production build is pre-compiled in <code className="text-[#ecebe6] bg-[#131315] px-1.5 py-0.5 rounded">dist/</code>.
            </p>
            <div className="p-2.5 rounded-lg bg-[#131315] border border-[#26262a] text-[#ecebe6] flex items-center justify-between">
              <span>Drag `dist` folder to:</span>
              <a 
                href="https://app.netlify.com/drop" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#f2b544] underline inline-flex items-center gap-1 font-bold"
              >
                app.netlify.com/drop <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Method 2: Vercel CLI */}
          <div className="p-4 rounded-xl bg-[#0e0e10] border border-[#26262a] space-y-2">
            <span className="font-serif text-base text-[#ecebe6] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#26262a] text-[#8d8c86] font-mono font-bold flex items-center justify-center text-xs">2</span>
              Option B: Instant CLI Deployment (Vercel)
            </span>
            <p className="text-[#8d8c86]">
              Execute inside PowerShell terminal:
            </p>
            <div className="p-2.5 rounded-lg bg-[#131315] border border-[#26262a] text-[#f2b544] flex items-center justify-between">
              <code>npx vercel</code>
              <span className="text-[#8d8c86] text-[10px]">Instant 30s deploy</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-full font-mono text-xs font-semibold text-[#141008] bg-[#f2b544] hover:bg-[#f2b544]/90 transition-colors shadow-lampGlow"
        >
          Understood & Ready
        </button>
      </div>
    </div>
  );
}
