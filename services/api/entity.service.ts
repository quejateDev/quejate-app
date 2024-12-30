import { Entity, Category } from "@prisma/client";
import { Client } from "./Client";

type CreateEntityDTO = {
  name: string;
  description?: string;
  imageUrl?: string | null;
  categoryId: string;
};

export async function getEntities() {
  const response = await Client.get("/entities");
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await Client.get("/categories");
  return response.data;
}

export async function createEntity(data: CreateEntityDTO): Promise<Entity> {
  const response = await Client.post("/entities", data);
  return response.data;
}
