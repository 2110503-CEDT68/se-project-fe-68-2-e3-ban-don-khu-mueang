//don't fix anything here!!!!
import { Page } from '@playwright/test';

export async function loginAs(page: Page, email: string, password: string) {
    await page.goto('/login');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/', { timeout: 15_000 });
}

export async function loginAsAdmin(page: Page) {
    await loginAs(page, 'admin@example.com', 'password');
}

export async function loginAsUser(page: Page) {
    await loginAs(page, 'user@example.com', 'password');
}
