import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';
import { getAuthToken, createPromotionViaApi, deletePromotionViaApi } from './helpers/api';

const getPromoCard = (page: any, name: string) =>
    page.locator('div.rounded-3xl').filter({ hasText: name }).first();

const waitAndGoto = async (page: any, name: string) => {
    await loginAsAdmin(page);
    await page.waitForTimeout(3000);
    await page.goto('/admin/promotions').catch(() => page.goto('/admin/promotions'));
    await page.waitForLoadState('networkidle');
    for (let i = 0; i < 20; i++) {
        if (await page.getByText(name).isVisible().catch(() => false)) return;
        await page.reload();
        await page.waitForLoadState('networkidle');
    }
};

test.describe('US 7-3: Admin deletes promotion', () => {

    test('TC7-5: Admin cancels delete confirmation and keeps the promotion', async ({ page }, testInfo) => {
        test.setTimeout(600000);
        const promoName = `Promo-CancelDel-${testInfo.project.name}-${Date.now()}`;
        const adminToken = await getAuthToken('admin@example.com', 'password');
        const res = await createPromotionViaApi(adminToken, {
            name: promoName, amount: 10,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
            isActive: true, conditions: { enabled: false, minReservations: 0 }
        });
        const promoId = res.data?._id;

        try {
            await waitAndGoto(page, promoName);
            const promoCard = getPromoCard(page, promoName);
            await promoCard.getByRole('button').filter({ has: page.locator('img[alt="Delete"]') }).click();
            await page.getByRole('button', { name: /cancel/i }).click();
            await expect(page.getByText(promoName).first()).toBeVisible({ timeout: 10000 });
        } finally {
            await deletePromotionViaApi(adminToken, promoId).catch(() => {});
        }
    });

    test('TC7-6: Admin deletes an existing promotion via Admin UI successfully', async ({ page }, testInfo) => {
        test.setTimeout(300000);
        const promoName = `Promo-Delete-${testInfo.project.name}-${Date.now()}`;
        const adminToken = await getAuthToken('admin@example.com', 'password');
        const res = await createPromotionViaApi(adminToken, {
            name: promoName, amount: 10,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
            isActive: true, conditions: { enabled: false, minReservations: 0 }
        });
        const promoId = res.data?._id;

        try {
            await waitAndGoto(page, promoName);
            const promoCard = getPromoCard(page, promoName);
            await promoCard.getByRole('button').filter({ has: page.locator('img[alt="Delete"]') }).click();
            await page.getByRole('button', { name: /confirm/i }).click();
            await expect(page.getByText(promoName)).not.toBeVisible({ timeout: 10000 });
        } finally {
            if (promoId) await deletePromotionViaApi(adminToken, promoId).catch(() => {});
        }
    });

});
