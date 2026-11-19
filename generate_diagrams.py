import os
from PIL import Image, ImageDraw, ImageFont

FONTS_DIR = r"C:\Windows\Fonts"
FONT_BOLD_PATH = os.path.join(FONTS_DIR, "segoeuib.ttf")
FONT_REG_PATH = os.path.join(FONTS_DIR, "segoeui.ttf")

COLOR_BG = (250, 250, 252)
COLOR_WHITE = (255, 255, 255)
COLOR_BORDER = (226, 232, 240)
COLOR_ORANGE = (252, 128, 25) # #fc8019
COLOR_ORANGE_LIGHT = (255, 243, 230)
COLOR_DARK = (15, 23, 42)
COLOR_MUTED = (100, 116, 139)
COLOR_GREEN = (16, 185, 129)
COLOR_GREEN_LIGHT = (236, 253, 245)
COLOR_PURPLE = (147, 51, 234)
COLOR_PURPLE_LIGHT = (250, 245, 255)

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_arrow(draw, start, end, color=COLOR_ORANGE, width=4):
    x1, y1 = start
    x2, y2 = end
    draw.line([start, end], fill=color, width=width)
    arrow_size = 10
    draw.polygon([
        (x2, y2),
        (x2 - arrow_size, y2 - arrow_size * 0.6),
        (x2 - arrow_size * 0.6, y2),
        (x2 - arrow_size, y2 + arrow_size * 0.6)
    ], fill=color)

