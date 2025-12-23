const { parseProfile } = require("../parsers/profileParser");
const { delay } = require("../utils/delay");
const { log } = require("../utils/logger");

async function scrapeProfile(page, profileUrl) {
  log("Navigating to profile...");
  await page.goto(profileUrl, { waitUntil: "networkidle" });
  await delay(3000);

  log("Extracting profile data...");
  const profileData = await parseProfile(page);

  return {
    profileUrl,
    ...profileData,
  };
}

module.exports = { scrapeProfile };
