import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';
import N8nJsonModal from './N8nJsonModal';
import N8nVisualCanvas from './N8nVisualCanvas';
import { 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Database, 
  Sparkles, 
  Search, 
  GitBranch, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Activity, 
  AlertTriangle,
  Scale,
  FileCode,
  Terminal,
  ShieldAlert,
  Star,
  MapPin,
  TrendingUp,
  Tag,
  Award,
  Download,
  Briefcase,
  Copy,
  Check,
  Flame
} from 'lucide-react';
import { 
  N8N_WORKFLOW_NODES, 
  RECENT_CATALOG_AUDIT_LOGS, 
  SEARCH_LINKED_NPR_DATA, 
  MERCHANT_COMPLIANCE_WATCHLIST,
  BANGALORE_METRO_CORRIDORS
} from '../data/n8nWorkflowData';
import audioService from '../utils/audioService';

const getItemEmoji = (name) => {
  if (name.includes('Wing') || name.includes('Chicken') || name.includes('Tikka')) return '🍗';
  if (name.includes('Water') || name.includes('Kinley')) return '💧';
  if (name.includes('Beer') || name.includes('Wit')) return '🍺';
  if (name.includes('LIIT') || name.includes('Cocktail') || name.includes('Negroni')) return '🍸';
  if (name.includes('Chocolate') || name.includes('Sundae') || name.includes('Dessert')) return '🍨';
  if (name.includes('Pizza')) return '🍕';
  if (name.includes('Lobster')) return '🦞';
  if (name.includes('Biryani')) return '🍛';
  return '🍽️';
};

const getRestaurantAvatar = (restaurant) => {
  if (restaurant.includes('Toit')) return { emoji: '🍺', color: '#f2b544' };
  if (restaurant.includes('Social')) return { emoji: '🍸', color: '#38bdf8' };
  if (restaurant.includes('Punjab')) return { emoji: '👑', color: '#f59e0b' };
  if (restaurant.includes('Corner')) return { emoji: '🍨', color: '#ec4899' };
  return { emoji: '🏛️', color: '#8d8c86' };
};

