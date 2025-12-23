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

  log("Opening People tab...");
  await page.goto(`${companyUrl}people/`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await delay(3000);

  await autoScroll(page, 5);

  await page
    .waitForSelector('a[href*="/in/"]', { timeout: 15000 })
    .catch(() => {});

  log("Extracting employee data...");
  const employees = await parseCompanyEmployees(page);

  return {
    companyUrl,
    employees,
  };
}

module.exports = { scrapeCompany };
