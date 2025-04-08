"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Users, UserPlus, UserMinus, Ban } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  isActive?: boolean;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "email">("date");
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/admin/clients");
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/clients/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setClients((prev) => prev.filter((client) => client.id !== id));
        toast({
          description: "Cliente eliminado exitosamente",
        });
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/clients/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setClients((prev) =>
          prev.map((client) =>
            client.id === id
              ? { ...client, isActive: !currentStatus }
              : client
          )
        );
        toast({
          description: `Cliente ${!currentStatus ? "activado" : "desactivado"} exitosamente`,
        });
      }
    } catch (error) {
      console.error("Error toggling client status:", error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del cliente",
        variant: "destructive",
      });
    }
  };

  const filteredClients = clients
    .filter(
      (client) =>
        client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
        case "email":
          return a.email.localeCompare(b.email);
        case "date":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const stats = {
    total: clients.length,
    active: clients.filter((client) => client.isActive !== false).length,
    newThisMonth: clients.filter(
      (client) =>
        new Date(client.createdAt).getTime() >
        new Date(new Date().setDate(1)).getTime()
    ).length,
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-none shadow-md">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-none shadow-md">
          <CardHeader className="pb-4">
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Total Empleados
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Nuevos este mes
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newThisMonth}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <UserMinus className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Empleados Activos
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-bold">Empleados</CardTitle>
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar empleados..."
                  className="pl-8 bg-muted/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Fecha de registro</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
              <Link href="/admin/users/new">
                <Button className="w-full md:w-auto gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:inline">Nuevo Empleado</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-card">
            <DataTable
              data={filteredClients}
              columns={[
                {
                  header: "Nombre",
                  accessorKey: (client) => `${client.firstName} ${client.lastName}`,
                },
                {
                  header: "Email",
                  accessorKey: "email",
                },
                {
                  header: "Teléfono",
                  accessorKey: "phone",
                },
                {
                  header: "Estado",
                  accessorKey: (client) => (
                    <Badge
                      variant={client.isActive !== false ? "default" : "secondary"}
                      className="font-normal"
                    >
                      {client.isActive !== false ? "Activo" : "Inactivo"}
                    </Badge>
                  ),
                },
                {
                  header: "Fecha de Registro",
                  accessorKey: "createdAt",
                },
              ]}
              actions={{
                edit: {
                  href: (client) => `/admin/users/${client.id}/edit`,
                },
                delete: {
                  onDelete: handleDelete,
                },
                custom: [
                  {
                    icon: Ban,
                    label: "Cambiar Estado",
                    onClick: (client) => handleToggleStatus(client.id, client.isActive !== false),
                    // variant: client.isActive !== false ? "destructive" : "default",
                  },
                ],
              }}
              emptyMessage="No se encontraron empleados"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
