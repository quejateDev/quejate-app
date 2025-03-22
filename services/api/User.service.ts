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

export async function followUserService(id: string, token: string) {
    console.log(token)
    const response = await Client.post(`/users/${id}/follow`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}