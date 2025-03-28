import { Department, PQRS, User, Comment } from "@prisma/client";
import { getGetPQRDTO } from "@/dto/pqr.dto";
import axios from "axios";

const Client = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

type createPQRS = {
  type: PQRS["type"];
  departmentId: Department["id"];
  creatorId: User["id"];
  customFields: {
    name: string;
    value: string;
    type: string;
    required: boolean;
  }[];
  isAnonymous: boolean;
};



export async function createPQRS(formData: FormData) {
  const response = await axios.post("/api/pqr", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000, // 30 seconds for file uploads
  });
  return response.data;
}

export async function getAllPQRS() {
  const response = await Client.get("/pqr");
  return response.data;
}

export async function getPQRS() {
  const response = await Client.get(`/pqr`);
  return response.data;
}

export async function getPQRSById(id: PQRS["id"]): Promise<getGetPQRDTO> {
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

export async function toggleLike(pqrId: string, userId: string) {
  const response = await Client.post(`/pqr/${pqrId}/like`, { userId });
  return response.data;
}

export async function createCommentService(comment: {text: string; userId: string; pqrId: string; }): Promise<Comment> {
  const response = await Client.post(`/pqr/${comment.pqrId}/comments`, comment);
  return response.data;
}


