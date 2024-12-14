// app/dashboard/employee/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import EmployeeForm from "@/components/forms/employee-form";
import { Client } from "@/services/api/Client";
import { Department, User } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { useParams } from "next/navigation";

interface EmployeePageProps {
  params: {
    id: string;
  };
}

const EmployeePage = ({ params }: EmployeePageProps) => {
  const [employee, setEmployee] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employee and departments in parallel
        const [employeeResponse, departmentsResponse] = await Promise.all([
          Client.get(`/employee/${id}`),
          Client.get("/area"),
        ]);

        setEmployee(employeeResponse.data);
        setDepartments(departmentsResponse.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al cargar los datos del empleado",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Cargando...</div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-full">
        Empleado no encontrado
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Editar Empleado</CardTitle>
          <CardDescription>Edita la información del empleado</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeForm
            departments={departments}
            initialData={{
              id: employee.id,
              username: employee.username,
              firstName: employee.firstName,
              lastName: employee.lastName,
              email: employee.email,
              phone: employee.phone,
              role: employee.role,
              departmentId: employee.departmentId || "",
            }}
            isEditing={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeePage;
