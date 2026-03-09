// Choice: Playwright (JavaScript/Node.js). 
// Reason: Playwright provides superior native auto-waiting mechanisms, faster execution speeds for modern web applications, and seamless integration with the Node.js ecosystem.

const { test, expect } = require('@playwright/test');
require('dotenv').config(); 

test.describe('Learner Journey: E2E Enrollment Flow', () => {

  test('User can register, log in, search for a course, and add it to the basket', async ({ page }) => {
    
    const baseUrl = process.env.BASE_URL;
    await page.goto(baseUrl);

    const uniqueEmail = `learner${Date.now()}@testqa.com`;
    const password = process.env.TEST_USER_PASS;

    await page.getByRole('link', { name: /sign in/i }).click();
    await page.getByRole('link', { name: /register/i }).click();
    
    // 🛡️ Bulletproof Registration Form
    await page.locator('[data-test="first-name"], #first-name, [placeholder*="First name"]').fill('QA');
    await page.locator('[data-test="last-name"], #last-name, [placeholder*="last name"]').fill('Tester');
    await page.locator('[data-test="dob"], #dob, [placeholder*="YYYY-MM-DD"]').fill('1990-01-01');
    await page.locator('[data-test="address"], [data-test="street"], #address, [placeholder*="Street"]').fill('123 Testing Lane');
    await page.locator('[data-test="postcode"], [data-test="zipcode"], #postcode, #zipcode, [placeholder*="Postcode"]').fill('110001');
    await page.locator('[data-test="city"], #city, [placeholder*="City"]').fill('Delhi');
    await page.locator('[data-test="state"], #state, [placeholder*="State"]').fill('Delhi');
    await page.locator('[data-test="country"], #country').selectOption('IN');
    await page.locator('[data-test="phone"], #phone, [placeholder*="phone"]').fill('9876543210');
    await page.locator('[data-test="email"], #email, [placeholder*="email"]').fill(uniqueEmail);
    await page.locator('[data-test="password"], #password, [placeholder*="password"]').fill(password);
    
    await page.locator('button:has-text("Register"), [data-test="register-submit"]').click();
    await expect(page.locator('h1, h2, h3').filter({ hasText: /Login/i })).toBeVisible({ timeout: 10000 });

    // 🛡️ Bulletproof Login Form
    await page.locator('[data-test="email"], #email, [placeholder*="email"]').fill(uniqueEmail);
    await page.locator('[data-test="password"], #password, [placeholder*="password"]').fill(password);
    await page.locator('button:has-text("Login"), [data-test="login-submit"]').click();

    await expect(page).toHaveURL(/.*account/);

    // 🛡️ Bulletproof Search
    await page.goto(baseUrl);
    const searchInput = page.locator('[data-test="search-query"], [placeholder*="Search"]');
    await searchInput.fill('Pliers'); 
    await page.locator('button:has-text("Search"), [data-test="search-submit"]').click();

    const itemCard = page.locator('.card-title', { hasText: 'Combination Pliers' }).first();
    await expect(itemCard).toBeVisible(); 
    await itemCard.click();

    // 🛡️ Bulletproof Cart Addition (The final fix!)
    // We click the button using flexible text matching
    await page.locator('button:has-text("Add to cart"), [data-test="add-to-cart"]').click();

    // We look at the entire Cart navigation link to see if the text '1' appears anywhere inside it
    const cartNavButton = page.locator('[data-test="nav-cart"], [href*="cart"], .fa-shopping-cart').first();
    await expect(cartNavButton).toContainText('1', { timeout: 10000 }); 
  });

});