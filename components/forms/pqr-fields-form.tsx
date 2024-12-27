import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useFieldArray, useForm } from "react-hook-form";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Card, CardContent } from "../ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "../ui/form";
import { PQRConfigFormValues, pqrConfigSchema } from "@/types/pqr-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

export default function PqrFieldsForm() {
  const form = useForm<PQRConfigFormValues>({
    resolver: zodResolver(pqrConfigSchema),
    defaultValues: {
      customFields: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customFields",
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Campos Personalizados</h3>
          <p className="text-sm text-muted-foreground">
            Configura los campos adicionales que necesitas para los PQR de esta
            área
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              name: "",
              required: false,
              type: "text",
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Campo
        </Button>
      </div>

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
                            <SelectItem value="email">
                              Correo Electrónico
                            </SelectItem>
                            <SelectItem value="phone">Teléfono</SelectItem>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="file">Archivo</SelectItem>
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
                          <FormDescription>
                            Este campo será obligatorio al crear un PQR
                          </FormDescription>
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
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
