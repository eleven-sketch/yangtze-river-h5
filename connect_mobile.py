"""Connect to Chrome via CDP, apply mobile simulation, navigate to H5 page."""
from playwright.sync_api import sync_playwright

URL = "http://localhost:8765"

with sync_playwright() as p:
    print("Connecting to Chrome via CDP (port 9222)...")
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    print("Connected.")

    # Create mobile context (keep default context intact to avoid browser close)
    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.42",
    )

    page = context.new_page()
    page.on("console", lambda msg: print(f"[console.{msg.type}] {msg.text}"))
    page.on("pageerror", lambda err: print(f"[PAGE ERROR] {err}"))

    print(f"Navigating to {URL} ...")
    page.goto(URL, wait_until="networkidle", timeout=30000)
    print("✅ Page loaded with mobile simulation.")
    print("📱 iPhone 390×844 + WeChat UA + touch + 2x DPR")
    print("=" * 55)
    print("Chrome window will REMAIN OPEN after this script exits.")

    # Close the default blank page to clean up
    for ctx in browser.contexts:
        for p in ctx.pages:
            if p.url in ("about:blank", ""):
                p.close()

    print("Script done. Exiting (Chrome stays open).")
