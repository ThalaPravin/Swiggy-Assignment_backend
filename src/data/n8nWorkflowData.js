export const N8N_WORKFLOW_NODES = [
  {
    id: "node-trigger",
    name: "Batch Schedule / Real-time Webhook",
    type: "trigger",
    schedule: "Nightly Cron (02:00 AM IST) + Instant Table Checkout Webhook",
    status: "ACTIVE",
    description: "Ingests scanned customer checks from Dineout Pay and scheduled merchant POS exports across 32 cities.",
    metrics: "14,820 receipts / day processed"
  },
  {
    id: "node-dual-ocr",
    name: "Dual-Pass Multimodal Vision & Math OCR",
    type: "ai",
    model: "Claude 3.5 Sonnet / Gemini Flash (Hybrid Bounding Box)",
    status: "HEALTHY",
    description: "Executes Pass 1 (Vision OCR) + Pass 2 (Arithmetic Reconstruction). Handles wrinkled receipts, low ink, and faded thermal paper.",
    metrics: "OCR Accuracy: 99.4% | Fallback rate: 0.6%"
  },
  {
    id: "node-legal-audit",
    name: "Multi-Regulation Legal & Tax Audit",
    type: "logic",
    ruleSet: "CCPA 2022 + Legal Metrology Rules + CGST Sec 15",
    status: "ACTIVE",
    description: "Identifies 10% voluntary service fees, dual-MRP water gouging, ghost items, and illegal tax-on-tax cascading.",
    metrics: "₹4.6L in illegal fees & overcharges intercepted daily"
  },
  {
    id: "node-catalog-moderator",
    name: "Catalog Hygiene Moderator",
    type: "database",
    targetTable: "swiggy_dineout_master_catalog",
    status: "RUNNING",
    description: "Compares scanned receipt items and prices against live Swiggy Dineout RDP listings. Calculates price drift delta.",
    metrics: "512 price drifts resolved automatically"
  },
  {
    id: "node-merchant-compliance",
    name: "Merchant Compliance & Strike Engine",
    type: "branch",
    threshold: "3 Strikes Rule (MRP Gouging / Forced Service Fee)",
    status: "ACTIVE",
    description: "Tracks repeat partner violations. Auto-dispatches WhatsApp compliance notice and demotes Dineout search rank by 15%.",
    metrics: "18 partner warnings issued this week"
  },
  {
    id: "node-rdp-enrichment",
    name: "Web RDP Content Enrichment",
    type: "ai",
    stream: "Content Generation Pipeline",
    status: "ACTIVE",
    description: "Synthesizes dish popularity, receipt frequency, and customer reviews into 3-bullet highlights, FAQs, and dietary tags.",
    metrics: "1,240 restaurant RDPs enriched / week"
  },
  {
    id: "node-npr-generator",
    name: "Search-linked NPR Mining",
    type: "analytics",
    stream: "Growth & Supply Pipeline",
    status: "ACTIVE",
    description: "Correlates null/abandoned customer search queries with receipt data to identify unlisted trending dishes and new POIs.",
    metrics: "34 new trending POIs flagged for onboarding"
  }
];

