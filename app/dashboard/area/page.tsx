import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import prisma from "@/lib/prisma";

async function getDepartments() {
  try {
    // const departments = await prisma.department.findMany({
    //   include: {
    //     employees: true,
    //     forms: true,
    //     pqrs: true,
    //   },
    // });
    // return departments;
    const departments = [
      {
        id: 1,
        name: "Tecnología",
        employees: [],
        forms: [],
        pqrs: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Recursos Humanos",
        employees: [],
        forms: [],
        pqrs: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Finanzas",
        employees: [],
        forms: [],
        pqrs: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return departments;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
}

export default async function AreasPage() {
  const departments = await getDepartments();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Áreas Registradas</h1>
        <Link href="/dashboard/area/create">
          <Button>Crear Nueva Área</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Área</TableHead>
              <TableHead>Empleados</TableHead>
              <TableHead>Formularios</TableHead>
              <TableHead>PQRS</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Última Actualización</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>{department.employees.length}</TableCell>
                <TableCell>{department.forms.length}</TableCell>
                <TableCell>{department.pqrs.length}</TableCell>
                <TableCell>
                  {department.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {department.updatedAt.toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
