"""Simple mobile sim — just works."""
from playwright.sync_api import sync_playwright
import sys, time

WIDTH = int(sys.argv[1]) if len(sys.argv) > 1 else 390
URL = "http://localhost:8765"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, args=["--window-size=%d,900" % (WIDTH+30)])
    context = browser.new_context(
        viewport={"width": WIDTH, "height": 844},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.42",
    )
    page = context.new_page()
    page.on("console", lambda msg: print(f"[{msg.type}] {msg.text}"))
    page.on("pageerror", lambda err: print(f"[ERR] {err}"))
    page.goto(URL, wait_until="networkidle", timeout=30000)
    print(f"✅ {WIDTH}×844 | iPhone + WeChat UA + touch")
    print("Close browser window to exit, or Ctrl+C here.")
    try:
        while True:
            if page.is_closed(): break
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    context.close()
    browser.close()
