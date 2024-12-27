const puppeteer = require('puppeteer');
const { filterProductUrls } = require('../utils/filterUrls');

// Function to retry crawling with multiple attempts
const retryRequest = async (domain, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await discoverProductUrls(domain);
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed for ${domain}:`, error.message);
      attempt++;
      if (attempt >= retries) {
        throw new Error(`Failed to crawl ${domain} after ${retries} attempts`);
      }
    }
  }
};

// Main function to discover product URLs
const discoverProductUrls = async (domain) => {
  const browser = await puppeteer.launch({
    headless: false, // Run in non-headless mode for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
  });
  const page = await browser.newPage();

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    
    // Increased timeout to 120 seconds (2 minutes)
    await page.goto(`https://${domain}`, { waitUntil: 'domcontentloaded', timeout: 120000 });

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map((a) => a.href)
        .filter(Boolean);
    });

    await browser.close();
    return filterProductUrls(links);
  } catch (error) {
    console.error(`Error crawling ${domain}:`, error.message);
    await browser.close();
    throw error;
  }
};

module.exports = { retryRequest };
