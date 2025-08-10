"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogIn, LogOut, User, Scale, MailPlus } from "lucide-react";
import { useFullUser } from "./UserProvider";
import { signOut } from "next-auth/react"

export default function AvatarMenu() {
  const userProfile = useFullUser();

  const handleLogout = () => {
    signOut({ callbackUrl: "/dashboard" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-10 w-10 border border-ring cursor-pointer">
          <AvatarImage
            src={userProfile?.image || ""}
            alt={
              userProfile?.name?.[0]
            }
          />
          <AvatarFallback className="bg-muted-foreground/10">
            <User className="h-6 w-6 stroke-1 text-quaternary" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="px-4 py-3">
        {userProfile ? (
          <>
            <DropdownMenuItem className="flex items-center gap-2">
              <span>{userProfile.email}</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>Ver Perfil</span>
              </Link>
            </DropdownMenuItem>
            {userProfile.role === "CLIENT" || userProfile.role === "LAWYER" ? (
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/lawyer/lawyer-requests"
                  className="flex items-center gap-2"
                >
                  <Scale className="h-4 w-4" />
                  <span>Mis Solicitudes de Abogados</span>
                </Link>
              </DropdownMenuItem>
            ) : null}
            {userProfile.role === "LAWYER" ? (
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/lawyer"
                  className="flex items-center gap-2"
                >
                  <MailPlus className="h-4 w-4" />
                  <span>Mis Solicitudes de Asesoría</span>
                </Link>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/auth/login" className="flex items-center gap-2 w-full">
                <LogIn className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/register" className="flex items-center gap-2 w-full">
                <User className="h-4 w-4" />
                <span>Registrarme</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}