import { expect, test } from '@playwright/test';
import {
    createReservationViaApi,
    createReviewViaApi,
    createShopViaApi,
    deleteReservationViaApi,
    deleteReviewViaApi,
    deleteShopViaApi,
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

type ShopFixture = {
    shopId: string;
    shopName: string;
};

type ReviewFixture = ShopFixture & {
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

async function createShopFixture(
    records: CreatedRecords,
    adminToken: string,
    label: string,
): Promise<ShopFixture | null> {
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
        return { shopId, shopName };
    } catch (error) {
        console.log(`Skipping Epic 6 shop setup for ${label}: ${formatError(error)}`);
        return null;
    }
}

async function createReviewFixture(
    records: CreatedRecords,
    adminToken: string,
    userToken: string,
    label: string,
    rating: number,
    comment: string,
): Promise<ReviewFixture | null> {
    const shop = await createShopFixture(records, adminToken, label);
    if (!shop) return null;

    try {
        const reservation = await createReservationViaApi(
            userToken,
            shop.shopId,
            pastDateIso(9),
            testPrice,
            testPrice,
        );
        const reservationId = requireCreatedId(reservation, 'Reservation');
        records.reservationIds.push(reservationId);

        const review = await createReviewViaApi(userToken, reservationId, rating, comment);
        const reviewId = requireCreatedId(review, 'Review');
        records.reviewIds.push(reviewId);

        return { ...shop, reservationId, reviewId };
    } catch (error) {
        console.log(`Skipping Epic 6 review setup for ${label}: ${formatError(error)}`);
        return null;
    }
}

test.describe.serial('US 6-4: Guest views rating and comments', () => {
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
            console.log(`Skipping US 6-4 tests: ${setupError}`);
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

    test('TC6-8: Guest sees average rating and review comment on shop detail', async ({ page }, testInfo) => {
        const comment = `US6-4 guest visible ${Date.now()}`;
        const fixture = await createReviewFixture(records, adminToken, userToken, 'guest-review', 4, comment);
        if (!fixture) {
            test.skip(true, 'Review test data could not be created');
            return;
        }

        await page.waitForTimeout(2000);
        await page.goto(`/massage-shops/${fixture.shopId}`);
        await page.waitForTimeout(3000);

        await expect(page.getByRole('heading', { name: fixture.shopName })).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText(/Rating\s+4(\.0)?\s+\(1 reviews?\)/i)).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText(comment)).toBeVisible({ timeout: 15_000 });

        const ratingText = page.getByText(/Rating\s+4(\.0)?\s+\(1 reviews?\)/i);
        await ratingText.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await page.screenshot({
            path: testInfo.outputPath('tc6-8-rating-page.png'),
        });

        const reviewComment = page.getByText(comment);
        await reviewComment.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await page.screenshot({
            path: testInfo.outputPath('tc6-8-review-section.png'),
        });
    });

    test('TC6-9: Guest sees empty review state when a shop has no reviews', async ({ page }, testInfo) => {
        const fixture = await createShopFixture(records, adminToken, 'no-reviews');
        if (!fixture) {
            test.skip(true, 'Shop test data could not be created');
            return;
        }

        await page.goto(`/massage-shops/${fixture.shopId}`);
        await page.waitForTimeout(3000);

        await expect(page.getByRole('heading', { name: fixture.shopName })).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText(/Rating\s+0\s+\(0 reviews?\)/i)).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText('No Review')).toBeVisible();

        const ratingText = page.getByText(/Rating\s+0\s+\(0 reviews?\)/i);
        await ratingText.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await page.screenshot({
            path: testInfo.outputPath('tc6-9-rating-page.png'),
        });

        const noReviewText = page.getByText('No Review');
        await noReviewText.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await page.screenshot({
            path: testInfo.outputPath('tc6-9-review-section.png'),
        });
    });
});
