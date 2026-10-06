"""
scripts/make_assets.py
Generates local offline image assets for Zestly:
- assets/icon.png
- assets/splash-icon.png
- assets/android-icon-foreground.png
- assets/android-icon-background.png
- assets/hero.png
- assets/dishes/*.png (Greek Salad, Bruschetta, Grilled Fish, Pasta, Lemon Dessert, etc.)
"""

import os
from PIL import Image, ImageDraw, ImageFont

def get_font(size=20, bold=False):
    path = "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"
    if not os.path.exists(path):
        path = "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_lemon_mark(draw, cx, cy, radius, lemon_col=(244, 206, 20), leaf_col=(73, 94, 87)):
    # Lemon body: tilted ellipse
    lx1 = cx - int(radius * 0.9)
    ly1 = cy - int(radius * 0.7)
    lx2 = cx + int(radius * 0.9)
    ly2 = cy + int(radius * 0.7)
    draw.ellipse([lx1, ly1, lx2, ly2], fill=lemon_col)
    # Lemon tips
    draw.polygon([(lx1 + 2, cy), (lx1 - int(radius * 0.2), cy - 2), (lx1 - int(radius * 0.2), cy + 2)], fill=lemon_col)
    draw.polygon([(lx2 - 2, cy), (lx2 + int(radius * 0.2), cy - 2), (lx2 + int(radius * 0.2), cy + 2)], fill=lemon_col)
    
    # Leaf
    leaf_w = int(radius * 0.5)
    leaf_h = int(radius * 0.4)
    leaf_top = cy - int(radius * 0.7) - leaf_h
    leaf_cx = cx + int(radius * 0.1)
    draw.pieslice([leaf_cx - leaf_w, leaf_top, leaf_cx + leaf_w, leaf_top + leaf_h * 2], start=210, end=330, fill=leaf_col)
    # Stem
    draw.line([cx, cy - int(radius * 0.6), leaf_cx, leaf_top + leaf_h], fill=leaf_col, width=max(2, int(radius * 0.08)))

def create_app_icon():
    size = (1024, 1024)
    img = Image.new("RGBA", size, (73, 94, 87, 255)) # Primary green
    draw = ImageDraw.Draw(img)
    draw_lemon_mark(draw, 512, 460, radius=240, lemon_col=(244, 206, 20), leaf_col=(237, 239, 238))
    
    font = get_font(72, bold=True)
    draw.text((512, 780), "LITTLE LEMON", fill=(244, 206, 20), font=font, anchor="mm")
    
    img.save("assets/icon.png", "PNG")
    img.save("assets/android-icon-foreground.png", "PNG")
    print("Created icon.png & android-icon-foreground.png")

def create_splash_icon():
    size = (1024, 1024)
    img = Image.new("RGBA", size, (73, 94, 87, 255))
    draw = ImageDraw.Draw(img)
    draw_lemon_mark(draw, 512, 440, radius=200, lemon_col=(244, 206, 20), leaf_col=(237, 239, 238))
    
    font1 = get_font(68, bold=True)
    font2 = get_font(32, bold=False)
    draw.text((512, 700), "LITTLE LEMON", fill=(244, 206, 20), font=font1, anchor="mm")
    draw.text((512, 760), "Mediterranean Restaurant • Chicago", fill=(237, 239, 238), font=font2, anchor="mm")
    
    img.save("assets/splash-icon.png", "PNG")
    print("Created splash-icon.png")

def create_android_background():
    img = Image.new("RGBA", (1024, 1024), (73, 94, 87, 255))
    img.save("assets/android-icon-background.png", "PNG")
    print("Created android-icon-background.png")

