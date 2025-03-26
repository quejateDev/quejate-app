import { Entity, Category } from "@prisma/client";
import axios from "axios";

const Client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'cache-control': 'no-store',
  },
  timeout: 10000,
});

type CreateEntityDTO = {
  name: string;
  description: string;
  categoryId: string;
  imageUrl?: string;
  email: string;
  municipalityId: string;
};

type UpdateEntityDTO = {
  name: string;
  description: string;
  categoryId: string;
  imageUrl?: string;
  email: string;
  municipalityId: string;
};

export async function getEntities(params?: { departmentId?: string; municipalityId?: string }) {
  const queryParams = new URLSearchParams();

  if (params?.municipalityId) {
    queryParams.append("municipalityId", params.municipalityId);
  } else if (params?.departmentId) {
    queryParams.append("departmentId", params.departmentId);
  }

  const url = queryParams.toString() ? `/entities?${queryParams.toString()}` : "/entities";

  const response = await Client.get(url);
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await Client.get("/category");
  return response.data;
}

export async function createEntity(data: CreateEntityDTO): Promise<Entity> {
  const response = await Client.post("/entities", data);
  return response.data;
}

export async function updateEntity(id: string, data: UpdateEntityDTO): Promise<Entity> {
  const response = await Client.put(`/entities/${id}`, data);
  return response.data;
}
