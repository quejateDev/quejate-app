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

/**
 * Seguir o dejar de seguir a un usuario.
 *
 * 🔴 **Sin segundo argumento, y no es cosmético.** Este cliente fija
 * `Content-Type: application/json`, y con ese tipo axios serializa el cuerpo
 * *siempre*: un `null` explícito viaja como el literal `null` de cuatro bytes.
 * Mientras la ruta la servía Next daba igual —nadie leía el cuerpo—, pero
 * ahora reenvía al backend, cuyo `express.json()` corre en modo `strict` y solo
 * acepta objetos y arrays: un cuerpo `null` se rechaza con **400** antes de
 * llegar al guard y al manejador. Omitirlo hace que axios no mande cuerpo, y un
 * cuerpo vacío el parser lo trata como `{}`. Es lo mismo que hace la app móvil
 * en `PublicProfileScreen.tsx`, que por eso nunca se rompió.
 *
 * El extremo no lee ningún dato del cuerpo: quién sigue sale de la sesión y a
 * quién se sigue, del path.
 */
export async function followUserService(id: string ) {
    const response = await Client.post(`/users/${id}/follow`);
    return response.data;
}