def create_hero_image():
    W, H = 800, 600
    img = Image.new("RGB", (W, H), (245, 240, 230))
    draw = ImageDraw.Draw(img)
    
    # Warm rustic background gradient / texture
    for y in range(H):
        r = int(240 - (y / H) * 20)
        g = int(230 - (y / H) * 25)
        b = int(215 - (y / H) * 20)
        draw.line([(0, y), (W, y)], fill=(r, g, b))
        
    # Large dish plate
    plate_cx, plate_cy = 400, 320
    draw.ellipse([120, 100, 680, 540], fill=(255, 255, 255), outline=(210, 205, 195), width=8)
    draw.ellipse([150, 130, 650, 510], fill=(250, 248, 245), outline=(230, 225, 215), width=3)
    
    # Food items on the plate: Salad, tomatoes, lemon, olives, herbs
    # Greens
    for offset_x, offset_y in [(-80, -20), (50, -40), (-30, 60), (70, 40), (0, -10)]:
        draw.ellipse([plate_cx + offset_x - 70, plate_cy + offset_y - 50, plate_cx + offset_x + 70, plate_cy + offset_y + 50], fill=(76, 175, 80))
        draw.ellipse([plate_cx + offset_x - 50, plate_cy + offset_y - 30, plate_cx + offset_x + 50, plate_cy + offset_y + 30], fill=(102, 187, 106))
    
    # Red ripe tomatoes
    for tx, ty in [(-90, 40), (100, -20), (30, 70), (-20, -70)]:
        draw.ellipse([plate_cx + tx - 28, plate_cy + ty - 28, plate_cx + tx + 28, plate_cy + ty + 28], fill=(229, 57, 53))
        draw.ellipse([plate_cx + tx - 12, plate_cy + ty - 12, plate_cx + tx + 12, plate_cy + ty + 12], fill=(239, 83, 80))
    
    # Kalamata Olives
    for ox, oy in [(-50, -10), (20, -30), (60, 20), (-70, 80)]:
        draw.ellipse([plate_cx + ox - 18, plate_cy + oy - 14, plate_cx + ox + 18, plate_cy + oy + 14], fill=(55, 30, 45))
        
    # Feta Cheese cubes
    for fx, fy in [(-40, 20), (20, 30), (-10, -40), (80, -60)]:
        draw.rectangle([plate_cx + fx - 22, plate_cy + fy - 22, plate_cx + fx + 22, plate_cy + fy + 22], fill=(255, 253, 245), outline=(230, 225, 210), width=1)
        
    # Lemon slice
    draw.ellipse([plate_cx - 130, plate_cy - 100, plate_cx - 50, plate_cy - 20], fill=(244, 206, 20), outline=(255, 235, 59), width=4)
    draw.ellipse([plate_cx - 120, plate_cy - 90, plate_cx - 60, plate_cy - 30], fill=(255, 245, 157))

    # Text overlay badge on top
    draw.rectangle([0, 0, W, 70], fill=(73, 94, 87))
    font = get_font(28, bold=True)
    draw.text((W // 2, 35), "LITTLE LEMON • MEDITERRANEAN SPECIALTIES", fill=(244, 206, 20), font=font, anchor="mm")
    
    img.save("assets/hero.png", "PNG")
    print("Created hero.png")

def create_dish_image(filename, title, category, bg_color, accent_color, icon_type="salad"):
    W, H = 300, 300
    img = Image.new("RGB", (W, H), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Plate base
    draw.ellipse([30, 30, 270, 270], fill=(255, 255, 255), outline=(220, 220, 220), width=4)
    draw.ellipse([50, 50, 250, 250], fill=(248, 248, 248))
    
    # Category / Dish visual styling
    cx, cy = 150, 150
    if icon_type == "salad":
        # Green salad leaves + tomatoes + cheese
        draw.ellipse([cx - 55, cy - 45, cx + 55, cy + 45], fill=(76, 175, 80))
        draw.ellipse([cx - 35, cy - 25, cx + 35, cy + 25], fill=(102, 187, 106))
        draw.ellipse([cx - 30, cy + 10, cx - 10, cy + 30], fill=(229, 57, 53))
        draw.ellipse([cx + 10, cy - 25, cx + 30, cy - 5], fill=(229, 57, 53))
        draw.rectangle([cx - 10, cy - 10, cx + 15, cy + 15], fill=(255, 255, 240))
    elif icon_type == "bread":
        # Bruschetta grilled toast + diced tomatoes + basil
        draw.rounded_rectangle([75, 100, 225, 200], radius=16, fill=(193, 154, 107), outline=(141, 103, 62), width=3)
        draw.rounded_rectangle([90, 115, 210, 185], radius=10, fill=(215, 177, 131))
        for tx, ty in [(110, 135), (150, 130), (180, 145), (135, 160)]:
            draw.ellipse([tx - 10, ty - 10, tx + 10, ty + 10], fill=(211, 47, 47))
        draw.ellipse([140, 140, 160, 155], fill=(56, 142, 60))
    elif icon_type == "fish":
        # Grilled fish fillet with lemon slice & grill marks
        draw.polygon([(85, 150), (130, 100), (220, 130), (200, 175), (120, 190)], fill=(230, 150, 90))
        for gx in [120, 150, 180]:
            draw.line([(gx, 115), (gx - 15, 175)], fill=(120, 70, 30), width=3)
        draw.ellipse([175, 110, 215, 150], fill=(244, 206, 20))
    elif icon_type == "pasta":
        # Pasta swirls with rich red marinara & parmesan
        for ang in range(0, 360, 45):
            draw.arc([90, 90, 210, 210], start=ang, end=ang + 60, fill=(245, 205, 120), width=12)
        draw.ellipse([115, 115, 185, 185], fill=(198, 40, 40))
        draw.ellipse([135, 135, 165, 165], fill=(255, 255, 230))
    elif icon_type == "dessert":
        # Lemon dessert cake slice
        draw.polygon([(90, 185), (210, 185), (185, 110), (115, 110)], fill=(255, 238, 140), outline=(212, 175, 55), width=2)
        draw.ellipse([125, 100, 175, 125], fill=(255, 255, 255))
        draw.ellipse([140, 90, 160, 110], fill=(244, 206, 20))
    elif icon_type == "drink":
        # Drink glass with lemon wedge & mint
        draw.rectangle([115, 80, 185, 220], fill=(235, 245, 255), outline=(150, 180, 210), width=3)
        draw.rectangle([120, 120, 180, 215], fill=(255, 235, 100))
        draw.ellipse([160, 70, 195, 105], fill=(244, 206, 20))
        draw.ellipse([135, 95, 155, 115], fill=(76, 175, 80))
    else:
        draw.ellipse([90, 90, 210, 210], fill=accent_color)

    # Dish Title & Category ribbon on bottom
    draw.rectangle([0, 240, W, 300], fill=(73, 94, 87))
    tfont = get_font(16, bold=True)
    cfont = get_font(12, bold=False)
    draw.text((W // 2, 260), title, fill=(255, 255, 255), font=tfont, anchor="mm")
    draw.text((W // 2, 282), category.upper(), fill=(244, 206, 20), font=cfont, anchor="mm")

    out_path = os.path.join("assets", "dishes", filename)
    img.save(out_path, "PNG")
    print(f"Created dish asset: {out_path}")

def main():
    os.makedirs("assets", exist_ok=True)
    os.makedirs(os.path.join("assets", "dishes"), exist_ok=True)
    
    create_app_icon()
    create_splash_icon()
    create_android_background()
    create_hero_image()
    
    # 10 dishes spanning Starters, Mains, Desserts, Drinks
    dishes = [
        ("greekSalad.jpg", "Greek Salad", "starters", (245, 245, 240), (76, 175, 80), "salad"),
        ("bruschetta.jpg", "Bruschetta", "starters", (245, 240, 235), (193, 154, 107), "bread"),
        ("grilledFish.jpg", "Grilled Fish", "mains", (240, 245, 245), (230, 150, 90), "fish"),
        ("pasta.jpg", "Pasta", "mains", (245, 240, 235), (198, 40, 40), "pasta"),
        ("lemonDessert.jpg", "Lemon Dessert", "desserts", (250, 250, 235), (244, 206, 20), "dessert"),
        ("lemonade.jpg", "Fresh Lemonade", "drinks", (240, 248, 255), (244, 206, 20), "drink"),
        ("baklava.jpg", "Baklava", "desserts", (245, 240, 230), (180, 120, 60), "dessert"),
        ("pitaHummus.jpg", "Pita & Hummus", "starters", (245, 245, 235), (220, 190, 130), "bread"),
        ("lambChops.jpg", "Lamb Chops", "mains", (245, 240, 240), (140, 60, 50), "fish"),
        ("icedTea.jpg", "Mediterranean Iced Tea", "drinks", (245, 245, 250), (160, 110, 70), "drink"),
    ]
    for fn, title, cat, bg, acc, itype in dishes:
        create_dish_image(fn, title, cat, bg, acc, itype)

if __name__ == "__main__":
    main()
