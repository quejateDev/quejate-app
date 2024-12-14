"use client";

import { useState } from "react";
import ConfirmationModal from "./modals/ConfirmationModal";
import {
    Table,
    TableCell,
    TableBody,
    TableRow,
    TableHead,
    TableHeader,
} from "./ui/table";
import { User } from "@prisma/client";
import { Button } from "./ui/button";
import Link from "next/link";

interface EmployeeTableProps {
  employees: User[];
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteConfirm = () => {
    console.log("Eliminar empleado");
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Nombre Completo</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee: any) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.username}</TableCell>
              <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phone}</TableCell>
              <TableCell>
                {employee.department?.name || "No asignado"}
              </TableCell>  
              <TableCell>
                <Link href={`/dashboard/employee/${employee.id}`}>
                  <Button variant={"outline"}>Editar</Button>
                </Link>
              </TableCell>
              <TableCell>
                <Button
                  variant={"destructive"}
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Eliminar
                </Button>
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
    </div>
  );
}
