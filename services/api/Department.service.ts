import { Department, Prisma } from "@prisma/client";
import axios from "axios";

const Client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Define the extended Department type with relations
type DepartmentWithRelations = Prisma.DepartmentGetPayload<{
  include: {
    employees: true;
    forms: true;
    pqrs: true;
    entity: true
  };
}> 

export type CreateDepartmentDTO = {
  name: string;
  description?: string;
  entityId: string;
};

// return departments with all employees, forms and pqrs
export async function getDepartmentsService(): Promise<DepartmentWithRelations[]> {
  const response = await Client.get("/area");
  return response.data;
}

export async function createDepartmentService(data: CreateDepartmentDTO): Promise<Department> {
  const response = await Client.post("/area", data);
  return response.data;
}

export async function deleteDepartmentService(id: string): Promise<void> {
  await Client.delete(`/area/${id}`);
}
