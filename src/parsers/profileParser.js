// src/parsers/profileParser.js
async function parseProfile(page) {
  await page.waitForSelector("h1", { timeout: 15000 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);

  return await page.evaluate(() => {
    const text = (el) => (el ? el.innerText.trim() : null);

    const name = text(document.querySelector("h1"));
    const headline = text(document.querySelector("div.text-body-medium"));
    const location = text(
      document.querySelector("span.text-body-small.inline")
    );
    const connections =
      Array.from(document.querySelectorAll("span"))
        .map((el) => el.innerText)
        .find((t) => t.includes("connections")) || null;

    const scrapeSection = (anchorId) => {
      const anchor = document.getElementById(anchorId);
      if (!anchor) return [];
      const section = anchor.closest("section");
      if (!section) return [];

      const items = section.querySelectorAll("li");
      const results = [];

      items.forEach((item) => {
        const rawText = item.innerText.trim();
        if (!rawText || rawText.length < 3) return;

        // Use aria-hidden to get clean, visible text only
        let lines = Array.from(
          item.querySelectorAll('span[aria-hidden="true"]')
        )
          .map((s) => s.innerText.trim())
          .filter((t) => t);

        if (lines.length === 0)
          lines = rawText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l);

        if (lines[0].includes("Skills") || lines[0].includes("Grade:")) return;

        if (lines.length >= 2) {
          results.push({
            title: lines[0],
            subtitle: lines[1],
            duration: lines.find((l) => l.match(/\d{4}/)) || null,
            location:
              lines.find(
                (l) =>
                  l.includes("India") ||
                  l.includes("United States") ||
                  l.includes("Remote")
              ) || null,
          });
        }
      });
      return results;
    };

    const scrapeSkills = () => {
      const anchor = document.getElementById("skills");
      if (!anchor) return [];
      const section = anchor.closest("section");
      if (!section) return [];

      const skillElements = section.querySelectorAll(
        'span[aria-hidden="true"]'
      );
      const skills = new Set();
      skillElements.forEach((el) => {
        const t = el.innerText.trim();
        if (
          t &&
          t !== "Skills" &&
          !t.includes("Show all") &&
          !t.includes("Endorsed")
        )
          skills.add(t);
      });
      return Array.from(skills).slice(0, 15);
    };

    return {
      name,
      headline,
      location,
      connections,
      experience: scrapeSection("experience"),
      education: scrapeSection("education"),
      skills: scrapeSkills(),
    };
  });
}

module.exports = { parseProfile };
