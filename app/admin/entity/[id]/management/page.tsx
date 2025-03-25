"use client";

import { useEffect, useState } from "react";
// import { AdminManager } from '@/components/entity/admin-manager';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VerificationBadge } from "@/components/ui/verification-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { AdminManager } from "@/components/entity/admin-manager";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EntityUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Entity {
  id: string;
  name: string;
  isVerified: boolean;
  users: EntityUser[];
}

const roles = {
  ADMIN: "Administrador",
  EMPLOYEE: "Empleado",
};

export default function EntityManagementPage() {
  const [entity, setEntity] = useState<Entity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const params = useParams();

  if (!params.id) {
    return <div>No se encontró la entidad</div>;
  }

  const fetchEntityData = async () => {
    try {
      const response = await axios.get(`/api/admin/entities/${params.id}`);
      setEntity(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la información de la entidad",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntityData();
  }, [params.id]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.patch(`/api/admin/entities/${params.id}/users/${userId}`, {
        role: newRole,
      });

      fetchEntityData();
      toast({
        title: "Éxito",
        description: "Rol cambiado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el rol del usuario",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center space-x-4">
          <div className="h-6 w-32 animate-pulse rounded bg-muted"></div>
        </div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-muted-foreground">No se encontró la entidad</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">
            Administración de {entity.name}
          </h1>
          {entity.isVerified && <VerificationBadge />}
        </div>
        <AdminManager entityId={params.id as string} />
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios de la Entidad</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Departamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entity.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => {
                            handleRoleChange(user.id, value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Administrador</SelectItem>
                            <SelectItem value="EMPLOYEE">Empleado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
