import { PQRConfigFormValues } from "@/types/pqr-config";
import axios from "axios";

const Client = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

interface PQRConfigData {
  allowAnonymous: boolean;
  requireEvidence: boolean;
  maxResponseTime: string;
  notifyEmail: boolean;
  autoAssign: boolean;
  customFields: Array<{
    name: string;
    required: boolean;
    type: "email" | "phone" | "text" | "file";
  }>;
}

export const PQRConfigService = {
  create: async (areaId: string, data: PQRConfigFormValues) => {
    const response = await Client.post(`/api/areas/${areaId}/pqr-config`, data);
    return response.data;
  },

  get: async (areaId: string) => {
    const response = await Client.get(`/api/areas/${areaId}/pqr-config`);
    return response.data as PQRConfigFormValues;
  },

  update: async (areaId: string, data: PQRConfigFormValues) => {
    const response = await Client.patch(`/api/areas/${areaId}/pqr-config`, data);
    return response.data as PQRConfigFormValues;
  },
};
