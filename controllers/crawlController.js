const { retryRequest } = require('../crawler/crawler'); // Use retryRequest for retrying crawls

const crawlDomains = async (req, res) => {
  const { domains } = req.body;

  // Validate input
  if (!domains || !Array.isArray(domains)) {
    return res.status(400).json({ error: "Invalid input. Provide a list of domains." });
  }

  const results = {};
  for (const domain of domains) {
    try {
      console.log(`Crawling domain: ${domain}`);
      
      // Retry mechanism integrated here
      const productUrls = await retryRequest(domain);
      
      results[domain] = productUrls;
    } catch (error) {
      console.error(`Error crawling ${domain}:`, error.message);
      results[domain] = { error: error.message };  // Storing the error message for each domain
    }
  }

  // Return final response with the results
  res.status(200).json({
    message: "Crawling completed successfully.",
    results
  });
};

module.exports = { crawlDomains };
