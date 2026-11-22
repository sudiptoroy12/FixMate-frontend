
import type { ApiResponse, Service } from "@/types/service";
import { getTokenFromClient } from "./(getToken)/getTokenFromClient";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ServiceFiltersParams {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: "price-asc" | "price-desc" | "newest";
}



export async function getAllServices(
  filters: ServiceFiltersParams = {}
): Promise<Service[]> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.serviceMode) {
    params.set("serviceMode", filters.serviceMode);
  }

  params.set("sort", filters.sort || "newest");

  const response = await fetch(
    `${API_URL}/api/services?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

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

// Repair request types
export interface CreateRepairRequest {
  serviceId: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
}

export interface RepairRequest {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  servicePrice: number;
  serviceImage: string;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  problemDescription: string;
  address: string;
  preferredDate: string;
  status: "requested" | "accepted" | "rejected" | "in-progress" | "completed";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
  updatedAt: string;
}

// Submit repair request
export async function createRepairRequest(
  requestData: CreateRepairRequest
): Promise<RepairRequest> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const token = await getTokenFromClient();

  const response = await fetch(`${API_URL}/api/service-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });

  const result: ApiResponse<RepairRequest> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to submit repair request.");
  }

  return result.data;
}
