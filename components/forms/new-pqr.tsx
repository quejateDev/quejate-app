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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";

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
};

type NewPQRFormProps = {
  entityId: string;
};

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
  });
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const [openDepartment, setOpenDepartment] = useState(false);
  const [openEntity, setOpenEntity] = useState(false);

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
    if (pqr.departmentId) {
      fetchCustomFields(pqr.departmentId);
    }
  }, [pqr.departmentId]);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { customFields: customFieldValues, ...pqrData } = pqr;

      // // First create the PQRS
      const response = await createPQRS({
        ...pqrData,
        customFields: customFieldValues,
      });

      if (response) {
        toast({
          title: "PQR creado",
          description: "El PQR ha sido creado exitosamente",
        });

        window.location.href = `/dashboard`;
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
  }

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
        <form onSubmit={handleSubmit} className="space-y-4">
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
                      ? entities.find((entity) => entity.id === selectedEntityId)?.name
                      : "Seleccione una entidad..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar entidad..." />
                    <CommandList className="max-h-[300px] w-full overflow-y-auto">
                      <CommandEmpty>No se encontro ninguna entidad.</CommandEmpty>
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

            <div>
              <Label>Área</Label>
              <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openDepartment}
                    className="w-full justify-between"
                  >
                    {pqr.departmentId
                      ? departments.find(
                          (department) => department.id === pqr.departmentId
                        )?.name
                      : "Seleccione un area..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar area..." />
                    <CommandList className="max-h-[300px] w-full overflow-y-auto"> 
                      <CommandEmpty>No se encontro ninguna area.</CommandEmpty>
                      <CommandGroup className="w-full">
                        {departments.map((department) => (
                          <CommandItem
                            key={department.id}
                            value={department.name}
                            onSelect={() => {
                              setPqr((prev) => ({
                                ...prev,
                                departmentId: department.id,
                              }));
                              setOpenDepartment(false);
                            }}
                            className="w-full"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                pqr.departmentId === department.id
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
            </div>

            {customFields.map((field) => {
              const commonProps = {
                id: field.name,
                label: field.name,
                placeholder: field.placeholder || "",
                value:
                  pqr.customFields.find((cf) => cf.name === field.name)
                    ?.value || "",
                onChange: (value: string) =>
                  handleCustomFieldChange(field.name, value),
                required: field.required,
              };

              switch (field.type) {
                case "text":
                  return <TextField key={field.name} {...commonProps} />;
                case "textarea":
                  return <TextAreaField key={field.name} {...commonProps} />;
                case "phone":
                  return <PhoneField key={field.name} {...commonProps} />;
                case "email":
                  return <EmailField key={field.name} {...commonProps} />;
                case "file":
                  return (
                    <FileField
                      key={field.name}
                      {...commonProps}
                      accept="image/*,application/pdf"
                      maxSize={5}
                    />
                  );
                case "number":
                  return <NumberField key={field.name} {...commonProps} />;
                default:
                  return <TextField key={field.name} {...commonProps} />;
              }
            })}

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
      </CardContent>
    </Card>
  );
}
