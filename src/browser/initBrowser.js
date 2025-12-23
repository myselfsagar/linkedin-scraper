const { chromium } = require("playwright");
const fs = require("fs");

async function initBrowser() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  if (fs.existsSync("cookies/linkedin-cookies.json")) {
    let cookies = JSON.parse(
      fs.readFileSync("cookies/linkedin-cookies.json", "utf-8")
    );

    // Normalize cookies for Playwright
    cookies = cookies.map((cookie) => ({
      ...cookie,
      sameSite:
        cookie.sameSite === "no_restriction" ||
        cookie.sameSite === "unspecified"
          ? "None"
          : cookie.sameSite,
    }));

    await context.addCookies(cookies);
  }

  const page = await context.newPage();
  return { browser, page };
}

module.exports = { initBrowser };
