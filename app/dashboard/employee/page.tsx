import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

async function getEmployees() {
  // Mock data array
  const employees = [
    {
      id: 1,
      username: "jsmith",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@company.com",
      phone: "+1 234-567-8901",
      role: "ADMIN",
      department: { name: "Tecnología" },
      createdAt: new Date(),
    },
    {
      id: 2,
      username: "mgarcia",
      firstName: "María",
      lastName: "García",
      email: "maria.garcia@company.com",
      phone: "+1 234-567-8902",
      role: "EMPLOYEE",
      department: { name: "Recursos Humanos" },
      createdAt: new Date(),
    },
    {
      id: 3,
      username: "rlopez",
      firstName: "Roberto",
      lastName: "López",
      email: "roberto.lopez@company.com",
      phone: "+1 234-567-8903",
      role: "EMPLOYEE",
      department: null,
      createdAt: new Date(),
    },
  ];

  return employees;
}

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Empleados Registrados</h1>
        <Link href="/dashboard/employee/create">
          <Button>
            Crear Nuevo Empleado
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Departamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.username}</TableCell>
                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>
                  <Badge variant={
                    employee.role === "ADMIN" ? "destructive" : 
                    employee.role === "EMPLOYEE" ? "default" : 
                    "secondary"
                  }>
                    {employee.role === "ADMIN" ? "Administrador" : 
                     employee.role === "EMPLOYEE" ? "Empleado" : 
                     "Cliente"}
                  </Badge>
                </TableCell>
                <TableCell>{employee.department?.name || "No asignado"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
