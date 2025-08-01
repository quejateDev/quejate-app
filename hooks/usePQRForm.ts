import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Department, PQRSType, CustomField, UserRole, Entity } from "@prisma/client";
import { createPQRS } from '@/services/api/pqr.service';
import { getDepartmentsService } from '@/services/api/Department.service';

interface User {
  id?: string;
  email: string;
  name?: string;
  role?: UserRole;
  entity?: Entity;
}

export const formSchema = z.object({
  type: z.enum(["PETITION", "COMPLAINT", "CLAIM", "SUGGESTION", "REPORT"]),
  departmentId: z.string().optional(),
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

export const usePQRForm = (entityId: string, user: User | null) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [pqr, setPqr] = useState({
    type: "PETITION" as PQRSType,
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

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "PETITION",
      departmentId: undefined,
      customFields: {},
      isAnonymous: false,
      isPrivate: true,
      attachments: [],
    },
  });

  useEffect(() => {
    if (user) {
      setPqr(prev => ({ ...prev, creatorId: user?.id || "" }));
    }
  }, [user]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await getDepartmentsService();
      const filteredDepartments = selectedEntityId
        ? response.filter(dept => dept.entityId === selectedEntityId)
        : [];
      setDepartments(filteredDepartments);

      if (pqr.departmentId && !filteredDepartments.find(d => d.id === pqr.departmentId)) {
        setPqr(prev => ({ ...prev, departmentId: "" }));
        form.setValue('departmentId', undefined);
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
  }, [selectedEntityId, pqr.departmentId, form]);

  useEffect(() => {
    if (selectedEntityId) {
      fetchDepartments();
    } else {
      setDepartments([]);
    }
  }, [selectedEntityId, fetchDepartments]);

  async function fetchCustomFields(departmentId: string) {
    if (!departmentId) {
      setCustomFields([]);
      setPqr(prev => ({ ...prev, customFields: [] }));
      return;
    }

    try {
      const response = await fetch(`/api/area/${departmentId}/pqr-config`);
      const data = await response.json();
      setCustomFields(data?.customFields || []);

      setPqr(prev => ({
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

  const watchedDepartmentId = form.watch("departmentId");

  useEffect(() => {
    if (watchedDepartmentId) {
      fetchCustomFields(watchedDepartmentId);
    } else {
      setCustomFields([]);
    }
  }, [watchedDepartmentId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!recaptchaToken) {
      toast({
        title: "Error",
        description: "Por favor completa la verificación reCAPTCHA",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      const customFieldsData = customFields.map(field => ({
        name: field.name,
        value: values.customFields[field.name] || "",
        type: field.type,
        required: field.required,
        placeholder: field.placeholder || "",
      }));

      const attachmentsData = values.attachments.map(attachment => ({
        url: attachment.url,
        name: attachment.url.split("/").pop() || "",
        type: attachment.url.split(".").pop()?.toLowerCase() || "unknown",
        size: attachment.size || 0,
      }));

      formData.append(
        "data",
        JSON.stringify({
          type: values.type,
          departmentId: values.departmentId || null,
          creatorId: user?.id,
          dueDate: new Date(),
          customFields: customFieldsData,
          entityId: selectedEntityId,
          isAnonymous: values.isAnonymous,
          isPrivate: values.isPrivate,
          attachments: attachmentsData,
          subject: values.subject,
          description: values.description,
          recaptchaToken: recaptchaToken,
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
    } catch (error: any) {
      console.error(error);
      
      if (error.response?.data?.error === 'reCAPTCHA verification failed') {
        toast({
          title: "Error",
          description: "Verificación reCAPTCHA fallida. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      } else if (error.response?.data?.error === 'reCAPTCHA token is required') {
        toast({
          title: "Error",
          description: "Por favor completa la verificación reCAPTCHA",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Error al crear el PQRSD",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    departments,
    customFields,
    isLoading,
    isLoadingInitial,
    openDepartment,
    setOpenDepartment,
    onSubmit,
    recaptchaToken,
    setRecaptchaToken,
  };
};