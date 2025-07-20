// scrape_and_sum.mjs
import { chromium } from 'playwright';

const seeds = [65,66,67,68,69,70,71,72,73,74];

function extractNumbers(str) {
    // Find numbers (integer or float) in a string
    return (str.match(/-?\d+(\.\d+)?/g) || []).map(Number);
}

async function main() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    let total = 0;

    for (const seed of seeds) {
        const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
        await page.goto(url, {waitUntil: 'domcontentloaded'});
        // Wait for any table to appear (table may be dynamic)
        await page.waitForSelector('table');

        // Get all table cells
        const numbersOnPage = await page.$$eval('table td, table th', cells => {
            let numbers = [];
            for (const cell of cells) {
                // Extract numbers from cell text
                (cell.textContent.match(/-?\d+(\.\d+)?/g) || []).forEach(n => numbers.push(Number(n)));
            }
            return numbers;
        });

        const localSum = numbersOnPage.reduce((a, b) => a + b, 0);
        console.log(`[${seed}] Page sum:`, localSum);
        total += localSum;
    }

    await browser.close();
    console.log('TOTAL SUM:', total);
}

main();
