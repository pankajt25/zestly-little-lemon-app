"""
scripts/make_wireframe.py
Generates the comprehensive wireframe image for the Zestly / Little Lemon app.
Output: wireframe/zestly-wireframe.jpg (2400x1600)
"""

import os
from PIL import Image, ImageDraw, ImageFont

def get_font(name_or_style="regular", size=16):
    font_paths = {
        "regular": "C:/Windows/Fonts/segoeui.ttf",
        "bold": "C:/Windows/Fonts/segoeuib.ttf",
        "semibold": "C:/Windows/Fonts/segoeuisl.ttf",
        "italic": "C:/Windows/Fonts/segoeuii.ttf",
    }
    path = font_paths.get(name_or_style, "C:/Windows/Fonts/segoeui.ttf")
    if not os.path.exists(path):
        path = "C:/Windows/Fonts/arial.ttf" if name_or_style != "bold" else "C:/Windows/Fonts/arialbd.ttf"
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_x_box(draw, bbox, fill_color=(235, 238, 240), outline_color=(180, 190, 200), line_color=(160, 170, 180)):
    x1, y1, x2, y2 = bbox
    draw.rectangle([x1, y1, x2, y2], fill=fill_color, outline=outline_color, width=1)
    draw.line([x1, y1, x2, y2], fill=line_color, width=1)
    draw.line([x1, y2, x2, y1], fill=line_color, width=1)

