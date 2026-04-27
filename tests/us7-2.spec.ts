import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';
import { getAuthToken, createPromotionViaApi, deletePromotionViaApi } from './helpers/api';

const getPromoCard = (page: any, name: string) =>
    page.locator('div.rounded-3xl').filter({ hasText: name }).first();

const seedThenGoto = async (page: any, name: string, adminToken: string) => {
    // Seed first so DB has time to propagate while we login
    await createPromotionViaApi(adminToken, {
        name, amount: 10,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        isActive: true, conditions: { enabled: false, minReservations: 0 }
    });
    await loginAsAdmin(page);
    await page.waitForTimeout(3000);
    await page.goto('/admin/promotions').catch(() => page.goto('/admin/promotions'));
    await page.waitForSelector('h2', { timeout: 15000 });
    for (let i = 0; i < 20; i++) {
        if (await page.getByText(name).isVisible().catch(() => false)) return;
        await page.reload();
        await page.waitForSelector('h2', { timeout: 15000 });
    }
};

test.describe('US 7-2: Admin updates promotion', () => {

    test('TC7-3: Admin updates an existing promotion via Admin UI successfully', async ({ page }, testInfo) => {
        test.setTimeout(300000);
        const ts = Date.now();
        const promoName = `Promo-UpdateOrig-${testInfo.project.name}-${ts}`;
        const updatedName = `Promo-Updated-${testInfo.project.name}-${ts}`;
        const adminToken = await getAuthToken('admin@example.com', 'password');
        const res = await createPromotionViaApi(adminToken, {
            name: promoName, amount: 10,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
            isActive: true, conditions: { enabled: false, minReservations: 0 }
        });
        const promoId = res.data?._id;

        try {
            await loginAsAdmin(page);
            await page.waitForTimeout(3000);
            await page.goto('/admin/promotions').catch(() => page.goto('/admin/promotions'));
            await page.waitForSelector('h2', { timeout: 15000 });
            for (let i = 0; i < 20; i++) {
                if (await page.getByText(promoName).isVisible().catch(() => false)) break;
                await page.reload();
                await page.waitForSelector('h2', { timeout: 15000 });
            }

            const promoCard = getPromoCard(page, promoName);
            await promoCard.getByRole('button').filter({ has: page.locator('img[alt="Edit"]') }).click();
            await page.locator('input[placeholder*="Morning Mist Retreat"]').fill(updatedName);
            await page.locator('input[placeholder*="20"]').fill('25');
            await page.getByRole('button', { name: 'Update Promotion' }).click();

            await expect(page.getByText(updatedName).first()).toBeVisible({ timeout: 10000 });
            await expect(getPromoCard(page, updatedName).getByText('25%')).toBeVisible();
        } finally {
            await deletePromotionViaApi(adminToken, promoId).catch(() => {});
        }
    });

    test('TC7-4: Admin cancels promotion update and keeps the original details', async ({ page }, testInfo) => {
        test.setTimeout(300000);
        const promoName = `Promo-CancelEdit-${testInfo.project.name}-${Date.now()}`;
        const adminToken = await getAuthToken('admin@example.com', 'password');
        const res = await createPromotionViaApi(adminToken, {
            name: promoName, amount: 10,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
            isActive: true, conditions: { enabled: false, minReservations: 0 }
        });
        const promoId = res.data?._id;

        try {
            await loginAsAdmin(page);
            await page.waitForTimeout(3000);
            await page.goto('/admin/promotions').catch(() => page.goto('/admin/promotions'));
            await page.waitForSelector('h2', { timeout: 15000 });
            for (let i = 0; i < 20; i++) {
                if (await page.getByText(promoName).isVisible().catch(() => false)) break;
                await page.reload();
                await page.waitForSelector('h2', { timeout: 15000 });
            }

            const promoCard = getPromoCard(page, promoName);
            await promoCard.getByRole('button').filter({ has: page.locator('img[alt="Edit"]') }).click();
            const tempName = `Cancelled-Name-${Date.now()}`;
            await page.locator('input[placeholder*="Morning Mist Retreat"]').fill(tempName);
            await page.getByRole('button', { name: /Cancel/i }).click();

            await expect(page.getByText('Update Promotion')).not.toBeVisible();
            await expect(page.getByText(tempName)).not.toBeVisible();
            await expect(page.getByText(promoName).first()).toBeVisible();
        } finally {
            await deletePromotionViaApi(adminToken, promoId).catch(() => {});
        }
    });

});
