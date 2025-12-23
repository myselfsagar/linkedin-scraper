const { initBrowser } = require("./browser/initBrowser");
const { scrapeCompany } = require("./scrapers/companyScraper");
const { scrapeProfile } = require("./scrapers/profileScraper");
const { writeCSV } = require("./utils/csvWriter");

(async () => {
  const args = process.argv.slice(2);
  const csvEnabled = args.includes("--csv");
  const filteredArgs = args.filter((arg) => arg !== "--csv");

  if (filteredArgs.length < 2) {
    console.error("Usage: node src/index.js <company|profile> <url> [--csv]");
    process.exit(1);
  }

  const [mode, url] = filteredArgs;

  const { browser, page } = await initBrowser();

  try {
    let result;

    if (mode === "company") {
      result = await scrapeCompany(page, url);
    } else if (mode === "profile") {
      result = await scrapeProfile(page, url);
    } else {
      console.error("Invalid mode. Use 'company' or 'profile'.");
      process.exit(1);
    }

    console.log(JSON.stringify(result, null, 2));

    if (!csvEnabled) {
      console.log("Tip: use --csv flag to export results as CSV");
    } else {
      if (mode === "company") {
        writeCSV("company_employees.csv", result.employees);
      } else {
        writeCSV("profile_data.csv", [result]);
      }
    }
  } catch (err) {
    console.error("Scraping failed:", err.message);
  } finally {
    await browser.close();
  }
})();
