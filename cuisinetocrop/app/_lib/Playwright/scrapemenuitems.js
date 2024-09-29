const playwright = require('playwright');

export async function ScrapeMenuItems(url) {
  console.log("Starting scrape process");
  let items = [];

  try {
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto(url);
    await page.waitForTimeout(5000);
    
    const itemSelector = 'li[data-test^="store-item-"]';
    items = await page.$$eval(itemSelector, (elements) => {
      return elements.map(el => {
        const titleEl = el.querySelector('[data-testid="rich-text"]');
        const descriptionEl = el.querySelector('.we');

        return {
          title: titleEl ? titleEl.textContent.trim() : null,
          description: descriptionEl ? descriptionEl.textContent.trim() : null,
          // You can add more fields as needed
        };
      });
    });

    await browser.close();
  } catch (error) {
    console.error("Error during scraping:", error);
    throw error; // Re-throw the error to be caught in the API route
  }

  console.log("Scraped items:", items);
  return items;
}