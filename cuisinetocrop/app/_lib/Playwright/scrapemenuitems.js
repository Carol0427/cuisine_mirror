const playwright = require('playwright');

export async function ScrapeMenuItems(url) {
  console.log("Starting scrape process");
  let items = [];

  try {
    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'networkidle' });

    console.log("waited for network to be idle");

    // Selectors for the section headers (e.g., h3 elements for section titles) and items
    const sectionSelector = 'li.bb'; /*'li.bb.po, li.bb.ou, li.bb.ot';*/
    const headerSelector = 'div.e0 h3';
    const itemSelector = 'li[data-testid]';

    // Find all sections with headers and items
    const sections = await page.$$(sectionSelector);
    // await page.waitForTimeout(20000); // 20,000 milliseconds

    for (let section of sections) {
      // Get the header text (e.g., "MEAL DEAL", "DRINKS", etc.)
      const header = await section.$eval(headerSelector, el => el.textContent.trim());

      // Check if the header contains "DRINKS" or "BEVERAGES" (case-insensitive)
      if (/drink|beverage|wine|beer/i.test(header)) {
        console.log(`Skipping section: ${header}`);
        continue; // Skip this section
      }

      console.log(`Scraping section: ${header}`);

      // Scrape items in this section
      const sectionItems = await section.$$eval(itemSelector, (elements) => {
        return elements.map(el => {
          // Get the title from the span with data-testid="rich-text"
          const titleEl = el.querySelector('[data-testid="rich-text"]');
          const title = titleEl ? titleEl.textContent.trim() : '';

          // Get the description (if applicable)
          const descriptionEl = el.querySelector('.p5, .p6, .p7, .p8, .p4, .p3, .p2, .p1, .p9, .g3 .fw .g4 .be .di .bg .dj .b1');
          const description = descriptionEl ? descriptionEl.textContent.trim() : '';

          return {
            title: title || '', // Use empty string if no title found
            description: description || '' // Use empty string if no description found
          };
        });
      });

      // Add scraped items from this section to the main items array
      items.push(...sectionItems);
    }

    console.log("Scraped items:", items);
    await browser.close();
    console.log("closed browser");
  } catch (error) {
    console.error("Error during scraping:", error);
    throw error; // Re-throw the error to be caught in the API route
  }

  console.log("finished");
  return items;
}
