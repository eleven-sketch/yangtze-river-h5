"""Open H5 in mobile simulator. Stays open."""
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=False,
        args=["--window-size=420,900"],
    )
    page = browser.new_page(
        viewport={"width": 390, "height": 844},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.42",
    )
    page.goto("http://localhost:8765", wait_until="networkidle", timeout=30000)
    print("✅ 移动端模拟已开启")
    print("📱 iPhone 390×844 | 微信 UA | 触摸 | 2x DPR")
    print("Chrome 窗口保持常开，关闭即退出")

    # Block here — keeps browser alive
    time.sleep(86400)  # 24 hours
