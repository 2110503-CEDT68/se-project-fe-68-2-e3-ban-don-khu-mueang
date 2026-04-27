import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';
import { getAuthToken, deletePromotionViaApi, getPromotionsViaApi } from './helpers/api';

test.describe('US 7-1: Admin creates promotion', () => {
    const testPromoName = `Promo-Create-${Date.now()}`;
    let adminToken: string;
    let createdPromoId: string | null = null;

    test.beforeAll(async () => {
        adminToken = await getAuthToken('admin@example.com', 'password');
    });

    test.afterAll(async () => {
        if (createdPromoId) {
            await deletePromotionViaApi(adminToken, createdPromoId).catch(() => {});
        }
    });

    test('TC7-1: Admin creates a promotion via Admin UI successfully', async ({ page }) => {
        await loginAsAdmin(page);
        await page.waitForTimeout(3000);
        await page.goto('/admin/promotions');
        await page.getByRole('button', { name: /create promotion/i }).click();

        await page.locator('input[placeholder*="Morning Mist Retreat"]').fill(testPromoName);
        await page.locator('input[placeholder*="20"]').fill('15');
        
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);
        
        await page.locator('input[type="date"]').first().fill(tomorrow.toISOString().split('T')[0]);
        await page.locator('input[type="date"]').nth(1).fill(nextWeek.toISOString().split('T')[0]);

        const isActiveCheckbox = page.getByLabel(/Active Promotion/i);
        if (!(await isActiveCheckbox.isChecked())) {
            await isActiveCheckbox.check();
        }

        await page.locator('form').getByRole('button', { name: 'Create Promotion', exact: true }).click();

        await expect(page.getByText(testPromoName)).toBeVisible({ timeout: 10000 });
        
        // Save ID for cleanup
        const promoRes = await getPromotionsViaApi(adminToken);
        const createdPromo = promoRes.data?.find((p: any) => p.name === testPromoName);
        if (createdPromo) {
            createdPromoId = createdPromo._id;
        }
    });

    test('TC7-2: Admin cannot create a promotion without filling required fields', async ({ page }) => {
        await loginAsAdmin(page);
        await page.waitForTimeout(3000);
        await page.goto('/admin/promotions');
        await page.getByRole('button', { name: /create promotion/i }).click();

        // Leave empty and attempt to submit
        const createBtn = page.locator('form').getByRole('button', { name: 'Create Promotion', exact: true });
        await createBtn.click();

        // Modal should remain open because API will fail or browser validation blocks submission
        await expect(page.getByText('Create Promotion').first()).toBeVisible({ timeout: 5000 });

        // Click cancel to ensure it closes cleanly
        await page.getByRole('button', { name: /Cancel/i }).click();
        await expect(page.locator('form')).not.toBeVisible();
    });
});