export const RECENT_CATALOG_AUDIT_LOGS = [
  {
    id: "log-1",
    restaurant: "Toit Brewpub (Indiranagar)",
    item: "BBQ Smoked Chicken Wings",
    oldCatalogPrice: 390,
    newReceiptPrice: 440,
    variance: "+12.8%",
    confidenceScore: 0.98,
    action: "AUTO_UPDATED",
    violationType: "Catalog Drift",
    timestamp: "12 mins ago",
    triggeredBy: "Diner Bill Scan #8849"
  },
  {
    id: "log-2",
    restaurant: "Church Street Social",
    item: "Kinley Packaged Water (1L)",
    oldCatalogPrice: 20,
    newReceiptPrice: 90,
    variance: "+350% above MRP",
    confidenceScore: 0.99,
    action: "MRP_ROLLBACK",
    violationType: "Legal Metrology Overcharge",
    timestamp: "24 mins ago",
    triggeredBy: "Diner Bill Scan #5521"
  },
  {
    id: "log-3",
    restaurant: "Church Street Social",
    item: "Social Electric LIIT (Phantom Item)",
    oldCatalogPrice: 680,
    newReceiptPrice: 1360,
    variance: "2x billed vs 1x delivered",
    confidenceScore: 0.94,
    action: "FLAGGED_DISPUTE",
    violationType: "Ghost / Phantom Item",
    timestamp: "28 mins ago",
    triggeredBy: "Diner Bill Scan #5521"
  },
  {
    id: "log-4",
    restaurant: "Punjab Grill (Koramangala)",
    item: "Tax-on-Tax Cascading Error",
    oldCatalogPrice: 92.75,
    newReceiptPrice: 102.03,
    variance: "+₹9.28 tax on service fee",
    confidenceScore: 0.99,
    action: "TAX_CORRECTED",
    violationType: "CGST Cascading Error",
    timestamp: "1 hr ago",
    triggeredBy: "Table 04 Scan #9923"
  },
  {
    id: "log-5",
    restaurant: "Corner House (Residency Rd)",
    item: "Faded Thermal Print Item",
    oldCatalogPrice: 160,
    newReceiptPrice: 160,
    variance: "OCR Confidence 72% -> Reconciled via Math",
    confidenceScore: 0.99,
    action: "DUAL_PASS_RECONCILED",
    violationType: "Low-Ink Edge Case",
    timestamp: "2 hrs ago",
    triggeredBy: "Nightly Cron Batch #108"
  }
];

export const MERCHANT_COMPLIANCE_WATCHLIST = [
  {
    id: "comp-1",
    restaurant: "Church Street Social",
    strikes: 2,
    violations: "Dual MRP water overcharging (2 reports), Discretionary Service Fee (14 reports)",
    status: "WARNING_DISPATCHED",
    penaltyApplied: "Dineout Search Visibility throttled by -15%",
    lastNoticeDate: "Today, 02:00 AM Cron"
  },
  {
    id: "comp-2",
    restaurant: "Bastian (Koramangala)",
    strikes: 3,
    violations: "Mandatory 12% Service Charge refusals at cashier counter",
    status: "ESCALATED_TO_BD_HEAD",
    penaltyApplied: "Temporary suspension of Dineout Pay Premier badge",
    lastNoticeDate: "Yesterday"
  },
  {
    id: "comp-3",
    restaurant: "Toit Brewpub",
    strikes: 0,
    violations: "Price drift on 1 item (Auto-resolved). Service charge removed voluntarily without dispute.",
    status: "GOOD_STANDING",
    penaltyApplied: "None (High Trust Partner)",
    lastNoticeDate: "N/A"
  }
];

