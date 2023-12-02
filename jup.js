const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Read the wallet address from the file
    const walletFilePath = 'solana.txt';
    const wallet = fs.readFileSync(walletFilePath, 'utf8').trim();

    // Open the website
    await page.goto('https://solana.hedgehog.markets/');

    // Wait for the textarea to be present and then type the wallet
    await page.waitForSelector('#root > section:nth-child(3) > form > textarea');
    await page.type('#root > section:nth-child(3) > form > textarea', wallet);

    // You can add additional actions if needed, such as clicking a button to submit the form
    await page.waitForTimeout(2000); // Adjust the timeout as needed
    await page.click('#root > section:nth-child(3) > form > div > button'); // Replace with the actual button selector
    await page.waitForTimeout(20000); // Adjust the timeout as needed

    // Extract and log additional information from the paragraph
    const additionalInfo = await page.evaluate(() => {
      const infoSelector = '#root > section:nth-child(3) > div > p:nth-child(1)';
      const infoElement = document.querySelector(infoSelector);
      return infoElement ? infoElement.textContent.trim() : null;
    });

    console.log('Additional Information:', additionalInfo);

    // Extract and log the content from the table in a tabular format
    const tableData = await page.evaluate(() => {
      const selector = '#root > section:nth-child(3) > div > div > table > tbody';
      const rows = document.querySelectorAll(selector + ' > tr');
      const headers = Array.from(rows[0].querySelectorAll('th')).map(header => header.textContent.trim());
      const data = Array.from(rows).slice(1).map(row =>
        Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim())
      );

      return { headers, data };
    });

    console.table(tableData.headers);
    console.table(tableData.data);
  } catch (e) {
    console.error(`Error: ${e}`);
  } finally {
    await browser.close();
  }
})();
