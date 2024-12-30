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
    <div className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0">
              <img src="/logo.png" alt="Logo" className="h-8" />
            </Link>
            
            <div className="hidden md:block ml-4">
              <UserSearchCommand />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavItems />
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Mobile Navigation */}
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

            <AvatarMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
