import axios from "axios";

const Client = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export async function getRegionalDepartments() {
  const response = await Client.get("/regional-departments");
  return response.data;
}

export async function getMunicipalitiesByDepartment(departmentId: string) {
  const response = await Client.get(`/municipalities?departmentId=${departmentId}`);
  return response.data;
}
