const playwright = require('playwright');

async function fetchFarmingPageHtml(zipCode, ingredient) {
  let browser = null;
  try {
    // Launch the browser with additional arguments for Linux
    browser = await playwright.chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Set a longer timeout for navigation (e.g., 90 seconds)
    await page.goto('https://www.localharvest.org/plantation-fl/olives', { timeout: 90000 });

    // Wait for the search fields to be available
    await page.waitForSelector("#search-text", { state: 'visible', timeout: 15000 });
    await page.waitForSelector('#search-near', { state: 'visible', timeout: 15000 });

    // Fill in the search fields
    await page.fill("#search-text", ingredient);
    await page.fill('#search-near', zipCode);

    // Wait for and click the search button
    await page.waitForSelector('#search-form > span.searchglasswrap > span', { state: 'visible', timeout: 15000 });
    await page.click('#search-form > span.searchglasswrap > span');

    // Wait for the results to load with a more flexible selector
    await page.waitForSelector('.memberentriesblock .entry_title a', { state: 'visible', timeout: 45000 });

    // Get the title of the first farm
    const farmTitle = await page.$eval('.memberentriesblock .entry_title a', (element) => element.textContent.trim());

    return farmTitle;
  } catch (error) {
    console.error("An error occurred while fetching the farming page HTML:", error);
    if (error.name === 'TimeoutError') {
      return "Timeout: The page took too long to respond. Please try again later.";
    }
    return `An error occurred while fetching data: ${error.message}`;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
//yo

export default fetchFarmingPageHtml;