export default function WorkflowStudioView({ bills }) {
  const [isRunningCron, setIsRunningCron] = useState(false);
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog', 'compliance', 'rdp', 'npr'
  const [logs, setLogs] = useState(RECENT_CATALOG_AUDIT_LOGS);
  const [complianceList, setComplianceList] = useState(MERCHANT_COMPLIANCE_WATCHLIST);
  const [confidenceFilter, setConfidenceFilter] = useState('ALL');
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [selectedMerchantDossier, setSelectedMerchantDossier] = useState(null);
  const [queuedBdIds, setQueuedBdIds] = useState([]);

  // Ticket #C2-5: Bangalore Food Hub Geographic Cluster NPR Heatmap & BD Outreach States
  const [selectedCorridorKey, setSelectedCorridorKey] = useState('ALL');
  const [isBdPackModalOpen, setIsBdPackModalOpen] = useState(false);
  const [dispatchedMerchantIds, setDispatchedMerchantIds] = useState([]);
  const [copiedOutreachMemo, setCopiedOutreachMemo] = useState(false);
  
  // Ticket #4: Nightly Cron Streaming Execution Terminal & Export States
  const [cronProgress, setCronProgress] = useState(100);
  const [cronStatus, setCronStatus] = useState('completed'); // 'idle' | 'running' | 'completed'
  const [activeCronSteps, setActiveCronSteps] = useState([1, 2, 3, 4, 5, 6]);
  const [exportFeedback, setExportFeedback] = useState(null);

  const CRON_STREAM_STEPS = [
    {
      step: 1,
      timestamp: "02:00:01 AM",
      stage: "INGEST",
      color: "#38bdf8",
      message: "Polled 14,820 guest check dockets across 32 metro clusters",
      metric: "14,820 dockets"
    },
    {
      step: 2,
      timestamp: "02:00:02 AM",
      stage: "VISION_OCR",
      color: "#f59e0b",
      message: "Claude 3.5 Sonnet batch reconciliation completed (avg 18ms/slip)",
      metric: "18ms/slip avg"
    },
    {
      step: 3,
      timestamp: "02:00:03 AM",
      stage: "STATUTORY",
      color: "#ef4444",
      message: "Flagged 312 CCPA service charge breaches (auto-refund queued)",
      metric: "312 breaches isolated"
    },
    {
      step: 4,
      timestamp: "02:00:04 AM",
      stage: "DRIFT_CALC",
      color: "#f59e0b",
      message: "Identified 47 menu price drifts with confidence >= 95%",
      metric: "47 drifts flagged"
    },
    {
      step: 5,
      timestamp: "02:00:05 AM",
      stage: "POSTGRES_COMMIT",
      color: "#10b981",
      message: "Committed 47 price updates to master_catalog.json",
      metric: "47 catalog SQL commits"
    },
    {
      step: 6,
      timestamp: "02:00:06 AM",
      stage: "FLYWHEEL_DONE",
      color: "#8b5cf6",
      message: "Batch cycle finished. Redis cache invalidated in 24ms",
      metric: "24ms cache invalidation"
    }
  ];

  // Data Export Handlers
  const downloadFile = (filename, content, mimeType = 'text/csv;charset=utf-8;') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportDiscrepancies = () => {
    const headers = "ID,Restaurant,Dissected Item,Old Catalog Price,New Receipt Price,Variance,Confidence Score,Action,Violation Type,Timestamp\n";
    const rows = logs.map(l => 
      `"${l.id}","${l.restaurant}","${l.item}",${l.oldCatalogPrice},${l.newReceiptPrice},"${l.variance}",${l.confidenceScore},"${l.action}","${l.violationType}","${l.timestamp}"`
    ).join("\n");
    downloadFile("catalog_discrepancies.csv", headers + rows);
    setExportFeedback("discrepancies");
    setTimeout(() => setExportFeedback(null), 2500);
  };

  const handleExportCompliance = () => {
    const headers = "ID,Restaurant,Strikes,Violations,Penalty Applied,Last Notice Date\n";
    const rows = complianceList.map(c => 
      `"${c.id}","${c.restaurant}",${c.strikes},"${(c.violations || '').replace(/"/g, '""')}","${c.penaltyApplied}","${c.lastNoticeDate}"`
    ).join("\n");
    downloadFile("merchant_compliance_watchlist.csv", headers + rows);
    setExportFeedback("compliance");
    setTimeout(() => setExportFeedback(null), 2500);
  };

  const handleExportTelemetry = () => {
    const telemetryData = {
      exportedAt: new Date().toISOString(),
      cronSchedule: "0 2 * * * (02:00 AM IST)",
      activeCoverage: "32 Metro Clusters (BLR, DEL, BOM, HYD, MAA, PNQ, CCU, etc.)",
      lastBatchRun: {
        timestamp: "02:00:06 AM IST",
        docketsIngested: 14820,
        avgOcrLatencyMs: 18,
        ccpaBreachesFlagged: 312,
        priceDriftsCommitted: 47,
        redisCacheInvalidationMs: 24
      },
      catalogDriftLogs: logs,
      merchantComplianceWatchlist: complianceList
    };
    downloadFile("dineout_sentinel_telemetry.json", JSON.stringify(telemetryData, null, 2), "application/json");
    setExportFeedback("telemetry");
    setTimeout(() => setExportFeedback(null), 2500);
  };

  // Ticket #C2-5: BD Campaign Helpers & Handlers
  const currentCorridor = BANGALORE_METRO_CORRIDORS[selectedCorridorKey] || BANGALORE_METRO_CORRIDORS.ALL;

  const handleSelectCorridor = (key) => {
    audioService.playTap();
    setSelectedCorridorKey(key);
  };

  const handleToggleDispatchMerchant = (merchantId) => {
    audioService.playSuccessChime();
    setDispatchedMerchantIds(prev => 
      prev.includes(merchantId) ? prev.filter(id => id !== merchantId) : [...prev, merchantId]
    );
  };

  const handleCopyOutreachMemo = () => {
    const memo = `=====================================================
SWIGGY DINEOUT BD PARTNER OUTREACH PACK
ZONE: ${currentCorridor.label.toUpperCase()} (${currentCorridor.tag})
=====================================================
METRICS:
- Total Null/Abandoned Search Queries: ${currentCorridor.nullSearches}
- Estimated Monthly GMV Recovery: ${currentCorridor.estimatedGmvRecovery}
- Active Geo Hotspots: ${currentCorridor.activeHotspots}

SUPPLY DEFICIT DISHES TO ONBOARD:
${currentCorridor.supplyDeficitDishes.map((d, i) => `  ${i + 1}. ${d}`).join('\n')}

TARGET MERCHANT ACTION LIST:
${currentCorridor.topMerchants.map(m => `
• ${m.name} [${m.cluster}]
  - Contact BD Lead: ${m.contact}
  - Recommended Additions: ${m.dishes.join(', ')}
  - Projected Monthly Lift: ${m.projectedLift}
`).join('')}

Generated by Swiggy Dineout Sentinel AI · Autonomous Demand Corroboration Engine`;

    navigator.clipboard?.writeText(memo);
    audioService.playSuccessChime();
    setCopiedOutreachMemo(true);
    setTimeout(() => setCopiedOutreachMemo(false), 2500);
  };

  const handleExportBdCampaign = () => {
    const headers = "Merchant Name,Cluster,Dishes Recommended,Projected GMV Lift,BD Contact,Status\n";
    const rows = currentCorridor.topMerchants.map(m => 
      `"${m.name}","${m.cluster}","${m.dishes.join('; ')}","${m.projectedLift}","${m.contact}","${dispatchedMerchantIds.includes(m.id) ? 'DISPATCHED' : 'PENDING'}"`
    ).join("\n");
    downloadFile(`bd_outreach_pack_${currentCorridor.id.toLowerCase()}.csv`, headers + rows);
    audioService.playTap();
  };

  const handleRunBatchCron = async () => {
    setIsRunningCron(true);
    setCronStatus('running');
    setCronProgress(10);
    setActiveCronSteps([1]);
    setActiveNodeIndex(0);

    // Call real backend cron API if running
    let backendResult = null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cron/trigger`, { method: 'POST' });
      if (res.ok) {
        backendResult = await res.json();
      }
    } catch (e) {
      // Graceful fallback for static deployment
    }

    const stepInterval = 550;
    N8N_WORKFLOW_NODES.forEach((_, idx) => {
      setTimeout(() => {
        setActiveNodeIndex(idx);
      }, (idx + 1) * stepInterval);
    });

    // Stream 6 batch cron log steps
    CRON_STREAM_STEPS.forEach((stepItem, idx) => {
      setTimeout(() => {
        setActiveCronSteps(prev => [...new Set([...prev, stepItem.step])]);
        setCronProgress(Math.round(((idx + 1) / CRON_STREAM_STEPS.length) * 100));
      }, (idx + 1) * stepInterval);
    });

    setTimeout(() => {
      setIsRunningCron(false);
      setCronStatus('completed');
      setActiveNodeIndex(-1);
      const newLog = backendResult?.details ? {
        id: `log-${Date.now()}`,
        restaurant: backendResult.details.restaurant,
        item: backendResult.details.item,
        oldCatalogPrice: backendResult.details.old_price,
        newReceiptPrice: backendResult.details.new_price,
        variance: backendResult.details.variance,
        confidenceScore: backendResult.details.confidence,
        action: "AUTO_UPDATED",
        violationType: "Catalog Price Drift (Live DB Commit)",
        timestamp: "Just now (Backend Sync)",
        triggeredBy: "Scheduled Cron Daemon #8824"
      } : {
        id: `log-${Date.now()}`,
        restaurant: "Church Street Social",
        item: "Kinley Packaged Water (1L)",
        oldCatalogPrice: 20,
        newReceiptPrice: 90,
        variance: "+350% above MRP",
        confidenceScore: 0.99,
        action: "MRP_ROLLBACK",
        violationType: "Legal Metrology Overcharge",
        timestamp: "Just now",
        triggeredBy: "Nightly Cron #8824"
      };
      setLogs(prev => [newLog, ...prev]);
    }, (CRON_STREAM_STEPS.length + 1) * stepInterval);
  };

  const filteredLogs = logs.filter(log => {
    if (confidenceFilter === 'AUTO') return log.action === 'AUTO_UPDATED' || log.action === 'MRP_ROLLBACK' || log.action === 'TAX_CORRECTED';
    if (confidenceFilter === 'MANUAL') return log.action === 'FLAGGED_DISPUTE' || log.action === 'QUEUED_FOR_OPS_REVIEW';
    return true;
  });

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-8">

      {/* Header & Eyebrow */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#26262a]">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-[#8d8c86]">
            <Activity className="w-3.5 h-3.5 text-[#7fc79a]" />
            <span>PRODUCTION AUTOMATION PIPELINE · CRON & N8N WORKFLOWS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#ecebe6] tracking-tight leading-tight">
            Autonomous catalog hygiene & <em className="italic text-[#f2b544]">compliance engine</em>.
          </h1>
          <p className="text-sm text-[#8d8c86] max-w-2xl mt-1.5 leading-relaxed">
            Scheduled crons & visual n8n pipelines auto-reconciling menu drift, enforcing partner MRP compliance, and enriching RDPs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsJsonModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-full font-mono text-xs font-semibold bg-[#131315] hover:bg-[#26262a] text-[#ecebe6] border border-[#26262a] transition-all shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5 text-[#f2b544]" />
            <span>Inspect n8n JSON</span>
          </button>

          <button
            onClick={handleRunBatchCron}
            disabled={isRunningCron}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs font-semibold transition-all ${
              isRunningCron
                ? 'bg-[#26262a] text-[#8d8c86] cursor-wait'
                : 'bg-[#f2b544] text-[#141008] hover:bg-[#f2b544]/90 shadow-lampGlow active:scale-95'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isRunningCron ? 'animate-spin' : ''}`} />
            <span>{isRunningCron ? 'Executing Batch Cron (02:00 AM)...' : '▶ Trigger Nightly 02:00 AM Cron'}</span>
          </button>
        </div>
      </div>

      {/* Visual n8n Production Workflow Directly Shown */}
      <N8nVisualCanvas onTriggerRun={handleRunBatchCron} />

      {/* Ticket #4: Streaming Batch Execution Terminal + Data Export Console */}
      <div className="bg-[#0e0e10] border border-[#26262a] rounded-2xl p-5 shadow-dossier space-y-4 font-mono text-xs">
        {/* Terminal Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#26262a]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-zinc-400 font-mono text-[11px] ml-1">
              CRON-DAEMON://scheduler/0200-am-batch.cron
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
              isRunningCron ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40 animate-pulse' :
              'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isRunningCron ? 'STREAMING EXECUTION' : 'BATCH CRON STANDBY (02:00 AM)'}
            </span>
          </div>

          {/* Controls: Trigger Cron + Data Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportDiscrepancies}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131315] hover:bg-[#26262a] text-[#ecebe6] border border-[#26262a] transition-all text-[11px] font-mono shadow-sm"
              title="Export Catalog Price Discrepancies to CSV"
            >
              <Download className="w-3 h-3 text-[#f2b544]" />
              <span>{exportFeedback === 'discrepancies' ? '✓ Downloaded CSV' : 'Export Discrepancies (CSV)'}</span>
            </button>

            <button
              onClick={handleExportCompliance}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131315] hover:bg-[#26262a] text-[#ecebe6] border border-[#26262a] transition-all text-[11px] font-mono shadow-sm"
              title="Export Partner Watchlist to CSV"
            >
              <Download className="w-3 h-3 text-[#e5533d]" />
              <span>{exportFeedback === 'compliance' ? '✓ Downloaded CSV' : 'Export Compliance Watchlist (CSV)'}</span>
            </button>

            <button
              onClick={handleExportTelemetry}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131315] hover:bg-[#26262a] text-[#ecebe6] border border-[#26262a] transition-all text-[11px] font-mono shadow-sm"
              title="Export Full Audit Telemetry to JSON"
            >
              <Download className="w-3 h-3 text-[#7fc79a]" />
              <span>{exportFeedback === 'telemetry' ? '✓ Downloaded JSON' : 'Export Full Telemetry (JSON)'}</span>
            </button>

            <button
              onClick={handleRunBatchCron}
              disabled={isRunningCron}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold transition-all ${
                isRunningCron
                  ? 'bg-[#26262a] text-[#8d8c86] cursor-wait'
                  : 'bg-[#f2b544] text-[#141008] hover:bg-[#f2b544]/90 shadow-sm'
              }`}
            >
              <Play className={`w-3 h-3 ${isRunningCron ? 'animate-spin' : ''}`} />
              <span>{isRunningCron ? 'Streaming...' : '▶ Trigger 02:00 AM Cron Now'}</span>
            </button>
          </div>
        </div>

        {/* Live Progress Bar (0% -> 100%) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#7fc79a]" />
              <span>Batch Execution Progress:</span>
              <strong className="text-zinc-200">{activeCronSteps.length} of 6 stages completed</strong>
            </span>
            <span className="text-[#f2b544] font-bold">{cronProgress}%</span>
          </div>
          <div className="w-full h-2 bg-[#131315] rounded-full overflow-hidden border border-[#26262a]">
            <div 
              className="h-full bg-gradient-to-r from-[#f2b544] via-[#7fc79a] to-[#38bdf8] transition-all duration-300 rounded-full"
              style={{ width: `${cronProgress}%` }}
            />
          </div>
        </div>

        {/* 6 Streaming Batch Log Steps */}
        <div className="p-3.5 bg-[#08080a] rounded-xl border border-white/5 space-y-2 font-mono text-[11px]">
          {CRON_STREAM_STEPS.map((step) => {
            const isEmitted = activeCronSteps.includes(step.step);
            const isCurrentActive = isRunningCron && activeCronSteps[activeCronSteps.length - 1] === step.step;

            return (
              <div
                key={step.step}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg transition-all ${
                  isCurrentActive
                    ? 'bg-[#18181c] border border-amber-400/40 text-zinc-100 shadow-sm'
                    : isEmitted
                    ? 'bg-[#101013]/70 text-zinc-300'
                    : 'opacity-30 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-zinc-500 font-bold">[{step.timestamp}]</span>
                  <span 
                    className="px-2 py-0.5 rounded text-[9px] font-bold border"
                    style={{ 
                      backgroundColor: `${step.color}15`, 
                      borderColor: `${step.color}35`, 
                      color: step.color 
                    }}
                  >
                    {step.stage}
                  </span>
                  <span className={isCurrentActive ? 'text-amber-300 font-semibold' : ''}>
                    {step.message}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                  <span className="text-[10px] text-zinc-400">{step.metric}</span>
                  {isEmitted ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold border border-emerald-500/40">
                      ✓
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center text-[10px]">
                      ○
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs for Catalog Logs, Merchant Compliance, RDP Enrichment & NPR Mining */}
      <div className="p-6 rounded-2xl bg-[#131315] border border-[#26262a] shadow-dossier space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#26262a]">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0e0e10] p-1 rounded-full border border-[#26262a]">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                activeTab === 'catalog'
                  ? 'bg-[#f2b544] text-[#141008] font-semibold shadow-lampGlow'
                  : 'text-[#8d8c86] hover:text-[#ecebe6]'
              }`}
            >
              1. Catalog Drift Moderator
            </button>

            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                activeTab === 'compliance'
                  ? 'bg-[#f2b544] text-[#141008] font-semibold shadow-lampGlow'
                  : 'text-[#8d8c86] hover:text-[#ecebe6]'
              }`}
            >
              2. Partner Compliance & Strikes
            </button>

            <button
              onClick={() => setActiveTab('rdp')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                activeTab === 'rdp'
                  ? 'bg-[#f2b544] text-[#141008] font-semibold shadow-lampGlow'
                  : 'text-[#8d8c86] hover:text-[#ecebe6]'
              }`}
            >
              3. Web RDP Enrichment
            </button>

            <button
              onClick={() => setActiveTab('npr')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                activeTab === 'npr'
                  ? 'bg-[#f2b544] text-[#141008] font-semibold shadow-lampGlow'
                  : 'text-[#8d8c86] hover:text-[#ecebe6]'
              }`}
            >
              4. Search-linked NPR Mining
            </button>
          </div>

          {activeTab === 'catalog' && (
            <div className="flex items-center gap-1 bg-[#0e0e10] p-1 rounded-full border border-[#26262a] text-[11px] font-mono">
              <span className="text-[#8d8c86] px-2">Filter:</span>
              <button
                onClick={() => setConfidenceFilter('ALL')}
                className={`px-2.5 py-0.5 rounded-full ${confidenceFilter === 'ALL' ? 'bg-[#26262a] text-[#ecebe6]' : 'text-[#8d8c86]'}`}
              >
                All
              </button>
              <button
                onClick={() => setConfidenceFilter('AUTO')}
                className={`px-2.5 py-0.5 rounded-full ${confidenceFilter === 'AUTO' ? 'bg-[#7fc79a]/20 text-[#7fc79a]' : 'text-[#8d8c86]'}`}
              >
                Auto-Resolved
              </button>
              <button
                onClick={() => setConfidenceFilter('MANUAL')}
                className={`px-2.5 py-0.5 rounded-full ${confidenceFilter === 'MANUAL' ? 'bg-[#e5533d]/20 text-[#e5533d]' : 'text-[#8d8c86]'}`}
              >
                Ops Review Queue
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Catalog Drift Logs Table with Visual Food Emojis & Venue Badges */}
        {activeTab === 'catalog' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#26262a] text-[#8d8c86] text-[11px]">
                  <th className="pb-3 font-medium uppercase tracking-wider">RESTAURANT & DOCKET</th>
                  <th className="pb-3 font-medium uppercase tracking-wider">DISSECTED ITEM</th>
                  <th className="pb-3 font-medium uppercase tracking-wider">CATALOG vs RECEIPT</th>
                  <th className="pb-3 font-medium uppercase tracking-wider">VARIANCE</th>
                  <th className="pb-3 font-medium uppercase tracking-wider">CONFIDENCE</th>
                  <th className="pb-3 font-medium uppercase tracking-wider text-right">ACTION TAKEN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26262a]">
                {filteredLogs.map(log => {
                  const avatar = getRestaurantAvatar(log.restaurant);
                  const itemEmoji = getItemEmoji(log.item);

                  return (
                    <tr key={log.id} className="hover:bg-[#1a1a1e]/50 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border flex-shrink-0"
                            style={{ backgroundColor: `${avatar.color}15`, borderColor: `${avatar.color}35` }}
                          >
                            {avatar.emoji}
                          </div>
                          <div>
                            <div className="font-serif text-sm text-[#ecebe6]">{log.restaurant}</div>
                            <div className="text-[10px] text-[#8d8c86]">{log.triggeredBy} • {log.timestamp}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-[#ecebe6] font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{itemEmoji}</span>
                          <span>{log.item}</span>
                        </div>
                        <div className="text-[10px] text-[#f2b544] ml-5">{log.violationType}</div>
                      </td>
                      <td className="py-3.5 text-[#8d8c86]">
                        <span className="line-through">₹{log.oldCatalogPrice}</span>
                        <span className="text-[#ecebe6] font-bold ml-2">→ ₹{log.newReceiptPrice}</span>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[#f2b544] font-bold px-2 py-0.5 rounded bg-[#f2b544]/10 border border-[#f2b544]/20 inline-block">
                          {log.variance}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1.5 bg-[#26262a] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${log.confidenceScore >= 0.95 ? 'bg-[#7fc79a]' : 'bg-[#e5533d]'}`} 
                              style={{ width: `${log.confidenceScore * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-[#8d8c86]">{(log.confidenceScore * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        {log.action === 'AUTO_UPDATED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7fc79a]/15 text-[#7fc79a] border border-[#7fc79a]/30 inline-flex items-center gap-1">
                            <span>✓</span>
                            <span>AUTO-UPDATED</span>
                          </span>
                        )}
                        {log.action === 'MRP_ROLLBACK' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7fc79a]/15 text-[#7fc79a] border border-[#7fc79a]/30 inline-flex items-center gap-1">
                            <span>🔄</span>
                            <span>MRP ROLLBACK</span>
                          </span>
                        )}
                        {log.action === 'TAX_CORRECTED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 inline-flex items-center gap-1">
                            <span>⚖️</span>
                            <span>TAX CORRECTED</span>
                          </span>
                        )}
                        {log.action === 'DUAL_PASS_RECONCILED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f2b544]/15 text-[#f2b544] border border-[#f2b544]/30 inline-flex items-center gap-1">
                            <span>✨</span>
                            <span>MATH RECONCILED</span>
                          </span>
                        )}
                        {log.action === 'FLAGGED_DISPUTE' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e5533d]/15 text-[#e5533d] border border-[#e5533d]/30 inline-flex items-center gap-1">
                            <span>⚠️</span>
                            <span>DISPUTE FLAGGED</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Partner Compliance Watchlist & Strikes */}
        {activeTab === 'compliance' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#131315] border border-[#26262a] rounded-xl text-xs font-mono text-[#8d8c86] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#e5533d]" />
                <span>
                  <strong className="text-[#ecebe6]">Partner Compliance & 3-Strikes Engine:</strong> Automatically tracks repeated customer billing disputes. Restaurants forcing illegal service charges face search throttling.
                </span>
              </span>
              <span className="text-[#e5533d] font-bold">3 Venues on Active Watchlist</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {complianceList.map(comp => {
                const avatar = getRestaurantAvatar(comp.restaurant);
                return (
                  <div key={comp.id} className="bg-[#0e0e10] p-5 rounded-2xl border border-[#26262a] space-y-3 font-mono shadow-dossier hover:border-[#f2b544]/40 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border flex-shrink-0"
                          style={{ backgroundColor: `${avatar.color}15`, borderColor: `${avatar.color}35` }}
                        >
                          {avatar.emoji}
                        </div>
                        <div>
                          <h4 className="font-serif text-lg text-[#ecebe6] leading-tight">{comp.restaurant}</h4>
                          <div className="text-[10px] text-[#8d8c86] mt-0.5">Last notice: {comp.lastNoticeDate}</div>
                        </div>
                      </div>

                      {/* Visual Penalty Strike Cards */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map(strikeNo => {
                          const isStruck = strikeNo <= comp.strikes;
                          const isSuspension = strikeNo === 3 && isStruck;
                          return (
                            <div 
                              key={strikeNo} 
                              className={`w-6 h-8 rounded flex items-center justify-center font-bold text-[10px] shadow-sm transition-all ${
                                isSuspension ? 'bg-[#e5533d] text-white animate-pulse' :
                                isStruck ? 'bg-[#f2b544] text-[#141008]' :
                                'bg-[#26262a] text-[#8d8c86]/40'
                              }`}
                              title={`Strike ${strikeNo}: ${isStruck ? 'Active Penalty' : 'Clear'}`}
                            >
                              {isStruck ? '⚠' : strikeNo}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-xs text-[#8d8c86] bg-[#131315] p-3 rounded-xl border border-[#26262a]">
                      <div className="text-[10px] font-bold text-[#ecebe6] uppercase mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-[#f2b544]" />
                        <span>Violations Recorded:</span>
                      </div>
                      <div className="text-[#ecebe6] text-[11px] leading-relaxed">{comp.violations}</div>
                    </div>

                    <div className="pt-2 border-t border-[#26262a] flex items-center justify-between text-xs">
                      <span className="text-[#f2b544] font-bold px-2 py-0.5 rounded bg-[#f2b544]/10 border border-[#f2b544]/20 text-[11px]">
                        {comp.penaltyApplied}
                      </span>
                      <button 
                        onClick={() => setSelectedMerchantDossier(comp)}
                        className="text-[11px] text-[#ecebe6] hover:text-[#f2b544] font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>View Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Web RDP Content Enrichment as Visual Restaurant Profile Cards */}
        {activeTab === 'rdp' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bills.map(bill => (
              <div key={bill.id} className="bg-[#0e0e10] rounded-2xl border border-[#26262a] overflow-hidden space-y-3 group hover:border-[#f2b544]/50 transition-all shadow-dossier flex flex-col justify-between">
                <div>
                  {/* Cover Photo */}
                  <div className="relative h-36 w-full overflow-hidden">
                    <img src={bill.imageUrl} alt={bill.restaurantName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-transparent to-black/30" />
                    <div className="absolute top-2.5 left-2.5 bg-[#0b0b0c]/80 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-[#f2b544] border border-[#f2b544]/30 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-[#f2b544]" />
                      <span>{bill.rating}</span>
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-[#7fc79a]/20 backdrop-blur px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-[#7fc79a] border border-[#7fc79a]/40">
                      RDP SYNCED
                    </div>
                    <div className="absolute bottom-2 left-3 text-white">
                      <h4 className="font-serif text-base font-bold flex items-center gap-1.5 leading-snug">
                        <span>{bill.cuisineEmoji}</span>
                        <span>{bill.restaurantName}</span>
                      </h4>
                      <div className="text-[10px] font-mono text-[#ecebe6]/80 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{bill.locality.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 pt-1 space-y-2.5">
                    {/* Dineout Verified Deal Tag */}
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#f2b544]/10 border border-[#f2b544]/20 text-[#f2b544] text-[10px] font-mono">
                      <Tag className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate font-semibold">{bill.dineoutOffer}</span>
                    </div>

                    {/* Synthesized Review Highlights */}
                    <div className="space-y-1.5">
                      <div className="text-[9px] font-mono text-[#8d8c86] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#f2b544]" />
                        <span>Autonomous Highlights:</span>
                      </div>
                      {bill.rdpEnrichment.generatedHighlights.slice(0, 2).map((hl, i) => (
                        <div key={i} className="text-[11px] text-[#ecebe6] flex items-start gap-1.5 bg-[#131315] p-2 rounded-lg border border-[#26262a]/60 font-mono">
                          <span className="text-[#f2b544] text-xs">✦</span>
                          <span className="leading-snug">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dietary Tags & Pricing */}
                <div className="p-3.5 pt-0">
                  <div className="pt-2 border-t border-[#26262a] flex items-center justify-between text-xs font-mono">
                    <div className="flex gap-1">
                      {bill.rdpEnrichment.dietaryTags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-[#18181b] text-[#8d8c86] border border-[#26262a]">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-[#ecebe6] font-bold text-[10px]">
                      {bill.rdpEnrichment.suggestedCostForTwo.split(' ')[0]} for 2
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Search-linked NPR Mining & Bangalore Food Hub Cluster Heatmap */}
        {activeTab === 'npr' && (
          <div className="space-y-6">
            {/* Context & Subtab Header */}
            <div className="p-4 bg-[#131315] border border-[#26262a] rounded-2xl text-xs font-mono text-[#8d8c86] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#f2b544]/15 border border-[#f2b544]/30 flex items-center justify-center text-[#f2b544]">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[#ecebe6] font-bold text-sm font-sans flex items-center gap-2">
                    <span>Bangalore Food Hub Geographic Cluster NPR Heatmap</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7fc79a]/15 text-[#7fc79a] border border-[#7fc79a]/30 font-mono">
                      LIVE RADAR
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8d8c86] mt-0.5">
                    Correlates abandoned/null search queries with scanned guest checks to unearth unlisted trending demand and dispatch merchant menu expansion packs.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    audioService.playTap();
                    setIsBdPackModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f2b544] hover:bg-[#f2b544]/90 text-[#141008] font-bold text-xs shadow-lampGlow transition-all active:scale-95"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Generate BD Merchant Outreach Pack</span>
                </button>
              </div>
            </div>

            {/* Metro Corridor Selector Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#8d8c86]">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-bold">
                  <MapPin className="w-3.5 h-3.5 text-[#f2b544]" />
                  <span>Select Metro Corridor Cluster:</span>
                </span>
                <span className="text-[11px] text-[#ecebe6] font-mono">
                  Active Corridor: <strong className="text-[#f2b544]">{currentCorridor.label}</strong>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {Object.values(BANGALORE_METRO_CORRIDORS).map((corridor) => {
                  const isSelected = selectedCorridorKey === corridor.id;
                  return (
                    <button
                      key={corridor.id}
                      onClick={() => handleSelectCorridor(corridor.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all border ${
                        isSelected
                          ? 'bg-[#f2b544] text-[#141008] border-[#f2b544] font-bold shadow-lampGlow scale-[1.02]'
                          : 'bg-[#0e0e10] text-[#8d8c86] hover:text-[#ecebe6] border-[#26262a] hover:border-[#8d8c86]/40'
                      }`}
                    >
                      <span>{corridor.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isSelected ? 'bg-black/20 text-[#141008]' : 'bg-[#18181b] text-[#8d8c86]'
                      }`}>
                        {corridor.nullSearches.split(',')[0]}k+ nulls
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone Demand Metrics Summary Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
              {/* Metric 1: Total Null Searches */}
              <div className="bg-[#0e0e10] p-4 rounded-xl border border-[#26262a] space-y-1 relative overflow-hidden">
                <div className="text-[10px] uppercase text-[#8d8c86] flex items-center justify-between">
                  <span>Total Null Searches</span>
                  <Search className="w-3.5 h-3.5 text-[#e5533d]" />
                </div>
                <div className="text-2xl font-bold text-[#ecebe6] tracking-tight">
                  {currentCorridor.nullSearches}
                </div>
                <div className="text-[10px] text-[#8d8c86] truncate">
                  Unfulfilled diner intents / mo
                </div>
              </div>

              {/* Metric 2: Estimated GMV Recovery */}
              <div className="bg-[#0e0e10] p-4 rounded-xl border border-[#26262a] space-y-1 relative overflow-hidden">
                <div className="text-[10px] uppercase text-[#8d8c86] flex items-center justify-between">
                  <span>Est. Monthly GMV Recovery</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#7fc79a]" />
                </div>
                <div className="text-2xl font-bold text-[#7fc79a] tracking-tight">
                  {currentCorridor.estimatedGmvRecovery}
                </div>
                <div className="text-[10px] text-[#8d8c86] truncate">
                  via 32% search-to-table recovery
                </div>
              </div>

              {/* Metric 3: Merchant Outreach Density */}
              <div className="bg-[#0e0e10] p-4 rounded-xl border border-[#26262a] space-y-1 relative overflow-hidden">
                <div className="text-[10px] uppercase text-[#8d8c86] flex items-center justify-between">
                  <span>Target Merchant Outlets</span>
                  <Briefcase className="w-3.5 h-3.5 text-[#f2b544]" />
                </div>
                <div className="text-2xl font-bold text-[#f2b544] tracking-tight">
                  {currentCorridor.merchantTargetsCount} Outlets
                </div>
                <div className="text-[10px] text-[#8d8c86] truncate">
                  {currentCorridor.activeHotspots}
                </div>
              </div>

              {/* Metric 4: Supply Deficit Dishes High-Level */}
              <div className="bg-[#0e0e10] p-4 rounded-xl border border-[#26262a] space-y-1.5">
                <div className="text-[10px] uppercase text-[#8d8c86] flex items-center justify-between">
                  <span>Top Supply Deficits</span>
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentCorridor.supplyDeficitDishes.slice(0, 3).map((dish, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-[#18181b] text-[#ecebe6] border border-[#26262a] truncate max-w-[120px]">
                      {dish}
                    </span>
                  ))}
                  {currentCorridor.supplyDeficitDishes.length > 3 && (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-[#18181b] text-[#f2b544] border border-[#26262a]">
                      +{currentCorridor.supplyDeficitDishes.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* NPR Cards for the Selected Corridor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentCorridor.nprCards.map(npr => (
                <div key={npr.id} className="bg-[#0e0e10] p-5 rounded-2xl border border-[#26262a] space-y-3 font-mono shadow-dossier hover:border-[#f2b544]/40 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#e5533d]/15 border border-[#e5533d]/30 flex items-center justify-center text-[#e5533d] flex-shrink-0">
                          <Search className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[10px] text-[#8d8c86] flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-[#f2b544]" />
                            <span>{npr.location}</span>
                          </div>
                          <h4 className="font-serif text-lg text-[#ecebe6] mt-0.5 font-bold">"{npr.query}"</h4>
                        </div>
                      </div>
                      <span className="text-[10px] bg-[#e5533d]/15 text-[#e5533d] px-2 py-0.5 rounded-full border border-[#e5533d]/30 font-bold flex items-center gap-1 flex-shrink-0">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>{npr.abandonedCount} Nulls</span>
                      </span>
                    </div>

                    <div className="text-xs text-[#8d8c86] bg-[#131315] p-3 rounded-xl border border-[#26262a] space-y-1">
                      <div className="font-semibold text-[#f2b544] text-[10px] uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Receipt Corroboration:</span>
                      </div>
                      <div className="text-[#ecebe6] text-[11px] leading-relaxed">{npr.matchedSupply}</div>
                    </div>

                    <div className="text-xs text-[#8d8c86] bg-[#08080a] p-2.5 rounded-xl border border-white/5 space-y-1">
                      <div className="font-semibold text-zinc-400 text-[10px] uppercase">Sentinel Recommendation:</div>
                      <div className="text-zinc-300 text-[11px]">{npr.recommendation}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#26262a] flex items-center justify-between text-xs">
                    <span className="text-[#7fc79a] font-bold flex items-center gap-1 text-[11px]">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{npr.impact}</span>
                    </span>
                    <button 
                      onClick={() => {
                        audioService.playTap();
                        setQueuedBdIds(prev => prev.includes(npr.id) ? prev.filter(id => id !== npr.id) : [...prev, npr.id]);
                      }}
                      className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition-all shadow-sm ${
                        queuedBdIds.includes(npr.id)
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-[#f2b544]/15 hover:bg-[#f2b544]/25 text-[#f2b544] border-[#f2b544]/30'
                      }`}
                    >
                      {queuedBdIds.includes(npr.id) ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>BD Task Queued</span>
                        </>
                      ) : (
                        <>
                          <span>Prioritize BD</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* n8n JSON Export Modal */}
      <N8nJsonModal 
        isOpen={isJsonModalOpen} 
        onClose={() => setIsJsonModalOpen(false)} 
      />

      {/* Partner Compliance Dossier Modal */}
      {selectedMerchantDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in font-mono text-xs">
          <div className="bg-[#131315] border border-[#26262a] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#26262a]">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-[#e5533d]" />
                <h3 className="font-serif text-xl text-[#ecebe6]">Merchant Compliance Docket</h3>
              </div>
              <button onClick={() => setSelectedMerchantDossier(null)} className="text-[#8d8c86] hover:text-[#ecebe6]">
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0e0e10] border border-[#26262a]">
              <div>
                <div className="font-serif text-lg text-[#ecebe6] font-bold">{selectedMerchantDossier.restaurant}</div>
                <div className="text-[10px] text-[#8d8c86]">Last Notice: {selectedMerchantDossier.lastNoticeDate}</div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map(strikeNo => {
                  const isStruck = strikeNo <= selectedMerchantDossier.strikes;
                  return (
                    <div 
                      key={strikeNo} 
                      className={`w-7 h-9 rounded flex items-center justify-center font-bold text-xs ${
                        isStruck ? 'bg-[#e5533d] text-white animate-pulse' : 'bg-[#26262a] text-[#8d8c86]/40'
                      }`}
                    >
                      {isStruck ? '⚠' : strikeNo}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e0e10] border border-[#26262a] space-y-2">
              <div className="text-[10px] uppercase font-bold text-[#f2b544]">Active Enforcement Penalty:</div>
              <div className="text-sm font-bold text-[#ecebe6]">{selectedMerchantDossier.penaltyApplied}</div>
              <p className="text-[11px] text-[#8d8c86] leading-relaxed">
                Triggered under Swiggy Dineout Merchant Governance SLA Clause 14.3. Continuous repeat offenses escalate to 14-day booking suspension.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e0e10] border border-[#26262a] space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-[#8d8c86]">Customer Reports on File:</div>
              <div className="text-xs text-[#ecebe6] font-sans">{selectedMerchantDossier.violations}</div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setSelectedMerchantDossier(null)}
                className="flex-1 py-2.5 rounded-full font-mono text-xs font-semibold text-[#141008] bg-[#f2b544] hover:bg-[#f2b544]/90 transition-colors"
              >
                Issue Formal Notice & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BD Merchant Outreach Pack Modal (Ticket #C2-5) */}
      {isBdPackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in font-mono text-xs">
          <div className="bg-[#131315] border border-[#26262a] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#26262a]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#f2b544]/15 border border-[#f2b544]/30 flex items-center justify-center text-[#f2b544]">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#ecebe6]">Bangalore Food Hub — BD Merchant Outreach Pack</h3>
                  <div className="text-[10px] text-[#8d8c86]">Corridor: {currentCorridor.label} ({currentCorridor.tag})</div>
                </div>
              </div>
              <button 
                onClick={() => setIsBdPackModalOpen(false)} 
                className="text-[#8d8c86] hover:text-[#ecebe6] text-sm p-1 rounded-lg hover:bg-[#26262a]"
              >
                ✕
              </button>
            </div>

            {/* Corridor Metrics Summary */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0e0e10] border border-[#26262a]">
              <div>
                <div className="text-[10px] uppercase text-[#8d8c86]">Corridor Demand</div>
                <div className="text-base font-bold text-[#ecebe6] mt-0.5">{currentCorridor.nullSearches} Nulls</div>
                <div className="text-[10px] text-[#8d8c86]">Monthly Abandoned</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-[#8d8c86]">Target GMV Recovery</div>
                <div className="text-base font-bold text-[#7fc79a] mt-0.5">{currentCorridor.estimatedGmvRecovery}</div>
                <div className="text-[10px] text-[#8d8c86]">32% Recovery Conv.</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-[#8d8c86]">Partner Candidates</div>
                <div className="text-base font-bold text-[#f2b544] mt-0.5">{currentCorridor.topMerchants.length} Outlets</div>
                <div className="text-[10px] text-[#8d8c86]">Verified via Scans</div>
              </div>
            </div>

            {/* Recommended Deficit Dishes to Pitch */}
            <div className="p-3.5 rounded-xl bg-[#0e0e10] border border-[#26262a] space-y-2">
              <div className="text-[10px] uppercase font-bold text-[#f2b544] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Supply Deficit Menu Items to Onboard:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentCorridor.supplyDeficitDishes.map((dish, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-[#18181b] border border-[#26262a] text-[#ecebe6] text-[11px] flex items-center gap-1">
                    <span className="text-[#f2b544]">✦</span>
                    <span>{dish}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Merchant Target Action List */}
            <div className="space-y-2.5">
              <div className="text-[10px] uppercase font-bold text-[#8d8c86] flex items-center justify-between">
                <span>Priority Merchant Outreach Target List ({currentCorridor.topMerchants.length} Venues)</span>
                <span className="text-[#f2b544]">Click to Dispatch BD Action</span>
              </div>

              <div className="space-y-2">
                {currentCorridor.topMerchants.map(merchant => {
                  const isDispatched = dispatchedMerchantIds.includes(merchant.id);

                  return (
                    <div 
                      key={merchant.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDispatched 
                          ? 'bg-[#101914] border-emerald-500/40' 
                          : 'bg-[#0e0e10] border-[#26262a] hover:border-[#8d8c86]/40'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-sm font-bold text-[#ecebe6]">{merchant.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#18181b] text-[#8d8c86] border border-[#26262a]">
                              {merchant.cluster}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#8d8c86] flex items-center gap-1">
                            <span className="text-[#f2b544]">Menu Additions:</span>
                            <span className="text-zinc-300 font-semibold">{merchant.dishes.join(', ')}</span>
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            BD Lead Contact: <span className="text-zinc-400">{merchant.contact}</span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                          <span className="text-[#7fc79a] font-bold text-xs">
                            {merchant.projectedLift}
                          </span>
                          <button
                            onClick={() => handleToggleDispatchMerchant(merchant.id)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm ${
                              isDispatched
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-[#f2b544] hover:bg-[#f2b544]/90 text-[#141008]'
                            }`}
                          >
                            {isDispatched ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>✓ Dispatched to Field BD</span>
                              </>
                            ) : (
                              <>
                                <Briefcase className="w-3 h-3" />
                                <span>Dispatch to Field BD</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#26262a] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyOutreachMemo}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#131315] hover:bg-[#26262a] text-[#ecebe6] border border-[#26262a] text-[11px] font-mono transition-all shadow-sm"
                >
                  {copiedOutreachMemo ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">✓ Copied Outreach Brief!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#f2b544]" />
                      <span>Copy Outreach Brief (Memo)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleExportBdCampaign}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#131315] hover:bg-[#26262a] text-[#ecebe6] border border-[#26262a] text-[11px] font-mono transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#7fc79a]" />
                  <span>Export Campaign (CSV)</span>
                </button>
              </div>

              <button
                onClick={() => setIsBdPackModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#26262a] hover:bg-[#323236] text-[#ecebe6] text-[11px] font-semibold transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
