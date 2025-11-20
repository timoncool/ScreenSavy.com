
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(base_url="http://localhost:3000")

        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        print("Navigating to Retro TV page...")
        try:
            page.goto("/modes/video/retro-tv", timeout=30000)
            page.wait_for_load_state("networkidle")

            # Check if element exists
            if page.locator(".old-tv").count() > 0:
                print("Found .old-tv in DOM!")
                if page.locator(".old-tv").is_visible():
                    print("Element is visible.")
                else:
                    print("Element is in DOM but NOT visible.")
            else:
                print("Element .old-tv NOT found in DOM.")
                print("Dumping page content:")
                print(page.content())

        except Exception as e:
            print(f"Error: {e}")
            print("Dumping page content on error:")
            try:
                print(page.content())
            except:
                pass

        browser.close()

if __name__ == "__main__":
    run()
