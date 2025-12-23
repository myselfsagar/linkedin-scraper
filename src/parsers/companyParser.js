async function parseCompanyEmployees(page) {
  return await page.evaluate(() => {
    const results = [];

    // 1. Find all Profile Links (The most stable element)
    const links = Array.from(document.querySelectorAll('a[href*="/in/"]'));

    for (const link of links) {
      if (results.length >= 10) break;

      const name = link.innerText?.trim();

      // Filter out garbage links (images, icons, empty text)
      if (!name || name.length > 50 || name.includes("LinkedIn")) continue;

      // 2. Traverse UP to find the Employee Card Container
      // LinkedIn grid items are always <li> elements.
      const card = link.closest("li");

      if (!card) continue; // Skip if we can't find the container

      // 3. Extract Title & Location using Scoped Selectors
      // We look for text-body-medium (Title) and text-body-small (Location) INSIDE this card.

      // Title: Usually the first 'text-body-medium' or specific class below the name
      const titleEl =
        card.querySelector(".artdeco-entity-lockup__subtitle") ||
        card.querySelector("div.text-body-medium");

      // Location: Usually 'text-body-small' or caption
      const locationEl =
        card.querySelector(".artdeco-entity-lockup__caption") ||
        card.querySelector("div.text-body-small");

      // Clean the URL
      const cleanUrl = link.href.split("?")[0];

      results.push({
        name: name,
        title: titleEl ? titleEl.innerText.trim() : null,
        profileUrl: cleanUrl,
        location: locationEl ? locationEl.innerText.trim() : null,
      });
    }

    // Deduplicate by profileUrl (just in case)
    const uniqueResults = [];
    const seen = new Set();
    for (const r of results) {
      if (!seen.has(r.profileUrl)) {
        seen.add(r.profileUrl);
        uniqueResults.push(r);
      }
    }

    return uniqueResults;
  });
}

module.exports = { parseCompanyEmployees };
