"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { getDepartmentsService } from "@/services/api/Department.service";
import {
  Entity,
  Department,
  PQRSType,
  User,
  CustomField,
} from "@prisma/client";
import { useEffect, useState } from "react";
import { TextField } from "../fields/TextField";
import { TextAreaField } from "../fields/TextAreaField";
import { PhoneField } from "../fields/PhoneField";
import { EmailField } from "../fields/EmailField";
import { FileField } from "../fields/FileField";
import { NumberField } from "../fields/NumberField";
import { createPQRS } from "@/services/api/pqr.service";
import { getEntities } from "@/services/api/entity.service";
import useAuthStore from "@/store/useAuthStore";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Combobox } from "../ui/combobox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { FileUpload } from "../ui/file-upload";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form"
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CustomFieldValue = {
  name: string;
  value: string;
  type: string;
  placeholder: string;
  required: boolean;
};

type PQRSForm = {
  type: PQRSType;
  departmentId: Department["id"];
  creatorId: User["id"];
  dueDate: Date;
  customFields: CustomFieldValue[];
  isAnonymous: boolean;
  isPrivate: boolean;
  attachments: File[];
};

type NewPQRFormProps = {
  entityId: string;
};

const formSchema = z.object({
  type: z.enum(["PETITION", "COMPLAINT", "CLAIM", "SUGGESTION"]),
  departmentId: z.string().min(1, "Debe seleccionar un área"),
  customFields: z.record(z.string()),
  isAnonymous: z.boolean(),
  isPrivate: z.boolean(),
  attachments: z.array(z.object({
    url: z.string(),
    size: z.number()
  })),
})

