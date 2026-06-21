"""Open H5 in Chrome with mobile simulation - keep open indefinitely."""
from playwright.sync_api import sync_playwright
import time
import sys

URL = "http://localhost:8765"

with sync_playwright() as p:
    # Use persistent context — browser window survives script exit
    context = p.chromium.launch_persistent_context(
        user_data_dir=r"C:\Users\28019\AppData\Local\Temp\playwright_h5_profile",
        headless=False,
        viewport={"width": 390, "height": 844},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.42",
        args=[
            "--window-size=420,900",
            "--disable-blink-features=AutomationControlled",
        ],
        no_viewport=False,
    )

    page = context.new_page()
    page.on("console", lambda msg: print(f"[console.{msg.type}] {msg.text}"))
    page.on("pageerror", lambda err: print(f"[PAGE ERROR] {err}"))

    print(f"Opening {URL} with mobile simulation...")
    page.goto(URL, wait_until="networkidle", timeout=30000)
    print("✅ Page loaded. Chrome window will stay open until you close it.")
    print("📱 Simulating: iPhone + WeChat UA + touch + 2x DPR")
    print("=" * 55)

    # Keep alive — check connection every second
    try:
        while True:
            if not page.is_closed():
                time.sleep(1)
            else:
                print("Page was closed.")
                break
    except KeyboardInterrupt:
        print("\nKeyboard interrupt received.")

    context.close()
    print("Browser closed.")
