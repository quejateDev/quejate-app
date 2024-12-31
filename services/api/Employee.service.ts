import { User } from "@prisma/client";
import axios from "axios";

const Client = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

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
