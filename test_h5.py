"""Test H5 page in Chrome - headed mode for visual inspection."""
from playwright.sync_api import sync_playwright
import time
import sys

H5_DIR = r"d:\HuaweiMoveData\Users\28019\OneDrive\桌面\融媒体报道制作\H5"
URL = "http://localhost:8765"

with sync_playwright() as p:
    # Launch Chrome in headed mode (visible window)
    browser = p.chromium.launch(
        headless=False,
        args=[
            "--window-size=420,900",
            "--disable-blink-features=AutomationControlled",
        ]
    )
    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        device_scale_factor=2,
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.42",
    )
    page = context.new_page()

    # Capture console logs
    page.on("console", lambda msg: print(f"[console.{msg.type}] {msg.text}"))
    page.on("pageerror", lambda err: print(f"[PAGE ERROR] {err}"))

    print(f"Opening {URL} ...")
    page.goto(URL, wait_until="networkidle", timeout=30000)
    print("Page loaded.")

    # Wait a moment for preloader to finish
    page.wait_for_timeout(2000)

    # Check if preloader is gone
    preloader = page.locator("#preloader")
    if preloader.is_visible():
        print("Waiting for preloader to finish...")
        page.wait_for_selector("#preloader.done", timeout=15000)
        print("Preloader done.")

    # Take full page screenshot
    print("Taking full page screenshot...")
    page.screenshot(path=f"{H5_DIR}/screenshots/test_full.png", full_page=True)
    print("Saved: screenshots/test_full.png")

    # Take screenshots of each section
    sections = page.locator(".section, .section-tall")
    count = sections.count()
    print(f"Found {count} sections. Taking individual screenshots...")
    for i in range(count):
        section = sections.nth(i)
        section_id = section.get_attribute("id") or f"section-{i}"
        section.screenshot(path=f"{H5_DIR}/screenshots/test_{section_id}.png")
        print(f"  Saved: screenshots/test_{section_id}.png")

    # Scroll through each section with animation
    print("\nScrolling through sections (3s each)...")
    for i in range(count):
        section = sections.nth(i)
        section.scroll_into_view_if_needed()
        time.sleep(3)

    print("\nDone! Browser will stay open for 30 seconds for manual inspection.")
    print("You can interact with the page now.")
    time.sleep(30)

    browser.close()
    print("Browser closed.")
