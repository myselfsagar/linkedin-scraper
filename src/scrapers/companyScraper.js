const { autoScroll } = require("../utils/scroll");
const { delay } = require("../utils/delay");
const { parseCompanyEmployees } = require("../parsers/companyParser");
const { log } = require("../utils/logger");

async function scrapeCompany(page, companyUrl) {
  log("Navigating to company page...");
  await page.goto(companyUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await delay(3000);

  const peopleUrl = companyUrl.endsWith("/")
    ? `${companyUrl}people/`
    : `${companyUrl}/people/`;

  log(`Opening People tab: ${peopleUrl}`);
  await page.goto(peopleUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await delay(3000);

  log("Scrolling to load employees...");
  await autoScroll(page, 5);

  // FIX: Wait for actual PROFILE LINKS to appear.
  // This ensures we don't start parsing while skeleton loaders are still on screen.
  try {
    await page.waitForSelector('ul li a[href*="/in/"]', { timeout: 15000 });
  } catch (e) {
    log(
      "Warning: No profile links detected. Page might be empty or restricted."
    );
  }

  log("Extracting employee data...");
  const employees = await parseCompanyEmployees(page);

  log(`Found ${employees.length} employees.`);

  return {
    companyUrl,
    employees,
  };
}

module.exports = { scrapeCompany };
