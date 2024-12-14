import { User } from "@prisma/client";
import { Client } from "./Client";

export async function createEmployeeService(employee: {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  departmentId: string;
}) {
  const response = await Client.post("/employee", employee);
  return response.data;
}

export async function getEmployeesService() {
  const response = await Client.get("/employee");
  return response.data;
}

export async function deleteEmployeeService(id: string) {
  const response = await Client.delete(`/employee/${id}`);
  return response.data;
}

export async function updateEmployeeService(id: string, employee: User) {
  const response = await Client.put(`/employee/${id}`, employee);
  return response.data;
}

export async function getEmployeeService(id: string) {
  const response = await Client.get(`/employee/${id}`);
  return response.data;
}
