"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, UserMinus, Users, PenSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import axios from "axios";
import useAuthStore from "@/store/useAuthStore";

interface Department {
  id: string;
  name: string;
}

interface EntityUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  departmentId?: string;
}

interface AdminManagerProps {
  entityId: string;
}

const USER_ROLES = [
  { value: "ADMIN", label: "Administrador" },
  { value: "EMPLOYEE", label: "Empleado" },
];

export function AdminManager({ entityId }: AdminManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [users, setUsers] = useState<EntityUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<EntityUser | null>(null);
  const { toast } = useToast();
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/admin/entities/${entityId}/users`);
      setUsers(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, entityId]);

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`/api/admin/entities/${entityId}/users`, {
        email,
        role: "EMPLOYEE",
      });

      toast({
        title: "Éxito",
        description: "Usuario agregado correctamente",
      });

      setEmail("");
      await fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el usuario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeUser = async (userId: string) => {
    try {
      await axios.delete(`/api/admin/entities/${entityId}/users/${userId}`);

      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente",
      });

      await fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const updateUser = async (userId: string, data: { role?: string; departmentId?: string }) => {
    try {
      await axios.patch(`/api/admin/entities/${entityId}/users/${userId}`, data);

      toast({
        title: "Éxito",
        description: "Usuario actualizado correctamente",
      });

      await fetchUsers();
      setIsEditOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsOpen(true)}
          >
            <Users size={16} />
            Usuarios
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Usuarios de la entidad</DialogTitle>
            <DialogDescription>
              Gestiona los usuarios de esta entidad. Puedes asignar roles y departamentos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={addUser} className="flex gap-2">
            <Input
              placeholder="Email del usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <Button type="submit" disabled={isLoading}>
              <UserPlus size={16} className="mr-2" />
              Agregar
            </Button>
          </form>

          <Separator className="my-4" />

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditOpen(true);
                      }}
                    >
                      <PenSquare size={16} className="text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeUser(user.id)}
                    >
                      <UserMinus size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Editar usuario</SheetTitle>
            <SheetDescription>
              Modifica el rol y departamento del usuario
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rol</label>
              <Select
                value={selectedUser?.role}
                onValueChange={(value) =>
                  selectedUser && updateUser(selectedUser.id, { role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Departamento</label>
              <Select
                value={selectedUser?.departmentId}
                onValueChange={(value) =>
                  selectedUser && updateUser(selectedUser.id, { departmentId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
