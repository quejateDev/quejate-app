import { Department, User, Form, PQRS } from "@prisma/client";
import { Client } from "./Client";

// Define the extended Department type with relations
type DepartmentWithRelations = Department & {
  employees: User[];
  forms: Form[];
  pqrs: PQRS[];
};

// return departments with all employees, forms and pqrs
export async function getDepartmentsService(): Promise<DepartmentWithRelations[]> {
  const response = await Client.get("/area");
  return response.data;
}

export async function deleteDepartmentService(id: string): Promise<void> {
  await Client.delete(`/area/${id}`);
}
