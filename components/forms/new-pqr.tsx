"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useCallback, useEffect, useState } from "react";
import { createPQRS } from "@/services/api/pqr.service";
import { getEntities } from "@/services/api/entity.service";
import useAuthStore from "@/store/useAuthStore";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
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
  type: z.enum(["PETITION", "COMPLAINT", "CLAIM", "SUGGESTION", "REPORT"]),
  departmentId: z.string().min(1, "Debe seleccionar un área"),
  subject: z.string().min(1, "Describa brevemente el tema de su PQRSD"),
  description: z.string().min(1, "Describa detalladamente su PQRSD"),
  customFields: z.record(z.string()),
  isAnonymous: z.boolean(),
  isPrivate: z.boolean(),
  attachments: z.array(
    z.object({
      url: z.string(),
      size: z.number(),
    })
  ),
});

export function NewPQRForm({ entityId }: NewPQRFormProps) {
  const { user } = useAuthStore();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [pqr, setPqr] = useState<PQRSForm>({
    type: "PETITION",
    departmentId: "",
    creatorId: user?.id || "",
    dueDate: new Date(),
    customFields: [],
    isAnonymous: false,
    isPrivate: true,
    attachments: [],
  });
  const [selectedEntityId, setSelectedEntityId] = useState<string>(entityId);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [openDepartment, setOpenDepartment] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "PETITION",
      departmentId: "",
      customFields: {},
      isAnonymous: false,
      isPrivate: true,
      attachments: [],
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setPqr((prev) => ({ ...prev, creatorId: user?.id || "" }));
    }
  }, [user]);

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
    } finally {
      setIsLoadingInitial(false);
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
      const defaultCustomFields = customFields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: "",
        }),
        {}
      );

      form.setValue("customFields", defaultCustomFields);
    }
  }, [selectedEntityId, customFields, form]);

  useEffect(() => {
    if (form.getValues("departmentId")) {
      fetchCustomFields(form.getValues("departmentId"));
    }
  }, [form.getValues("departmentId")]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Preparar los custom fields
      const customFieldsData = customFields.map((field) => ({
        name: field.name,
        value: values.customFields[field.name] || "",
        type: field.type,
        required: field.required,
        placeholder: field.placeholder || "",
      }));

      // Preparar los archivos adjuntos
      const attachmentsData = values.attachments.map((attachment) => {
        const extension =
          attachment.url.split(".").pop()?.toLowerCase() || "unknown";

        return {
          url: attachment.url,
          name: attachment.url.split("/").pop() || "",
          type: extension,
          size: attachment.size || 0,
        };
      });

      formData.append(
        "data",
        JSON.stringify({
          type: values.type,
          departmentId: values.departmentId,
          creatorId: user?.id,
          dueDate: new Date(),
          customFields: customFieldsData,
          entityId: selectedEntityId,
          isAnonymous: values.isAnonymous,
          isPrivate: values.isPrivate,
          attachments: attachmentsData,
          subject: values.subject,
          description: values.description,
        })
      );

      const response = await createPQRS(formData);

      if (response) {
        toast({
          title: "PQRSD creado",
          description: "El PQRSD ha sido creado exitosamente",
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
    <Card className="max-w-lg mx-auto">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <div className="grid gap-4 pt-6">
              <div>
                <Label>Tipo de Solicitud</Label>
                <Select
                  value={form.getValues("type")}
                  onValueChange={(value: PQRSType) => {
                    form.setValue("type", value);
                    setPqr((prev) => ({ ...prev, type: value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de solicitud" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PETITION">Petición</SelectItem>
                    <SelectItem value="COMPLAINT">Queja</SelectItem>
                    <SelectItem value="CLAIM">Reclamo</SelectItem>
                    <SelectItem value="SUGGESTION">Sugerencia</SelectItem>
                    <SelectItem value="REPORT">Denuncia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área</FormLabel>
                    <Popover
                      open={openDepartment}
                      onOpenChange={setOpenDepartment}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openDepartment}
                          className="w-full justify-between"
                        >
                          {field.value
                            ? departments.find(
                                (department) => department.id === field.value
                              )?.name
                            : "Seleccione un área..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command className="w-full">
                          <CommandInput placeholder="Buscar área..." />
                          <CommandList className="max-h-[300px] w-full overflow-y-auto">
                            <CommandEmpty>
                              No se encontró ningún área.
                            </CommandEmpty>
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

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Asunto de la PQRSD" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descripción de la PQRSD"
                      />
                    </FormControl>
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
                            placeholder={field.placeholder || ""}
                            required={field.required}
                          />
                        ) : field.type === "email" ? (
                          <Input
                            type="email"
                            {...formField}
                            placeholder={field.placeholder || ""}
                            required={field.required}
                          />
                        ) : field.type === "phone" ? (
                          <Input
                            type="tel"
                            {...formField}
                            placeholder={field.placeholder || ""}
                            required={field.required}
                          />
                        ) : (
                          <Input
                            {...formField}
                            type={field.type}
                            placeholder={field.placeholder || ""}
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

              <div className="flex flex-col space-y-1">
                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          id="isAnonymous"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(checked as boolean)
                          }
                        />
                      </FormControl>
                      <FormLabel>
                        ¿Desea enviar esta PQRSD de forma anónima?
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <p className="text-xs text-gray-500">
                  Si marca esta opción, su nombre y datos de contacto no serán
                  visibles para la entidad ni para otros usuarios.
                </p>
              </div>

              <div className="flex flex-col space-y-1 mb-6">
                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl className="m-0">
                        <Checkbox
                          id="isPrivate"
                          checked={!field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(!checked)
                          }
                        />
                      </FormControl>
                      <FormLabel>
                        ¿Desea publicar esta PQRSD en el muro público?
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <p className="text-xs text-gray-500">
                  Si marca esta opción, su queja será visible para otras
                  personas en la sección de denuncias públicas.
                </p>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar PQRSD"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
