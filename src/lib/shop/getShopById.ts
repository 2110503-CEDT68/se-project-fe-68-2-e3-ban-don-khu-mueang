import { apiBaseUrl } from "../config";

type ApiItemResponse<T> = {
    success: boolean;
    data: T;
};

async function getShopById<T>(id: string) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/massages/${id}`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Unable to fetch shop with ID ${id}`);
        }

        const data = (await response.json()) as ApiItemResponse<T>;
        return data;
    } catch (error) {
        console.error(`Error fetching shop with ID ${id}:`, error);
        return null;
    }
}

export default getShopById;