import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  Webhook, 
  Code, 
  Cpu, 
  GitBranch, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Sliders, 
  Terminal, 
  ExternalLink,
  Zap,
  Maximize2,
  RefreshCw,
  Layers
} from 'lucide-react';

export const VISUAL_N8N_NODES = [
  {
    id: "node-cron",
    name: "Schedule: Nightly 02:00 AM",
    subtitle: "Cron: 0 2 * * *",
    type: "trigger",
    n8nType: "n8n-nodes-base.cron",
    icon: Clock,
    color: "#7fc79a",
    x: 20,
    y: 55,
    parameters: {
      triggerTimes: { item: [{ mode: "everyDay", hour: 2, minute: 0 }] }
    },
    inputSample: { trigger: "scheduled_cron", time: "02:00:00 IST" },
    outputSample: { event: "nightly_batch_started", batch_size: 14820, target_cities: 32 }
  },
  {
    id: "node-webhook",
    name: "Webhook: Check Ingestion",
    subtitle: "POST /dineout/receipt-webhook",
    type: "trigger",
    n8nType: "n8n-nodes-base.webhook",
    icon: Webhook,
    color: "#7fc79a",
    x: 20,
    y: 225,
    parameters: {
      httpMethod: "POST",
      path: "receipt-webhook",
      responseMode: "onReceived"
    },
    inputSample: { raw_image_payload: "base64://dGhlcm1hbF9yZWNlaXB0...", source: "Dineout Pay" },
    outputSample: { docket_id: "TOIT-BLR-8849", table_no: 14, venue: "Toit Brewpub" }
  },
  {
    id: "node-ocr",
    name: "Dual-Pass OCR & Math",
    subtitle: "Claude 3.5 Sonnet + Vision",
    type: "code",
    n8nType: "n8n-nodes-base.code",
    icon: Code,
    color: "#f2b544",
    x: 245,
    y: 140,
    parameters: {
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.1,
      mathReconciliation: true
    },
    inputSample: { raw_receipt_text: "Toit Tint-in-Wit Pitcher 850\nPepperoni Pizza 620\nBBQ Wings 440\nService Charge 233" },
    outputSample: {
      items_parsed: 4,
      subtotal: 2330.00,
      service_charge: 233.00,
      food_gst: 74.00,
      liquor_vat: 153.00,
      math_accuracy: "100%"
    }
  },
  {
    id: "node-ccpa",
    name: "CCPA Fee Decoupler",
    subtitle: "Strikes 10% Forced Fee",
    type: "if",
    n8nType: "n8n-nodes-base.if",
    icon: GitBranch,
    color: "#e5533d",
    x: 470,
    y: 140,
    parameters: {
      rule: "service_charge_present === true",
      statutoryLaw: "CCPA Advisory Guidelines 2022"
    },
    inputSample: { service_charge: 233.00, mandatory_enforced: true },
    outputSample: { decoupled_fee: 233.00, net_payable_adjusted: 2261.00, action: "PURGED_VOLUNTARY" }
  },
  {
    id: "node-moderator",
    name: "Catalog Moderator",
    subtitle: "Price Drift Delta Engine",
    type: "ai",
    n8nType: "n8n-nodes-base.postgres",
    icon: Database,
    color: "#3b82f6",
    x: 695,
    y: 140,
    parameters: {
      masterTable: "swiggy_dineout_master_catalog",
      driftThreshold: 0.05
    },
    inputSample: { scanned_wings_price: 440, db_wings_price: 390 },
    outputSample: { variance: "+12.8%", confidence: 0.98, requires_update: true }
  },
  {
    id: "node-commit",
    name: "Auto-Commit DB",
    subtitle: "Confidence >= 95%",
    type: "database",
    n8nType: "n8n-nodes-base.postgres",
    icon: Database,
    color: "#7fc79a",
    x: 920,
    y: 55,
    parameters: {
      operation: "UPDATE",
      table: "swiggy_dineout_master_catalog",
      columns: ["listed_price", "last_verified_at"]
    },
    inputSample: { item_name: "BBQ Smoked Chicken Wings", new_price: 440 },
    outputSample: { status: "SUCCESS", rows_affected: 1, live_rdp_synced: true }
  },
  {
    id: "node-ops-queue",
    name: "Queue for Ops Review",
    subtitle: "Confidence < 95% / Drift > 20%",
    type: "queue",
    n8nType: "n8n-nodes-base.rabbitmq",
    icon: AlertTriangle,
    color: "#e5533d",
    x: 920,
    y: 225,
    parameters: {
      routingKey: "swiggy.ops.catalog_flagged",
      escalateTo: "Ops Lead Bangalore"
    },
    inputSample: { item_name: "Bastian Lobster Thermidor", variance: "+22.9%" },
    outputSample: { ticket_id: "OPS-BLR-9921", status: "QUEUED_FOR_1_CLICK_APPROVAL" }
  }
];

