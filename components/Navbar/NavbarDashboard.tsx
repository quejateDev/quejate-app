"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import AvatarMenu from "../AvatarMenu";
import { UserSearchCommand } from "../UserSearchCommand";
import { Users } from "lucide-react";

export default function NavbarDashboard() {
  return (
    <NavigationMenu className="flex justify-between min-w-full border-b h-16 items-center px-4 container">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/dashboard" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <img src="/logo.png" alt="Logo de la empresa" className="h-8" />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <UserSearchCommand />
        </NavigationMenuItem>
      </NavigationMenuList>

      <NavigationMenuList className="ml-auto flex items-center space-x-4">
        <NavigationMenuItem>
          <Link href="/dashboard">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Inicio
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/social">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Users className="h-4 w-4 mr-2" />
              Explorar
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <AvatarMenu />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
