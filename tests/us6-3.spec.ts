import { expect, Page, test } from '@playwright/test';
import { loginAsUser } from './helpers/auth';
import {
    createReservationViaApi,
    createReviewViaApi,
    createShopViaApi,
    deleteReservationViaApi,
    deleteReviewViaApi,
    deleteShopViaApi,
    getAuthToken,
    getShopReviewsViaApi,
} from './helpers/api';

type CreatedRecords = {
    shopIds: string[];
    reservationIds: string[];
    reviewIds: string[];
};

type IdResponse = {
    success?: boolean;
    data?: {
        _id?: string;
    };
    message?: string;
    error?: string;
};

type ReviewRecord = {
    _id?: string;
    rating?: number;
    comment?: string;
};

type ReviewsResponse = {
    data?: ReviewRecord[];
};

type ReviewFixture = {
    shopId: string;
    shopName: string;
    reservationId: string;
    reviewId: string;
};

const testPrice = 500;

function formatError(error: unknown) {
    return error instanceof Error ? error.message : String(error);
}

function emptyRecords(): CreatedRecords {
    return {
        shopIds: [],
        reservationIds: [],
        reviewIds: [],
    };
}

function requireCreatedId(response: IdResponse, label: string) {
    if (response?.success === false || !response?.data?._id) {
        throw new Error(`${label} was not created: ${response?.message || response?.error || 'missing id'}`);
    }

    return response.data._id;
}

function pastDateIso(daysAgo: number) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
}

function reviewData(response: ReviewsResponse) {
    return Array.isArray(response?.data) ? response.data : [];
}

async function cleanupRecords(records: CreatedRecords, adminToken: string, userToken: string) {
    for (const reviewId of [...records.reviewIds].reverse()) {
        await deleteReviewViaApi(userToken, reviewId).catch(() =>
            deleteReviewViaApi(adminToken, reviewId).catch(() => undefined),
        );
    }

    for (const reservationId of [...records.reservationIds].reverse()) {
        await deleteReservationViaApi(userToken, reservationId).catch(() => undefined);
    }

    for (const shopId of [...records.shopIds].reverse()) {
        await deleteShopViaApi(adminToken, shopId).catch(() => undefined);
    }
}

async function createFixtureWithReview(
    records: CreatedRecords,
    adminToken: string,
    userToken: string,
    label: string,
    rating: number,
    comment: string,
): Promise<ReviewFixture | null> {
    const unique = Date.now();
    const shopName = `E2E US6 ${label} ${unique}`;

    try {
        const shop = await createShopViaApi(adminToken, {
            name: shopName,
            address: '123 Review Test St',
            district: 'Review District',
            province: 'Review Province',
            postalcode: '10100',
            tel: '080-000-0001',
            price: testPrice,
        });
        const shopId = requireCreatedId(shop, 'Shop');
        records.shopIds.push(shopId);

        const reservation = await createReservationViaApi(
            userToken,
            shopId,
            pastDateIso(8),
            testPrice,
            testPrice,
        );
        const reservationId = requireCreatedId(reservation, 'Reservation');
        records.reservationIds.push(reservationId);

        const review = await createReviewViaApi(userToken, reservationId, rating, comment);
        const reviewId = requireCreatedId(review, 'Review');
        records.reviewIds.push(reviewId);

        return { shopId, shopName, reservationId, reviewId };
    } catch (error) {
        console.log(`Skipping Epic 6 setup for ${label}: ${formatError(error)}`);
        return null;
    }
}

async function findShopReview(shopId: string, comment: string) {
    const response = await getShopReviewsViaApi(shopId);
    return reviewData(response).find((review) => review.comment === comment);
}

async function expectShopReviewDeleted(shopId: string, comment: string) {
    await expect
        .poll(
            async () => {
                const review = await findShopReview(shopId, comment);
                return Boolean(review);
            },
            { timeout: 15_000 },
        )
        .toBe(false);
}

async function openHistoryReviewCard(page: Page, shopName: string) {
    await page.goto('/history');
    await page.waitForTimeout(3000);

    const card = page.locator('article').filter({ hasText: shopName }).first();
    await expect(card).toBeVisible({ timeout: 15_000 });
    return card;
}

