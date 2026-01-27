from playwright.sync_api import sync_playwright, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to templates page...")
        page.goto("http://localhost:5173/templates")

        try:
            page.wait_for_selector('h1', timeout=10000)
            os.makedirs('/home/jules/verification', exist_ok=True)
            page.screenshot(path='/home/jules/verification/templates.png')
            print("Templates page screenshot taken.")
        except Exception as e:
            print(f"Error loading templates page: {e}")

        # Try to find a template link
        print("Looking for template links...")
        # Inspecting standard button or link patterns
        # Usually "Use This Template" or links to /editor

        # Let's try to click the first "Use This Template" or similar
        # Or just find any link to /editor

        try:
             # Try to find a button/link that looks like a template selection
             # Assuming they link to /editor/...

             # Let's try to click a link containing "Use This Template" if it exists
             use_buttons = page.get_by_text("Use This Template")
             if use_buttons.count() > 0:
                 print("Found 'Use This Template' button, clicking...")
                 use_buttons.first.click()
             else:
                 print("No 'Use This Template' button found. Trying explicit URL.")
                 # Fallback to direct URL
                 page.goto("http://localhost:5173/editor/new?template=london")

             print("Waiting for editor to load...")
             # Wait for a section header like "Contact Information" or "Experience"
             # The EditorContent renders ContactInfoSection first.

             # EditorContent.tsx:
             # {contactInfo && ( ... <ContactInfoSection ... /> ... )}

             # ContactInfoSection usually has a title "Contact Information" or similar.

             # Also "Experience" section.

             page.wait_for_timeout(5000) # Give it some time

             page.screenshot(path='/home/jules/verification/editor_loading.png')

             # Check for "Contact" text
             if page.get_by_text("Contact").count() > 0 or page.get_by_text("Experience").count() > 0:
                 print("Editor loaded successfully.")
             else:
                 print("Editor might not have loaded correctly.")

        except Exception as e:
            print(f"Error navigating to editor: {e}")
            page.screenshot(path='/home/jules/verification/error.png')

        # Final screenshot
        page.screenshot(path='/home/jules/verification/editor_final.png')
        print("Final screenshot taken.")

        browser.close()

if __name__ == "__main__":
    run()
