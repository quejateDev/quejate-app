"use client";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    deleteDepartmentService,
    getDepartmentsService,
} from "@/services/api/Department.service";
import { PQRS, User } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import ConfirmationModal from "./modals/ConfirmationModal";

type Department = {
  id: string;
  name: string;
  employees: User[];
  pqrs: PQRS[];
  createdAt: Date;
  updatedAt: Date;
};

interface AreasTableProps {
  departments: Department[];
}

export function DeparmentsTable({ departments }: AreasTableProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(
    null
  );
  const [data, setData] = useState<Department[]>(departments);

  async function deleteDepartment(id: string) {
    await deleteDepartmentService(id);
  }

  async function handleDeleteClick(departmentId: string) {
    setDepartmentToDelete(departmentId);
    setIsDeleteModalOpen(true);
  }

  async function handleDeleteConfirm() {
    if (departmentToDelete) {
      try {
        await deleteDepartment(departmentToDelete);
        setIsDeleteModalOpen(false);
        setDepartmentToDelete(null);
        toast({
          title: "Área eliminada correctamente",
          description: "El área ha sido eliminada correctamente",
        });
        const newData = await getDepartmentsService();
        setData(newData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al eliminar el área",
        });
      }
      setIsDeleteModalOpen(false);
      setDepartmentToDelete(null);
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre del Área</TableHead>
            <TableHead>Empleados</TableHead>
            <TableHead>PQRS</TableHead>
            <TableHead>Fecha de Creación</TableHead>
            <TableHead>Última Actualización</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((department) => (
            <TableRow key={department.id}>
              <TableCell className="font-medium">{department.name}</TableCell>
              <TableCell>{department.employees.length}</TableCell>
              <TableCell>{department.pqrs.length}</TableCell>
              <TableCell>
                {new Date(department.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(department.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/dashboard/area/${department.id}`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(department.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Está seguro?"
        description="Esta acción no se puede deshacer"
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