def draw_rounded_rect(draw, bbox, radius=8, fill=None, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def draw_checkbox(draw, x, y, size=18, checked=True, label="", font=None):
    draw.rectangle([x, y, x + size, y + size], fill=(255, 255, 255), outline=(73, 94, 87), width=2)
    if checked:
        # Green check mark
        draw.line([x + 3, y + 9, x + 7, y + 14], fill=(73, 94, 87), width=2)
        draw.line([x + 7, y + 14, x + 15, y + 4], fill=(73, 94, 87), width=2)
    if label and font:
        draw.text((x + size + 10, y), label, fill=(51, 51, 51), font=font)

def main():
    W, H = 2400, 1600
    img = Image.new("RGB", (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Fonts
    title_font = get_font("bold", 38)
    subtitle_font = get_font("regular", 18)
    flow_font = get_font("bold", 15)
    flow_sub = get_font("regular", 13)
    section_title_font = get_font("bold", 20)
    guide_heading_font = get_font("bold", 18)
    guide_body_font = get_font("regular", 14)
    guide_bullet_font = get_font("bold", 14)
    ui_header_font = get_font("bold", 18)
    ui_hero_title = get_font("bold", 26)
    ui_hero_sub = get_font("semibold", 18)
    ui_text = get_font("regular", 12)
    ui_bold = get_font("bold", 13)
    ui_small = get_font("regular", 11)
    ui_btn = get_font("bold", 14)

    # Color palette definitions
    C_PRIMARY_GREEN = (73, 94, 87)       # #495E57
    C_PRIMARY_YELLOW = (244, 206, 20)    # #F4CE14
    C_SECONDARY_SALMON = (238, 153, 114) # #EE9972
    C_LIGHT_GREY = (237, 239, 238)       # #EDEFEE
    C_DARK = (51, 51, 51)                # #333333
    C_MUTED = (100, 116, 139)            # #64748B
    C_BORDER = (203, 213, 225)           # #CBD5E1
    C_BEZEL = (30, 41, 59)               # Slate 800 phone bezel
    C_SCREEN_BG = (250, 250, 250)

    # 1. Header Banner
    draw.rectangle([0, 0, W, 100], fill=(248, 250, 252))
    draw.line([0, 100, W, 100], fill=C_BORDER, width=2)
    
    # Title
    draw.text((60, 20), "Zestly - Little Lemon App Wireframe", fill=C_PRIMARY_GREEN, font=title_font)
    draw.text((60, 68), "Meta React Native Capstone Project  |  Complete Wireframe Architecture & Navigation Flow", fill=C_MUTED, font=subtitle_font)

    # Palette Legend on Top Right
    legend_x = 1580
    legend_items = [
        ("Primary Green", C_PRIMARY_GREEN),
        ("Primary Yellow", C_PRIMARY_YELLOW),
        ("Salmon", C_SECONDARY_SALMON),
        ("Light Grey", C_LIGHT_GREY),
        ("Dark", C_DARK),
    ]
    for i, (name, col) in enumerate(legend_items):
        lx = legend_x + (i * 155)
        draw.rectangle([lx, 35, lx + 22, 57], fill=col, outline=C_BORDER)
        draw.text((lx + 30, 37), name, fill=C_DARK, font=get_font("bold", 12))

    # 2. Navigation Flow Diagram (y: 115 to 225)
    flow_box_y = 120
    flow_box_h = 95
    draw_rounded_rect(draw, [60, flow_box_y, W - 60, flow_box_y + flow_box_h], radius=12, fill=(241, 245, 249), outline=C_BORDER, width=1)
    
    # Flow Header
    draw.text((80, flow_box_y + 12), "NAVIGATION ARCHITECTURE (STACK NAVIGATOR):", fill=C_PRIMARY_GREEN, font=get_font("bold", 14))

    # Flow Nodes
    # Node 1: Splash
    draw_rounded_rect(draw, [100, flow_box_y + 40, 240, flow_box_y + 80], radius=8, fill=(255, 255, 255), outline=C_BORDER, width=2)
    draw.text((135, flow_box_y + 48), "Splash Screen", fill=C_DARK, font=flow_font)
    draw.text((122, flow_box_y + 65), "Check AsyncStorage", fill=C_MUTED, font=flow_sub)

    # Arrow 1: Splash to Onboarding or Home
    draw.line([240, flow_box_y + 60, 320, flow_box_y + 60], fill=C_PRIMARY_GREEN, width=2)
    draw.polygon([(320, flow_box_y + 60), (312, flow_box_y + 55), (312, flow_box_y + 65)], fill=C_PRIMARY_GREEN)
    draw.text((250, flow_box_y + 42), "First run", fill=C_MUTED, font=get_font("regular", 11))

    # Node 2: Onboarding
    draw_rounded_rect(draw, [320, flow_box_y + 40, 520, flow_box_y + 80], radius=8, fill=(255, 255, 255), outline=C_PRIMARY_GREEN, width=2)
    draw.text((350, flow_box_y + 48), "1. Onboarding", fill=C_PRIMARY_GREEN, font=flow_font)
    draw.text((345, flow_box_y + 65), "Enter Name & Email", fill=C_MUTED, font=flow_sub)

    # Arrow 2: Onboarding -> Home
    draw.line([520, flow_box_y + 60, 720, flow_box_y + 60], fill=C_PRIMARY_GREEN, width=3)
    draw.polygon([(720, flow_box_y + 60), (710, flow_box_y + 54), (710, flow_box_y + 66)], fill=C_PRIMARY_GREEN)
    draw.text((545, flow_box_y + 42), "Next (Stack Reset)", fill=C_PRIMARY_GREEN, font=get_font("bold", 12))

    # Direct Splash -> Home if onboardingCompleted
    draw.line([170, flow_box_y + 40, 170, flow_box_y + 24], fill=C_MUTED, width=1)
    draw.line([170, flow_box_y + 24, 780, flow_box_y + 24], fill=C_MUTED, width=1)
    draw.line([780, flow_box_y + 24, 780, flow_box_y + 40], fill=C_MUTED, width=1)
    draw.polygon([(780, flow_box_y + 40), (776, flow_box_y + 34), (784, flow_box_y + 34)], fill=C_MUTED)
    draw.text((370, flow_box_y + 10), "Returning User (onboardingCompleted == true)", fill=C_MUTED, font=get_font("regular", 11))

    # Node 3: Home
    draw_rounded_rect(draw, [720, flow_box_y + 40, 930, flow_box_y + 80], radius=8, fill=(255, 255, 255), outline=C_PRIMARY_GREEN, width=2)
    draw.text((770, flow_box_y + 48), "2. Home", fill=C_PRIMARY_GREEN, font=flow_font)
    draw.text((748, flow_box_y + 65), "Menu, Search & Filter", fill=C_MUTED, font=flow_sub)

    # Bi-directional arrow: Home <-> Profile
    draw.line([930, flow_box_y + 53, 1140, flow_box_y + 53], fill=C_PRIMARY_GREEN, width=2)
    draw.polygon([(1140, flow_box_y + 53), (1130, flow_box_y + 48), (1130, flow_box_y + 58)], fill=C_PRIMARY_GREEN)
    draw.text((970, flow_box_y + 36), "Tap Avatar", fill=C_PRIMARY_GREEN, font=get_font("bold", 12))

    draw.line([1140, flow_box_y + 67, 930, flow_box_y + 67], fill=C_MUTED, width=2)
    draw.polygon([(930, flow_box_y + 67), (940, flow_box_y + 62), (940, flow_box_y + 72)], fill=C_MUTED)
    draw.text((965, flow_box_y + 70), "goBack() Arrow", fill=C_MUTED, font=get_font("bold", 12))

    # Node 4: Profile
    draw_rounded_rect(draw, [1140, flow_box_y + 40, 1370, flow_box_y + 80], radius=8, fill=(255, 255, 255), outline=C_PRIMARY_GREEN, width=2)
    draw.text((1195, flow_box_y + 48), "3. Profile", fill=C_PRIMARY_GREEN, font=flow_font)
    draw.text((1165, flow_box_y + 65), "Personal Info, Avatar, Prefs", fill=C_MUTED, font=flow_sub)

    # Arrow: Profile -> Log out -> Onboarding
    draw.line([1370, flow_box_y + 60, 1490, flow_box_y + 60], fill=(220, 38, 38), width=2)
    draw.line([1490, flow_box_y + 60, 1490, flow_box_y + 90], fill=(220, 38, 38), width=2)
    draw.text((1380, flow_box_y + 42), "Log out (Clear Storage)", fill=(220, 38, 38), font=get_font("bold", 12))
    
    # Return path box
    draw_rounded_rect(draw, [1520, flow_box_y + 40, 1750, flow_box_y + 80], radius=8, fill=(254, 242, 242), outline=(239, 68, 68), width=2)
    draw.text((1545, flow_box_y + 48), "Stack Reset -> Onboarding", fill=(185, 28, 28), font=flow_font)
    draw.text((1560, flow_box_y + 65), "All state completely cleared", fill=(185, 28, 28), font=flow_sub)

    # 3. Three Phone Wireframes side by side with Text Guides
    # Total available width: 2400. Margin: 60 left and right -> 2280 available.
    # 3 columns of 740px each (spacing 20px).
    # Inside each column:
    # Phone frame: width 440px, height 1280px
    # Guide panel: width 280px, height 1280px

    cols = [
        {"x": 60, "name": "Onboarding Screen", "type": "onboarding"},
        {"x": 830, "name": "Home Screen", "type": "home"},
        {"x": 1600, "name": "Profile Screen", "type": "profile"},
    ]

    base_y = 230
    phone_w = 440
    phone_h = 1320
    screen_padding = 12

    # Draw helper for phone body
    for col in cols:
        cx = col["x"]
        # Outer phone bezel
        draw_rounded_rect(draw, [cx, base_y, cx + phone_w, base_y + phone_h], radius=32, fill=C_BEZEL, outline=(15, 23, 42), width=3)
        # Inner screen
        sx1 = cx + screen_padding
        sy1 = base_y + screen_padding
        sx2 = cx + phone_w - screen_padding
        sy2 = base_y + phone_h - screen_padding
        draw_rounded_rect(draw, [sx1, sy1, sx2, sy2], radius=24, fill=C_SCREEN_BG, outline=C_BORDER, width=1)
        
        # Phone speaker notch / dynamic island
        notch_w, notch_h = 110, 16
        nx = cx + (phone_w - notch_w) // 2
        draw_rounded_rect(draw, [nx, sy1 + 8, nx + notch_w, sy1 + 8 + notch_h], radius=8, fill=C_BEZEL)

    # =========================================================================
    # SCREEN 1: ONBOARDING
    # =========================================================================
    s1_x = cols[0]["x"] + screen_padding
    s1_y = base_y + screen_padding + 30
    s1_w = phone_w - (2 * screen_padding)

    # Top App Header (Logo)
    draw.rectangle([s1_x, s1_y, s1_x + s1_w, s1_y + 60], fill=(255, 255, 255))
    draw.line([s1_x, s1_y + 60, s1_x + s1_w, s1_y + 60], fill=C_BORDER, width=1)
    # Lemon logo icon + text
    draw.ellipse([s1_x + s1_w//2 - 95, s1_y + 16, s1_x + s1_w//2 - 67, s1_y + 44], fill=C_PRIMARY_YELLOW, outline=C_PRIMARY_GREEN, width=2)
    draw.polygon([(s1_x + s1_w//2 - 76, s1_y + 13), (s1_x + s1_w//2 - 68, s1_y + 8), (s1_x + s1_w//2 - 68, s1_y + 18)], fill=C_PRIMARY_GREEN)
    draw.text((s1_x + s1_w//2 - 58, s1_y + 20), "LITTLE LEMON", fill=C_PRIMARY_GREEN, font=ui_header_font)

    # Hero Banner
    hero_y = s1_y + 61
    hero_h = 240
    draw.rectangle([s1_x, hero_y, s1_x + s1_w, hero_y + hero_h], fill=C_PRIMARY_GREEN)
    draw.text((s1_x + 20, hero_y + 15), "Little Lemon", fill=C_PRIMARY_YELLOW, font=ui_hero_title)
    draw.text((s1_x + 20, hero_y + 50), "Chicago", fill=(255, 255, 255), font=ui_hero_sub)
    
    # Description
    desc_lines = [
        "We are a family owned",
        "Mediterranean restaurant,",
        "focused on traditional",
        "recipes served with a",
        "modern twist."
    ]
    for idx, l in enumerate(desc_lines):
        draw.text((s1_x + 20, hero_y + 85 + (idx * 19)), l, fill=(237, 239, 238), font=ui_text)

    # Hero Image placeholder box on the right
    draw_x_box(draw, [s1_x + s1_w - 150, hero_y + 70, s1_x + s1_w - 20, hero_y + 210])
    draw.text((s1_x + s1_w - 128, hero_y + 135), "Hero Image", fill=C_MUTED, font=ui_small)

    # Form Title
    form_y = hero_y + hero_h + 35
    draw.text((s1_x + 20, form_y), "Let us get to know you", fill=C_DARK, font=get_font("bold", 20))
    draw.text((s1_x + 20, form_y + 30), "Enter your details to start ordering delicious food.", fill=C_MUTED, font=ui_text)

    # First Name Input
    f1_y = form_y + 75
    draw.text((s1_x + 20, f1_y), "First Name *", fill=C_DARK, font=ui_bold)
    draw_rounded_rect(draw, [s1_x + 20, f1_y + 22, s1_x + s1_w - 20, f1_y + 68], radius=8, fill=(255, 255, 255), outline=C_BORDER, width=2)
    draw.text((s1_x + 35, f1_y + 35), "e.g. Alex", fill=C_MUTED, font=ui_text)

    # Email Input
    f2_y = f1_y + 90
    draw.text((s1_x + 20, f2_y), "Email *", fill=C_DARK, font=ui_bold)
    draw_rounded_rect(draw, [s1_x + 20, f2_y + 22, s1_x + s1_w - 20, f2_y + 68], radius=8, fill=(255, 255, 255), outline=C_BORDER, width=2)
    draw.text((s1_x + 35, f2_y + 35), "e.g. alex@example.com", fill=C_MUTED, font=ui_text)

    # Validation Note badge
    v_badge_y = f2_y + 85
    draw_rounded_rect(draw, [s1_x + 20, v_badge_y, s1_x + s1_w - 20, v_badge_y + 55], radius=6, fill=(254, 243, 199), outline=C_PRIMARY_YELLOW, width=1)
    draw.text((s1_x + 30, v_badge_y + 10), "Validation Rule:", fill=(146, 64, 14), font=get_font("bold", 12))
    draw.text((s1_x + 30, v_badge_y + 30), "Next enables when Name (letters only) & Email valid", fill=(146, 64, 14), font=ui_small)

    # Bottom Next Button (Disabled State Wireframe)
    btn_y = s1_y + phone_h - 130
    draw_rounded_rect(draw, [s1_x + 20, btn_y, s1_x + s1_w - 20, btn_y + 55], radius=10, fill=C_BORDER, outline=C_BORDER)
    draw.text((s1_x + s1_w//2 - 80, btn_y + 17), "Next  (Disabled)", fill=(100, 116, 139), font=ui_btn)
    draw.text((s1_x + s1_w//2 - 95, btn_y + 65), "* Turns Yellow (#F4CE14) when valid", fill=C_MUTED, font=ui_small)

    # TEXT GUIDE 1 (Beside Onboarding)
    g1_x = cols[0]["x"] + phone_w + 15
    g1_y = base_y + 10
    g1_w = 280
    draw_rounded_rect(draw, [g1_x, g1_y, g1_x + g1_w, g1_y + phone_h - 20], radius=12, fill=(255, 255, 255), outline=C_BORDER, width=1)
    
    # Guide 1 Header
    draw_rounded_rect(draw, [g1_x, g1_y, g1_x + g1_w, g1_y + 50], radius=12, fill=C_PRIMARY_GREEN)
    draw.text((g1_x + 15, g1_y + 15), "1. ONBOARDING SCREEN", fill=(255, 255, 255), font=guide_heading_font)

    guide1_items = [
        ("Rubric Checklist", "Verify onboarding requirements"),
        ("• Header Logo", "Displays Little Lemon brand lockup at the top of the screen."),
        ("• Hero Banner", "Dark green container (#495E57) with restaurant title, location ('Chicago'), intro text and hero image."),
        ("• Input Validation", "First Name: letters only, non-empty.\nEmail: standard regex pattern.\nReal-time validation updates button."),
        ("• Next Button", "Strictly DISABLED (greyed out, non-pressable) until both inputs are valid.\nTurns Primary Yellow (#F4CE14) when active."),
        ("• Persistence", "Writes firstName, email and onboardingCompleted=true into AsyncStorage."),
        ("• Stack Reset", "On submit, resets stack navigation directly to Home screen so Back does not return to Onboarding."),
        ("• Safe & Responsive", "KeyboardAvoidingView & ScrollView ensure inputs and Next button stay visible on mobile keyboards.")
    ]

    curr_gy = g1_y + 65
    for title, desc in guide1_items:
        draw.text((g1_x + 15, curr_gy), title, fill=C_PRIMARY_GREEN if "•" in title else C_DARK, font=guide_bullet_font)
        curr_gy += 20
        for line in desc.split("\n"):
            draw.text((g1_x + 15, curr_gy), line, fill=C_MUTED, font=guide_body_font)
            curr_gy += 18
        curr_gy += 10

    # =========================================================================
    # SCREEN 2: HOME
    # =========================================================================
    s2_x = cols[1]["x"] + screen_padding
    s2_y = base_y + screen_padding + 30
    s2_w = phone_w - (2 * screen_padding)

    # 1. Top Header: Logo centered, Avatar on right
    draw.rectangle([s2_x, s2_y, s2_x + s2_w, s2_y + 60], fill=(255, 255, 255))
    draw.line([s2_x, s2_y + 60, s2_x + s2_w, s2_y + 60], fill=C_BORDER, width=1)
    
    # Logo centered
    draw.ellipse([s2_x + s2_w//2 - 95, s2_y + 16, s2_x + s2_w//2 - 67, s2_y + 44], fill=C_PRIMARY_YELLOW, outline=C_PRIMARY_GREEN, width=2)
    draw.polygon([(s2_x + s2_w//2 - 76, s2_y + 13), (s2_x + s2_w//2 - 68, s2_y + 8), (s2_x + s2_w//2 - 68, s2_y + 18)], fill=C_PRIMARY_GREEN)
    draw.text((s2_x + s2_w//2 - 58, s2_y + 20), "LITTLE LEMON", fill=C_PRIMARY_GREEN, font=ui_header_font)

    # Right Avatar Button
    draw.ellipse([s2_x + s2_w - 52, s2_y + 12, s2_x + s2_w - 14, s2_y + 50], fill=C_SECONDARY_SALMON, outline=C_PRIMARY_GREEN, width=1)
    draw.text((s2_x + s2_w - 41, s2_y + 22), "JD", fill=(255, 255, 255), font=get_font("bold", 14))

    # 2. Hero Section (with search bar underneath)
    h2_y = s2_y + 61
    h2_h = 260
    draw.rectangle([s2_x, h2_y, s2_x + s2_w, h2_y + h2_h], fill=C_PRIMARY_GREEN)
    draw.text((s2_x + 20, h2_y + 14), "Little Lemon", fill=C_PRIMARY_YELLOW, font=ui_hero_title)
    draw.text((s2_x + 20, h2_y + 48), "Chicago", fill=(255, 255, 255), font=ui_hero_sub)

    home_desc = [
        "We are a family owned",
        "Mediterranean restaurant,",
        "focused on traditional",
        "recipes served with a",
        "modern twist."
    ]
    for idx, l in enumerate(home_desc):
        draw.text((s2_x + 20, h2_y + 78 + (idx * 18)), l, fill=(237, 239, 238), font=ui_text)

    # Hero image placeholder
    draw_x_box(draw, [s2_x + s2_w - 145, h2_y + 50, s2_x + s2_w - 20, h2_y + 175])
    draw.text((s2_x + s2_w - 115, h2_y + 105), "Dish Photo", fill=C_MUTED, font=ui_small)

    # Rounded search input bar inside hero
    search_y = h2_y + 190
    draw_rounded_rect(draw, [s2_x + 20, search_y, s2_x + s2_w - 20, search_y + 48], radius=24, fill=C_LIGHT_GREY)
    # Search icon
    draw.ellipse([s2_x + 36, search_y + 16, s2_x + 48, search_y + 28], outline=C_MUTED, width=2)
    draw.line([s2_x + 46, search_y + 26, s2_x + 53, search_y + 33], fill=C_MUTED, width=2)
    draw.text((s2_x + 62, search_y + 15), "Search menu (debounced 500ms)...", fill=C_MUTED, font=ui_text)

    # 3. Menu Breakdown Section
    mb_y = h2_y + h2_h + 15
    draw.text((s2_x + 20, mb_y), "ORDER FOR DELIVERY!", fill=C_DARK, font=get_font("bold", 16))

    # Category Chips (horizontal row)
    chip_y = mb_y + 30
    chips = [
        ("Starters", True),   # selected
        ("Mains", False),
        ("Desserts", False),
        ("Drinks", False),
    ]
    chip_x = s2_x + 20
    for name, selected in chips:
        c_w = 84
        if selected:
            # Selected chip = green background, white text
            draw_rounded_rect(draw, [chip_x, chip_y, chip_x + c_w, chip_y + 36], radius=16, fill=C_PRIMARY_GREEN)
            draw.text((chip_x + 14, chip_y + 9), name, fill=(255, 255, 255), font=ui_bold)
        else:
            # Unselected chip = light grey, green text
            draw_rounded_rect(draw, [chip_x, chip_y, chip_x + c_w, chip_y + 36], radius=16, fill=C_LIGHT_GREY)
            draw.text((chip_x + 14, chip_y + 9), name, fill=C_PRIMARY_GREEN, font=ui_bold)
        chip_x += c_w + 12

    # Divider line
    draw.line([s2_x + 20, chip_y + 50, s2_x + s2_w - 20, chip_y + 50], fill=C_BORDER, width=1)

    # 4. Food Menu List (FlatList Items)
    menu_y = chip_y + 60
    items = [
        ("Greek Salad", "The famous greek salad of crispy lettuce, peppers, olives and our Chicago...", "$12.99"),
        ("Bruschetta", "Our Bruschetta is made from grilled bread that has been smeared with garlic...", "$7.99"),
        ("Grilled Fish", "Catch of the day seasoned with fresh herbs, garlic and olive oil...", "$20.00"),
        ("Pasta", "Penne with classic tomato basil marinara sauce, fresh parmesan cheese...", "$18.99"),
        ("Lemon Dessert", "Traditional Mediterranean lemon cake topped with homemade vanilla zest...", "$6.99"),
    ]

    for iname, idesc, iprice in items:
        # Item title
        draw.text((s2_x + 20, menu_y), iname, fill=C_DARK, font=get_font("bold", 15))
        # Item description (2 lines max)
        desc1 = idesc[:38]
        desc2 = idesc[38:75] + ("..." if len(idesc) > 75 else "")
        draw.text((s2_x + 20, menu_y + 22), desc1, fill=C_MUTED, font=ui_small)
        draw.text((s2_x + 20, menu_y + 38), desc2, fill=C_MUTED, font=ui_small)
        # Price
        draw.text((s2_x + 20, menu_y + 62), iprice, fill=C_PRIMARY_GREEN, font=get_font("bold", 15))
        # Dish thumbnail on the right
        draw_x_box(draw, [s2_x + s2_w - 95, menu_y, s2_x + s2_w - 20, menu_y + 75])
        draw.text((s2_x + s2_w - 78, menu_y + 30), "90x90", fill=C_MUTED, font=get_font("regular", 10))
        # Divider line
        menu_y += 90
        draw.line([s2_x + 20, menu_y, s2_x + s2_w - 20, menu_y], fill=C_BORDER, width=1)
        menu_y += 12

    # TEXT GUIDE 2 (Beside Home)
    g2_x = cols[1]["x"] + phone_w + 15
    g2_y = base_y + 10
    g2_w = 280
    draw_rounded_rect(draw, [g2_x, g2_y, g2_x + g2_w, g2_y + phone_h - 20], radius=12, fill=(255, 255, 255), outline=C_BORDER, width=1)
    
    # Guide 2 Header
    draw_rounded_rect(draw, [g2_x, g2_y, g2_x + g2_w, g2_y + 50], radius=12, fill=C_PRIMARY_GREEN)
    draw.text((g2_x + 20, g2_y + 15), "2. HOME SCREEN", fill=(255, 255, 255), font=guide_heading_font)

    guide2_items = [
        ("Four Rubric Sections", "Strict layout sequence"),
        ("1. Header", "Logo centered, circular profile avatar on right displaying user photo or initials.\nTapping avatar navigates to Profile."),
        ("2. Hero Banner", "Brand green (#495E57) with 'Little Lemon' (yellow), 'Chicago' (white), about paragraph, food thumbnail, and rounded search input."),
        ("3. Menu Breakdown", "Label 'ORDER FOR DELIVERY!' with horizontal category chips (Starters, Mains, Desserts, Drinks).\nMulti-select toggle with clear active state."),
        ("4. Food Menu List", "Vertically scrollable FlatList.\nItem name, 2-line description, formatted price ($12.99), and 90x90 thumbnail."),
        ("• SQLite Caching", "Table `menu` stores remote items.\nLoads offline cache immediately, updates in background."),
        ("• Real-time Filter", "Parameterized SQLite queries combine debounced text (500ms) and category selection."),
        ("• Offline Fallback", "10 realistic bundled dishes ensure the app is never empty even offline.")
    ]

    curr_gy = g2_y + 65
    for title, desc in guide2_items:
        draw.text((g2_x + 15, curr_gy), title, fill=C_PRIMARY_GREEN if ("•" in title or "1." in title or "2." in title or "3." in title or "4." in title) else C_DARK, font=guide_bullet_font)
        curr_gy += 20
        for line in desc.split("\n"):
            draw.text((g2_x + 15, curr_gy), line, fill=C_MUTED, font=guide_body_font)
            curr_gy += 18
        curr_gy += 10

    # =========================================================================
    # SCREEN 3: PROFILE
    # =========================================================================
    s3_x = cols[2]["x"] + screen_padding
    s3_y = base_y + screen_padding + 30
    s3_w = phone_w - (2 * screen_padding)

    # 1. Profile Header: Back button left, Logo centered, Avatar right
    draw.rectangle([s3_x, s3_y, s3_x + s3_w, s3_y + 60], fill=(255, 255, 255))
    draw.line([s3_x, s3_y + 60, s3_x + s3_w, s3_y + 60], fill=C_BORDER, width=1)
    
    # Green circular Back button
    draw.ellipse([s3_x + 15, s3_y + 14, s3_x + 47, s3_y + 46], fill=C_PRIMARY_GREEN)
    # Left arrow inside circle
    draw.line([s3_x + 35, s3_y + 30, s3_x + 23, s3_y + 30], fill=(255, 255, 255), width=2)
    draw.line([s3_x + 23, s3_y + 30, s3_x + 29, s3_y + 24], fill=(255, 255, 255), width=2)
    draw.line([s3_x + 23, s3_y + 30, s3_x + 29, s3_y + 36], fill=(255, 255, 255), width=2)

    # Centered Logo
    draw.ellipse([s3_x + s3_w//2 - 95, s3_y + 16, s3_x + s3_w//2 - 67, s3_y + 44], fill=C_PRIMARY_YELLOW, outline=C_PRIMARY_GREEN, width=2)
    draw.polygon([(s3_x + s3_w//2 - 76, s3_y + 13), (s3_x + s3_w//2 - 68, s3_y + 8), (s3_x + s3_w//2 - 68, s3_y + 18)], fill=C_PRIMARY_GREEN)
    draw.text((s3_x + s3_w//2 - 58, s3_y + 20), "LITTLE LEMON", fill=C_PRIMARY_GREEN, font=ui_header_font)

    # Right Avatar circle
    draw.ellipse([s3_x + s3_w - 52, s3_y + 12, s3_x + s3_w - 14, s3_y + 50], fill=C_SECONDARY_SALMON, outline=C_PRIMARY_GREEN, width=1)
    draw.text((s3_x + s3_w - 41, s3_y + 22), "JD", fill=(255, 255, 255), font=get_font("bold", 14))

    # 2. Personal Information Card Container
    card_y = s3_y + 70
    draw.text((s3_x + 20, card_y), "Personal information", fill=C_DARK, font=get_font("bold", 20))

    # Avatar Section
    av_row_y = card_y + 35
    draw.text((s3_x + 20, av_row_y), "Avatar", fill=C_MUTED, font=ui_small)
    # Avatar Circle
    draw.ellipse([s3_x + 20, av_row_y + 18, s3_x + 95, av_row_y + 93], fill=C_SECONDARY_SALMON, outline=C_PRIMARY_GREEN, width=2)
    draw.text((s3_x + 42, av_row_y + 42), "JD", fill=(255, 255, 255), font=get_font("bold", 24))
    
    # Change button (green)
    draw_rounded_rect(draw, [s3_x + 115, av_row_y + 35, s3_x + 225, av_row_y + 78], radius=8, fill=C_PRIMARY_GREEN)
    draw.text((s3_x + 140, av_row_y + 48), "Change", fill=(255, 255, 255), font=ui_btn)

    # Remove button (outlined)
    draw_rounded_rect(draw, [s3_x + 240, av_row_y + 35, s3_x + 350, av_row_y + 78], radius=8, fill=(255, 255, 255), outline=C_BORDER, width=2)
    draw.text((s3_x + 265, av_row_y + 48), "Remove", fill=C_DARK, font=ui_btn)

    # Form Fields
    f_start_y = av_row_y + 105
    fields = [
        ("First name", "Jane"),
        ("Last name", "Doe"),
        ("Email", "jane.doe@example.com"),
        ("Phone number", "(217) 555-0113"),
    ]

    for flabel, fval in fields:
        draw.text((s3_x + 20, f_start_y), flabel, fill=C_MUTED, font=get_font("bold", 12))
        draw_rounded_rect(draw, [s3_x + 20, f_start_y + 18, s3_x + s3_w - 20, f_start_y + 58], radius=8, fill=(255, 255, 255), outline=C_BORDER, width=1)
        draw.text((s3_x + 32, f_start_y + 28), fval, fill=C_DARK, font=ui_text)
        f_start_y += 68

    # Email Notifications Section
    notif_y = f_start_y + 10
    draw.text((s3_x + 20, notif_y), "Email notifications", fill=C_DARK, font=get_font("bold", 16))
    
    notif_items = [
        "Order statuses",
        "Password changes",
        "Special offers",
        "Newsletter"
    ]
    notif_check_y = notif_y + 30
    for nitem in notif_items:
        draw_checkbox(draw, s3_x + 20, notif_check_y, size=18, checked=True, label=nitem, font=ui_text)
        notif_check_y += 30

    # Yellow Log out Button
    logout_y = notif_check_y + 15
    draw_rounded_rect(draw, [s3_x + 20, logout_y, s3_x + s3_w - 20, logout_y + 48], radius=8, fill=C_PRIMARY_YELLOW, outline=(217, 119, 6), width=1)
    draw.text((s3_x + s3_w//2 - 32, logout_y + 14), "Log out", fill=C_DARK, font=get_font("bold", 15))

    # Action Buttons: Discard changes (outlined) & Save changes (green)
    action_y = logout_y + 60
    btn_w = (s3_w - 55) // 2
    
    # Discard changes
    draw_rounded_rect(draw, [s3_x + 20, action_y, s3_x + 20 + btn_w, action_y + 48], radius=8, fill=(255, 255, 255), outline=C_PRIMARY_GREEN, width=2)
    draw.text((s3_x + 35, action_y + 14), "Discard changes", fill=C_PRIMARY_GREEN, font=get_font("bold", 13))

    # Save changes
    draw_rounded_rect(draw, [s3_x + 20 + btn_w + 15, action_y, s3_x + s3_w - 20, action_y + 48], radius=8, fill=C_PRIMARY_GREEN)
    draw.text((s3_x + 20 + btn_w + 40, action_y + 14), "Save changes", fill=(255, 255, 255), font=get_font("bold", 13))

    # TEXT GUIDE 3 (Beside Profile)
    g3_x = cols[2]["x"] + phone_w + 15
    g3_y = base_y + 10
    g3_w = 280
    draw_rounded_rect(draw, [g3_x, g3_y, g3_x + g3_w, g3_y + phone_h - 20], radius=12, fill=(255, 255, 255), outline=C_BORDER, width=1)
    
    # Guide 3 Header
    draw_rounded_rect(draw, [g3_x, g3_y, g3_x + g3_w, g3_y + 50], radius=12, fill=C_PRIMARY_GREEN)
    draw.text((g3_x + 20, g3_y + 15), "3. PROFILE SCREEN", fill=(255, 255, 255), font=guide_heading_font)

    guide3_items = [
        ("Comprehensive Profile", "Specifications & Actions"),
        ("• Back Navigation", "Circular green button with white arrow calls navigation.goBack() to return Home."),
        ("• Avatar Picker", "Change: launches expo-image-picker (camera/photos) and saves URI.\nRemove: clears photo and reverts to initials."),
        ("• Pre-filled Data", "Onboarding values (First name, Email) automatically populate form."),
        ("• Form Validation", "First name required; valid email format;\nPhone auto-formats to (XXX) XXX-XXXX with inline validation errors."),
        ("• Notification Toggles", "4 checkboxes for email preferences (Orders, Passwords, Offers, News)."),
        ("• Save & Discard", "Save changes writes to AsyncStorage and updates header avatar.\nDiscard reloads saved state."),
        ("• Log Out Flow", "Prompts Alert confirmation, clears ALL storage items, resets form, and routes back to Onboarding.")
    ]

    curr_gy = g3_y + 65
    for title, desc in guide3_items:
        draw.text((g3_x + 15, curr_gy), title, fill=C_PRIMARY_GREEN if "•" in title else C_DARK, font=guide_bullet_font)
        curr_gy += 20
        for line in desc.split("\n"):
            draw.text((g3_x + 15, curr_gy), line, fill=C_MUTED, font=guide_body_font)
            curr_gy += 18
        curr_gy += 10

    # Ensure output dir exists and save
    os.makedirs("wireframe", exist_ok=True)
    out_path = os.path.join("wireframe", "zestly-wireframe.jpg")
    img.save(out_path, "JPEG", quality=95)
    print(f"Wireframe image successfully generated: {out_path} ({W}x{H})")

if __name__ == "__main__":
    main()
