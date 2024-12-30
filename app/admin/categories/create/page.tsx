"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import CategoryForm from "@/components/categories/category-form";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Crear Categoria</h1>
      </div>
      <Card className="p-6">
        <CategoryForm
          onSuccess={() => {
            router.push("/admin/categories");
            router.refresh();
          }}
        />
      </Card>
    </div>
  );
}
