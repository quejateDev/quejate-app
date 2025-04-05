"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Menu, Users } from "lucide-react";
import AvatarMenu from "../AvatarMenu";
import { UserSearchCommand } from "../UserSearchCommand";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationDropdown } from "../NotificationDropdown";
import Image from "next/image";

export default function NavbarDashboard() {
  const NavItems = () => (
    <>
      <NavigationMenuItem>
        <Link href="/dashboard" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Inicio
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/dashboard/social" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Users className="h-4 w-4 mr-2" />
            Explorar
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </>
  );

  return (
    <nav className="border-b bg-white w-full">
      <div className="w-full px-8 sm:px-8 lg:px-12 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex-shrink-0">
              <Image 
                src="/logo2.png" 
                alt="Logo" 
                width={128} 
                height={128}
                className="h-16 w-auto"
              />
            </Link>
            <div className="hidden md:block pl-4">
              <UserSearchCommand />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block mx-4">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavItems />
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-2">
              <NotificationDropdown />
              <AvatarMenu />
            </div>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-4 mt-6">
                    <UserSearchCommand />
                    <Link href="/dashboard" className="text-lg font-semibold flex items-center">
                      Inicio
                    </Link>
                    <Link href="/dashboard/social" className="text-lg font-semibold flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Explorar
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
