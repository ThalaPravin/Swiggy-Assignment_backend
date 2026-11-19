import React, { useState, useEffect } from 'react';
import { Terminal, Play, Pause, RefreshCw, Cpu, Database, Zap, Shield, Check } from 'lucide-react';

const INITIAL_LOGS = [
  { id: 1, time: "02:00:01 IST", type: "CRON", text: "Cron daemon triggered: Swiggy_Dineout_Nightly_Batch_v2 across 32 cities." },
  { id: 2, time: "02:00:02 IST", type: "INGEST", text: "Ingested 14,820 table checks from Dineout Pay webhook buffer." },
  { id: 3, time: "02:00:04 IST", type: "LLM", text: "Claude 3.5 Sonnet Vision pass completed. Token count: 1,842 in / 412 out. Latency: 480ms." },
  { id: 4, time: "02:00:05 IST", type: "LEGAL", text: "CCPA Rule check: Flagged ₹233.00 discretionary fee on Docket #TOIT-BLR-8849. Decoupled." },
  { id: 5, time: "02:00:06 IST", type: "SQL", text: "UPDATE swiggy_dineout_master_catalog SET listed_price = 440 WHERE item_name = 'BBQ Smoked Chicken Wings'; (Rows: 1, 14ms)" },
  { id: 6, time: "02:00:07 IST", type: "COMPLIANCE", text: "Church Street Social strike count updated to 2. Search visibility throttled by -15%." },
  { id: 7, time: "02:00:08 IST", type: "NPR", text: "Correlated 1,420 abandoned searches for 'Kunafa' in Indiranagar. BD onboarding ticket queued." }
];

export default function LiveTerminal() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const liveEvents = [
        { type: "LLM", text: "Real-time receipt OCR pass: 4 items isolated, tax brackets separated cleanly (5% GST / 18% VAT)." },
        { type: "SQL", text: "SELECT item_name, listed_price FROM swiggy_dineout_master_catalog WHERE restaurant_id = 'DINEOUT_BLR_TOIT_101';" },
        { type: "LEGAL", text: "Legal Metrology check: Kinley Water rolled back from ₹90 to printed MRP ₹20." },
        { type: "AI", text: "Web RDP review synthesizer generated 3 bullet highlights for Church Street Social in 320ms." },
        { type: "CRON", text: "Heartbeat check: PostgreSQL connection pool healthy (8/10 active connections)." }
      ];

      const chosen = liveEvents[Math.floor(Math.random() * liveEvents.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} IST`;

      setLogs(prev => [
        { id: Date.now(), time: timeStr, type: chosen.type, text: chosen.text },
        ...prev.slice(0, 18)
      ]);
    }, 3800);

    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="p-5 rounded-2xl bg-[#0b0b0c] border border-[#26262a] shadow-dossier font-mono text-xs space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-[#26262a]">
        <div className="flex items-center gap-2 text-[#ecebe6]">
          <Terminal className="w-4 h-4 text-[#f2b544]" />
          <span className="font-bold">Live AI & PostgreSQL Telemetry Engine</span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#7fc79a]/10 text-[#7fc79a] text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7fc79a] animate-pulse" />
            {isStreaming ? 'STREAMING REAL-TIME' : 'PAUSED'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-[#131315] hover:bg-[#26262a] text-[#8d8c86] hover:text-[#ecebe6] border border-[#26262a]"
          >
            {isStreaming ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isStreaming ? 'Pause Stream' : 'Resume'}</span>
          </button>
        </div>
      </div>

      {/* Telemetry Stream Lines */}
      <div className="h-44 overflow-y-auto space-y-1.5 pr-2 select-text text-[11px] leading-relaxed">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 hover:bg-[#131315]/50 px-1 py-0.5 rounded">
            <span className="text-[#8d8c86] flex-shrink-0 text-[10px]">{log.time}</span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold flex-shrink-0 ${
              log.type === 'SQL' ? 'bg-blue-500/20 text-blue-300' :
              log.type === 'LLM' ? 'bg-[#f2b544]/20 text-[#f2b544]' :
              log.type === 'LEGAL' ? 'bg-[#e5533d]/20 text-[#e5533d]' :
              log.type === 'COMPLIANCE' ? 'bg-purple-500/20 text-purple-300' :
              'bg-[#7fc79a]/20 text-[#7fc79a]'
            }`}>
              {log.type}
            </span>
            <span className="text-[#ecebe6]/90 font-mono">
              {log.text}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Metrics */}
      <div className="pt-2 border-t border-[#26262a] flex flex-wrap items-center justify-between text-[10px] text-[#8d8c86]">
        <div className="flex items-center gap-4">
          <span>Engine: Claude 3.5 Sonnet + pgvector</span>
          <span>•</span>
          <span>Cron Uptime: 99.98%</span>
          <span>•</span>
          <span>Buffer: 14.8k receipts / day</span>
        </div>
        <div className="text-[#7fc79a] font-bold">
          Zero Data Leakage Guaranteed
        </div>
      </div>
    </div>
  );
}
