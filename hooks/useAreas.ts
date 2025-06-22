import { useState, useEffect } from "react";
import { toast } from "./use-toast";
import { Department } from "@prisma/client";
import { getDepartmentsService } from "@/services/api/Department.service";


export function useDepartments(entityId: string) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartments() {
      if (!entityId) {
        setDepartments([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getDepartmentsService();
        const filteredDepartments = response.filter(
          (dept) => dept.entityId === entityId
        );
        setDepartments(filteredDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las áreas.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDepartments();
  }, [entityId]);

  return { departments, isLoadingDepartments: isLoading };
}