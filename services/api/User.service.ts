import { Client } from "./Client";

export async function getUserService(id: string) {
    const response = await Client.get(`/users/${id}`);
    return response.data;
}

export async function followUserService(id: string) {
    const response = await Client.post(`/users/${id}/follow`);
    return response.data;
}