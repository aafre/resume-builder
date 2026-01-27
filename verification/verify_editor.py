from playwright.sync_api import sync_playwright

def verify_editor():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to templates
        page.goto("http://localhost:5173/templates")

        # Wait for "Modern" template text or similar.
        # Let's verify what templates page renders.
        # But easier: I can simulate the AI import flow which allows template param?
        # "Exception: Allow ?template=X&imported=true for AI import flow only"

        page.goto("http://localhost:5173/editor?template=modern&imported=true")

        # Wait for "Imported Resume - Please Review" banner since imported=true
        # Or just wait for "Contact Information"
        page.wait_for_selector("text=Contact Information", timeout=15000)

        # Take screenshot
        page.screenshot(path="verification/editor.png")

        browser.close()

if __name__ == "__main__":
    verify_editor()
