"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

export default function AvatarMenu() {
  const { user } = useAuthStore();

  function handleLogout() {
    useAuthStore.getState().logout();
    window.location.href = "/login";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="px-4 py-3">
        <DropdownMenuItem className="flex items-center gap-2">
          <span>{user?.email}</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Ver Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 text-red-600" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
