import EmployeeForm from "@/components/forms/employee-form";
import { getDepartmentsService } from "@/services/api/Department.service";

export default async function CreateEmployee() {
  const departments = await getDepartmentsService();
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Empleado</h1>

      <EmployeeForm departments={departments} />
    </div>
  );
}
