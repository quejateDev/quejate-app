import { Department, PQRS, Prisma, User } from "@prisma/client";

import { Client } from "./Client";

export async function createPQRS(pqrs: Prisma.PQRSCreateArgs["data"]) {
  const response = await Client.post("/pqr", pqrs);
  return response.data;
}

export async function getPQRS() {
  const response = await Client.get(`/pqr`);
  return response.data;
}

export async function getPQRSById(id: PQRS["id"]) {
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
