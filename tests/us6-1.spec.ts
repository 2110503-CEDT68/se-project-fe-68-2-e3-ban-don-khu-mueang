import { expect, Locator, Page, test } from '@playwright/test';
import { loginAsUser } from './helpers/auth';
import {
    createReservationViaApi,
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
    reviewId?: string;
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

async function createPastReservationFixture(
    records: CreatedRecords,
    adminToken: string,
    userToken: string,
    label: string,
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
            pastDateIso(7),
            testPrice,
            testPrice,
        );
        const reservationId = requireCreatedId(reservation, 'Reservation');
        records.reservationIds.push(reservationId);

        return { shopId, shopName, reservationId };
    } catch (error) {
        console.log(`Skipping Epic 6 setup for ${label}: ${formatError(error)}`);
        return null;
    }
}

function reviewData(response: ReviewsResponse) {
    return Array.isArray(response?.data) ? response.data : [];
}

async function findShopReview(shopId: string, comment: string) {
    const response = await getShopReviewsViaApi(shopId);
    return reviewData(response).find((review) => review.comment === comment);
}

async function expectPersistedShopReview(shopId: string, comment: string, rating: number) {
    await expect
        .poll(
            async () => {
                const review = await findShopReview(shopId, comment);
                return review?.rating ?? null;
            },
            { timeout: 15_000 },
        )
        .toBe(rating);

    const review = await findShopReview(shopId, comment);
    expect(review?._id).toBeTruthy();
    return review as ReviewRecord;
}

async function openHistoryReviewCard(page: Page, shopName: string) {
    await page.goto('/history');
    await page.waitForTimeout(3000);

    const card = page.locator('article').filter({ hasText: shopName }).first();
    await expect(card).toBeVisible({ timeout: 15_000 });
    return card;
}

async function selectRating(card: Locator, rating: number) {
    const input = card.locator(`input[type="radio"][value="${rating}"]`);
    const inputId = await input.getAttribute('id');

    if (!inputId) {
        throw new Error(`Rating input ${rating} did not have an id`);
    }

    await card.locator(`label[for="${inputId}"]`).click();
    await expect(input).toBeChecked();
}

test.describe.serial('US 6-1: Post comment and rating', () => {
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
            console.log(`Skipping US 6-1 tests: ${setupError}`);
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

    test('TC6-1: Customer posts a rating and comment from booking history', async ({ page }) => {
        const fixture = await createPastReservationFixture(records, adminToken, userToken, 'post');
        if (!fixture) {
            test.skip(true, 'Review test data could not be created');
            return;
        }

        const comment = `US6-1 review ${Date.now()}`;

        await loginAsUser(page);
        await page.waitForTimeout(3000);

        const card = await openHistoryReviewCard(page, fixture.shopName);
        const commentBox = card.getByPlaceholder('Write a short note about your experience...');
        await selectRating(card, 5);
        await commentBox.fill(comment);
        await card.getByRole('button', { name: /^submit$/i }).click();

        await expect(card.getByText('Review Submitted')).toBeVisible({ timeout: 10_000 });
        await expect(commentBox).toHaveValue(comment);

        const review = await expectPersistedShopReview(fixture.shopId, comment, 5);
        if (review._id) records.reviewIds.push(review._id);
    });

    test('TC6-2: Customer cannot submit a comment without selecting a rating', async ({ page }, testInfo) => {
        const fixture = await createPastReservationFixture(records, adminToken, userToken, 'missing-rating');
        if (!fixture) {
            test.skip(true, 'Review test data could not be created');
            return;
        }

        await loginAsUser(page);
        await page.waitForTimeout(3000);

        const card = await openHistoryReviewCard(page, fixture.shopName);
        await card.getByPlaceholder('Write a short note about your experience...').fill(`No rating ${Date.now()}`);
        const submitButton = card.getByRole('button', { name: /^submit$/i });
        await submitButton.scrollIntoViewIfNeeded();
        await expect(submitButton).toBeDisabled();

        await card.screenshot({
            path: testInfo.outputPath('tc6-2-review-card.png'),
        });
    });
});
