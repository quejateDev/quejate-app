"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  entities: any[];
}

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [data, setData] = useState(categories);

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        const response = await fetch(`/api/category/${categoryToDelete}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete category");

        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
        
        toast({
          title: "Categoria eliminada correctamente",
          description: "La categoria ha sido eliminada correctamente",
        });
        
        // Fetch updated data
        const newDataResponse = await fetch("/api/category");
        const newData = await newDataResponse.json();
        setData(newData);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Error al eliminar la categoria",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Entidades</TableHead>
            <TableHead>Fecha de Creación</TableHead>
            <TableHead>Última Actualización</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                {category.imageUrl ? (
                  <div className="relative w-16 h-16">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
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
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.description || "Sin descripción"}</TableCell>
              <TableCell>{category.entities.length}</TableCell>
              <TableCell>
                {new Date(category.createdAt).toLocaleDateString("es-ES")}
              </TableCell>
              <TableCell>
                {new Date(category.updatedAt).toLocaleDateString("es-ES")}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/admin/categories/${category.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(category.id)}
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
        onConfirm={handleDeleteConfirm}
        title="Eliminar Categoria"
        description="¿Está seguro que desea eliminar esta categoria? Esta acción no se puede deshacer."
      />
    </>
  );
}
