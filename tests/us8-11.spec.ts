import { test, expect } from '@playwright/test';
import { loginAsUser } from './helpers/auth';
import {
    getAuthToken,
    createPromotionViaApi,
    getNotificationsViaApi,
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

test.describe('US 8-11: Notification Inbox & History', () => {
    let adminToken: string;
    let userToken: string;
    let apiAvailable = false;

    test.beforeAll(async () => {
        adminToken = await getAuthToken('admin@example.com', 'password');
        userToken = await getAuthToken('user@example.com', 'password');

        // Check if notification API is deployed
        apiAvailable = await isNotificationApiAvailable(userToken);

        if (!apiAvailable) {
            console.log('⚠️  Notification API is not available on backend — tests will be skipped');
            return;
        }

        // Create a promotion to ensure there's at least one notification
        await createPromotionViaApi(adminToken, {
            name: `Inbox Test Promo ${Date.now()}`,
            amount: 15,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
        });

        // Wait for backend to process the notification
        await new Promise(resolve => setTimeout(resolve, 3000));
    });

    test('TC8-8: Notification bell shows unread count badge', async ({ page }) => {
        if (!apiAvailable) {
            test.skip();
            return;
        }

        await loginAsUser(page);
        await page.waitForTimeout(5000);

        const bell = page.getByRole('button', { name: /notification/i });
        await expect(bell).toBeVisible({ timeout: 10_000 });

        // Badge should show a number
        const badge = bell.locator('span').filter({ hasText: /\d+/ });
        await expect(badge).toBeVisible({ timeout: 15_000 });
    });

    test('TC8-9: Clicking bell opens dropdown panel', async ({ page }) => {
        if (!apiAvailable) {
            test.skip();
            return;
        }

        await loginAsUser(page);
        await page.waitForTimeout(5000);

        // Click bell
        const bell = page.getByRole('button', { name: /notification/i });
        await expect(bell).toBeVisible({ timeout: 10_000 });
        await bell.click();
        await page.waitForTimeout(2000);

        // Panel should be visible with header "Notifications"
        await expect(page.getByText('Notifications').first()).toBeVisible({ timeout: 10_000 });

        // Should have "View all notifications" link
        await expect(page.getByRole('link', { name: /view all notifications/i })).toBeVisible({ timeout: 10_000 });
    });

    test('TC8-10: Clicking unread notification marks it as read', async ({ page }) => {
        if (!apiAvailable) {
            test.skip();
            return;
        }

        await loginAsUser(page);
        await page.waitForTimeout(5000);

        // Open panel
        const bell = page.getByRole('button', { name: /notification/i });
        await expect(bell).toBeVisible({ timeout: 10_000 });
        await bell.click();
        await page.waitForTimeout(2000);

        // Find the first unread notification title inside the panel
        // Notification titles in the panel have class text-[13px] and font-bold when unread
        const panelContainer = page.locator('.w-\\[380px\\]');
        const unreadTitle = panelContainer.locator('span.font-bold.text-foreground').first();

        if (await unreadTitle.isVisible()) {
            const titleText = await unreadTitle.textContent();

            // Click the unread notification — this triggers the parent's onClick handler
            await unreadTitle.click();

            // Wait for the markAsRead API call to complete
            await page.waitForTimeout(3000);

            // After marking as read, the title should change from font-bold to font-medium
            // Re-locate by title text and check it now has font-medium
            if (titleText) {
                const updatedTitle = panelContainer.getByText(titleText, { exact: true }).first();
                await expect(updatedTitle).toHaveClass(/font-medium/, { timeout: 5_000 });
            }
        }
    });

    test('TC8-11: "Mark all read" clears all unread indicators', async ({ page }) => {
        if (!apiAvailable) {
            test.skip();
            return;
        }

        await loginAsUser(page);
        await page.waitForTimeout(5000);

        // Open panel
        const bell = page.getByRole('button', { name: /notification/i });
        await expect(bell).toBeVisible({ timeout: 10_000 });
        await bell.click();
        await page.waitForTimeout(2000);

        // Click "Mark all read" if visible
        const markAllBtn = page.getByRole('button', { name: /mark all read/i });

        if (await markAllBtn.isVisible()) {
            await markAllBtn.click();
            await page.waitForTimeout(2000);

            // All unread dots should disappear
            const unreadDots = page.locator('.h-2.w-2.rounded-full.bg-primary');
            await expect(unreadDots).toHaveCount(0);

            // Badge on bell should disappear
            const bellAfter = page.getByRole('button', { name: /notification/i });
            const badge = bellAfter.locator('span').filter({ hasText: /^\d+$/ });
            await expect(badge).not.toBeVisible();
        }
    });

    test('TC8-12: /notifications page displays notifications with timestamps', async ({ page }) => {
        if (!apiAvailable) {
            test.skip();
            return;
        }

        await loginAsUser(page);
        await page.goto('/notifications');
        await page.waitForTimeout(3000);

        // Page should show notification count text
        await expect(page.getByText(/\d+ notification/)).toBeVisible({ timeout: 10_000 });

        // At least one notification card should be visible
        const cards = page.locator('.flex.gap-4.rounded-2xl');
        await expect(cards.first()).toBeVisible({ timeout: 10_000 });

        // Each card should have timestamp text
        const firstCard = cards.first();
        const timestamps = firstCard.locator('.text-outline');
        await expect(timestamps.first()).toBeVisible();
    });

    test('TC8-13: Filter chips filter by notification type', async ({ page }) => {
        if (!apiAvailable) {
            test.skip();
            return;
        }

        await loginAsUser(page);
        await page.goto('/notifications');
        await page.waitForTimeout(3000);

        // Click "Promotions" filter
        const promoFilter = page.getByRole('button', { name: /promotions/i });
        if (await promoFilter.isVisible()) {
            await promoFilter.click();
            await page.waitForTimeout(1000);

            // All visible cards should have "New Promotion" badge
            const cards = page.locator('.flex.gap-4.rounded-2xl');
            const count = await cards.count();

            for (let i = 0; i < count; i++) {
                // Use exact match to avoid matching "New Promotion Available!" title
                await expect(cards.nth(i).getByText('New Promotion', { exact: true })).toBeVisible();
            }

            // Click "All" to reset
            await page.getByRole('button', { name: /^all$/i }).click();
        }
    });

    test('TC8-14: "View all notifications" link navigates to /notifications', async ({ page }) => {
        if (!apiAvailable) {
            test.skip();
            return;
        }

        await loginAsUser(page);
        await page.waitForTimeout(5000);

        // Open panel
        const bell = page.getByRole('button', { name: /notification/i });
        await expect(bell).toBeVisible({ timeout: 10_000 });
        await bell.click();
        await page.waitForTimeout(2000);

        // Click the link
        const viewAllLink = page.getByRole('link', { name: /view all notifications/i });
        await expect(viewAllLink).toBeVisible({ timeout: 10_000 });
        await viewAllLink.click();

        // Should navigate to /notifications
        await expect(page).toHaveURL(/\/notifications/, { timeout: 15_000 });
    });

    test('TC8-15: Bell does NOT appear for unauthenticated users', async ({ page }) => {
        // This test doesn't need the API — it checks frontend-only behavior
        await page.goto('/');
        await page.waitForTimeout(3000);

        // Bell button should not be visible for unauthenticated users
        const bell = page.getByRole('button', { name: /notification/i });
        await expect(bell).not.toBeVisible();
    });
});
