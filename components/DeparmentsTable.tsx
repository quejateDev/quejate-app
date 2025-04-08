"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Building2, Trash2, PencilLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Department } from "@prisma/client";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import ConfirmationModal from "./modals/ConfirmationModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteDepartmentService,
  getDepartmentsService,
} from "@/services/api/Department.service";

interface DepartmentWithEntity extends Department {
  entity: {
    name: string;
  };
}

type SortField = "name" | "date" | "entity";

interface DepartmentsTableProps {
  departments: DepartmentWithEntity[];
}

export function DeparmentsTable({
  departments: initialDepartments,
}: DepartmentsTableProps) {
  const [departments, setDepartments] = useState(initialDepartments);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(
    null
  );

  async function handleDeleteClick(departmentId: string) {
    setDepartmentToDelete(departmentId);
    setIsDeleteModalOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!departmentToDelete) return;

    try {
      await deleteDepartmentService(departmentToDelete);
      const newData = await getDepartmentsService();
      setDepartments(newData);
      toast({
        description: "Área eliminada correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar el área:", error);
      toast({
        description: "Error al eliminar el área",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setDepartmentToDelete(null);
    }
  }

  const filteredDepartments = departments
    .filter(
      (department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary/80" />
              <CardTitle className="text-2xl font-bold">Áreas</CardTitle>
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                <Input
                  type="search"
                  placeholder="Buscar áreas..."
                  className="pl-8 bg-white/50 border-muted-foreground/20 focus:border-primary/30 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={sortBy}
                onValueChange={(value: SortField) => setSortBy(value)}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-white/50 border-muted-foreground/20">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Fecha de registro</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="entity">Entidad</SelectItem>
                </SelectContent>
              </Select>
              <Link href="/admin/area/new" className="shrink-0">
                <Button className="w-full md:w-auto gap-2 bg-primary/90 hover:bg-primary transition-colors">
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:inline">Nueva Área</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden bg-white">
            <DataTable
              data={filteredDepartments}
              columns={[
                {
                  header: "Nombre",
                  accessorKey: "name",
                  cell: ({ row }) => (
                    <span className="font-medium text-primary/90">
                      {row.original.name}
                    </span>
                  ),
                },
                {
                  header: "Descripción",
                  accessorKey: "description",
                  cell: ({ row }) => (
                    <span className="text-muted-foreground">
                      {row.original.description || "Sin descripción"}
                    </span>
                  ),
                },
                {
                  header: "Fecha de Registro",
                  accessorKey: "createdAt",
                  cell: ({ row }) => (
                    <span className="text-muted-foreground">
                      {new Date(row.original.createdAt).toLocaleDateString(
                        "es-ES"
                      )}
                    </span>
                  ),
                },
              ]}
              actions={{
                edit: {
                  href: (department) => `/admin/area/${department.id}`,
                },
                delete: {
                  onDelete: handleDeleteClick,
                },
              }}
              emptyMessage="No se encontraron áreas"
            />
          </div>
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Está seguro de eliminar esta área?"
        description="Esta acción no se puede deshacer. Se eliminarán todos los datos asociados a esta área."
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
