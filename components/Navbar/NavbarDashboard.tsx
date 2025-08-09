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
import { Logo } from "../Logo";

export default function NavbarDashboard() {
  const NavItems = () => (
    <>
      <NavigationMenuItem className="mx-2">
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/dashboard">Inicio</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  );

  return (
    <nav className="border-b bg-secondary w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0">
              <Logo className="h-8" />
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavItems />
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-8">
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
                    {/* "Explorar" solo visible en móvil */}
                    <Link 
                      href="/dashboard/social" 
                      className="text-lg font-semibold flex items-center"
                    >
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