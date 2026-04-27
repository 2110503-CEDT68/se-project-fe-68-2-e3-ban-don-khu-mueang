import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsUser } from './helpers/auth';
import {
    getAuthToken,
    createShopViaApi,
    createReservationViaApi,
    deleteShopViaApi,
    getNotificationsViaApi,
    getReservationsViaApi,
    deleteReservationViaApi,
} from './helpers/api';

// Check if the notification backend is available before running tests
async function isNotificationApiAvailable(token: string): Promise<boolean> {
    try {
        const result = await getNotificationsViaApi(token);
        if (result?.success === false) return false;
        return true;
    } catch {
        return false;
    }
}

test.describe.serial('US 8-9: Shop Closure Notifications', () => {
    let adminToken: string;
    let userToken: string;
    let testShopId: string;
    let apiAvailable = false;
    const testShopName = `E2E Test Shop ${Date.now()}`;

    test.beforeAll(async () => {
        adminToken = await getAuthToken('admin@example.com', 'password');
        userToken = await getAuthToken('user@example.com', 'password');

        // Check if notification API is deployed
        apiAvailable = await isNotificationApiAvailable(userToken);

        if (!apiAvailable) {
            console.log('⚠️  Notification API is not available on backend — tests will be skipped');
            return;
        }

        // Clean up existing upcoming reservations (backend enforces max 3 limit)
        const existingRes = await getReservationsViaApi(userToken);
        const upcomingReservations = (existingRes?.data || []).filter(
            (r: { reserveDate: string }) => new Date(r.reserveDate) > new Date()
        );
        console.log(`Found ${upcomingReservations.length} upcoming reservations, cleaning up...`);
        for (const r of upcomingReservations) {
            await deleteReservationViaApi(userToken, r._id);
        }

        // Setup: Create a shop
        const shop = await createShopViaApi(adminToken, {
            name: testShopName,
            address: '123 Test St',
            district: 'Test District',
            province: 'Test Province',
            postalcode: '10100',
            tel: '080-000-0001',
            price: 500,
        });
        testShopId = shop.data._id;
        console.log(`Shop created: ${testShopId}`);

        // Create a reservation (price & netPrice are required by the backend)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        const resResult = await createReservationViaApi(
            userToken,
            testShopId,
            futureDate.toISOString(),
            500,
            500
        );
        console.log('Reservation created:', resResult?.success, resResult?.data?._id);

        if (!resResult?.success) {
            console.log('Reservation error:', JSON.stringify(resResult));
        }
    });

    test('TC8-1: User receives shop closure notification after admin deletes shop', async ({ page }) => {
        if (!apiAvailable) {
            test.skip();
            return;
        }

        // Step 1: Admin deletes the shop
        const deleteResult = await deleteShopViaApi(adminToken, testShopId);
        console.log('Shop deleted:', deleteResult?.success);

        // Step 2: Wait for backend to process notifications
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Step 3: Verify notification was created via API
        const notifications = await getNotificationsViaApi(userToken);
        const notifData = notifications?.data || [];
        const closureNotif = notifData.find(
            (n: { type: string; message: string }) =>
                n.type === 'shop_closed' && n.message.includes(testShopName)
        );
        console.log('Closure notification found:', !!closureNotif);
        expect(closureNotif).toBeTruthy();

        // Step 4: Login as the user who had the booking
        await loginAsUser(page);
        await page.waitForTimeout(5000);

        // Step 5: Verify notification bell shows unread badge
        const bell = page.getByRole('button', { name: /notification/i });
        await expect(bell).toBeVisible({ timeout: 10_000 });

        const badge = bell.locator('span').filter({ hasText: /\d+/ });
        await expect(badge).toBeVisible({ timeout: 15_000 });

        // Step 6: Click bell to open panel
        await bell.click();
        await page.waitForTimeout(2000);

        // Step 7: Verify notification content — look for the shop name
        await expect(page.getByText(new RegExp(testShopName))).toBeVisible({ timeout: 10_000 });
    });

    test('TC8-2: Closure notification visible in /notifications with timestamp', async ({ page }) => {
        if (!apiAvailable) {
            test.skip();
            return;
        }

        await loginAsUser(page);
        await page.goto('/notifications');
        await page.waitForTimeout(3000);

        // Click "Shop Closures" filter
        await page.getByRole('button', { name: /shop closures/i }).click();
        await page.waitForTimeout(1000);

        // Verify at least one notification card is visible
        const cards = page.locator('.flex.gap-4.rounded-2xl');
        await expect(cards.first()).toBeVisible({ timeout: 10_000 });

        // Check "Shop Closure" type badge on the first card
        const firstCard = cards.first();
        await expect(firstCard.getByText('Shop Closure', { exact: true })).toBeVisible({ timeout: 10_000 });

        // Verify timestamp is visible on the card
        const timestamps = firstCard.locator('.text-outline');
        await expect(timestamps.first()).toBeVisible();
    });

    test('TC8-3: User without bookings does NOT get notification', async ({ page, browser }) => {
        if (!apiAvailable) {
            test.skip();
            return;
        }

        const context = await browser.newContext();
        const page2 = await context.newPage();

        await loginAsAdmin(page2);
        await page2.goto('/notifications');
        await page2.waitForTimeout(3000);

        const closureText = page2.getByText(new RegExp(testShopName));
        await expect(closureText).not.toBeVisible();

        await context.close();
    });
});
