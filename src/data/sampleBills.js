export const SAMPLE_BILLS = [
  {
    id: "bill-toit-blr",
    caseNumber: "CASE-BLR-01",
    scenarioName: "The Brewery Ambush",
    problemFocus: "10% Discretionary Fee + Liquor Tax Segregation + Catalog Price Drift",
    restaurantId: "DINEOUT_BLR_TOIT_101",
    restaurantName: "Toit Brewpub",
    locality: "Indiranagar, Bangalore",
    cuisine: "Microbrewery, Continental, Italian",
    cuisineEmoji: "🍺",
    imageUrl: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=400&q=80",
    logoBadge: "TOIT BREWPUB",
    verifiedBadge: "Dineout Top 100",
    tableNo: "Table 14 (Rooftop)",
    billNo: "TOIT-BLR-8849",
    timestamp: "Today, 09:42 PM",
    rating: 4.6,
    dineoutOffer: "Flat 20% OFF on Food Bill via Dineout Pay",
    dineoutTerms: "Discount applicable strictly on Food items. State Excise Law excludes Alcohol & Tobacco.",
    
    // Scanned line items
    items: [
      { id: 1, name: "Toit Tint-in-Wit (Pitcher)", emoji: "🍺", qty: 1, price: 850, category: "Alcohol", dineoutEligible: false, catalogPrice: 850, catalogStatus: "MATCH", orderedBy: "Guest 1 (Drinks)" },
      { id: 2, name: "Wood-fired Pepperoni Pizza", emoji: "🍕", qty: 1, price: 620, category: "Food", dineoutEligible: true, catalogPrice: 620, catalogStatus: "MATCH", orderedBy: "Shared" },
      { id: 3, name: "Baked Nachos Grande", emoji: "🧀", qty: 1, price: 420, category: "Food", dineoutEligible: true, catalogPrice: 420, catalogStatus: "MATCH", orderedBy: "Shared" },
      { id: 4, name: "BBQ Smoked Chicken Wings", emoji: "🍗", qty: 1, price: 440, category: "Food", dineoutEligible: true, catalogPrice: 390, catalogStatus: "PRICE_DRIFT", driftDiff: "+₹50 (+12.8%)", orderedBy: "Guest 2 (Food)" }
    ],
    
    // Receipt Financial Breakdown
    receiptSubtotal: 2330.00,
    serviceChargePct: 10,
    serviceChargeAmount: 233.00,
    foodGstPct: 5,
    foodGstAmount: 74.00,
    liquorVatPct: 18,
    liquorVatAmount: 153.00,
    receiptGrandTotal: 2790.00,
    
    // Violations & Audits
    violations: [
      {
        id: "v-sc-1",
        type: "SERVICE_CHARGE",
        title: "Discretionary 10% Service Fee Levied (₹233.00)",
        severity: "HIGH",
        law: "CCPA Advisory Guidelines",
        explanation: "Discretionary fee added without table consent. 1-tap strike enabled.",
        removable: true,
        defaultActive: true,
        savings: 233.00
      },
      {
        id: "v-drift-1",
        type: "CATALOG_DRIFT",
        title: "Catalog Drift Caught: BBQ Wings (+₹50.00)",
        severity: "MEDIUM",
        law: "Swiggy Catalog Parity Protocol",
        explanation: "Charged ₹440 on paper vs ₹390 on Swiggy DB (+12.8%). Synced to nightly cron.",
        removable: false
      },
      {
        id: "v-tax-1",
        type: "TAX_ISOLATION",
        title: "Alcohol Tax Exemption Cleanly Segregated",
        severity: "INFO",
        law: "Karnataka Excise Dual-Tax Framework",
        explanation: "20% discount isolated strictly to food. Alcohol tax preserved without cashier disputes.",
        removable: false
      }
    ],

    // Dual-Way OCR Vision Bounding Boxes
    ocrBoundingBoxes: [
      { id: "box-toit-1", itemId: 1, label: "Toit Tint-in-Wit (Pitcher)", rate: 850, top: "25%", left: "5%", width: "90%", height: "7%", confidence: 0.99, type: "ALCOHOL_EXCISE", isReconciled: true },
      { id: "box-toit-2", itemId: 2, label: "Wood-fired Pepperoni Pizza", rate: 620, top: "33%", left: "5%", width: "90%", height: "7%", confidence: 0.98, type: "FOOD_ELIGIBLE", isReconciled: true },
      { id: "box-toit-3", itemId: 3, label: "Baked Nachos Grande", rate: 420, top: "41%", left: "5%", width: "90%", height: "7%", confidence: 0.99, type: "FOOD_ELIGIBLE", isReconciled: true },
      { id: "box-toit-4", itemId: 4, label: "BBQ Smoked Chicken Wings", rate: 440, top: "49%", left: "5%", width: "90%", height: "7%", confidence: 0.97, type: "PRICE_DRIFT", isReconciled: true, driftDelta: "+₹50 (+12.8%)" },
      { id: "box-toit-sc", violationId: "v-sc-1", label: "Discretionary Service Fee (10%)", rate: 233, top: "61%", left: "5%", width: "90%", height: "6%", confidence: 0.99, type: "SERVICE_CHARGE", isReconciled: false },
      { id: "box-toit-gst", label: "CGST/SGST (5% Food)", rate: 74, top: "68%", left: "5%", width: "90%", height: "5.5%", confidence: 0.98, type: "FOOD_GST", isReconciled: true },
      { id: "box-toit-vat", label: "Karnataka Liquor VAT (18%)", rate: 153, top: "74.5%", left: "5%", width: "90%", height: "5.5%", confidence: 0.99, type: "LIQUOR_VAT", isReconciled: true },
      { id: "box-toit-total", label: "Printed Docket Grand Total", rate: 2790, top: "83%", left: "5%", width: "90%", height: "7%", confidence: 1.0, type: "TOTAL", isReconciled: true }
    ],

    // FairSplit Breakdown
    guestSplits: [
      { guestName: "Guest 1 (Drank Beer)", shareItems: ["Toit Pitcher (₹850)", "Half Pizza & Nachos (₹520)"], netPayable: 1420.00 },
      { guestName: "Guest 2 (Food Only)", shareItems: ["BBQ Wings (₹440)", "Half Pizza & Nachos (₹520)"], netPayable: 841.00 }
    ],

    rdpEnrichment: {
      generatedHighlights: [
        "Signature Tint-in-Wit craft wheat beer paired with crisp pepperoni crusts",
        "Verified price drift auto-corrected on BBQ Chicken Wings (₹440)",
        "Spacious Indiranagar rooftop ambience with swift Dineout Pay settlement"
      ],
      dietaryTags: ["Non-Veg", "Artisanal Brews", "Woodfired"],
      suggestedCostForTwo: "₹1,800 for two with craft beer"
    }
  },

  {
    id: "bill-social-church",
    caseNumber: "CASE-BLR-02",
    scenarioName: "The Phantom Item & MRP Gouging",
    problemFocus: "Packaged Water Overcharging + Unordered Ghost Cocktail + FairSplit",
    restaurantId: "DINEOUT_BLR_SOC_204",
    restaurantName: "Church Street Social",
    locality: "Church Street, Bangalore",
    cuisine: "Continental, Cafe, Bar, Modern Indian",
    cuisineEmoji: "🍸",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
    logoBadge: "CHURCH ST SOCIAL",
    verifiedBadge: "Dineout Partner",
    tableNo: "Table 08",
    billNo: "SOC-BLR-5521",
    timestamp: "Today, 08:15 PM",
    rating: 4.5,
    dineoutOffer: "Flat 15% OFF on Food & Beverages via Dineout Pay",
    dineoutTerms: "Applicable on Food and Soft Beverages. Packaged goods billed at MRP.",
    
    items: [
      { id: 1, name: "Social Electric LIIT (500ml)", emoji: "🍸", qty: 2, price: 1360, unitPrice: 680, category: "Alcohol", dineoutEligible: false, catalogPrice: 680, catalogStatus: "GHOST_ALERT", ghostFlag: true, ghostDetail: "Table had 2 guests, but 2x 500ml LIITs billed within 25 mins. Flagged for item count review." },
      { id: 2, name: "Butter Chicken Biryani", emoji: "🍛", qty: 1, price: 490, unitPrice: 490, category: "Food", dineoutEligible: true, catalogPrice: 490, catalogStatus: "MATCH" },
      { id: 3, name: "Crispy Corn Chakna", emoji: "🌽", qty: 1, price: 280, unitPrice: 280, category: "Food", dineoutEligible: true, catalogPrice: 280, catalogStatus: "MATCH" },
      { id: 4, name: "Kinley Packaged Water (1L)", emoji: "💧", qty: 1, price: 90, unitPrice: 90, category: "Packaged", dineoutEligible: false, catalogPrice: 20, catalogStatus: "MRP_VIOLATION", printedMrp: 20, mrpDiff: "+₹70 above MRP" }
    ],

    receiptSubtotal: 2220.00,
    serviceChargePct: 10,
    serviceChargeAmount: 222.00,
    foodGstPct: 5,
    foodGstAmount: 43.00,
    liquorVatPct: 18,
    liquorVatAmount: 244.80,
    receiptGrandTotal: 2729.80,

    violations: [
      {
        id: "v-mrp-2",
        type: "MRP_GOUGING",
        title: "Dual MRP Violation: Bottled Water Charged ₹90 (MRP ₹20)",
        severity: "CRITICAL",
        law: "Legal Metrology (Packaged Commodities) Rules, 2017",
        explanation: "Venue billed sealed packaged water at ₹90 (+350% above MRP ₹20). Under Supreme Court & Legal Metrology mandates, bottled water with standard manufacturer MRP cannot be marked up. FairBill auto-corrects to ₹20.",
        removable: true,
        defaultActive: true,
        savings: 70.00
      },
      {
        id: "v-ghost-2",
        type: "GHOST_ITEM",
        title: "Ghost Item Detected: Extra LIIT Cocktail (₹680)",
        severity: "HIGH",
        law: "Consumer Protection Act (Unfair Trade Practices)",
        explanation: "Diner session logs indicate only 1 LIIT was delivered, but 2 are printed on check. Toggle enables instant dispute of the phantom drink before payment.",
        removable: true,
        defaultActive: true,
        savings: 680.00
      },
      {
        id: "v-sc-2",
        type: "SERVICE_CHARGE",
        title: "Discretionary 10% Service Fee Added (₹222.00)",
        severity: "HIGH",
        law: "CCPA Advisory Guidelines",
        explanation: "Discretionary fee added without table disclosure. 1-tap removal enabled.",
        removable: true,
        defaultActive: true,
        savings: 222.00
      }
    ],

    // Dual-Way OCR Vision Bounding Boxes
    ocrBoundingBoxes: [
      { id: "box-soc-1", itemId: 1, violationId: "v-ghost-2", label: "Social Electric LIIT (500ml) [2x]", rate: 1360, top: "25%", left: "5%", width: "90%", height: "7%", confidence: 0.96, type: "GHOST_ITEM", isReconciled: false },
      { id: "box-soc-2", itemId: 2, label: "Butter Chicken Biryani", rate: 490, top: "33%", left: "5%", width: "90%", height: "7%", confidence: 0.99, type: "FOOD_ELIGIBLE", isReconciled: true },
      { id: "box-soc-3", itemId: 3, label: "Crispy Corn Chakna", rate: 280, top: "41%", left: "5%", width: "90%", height: "7%", confidence: 0.99, type: "FOOD_ELIGIBLE", isReconciled: true },
      { id: "box-soc-4", itemId: 4, violationId: "v-mrp-2", label: "Kinley Packaged Water (1L) [MRP ₹20]", rate: 90, top: "49%", left: "5%", width: "90%", height: "7%", confidence: 0.98, type: "MRP_GOUGING", isReconciled: false },
      { id: "box-soc-sc", violationId: "v-sc-2", label: "Discretionary Service Fee (10%)", rate: 222, top: "61%", left: "5%", width: "90%", height: "6%", confidence: 0.99, type: "SERVICE_CHARGE", isReconciled: false },
      { id: "box-soc-gst", label: "CGST/SGST (5% Food)", rate: 43, top: "68%", left: "5%", width: "90%", height: "5.5%", confidence: 0.99, type: "FOOD_GST", isReconciled: true },
      { id: "box-soc-vat", label: "Excise Liquor VAT (18%)", rate: 244.8, top: "74.5%", left: "5%", width: "90%", height: "5.5%", confidence: 0.99, type: "LIQUOR_VAT", isReconciled: true },
      { id: "box-soc-total", label: "Printed Docket Grand Total", rate: 2729.8, top: "83%", left: "5%", width: "90%", height: "7%", confidence: 1.0, type: "TOTAL", isReconciled: true }
    ],

    guestSplits: [
      { guestName: "Guest 1 (Drank 1 LIIT)", shareItems: ["1x LIIT (₹680)", "Half Biryani & Corn (₹385)"], netPayable: 1065.00 },
      { guestName: "Guest 2 (Non-Drinker)", shareItems: ["Half Biryani & Corn (₹385)", "Water (MRP ₹20)"], netPayable: 345.00 }
    ],

    rdpEnrichment: {
      generatedHighlights: [
        "High-energy social co-working space turning vibrant cocktail lounge at night",
        "Famous Butter Chicken Biryani and signature DIY cocktail carousels",
        "MRP compliance monitored by Swiggy Sentinel AI"
      ],
      dietaryTags: ["Non-Veg", "Cocktails", "Co-Working"],
      suggestedCostForTwo: "₹1,400 for two"
    }
  },

  {
    id: "bill-punjab-grill",
    caseNumber: "CASE-BLR-03",
    scenarioName: "The Tax-on-Tax Cascading Trap",
    problemFocus: "GST Levied on Top of Service Charge + GIRF 25% Mega Offer",
    restaurantId: "DINEOUT_BLR_PG_309",
    restaurantName: "Punjab Grill Fine Dining",
    locality: "Forum Mall, Koramangala",
    cuisine: "North Indian, Mughlai, Kebab",
    cuisineEmoji: "👑",
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80",
    logoBadge: "PUNJAB GRILL",
    verifiedBadge: "GIRF Partner",
    tableNo: "Table 04",
    billNo: "PG-KM-9923",
    timestamp: "Today, 01:30 PM",
    rating: 4.8,
    dineoutOffer: "Flat 25% OFF via Dineout Great Indian Restaurant Fest (GIRF)",
    dineoutTerms: "Applicable on entire Food & Soft Beverage order with Swiggy One membership.",
    
    items: [
      { id: 1, name: "Dal Panjratani / 24hr Makhani", emoji: "🍲", qty: 1, price: 525, unitPrice: 525, category: "Food", dineoutEligible: true, catalogPrice: 525, catalogStatus: "MATCH" },
      { id: 2, name: "Murgh Tikka Lababdar", emoji: "🍗", qty: 1, price: 675, unitPrice: 675, category: "Food", dineoutEligible: true, catalogPrice: 675, catalogStatus: "MATCH" },
      { id: 3, name: "Garlic Butter Naan (2 pcs)", emoji: "🫓", qty: 1, price: 260, unitPrice: 260, category: "Food", dineoutEligible: true, catalogPrice: 260, catalogStatus: "MATCH" },
      { id: 4, name: "Royal Kulfi Falooda Platter", emoji: "🍨", qty: 1, price: 395, unitPrice: 395, category: "Food", dineoutEligible: true, catalogPrice: 395, catalogStatus: "MATCH" }
    ],

    receiptSubtotal: 1855.00,
    serviceChargePct: 10,
    serviceChargeAmount: 185.50,
    // Note the restaurant cascaded GST: 5% applied on (Subtotal 1855 + Service Charge 185.50) = 5% of 2040.50 = 102.03!
    foodGstPct: 5,
    foodGstAmount: 102.03, // Cascaded tax error! True GST should be 5% of 1855 = 92.75!
    liquorVatPct: 0,
    liquorVatAmount: 0.00,
    receiptGrandTotal: 2142.53,

    violations: [
      {
        id: "v-tax-cascading-3",
        type: "TAX_CASCADING",
        title: "Illegal Tax-on-Tax: 5% GST Levied on Top of Service Charge",
        severity: "HIGH",
        law: "Central Goods & Services Tax (CGST) Act Section 15",
        explanation: "Venue calculated 5% GST on (Subtotal + Service Charge = ₹2,040.50), resulting in ₹102.03. When service charge is removed, true GST on base food is only ₹92.75. FairBill eliminates the cascading tax surplus (₹9.28).",
        removable: true,
        defaultActive: true,
        savings: 9.28
      },
      {
        id: "v-sc-3",
        type: "SERVICE_CHARGE",
        title: "Discretionary 10% Service Fee Flagged (₹185.50)",
        severity: "HIGH",
        law: "CCPA Advisory Guidelines",
        explanation: "Fine dining service charge flagged for voluntary deduction.",
        removable: true,
        defaultActive: true,
        savings: 185.50
      },
      {
        id: "v-girf-3",
        type: "GIRF_DISCOUNT",
        title: "Swiggy One 25% GIRF Mega Savings Validated",
        severity: "SUCCESS",
        law: "Swiggy Great Indian Restaurant Festival Contract",
        explanation: "25% discount applied across all food items (₹1,855 -> -₹463.75) with zero exclusion disputes.",
        removable: false
      }
    ],

    // Dual-Way OCR Vision Bounding Boxes
    ocrBoundingBoxes: [
      { id: "box-pg-1", itemId: 1, label: "Dal Panjratani / 24hr Makhani", rate: 525, top: "25%", left: "5%", width: "90%", height: "7%", confidence: 0.99, type: "FOOD_ELIGIBLE", isReconciled: true },
      { id: "box-pg-2", itemId: 2, label: "Murgh Tikka Lababdar", rate: 675, top: "33%", left: "5%", width: "90%", height: "7%", confidence: 0.99, type: "FOOD_ELIGIBLE", isReconciled: true },
      { id: "box-pg-3", itemId: 3, label: "Garlic Butter Naan (2 pcs)", rate: 260, top: "41%", left: "5%", width: "90%", height: "7%", confidence: 0.98, type: "FOOD_ELIGIBLE", isReconciled: true },
      { id: "box-pg-4", itemId: 4, label: "Royal Kulfi Falooda Platter", rate: 395, top: "49%", left: "5%", width: "90%", height: "7%", confidence: 0.99, type: "FOOD_ELIGIBLE", isReconciled: true },
      { id: "box-pg-sc", violationId: "v-sc-3", label: "Discretionary Service Fee (10%)", rate: 185.50, top: "61%", left: "5%", width: "90%", height: "6%", confidence: 0.99, type: "SERVICE_CHARGE", isReconciled: false },
      { id: "box-pg-gst", violationId: "v-tax-cascading-3", label: "Cascaded CGST/SGST (5% on Food+SC)", rate: 102.03, top: "68%", left: "5%", width: "90%", height: "6%", confidence: 0.97, type: "TAX_CASCADING", isReconciled: false, correctionNote: "Normalized to ₹92.75 base food GST" },
      { id: "box-pg-total", label: "Printed Docket Grand Total", rate: 2142.53, top: "82%", left: "5%", width: "90%", height: "7%", confidence: 1.0, type: "TOTAL", isReconciled: true }
    ],

    guestSplits: [
      { guestName: "Equal Split (Guest 1)", shareItems: ["50% of North Indian Feast"], netPayable: 692.00 },
      { guestName: "Equal Split (Guest 2)", shareItems: ["50% of North Indian Feast"], netPayable: 692.00 }
    ],

    rdpEnrichment: {
      generatedHighlights: [
        "Rich, slow-simmered 24-hr Dal Makhani with artisanal tandoori breads",
        "Family-friendly fine dining with white-glove hospitality",
        "Verified 100% price parity between physical menu and Swiggy Dineout"
      ],
      dietaryTags: ["North Indian", "Pure Ghee", "Family Dining"],
      suggestedCostForTwo: "₹2,000 for two"
    }
  },

  {
    id: "bill-corner-house",
    caseNumber: "CASE-BLR-04",
    scenarioName: "Low-Ink Thermal & Broken Math (Edge Case Test)",
    problemFocus: "Wrinkled Receipt + Low Confidence OCR Fallback + Math Anomaly Reconciliation",
    restaurantId: "DINEOUT_BLR_CH_412",
    restaurantName: "Corner House Dessert Cafe",
    locality: "Residency Road, Bangalore",
    cuisine: "Ice Cream, Sundaes, Desserts",
    cuisineEmoji: "🍨",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",
    logoBadge: "CORNER HOUSE",
    verifiedBadge: "Bangalore Heritage",
    tableNo: "Walk-in Counter 02",
    billNo: "CH-RR-1082",
    timestamp: "Today, 10:20 PM",
    rating: 4.9,
    dineoutOffer: "Flat 10% OFF on Classic Sundaes via Dineout Pay",
    dineoutTerms: "Applicable on all ice cream tubs and dine-in sundaes.",
    
    items: [
      { id: 1, name: "Death By Chocolate (DBC)", emoji: "🍫", qty: 2, price: 560, unitPrice: 280, category: "Dessert", dineoutEligible: true, catalogPrice: 280, catalogStatus: "MATCH" },
      { id: 2, name: "Hot Butterscotch Sundae", emoji: "🍨", qty: 1, price: 210, unitPrice: 210, category: "Dessert", dineoutEligible: true, catalogPrice: 210, catalogStatus: "MATCH" },
      { id: 3, name: "Faded Thermal Item [Math Anomaly]", emoji: "🧾", qty: 1, price: 160, unitPrice: 160, category: "Dessert", dineoutEligible: true, catalogPrice: 160, catalogStatus: "OCR_LOW_CONFIDENCE", ocrConfidence: 0.72, ocrNote: "Print faded. Line items sum to ₹930, but printed subtotal is ₹930. Verified via dual-pass arithmetic reconstruction." }
    ],

    receiptSubtotal: 930.00,
    serviceChargePct: 0,
    serviceChargeAmount: 0.00,
    foodGstPct: 5,
    foodGstAmount: 46.50,
    liquorVatPct: 0,
    liquorVatAmount: 0.00,
    receiptGrandTotal: 976.50,

    violations: [
      {
        id: "v-ocr-4",
        type: "OCR_RESILIENCE",
        title: "Thermal Paper Fade Handled via Dual-Pass Math Engine",
        severity: "INFO",
        law: "Swiggy AI Vision Dual-Pass Bounding Box Protocol",
        explanation: "Faded thermal line item detected with 72% OCR confidence. Dual-pass arithmetic cross-check reconciled unit price x quantity against printed subtotal, achieving 100% mathematical integrity without customer friction.",
        removable: false
      },
      {
        id: "v-sc-zero",
        type: "SERVICE_CHARGE_COMPLIANT",
        title: "Clean Bill: Zero Service Charge Levied",
        severity: "SUCCESS",
        law: "CCPA Voluntary Compliance Verified",
        explanation: "Venue fully complies with legal norms; zero discretionary charges detected.",
        removable: false
      }
    ],

    // Dual-Way OCR Vision Bounding Boxes
    ocrBoundingBoxes: [
      { id: "box-ch-1", itemId: 1, label: "Death By Chocolate (DBC) [2x]", rate: 560, top: "27%", left: "5%", width: "90%", height: "7%", confidence: 0.98, type: "FOOD_ELIGIBLE", isReconciled: true },
      { id: "box-ch-2", itemId: 2, label: "Hot Butterscotch Sundae", rate: 210, top: "36%", left: "5%", width: "90%", height: "7%", confidence: 0.96, type: "FOOD_ELIGIBLE", isReconciled: true },
      { id: "box-ch-3", itemId: 3, label: "Faded Thermal Item [Math Anomaly]", rate: 160, top: "45%", left: "5%", width: "90%", height: "8%", confidence: 0.72, type: "OCR_LOW_CONFIDENCE", isReconciled: true, ocrNote: "Print faded. Dual-pass arithmetic reconciled unit rate against ₹930 subtotal" },
      { id: "box-ch-sub", label: "Printed Subtotal", rate: 930, top: "62%", left: "5%", width: "90%", height: "6%", confidence: 0.99, type: "SUBTOTAL", isReconciled: true },
      { id: "box-ch-gst", label: "CGST/SGST (5% Food)", rate: 46.50, top: "70%", left: "5%", width: "90%", height: "6%", confidence: 0.98, type: "FOOD_GST", isReconciled: true },
      { id: "box-ch-total", label: "Printed Docket Grand Total", rate: 976.50, top: "81%", left: "5%", width: "90%", height: "7%", confidence: 1.0, type: "TOTAL", isReconciled: true }
    ],

    guestSplits: [
      { guestName: "Diner 1 (1x DBC)", shareItems: ["Death by Chocolate (₹280)"], netPayable: 265.00 },
      { guestName: "Diner 2 (DBC + Sundae)", shareItems: ["Death by Chocolate + Sundae (₹490)"], netPayable: 463.00 }
    ],

    rdpEnrichment: {
      generatedHighlights: [
        "Bangalore's iconic Death By Chocolate with thick hot chocolate fudge",
        "Late-night dessert staple with prompt Dineout Pay checkout",
        "Clean, zero-dispute billing verified by Sentinel AI"
      ],
      dietaryTags: ["Dessert", "Late Night", "Vegetarian"],
      suggestedCostForTwo: "₹500 for two"
    }
  }
];

