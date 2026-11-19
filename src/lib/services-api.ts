
import type { ApiResponse, Service } from "@/types/service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllServices(): Promise<Service[]> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const response = await fetch(`${API_URL}/api/services`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch services.");
  }

  const result: ApiResponse<Service[]> = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch services.");
  }

  return result.data;
}

export async function getServiceById(id: string): Promise<Service> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const response = await fetch(`${API_URL}/api/services/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error("SERVICE_NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch service details.");
  }

  const result: ApiResponse<Service> = await response.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
}
