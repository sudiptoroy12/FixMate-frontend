
export interface Technician {
  name: string;
  email: string;
  image?: string;
  area?: string;
  bio?: string;
}

export interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: string;
  technician?: Technician | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