def generate_sentinel_diagram(output_path):
    W, H = 2200, 780
    img = Image.new('RGB', (W, H), COLOR_BG)
    draw = ImageDraw.Draw(img)

    f_title = get_font(FONT_BOLD_PATH, 34)
    f_sub = get_font(FONT_REG_PATH, 20)
    f_card_title = get_font(FONT_BOLD_PATH, 24)
    f_card_sub = get_font(FONT_BOLD_PATH, 16)
    f_body = get_font(FONT_REG_PATH, 17)
    f_badge = get_font(FONT_BOLD_PATH, 14)

    # Title Banner
    draw.text((60, 40), "SWIGGY DINEOUT SENTINEL AI — END-TO-END DUAL FLYWHEEL ARCHITECTURE", fill=COLOR_DARK, font=f_title)
    draw.text((60, 85), "Multimodal Vision OCR Interrogation (Diner Front) ⟷ Nightly 02:00 AM Master Catalog Synchronization (Ops Back)", fill=COLOR_MUTED, font=f_sub)

    # 4 Pipeline Cards
    card_w = 480
    card_h = 560
    card_y = 140
    xs = [60, 590, 1120, 1650]

    # Stage 1: Diner Vision OCR
    x1 = xs[0]
    draw.rounded_rectangle([x1, card_y, x1 + card_w, card_y + card_h], radius=16, fill=COLOR_WHITE, outline=COLOR_BORDER, width=2)
    draw.rounded_rectangle([x1 + 18, card_y + 18, x1 + card_w - 18, card_y + 60], radius=8, fill=COLOR_ORANGE_LIGHT)
    draw.text((x1 + 30, card_y + 28), "STAGE 1: RECEIPT VISION OCR", fill=COLOR_ORANGE, font=f_card_sub)
    draw.text((x1 + 30, card_y + 80), "Multimodal Bill Ingestion", fill=COLOR_DARK, font=f_card_title)
    
    items_1 = [
        ("• Dual-Pass Vision OCR:", "Extracts degraded thermal receipts (<75% ink density)."),
        ("• Arithmetic Reconciliation:", "Cross-checks unit_price × qty against printed subtotal."),
        ("• Tax Category Classifier:", "Segregates Food vs Alcohol vs Packaged Commodities."),
        ("• Ground-Truth Parsing:", "Converts printed paper into structured JSON item dockets.")
    ]
    cur_y = card_y + 130
    for header, desc in items_1:
        draw.text((x1 + 30, cur_y), header, fill=COLOR_DARK, font=f_card_sub)
        draw.text((x1 + 30, cur_y + 24), desc, fill=COLOR_MUTED, font=f_body)
        cur_y += 72
    
    draw.rounded_rectangle([x1 + 30, card_y + card_h - 65, x1 + card_w - 30, card_y + card_h - 25], radius=6, fill=(241, 245, 249))
    draw.text((x1 + 45, card_y + card_h - 52), "LATENCY: 42ms · PARSE CONFIDENCE: 98.4%", fill=COLOR_MUTED, font=f_badge)

    # Stage 2: Table Interrogation Room
    x2 = xs[1]
    draw.rounded_rectangle([x2, card_y, x2 + card_w, card_y + card_h], radius=16, fill=COLOR_WHITE, outline=COLOR_BORDER, width=2)
    draw.rounded_rectangle([x2 + 18, card_y + 18, x2 + card_w - 18, card_y + 60], radius=8, fill=COLOR_GREEN_LIGHT)
    draw.text((x2 + 30, card_y + 28), "STAGE 2: TABLE INTERROGATION", fill=COLOR_GREEN, font=f_card_sub)
    draw.text((x2 + 30, card_y + 80), "Statutory Enforcement", fill=COLOR_DARK, font=f_card_title)

    items_2 = [
        ("• 1-Tap CCPA Decoupling:", "Strips forced 10% service fee (CCPA 2022 §3 advisory)."),
        ("• Legal Metrology Rollback:", "Caps packaged water from ₹90 to ₹20 MRP ceiling."),
        ("• Cascaded Tax Elimination:", "Prevents CGST §15 tax-on-tax compounding on service fees."),
        ("• FairSplit UPI Protocol:", "Decouples alcohol VAT; generates zero-subsidy QR splits.")
    ]
    cur_y = card_y + 130
    for header, desc in items_2:
        draw.text((x2 + 30, cur_y), header, fill=COLOR_DARK, font=f_card_sub)
        draw.text((x2 + 30, cur_y + 24), desc, fill=COLOR_MUTED, font=f_body)
        cur_y += 72

    draw.rounded_rectangle([x2 + 30, card_y + card_h - 65, x2 + card_w - 30, card_y + card_h - 25], radius=6, fill=COLOR_GREEN_LIGHT)
    draw.text((x2 + 45, card_y + card_h - 52), "DINER BENEFIT: ₹233 SAVED + ZERO ANXIETY", fill=COLOR_GREEN, font=f_badge)

    # Stage 3: Nightly Cron Flywheel
    x3 = xs[2]
    draw.rounded_rectangle([x3, card_y, x3 + card_w, card_y + card_h], radius=16, fill=COLOR_WHITE, outline=COLOR_BORDER, width=2)
    draw.rounded_rectangle([x3 + 18, card_y + 18, x3 + card_w - 18, card_y + 60], radius=8, fill=COLOR_ORANGE_LIGHT)
    draw.text((x3 + 30, card_y + 28), "STAGE 3: 02:00 AM CRON FLYWHEEL", fill=COLOR_ORANGE, font=f_card_sub)
    draw.text((x3 + 30, card_y + 80), "Automated n8n Pipeline", fill=COLOR_DARK, font=f_card_title)

    items_3 = [
        ("• Anonymous Bill Pool:", "Ingests daytime customer receipts as ground-truth audits."),
        ("• Master Catalog Diff Engine:", "Compares scanned prices against Dineout PostgreSQL DB."),
        ("• Variance Calculation:", "Detects +12% to +25% unannounced merchant menu inflation."),
        ("• Zero Field Auditor Cost:", "Replaces physical field auditors with software crons.")
    ]
    cur_y = card_y + 130
    for header, desc in items_3:
        draw.text((x3 + 30, cur_y), header, fill=COLOR_DARK, font=f_card_sub)
        draw.text((x3 + 30, cur_y + 24), desc, fill=COLOR_MUTED, font=f_body)
        cur_y += 72

    draw.rounded_rectangle([x3 + 30, card_y + card_h - 65, x3 + card_w - 30, card_y + card_h - 25], radius=6, fill=COLOR_ORANGE_LIGHT)
    draw.text((x3 + 45, card_y + card_h - 52), "COST SAVING: 80% REDUCTION IN AUDIT OPEX", fill=COLOR_ORANGE, font=f_badge)

    # Stage 4: Catalog Intelligence & NPR
    x4 = xs[3]
    draw.rounded_rectangle([x4, card_y, x4 + card_w, card_y + card_h], radius=16, fill=COLOR_WHITE, outline=COLOR_BORDER, width=2)
    draw.rounded_rectangle([x4 + 18, card_y + 18, x4 + card_w - 18, card_y + 60], radius=8, fill=COLOR_PURPLE_LIGHT)
    draw.text((x4 + 30, card_y + 28), "STAGE 4: CATALOG OPS & NPR MINING", fill=COLOR_PURPLE, font=f_card_sub)
    draw.text((x4 + 30, card_y + 80), "Confidence Routing", fill=COLOR_DARK, font=f_card_title)

    items_4 = [
        ("• Auto-Commit Gate (≥95%):", "High confidence price drifts committed automatically."),
        ("• Human Ops Queue (>20%):", "Extreme outliers quarantined for 1-click ops review."),
        ("• Search-Linked NPR Engine:", "Correlates null search queries (e.g. Kunafa) with receipts."),
        ("• Automated BD Dispatch:", "Queues partner onboarding packs to capture lost GMV.")
    ]
    cur_y = card_y + 130
    for header, desc in items_4:
        draw.text((x4 + 30, cur_y), header, fill=COLOR_DARK, font=f_card_sub)
        draw.text((x4 + 30, cur_y + 24), desc, fill=COLOR_MUTED, font=f_body)
        cur_y += 72

    draw.rounded_rectangle([x4 + 30, card_y + card_h - 65, x4 + card_w - 30, card_y + card_h - 25], radius=6, fill=COLOR_PURPLE_LIGHT)
    draw.text((x4 + 45, card_y + card_h - 52), "INTELLIGENCE: PG MASTER DB + RABBITMQ QUEUE", fill=COLOR_PURPLE, font=f_badge)

    # Connecting Arrows between cards
    draw_arrow(draw, (x1 + card_w + 10, card_y + card_h // 2), (x2 - 10, card_y + card_h // 2), COLOR_ORANGE, 5)
    draw_arrow(draw, (x2 + card_w + 10, card_y + card_h // 2), (x3 - 10, card_y + card_h // 2), COLOR_ORANGE, 5)
    draw_arrow(draw, (x3 + card_w + 10, card_y + card_h // 2), (x4 - 10, card_y + card_h // 2), COLOR_ORANGE, 5)

    img.save(output_path, 'PNG', dpi=(300, 300))
    print(f"Saved: {output_path}")

def generate_tastedna_diagram(output_path):
    W, H = 2200, 780
    img = Image.new('RGB', (W, H), COLOR_BG)
    draw = ImageDraw.Draw(img)

    f_title = get_font(FONT_BOLD_PATH, 34)
    f_sub = get_font(FONT_REG_PATH, 20)
    f_card_title = get_font(FONT_BOLD_PATH, 24)
    f_card_sub = get_font(FONT_BOLD_PATH, 16)
    f_body = get_font(FONT_REG_PATH, 17)
    f_badge = get_font(FONT_BOLD_PATH, 14)

    # Title Banner
    draw.text((60, 40), "TASTEDNA — AUTONOMOUS PALATE GRAPH & MULTI-USER CENTROID ENGINE", fill=COLOR_DARK, font=f_title)
    draw.text((60, 85), "Multimodal Flavor Vectorization ⟷ Mathematical Group Palate Centroid ⟷ Autonomous Booking Rails", fill=COLOR_MUTED, font=f_sub)

    # 4 Pipeline Cards
    card_w = 480
    card_h = 560
    card_y = 140
    xs = [60, 590, 1120, 1650]

    # Stage 1: Ingestion
    x1 = xs[0]
    draw.rounded_rectangle([x1, card_y, x1 + card_w, card_y + card_h], radius=16, fill=COLOR_WHITE, outline=COLOR_BORDER, width=2)
    draw.rounded_rectangle([x1 + 18, card_y + 18, x1 + card_w - 18, card_y + 60], radius=8, fill=COLOR_ORANGE_LIGHT)
    draw.text((x1 + 30, card_y + 28), "STAGE 1: TASTE SIGNALS", fill=COLOR_ORANGE, font=f_card_sub)
    draw.text((x1 + 30, card_y + 80), "Historical Signal Mining", fill=COLOR_DARK, font=f_card_title)
    
    items_1 = [
        ("• Swiggy Delivery Orders:", "Extracts dish-level frequency, cuisines, and spice notes."),
        ("• Itemized Dineout Bills:", "Incorporates dine-in culinary preferences & premium choices."),
        ("• Explicit Dish Ratings:", "Captures sentiment on specific flavor profiles and textures."),
        ("• Cold-Start Survey:", "Rapid 3-question onboarding for dietary and dairy barriers.")
    ]
    cur_y = card_y + 130
    for header, desc in items_1:
        draw.text((x1 + 30, cur_y), header, fill=COLOR_DARK, font=f_card_sub)
        draw.text((x1 + 30, cur_y + 24), desc, fill=COLOR_MUTED, font=f_body)
        cur_y += 72
    
    draw.rounded_rectangle([x1 + 30, card_y + card_h - 65, x1 + card_w - 30, card_y + card_h - 25], radius=6, fill=(241, 245, 249))
    draw.text((x1 + 45, card_y + card_h - 52), "INPUT: MULTI-YEAR CROSS-SURFACE GASTRONOMIC DATA", fill=COLOR_MUTED, font=f_badge)

    # Stage 2: Palate Vector
    x2 = xs[1]
    draw.rounded_rectangle([x2, card_y, x2 + card_w, card_y + card_h], radius=16, fill=COLOR_WHITE, outline=COLOR_BORDER, width=2)
    draw.rounded_rectangle([x2 + 18, card_y + 18, x2 + card_w - 18, card_y + 60], radius=8, fill=COLOR_PURPLE_LIGHT)
    draw.text((x2 + 30, card_y + 28), "STAGE 2: VECTOR EMBEDDING", fill=COLOR_PURPLE, font=f_card_sub)
    draw.text((x2 + 30, card_y + 80), "64-D Palate Vector", fill=COLOR_DARK, font=f_card_title)

    items_2 = [
        ("• Spice Threshold [0.0 - 1.0]:", "Differentiates mild aromatic heat from pungent chili levels."),
        ("• Umami / Acidity Coordinates:", "Maps savory, tangy, and fermented palate affinities."),
        ("• Dietary Constraint Masking:", "Hard boolean filters for Vegetarian, Halal, Jain, Nut Allergies."),
        ("• Vector Storage (pgvector):", "High-speed approximate nearest neighbor (HNSW) retrieval.")
    ]
    cur_y = card_y + 130
    for header, desc in items_2:
        draw.text((x2 + 30, cur_y), header, fill=COLOR_DARK, font=f_card_sub)
        draw.text((x2 + 30, cur_y + 24), desc, fill=COLOR_MUTED, font=f_body)
        cur_y += 72

    draw.rounded_rectangle([x2 + 30, card_y + card_h - 65, x2 + card_w - 30, card_y + card_h - 25], radius=6, fill=COLOR_PURPLE_LIGHT)
    draw.text((x2 + 45, card_y + card_h - 52), "EMBEDDING MODEL: text-embedding-3-small FINE-TUNED", fill=COLOR_PURPLE, font=f_badge)

    # Stage 3: Centroid Solver
    x3 = xs[2]
    draw.rounded_rectangle([x3, card_y, x3 + card_w, card_y + card_h], radius=16, fill=COLOR_WHITE, outline=COLOR_BORDER, width=2)
    draw.rounded_rectangle([x3 + 18, card_y + 18, x3 + card_w - 18, card_y + 60], radius=8, fill=COLOR_GREEN_LIGHT)
    draw.text((x3 + 30, card_y + 28), "STAGE 3: GROUP CENTROID SOLVER", fill=COLOR_GREEN, font=f_card_sub)
    draw.text((x3 + 30, card_y + 80), "Pareto Group Optimizer", fill=COLOR_DARK, font=f_card_title)

    items_3 = [
        ("• Multi-User Vector Fusion:", "Calculates geometric median across all party members."),
        ("• Zero-Compromise Dish Solver:", "Selects shared appetizers matching mutual satisfaction."),
        ("• Conflict Minimization:", "Ensures vegan/mild diners never suffer forced compromises."),
        ("• Dynamic Budget Scaling:", "Aligns per-head spend limits with dining occasion type.")
    ]
    cur_y = card_y + 130
    for header, desc in items_3:
        draw.text((x3 + 30, cur_y), header, fill=COLOR_DARK, font=f_card_sub)
        draw.text((x3 + 30, cur_y + 24), desc, fill=COLOR_MUTED, font=f_body)
        cur_y += 72

    draw.rounded_rectangle([x3 + 30, card_y + card_h - 65, x3 + card_w - 30, card_y + card_h - 25], radius=6, fill=COLOR_GREEN_LIGHT)
    draw.text((x3 + 45, card_y + card_h - 52), "SOLVER: PARETO-OPTIMAL FLAVOR COMPLIANCE", fill=COLOR_GREEN, font=f_badge)

    # Stage 4: Ambient Execution Rails
    x4 = xs[3]
    draw.rounded_rectangle([x4, card_y, x4 + card_w, card_y + card_h], radius=16, fill=COLOR_WHITE, outline=COLOR_BORDER, width=2)
    draw.rounded_rectangle([x4 + 18, card_y + 18, x4 + card_w - 18, card_y + 60], radius=8, fill=COLOR_ORANGE_LIGHT)
    draw.text((x4 + 30, card_y + 28), "STAGE 4: AUTONOMOUS RAILS", fill=COLOR_ORANGE, font=f_card_sub)
    draw.text((x4 + 30, card_y + 80), "Zero-Touch Settlement", fill=COLOR_DARK, font=f_card_title)

    items_4 = [
        ("• Ambient WhatsApp Bot:", "Friends tag @TasteDNA in group chat to settle dinner plans."),
        ("• Automated Dineout Table Lock:", "Reserves table at optimal restaurant via Dineout APIs."),
        ("• Kitchen Pre-Order Payload:", "Dispatches signature dishes directly to kitchen POS."),
        ("• Instant FairSplit Billing:", "Pre-authorizes equal or itemized UPI payment splits.")
    ]
    cur_y = card_y + 130
    for header, desc in items_4:
        draw.text((x4 + 30, cur_y), header, fill=COLOR_DARK, font=f_card_sub)
        draw.text((x4 + 30, cur_y + 24), desc, fill=COLOR_MUTED, font=f_body)
        cur_y += 72

    draw.rounded_rectangle([x4 + 30, card_y + card_h - 65, x4 + card_w - 30, card_y + card_h - 25], radius=6, fill=COLOR_ORANGE_LIGHT)
    draw.text((x4 + 45, card_y + card_h - 52), "OUTPUT: CONFIRMED TABLE + PRE-ORDER + UPI LINK", fill=COLOR_ORANGE, font=f_badge)

    # Connecting Arrows
    draw_arrow(draw, (x1 + card_w + 10, card_y + card_h // 2), (x2 - 10, card_y + card_h // 2), COLOR_ORANGE, 5)
    draw_arrow(draw, (x2 + card_w + 10, card_y + card_h // 2), (x3 - 10, card_y + card_h // 2), COLOR_ORANGE, 5)
    draw_arrow(draw, (x3 + card_w + 10, card_y + card_h // 2), (x4 - 10, card_y + card_h // 2), COLOR_ORANGE, 5)

    img.save(output_path, 'PNG', dpi=(300, 300))
    print(f"Saved: {output_path}")

if __name__ == '__main__':
    base_dir = r"C:\Users\pravin\Desktop\Swiggy Project"
    sentinel_img = os.path.join(base_dir, "diagram_sentinel_architecture.png")
    tastedna_img = os.path.join(base_dir, "diagram_tastedna_architecture.png")
    generate_sentinel_diagram(sentinel_img)
    generate_tastedna_diagram(tastedna_img)
