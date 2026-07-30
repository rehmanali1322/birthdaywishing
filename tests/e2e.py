from pathlib import Path
import subprocess, time
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PORT = 4173
BASE = f"http://127.0.0.1:{PORT}"
SCREEN_DIR = ROOT / "tests" / "screenshots"
SCREEN_DIR.mkdir(exist_ok=True)

subprocess.run(["node", "scripts/build.mjs"], cwd=ROOT, check=True)
server = subprocess.Popen(["node", "scripts/dev.mjs", "--dir", "dist", "--port", str(PORT)], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
time.sleep(0.7)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/usr/bin/chromium", args=["--no-sandbox", "--disable-dev-shm-usage", "--autoplay-policy=no-user-gesture-required"])
        viewports = [(320, 568), (360, 800), (390, 844), (430, 932), (1440, 900)]
        for width, height in viewports:
            context = browser.new_context(viewport={"width": width, "height": height})
            page = context.new_page()
            errors = []
            page.on("console", lambda msg, errors=errors: errors.append(msg.text) if msg.type == "error" else None)
            page.goto(BASE, wait_until="load")
            page.wait_for_selector("#app:not([hidden])")
            page.wait_for_timeout(750)
            assert "Ayaan" in page.locator("#introTitle").inner_text()
            overflow = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 2")
            assert not overflow, f"horizontal overflow at {width}x{height}"
            if width <= 430:
                button_box = page.locator('[data-action="start"]').bounding_box()
                assert button_box and button_box["y"] + button_box["height"] <= height + 2, f"start button below first viewport at {width}x{height}"
            page.screenshot(path=str(SCREEN_DIR / f"home-{width}x{height}.png"), full_page=False)
            assert not errors, f"console errors at {width}x{height}: {errors}"
            context.close()

        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()
        errors = []
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.goto(BASE, wait_until="load")
        page.wait_for_selector("#app:not([hidden])")
        page.wait_for_timeout(650)
        page.click('[data-action="start"]')
        page.wait_for_selector('.scene[data-scene="1"].is-active')
        page.click('#musicButton'); page.click('#musicButton')
        page.click('.scene[data-scene="1"] [data-action="next"]')
        page.wait_for_selector('.scene[data-scene="2"].is-active')
        page.click('.scene[data-scene="2"] [data-action="next"]')
        page.wait_for_selector('.scene[data-scene="3"].is-active')
        page.click('#giftButton'); page.wait_for_selector('#giftReveal.is-visible')
        page.click('#giftReveal [data-action="next"]')
        page.wait_for_selector('.scene[data-scene="4"].is-active'); page.wait_for_timeout(500)
        page.click('#candleButton'); page.wait_for_selector('#cakeNext:not(.is-hidden)'); page.wait_for_timeout(400)
        page.screenshot(path=str(SCREEN_DIR / "cake-mobile.png"))
        page.click('#cakeNext'); page.wait_for_selector('.scene[data-scene="5"].is-active')
        before = page.evaluate("window.__BIRTHDAY_APP__.state.memoryIndex")
        page.click('[data-action="memory-next"]')
        assert page.evaluate("window.__BIRTHDAY_APP__.state.memoryIndex") != before
        page.click('.scene[data-scene="5"] [data-action="next"]')
        page.wait_for_selector('.scene[data-scene="6"].is-active')
        for card in page.locator('.reason-card').all(): card.click()
        page.wait_for_selector('#reasonNext:not(.is-hidden)'); page.wait_for_timeout(500); assert page.locator('.reason-card__back').first.is_visible(); page.click('#reasonNext')
        page.wait_for_selector('.scene[data-scene="7"].is-active'); page.click('#envelope')
        page.wait_for_selector('#letterCard.is-visible'); page.click('#letterCard [data-action="next"]')
        page.wait_for_selector('.scene[data-scene="8"].is-active'); page.wait_for_timeout(750)
        assert "Happy 1st Birthday" in page.locator("#finalTitle").inner_text()
        page.screenshot(path=str(SCREEN_DIR / "finale-mobile.png"))
        page.click('[data-action="replay"]'); page.wait_for_selector('.scene[data-scene="0"].is-active')
        assert page.evaluate("window.__BIRTHDAY_APP__.state.scene") == 0
        assert not errors, f"journey console errors: {errors}"
        context.close()

        # Studio text + image upload persistence on the same deployed origin.
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()
        page.goto(BASE + "/studio/", wait_until="load")
        assert page.locator("#name").input_value() == "Ayaan"
        page.fill("#name", "Test Little Star")
        page.click("#saveText")
        page.locator('[data-media-key="heroPhoto"]').set_input_files(str(SCREEN_DIR / "home-390x844.png"))
        page.wait_for_function("document.querySelector('#mediaStatus').textContent.includes('saved for local preview')")
        page.goto(BASE, wait_until="load"); page.wait_for_selector("#app:not([hidden])"); page.wait_for_timeout(500)
        assert "Test Little Star" in page.locator("#introTitle").inner_text()
        assert page.locator('[data-media="heroPhoto"]').get_attribute("src").startswith("blob:")
        # Broken-image fallback.
        page.evaluate("document.querySelector('[data-media=heroPhoto]').src='/does-not-exist.png'")
        page.wait_for_function("document.querySelector('[data-media=heroPhoto]').dataset.fallbackApplied === 'true'")
        assert not page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 2")
        context.close()

        # Long name on narrow phone.
        context = browser.new_context(viewport={"width": 320, "height": 568})
        page = context.new_page(); page.goto(BASE, wait_until="load")
        page.evaluate("localStorage.setItem('little-star-studio-v2', JSON.stringify({recipient:{name:'Muhammad Zain-ul-Abideen'}}))")
        page.reload(wait_until="load"); page.wait_for_selector("#app:not([hidden])"); page.wait_for_timeout(600)
        assert "Muhammad Zain-ul-Abideen" in page.locator("#introTitle").inner_text()
        assert not page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 2")
        context.close()

        reduced = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        page = reduced.new_page(); page.goto(BASE, wait_until="load"); page.wait_for_selector("#app:not([hidden])")
        assert page.locator(".celebration-rain").count() == 1
        page.click('[data-action="start"]'); page.wait_for_selector('.scene[data-scene="1"].is-active')
        reduced.close(); browser.close()
        print("E2E passed: 5 responsive viewports, full story, music, gift, cake, memories, letter/finale/replay, Studio uploads, broken-image fallback, long-name, and reduced-motion.")
finally:
    server.terminate()
    try: server.wait(timeout=3)
    except subprocess.TimeoutExpired: server.kill()
