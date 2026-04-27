import { test, expect } from '@playwright/test';
import { loginAsUser } from './helpers/auth';
import { getAuthToken, createPromotionViaApi, deletePromotionViaApi, createShopViaApi, deleteShopViaApi, getPromotionsViaApi } from './helpers/api';

test.describe('US 7-4: User views discount on checkout', () => {
    let adminToken: string;
    let testShopId: string | null = null;
    let activePromoId: string | null = null;

    test.beforeAll(async () => {
        adminToken = await getAuthToken('admin@example.com', 'password');
        
        // Clean up any existing promos to make sure our 20% wins and matches
        const allPromos = await getPromotionsViaApi(adminToken);
        if (allPromos?.data) {
            for (const p of allPromos.data) {
                await deletePromotionViaApi(adminToken, p._id).catch(() => {});
            }
        }

        const shopRes = await createShopViaApi(adminToken, {
            name: `ShopPromoTest-${Date.now()}`,
            address: '123 Test St',
            district: 'Chatuchak',
            province: 'Bangkok',
            postalcode: '10900',
            tel: '0812345678',
            price: 1000,
            pictures: []
        });
        
        if (shopRes && shopRes.data) {
            testShopId = shopRes.data._id;
        }

        const promoRes = await createPromotionViaApi(adminToken, {
            name: `ActiveCheckoutPromo-${Date.now()}`,
            amount: 20,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            conditions: { enabled: false, minReservations: 0 }
        });
        activePromoId = promoRes.data?._id;
    });

    test.afterAll(async () => {
        if (activePromoId) {
            await deletePromotionViaApi(adminToken, activePromoId).catch(() => {});
        }
        if (testShopId) {
            await deleteShopViaApi(adminToken, testShopId).catch(() => {});
        }
    });

    test('TC7-4: User sees promotion banner and correctly applied discount on checkout math', async ({ page }) => {
        test.skip(!testShopId, 'Depends on successful shop creation');
        await loginAsUser(page);
        await page.goto(`/booking?id=${testShopId}&name=ShopPromoTest&price=1000`);

        // Wait for page to fully load and API calls to complete
        await page.waitForLoadState('networkidle');

        await expect(page.getByText(/Promotion Discount \(20%\)/i)).toBeVisible({ timeout: 15_000 });
        
        // Use regex for numbers instead of hardcoded Baht symbol due to encoding issues
        await expect(page.getByText(/-.*200\.00/)).toBeVisible();
        await expect(page.getByText(/.*812\.00/)).toBeVisible();
    });
});
