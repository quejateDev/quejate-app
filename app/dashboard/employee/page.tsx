import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getEmployeesService } from "@/services/api/Employee.service";
import EmployeeTable from "@/components/EmployeeTable";

async function getEmployees() {
  const employees = await getEmployeesService();

  return employees;
}

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Empleados Registrados</h1>
        <Link href="/dashboard/employee/create">
          <Button variant={"success"}>Crear Nuevo Empleado</Button>
        </Link>
      </div>

      <EmployeeTable employees={employees} />
    </div>
  );
}