export const BANGALORE_METRO_CORRIDORS = {
  ALL: {
    id: "ALL",
    label: "All Clusters (32)",
    shortLabel: "All Clusters",
    tag: "Citywide Metro Network",
    nullSearches: "14,820",
    supplyDeficitDishes: [
      "Lotus Biscoff Kunafa", 
      "Smoked Pork Ribs", 
      "Truffle Edamame", 
      "Turkish Pide", 
      "Matcha Tiramisu",
      "San Sebastian Cheesecake"
    ],
    estimatedGmvRecovery: "₹42.8 Lakhs",
    merchantTargetsCount: 18,
    activeHotspots: "32 Geo-clusters · 284 Venue Dockets",
    topMerchants: [
      { id: "m-1", name: "Levant Lebanese Bistro", cluster: "Indiranagar (12th Main)", dishes: ["Lotus Biscoff Kunafa", "Truffle Hummus"], projectedLift: "+₹4.2L GMV/mo", contact: "bd.indiranagar@swiggy.in", status: "PENDING_OUTREACH" },
      { id: "m-2", name: "Toit Brewpub", cluster: "Indiranagar (100ft Rd)", dishes: ["Smoked Pork Ribs", "Dry Stout"], projectedLift: "+₹6.5L GMV/mo", contact: "merchant.ops@toit.in", status: "PENDING_OUTREACH" },
      { id: "m-3", name: "The Hole in the Wall Cafe", cluster: "Koramangala (4th Block)", dishes: ["Matcha Boba Tiramisu", "Turkish Pide"], projectedLift: "+₹3.8L GMV/mo", contact: "koramangala.lead@swiggy.in", status: "PENDING_OUTREACH" },
      { id: "m-4", name: "Church Street Social", cluster: "Central CBD (Church St)", dishes: ["San Sebastian Cheesecake", "Crispy Enoki Tempura"], projectedLift: "+₹5.1L GMV/mo", contact: "cbd.partners@swiggy.in", status: "PENDING_OUTREACH" },
      { id: "m-5", name: "Windmills Craftworks", cluster: "Whitefield Tech Hub (EPIP)", dishes: ["Hoppy Session Ales", "Authentic Tonkotsu Ramen"], projectedLift: "+₹4.9L GMV/mo", contact: "whitefield.bd@swiggy.in", status: "PENDING_OUTREACH" },
      { id: "m-6", name: "Third Wave Coffee Roasters", cluster: "HSR Layout (Sector 4)", dishes: ["Gluten-free Artisanal Sourdough", "Açaí Smoothie Bowls"], projectedLift: "+₹2.6L GMV/mo", contact: "hsr.field@swiggy.in", status: "PENDING_OUTREACH" }
    ],
    nprCards: [
      {
        id: "npr-all-1",
        query: "Lotus Biscoff Kunafa Indiranagar",
        abandonedCount: 1820,
        location: "Indiranagar 12th Main",
        matchedSupply: "Found on 14 guest checks at 'Levant Lebanese Bistro'",
        recommendation: "Tag Levant catalog with #Kunafa & surface in top 3 results",
        impact: "+22% search recovery conversion"
      },
      {
        id: "npr-all-2",
        query: "Smoked Pork Ribs craft beer Indiranagar",
        abandonedCount: 1540,
        location: "100ft Rd, Indiranagar",
        matchedSupply: "Found on kitchen specials docket at 'Toit'",
        recommendation: "Auto-ingest specials docket into Toit live Dineout menu",
        impact: "Estimated ₹6.5L GMV unlocked"
      },
      {
        id: "npr-all-3",
        query: "Turkish Pide woodfired Koramangala",
        abandonedCount: 1490,
        location: "5th Block, Koramangala",
        matchedSupply: "Scanned on 11 dockets at 'The Hole in the Wall & Mezzeh'",
        recommendation: "Prompt 4 Italian/Mediterranean partners to add Pide variation",
        impact: "+28% search-to-table rate"
      },
      {
        id: "npr-all-4",
        query: "San Sebastian Cheesecake Church Street",
        abandonedCount: 1380,
        location: "Church Street, Central CBD",
        matchedSupply: "Scanned in 22 dessert checks at 'Church Street Social & Matteo'",
        recommendation: "Sync dessert pantry docket into live Dineout catalog",
        impact: "+34% sweet-tooth conversion"
      },
      {
        id: "npr-all-5",
        query: "Authentic Tonkotsu Ramen Whitefield",
        abandonedCount: 1180,
        location: "EPIP Zone, Whitefield",
        matchedSupply: "Scanned at 'Windmills Craftworks' kitchen dockets",
        recommendation: "Highlight Japanese special bowl on Windmills RDP hero section",
        impact: "+40% dinner booking surge"
      },
      {
        id: "npr-all-6",
        query: "Pet friendly rooftop craft beer HSR",
        abandonedCount: 980,
        location: "HSR Layout Sector 1",
        matchedSupply: "New venue 'The Reservoir HSR' detected via POI pipeline",
        recommendation: "Priority BD Onboarding; High demand cluster",
        impact: "Estimated ₹2.4L GMV in table reservations"
      }
    ]
  },

  INDIRANAGAR: {
    id: "INDIRANAGAR",
    label: "Indiranagar Corridor",
    shortLabel: "Indiranagar",
    tag: "100ft & 12th Main Nightlife Hub",
    nullSearches: "4,620",
    supplyDeficitDishes: ["Lotus Biscoff Kunafa", "Smoked Pork Ribs", "Truffle Edamame"],
    estimatedGmvRecovery: "₹14.2 Lakhs",
    merchantTargetsCount: 5,
    activeHotspots: "12th Main · 100ft Road · Defence Colony",
    topMerchants: [
      { id: "m-ind-1", name: "Levant Lebanese Bistro", cluster: "Indiranagar (12th Main)", dishes: ["Lotus Biscoff Kunafa", "Truffle Hummus"], projectedLift: "+₹4.2L GMV/mo", contact: "bd.indiranagar@swiggy.in", status: "PENDING_OUTREACH" },
      { id: "m-ind-2", name: "Toit Brewpub", cluster: "Indiranagar (100ft Rd)", dishes: ["Smoked Pork Ribs", "Dry Stout"], projectedLift: "+₹6.5L GMV/mo", contact: "merchant.ops@toit.in", status: "PENDING_OUTREACH" },
      { id: "m-ind-3", name: "Lucky Chan Dim Sum House", cluster: "Defence Colony, Indiranagar", dishes: ["Truffle Edamame Dumplings", "Matcha Bao"], projectedLift: "+₹3.5L GMV/mo", contact: "luckychan.partner@swiggy.in", status: "PENDING_OUTREACH" }
    ],
    nprCards: [
      {
        id: "npr-ind-1",
        query: "Lotus Biscoff Kunafa Indiranagar",
        abandonedCount: 1820,
        location: "12th Main, Indiranagar",
        matchedSupply: "Found on 14 guest checks at 'Levant Lebanese Bistro'",
        recommendation: "Tag Levant catalog with #Kunafa & surface in top 3 results",
        impact: "+22% search recovery conversion"
      },
      {
        id: "npr-ind-2",
        query: "Smoked Pork Ribs craft beer Indiranagar",
        abandonedCount: 1540,
        location: "100ft Rd, Indiranagar",
        matchedSupply: "Found on kitchen specials docket at 'Toit'",
        recommendation: "Auto-ingest specials docket into Toit live Dineout menu",
        impact: "Estimated ₹6.5L GMV unlocked"
      },
      {
        id: "npr-ind-3",
        query: "Truffle Edamame dumplings Indiranagar",
        abandonedCount: 1260,
        location: "Defence Colony, Indiranagar",
        matchedSupply: "Scanned in 8 dockets at 'Lucky Chan'",
        recommendation: "Add Pan-Asian vegan tag to search facets",
        impact: "+15% discovery uplift"
      }
    ]
  },

  KORAMANGALA: {
    id: "KORAMANGALA",
    label: "Koramangala 5th Block",
    shortLabel: "Koramangala",
    tag: "Gen-Z & Tech Startup Density Hub",
    nullSearches: "3,890",
    supplyDeficitDishes: ["Turkish Pide", "Matcha Boba Tiramisu", "Korean Corn Dogs"],
    estimatedGmvRecovery: "₹11.6 Lakhs",
    merchantTargetsCount: 4,
    activeHotspots: "5th Block · 6th Block · 80ft Road",
    topMerchants: [
      { id: "m-kor-1", name: "The Hole in the Wall Cafe", cluster: "Koramangala (4th Block)", dishes: ["Matcha Boba Tiramisu", "Sourdough French Toast"], projectedLift: "+₹3.8L GMV/mo", contact: "koramangala.lead@swiggy.in", status: "PENDING_OUTREACH" },
      { id: "m-kor-2", name: "Boba Bae Lounge", cluster: "Koramangala (5th Block)", dishes: ["Korean Corn Dogs", "Brown Sugar Boba"], projectedLift: "+₹3.1L GMV/mo", contact: "bobabae.partner@swiggy.in", status: "PENDING_OUTREACH" },
      { id: "m-kor-3", name: "Bastian", cluster: "Koramangala (80ft Rd)", dishes: ["Turkish Pide", "Lobster Mac & Cheese"], projectedLift: "+₹4.7L GMV/mo", contact: "bastian.audit@swiggy.in", status: "PENDING_OUTREACH" }
    ],
    nprCards: [
      {
        id: "npr-kor-1",
        query: "Turkish Pide woodfired Koramangala",
        abandonedCount: 1490,
        location: "5th Block, Koramangala",
        matchedSupply: "Scanned on 11 dockets at 'The Hole in the Wall & Mezzeh'",
        recommendation: "Prompt 4 Italian/Mediterranean partners to add Pide variation",
        impact: "+28% search-to-table rate"
      },
      {
        id: "npr-kor-2",
        query: "Keto almond flour pasta Koramangala",
        abandonedCount: 1240,
        location: "6th Block, Koramangala",
        matchedSupply: "Found as unlisted secret special at 'Smoke House Deli'",
        recommendation: "Enrich Smoke House Deli RDP with 'Keto Pasta' tag",
        impact: "Recovers 85% abandoned searches"
      },
      {
        id: "npr-kor-3",
        query: "Matcha Boba Tiramisu Koramangala",
        abandonedCount: 1160,
        location: "1st Block, Koramangala",
        matchedSupply: "Surfaced in Instagram reviews for 'Boba Bae Lounge'",
        recommendation: "Catalog tag enrichment & highlight badge",
        impact: "Estimated ₹2.4L GMV"
      }
    ]
  },

  CBD: {
    id: "CBD",
    label: "Central CBD (Church St)",
    shortLabel: "Central CBD",
    tag: "MG Road & Church Street Footfall",
    nullSearches: "3,150",
    supplyDeficitDishes: ["San Sebastian Cheesecake", "Crispy Enoki Tempura", "Craft Mead On Tap"],
    estimatedGmvRecovery: "₹9.4 Lakhs",
    merchantTargetsCount: 3,
    activeHotspots: "Church Street · Lavelle Road · MG Road",
    topMerchants: [
      { id: "m-cbd-1", name: "Church Street Social", cluster: "Central CBD (Church St)", dishes: ["San Sebastian Cheesecake", "Crispy Enoki Tempura"], projectedLift: "+₹5.1L GMV/mo", contact: "cbd.partners@swiggy.in", status: "PENDING_OUTREACH" },
      { id: "m-cbd-2", name: "Matteo Coffea", cluster: "Church Street, CBD", dishes: ["Basque Burnt Cheesecake", "Single Origin Pour-over"], projectedLift: "+₹2.2L GMV/mo", contact: "matteo.mgr@swiggy.in", status: "PENDING_OUTREACH" },
      { id: "m-cbd-3", name: "The Biere Club", cluster: "Lavelle Road, CBD", dishes: ["Craft Mead On Tap", "Belgian Frites"], projectedLift: "+₹2.1L GMV/mo", contact: "biere.club@swiggy.in", status: "PENDING_OUTREACH" }
    ],
    nprCards: [
      {
        id: "npr-cbd-1",
        query: "San Sebastian Cheesecake Church Street",
        abandonedCount: 1380,
        location: "Church Street, Central CBD",
        matchedSupply: "Scanned in 22 dessert checks at 'Church Street Social & Matteo'",
        recommendation: "Sync dessert pantry docket into live Dineout catalog",
        impact: "+34% sweet-tooth conversion"
      },
      {
        id: "npr-cbd-2",
        query: "Crispy Enoki Tempura CBD",
        abandonedCount: 970,
        location: "Lavelle Road, CBD",
        matchedSupply: "Found on bar menu at 'Church Street Social'",
        recommendation: "Tag as trending high-margin bar snack",
        impact: "Estimated ₹2.8L GMV"
      },
      {
        id: "npr-cbd-3",
        query: "Craft Mead On Tap Bangalore CBD",
        abandonedCount: 800,
        location: "Vittal Mallya Rd, CBD",
        matchedSupply: "Moonshine Mead tap detected at 'The Biere Club'",
        recommendation: "Add 'Craft Meadery' badge to venue profile",
        impact: "+19% taproom booking lift"
      }
    ]
  },

  WHITEFIELD: {
    id: "WHITEFIELD",
    label: "Whitefield Tech Hub",
    shortLabel: "Whitefield",
    tag: "EPIP IT Corridor & Luxury Expats",
    nullSearches: "2,120",
    supplyDeficitDishes: ["Hoppy Session Ales", "Authentic Tonkotsu Ramen", "Gluten-Free Thin Crust"],
    estimatedGmvRecovery: "₹6.8 Lakhs",
    merchantTargetsCount: 3,
    activeHotspots: "EPIP Zone · ITPL Main Rd · VR Bengaluru",
    topMerchants: [
      { id: "m-whi-1", name: "Windmills Craftworks", cluster: "Whitefield Tech Hub (EPIP)", dishes: ["Hoppy Session Ales", "Authentic Tonkotsu Ramen"], projectedLift: "+₹4.9L GMV/mo", contact: "whitefield.bd@swiggy.in", status: "PENDING_OUTREACH" },
      { id: "m-whi-2", name: "The Whitefield Arms", cluster: "VR Bengaluru, Whitefield", dishes: ["Gluten-Free Thin Crust", "Fish & Chips"], projectedLift: "+₹1.9L GMV/mo", contact: "arms.partner@swiggy.in", status: "PENDING_OUTREACH" }
    ],
    nprCards: [
      {
        id: "npr-whi-1",
        query: "Authentic Tonkotsu Ramen Whitefield",
        abandonedCount: 1180,
        location: "EPIP Zone, Whitefield",
        matchedSupply: "Scanned at 'Windmills Craftworks' kitchen dockets",
        recommendation: "Highlight Japanese special bowl on Windmills RDP hero section",
        impact: "+40% dinner booking surge"
      },
      {
        id: "npr-whi-2",
        query: "Hoppy Session Ales ITPL",
        abandonedCount: 940,
        location: "ITPL Main Rd, Whitefield",
        matchedSupply: "Rotating tap microbrewery check at 'Biergarten'",
        recommendation: "Sync live beer tap list with Dineout app",
        impact: "Estimated ₹2.9L GMV"
      }
    ]
  },

  HSR: {
    id: "HSR",
    label: "HSR Layout Sector 4",
    shortLabel: "HSR Layout",
    tag: "Early Stage Tech Founders & Wellness Hub",
    nullSearches: "1,040",
    supplyDeficitDishes: ["Gluten-free Artisanal Sourdough", "Açaí Smoothie Bowls", "Cold Pressed Elixirs"],
    estimatedGmvRecovery: "₹4.8 Lakhs",
    merchantTargetsCount: 3,
    activeHotspots: "Sector 4 · 27th Main · Sector 1 Park",
    topMerchants: [
      { id: "m-hsr-1", name: "Third Wave Coffee Roasters", cluster: "HSR Layout (Sector 4)", dishes: ["Gluten-free Artisanal Sourdough", "Açaí Smoothie Bowls"], projectedLift: "+₹2.6L GMV/mo", contact: "hsr.field@swiggy.in", status: "PENDING_OUTREACH" },
      { id: "m-hsr-2", name: "The Reservoir HSR", cluster: "HSR Layout (Sector 1)", dishes: ["Pet Friendly Dining", "Craft Cocktails"], projectedLift: "+₹2.2L GMV/mo", contact: "reservoir.hsr@swiggy.in", status: "PENDING_OUTREACH" }
    ],
    nprCards: [
      {
        id: "npr-hsr-1",
        query: "Pet friendly rooftop craft beer HSR",
        abandonedCount: 980,
        location: "HSR Layout Sector 1",
        matchedSupply: "New venue 'The Reservoir HSR' detected via POI pipeline",
        recommendation: "Priority BD Onboarding; High demand cluster",
        impact: "Estimated ₹2.4L GMV in table reservations"
      },
      {
        id: "npr-hsr-2",
        query: "Gluten-free Artisanal Sourdough HSR",
        abandonedCount: 860,
        location: "HSR Layout Sector 4",
        matchedSupply: "Scanned in breakfast slips at 'Third Wave Coffee'",
        recommendation: "Tag bakery specialty for breakfast searches",
        impact: "+26% AM discovery conversion"
      }
    ]
  }
};

export const SEARCH_LINKED_NPR_DATA = BANGALORE_METRO_CORRIDORS.ALL.nprCards;

