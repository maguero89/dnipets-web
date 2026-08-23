import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1500);

  // 1. Open Beta Simulator
  const betaBtn = page.locator('text=PRUEBA BETA SIMULATOR').first();
  if (await betaBtn.isVisible()) {
    await betaBtn.click();
    await page.waitForTimeout(1500);
  }

  // 2. Perform Login in Beta Simulator
  const emailInput = page.locator('input[type="email"]').first();
  const passInput = page.locator('input[type="password"]').first();
  const submitBtn = page.locator('button[type="submit"]').first();

  if (await emailInput.isVisible()) {
    await emailInput.fill('maguero89@gmail.com');
    await passInput.fill('123456'); // attempt login or check
    await submitBtn.click();
    await page.waitForTimeout(3000);
  }

  // Check if we reached dashboard or pet list
  const petCard = page.locator('div:has-text("AKIRA")').first();
  if (await petCard.isVisible()) {
    await petCard.click();
    await page.waitForTimeout(1500);

    // 1. Open Edit Pet Modal via Settings Gear Icon
    const settingsBtn = page.locator('button[title="Editar perfil y foto"]').first();
    if (await settingsBtn.isVisible()) {
      await settingsBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'preview_1_edit_pet_modal.png' });

      // Close modal
      const closeBtn = page.locator('button:has-text("X")').first();
      if (await closeBtn.isVisible()) await closeBtn.click();
      await page.waitForTimeout(500);
    }

    // 2. Open PIN Confirmation Modal when toggling Lost Mode
    const reportLostBtn = page.locator('button:has-text("Reportar Pérdida")').first();
    if (await reportLostBtn.isVisible()) {
      await reportLostBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'preview_2_pin_confirmation_modal.png' });

      // Close PIN modal
      const closePinBtn = page.locator('button:has-text("X")').first();
      if (await closePinBtn.isVisible()) await closePinBtn.click();
      await page.waitForTimeout(500);
    }

    // 3. Go to Owner Profile -> Security PIN Card
    const backBtn = page.locator('button:has-text("Volver")').first();
    if (await backBtn.isVisible()) await backBtn.click();
    await page.waitForTimeout(1000);

    const profileTab = page.locator('button:has-text("Perfil")').first();
    if (await profileTab.isVisible()) {
      await profileTab.click();
      await page.waitForTimeout(1000);

      const securityCard = page.locator('button:has-text("PIN de Seguridad")').first();
      if (await securityCard.isVisible()) {
        await securityCard.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'preview_3_owner_security_pin.png' });
      }
    }
  } else {
    // If not logged in, take screenshot of current view
    await page.screenshot({ path: 'preview_general.png' });
  }

  await browser.close();
})();
