import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"

const adapter = PrismaAdapter(prisma);

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    Google,
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: email,
            subject: "Inicia sesión en mi aplicación",
            html: `<p>Haz clic <a href="${url}">aquí</a> para iniciar sesión.</p>`,
            text: `Para iniciar sesión, visita: ${url}`,
          }),
        });
      },
    }),
  ],
});