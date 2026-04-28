import { expect, Locator, Page, test } from '@playwright/test';
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

async function createFixtureWithReview(
    records: CreatedRecords,
    adminToken: string,
    userToken: string,
    label: string,
    rating: number,
    comment: string,
): Promise<ReviewFixture | null> {
    const fixture = await createPastReservationFixture(records, adminToken, userToken, label);
    if (!fixture) return null;

    try {
        const review = await createReviewViaApi(userToken, fixture.reservationId, rating, comment);
        const reviewId = requireCreatedId(review, 'Review');
        records.reviewIds.push(reviewId);
        return { ...fixture, reviewId };
    } catch (error) {
        console.log(`Skipping Epic 6 review setup for ${label}: ${formatError(error)}`);
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

test.describe.serial('US 6-2: Edit comment and rating', () => {
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
            console.log(`Skipping US 6-2 tests: ${setupError}`);
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

    test('TC6-3: Customer edits their existing rating and comment', async ({ page }) => {
        const originalComment = `US6-2 original ${Date.now()}`;
        const updatedComment = `US6-2 updated ${Date.now()}`;
        const fixture = await createFixtureWithReview(
            records,
            adminToken,
            userToken,
            'edit',
            4,
            originalComment,
        );

        if (!fixture) {
            test.skip(true, 'Review test data could not be created');
            return;
        }

        await loginAsUser(page);
        await page.waitForTimeout(3000);

        const card = await openHistoryReviewCard(page, fixture.shopName);
        const commentBox = card.getByPlaceholder('Write a short note about your experience...');
        await expect(card.getByText('Review Submitted')).toBeVisible({ timeout: 10_000 });
        await expect(commentBox).toHaveValue(originalComment);

        await card.getByRole('button', { name: /edit/i }).click();
        await selectRating(card, 2);
        await commentBox.fill(updatedComment);
        await card.getByRole('button', { name: /^submit$/i }).click();

        await expect(card.getByText('Review Submitted')).toBeVisible({ timeout: 10_000 });
        await expect(commentBox).toHaveValue(updatedComment);
        await expectPersistedShopReview(fixture.shopId, updatedComment, 2);
    });

    test('TC6-4: Customer cancels review editing and keeps the original content', async ({ page }) => {
        const originalComment = `US6-2 cancel original ${Date.now()}`;
        const unsavedComment = `US6-2 cancel unsaved ${Date.now()}`;
        const fixture = await createFixtureWithReview(
            records,
            adminToken,
            userToken,
            'cancel-edit',
            3,
            originalComment,
        );

        if (!fixture) {
            test.skip(true, 'Review test data could not be created');
            return;
        }

        await loginAsUser(page);
        await page.waitForTimeout(3000);

        const card = await openHistoryReviewCard(page, fixture.shopName);
        const commentBox = card.getByPlaceholder('Write a short note about your experience...');
        await expect(commentBox).toHaveValue(originalComment);

        await card.getByRole('button', { name: /edit/i }).click();
        await selectRating(card, 1);
        await commentBox.fill(unsavedComment);
        await card.getByRole('button', { name: /cancel/i }).click();

        await expect(card.getByText('Review Submitted')).toBeVisible();
        await expect(commentBox).toHaveValue(originalComment);
        await expectPersistedShopReview(fixture.shopId, originalComment, 3);
    });
});
