from rembg import remove
from PIL import Image
import os

img_dir = "apps/web/public/images/games"
files = [
    ("card-word-match-3d.jpg", "card-word-match-3d.png"),
    ("card-sentence-scramble-3d.jpg", "card-sentence-scramble-3d.png"),
    ("card-typing-race-3d.jpg", "card-typing-race-3d.png"),
    ("card-fill-blitz-3d.jpg", "card-fill-blitz-3d.png"),
]

for src_name, dest_name in files:
    src_path = os.path.join(img_dir, src_name)
    dest_path = os.path.join(img_dir, dest_name)
    if os.path.exists(src_path):
        print(f"Processing {src_name} -> {dest_name}...")
        input_image = Image.open(src_path)
        output_image = remove(input_image)
        output_image.save(dest_path, "PNG")
        print(f"Saved: {dest_path}")
    else:
        print(f"File not found: {src_path}")

print("Done: All 4 3D subjects processed successfully!")
