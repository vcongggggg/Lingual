import os
from PIL import Image

def audit_mascots():
    raw_dir = r"apps\web\public\mascot\raw"
    base_dir = r"apps\web\public\mascot"
    
    files = sorted([f for f in os.listdir(raw_dir) if f.endswith('.png')])
    print(f"Total raw stickers found: {len(files)}")
    
    valid_stickers = []
    flawed_stickers = []
    
    for f in files:
        path = os.path.join(raw_dir, f)
        try:
            im = Image.open(path)
            w, h = im.size
            mode = im.mode
            if mode != 'RGBA':
                im = im.convert('RGBA')
            alpha = im.split()[-1]
            bbox = alpha.getbbox()
            
            if not bbox:
                flawed_stickers.append((f, "Empty image / No visible pixels"))
                continue
                
            total_pixels = w * h
            hist = alpha.histogram()
            transparent_count = hist[0]
            solid_count = hist[255]
            trans_ratio = transparent_count / total_pixels
            content_ratio = 1.0 - trans_ratio
            
            # Check edge pixels to ensure clean cutout (no rectangular bounding box border)
            # Sample border pixels (top, bottom, left, right)
            border_opaque = 0
            for x in range(w):
                if alpha.getpixel((x, 0)) > 20: border_opaque += 1
                if alpha.getpixel((x, h - 1)) > 20: border_opaque += 1
            for y in range(h):
                if alpha.getpixel((0, y)) > 20: border_opaque += 1
                if alpha.getpixel((w - 1, y)) > 20: border_opaque += 1
                
            border_ratio = border_opaque / ((w + h) * 2)
            
            # If border pixels are mostly opaque, it's not a transparent cut-out sticker!
            if border_ratio > 0.25:
                flawed_stickers.append((f, f"Not transparent cutout - border has {border_ratio:.1%} opaque pixels"))
                continue
                
            if content_ratio < 0.05:
                flawed_stickers.append((f, f"Too little content: {content_ratio:.1%}"))
                continue
                
            valid_stickers.append({
                "file": f,
                "size": (w, h),
                "content_ratio": round(content_ratio, 3),
                "bbox": bbox,
            })
        except Exception as e:
            flawed_stickers.append((f, f"Error: {e}"))
            
    print(f"\n--- VALID CLEAN STICKERS ({len(valid_stickers)}) ---")
    for s in valid_stickers:
        print(f"PASS: {s['file']} | Size: {s['size']} | Content: {s['content_ratio']*100:.1f}% | BBox: {s['bbox']}")
        
    print(f"\n--- FLAWED / REJECTED STICKERS ({len(flawed_stickers)}) ---")
    for f, reason in flawed_stickers:
        print(f"FAIL: {f} | Reason: {reason}")
        
    # Also audit base mascot images
    print(f"\n--- AUDITING BASE MASCOTS IN apps/web/public/mascot ---")
    base_files = sorted([f for f in os.listdir(base_dir) if f.endswith('.png')])
    for bf in base_files:
        p = os.path.join(base_dir, bf)
        im = Image.open(p)
        alpha = im.convert('RGBA').split()[-1]
        bbox = alpha.getbbox()
        hist = alpha.histogram()
        content_ratio = 1.0 - (hist[0] / (im.size[0] * im.size[1]))
        print(f"Base Mascot: {bf} | Size: {im.size} | Content: {content_ratio*100:.1f}% | BBox: {bbox}")

if __name__ == "__main__":
    audit_mascots()
