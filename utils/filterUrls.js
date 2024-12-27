const filterProductUrls = (links) => {
  return links.filter((url) =>
    url.includes('/product/') ||
    url.includes('/gp/') ||
    url.includes('/dp/') ||
    url.includes('/catalog/') ||
    url.includes('/p/') ||
    url.includes('/item/')
  );
};

module.exports = { filterProductUrls };
