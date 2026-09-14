/**
 * Un usuario tal como lo pinta la barra lateral del muro: cinco campos.
 *
 * 🔴 **H-24.** La barra lateral recibía filas completas de `User` —hash de la
 * contraseña, correo y teléfono incluidos— y, al ser `"use client"`, Next las
 * serializaba enteras en la página pública. Nadie lo vio en un año porque el
 * tipo mentía: `User` declara `email` y `phone` pero no `password`, así que el
 * compilador no sabía que el objeto llevaba el hash.
 *
 * Por eso este tipo es propio y estrecho: si alguien vuelve a pasarle a la
 * barra lateral una fila completa, **no compila**. Y vive en `types/`, no en
 * `data/user.ts`, porque ese módulo importa Prisma y la barra lateral es de
 * cliente: importarlo desde allí arrastraría el acceso a datos al navegador.
 */
export interface SidebarUser {
  id: string;
  name: string | null;
  image: string | null;
  _count: { PQRS: number; followers: number; following: number };
  isFollowing: boolean;
}
