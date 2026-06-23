"""Open H5 with 320px width mobile simulation."""
from playwright.sync_api import sync_playwright
import time

URL = "http://localhost:8765"

with sync_playwright() as p:
    context = p.chromium.launch_persistent_context(
        user_data_dir=r"C:\Users\28019\AppData\Local\Temp\playwright_h5_320",
        headless=False,
        viewport={"width": 320, "height": 844},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.42",
        args=[
            "--window-size=350,900",
            "--disable-blink-features=AutomationControlled",
        ],
        no_viewport=False,
    )

    page = context.new_page()
    page.on("console", lambda msg: print(f"[console.{msg.type}] {msg.text}"))
    page.on("pageerror", lambda err: print(f"[PAGE ERROR] {err}"))

    print(f"Opening {URL} with 320px mobile simulation...")
    page.goto(URL, wait_until="networkidle", timeout=30000)
    print("✅ Page loaded (320px). Chrome window will stay open.")
    print("📱 320×844 + WeChat UA + touch + 2x DPR")

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
