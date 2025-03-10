"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  pqrConfigSchema,
  PQRConfigFormProps,
  PQRConfigFormValues,
} from "@/types/pqr-config";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Client } from "@/services/api/Client";
import {
  Card,
  CardContent,
  CardDescription, CardHeader,
  CardTitle
} from "../ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PQRConfigForm({ areaId, initialData }: PQRConfigFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const form = useForm<PQRConfigFormValues>({
    resolver: zodResolver(pqrConfigSchema),
    defaultValues: initialData || {
      allowAnonymous: false,
      requireEvidence: false,
      maxResponseTime: "72",
      notifyEmail: true,
      autoAssign: false,
    },
  });

  const onSubmit = async (data: PQRConfigFormValues) => {
    try {
      setIsSaving(true);
      await Client.put(`/area/${areaId}/pqr-config`, data);
      toast({
        title: "Éxito",
        description: "Configuración actualizada correctamente",
      });
      router.refresh();
    } catch (error) {
      console.error("Error submitting:", error);
      toast({
        title: "Error",
        description: "Error al guardar la configuración",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de PQR</CardTitle>
        <CardDescription>
          Personaliza y/o configura los pqr de el area
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="allowAnonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Permitir PQR anónimos</FormLabel>
                    <FormDescription>
                      Permite que los usuarios envíen PQR sin identificarse
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requireEvidence"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Requerir evidencia</FormLabel>
                    <FormDescription>
                      Exige que los usuarios adjunten evidencia al crear un PQR
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxResponseTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiempo máximo de respuesta (días hábiles)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tiempo límite para responder a los PQR
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="notifyEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Notificaciones por correo</FormLabel>
                    <FormDescription>
                      Enviar notificaciones por correo cuando se reciban nuevos
                      PQR
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            /> */}

            {/* <FormField
              control={form.control}
              name="autoAssign"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Asignación automática</FormLabel>
                    <FormDescription>
                      Asignar automáticamente los PQR a los miembros del área
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            /> */}

            <div className="flex justify-end">
              <Button type="submit" isLoading={isSaving}>
                Guardar Configuración
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
