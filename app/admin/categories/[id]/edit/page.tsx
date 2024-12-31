"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import CategoryForm from "@/components/categories/category-form";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";

type Category = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

export default function EditCategoryPage() {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();


  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/category/${id}`);
        if (!response.ok) throw new Error("Failed to fetch category");
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch category",
          variant: "destructive",
        });
        router.push("/admin/categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Categoria</h1>
      </div>
      <Card className="p-6">
        <CategoryForm
          category={category}
          onSuccess={() => {
            router.push("/admin/categories");
            router.refresh();
          }}
        />
      </Card>
    </div>
  );
}
