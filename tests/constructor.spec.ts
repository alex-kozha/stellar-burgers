import { test, expect } from '@playwright/test';

const MOCK_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDE4MjFhNmExNzJkMDAxYjk4ZTU5ZiIsImlhdCI6MTc4MjY4MTE1NCwiZXhwIjoxNzgyNjgyMzU0fQ.tnBie5mCpNCKr2iZ_vFpyjR7q0Pz6p3HRrkWdEHBGbw';

test.describe('конструктор тесты', () => {
  test.beforeEach(async ({ page }) => {

    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

  
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            email: 'test@test.com',
            name: 'Test User'
          }
        })
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          order: {
            number: 12345
          }
        })
      });
    });

   
    await page.addInitScript((token) => {
      localStorage.setItem('accessToken', token);
    }, MOCK_TOKEN);

    
    await page.goto('http://localhost:4000');
    await page.waitForSelector('[data-testid="ingredient-card"]', { timeout: 10000 });
  });

  test('добавление ингредиента (начинки)', async ({ page }) => {
    const ingredientCard = page.locator('[data-testid="ingredient-card"]').filter({ hasText: 'Соус Spicy-X' });
    await expect(ingredientCard).toBeVisible({ timeout: 5000 });
    await ingredientCard.locator('[data-testid="add-button"] button').click();
    
    const constructorItems = page.locator('[data-testid="constructor-item"]');
    await expect(constructorItems).toHaveCount(1, { timeout: 5000 });
    await expect(constructorItems).toContainText('Соус Spicy-X');
  });

  test('открытие модального окна ингредиента', async ({ page }) => {
    const ingredientCard = page.locator('[data-testid="ingredient-card"]').filter({ hasText: 'Соус Spicy-X' });
    await expect(ingredientCard).toBeVisible({ timeout: 5000 });
    await ingredientCard.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal).toContainText('Соус Spicy-X');
  });

  test('закрытие модального окна по крестику', async ({ page }) => {
  const ingredientCard = page.locator('[data-testid="ingredient-card"]').filter({ hasText: 'Соус Spicy-X' });
  await expect(ingredientCard).toBeVisible({ timeout: 5000 });
  await ingredientCard.click();

  const modal = page.locator('[data-testid="modal"]');
  await expect(modal).toBeVisible({ timeout: 5000 });

  
  const closeButton = page.locator('[data-testid="modal-close"]');
  await expect(closeButton).toBeVisible({ timeout: 5000 });
  
 
  await page.evaluate(() => {
    const button = document.querySelector('[data-testid="modal-close"]') as HTMLElement;
    if (button) {
      
      const svg = button.querySelector('svg');
      if (svg) {
        
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        });
        svg.dispatchEvent(clickEvent);
      }
    }
  });
  

  await expect(modal).not.toBeVisible({ timeout: 15000 });
});
  test('создание заказа', async ({ page }) => {

    const bunCard = page.locator('[data-testid="ingredient-card"]').filter({ hasText: 'Краторная булка' });
    await expect(bunCard).toBeVisible({ timeout: 5000 });
    await bunCard.locator('[data-testid="add-button"] button').click();

   
    const ingredient = page.locator('[data-testid="ingredient-card"]').filter({ hasText: 'Соус Spicy-X' });
    await expect(ingredient).toBeVisible({ timeout: 5000 });
    await ingredient.locator('[data-testid="add-button"] button').click();

    
    const checkoutButton = page.locator('[data-testid="checkout-button"]');
    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();

    
    const orderModal = page.locator('[data-testid="order-modal"]');
    await expect(orderModal).toBeVisible({ timeout: 15000 });
    await expect(orderModal).toContainText(/[0-9]+/);

   
    const constructorItems = page.locator('[data-testid="constructor-item"]');
    await expect(constructorItems).toHaveCount(0, { timeout: 5000 });

    
    const closeButton = page.locator('[data-testid="modal-close"]');
    await expect(closeButton).toBeVisible({ timeout: 5000 });
    await closeButton.click();
    await expect(orderModal).not.toBeVisible({ timeout: 5000 });
  });
});
