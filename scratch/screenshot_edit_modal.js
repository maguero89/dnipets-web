import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);

  // Click on "Probar la App (PRUEBA BETA SIMULATOR)"
  const betaButton = page.locator('text=PRUEBA BETA SIMULATOR').first();
  if (await betaButton.isVisible()) {
    await betaButton.click();
    await page.waitForTimeout(2000);
  }

  // Click on first pet in the list if visible
  const petItem = page.locator('.cursor-pointer').first();
  if (await petItem.isVisible()) {
    await petItem.click();
    await page.waitForTimeout(1500);

    // Click on settings gear button (title: "Editar perfil y foto")
    const settingsBtn = page.locator('button[title="Editar perfil y foto"]').first();
    if (await settingsBtn.isVisible()) {
      await settingsBtn.click();
      await page.waitForTimeout(1000);
    }
  }

  await page.screenshot({ path: 'edit_pet_modal_preview.png' });
  await browser.close();
})();
