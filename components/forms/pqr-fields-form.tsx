import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useFieldArray, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { PQRFieldsFormValues, PqrFieldsSchema } from "@/types/pqr-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function PqrFieldsForm({ areaId, initialData }: { areaId: string, initialData: PQRFieldsFormValues }) {
  const form = useForm<PQRFieldsFormValues>({
    resolver: zodResolver(PqrFieldsSchema),
    defaultValues: initialData,
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customFields",
  });

  const onSubmit = async (data: PQRFieldsFormValues) => {
    try {
      await fetch(`/api/area/${areaId}/pqr-config/fields`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      toast({
        title: "Campos actualizados",
        description: "Los campos personalizados han sido actualizados exitosamente",
      });
    } catch (error) {
      console.error("Error submitting:", error);
      toast({
        title: "Error",
        description: "Error al actualizar los campos personalizados",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campos Personalizados</CardTitle>
        <CardDescription className="flex justify-between">
          <span>Personaliza los campos de la solicitud PQR</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: "", type: "text", required: false })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Campo
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`customFields.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre del Campo</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`customFields.${index}.placeholder`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Texto de Ayuda (Opcional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ej: Ingrese su número de documento" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`customFields.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Campo</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un tipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="email">Correo Electrónico</SelectItem>
                                  <SelectItem value="phone">Teléfono</SelectItem>
                                  <SelectItem value="text">Texto</SelectItem>
                                  <SelectItem value="textarea">Texto Largo</SelectItem>
                                  {/* <SelectItem value="file">Archivo</SelectItem> */}
                                  <SelectItem value="number">Número</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <FormField
                          control={form.control}
                          name={`customFields.${index}.required`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Campo Requerido</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button type="submit" className="mt-4">
              Guardar Campos
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
