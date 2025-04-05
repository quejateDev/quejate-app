"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogIn, LogOut, User } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import useUser from "@/hooks/useUser";

export default function AvatarMenu() {
  const { user } = useAuthStore();
  const { user: userProfile, fetchUser} = useUser();

  useEffect(() => {
    if (user?.id) {
      fetchUser(user.id);
    }
  }, [user]);

  function handleLogout() {
    useAuthStore.getState().logout();
    toast({
      title: "Cierre de sesión exitoso",
      description: "Has cerrado sesión correctamente.",
      variant: "default",
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-10 w-10 border-2 border-muted cursor-pointer">
          <AvatarImage
            src={user && userProfile?.profilePicture ? userProfile.profilePicture : undefined}
            alt={user && userProfile?.firstName ? userProfile.firstName : "User"}
          />
          <AvatarFallback className="bg-muted-foreground/10">
            <User className="h-6 w-6 stroke-1" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="px-4 py-3">
        {user ? (
          <>
            <DropdownMenuItem className="flex items-center gap-2">
              <span>{user.email}</span>
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
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Iniciar Sesión</span>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
