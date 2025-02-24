"use client";
import { Entity, Category } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import ConfirmationModal from "./modals/ConfirmationModal";
import { toast } from "@/hooks/use-toast";

interface EntitiesTableProps {
  entities: (Entity & {
    category: {
      name: string;
    };
  })[];
  categories: Category[];
}

export function EntitiesTable({ entities, categories }: EntitiesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredEntities, setFilteredEntities] = useState(entities);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<string | null>(null);

  useEffect(() => {
    const filtered = entities.filter((entity) => {
      const matchesSearch =
        entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;

      const matchesCategory =
        selectedCategory === "all" || entity.category.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredEntities(filtered);
  }, [searchTerm, selectedCategory, entities]);

  const handleDeleteClick = (entityId: string) => {
    setEntityToDelete(entityId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (entityToDelete) {
      try {
        const response = await fetch(`/api/entities/${entityToDelete}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete entity");

        setIsDeleteModalOpen(false);
        setEntityToDelete(null);
        
        toast({
          title: "Entidad eliminada correctamente",
          description: "La entidad ha sido eliminada correctamente",
        });
        const newDataResponse = await fetch("/api/entities");
        const newData = await newDataResponse.json();
        setFilteredEntities(newData);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Error al eliminar la entidad",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar entidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="w-[200px]">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Última Actualización</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntities.map((entity) => (
              <TableRow key={entity.id}>
                <TableCell>
                  {entity.imageUrl ? (
                    <div className="relative w-16 h-16">
                      <Image
                        src={entity.imageUrl}
                        alt={entity.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{entity.name}</TableCell>
                <TableCell>{entity.description || "Sin descripción"}</TableCell>
                <TableCell>{entity.category.name}</TableCell>
                <TableCell>
                  {new Date(entity.createdAt).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell>
                  {new Date(entity.updatedAt).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/admin/entity/${entity.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(entity.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Entidad"
        description="¿Está seguro que desea eliminar esta entidad? Esta acción no se puede deshacer."
      />
    </div>
  );
}