export const AUDIT_CAPABILITIES = [
  {
    id: "cap-sc",
    icon: "Scale",
    color: "#e5533d",
    badgeText: "CCPA 2022",
    shortTitle: "1. Service Charge Purge",
    description: "1-tap strike down on illicit 10% forced service charge.",
    highlightCase: "bill-toit-blr"
  },
  {
    id: "cap-mrp",
    icon: "Tag",
    color: "#f2b544",
    badgeText: "Legal Metrology",
    shortTitle: "2. Dual-MRP Guard",
    description: "Caps packaged water at statutory ₹20 printed MRP.",
    highlightCase: "bill-social-church"
  },
  {
    id: "cap-ghost",
    icon: "Ghost",
    color: "#e5533d",
    badgeText: "Anti-Fraud",
    shortTitle: "3. Ghost Item Detector",
    description: "Purges duplicate drinks & phantom unserved items.",
    highlightCase: "bill-social-church"
  },
  {
    id: "cap-tax",
    icon: "Percent",
    color: "#3b82f6",
    badgeText: "CGST Sec 15",
    shortTitle: "4. Tax Cascading Fix",
    description: "Strikes illegal 5% GST levied on top of service fee.",
    highlightCase: "bill-punjab-grill"
  },
  {
    id: "cap-split",
    icon: "Users",
    color: "#7fc79a",
    badgeText: "FairSplit UPI",
    shortTitle: "5. FairSplit UPI",
    description: "Decouples alcohol charges for non-drinking diners.",
    highlightCase: "bill-toit-blr"
  },
  {
    id: "cap-resilience",
    icon: "Cpu",
    color: "#a855f7",
    badgeText: "Dual-Pass OCR",
    shortTitle: "6. OCR Math Resilience",
    description: "Dual-pass arithmetic reconstructs wrinkled receipts.",
    highlightCase: "bill-corner-house"
  }
];