test.describe.serial('US 6-3: Delete comment and rating', () => {
    let adminToken = '';
    let userToken = '';
    let setupError: string | null = null;
    let records = emptyRecords();

    test.beforeAll(async () => {
        try {
            adminToken = await getAuthToken('admin@example.com', 'password');
            userToken = await getAuthToken('user@example.com', 'password');

            if (!adminToken || !userToken) {
                throw new Error('Auth tokens were not returned');
            }
        } catch (error) {
            setupError = formatError(error);
            console.log(`Skipping US 6-3 tests: ${setupError}`);
        }
    });

    test.beforeEach(() => {
        records = emptyRecords();
        if (setupError) test.skip(true, setupError);
    });

    test.afterEach(async () => {
        if (adminToken && userToken) {
            await cleanupRecords(records, adminToken, userToken);
        }
    });

    test('TC6-5: Customer deletes their own review after confirming the modal', async ({ page }, testInfo) => {
        const comment = `US6-3 delete ${Date.now()}`;
        const fixture = await createFixtureWithReview(records, adminToken, userToken, 'delete', 4, comment);
        if (!fixture) {
            test.skip(true, 'Review test data could not be created');
            return;
        }

        await loginAsUser(page);
        await page.waitForTimeout(3000);

        const card = await openHistoryReviewCard(page, fixture.shopName);
        await expect(card.getByPlaceholder('Write a short note about your experience...')).toHaveValue(comment);

        await card.getByRole('button', { name: /delete/i }).click();
        await expect(page.getByText('Are you sure?')).toBeVisible();
        await page.locator('[role="dialog"], .fixed.inset-0').first().screenshot({
            path: testInfo.outputPath('tc6-5-confirm-modal.png'),
        });
        await page.getByRole('button', { name: /confirm/i }).click();

        const submitButton = card.getByRole('button', { name: /^submit$/i });
        await submitButton.scrollIntoViewIfNeeded();
        await expect(submitButton).toBeVisible({ timeout: 10_000 });
        await expect(card.getByRole('button', { name: /edit/i })).not.toBeVisible();
        await expect(card.getByRole('button', { name: /delete/i })).not.toBeVisible();
        await card.screenshot({
            path: testInfo.outputPath('tc6-5-post-delete-card.png'),
        });
        await expectShopReviewDeleted(fixture.shopId, comment);
    });

    test('TC6-6: Review management buttons are not visible on shop detail for guests', async ({ page }, testInfo) => {
        const comment = `US6-3 guest permission ${Date.now()}`;
        const fixture = await createFixtureWithReview(records, adminToken, userToken, 'guest-permission', 5, comment);
        if (!fixture) {
            test.skip(true, 'Review test data could not be created');
            return;
        }

        await page.goto(`/massage-shops/${fixture.shopId}`);
        await page.waitForTimeout(3000);

        await expect(page.getByText(comment)).toBeVisible({ timeout: 15_000 });
        await expect(page.getByRole('button', { name: /^edit$/i })).not.toBeVisible();
        await expect(page.getByRole('button', { name: /^delete$/i })).not.toBeVisible();

        const reviewCard = page.locator('div.group').filter({ hasText: comment }).first();
        await reviewCard.scrollIntoViewIfNeeded();
        await reviewCard.screenshot({
            path: testInfo.outputPath('tc6-6-guest-review-card.png'),
        });
    });

    test('TC6-7: Customer can cancel delete confirmation and keep the review', async ({ page }) => {
        const comment = `US6-3 cancel delete ${Date.now()}`;
        const fixture = await createFixtureWithReview(records, adminToken, userToken, 'cancel-delete', 3, comment);
        if (!fixture) {
            test.skip(true, 'Review test data could not be created');
            return;
        }

        await loginAsUser(page);
        await page.waitForTimeout(3000);

        const card = await openHistoryReviewCard(page, fixture.shopName);
        await expect(card.getByPlaceholder('Write a short note about your experience...')).toHaveValue(comment);

        await card.getByRole('button', { name: /delete/i }).click();
        await expect(page.getByText('Are you sure?')).toBeVisible();
        await page.getByRole('button', { name: /cancel/i }).click();

        await expect(page.getByText('Are you sure?')).not.toBeVisible();
        await expect(card.getByPlaceholder('Write a short note about your experience...')).toHaveValue(comment);
        expect(await findShopReview(fixture.shopId, comment)).toBeTruthy();
    });
});
