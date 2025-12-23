const { delay } = require("./delay");

async function autoScroll(page, maxScrolls = 5) {
  for (let i = 0; i < maxScrolls; i++) {
    await page.evaluate(() => {
      const scrollContainer =
        document.querySelector(".scaffold-finite-scroll__content") ||
        document.scrollingElement;

      scrollContainer.scrollBy(0, scrollContainer.scrollHeight);
    });

    await delay(2000);
  }
}

module.exports = { autoScroll };
