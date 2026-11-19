import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Workflow, 
  ShieldCheck, 
  Users, 
  Store, 
  Database, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Scale, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Zap,
  Tag,
  Percent,
  TrendingUp,
  FileText,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Terminal
} from 'lucide-react';

export default function ArchitectureDiagramsView() {
  const [activeDiagram, setActiveDiagram] = useState('stakeholders'); // 'stakeholders', 'multimodal', 'legal'
  const [selectedStakeholder, setSelectedStakeholder] = useState('diner');
  const [selectedPipelineStage, setSelectedPipelineStage] = useState(1);
  const [copiedSpec, setCopiedSpec] = useState(false);

  // Ticket #5: Live Bill Flow Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [liveLatencyMs, setLiveLatencyMs] = useState(250);

  const STAGE_LATENCIES = {
    1: 250,
    2: 1350,
    3: 1385,
    4: 1785,
    5: 1785
  };

  const STAGE_PAYLOADS = {
    1: {
      packet_id: "PKT-BLR-8849-INGEST",
      source: "DINEOUT_CAMERA_VIEWFINDER",
      resolution: "3024x4032 (300 DPI)",
      thermal_detected: true,
      perspective_skew: "-1.4° normalized",
      target_slip: "Toit Brewpub (Docket #TOIT-BLR-8849)",
      status: "TENSOR_PREPARED"
    },
    2: {
      packet_id: "PKT-BLR-8849-OCR",
      engine: "Claude 3.5 Sonnet Vision",
      bounding_boxes_mapped: 6,
      dual_pass_subtotal_parity: "VERIFIED (100% match against ₹2,330)",
      drift_flagged: "BBQ Smoked Wings: Paper ₹440 vs DB ₹390 (+12.8%)",
      statutory_flag: "10% Discretionary Fee (₹233.00) detected",
      status: "PARSED_JSON_DOCKET"
    },
    3: {
      packet_id: "PKT-BLR-8849-STATUTORY",
      ruleset: "CCPA Advisory Guidelines 2022 + CGST Section 15",
      service_fee_quarantined: "₹233.00 (1-tap voluntary strike armed)",
      alcohol_vat_isolated: "18% VAT preserved; zero discount bleed",
      tax_cascading_delta: "0.00 (Food GST only)",
      audited_net_subtotal: "₹2,330.00",
      status: "STATUTORILY_SHIELDED"
    },
    4: {
      packet_id: "PKT-BLR-8849-SETTLEMENT",
      route: "Dineout Pay 1-Click FastPath",
      voucher_applied: "20% Dineout Food Savings (-₹296.00)",
      fairsplit_mode: "Zero-Subsidy Alcohol Decoupled",
      upi_deep_link: "upi://pay?pa=swiggy.dineout@icici&am=2261.00",
      settlement_result: "INSTANT_MERCHANT_ACK_EMITTED",
      status: "CLEAN_SETTLEMENT"
    },
    5: {
      packet_id: "PKT-BLR-8849-FLYWHEEL",
      daemon: "node-cron Scheduled Flywheel (02:00 AM IST)",
      clusters_polled: "32 Metro Clusters (14,820 dockets)",
      confidence_threshold: ">= 95% (BBQ Wings conf: 0.98)",
      db_action: "AUTO_COMMITTED TO master_catalog.json",
      redis_cache: "Purged in 24ms across 1,200 edge nodes",
      status: "PARITY_RESTORED"
    }
  };

  useEffect(() => {
    let timer = null;
    if (isSimulating) {
      timer = setInterval(() => {
        setSelectedPipelineStage(prev => {
          if (prev >= 5) {
            setIsSimulating(false);
            setLiveLatencyMs(STAGE_LATENCIES[5]);
            return 5;
          }
          const next = prev + 1;
          setLiveLatencyMs(STAGE_LATENCIES[next]);
          return next;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  const handleStepPrev = () => {
    setSelectedPipelineStage(prev => {
      const next = Math.max(1, prev - 1);
      setLiveLatencyMs(STAGE_LATENCIES[next]);
      return next;
    });
  };

  const handleStepNext = () => {
    setSelectedPipelineStage(prev => {
      const next = Math.min(5, prev + 1);
      setLiveLatencyMs(STAGE_LATENCIES[next]);
      return next;
    });
  };

  const handleResetFlow = () => {
    setIsSimulating(false);
    setSelectedPipelineStage(1);
    setLiveLatencyMs(STAGE_LATENCIES[1]);
  };

  const STAKEHOLDERS = [
    {
      id: 'diner',
      name: '1. The Diner',
      role: 'Consumer / Seated Guest',
      icon: Users,
      color: '#f59e0b',
      painPoint: 'Forced 10% service charges, ₹90 water markups, and veg friends subsidizing craft beer or meat.',
      solution: '1-Tap statutory rollbacks, zero awkward cashier disputes, and proportional FairSplit UPI settlement.',
      metricGain: '₹300 – ₹650 saved per table check · 30-second checkout speed',
      governingLaw: 'CCPA 2022 Guidelines & Legal Metrology Act',
      flowStep: 'Captures receipt via Dineout ➔ Reviews verified strikethroughs ➔ Settles with 1-click Dineout Pay'
    },
    {
      id: 'merchant',
      name: '2. The Restaurant Partner',
      role: 'Floor Manager / Cashier Counter',
      icon: Store,
      color: '#38bdf8',
      painPoint: 'Protracted table disputes over bills during peak hours, slow cash counter queues, and diner friction.',
      solution: 'Automated statutory compliance, instant digital settlement, and transparent 3-Strikes policy.',
      metricGain: '3.8× faster table turn-around times · Zero verbal confrontation with waitstaff',
      governingLaw: 'Swiggy Dineout Partner Service Level Agreement (SLA)',
      flowStep: 'Issues printed guest check ➔ AI automatically resolves disputes ➔ Instant payment receipt at POS'
    },
    {
      id: 'swiggy',
      name: '3. Swiggy Dineout Platform',
      role: 'Product / Catalog Flywheel',
      icon: Database,
      color: '#10b981',
      painPoint: 'Offline restaurant menus drifting +12-25% from app listings, missing POIs, and stale catalog listings.',
      solution: 'Scanned diner bills act as continuous ground-truth data, powering the 02:00 AM Cron Flywheel to auto-commit prices.',
      metricGain: '98.5% Price Parity Index · 14.8k daily receipt inputs · Recovers lost search GMV',
      governingLaw: 'Autonomous Catalog Parity Protocol',
      flowStep: 'Ingests bill scans ➔ Reconciles menu drift ➔ Auto-updates PostgreSQL master ➔ Mines search NPR'
    },
    {
      id: 'regulator',
      name: '4. Regulators & Compliance',
      role: 'CCPA & Legal Metrology & Tax',
      icon: Scale,
      color: '#ec4899',
      painPoint: 'Unlawful service fees forced as mandatory tipping, dual-MRP water gouging, and tax cascading.',
      solution: 'Pre-payment legal shielding: strips discretionary fees, enforces ₹20 MRP cap, and isolates 5% GST to food only.',
      metricGain: '100% Statutory Compliance · Prevents consumer court complaints',
      governingLaw: 'CCPA 2022 Guidelines · Legal Metrology Rules 2017 · Section 15 CGST Act',
      flowStep: 'Audits line items against statutory rules ➔ Enforces compliant receipt generation before settlement'
    }
  ];

  const PIPELINE_STAGES = [
    {
      step: 1,
      name: 'Thermal Ingestion',
      subtitle: 'Camera Viewfinder / Webhook',
      agent: 'Mobile Client (Vite)',
      latency: '250ms',
      icon: Zap,
      color: '#38bdf8',
      desc: 'Diner snaps a photo of their crumpled or printed thermal check at the table. Optical bounding box and perspective skew correction normalize the slip.',
      input: 'Raw thermal paper check photo (JPEG / PNG)',
      output: 'Normalized grayscale scan tensor with detected text regions'
    },
    {
      step: 2,
      name: 'Tri-Agent Audit Council',
      subtitle: 'Claude 3.5 Sonnet + Vision',
      agent: 'Agent 01 (OCR) + Agent 02 (Rate) + Agent 03 (Legal)',
      latency: '1,100ms',
      icon: Cpu,
      color: '#f59e0b',
      desc: 'Multimodal vision model parses itemized names, quantities, and rates. Reconciles degraded or low-ink thermal prints via dual-pass arithmetic checks against printed subtotal.',
      input: 'Normalized scan tensor + Swiggy Dineout venue catalog rules',
      output: 'Dissected JSON docket: Line items, tax buckets, service charge, and detected statutory breaches'
    },
    {
      step: 3,
      name: 'Statutory Decoupling',
      subtitle: 'CCPA & Metrology Engines',
      agent: 'Statutory Rules Arbiter',
      latency: '35ms',
      icon: ShieldCheck,
      color: '#10b981',
      desc: 'Executes legal checks: (1) Decouples discretionary 10% service charge under CCPA 2022, (2) Caps packaged water at printed MRP ₹20, (3) Eliminates cascading GST on service fees.',
      input: 'Raw line items + printed discretionary fees',
      output: 'Verified net payable amount with 1-tap rollback toggles and strike-through items'
    },
    {
      step: 4,
      name: 'Dineout Pay Settlement',
      subtitle: '1-Click Pay & FairSplit UPI',
      agent: 'Payment Gateway & UPI Dispatcher',
      latency: '400ms',
      icon: Users,
      color: '#8b5cf6',
      desc: 'Applies verified Dineout offer (e.g. 20% off food). Generates dynamic UPI QR codes and splits bills proportionally so non-drinkers never pay for alcohol.',
      input: 'Audited net payable figure (e.g. ₹2,261.00) + guest split preferences',
      output: 'Instant settlement receipt + diner wallet savings confirmation'
    },
    {
      step: 5,
      name: 'Nightly 02:00 AM Cron',
      subtitle: 'Autonomous Catalog Flywheel',
      agent: 'node-cron + n8n Pipeline Daemon',
      latency: 'Batch (02:00 AM)',
      icon: Database,
      color: '#ec4899',
      desc: 'Ingests accumulated daily bill scans across 32 cities. When price drift confidence exceeds 95% (e.g. BBQ Wings ₹390 ➔ ₹440), it auto-commits updates to master_catalog.json without manual ops intervention.',
      input: 'Accumulated check dockets with detected drift deltas',
      output: 'Live PostgreSQL master catalog updated + partner strike watchlist adjusted'
    }
  ];

  const handleCopySpec = () => {
    const spec = `Swiggy Dineout Sentinel AI — System Architecture Specification
1. Stakeholder Value Loop:
   - Diners: 1-Tap CCPA rollbacks, zero awkward cashier disputes, and proportional FairSplit UPI settlement.
   - Merchants: 3.8x faster table turnover, automated statutory compliance, and transparent 3-Strikes policy.
   - Swiggy Platform: 02:00 AM Cron Flywheel continuously audits and updates master catalog from real scanned checks.
   - Regulators: Pre-payment enforcement of CCPA 2022, Legal Metrology Act 2017, and Section 15 CGST Act.
2. Multimodal Data Pipeline:
   Thermal Ingestion (250ms) -> Tri-Agent Audit Council (1,100ms) -> Statutory Decoupling (35ms) -> Dineout Pay Settlement (400ms) -> Nightly Cron Flywheel (02:00 AM Batch).`;
    navigator.clipboard.writeText(spec);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>INTERACTIVE SYSTEM ARCHITECTURE & VALUE DIAGRAMS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#ecebe6] tracking-tight leading-tight">
            System Architecture & <em className="italic text-[#f2b544] font-serif">Stakeholder Engine</em>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Interactive visual schematics explaining the closed-loop data architecture, multi-stakeholder value loops, and statutory decision frameworks.
          </p>
        </div>

        <button
          onClick={handleCopySpec}
          className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-all flex items-center gap-2 shadow-sm self-start md:self-auto"
        >
          {copiedSpec ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
          <span>{copiedSpec ? 'Architecture Copied' : 'Copy Architecture Spec'}</span>
        </button>
      </div>

      {/* Diagram Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveDiagram('stakeholders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all flex-shrink-0 ${
            activeDiagram === 'stakeholders'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-white/5'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>1. Stakeholder Value Loop (4 Roles)</span>
        </button>

        <button
          onClick={() => setActiveDiagram('multimodal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all flex-shrink-0 ${
            activeDiagram === 'multimodal'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-white/5'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>2. End-to-End Multimodal Pipeline</span>
        </button>

        <button
          onClick={() => setActiveDiagram('legal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all flex-shrink-0 ${
            activeDiagram === 'legal'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-white/5'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>3. Statutory Decoupling Logic Tree</span>
        </button>
      </div>

      {/* DIAGRAM 1: STAKEHOLDER VALUE LOOP */}
      {activeDiagram === 'stakeholders' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Visual Interactive Loop Diagram */}
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  INTERACTIVE STAKEHOLDER VALUE MATRIX
                </span>
                <h3 className="text-xl font-bold text-zinc-100 mt-0.5">
                  Click any stakeholder to inspect their pain points, solutions & metric gains
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
                4-Party Equilibrium
              </span>
            </div>

            {/* 4 Interactive Stakeholder Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STAKEHOLDERS.map(stakeholder => {
                const isSelected = selectedStakeholder === stakeholder.id;
                const IconComp = stakeholder.icon;

                return (
                  <button
                    key={stakeholder.id}
                    onClick={() => setSelectedStakeholder(stakeholder.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'bg-zinc-800 border-amber-400 ring-1 ring-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.02]'
                        : 'bg-zinc-950/70 border-white/10 hover:border-white/20 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110"
                        style={{ 
                          backgroundColor: `${stakeholder.color}20`, 
                          borderColor: `${stakeholder.color}40`,
                          color: stakeholder.color 
                        }}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span 
                        className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase"
                        style={{ backgroundColor: `${stakeholder.color}15`, color: stakeholder.color }}
                      >
                        {isSelected ? 'Active Focus' : 'Select'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-zinc-100">
                      {stakeholder.name}
                    </h4>
                    <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                      {stakeholder.role}
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-zinc-300 font-mono">
                      <span className="text-emerald-400 font-bold block">{stakeholder.metricGain.split('·')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Stakeholder Deep-Dive Drawer */}
            {(() => {
              const current = STAKEHOLDERS.find(s => s.id === selectedStakeholder) || STAKEHOLDERS[0];
              const CurrentIcon = current.icon;
              return (
                <div className="mt-6 p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{ backgroundColor: `${current.color}20`, borderColor: current.color, color: current.color }}
                      >
                        <CurrentIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-zinc-100">{current.name} — Detailed Impact Analysis</h4>
                        <div className="text-xs font-mono text-zinc-400">Governed by: <strong className="text-amber-400">{current.governingLaw}</strong></div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto">
                      ✓ {current.metricGain}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 space-y-1.5">
                      <div className="text-[10px] text-rose-400 uppercase font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Core Problem Faced:</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed font-sans">{current.painPoint}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 space-y-1.5">
                      <div className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>How Sentinel AI Solves It:</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed font-sans">{current.solution}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 space-y-1.5">
                      <div className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
                        <Workflow className="w-3.5 h-3.5" />
                        <span>Closed-Loop Flow:</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed font-sans">{current.flowStep}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

        </div>
      )}

      {/* DIAGRAM 2: MULTIMODAL DATA PIPELINE */}
      {activeDiagram === 'multimodal' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  5-STAGE MULTIMODAL EXECUTION PIPELINE
                </span>
                <h3 className="text-xl font-bold text-zinc-100 mt-0.5">
                  From Physical Paper Thermal Print to Autonomous Catalog Sync
                </h3>
              </div>
              
              {/* Live Latency & Execution Summary Badge */}
              <div className="flex items-center gap-3">
                <div className="bg-zinc-950 border border-white/10 px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-zinc-400">Pipeline Latency:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">
                    {liveLatencyMs}ms <span className="text-zinc-500 font-normal">/ 1,785ms</span>
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {selectedPipelineStage === 5 ? 'Flywheel Synced' : `Stage ${selectedPipelineStage} Active`}
                </span>
              </div>
            </div>

            {/* Ticket #5: Interactive Pipeline Simulation Controls Bar */}
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all shadow-md ${
                    isSimulating
                      ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                      : 'bg-amber-400 hover:bg-amber-300 text-zinc-950'
                  }`}
                >
                  {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isSimulating ? 'Pause Flow' : '▶ Simulate Live Bill Flow'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleStepPrev}
                  disabled={selectedPipelineStage <= 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl font-mono text-xs bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 border border-white/10 transition-all"
                  title="Previous Stage"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <button
                  type="button"
                  onClick={handleStepNext}
                  disabled={selectedPipelineStage >= 5}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl font-mono text-xs bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 border border-white/10 transition-all"
                  title="Next Stage"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleResetFlow}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl font-mono text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-white/10 transition-all"
                  title="Reset to Stage 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Glowing Packet Transit Tracker */}
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                <span className="text-[11px]">Active Packet:</span>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-amber-400/40 text-amber-300 font-bold">
                  <span className="animate-bounce">🧾</span>
                  <span>PKT-BLR-8849</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
                </div>
              </div>
            </div>

            {/* Stepper Pipeline Bar with Active Stage Packet Animation */}
            <div className="relative">
              {/* Progress Connector Track */}
              <div className="hidden md:block absolute top-7 left-12 right-12 h-0.5 bg-zinc-800 z-0">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400 transition-all duration-500"
                  style={{ width: `${((selectedPipelineStage - 1) / 4) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
                {PIPELINE_STAGES.map(stage => {
                  const isSelected = selectedPipelineStage === stage.step;
                  const isPassed = stage.step < selectedPipelineStage;
                  const IconComponent = stage.icon;

                  return (
                    <button
                      key={stage.step}
                      type="button"
                      onClick={() => {
                        setSelectedPipelineStage(stage.step);
                        setLiveLatencyMs(STAGE_LATENCIES[stage.step]);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all font-mono text-xs relative ${
                        isSelected
                          ? 'bg-zinc-800 border-amber-400 shadow-xl ring-2 ring-amber-400/50 scale-[1.02]'
                          : isPassed
                          ? 'bg-zinc-950/90 border-emerald-500/40 hover:border-emerald-500'
                          : 'bg-zinc-950 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Active Packet Indicator Pill */}
                      {isSelected && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-zinc-950 text-[9px] font-black px-2 py-0.2 rounded-full shadow-lg flex items-center gap-1">
                          <span>🧾 PACKET HERE</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-2">
                        <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                          isSelected
                            ? 'bg-amber-400 text-zinc-950 ring-2 ring-amber-400/50'
                            : isPassed
                            ? 'bg-emerald-500 text-zinc-950'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {isPassed ? '✓' : stage.step}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-bold">{stage.latency}</span>
                      </div>

                      <div className="font-bold text-zinc-200 text-xs truncate">
                        {stage.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {stage.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Payload Stream Inspector for Current Stage */}
            <div className="rounded-2xl bg-zinc-950 border border-white/10 p-4 font-mono space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-zinc-300 font-bold">
                    Stage {selectedPipelineStage} Live Stream Payload:
                  </span>
                  <span className="text-zinc-500 text-[10px]">
                    PIPELINE://stage-{selectedPipelineStage}/packet.json
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  HTTP/2 TENSOR STREAM (LIVE)
                </span>
              </div>

              <pre className="p-3 bg-[#08080a] rounded-xl border border-white/5 text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
                {JSON.stringify(STAGE_PAYLOADS[selectedPipelineStage], null, 2)}
              </pre>
            </div>

            {/* Selected Stage Deep-Dive */}
            {(() => {
              const current = PIPELINE_STAGES.find(s => s.step === selectedPipelineStage) || PIPELINE_STAGES[0];
              const IconComp = current.icon;
              return (
                <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{ backgroundColor: `${current.color}20`, borderColor: current.color, color: current.color }}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-zinc-100">Stage {current.step}: {current.name}</h4>
                        <div className="text-xs font-mono text-zinc-400">Responsible Agent: <strong className="text-amber-400">{current.agent}</strong> • Latency: <strong className="text-emerald-400">{current.latency}</strong></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    {current.desc}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono pt-2">
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
                      <span className="text-[10px] text-amber-400 uppercase font-bold">Input Contract:</span>
                      <div className="text-zinc-300 bg-zinc-950 p-2.5 rounded-lg border border-white/5 text-[11px]">
                        {current.input}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold">Emitted Output:</span>
                      <div className="text-zinc-300 bg-zinc-950 p-2.5 rounded-lg border border-white/5 text-[11px]">
                        {current.output}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

        </div>
      )}

      {/* DIAGRAM 3: STATUTORY DECOUPLING LOGIC TREE */}
      {activeDiagram === 'legal' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  STATUTORY COMPLIANCE & CONSUMER LAW LOGIC TREE
                </span>
                <h3 className="text-xl font-bold text-zinc-100 mt-0.5">
                  How Sentinel AI Interrogates and Eliminates Dining Violations
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Indian Consumer Law Precedents
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Branch 1: Service Charge */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-zinc-200">1. Discretionary Fee Purge</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-zinc-400">
                  <div><strong>Trigger:</strong> Line item matches "Service Charge" or &gt;0% discretionary surcharge.</div>
                  <div><strong>Legal Mandate:</strong> CCPA 2022 Guidelines clearly state service charges cannot be forcibly levied as mandatory additions.</div>
                  <div className="p-2 bg-amber-400/10 border border-amber-400/20 text-amber-300 rounded font-semibold">
                    Action: Decouple from net payable. Diner toggles voluntary retention or 100% removal.
                  </div>
                </div>
              </div>

              {/* Branch 2: Dual MRP Water */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <Tag className="w-4 h-4 text-rose-400" />
                  <span className="font-bold text-zinc-200">2. Legal Metrology Water Cap</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-zinc-400">
                  <div><strong>Trigger:</strong> Packaged mineral water billed &gt; printed manufacturer MRP (e.g. ₹90 vs ₹20).</div>
                  <div><strong>Legal Mandate:</strong> Legal Metrology (Packaged Commodities) Rules 2017 prohibit dual MRP markups on identical packaged goods.</div>
                  <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded font-semibold">
                    Action: Quarantines mark-up surplus (+₹70) and rolls back rate strictly to ₹20.
                  </div>
                </div>
              </div>

              {/* Branch 3: Tax Cascading Fix */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <Percent className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-zinc-200">3. CGST Section 15 Fix</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-zinc-400">
                  <div><strong>Trigger:</strong> 5% GST is applied to (Subtotal + Service Charge), resulting in tax-on-tax surplus.</div>
                  <div><strong>Legal Mandate:</strong> CGST Act Section 15 requires GST to be levied strictly on the supply value of food & beverage services.</div>
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded font-semibold">
                    Action: Corrects tax base to pure food subtotal (₹1,855 ➔ ₹92.75 GST), purging ₹9.28 tax surplus.
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
