import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 414, height: 896 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1500);

  // 1. Open Beta Simulator
  const betaBtn = page.locator('text=PRUEBA BETA SIMULATOR').first();
  if (await betaBtn.isVisible()) {
    await betaBtn.click();
    await page.waitForTimeout(1500);
  }

  // Login if required
  const emailInput = page.locator('input[type="email"]').first();
  const passInput = page.locator('input[type="password"]').first();
  const submitBtn = page.locator('button[type="submit"]').first();

  if (await emailInput.isVisible()) {
    await emailInput.fill('maguero89@gmail.com');
    await passInput.fill('123456');
    await submitBtn.click();
    await page.waitForTimeout(3000);
  }

  // Capture Dashboard Home with the new 1:1 Chat VetAI card
  await page.screenshot({ path: 'vetai_card_home_preview.png' });

  // Click on Chat VetAI card
  const vetAiCard = page.locator('text=Chat VetAI').first();
  if (await vetAiCard.isVisible()) {
    await vetAiCard.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'vetai_chat_screen_preview.png' });
  }

  await browser.close();
})();
