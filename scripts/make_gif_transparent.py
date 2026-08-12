import os
import sys
from PIL import Image, ImageSequence

def remove_gif_background(input_path, output_path, bg_color=None, tolerance=30):
    """
    Removes background color from an animated GIF and saves as transparent GIF.
    If bg_color is None, automatically uses top-left pixel color of first frame.
    """
    im = Image.open(input_path)
    frames = []
    durations = []
    
    # Target background color from top-left corner if not provided
    first_frame = im.convert('RGBA')
    if bg_color is None:
        target_r, target_g, target_b, _ = first_frame.getpixel((0, 0))
    else:
        target_r, target_g, target_b = bg_color

    for frame in ImageSequence.Iterator(im):
        # Store duration
        durations.append(frame.info.get('duration', 100))
        rgba_frame = frame.convert('RGBA')
        datas = rgba_frame.getdata()
        
        new_data = []
        for item in datas:
            r, g, b, a = item
            # Calculate color difference from background
            diff = abs(r - target_r) + abs(g - target_g) + abs(b - target_b)
            if diff <= tolerance * 3:
                new_data.append((0, 0, 0, 0))  # Transparent
            else:
                new_data.append((r, g, b, a))
                
        rgba_frame.putdata(new_data)
        frames.append(rgba_frame)
        
    if frames:
        # Save transparent GIF
        frames[0].save(
            output_path,
            save_all=True,
            append_images=frames[1:],
            duration=durations[0] if durations else 100,
            loop=0,
            disposal=2,
            transparency=0
        )
        print(f"Successfully created transparent GIF: {output_path}")

if __name__ == '__main__':
    # Test on a draft gif
    test_gif = r"c:\Study\HocKy6\LinguaFlow\draft\cow_draft_003.gif"
    out_gif = r"c:\Study\HocKy6\LinguaFlow\asssets\cow_transparent_003.gif"
    if os.path.exists(test_gif):
        remove_gif_background(test_gif, out_gif, tolerance=40)
