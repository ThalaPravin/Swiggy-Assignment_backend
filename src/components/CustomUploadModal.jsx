import React, { useState } from 'react';
import { X, Upload, Sparkles, Check, AlertTriangle, FileText, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function CustomUploadModal({ isOpen, onClose, onAddCustomBill }) {
  if (!isOpen) return null;

  const [restaurantName, setRestaurantName] = useState('Bastian Rooftop');
  const [locality, setLocality] = useState('Indiranagar, Bangalore');
  const [itemsText, setItemsText] = useState(
`Lobster Thermidor | 2400 | Food
Avocado Tartine | 650 | Food
Signature Gin Cocktail | 850 | Alcohol
Himalayan Sparkling Water | 180 | Packaged`
  );
  const [serviceChargePct, setServiceChargePct] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [simulatedFile, setSimulatedFile] = useState(null);

  // Ticket #7: 1-Click Preset Scenario Chips
  const PRESET_SCENARIOS = [
    {
      name: "Brewery Ambush",
      emoji: "🍺",
      venue: "Windmills Craftworks",
      locality: "Whitefield, Bangalore",
      itemsText: `Hefeweizen Craft Pitcher | 850 | Alcohol\nBBQ Pork Ribs | 720 | Food\nLoaded Potato Skins | 390 | Food\nKinley Packaged Water | 90 | Packaged`,
      serviceCharge: 10
    },
    {
      name: "Rooftop Lounge Gouging",
      emoji: "🍸",
      venue: "High Ultra Lounge",
      locality: "Malleshwaram, Bangalore",
      itemsText: `Smoked Salmon Sushi | 890 | Food\nSignature Gin Tonic | 750 | Alcohol\nHimalayan Mineral Water | 180 | Packaged\nTruffle Edamame | 480 | Food`,
      serviceCharge: 12
    },
    {
      name: "Cascaded GST Banquet",
      emoji: "👑",
      venue: "Royal Afghan Palace",
      locality: "MG Road, Bangalore",
      itemsText: `Murgh Sikandari Raan | 1450 | Food\nDal Bukhara Pot | 650 | Food\nGarlic Kulcha Basket | 320 | Food\nKesar Kulfi Falooda | 380 | Food`,
      serviceCharge: 10
    }
  ];

  const handleApplyPreset = (preset) => {
    setRestaurantName(preset.venue);
    setLocality(preset.locality);
    setItemsText(preset.itemsText);
    setServiceChargePct(preset.serviceCharge);
    setSimulatedFile({
      name: `${preset.venue.toLowerCase().replace(/\s+/g, '-')}-docket.jpg`,
      size: "1.4 MB · 300 DPI"
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    setSimulatedFile({
      name: "physical-thermal-check.jpg",
      size: "2.1 MB · Dual-Pass Tensor"
    });
  };

  const handleSimulateCustomOCR = async () => {
    setIsProcessing(true);

    try {
      // Parse items
      const lines = itemsText.trim().split('\n');
      let subtotal = 0;
      const parsedItems = lines.map((line, idx) => {
        const parts = line.split('|').map(p => p.trim());
        const name = parts[0] || `Item ${idx + 1}`;
        const price = parseFloat(parts[1]) || 500;
        const category = parts[2] || (name.toLowerCase().includes('cocktail') || name.toLowerCase().includes('beer') ? 'Alcohol' : 'Food');
        subtotal += price;

        const isPackaged = category.toLowerCase() === 'packaged' || name.toLowerCase().includes('water');
        return {
          id: idx + 1,
          name,
          qty: 1,
          price,
          unitPrice: price,
          category,
          dineoutEligible: category === 'Food',
          catalogPrice: price,
          catalogStatus: isPackaged && price > 50 ? 'MRP_VIOLATION' : 'MATCH',
          printedMrp: isPackaged ? 20 : price
        };
      });

      // Attempt live backend scan API call
      let backendData = null;
      try {
        const apiRes = await fetch(`${API_BASE_URL}/api/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurant_name: restaurantName,
            locality: locality,
            items: parsedItems,
            service_charge_pct: serviceChargePct
          })
        });
        if (apiRes.ok) {
          backendData = await apiRes.json();
        }
      } catch (err) {
        console.log('Running in local/offline fallback mode:', err);
      }

      const scAmount = (subtotal * serviceChargePct) / 100;
      const gstAmount = (subtotal * 0.05);
      const grandTotal = subtotal + scAmount + gstAmount;

      const scViolationId = `v-sc-custom-${Date.now()}`;
      const mrpViolationId = `v-mrp-custom-${Date.now()}`;

      // Ticket #7: Dynamically build realistic ocrBoundingBoxes for custom uploaded check
      const customBoxes = [];
      parsedItems.forEach((item, idx) => {
        const topPct = 25 + (idx * 7);
        customBoxes.push({
          id: `box-cust-item-${item.id}`,
          itemId: item.id,
          violationId: item.catalogStatus === 'MRP_VIOLATION' ? mrpViolationId : undefined,
          label: item.name,
          rate: item.price,
          top: `${topPct}%`,
          left: "5%",
          width: "90%",
          height: "6%",
          confidence: item.catalogStatus === 'MRP_VIOLATION' ? 0.98 : 0.99,
          type: item.catalogStatus === 'MRP_VIOLATION' ? 'MRP_GOUGING' : item.category === 'Alcohol' ? 'ALCOHOL_EXCISE' : 'FOOD_ELIGIBLE',
          isReconciled: item.catalogStatus !== 'MRP_VIOLATION'
        });
      });

      if (scAmount > 0) {
        customBoxes.push({
          id: `box-cust-sc-${Date.now()}`,
          violationId: scViolationId,
          label: `Discretionary Service Fee (${serviceChargePct}%)`,
          rate: scAmount,
          top: `${25 + (parsedItems.length * 7) + 5}%`,
          left: "5%",
          width: "90%",
          height: "6%",
          confidence: 0.99,
          type: "SERVICE_CHARGE",
          isReconciled: false
        });
      }

      customBoxes.push({
        id: `box-cust-gst-${Date.now()}`,
        label: "CGST/SGST (5% Food)",
        rate: gstAmount,
        top: `${25 + (parsedItems.length * 7) + 12}%`,
        left: "5%",
        width: "90%",
        height: "5.5%",
        confidence: 0.98,
        type: "FOOD_GST",
        isReconciled: true
      });

      customBoxes.push({
        id: `box-cust-total-${Date.now()}`,
        label: "Printed Grand Total",
        rate: grandTotal,
        top: "84%",
        left: "5%",
        width: "90%",
        height: "7%",
        confidence: 1.0,
        type: "TOTAL",
        isReconciled: true
      });

      const customBill = {
        id: `custom-bill-${Date.now()}`,
        caseNumber: 'CASE-CUSTOM-01',
        scenarioName: `Custom: ${restaurantName}`,
        problemFocus: 'User-Generated Live Receipt Interrogation',
        restaurantId: 'DINEOUT_CUSTOM_999',
        restaurantName: restaurantName,
        locality: locality,
        cuisine: 'Global, Fusion, Modern',
        cuisineEmoji: '🍽️',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
        verifiedBadge: 'Live Verified',
        tableNo: 'Table 07 (Live Scan)',
        billNo: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Just now (Live Scan)',
        rating: 4.7,
        dineoutOffer: 'Flat 20% OFF on Food Bill via Dineout Pay',
        dineoutTerms: 'Applicable on Food items only. Drinks and packaged items billed at venue rates.',
        items: parsedItems,
        receiptSubtotal: subtotal,
        serviceChargePct: serviceChargePct,
        serviceChargeAmount: scAmount,
        foodGstPct: 5,
        foodGstAmount: gstAmount,
        liquorVatPct: 0,
        liquorVatAmount: 0,
        receiptGrandTotal: grandTotal,
        violations: [
          ...(scAmount > 0 ? [{
            id: scViolationId,
            type: 'SERVICE_CHARGE',
            title: `Discretionary ${serviceChargePct}% Service Fee Levied (₹${scAmount.toFixed(0)})`,
            severity: 'HIGH',
            law: 'CCPA 2022 Guidelines',
            explanation: `The venue added ₹${scAmount.toFixed(2)} as a discretionary charge. FairBill allows 1-tap removal.`,
            removable: true,
            defaultActive: true,
            savings: scAmount
          }] : []),
          ...(parsedItems.some(i => i.catalogStatus === 'MRP_VIOLATION') ? [{
            id: mrpViolationId,
            type: 'MRP_GOUGING',
            title: 'Dual MRP Overcharge Detected on Packaged Water',
            severity: 'CRITICAL',
            law: 'Legal Metrology Rules 2017',
            explanation: 'Packaged water billed above printed MRP. Rollback to ₹20 applied.',
            removable: true,
            defaultActive: true,
            savings: 160.00
          }] : [])
        ],
        // Ticket #7: Include mock ocrBoundingBoxes
        ocrBoundingBoxes: customBoxes,
        guestSplits: [
          { guestName: 'Diner 1 (Food + Cocktail)', shareItems: ['Cocktail', 'Tartine'], netPayable: (subtotal * 0.6) },
          { guestName: 'Diner 2 (Food Only)', shareItems: ['Lobster share'], netPayable: (subtotal * 0.4) }
        ],
        rdpEnrichment: {
          generatedHighlights: [
            `Popular for ${parsedItems[0]?.name || 'gourmet dishes'} and rooftop ambience`,
            'Zero checkout dispute guarantee enforced by Sentinel AI'
          ],
          dietaryTags: ['Live Audited', 'Swiggy Pay Partner'],
          suggestedCostForTwo: `₹${(subtotal * 0.8).toFixed(0)} for two`
        }
      };

      setIsProcessing(false);
      onAddCustomBill(customBill);
      onClose();
    } catch (err) {
      console.error('Error processing custom check:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#131315] border border-[#26262a] rounded-2xl max-w-lg w-full p-6 shadow-dossier relative space-y-4 font-mono text-xs my-8">
        <div className="flex items-center justify-between pb-3 border-b border-[#26262a]">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#f2b544]" />
            <h3 className="font-serif text-2xl text-[#ecebe6]">Interrogate Any Custom Check</h3>
          </div>
          <button onClick={onClose} className="text-[#8d8c86] hover:text-[#ecebe6]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket #7: 1-Click Preset Scenario Chips */}
        <div>
          <label className="text-[11px] font-mono text-[#8d8c86] uppercase block mb-1.5 font-bold">
            1-Click Preset Scenarios:
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_SCENARIOS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-amber-400/50 text-zinc-200 text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>{preset.emoji}</span>
                <span className="font-semibold">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ticket #7: Image Drop Simulator Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            setSimulatedFile({
              name: "scanned-thermal-docket.jpg",
              size: "1.8 MB · Bilinear Skew Fixed"
            });
          }}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragOver 
              ? 'border-amber-400 bg-amber-400/10' 
              : simulatedFile 
              ? 'border-emerald-500/50 bg-emerald-500/5' 
              : 'border-[#26262a] hover:border-white/20 bg-[#0e0e10]'
          }`}
        >
          {simulatedFile ? (
            <div className="flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-zinc-200 block text-xs">{simulatedFile.name}</span>
                  <span className="text-[10px] text-emerald-400">{simulatedFile.size} · Optical Bounds Ready</span>
                </div>
              </div>
              <span className="text-[10px] text-zinc-500 underline">Change</span>
            </div>
          ) : (
            <div className="space-y-1">
              <Upload className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="text-zinc-200 font-bold text-xs">
                Drop thermal check image here, or click to simulate upload
              </div>
              <div className="text-[10px] text-zinc-500">
                Supports JPG, PNG, HEIC up to 10MB · Auto Perspective Unskewing
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 font-sans">
          <div>
            <label className="text-[11px] font-mono text-[#8d8c86] uppercase block mb-1">
              Venue Name & Location
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                value={restaurantName} 
                onChange={e => setRestaurantName(e.target.value)}
                className="bg-[#0e0e10] border border-[#26262a] rounded-lg p-2 text-xs text-[#ecebe6] focus:border-[#f2b544] outline-none font-mono"
                placeholder="Restaurant Name"
              />
              <input 
                type="text" 
                value={locality} 
                onChange={e => setLocality(e.target.value)}
                className="bg-[#0e0e10] border border-[#26262a] rounded-lg p-2 text-xs text-[#ecebe6] focus:border-[#f2b544] outline-none font-mono"
                placeholder="Locality, City"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#8d8c86] uppercase block mb-1">
              Line Items (Format: Item Name | Price | Food/Alcohol/Packaged)
            </label>
            <textarea
              rows={4}
              value={itemsText}
              onChange={e => setItemsText(e.target.value)}
              className="w-full bg-[#0e0e10] border border-[#26262a] rounded-lg p-2 text-xs text-[#ecebe6] font-mono focus:border-[#f2b544] outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0e0e10] border border-[#26262a]">
            <span className="text-xs font-mono text-[#8d8c86]">Service Charge on Receipt (%):</span>
            <div className="flex items-center gap-2">
              {[0, 5, 8, 10, 12].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setServiceChargePct(pct)}
                  className={`px-2 py-0.5 rounded text-xs font-mono ${
                    serviceChargePct === pct 
                      ? 'bg-[#f2b544] text-[#141008] font-bold' 
                      : 'bg-[#131315] text-[#8d8c86] border border-[#26262a]'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSimulateCustomOCR}
          disabled={isProcessing}
          className="w-full py-3 rounded-full font-mono text-xs font-semibold text-[#141008] bg-[#f2b544] hover:bg-[#f2b544]/90 transition-colors shadow-lampGlow flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-[#141008]" />
              <span>Interrogating Custom Docket...</span>
            </>
          ) : (
            <>
              <span>Run Multimodal AI Interrogation</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
