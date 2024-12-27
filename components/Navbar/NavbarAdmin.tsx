"use client";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  NavigationMenu, NavigationMenuItem,
  NavigationMenuList
} from "../ui/navigation-menu";

export default function NavbarAdmin() {
  return (
    <div className="border-b w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-16">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
}
