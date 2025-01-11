import { Entity, Category } from "@prisma/client";
import axios from "axios";

const Client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

type CreateEntityDTO = {
  name: string;
  description: string;
  categoryId: string;
  imageUrl?: string;
  email: string;
};

type UpdateEntityDTO = {
  name: string;
  description: string;
  categoryId: string;
  imageUrl?: string;
  email: string;
};

export async function getEntities() {
  const response = await Client.get("/entities");
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  console.log("categories", process.env.BASE_URL);
  const response = await Client.get("/category");
  return response.data;
}

export async function createEntity(data: CreateEntityDTO): Promise<Entity> {
  console.log("hola");
  const response = await Client.post("/entities", data);
  return response.data;
}

export async function updateEntity(id: string, data: UpdateEntityDTO): Promise<Entity> {
  const response = await Client.put(`/entities/${id}`, data);
  return response.data;
}
