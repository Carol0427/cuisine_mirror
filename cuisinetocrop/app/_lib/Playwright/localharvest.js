const playwright = require('playwright');

async function fetchFarmingPageHtml(zipCode, ingredient) {
  let browser = null;
  let farmnlink = [];
  try {
    // Launch the browser with additional arguments for Linux
    browser = await playwright.chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Set a longer timeout for navigation (e.g., 90 seconds)
    await page.goto('https://www.localharvest.org/', { timeout: 180000 });

    // Wait for the search fields to be available
    await page.waitForSelector('#search-dropdown'), { state: 'visible', timeout: 15000 };
    await page.waitForSelector("#search-text", { state: 'visible', timeout: 15000 });
    await page.waitForSelector('#search-near', { state: 'visible', timeout: 15000 });

    // Fill in the search fields
    await page.click('#search-dropdown');
    await page.waitForSelector('#navmenupalette', { 
      state: 'visible',
      timeout: 5000
  });
    await page.click('a.search-panel-cat[data-cat="0"]');
    await page.fill("#search-text", ingredient);
    await page.fill('#search-near', zipCode);

    // Wait for and click the search button
    await page.waitForSelector('#search-form > span.searchglasswrap > span', { state: 'visible', timeout: 15000 });
    await page.click('#search-form > span.searchglasswrap > span');

    // Wait for the results to load
    await page.waitForTimeout(2000); // Add a slight delay for the results to be processed

    // Check if the "no farms found" message is displayed
    const noFarmsFound = await page.$('.alert.negative'); // Adjust selector if needed
    if (noFarmsFound) {
      const message = "No farms found near you";
      return message; // Return the no farms found message
    }
    
    // Wait for the results to load with a more flexible selector
    await page.waitForSelector('.memberentriesblock .entry_title a, .memberentriesblock .membercell a', { state: 'visible', timeout: 60000 });

    // Get the title of the first farm
    const farmTitle = await page.$eval('.memberentriesblock .entry_title a, .memberentriesblock .membercell a', (element) => element.textContent.trim());
    console.log(farmTitle);
    farmnlink.push(farmTitle);
    await page.click('.membercell h4.inline a');
    
    const newPageUrl = page.url();
    farmnlink.push(newPageUrl);
    console.log(newPageUrl);
    return farmnlink;
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