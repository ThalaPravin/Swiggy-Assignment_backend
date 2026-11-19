import React, { useState } from 'react';
import { X, ExternalLink, Zap, Check, Copy, Server, Globe, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';
import audioService from '../utils/audioService';

export default function DeployModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [copiedStep, setCopiedStep] = useState(null);

  const handleCopy = (text, stepKey) => {
    audioService.playTap();
    navigator.clipboard.writeText(text);
    setCopiedStep(stepKey);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#131315] border border-[#26262a] rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-dossier relative max-h-[90vh] overflow-y-auto font-mono">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8d8c86] hover:text-[#ecebe6] transition-colors p-1 rounded-lg hover:bg-[#1a1a1e]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#26262a]">
          <div className="w-10 h-10 rounded-full bg-[#f2b544]/15 text-[#f2b544] flex items-center justify-center border border-[#f2b544]/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-[#ecebe6]">
              Cloud Deployment Blueprint
            </h3>
            <p className="text-xs text-[#8d8c86] font-mono mt-0.5">
              Target Stack: <strong className="text-amber-400">Render</strong> (Express Backend API) + <strong className="text-sky-400">Vercel</strong> (Vite React Frontend)
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* STEP 0: Push to GitHub */}
          <div className="p-4 rounded-xl bg-[#0e0e10] border border-[#26262a] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif text-base text-[#ecebe6] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#f2b544] text-[#141008] font-mono font-bold flex items-center justify-center text-xs">1</span>
                <span>Push Local Git Repo to GitHub</span>
              </span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                Committed & Ready
              </span>
            </div>
            <p className="text-[#8d8c86] leading-relaxed">
              Create a new repository on <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-amber-400 underline">github.com/new</a> named <code className="text-[#ecebe6] bg-[#18181c] px-1.5 py-0.5 rounded">swiggy-dineout-sentinel</code>, then push:
            </p>
            <div className="p-2.5 rounded-lg bg-[#18181c] border border-white/5 flex items-center justify-between gap-2">
              <code className="text-[#ecebe6] text-[11px] overflow-x-auto">
                git remote add origin https://github.com/&lt;USERNAME&gt;/swiggy-dineout-sentinel.git && git push -u origin master
              </code>
              <button
                onClick={() => handleCopy('git remote add origin https://github.com/<USERNAME>/swiggy-dineout-sentinel.git\ngit push -u origin master', 'git')}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#26262a] hover:bg-[#333338] text-[10px] text-zinc-300 transition-colors flex-shrink-0"
              >
                {copiedStep === 'git' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedStep === 'git' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* STEP 1: Deploy Backend to Render */}
          <div className="p-4 rounded-xl bg-[#0e0e10] border border-[#26262a] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif text-base text-[#ecebe6] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#f2b544] text-[#141008] font-mono font-bold flex items-center justify-center text-xs">2</span>
                <Server className="w-4 h-4 text-amber-400" />
                <span>Deploy Backend to Render.com (Web Service)</span>
              </span>
              <a 
                href="https://dashboard.render.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] bg-amber-400/15 text-amber-400 px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1 hover:bg-amber-400/25"
              >
                <span>dashboard.render.com</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-[#141418] p-3 rounded-lg border border-white/5">
              <div><strong className="text-zinc-400">Runtime:</strong> <span className="text-emerald-400">Node</span></div>
              <div><strong className="text-zinc-400">Region:</strong> <span className="text-zinc-200">Singapore (ap-southeast-1)</span></div>
              <div><strong className="text-zinc-400">Build Command:</strong> <code className="text-cyan-300">npm install</code></div>
              <div><strong className="text-zinc-400">Start Command:</strong> <code className="text-cyan-300">node server/index.js</code></div>
              <div className="sm:col-span-2"><strong className="text-zinc-400">Health Check Path:</strong> <code className="text-purple-300">/api/health</code></div>
            </div>

            <p className="text-[11px] text-zinc-400">
              💡 <em>Repository includes a pre-configured <code className="text-zinc-300">render.yaml</code> blueprint. Render automatically detects and applies these settings.</em>
            </p>
          </div>

          {/* STEP 2: Deploy Frontend to Vercel */}
          <div className="p-4 rounded-xl bg-[#0e0e10] border border-[#26262a] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif text-base text-[#ecebe6] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#f2b544] text-[#141008] font-mono font-bold flex items-center justify-center text-xs">3</span>
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Deploy Frontend to Vercel</span>
              </span>
              <a 
                href="https://vercel.com/new" 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] bg-sky-400/15 text-sky-400 px-2 py-0.5 rounded border border-sky-400/30 flex items-center gap-1 hover:bg-sky-400/25"
              >
                <span>vercel.com/new</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <p className="text-[#8d8c86]">
              Deploy directly via Vercel CLI from PowerShell:
            </p>

            <div className="p-2.5 rounded-lg bg-[#18181c] border border-white/5 flex items-center justify-between gap-2">
              <code className="text-sky-300 text-[11px]">npx vercel --prod</code>
              <button
                onClick={() => handleCopy('npx vercel --prod', 'vercel-cli')}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#26262a] hover:bg-[#333338] text-[10px] text-zinc-300 transition-colors flex-shrink-0"
              >
                {copiedStep === 'vercel-cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedStep === 'vercel-cli' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#141418] border border-sky-500/20 text-[11px] space-y-1">
              <div className="text-sky-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Required Vercel Environment Variable:</span>
              </div>
              <div className="text-zinc-300 pt-1">
                Set <code className="text-amber-400 bg-black/40 px-1.5 py-0.5 rounded">VITE_API_URL</code> = <code className="text-emerald-400 bg-black/40 px-1.5 py-0.5 rounded">https://&lt;your-app&gt;.onrender.com</code>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full font-mono text-xs font-semibold text-[#141008] bg-[#f2b544] hover:bg-[#f2b544]/90 transition-colors shadow-lampGlow"
          >
            Got It — Let's Deploy!
          </button>
        </div>
      </div>
    </div>
  );
}
