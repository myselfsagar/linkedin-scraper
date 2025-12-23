async function parseCompanyEmployees(page) {
  return await page.evaluate(() => {
    const results = [];

    // Generic approach: look for profile links inside people section
    const profileLinks = Array.from(
      document.querySelectorAll('a[href*="/in/"]')
    );

    for (const link of profileLinks) {
      const name = link.innerText?.trim() || null;
      const profileUrl = link.href;

      if (!name || name.length > 50) continue;

      const card = link.closest("li, div");
      const title =
        card?.querySelector("div.text-body-medium")?.innerText?.trim() || null;

      const cleanUrl = profileUrl.split("?")[0];

      const location =
        card?.querySelector("div.text-body-small")?.innerText?.trim() || null;

      results.push({
        name,
        title,
        profileUrl: cleanUrl,
        location,
      });

      if (results.length >= 10) break;
    }

    return results;
  });
}

module.exports = { parseCompanyEmployees };
