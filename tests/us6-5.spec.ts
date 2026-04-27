import { expect, Locator, Page, test } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';
import {
    createReservationViaApi,
    createReviewViaApi,
    createShopViaApi,
    deleteReservationViaApi,
    deleteReviewViaApi,
    deleteShopViaApi,
    getAllReviewsViaApi,
    getAuthToken,
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
        await deleteReviewViaApi(adminToken, reviewId).catch(() =>
            deleteReviewViaApi(userToken, reviewId).catch(() => undefined),
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
            pastDateIso(10),
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

async function findAdminReview(comment: string, adminToken: string) {
    const response = await getAllReviewsViaApi(adminToken);
    return reviewData(response).find((review) => review.comment === comment);
}

async function openAdminReviewCard(page: Page, comment: string) {
    await page.goto('/admin/reviews');
    await page.waitForTimeout(3000);

    const commentText = page.getByText(`"${comment}"`, { exact: true });
    await expect(commentText).toBeVisible({ timeout: 15_000 });

    const card = commentText.locator('xpath=ancestor::div[.//button[contains(., "Delete")]][1]');
    await expect(card.getByRole('button', { name: /delete/i })).toBeVisible();
    return card;
}

async function deleteReviewFromAdmin(card: Locator, page: Page) {
    await card.getByRole('button', { name: /delete/i }).click();
    await expect(page.getByText('Are you sure?')).toBeVisible();
    await page.getByRole('button', { name: /confirm/i }).click();
}

test.describe.serial('US 6-5: Admin deletes rating and comment', () => {
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
            console.log(`Skipping US 6-5 tests: ${setupError}`);
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

    test('TC6-10: Admin deletes a customer review after confirming the modal', async ({ page }) => {
        const comment = `US6-5 admin delete ${Date.now()}`;
        const fixture = await createFixtureWithReview(records, adminToken, userToken, 'admin-delete', 4, comment);
        if (!fixture) {
            test.skip(true, 'Review test data could not be created');
            return;
        }

        await loginAsAdmin(page);
        await page.waitForTimeout(3000);

        const card = await openAdminReviewCard(page, comment);
        await deleteReviewFromAdmin(card, page);
        await page.waitForTimeout(2000);
        await page.reload();

        await expect(page.getByText(`"${comment}"`, { exact: true })).not.toBeVisible({ timeout: 10_000 });
        await expect
            .poll(async () => Boolean(await findAdminReview(comment, adminToken)), { timeout: 15_000 })
            .toBe(false);

        expect(fixture.reviewId).toBeTruthy();
    });

    test('TC6-11: Admin cancels delete confirmation and the review remains visible', async ({ page }) => {
        const comment = `US6-5 admin cancel ${Date.now()}`;
        const fixture = await createFixtureWithReview(records, adminToken, userToken, 'admin-cancel', 5, comment);
        if (!fixture) {
            test.skip(true, 'Review test data could not be created');
            return;
        }

        await loginAsAdmin(page);
        await page.waitForTimeout(3000);

        const card = await openAdminReviewCard(page, comment);
        await card.getByRole('button', { name: /delete/i }).click();
        await expect(page.getByText('Are you sure?')).toBeVisible();
        await page.getByRole('button', { name: /cancel/i }).click();

        await expect(page.getByText('Are you sure?')).not.toBeVisible();
        await expect(page.getByText(`"${comment}"`, { exact: true })).toBeVisible();
        await expect.poll(async () => Boolean(await findAdminReview(comment, adminToken))).toBe(true);

        expect(fixture.reviewId).toBeTruthy();
    });
});
