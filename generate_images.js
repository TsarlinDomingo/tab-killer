const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // 1. Generate Promo Image (440x280)
  console.log("Generating promo image...");
  await page.setViewport({ width: 440, height: 280, deviceScaleFactor: 2 });
  const promoUrl = `file://${path.join(__dirname, 'promo.html')}`;
  await page.goto(promoUrl);
  await page.screenshot({ path: 'promo-440x280.png', clip: { x: 0, y: 0, width: 440, height: 280 } });

  // 2. Generate Screenshot (1280x800)
  console.log("Generating screenshot...");
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  const screenshotUrl = `file://${path.join(__dirname, 'screenshot.html')}`;
  await page.goto(screenshotUrl);
  // Give iframe a moment to render
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshot-1280x800.png', clip: { x: 0, y: 0, width: 1280, height: 800 } });

  await browser.close();
  console.log("Done! Images generated.");
})();
