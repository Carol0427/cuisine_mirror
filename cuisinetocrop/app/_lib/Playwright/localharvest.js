import { chromium } from 'playwright';

async function fetchFarmingPageHtml(zipCode, ingredient) {
  let browser = null;
  try {
    // Launch the browser
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Set a timeout for navigation (e.g., 30 seconds)
    await page.goto('https://www.localharvest.org/plantation-fl/olives', { timeout: 30000 });

    // Fill in the search fields
    await page.fill("#search-text", ingredient);  // Enter produce type (e.g., 'eggs')
    await page.fill('#search-near', zipCode); // Enter ZIP code (e.g., '33064')

    // Click the search button (ensure this selector points to the actual button)
    await page.click('#search-form > span.searchglasswrap > span'); // Adjust this selector if necessary

    // Wait for the results to load (you may need to adjust the selector to match the result container)
    await page.waitForSelector('#content > div > div:nth-child(1) > div.memberentriesblock > div:nth-child(3) > h4 > a', { timeout: 30000 }); // Adjust '.results-container' to the actual results container

    // Get the title of the first farm
    const farmTitle = await page.$eval('#content > div > div:nth-child(1) > div.memberentriesblock > div:nth-child(3) > h4 > a', (element) => element.textContent);

    return farmTitle;  // Return the fetched farm title
  } catch (error) {
    console.error("An error occurred while fetching the farming page HTML:", error);
    throw error;  // Rethrow the error to be handled elsewhere
  } finally {
    if (browser) {
      await browser.close();  // Ensure the browser is closed
    }
  }
}

export default fetchFarmingPageHtml;
