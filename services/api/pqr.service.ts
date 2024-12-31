import { Department, PQRS, User } from "@prisma/client";

import { Client } from "./Client";
import { getGetPQRDTO } from "@/dto/pqr.dto";

type createPQRS = {
  type: PQRS["type"];
  departmentId: Department["id"];
  creatorId: User["id"];
  customFields: {
    name: string;
    value: string;
    type: string;
    required: boolean;
  }[];
  isAnonymous: boolean;
};



export async function createPQRS(data: createPQRS) {
  const response = await Client.post("/pqr", data);
  return response.data;
}

export async function getAllPQRS() {
  const response = await Client.get("/pqr");
  return response.data;
}

export async function getPQRS() {
  const response = await Client.get(`/pqr`);
  return response.data;
}

export async function getPQRSById(id: PQRS["id"]): Promise<getGetPQRDTO> {
  const response = await Client.get(`/pqr/${id}`);
  return response.data;
}

export async function getPQRSByUser(userId: User["id"]) {
  const response = await Client.get(`/pqr/user/${userId}`);
  return response.data;
}

export async function getPQRSByDepartment(departmentId: Department["id"]) {
  const response = await Client.get(`/pqr/department/${departmentId}`);
  return response.data;
}

export async function updatePQRS(id: PQRS["id"], pqrs: PQRS) {
  const response = await Client.put(`/pqr/${id}`, pqrs);
  return response.data;
}

export async function toggleLike(pqrId: string, userId: string) {
  const response = await Client.post(`/pqr/${pqrId}/like`, { userId });
  return response.data;
}
