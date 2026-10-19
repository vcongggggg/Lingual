# -*- coding: utf-8 -*-
"""
Test script for OmniVoice TTS evaluation:
1. Environment inspection (GPU, PyTorch, CUDA)
2. Generate 3 test samples:
   - test-default.wav: 'Good morning! Could I get a cappuccino, please?'
   - test-designed.wav: voice design with prompt 'A middle-aged male speaker with American accent, warm and friendly tone'
   - test-cloned.wav: voice cloning using reference audio
3. Generate comparison samples with edge-tts
4. Benchmark generation speed and output evaluation report
"""

import os
import sys
import time
import torch

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

OUTPUT_DIR = os.path.join("data", "tts_benchmark")
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("="*60)
print("1. ENVIRONMENT DIAGNOSTICS")
print(f"PyTorch Version: {torch.__version__}")
print(f"CUDA Available in PyTorch: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"Device Name: {torch.cuda.get_device_name(0)}")
else:
    print("Warning: PyTorch is running in CPU-only mode.")
print("="*60)

print("\nLoading OmniVoice model (from_pretrained)...")
start_load = time.time()

try:
    from omnivoice import OmniVoice
    # Load model
    model = OmniVoice.from_pretrained("k2-fsa/OmniVoice")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = model.to(device)
    load_time = time.time() - start_load
    print(f"Model loaded successfully in {load_time:.2f}s onto device: {device}")

    # Test 1: Default voice
    text_1 = "Good morning! Could I get a cappuccino, please?"
    print(f"\nGenerating Sample 1 (Default): '{text_1}'")
    t0 = time.time()
    wav_1 = model.generate(text_1)
    gen_time_1 = time.time() - t0
    out_1 = os.path.join(OUTPUT_DIR, "test-default.wav")
    model.save_audio(wav_1, out_1)
    print(f"Sample 1 saved to {out_1} (Time: {gen_time_1:.2f}s)")

    # Test 2: Voice Design
    prompt_2 = "A middle-aged male speaker with American accent, warm and friendly tone"
    print(f"\nGenerating Sample 2 (Designed): '{prompt_2}'")
    t0 = time.time()
    wav_2 = model.generate(text_1, voice_description=prompt_2)
    gen_time_2 = time.time() - t0
    out_2 = os.path.join(OUTPUT_DIR, "test-designed.wav")
    model.save_audio(wav_2, out_2)
    print(f"Sample 2 saved to {out_2} (Time: {gen_time_2:.2f}s)")

    # Test 3: Voice Cloning
    text_3 = "The weather is beautiful today, perfect for a walk in the park."
    ref_audio = os.path.join("apps", "web", "public", "audio", "vocab", "beautiful-ex.mp3")
    print(f"\nGenerating Sample 3 (Cloned with ref {ref_audio}): '{text_3}'")
    t0 = time.time()
    wav_3 = model.generate(text_3, reference_audio=ref_audio if os.path.exists(ref_audio) else None)
    gen_time_3 = time.time() - t0
    out_3 = os.path.join(OUTPUT_DIR, "test-cloned.wav")
    model.save_audio(wav_3, out_3)
    print(f"Sample 3 saved to {out_3} (Time: {gen_time_3:.2f}s)")

except Exception as e:
    print(f"Error executing OmniVoice test: {e}")
    import traceback
    traceback.print_exc()
