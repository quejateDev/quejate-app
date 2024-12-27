import { Entity } from "@prisma/client";
import { Client } from "./Client";

type CreateEntityDTO = {
  name: string;
  description?: string;
};

export async function getEntities() {
  const response = await Client.get("/entities");
  return response.data;
}

export async function createEntity(data: CreateEntityDTO): Promise<Entity> {
  const response = await Client.post("/entities", data);
  return response.data;
}