export function NewPQRForm({ entityId }: NewPQRFormProps) {
  const { user } = useAuthStore();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [pqr, setPqr] = useState<PQRSForm>({
    type: "PETITION",
    departmentId: "",
    creatorId: user?.id || "",
    dueDate: new Date(),
    customFields: [],
    isAnonymous: false,
    isPrivate: false,
    attachments: [],
  });
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const [openDepartment, setOpenDepartment] = useState(false);
  const [openEntity, setOpenEntity] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "PETITION",
      departmentId: "",
      customFields: {},
      isAnonymous: false,
      isPrivate: false,
      attachments: [],
    },
  })

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setPqr((prev) => ({ ...prev, creatorId: user?.id || "" }));
    }
  }, [user]);

  async function fetchEntities() {
    try {
      const response = await getEntities();
      setEntities(response);
      setSelectedEntityId(entityId);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al cargar las entidades",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInitial(false);
    }
  }

  useEffect(() => {
    fetchEntities();
  }, []);

  useEffect(() => {
    if (selectedEntityId) {
      fetchDepartments();
    } else {
      setDepartments([]);
    }
  }, [selectedEntityId]);

  async function fetchDepartments() {
    try {
      const response = await getDepartmentsService();
      // Filter departments by selected entity
      const filteredDepartments = selectedEntityId
        ? response.filter((dept) => dept.entityId === selectedEntityId)
        : [];
      setDepartments(filteredDepartments);

      // Clear department selection when entity changes
      if (
        pqr.departmentId &&
        !filteredDepartments.find((d) => d.id === pqr.departmentId)
      ) {
        setPqr((prev) => ({ ...prev, departmentId: "" }));
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al cargar los departamentos",
        variant: "destructive",
      });
    }
  }

  async function fetchCustomFields(departmentId: string) {
    try {
      const response = await fetch(`/api/area/${departmentId}/pqr-config`);
      const data = await response.json();
      setCustomFields(data?.customFields || []);

      // Initialize all custom fields with empty values
      setPqr((prev) => ({
        ...prev,
        customFields: (data?.customFields || []).map((field: CustomField) => ({
          name: field.name,
          value: "",
          type: field.type,
          placeholder: field.placeholder || "",
          required: field.required || false,
        })),
      }));
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al cargar los campos personalizados",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (selectedEntityId) {
      fetchDepartments();
      // Inicializar los custom fields en el formulario
      const defaultCustomFields = customFields.reduce((acc, field) => ({
        ...acc,
        [field.name]: ''
      }), {});
      
      form.setValue('customFields', defaultCustomFields);
    }
  }, [selectedEntityId, customFields, form]);

  useEffect(() => {
    if (form.getValues('departmentId')) {
      fetchCustomFields(form.getValues('departmentId'));
    }
  }, [form.getValues('departmentId')]);

  const handleCustomFieldChange = (name: string, value: string) => {
    setPqr((prev) => {
      const updatedFields = prev.customFields.map((field) =>
        field.name === name ? { ...field, value } : field
      );

      if (!updatedFields.some((field) => field.name === name)) {
        const fieldConfig = customFields.find((cf) => cf.name === name);
        if (fieldConfig) {
          updatedFields.push({
            name,
            value,
            type: fieldConfig.type,
            placeholder: fieldConfig.placeholder || "",
            required: fieldConfig.required || false,
          });
        }
      }

      return { ...prev, customFields: updatedFields };
    });
  };

  const handleFileChange = (files: File[]) => {
    setPqr((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      
      // Preparar los custom fields
      const customFieldsData = customFields.map(field => ({
        name: field.name,
        value: values.customFields[field.name] || '',
        type: field.type,
        required: field.required,
        placeholder: field.placeholder || ''
      }));

      // Preparar los archivos adjuntos
      const attachmentsData = values.attachments.map(attachment => {
        const extension = attachment.url
          .split('.')
          .pop()
          ?.toLowerCase() || 'unknown';

        return {
          url: attachment.url,
          name: attachment.url.split('/').pop() || '',
          type: extension,
          size: attachment.size || 0,
        };
      });

      formData.append('data', JSON.stringify({
        type: values.type,
        departmentId: values.departmentId,
        creatorId: user?.id,
        dueDate: new Date(),
        customFields: customFieldsData,
        entityId: selectedEntityId,
        isAnonymous: values.isAnonymous,
        isPrivate: values.isPrivate,
        attachments: attachmentsData,
        title: values.customFields['Título'] || '',
        description: values.customFields['Descripción'] || '',
      }));

      const response = await createPQRS(formData);

      if (response) {
        toast({
          title: "PQR creado",
          description: "El PQR ha sido creado exitosamente",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al crear el PQR",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingInitial) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envía tu PQRS</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <div className="grid gap-4">
              <div>
                <Label>Tipo de Solicitud</Label>
                <Select
                  value={pqr.type}
                  onValueChange={(value: PQRSType) =>
                    setPqr((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de solicitud" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PETITION">Petición</SelectItem>
                    <SelectItem value="COMPLAINT">Queja</SelectItem>
                    <SelectItem value="CLAIM">Reclamo</SelectItem>
                    <SelectItem value="SUGGESTION">Sugerencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Entidad</Label>
                <Popover open={openEntity} onOpenChange={setOpenEntity}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openEntity}
                      className="w-full justify-between"
                    >
                      {selectedEntityId
                        ? entities.find(
                            (entity) => entity.id === selectedEntityId
                          )?.name
                        : "Seleccione una entidad..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command className="w-full">
                      <CommandInput placeholder="Buscar entidad..." />
                      <CommandList className="max-h-[300px] w-full overflow-y-auto">
                        <CommandEmpty>
                          No se encontro ninguna entidad.
                        </CommandEmpty>
                        <CommandGroup className="w-full">
                          {entities.map((entity) => (
                            <CommandItem
                              key={entity.id}
                              value={entity.name}
                              onSelect={() => {
                                setSelectedEntityId(entity.id);
                                setOpenEntity(false);
                              }}
                              className="w-full"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedEntityId === entity.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {entity.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área</FormLabel>
                    <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openDepartment}
                          className="w-full justify-between"
                        >
                          {field.value
                            ? departments.find((department) => department.id === field.value)?.name
                            : "Seleccione un área..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command className="w-full">
                          <CommandInput placeholder="Buscar área..." />
                          <CommandList className="max-h-[300px] w-full overflow-y-auto">
                            <CommandEmpty>No se encontró ningún área.</CommandEmpty>
                            <CommandGroup className="w-full">
                              {departments.map((department) => (
                                <CommandItem
                                  key={department.id}
                                  value={department.name}
                                  onSelect={() => {
                                    field.onChange(department.id);
                                    fetchCustomFields(department.id);
                                    setOpenDepartment(false);
                                  }}
                                  className="w-full"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === department.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {department.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {customFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={`customFields.${field.name}`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.name}</FormLabel>
                      <FormControl>
                        {field.type === "textarea" ? (
                          <Textarea
                            {...formField}
                            placeholder={field.placeholder || ''}
                            required={field.required}
                          />
                        ) : field.type === "email" ? (
                          <Input
                            type="email"
                            {...formField}
                            placeholder={field.placeholder || ''}
                            required={field.required}
                          />
                        ) : field.type === "phone" ? (
                          <Input
                            type="tel"
                            {...formField}
                            placeholder={field.placeholder || ''}
                            required={field.required}
                          />
                        ) : (
                          <Input
                            {...formField}
                            type={field.type}
                            placeholder={field.placeholder || ''}
                            required={field.required}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="space-y-2">
                <FileUpload 
                  form={form} 
                  name="attachments" 
                  label="Archivos Adjuntos"
                  folder="pqr"
                  multiple={true}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx, video/*"
                  maxSize={10}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAnonymous"
                  checked={pqr.isAnonymous}
                  onCheckedChange={(checked) =>
                    setPqr((prev) => ({
                      ...prev,
                      isAnonymous: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="isAnonymous">Hacer PQR anónima</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrivate"
                  checked={pqr.isPrivate}
                  onCheckedChange={(checked) =>
                    setPqr((prev) => ({
                      ...prev,
                      isPrivate: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="isPrivate">Es privada</Label>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar PQRS"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
