"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useAuthStore from "@/store/useAuthStore";
import {
  Users,
  Building2,
  LogOut,
  MessageCircle,
  Building,
  Tags
} from "lucide-react";
import { useRouter } from "next/navigation";

// Menu items.
const InternalManagement = [
  {
    title: "Categories",
    url: "/admin/categories",
    icon: Tags,
  },
  {
    title: "Entidades",
    url: "/admin/entity",
    icon: Building,
  },
  {
    title: "Areas",
    url: "/admin/area",
    icon: Building2,
  },
  {
    title: "PQRs",
    url: "/admin/pqr",
    icon: MessageCircle,
  },
];

const ExternalManagement = [
  {
    title: "Clientes",
    url: "/admin/clients",
    icon: Users,
  },
];

export function AppSidebar() {
  const { logout } = useAuthStore();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  return (
    <Sidebar>
      <SidebarHeader>
        {/* Logo de la empresa */}
        <div className="flex items-center justify-center p-4">
          <img src="/logo.png" alt="Logo de la empresa" className="h-8" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión Interna</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {InternalManagement.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="text-blue-500" />
                      <span className={``}>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestión Externa</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ExternalManagement.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="text-green-500" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="bg-red-500 text-white hover rounded-lg hover:bg-red-600 hover:text-white" onClick={handleLogout}>
                  <LogOut />
                  <span>Cerrar Sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
