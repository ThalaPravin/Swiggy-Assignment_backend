# 🚀 Swiggy Dineout Sentinel AI — Comprehensive Dining Audit & Catalog Flywheel

> **Submission for Product Innovation with GenAI — Swiggy Dineout Product Management (Bangalore HO)**  
> **Candidate**: Pravin Somnath Avhad (`pravinavhad3597@gmail.com`)

---

## 📌 Live Demo & Local Setup

### 1. Run Locally
```bash
cd "c:\Users\pravin\Desktop\Swiggy Project"
npm install
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 2. Deploy Live in 60 Seconds (Free Public URL)
The production build is already pre-compiled in `dist/`.

#### Option A: Drag-and-Drop (Netlify Drop)
1. Open **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
2. Drag and drop the `dist/` folder from this directory.
3. Get your instant public URL (e.g. `https://swiggy-dineout-sentinel.netlify.app`)!

#### Option B: Deploy via Vercel CLI
```bash
npx vercel
```

---

## 🎯 The 6 Core Dining Problems Solved End-to-End

| Problem Solved | Real-World Dining Trap in India | Legal / Algorithmic Sentinel AI Solution |
| :--- | :--- | :--- |
| **1. Discretionary Service Fee Purge** | 10% added without consent disguised as statutory tax. | **CCPA 2022 Mandate**: 1-tap voluntary fee purge. |
| **2. Dual-MRP Water & Packaged Gouging** | Bottled water (MRP ₹20) billed at ₹90 (+350% mark-up). | **Legal Metrology Rules 2017**: Automatic rollback to printed ₹20 MRP. |
| **3. Ghost / Phantom Item Detector** | Extra cocktails/bread baskets billed by mistake or fraud. | **Session Cross-Check**: Flags unverified duplicate items for instant dispute. |
| **4. Tax-on-Tax Cascading Fix** | 5% GST levied *after* adding the 10% Service Charge. | **CGST Act Section 15**: Recalculates true base tax, eliminating cascading tax surplus. |
| **5. FairSplit UPI Group Math** | Non-drinkers and vegetarians forced to subsidize cocktails. | **Zero-Subsidy Split**: Isolates alcohol vs food + generates individual UPI QR codes. |
| **6. Low-Ink OCR & Math Resilience** | Wrinkled receipts or faded thermal prints cause OCR errors. | **Dual-Pass Bounding Box & Arithmetic Cross-Check**: Reconciles unit price $\times$ qty against subtotal. |

---

## 🧪 4 Interactive Test Cases Included in Prototype

1. **Case 1: "The Brewery Ambush" (Toit Brewpub, Indiranagar)**
   - *Solves*: 10% Service Charge Purge + Liquor Excise Tax vs Food GST isolation + BBQ Wings Price Drift (+₹50 vs Swiggy DB).
2. **Case 2: "The Phantom Item & MRP Gouging" (Church Street Social)**
   - *Solves*: Kinley Water ₹90 rollback to ₹20 + 2nd unserved LIIT cocktail dispute (-₹680) + FairSplit between drinker and non-drinker.
3. **Case 3: "The Tax-on-Tax Cascading Trap" (Punjab Grill, Koramangala)**
   - *Solves*: GST applied on top of Service Charge purged + Swiggy One GIRF 25% Mega Offer validated.
4. **Case 4: "Low-Ink Thermal & Broken Math" (Corner House, Residency Rd)**
   - *Solves*: Wrinkled/faded receipt handled via Dual-Pass math engine with zero hallucinations.

---

## ⚙️ The Nightly Cron & n8n Engine (Operational Flywheel)

- **Catalog Hygiene Moderator**: Audits in-venue receipt prices against Swiggy's master catalog. Auto-corrects if confidence $\ge 95\%$, queues for ops review if $< 95\%$.
- **Partner Compliance & 3-Strikes Engine**: Tracks venues with repeated MRP gouging or forced service fee disputes. Automatically throttles search visibility by -15% or suspends Premier badge.
- **Web RDP Content Enrichment**: Auto-generates review highlights, dietary tags, and cost-for-two estimates.
- **Search-linked NPR Mining**: Connects abandoned customer searches (e.g. *"Lotus Biscoff Kunafa"*) with receipt items to prioritize supply onboarding.
