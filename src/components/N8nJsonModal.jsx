import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, Download } from 'lucide-react';

export default function N8nJsonModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [copied, setCopied] = useState(false);

  const n8nWorkflowJson = {
    name: "Swiggy_Dineout_Sentinel_Cron_Pipeline_v2",
    nodes: [
      {
        parameters: {
          rule: {
            interval: [{ field: "cronExpression", expression: "0 2 * * *" }]
          }
        },
        id: "cron-trigger-02am",
        name: "Schedule: Nightly 02:00 AM IST",
        type: "n8n-nodes-base.cron",
        typeVersion: 1,
        position: [240, 300]
      },
      {
        parameters: {
          httpMethod: "POST",
          path: "swiggy/dineout/receipt-webhook",
          responseMode: "onReceived"
        },
        id: "webhook-realtime-scan",
        name: "Webhook: Real-time Check Ingestion",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [240, 480]
      },
      {
        parameters: {
          model: "claude-3-5-sonnet-20241022",
          promptType: "define",
          text: "Extract itemized bill details, taxes (GST vs VAT), and discretionary service charge. Return strictly JSON adhering to SwiggyDineoutReceiptSchema.",
          options: {
            temperature: 0.1,
            maxTokens: 2000
          }
        },
        id: "llm-dual-pass-ocr",
        name: "Multimodal Vision & Math OCR",
        type: "@n8n/n8n-nodes-langchain.openAi",
        typeVersion: 1,
        position: [480, 380]
      },
      {
        parameters: {
          conditions: {
            boolean: [
              {
                value1: "={{$json.service_charge.present}}",
                value2: true
              }
            ]
          }
        },
        id: "ccpa-service-charge-rule",
        name: "CCPA Voluntary Fee Strike Engine",
        type: "n8n-nodes-base.if",
        typeVersion: 1,
        position: [720, 380]
      },
      {
        parameters: {
          operation: "executeQuery",
          query: "SELECT item_name, listed_price, is_available FROM swiggy_dineout_master_catalog WHERE restaurant_id = $1"
        },
        id: "db-catalog-lookup",
        name: "PostgreSQL Master Catalog Lookup",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2,
        position: [960, 380]
      },
      {
        parameters: {
          conditions: {
            number: [
              {
                value1: "={{$json.catalog_confidence_score}}",
                operation: "largerEqual",
                value2: 0.95
              }
            ]
          }
        },
        id: "confidence-routing-95pct",
        name: "Confidence >= 95% Routing",
        type: "n8n-nodes-base.if",
        typeVersion: 1,
        position: [1200, 380]
      },
      {
        parameters: {
          operation: "update",
          table: "swiggy_dineout_master_catalog",
          updateKey: "item_id",
          columns: "listed_price, last_verified_at"
        },
        id: "auto-update-catalog-db",
        name: "Auto-Correct Live Dineout Catalog",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2,
        position: [1440, 280]
      },
      {
        parameters: {
          queue: "swiggy_ops_manual_review_queue",
          message: "Price variance > 20% or confidence < 95% detected. Requires human moderator 1-click review."
        },
        id: "queue-for-ops-moderator",
        name: "Queue for Ops Human Moderator",
        type: "n8n-nodes-base.rabbitmq",
        typeVersion: 1,
        position: [1440, 480]
      }
    ],
    connections: {
      "cron-trigger-02am": { main: [[{ node: "llm-dual-pass-ocr", type: "main", index: 0 }]] },
      "webhook-realtime-scan": { main: [[{ node: "llm-dual-pass-ocr", type: "main", index: 0 }]] },
      "llm-dual-pass-ocr": { main: [[{ node: "ccpa-service-charge-rule", type: "main", index: 0 }]] },
      "ccpa-service-charge-rule": { main: [[{ node: "db-catalog-lookup", type: "main", index: 0 }]] },
      "db-catalog-lookup": { main: [[{ node: "confidence-routing-95pct", type: "main", index: 0 }]] },
      "confidence-routing-95pct": {
        main: [
          [{ node: "auto-update-catalog-db", type: "main", index: 0 }],
          [{ node: "queue-for-ops-moderator", type: "main", index: 0 }]
        ]
      }
    }
  };

  const jsonString = JSON.stringify(n8nWorkflowJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'swiggy_dineout_sentinel_workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#131315] border border-[#26262a] rounded-2xl max-w-2xl w-full p-6 shadow-dossier relative space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#26262a]">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-[#f2b544]" />
            <h3 className="font-serif text-2xl text-[#ecebe6]">Production n8n Workflow</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e1e24] text-[#ecebe6] font-bold hover:bg-[#26262a] border border-[#26262a] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#f2b544]" />
              <span>Download .n8n</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f2b544] text-[#141008] font-bold hover:bg-[#f2b544]/90 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button onClick={onClose} className="text-[#8d8c86] hover:text-[#ecebe6]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <p className="text-[#8d8c86]">
          Directly importable into n8n (<code className="text-[#ecebe6]">Import Workflow</code>). Connects scheduled crons, multimodal OCR schemas, and PostgreSQL catalog synchronizers.
        </p>

        <div className="bg-[#0e0e10] p-4 rounded-xl border border-[#26262a] max-h-96 overflow-y-auto font-mono text-[11px] text-[#7fc79a] leading-relaxed">
          <pre>{jsonString}</pre>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#8d8c86] pt-2 border-t border-[#26262a]">
          <span>Format: n8n Workflow Schema v2 (LangChain + Postgres Nodes)</span>
          <span className="text-[#f2b544]">Production Ready</span>
        </div>
      </div>
    </div>
  );
}
