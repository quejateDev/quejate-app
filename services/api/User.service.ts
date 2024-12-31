import axios from "axios";
const Client = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

export async function getUserService(id: string) {
    const response = await Client.get(`/users/${id}`);
    return response.data;
}

export async function followUserService(id: string) {
    const response = await Client.post(`/users/${id}/follow`);
    return response.data;
}