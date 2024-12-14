"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
});

interface AreaFormProps {
  initialData?: {
    id: string;
    name: string;
  };
  isEditing?: boolean;
}

export function AreaForm({ initialData, isEditing = false }: AreaFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      if (isEditing) {
        await axios.patch(`/api/area/${initialData?.id}`, values);
        toast({
          title: "Success",
          description: "Área actualizada correctamente",
        });
      } else {
        await axios.post("/api/area", values);
        toast({
          title: "Success",
          description: "Área creada correctamente",
        });
      }

      router.push("/dashboard/area");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Algo salió mal. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la área</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la área" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? isEditing
              ? "Actualizando..."
              : "Creando..."
            : isEditing
            ? "Actualizar Área"
            : "Crear Área"}
        </Button>
      </form>
    </Form>
  );
}