export default function N8nVisualCanvas({ onTriggerRun }) {
  const [selectedNode, setSelectedNode] = useState(VISUAL_N8N_NODES[2]); // Default inspect OCR node
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);

  const handleExecute = () => {
    setIsExecuting(true);
    setActiveStepIndex(0);

    const stepOrder = [0, 2, 3, 4, 5]; // Node execution sequence
    stepOrder.forEach((nodeIdx, step) => {
      setTimeout(() => {
        setActiveStepIndex(nodeIdx);
      }, (step + 1) * 600);
    });

    setTimeout(() => {
      setIsExecuting(false);
      setActiveStepIndex(-1);
      if (onTriggerRun) onTriggerRun();
    }, (stepOrder.length + 1) * 600);
  };

  return (
    <div className="rounded-2xl bg-[#0e0e10] border border-[#26262a] shadow-dossier overflow-hidden font-mono">
      
      {/* Visual Canvas Top Bar */}
      <div className="p-4 bg-[#131315] border-b border-[#26262a] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#f2b544]/20 border border-[#f2b544]/40 flex items-center justify-center text-[#f2b544] font-bold text-xs">
            n8n
          </div>
          <div>
            <div className="text-xs font-bold text-[#ecebe6] flex items-center gap-2">
              <span>Swiggy_Dineout_Sentinel_Cron_Pipeline.json</span>
              <span className="px-2 py-0.2 rounded-full text-[9px] bg-[#7fc79a]/10 text-[#7fc79a] border border-[#7fc79a]/30">
                ACTIVE
              </span>
            </div>
            <div className="text-[10px] text-[#8d8c86]">
              Visual Node Execution Graph · 7 Connected Nodes
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              isExecuting
                ? 'bg-[#26262a] text-[#8d8c86] cursor-wait'
                : 'bg-[#f2b544] hover:bg-[#f2b544]/90 text-[#141008] shadow-lampGlow active:scale-95'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Executing Nodes...' : '▶ Execute Workflow'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area: Visual Graph on Left, Node Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        
        {/* Left: The Visual SVG Node Graph Canvas */}
        <div className="lg:col-span-8 p-6 relative overflow-x-auto bg-[#0b0b0c] select-none" style={{
          backgroundImage: 'radial-gradient(#26262a 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}>
          
          <div className="relative min-w-[1120px] h-[360px]">
            {/* SVG Connecting Bézier Wire Cables */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Cron -> OCR */}
              <path
                d="M 200 95 C 222 95, 222 180, 245 180"
                fill="transparent"
                stroke={activeStepIndex === 0 ? "#f2b544" : "#26262a"}
                strokeWidth={activeStepIndex === 0 ? "3" : "2"}
                strokeDasharray={activeStepIndex === 0 ? "6,4" : "none"}
                className={activeStepIndex === 0 ? "animate-pulse" : ""}
              />

              {/* Webhook -> OCR */}
              <path
                d="M 200 265 C 222 265, 222 180, 245 180"
                fill="transparent"
                stroke="#26262a"
                strokeWidth="2"
              />

              {/* OCR -> CCPA */}
              <path
                d="M 425 180 C 447 180, 447 180, 470 180"
                fill="transparent"
                stroke={activeStepIndex === 2 ? "#f2b544" : "#26262a"}
                strokeWidth={activeStepIndex === 2 ? "3" : "2"}
                strokeDasharray={activeStepIndex === 2 ? "6,4" : "none"}
              />

              {/* CCPA -> Moderator */}
              <path
                d="M 650 180 C 672 180, 672 180, 695 180"
                fill="transparent"
                stroke={activeStepIndex === 3 ? "#f2b544" : "#26262a"}
                strokeWidth={activeStepIndex === 3 ? "3" : "2"}
                strokeDasharray={activeStepIndex === 3 ? "6,4" : "none"}
              />

              {/* Moderator -> Auto-Commit (True Branch) */}
              <path
                d="M 875 180 C 897 180, 897 95, 920 95"
                fill="transparent"
                stroke={activeStepIndex === 4 ? "#7fc79a" : "#26262a"}
                strokeWidth={activeStepIndex === 4 ? "3" : "2"}
              />

              {/* Moderator -> Queue for Ops (False Branch) */}
              <path
                d="M 875 180 C 897 180, 897 265, 920 265"
                fill="transparent"
                stroke="#26262a"
                strokeWidth="2"
              />
            </svg>

            {/* Render Nodes */}
            {VISUAL_N8N_NODES.map((node, idx) => {
              const isSelected = selectedNode?.id === node.id;
              const isActiveExecution = activeStepIndex === idx;
              const IconComponent = node.icon;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`absolute w-[180px] p-3 rounded-xl border transition-all cursor-pointer z-10 ${
                    isActiveExecution
                      ? 'bg-[#1a1a1e] border-[#f2b544] ring-2 ring-[#f2b544]/60 shadow-lampGlow scale-105'
                      : isSelected
                      ? 'bg-[#131315] border-[#f2b544] ring-1 ring-[#f2b544]/40 shadow-lg'
                      : 'bg-[#131315]/90 border-[#26262a] hover:border-[#38383e] hover:bg-[#131315]'
                  }`}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                >
                  {/* Left Connection Port Dot */}
                  {node.type !== 'trigger' && (
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#131315] border-2 border-[#7fc79a]" />
                  )}

                  {/* Right Connection Port Dot */}
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#131315] border-2 border-[#f2b544]" />

                  {/* Node Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span 
                      className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold"
                      style={{ color: node.color, backgroundColor: `${node.color}15`, border: `1px solid ${node.color}30` }}
                    >
                      {node.type}
                    </span>
                    <IconComponent className="w-3.5 h-3.5 text-[#8d8c86]" />
                  </div>

                  <h4 className="font-serif text-sm text-[#ecebe6] leading-snug truncate">
                    {node.name}
                  </h4>

                  <div className="text-[10px] text-[#8d8c86] truncate mt-0.5">
                    {node.subtitle}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-[#8d8c86] font-mono mt-2">
            💡 <em>Click any node on the canvas to inspect its live parameters, input schema, and emitted output.</em>
          </div>
        </div>

        {/* Right: Real n8n Node Configuration & Data Inspector */}
        <div className="lg:col-span-4 p-5 bg-[#131315] border-t lg:border-t-0 lg:border-l border-[#26262a] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#26262a]">
            <div>
              <div className="text-[10px] text-[#8d8c86] uppercase font-bold tracking-wider">
                Node Inspector
              </div>
              <h3 className="font-serif text-lg text-[#ecebe6]">
                {selectedNode ? selectedNode.name : 'Select a node'}
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0e0e10] border border-[#26262a] text-[#f2b544]">
              {selectedNode?.n8nType}
            </span>
          </div>

          {selectedNode && (
            <div className="space-y-3 text-xs font-mono">
              {/* Parameters */}
              <div>
                <div className="text-[10px] text-[#8d8c86] uppercase mb-1 font-bold">
                  Node Parameters
                </div>
                <div className="bg-[#0e0e10] p-3 rounded-lg border border-[#26262a] text-[#ecebe6] max-h-28 overflow-y-auto">
                  <pre className="text-[11px] leading-relaxed">
                    {JSON.stringify(selectedNode.parameters, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Input Data Stream */}
              <div>
                <div className="text-[10px] text-[#8d8c86] uppercase mb-1 font-bold flex items-center justify-between">
                  <span>Input Data Schema</span>
                  <span className="text-[#7fc79a]">1 Item In</span>
                </div>
                <div className="bg-[#0e0e10] p-3 rounded-lg border border-[#26262a] text-[#7fc79a] max-h-28 overflow-y-auto">
                  <pre className="text-[11px] leading-relaxed">
                    {JSON.stringify(selectedNode.inputSample, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Output Data Stream */}
              <div>
                <div className="text-[10px] text-[#8d8c86] uppercase mb-1 font-bold flex items-center justify-between">
                  <span>Emitted Output Schema</span>
                  <span className="text-[#f2b544]">1 Item Out</span>
                </div>
                <div className="bg-[#0e0e10] p-3 rounded-lg border border-[#26262a] text-[#f2b544] max-h-28 overflow-y-auto">
                  <pre className="text-[11px] leading-relaxed">
                    {JSON.stringify(selectedNode.outputSample, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="pt-2 border-t border-[#26262a] flex items-center justify-between text-[11px] text-[#8d8c86]">
                <span>Status: Ready to Execute</span>
                <span className="text-[#7fc79a] font-bold">✓ Validated</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
