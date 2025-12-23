async function parseProfile(page) {
  // Wait for profile name (most stable selector)
  await page.waitForSelector("h1", { timeout: 15000 });

  return await page.evaluate(() => {
    const text = (el) => (el ? el.innerText.trim() : null);

    const name = text(document.querySelector("h1"));

    // Headline is usually the first visible text-body-medium
    const headline = text(document.querySelector("div.text-body-medium"));

    // Location usually appears as inline text under headline
    const location = text(
      document.querySelector("span.text-body-small.inline")
    );

    // Connections often show as "500+ connections"
    const connections =
      Array.from(document.querySelectorAll("span"))
        .map((el) => el.innerText)
        .find((t) => t.includes("connections")) || null;

    return {
      name,
      headline,
      location,
      connections,
      experience: [],
      education: [],
      skills: [],
    };
  });
}

module.exports = { parseProfile };
