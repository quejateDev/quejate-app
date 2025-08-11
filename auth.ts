import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"
import authConfig from "@/auth.config"
import { getUserById } from "@/data/user"
import { getAccountByUserId } from "./data/account"
import prisma from "./lib/prisma"

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      });
    }
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (token.isOAuth !== undefined && session.user) {
        session.user.isOAuth = token.isOAuth as boolean;
      }

      if (token.image && session.user) {
        session.user.image = token.image as string | null;
      }

      return session;
    },
    async signIn({ user, account }) {
      if(account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      if (!existingUser?.emailVerified) return false;
      return true;
    },
    async jwt({ token }) {
      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);
      
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.image = existingUser.image || null;
      return token
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})