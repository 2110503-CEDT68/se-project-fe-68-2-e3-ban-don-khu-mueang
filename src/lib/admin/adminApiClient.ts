// services/adminApiClient.ts
import { apiBaseUrl } from "../config";
import { toBangkokOffsetDateTime } from "../dateTime";
import type {
  ApiListResponse,
  ApiItemResponse,
  AdminShop,
  AdminReservation,
  AdminUser,
  CreateShopInput,
  RegisterAdminInput
} from "@/src/types/api";

export class AdminApiClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async safeJson(response: Response) {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  private async fetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });

    const json = await this.safeJson(response);

    if (!response.ok) {
      const message =
        json?.message ??
        json?.error ??
        `${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    return json as T;
  }

  // --- Shops ---

  async getShops(limit = 100) {
    return this.fetch<ApiListResponse<AdminShop>>(`/api/massages?limit=${limit}`);
  }

  async getShopById(shopId: string) {
    return this.fetch<ApiItemResponse<AdminShop>>(`/api/massages/${shopId}`);
  }

  async createShop(payload: CreateShopInput) {
    return this.fetch<{ success: boolean; data: AdminShop }>(`/api/massages`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateShop(shopId: string, payload: CreateShopInput) {
    return this.fetch<{ success: boolean; data: AdminShop }>(
      `/api/massages/${shopId}`,
      { method: "PUT", body: JSON.stringify(payload) }
    );
  }

  async deleteShop(shopId: string) {
    return this.fetch<{ success: boolean; data: unknown }>(
      `/api/massages/${shopId}`,
      { method: "DELETE" }
    );
  }

  // --- Reservations ---

  async getReservations(limit = 100) {
    return this.fetch<ApiListResponse<AdminReservation>>(`/api/reservations?limit=${limit}`);
  }

  async updateReservationDate(reservationId: string, reserveDate: string) {
    const bangkokReserveDate = toBangkokOffsetDateTime(reserveDate);

    return this.fetch<{ success: boolean; data: AdminReservation }>(
      `/api/reservations/${reservationId}`,
      { method: "PUT", body: JSON.stringify({ reserveDate: bangkokReserveDate }) }
    );
  }

  async deleteReservation(reservationId: string) {
    return this.fetch<{ success: boolean; data: unknown }>(
      `/api/reservations/${reservationId}`,
      { method: "DELETE" }
    );
  }

  // --- Users & Auth ---

  async getUsers(limit = 100) {
    return this.fetch<ApiListResponse<AdminUser>>(`/api/users?limit=${limit}`);
  }

  async registerAdminUser(payload: RegisterAdminInput) {
    return this.fetch<{ success: boolean; token?: string }>(
      `/api/auth/register-admin`,
      { method: "POST", body: JSON.stringify(payload) }
    );
  }
}