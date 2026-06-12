import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Department, PQRSType, CustomField } from "@prisma/client";
import { createPQRS } from '@/services/api/pqr.service';
import { getDepartmentsService } from '@/services/api/Department.service';

export const formSchema = z.object({
  type: z.enum(["PETITION", "COMPLAINT", "CLAIM", "SUGGESTION", "REPORT"]),
  departmentId: z.string().optional(),
  subject: z.string().min(1, "Describa brevemente el tema de su PQRSD"),
  description: z.string().min(1, "Describa detalladamente su PQRSD"),
  customFields: z.record(z.string()),
  isAnonymous: z.boolean(),
  isPrivate: z.boolean(),
  includePhone: z.boolean(),
  attachments: z.array(
    z.object({
      url: z.string(),
      size: z.number(),
    })
  ),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const usePQRForm = (entityId: string, userId: string | undefined) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [entityCustomFields, setEntityCustomFields] = useState<CustomField[]>([]);
  const [areaCustomFields, setAreaCustomFields] = useState<CustomField[]>([]);
  const [entityName, setEntityName] = useState<string>("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pqr, setPqr] = useState({
    type: "PETITION" as PQRSType,
    departmentId: "",
    creatorId: userId || "",
    dueDate: new Date(),
    customFields: [],
    isAnonymous: false,
    isPrivate: true,
    includePhone: false,
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
      includePhone: false,
      attachments: [],
      latitude: undefined,
      longitude: undefined,
    },
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      setPqr(prev => ({ ...prev, creatorId: userId }));
      fetchCurrentUser();
    }
  }, [userId]);

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

  async function fetchAreaCustomFields(departmentId: string) {
    if (!departmentId) {
      setAreaCustomFields([]);
      return;
    }

    try {
      const response = await fetch(`/api/area/${departmentId}/pqr-config`);
      const data = await response.json();
      setAreaCustomFields(data?.customFields || []);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al cargar los campos personalizados del área",
        variant: "destructive",
      });
    }
  }

  // Campos personalizados y nombre a nivel de ENTIDAD
  // (se cargan haya o no un área seleccionada)
  useEffect(() => {
    if (!selectedEntityId) {
      setEntityCustomFields([]);
      setEntityName("");
      return;
    }

    const fetchEntity = async () => {
      try {
        const response = await fetch(`/api/entities/${selectedEntityId}`);
        if (!response.ok) return;
        const data = await response.json();
        setEntityName(data?.name || "");
        setEntityCustomFields(data?.pqrConfig?.customFields || []);
      } catch (error) {
        console.error("Error al cargar la entidad:", error);
      }
    };

    fetchEntity();
  }, [selectedEntityId]);

  const watchedDepartmentId = form.watch("departmentId");

  // Campos personalizados a nivel de ÁREA (cuando se elige un área)
  useEffect(() => {
    if (watchedDepartmentId) {
      fetchAreaCustomFields(watchedDepartmentId);
    } else {
      setAreaCustomFields([]);
    }
  }, [watchedDepartmentId]);

  // Unión de campos de entidad + área (dedupe por nombre; el área prevalece)
  useEffect(() => {
    const byName = new Map<string, CustomField>();
    for (const field of [...entityCustomFields, ...areaCustomFields]) {
      byName.set(field.name, field);
    }
    setCustomFields(Array.from(byName.values()));
  }, [entityCustomFields, areaCustomFields]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (process.env.NODE_ENV === 'production' && !recaptchaToken) {
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
          creatorId: userId,
          dueDate: new Date(),
          customFields: customFieldsData,
          entityId: selectedEntityId,
          isAnonymous: values.isAnonymous,
          isPrivate: values.isPrivate,
          includePhone: values.includePhone,
          attachments: attachmentsData,
          subject: values.subject,
          description: values.description,
          recaptchaToken: recaptchaToken || null,
          latitude: values.latitude || null,
          longitude: values.longitude || null,
        })
      );

      const response = await createPQRS(formData);

      if (response) {
        toast({
          title: "PQRSD creada",
          description: "La PQRSD ha sido creada exitosamente, la entidad deberá responder pronto.",
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
    entityName,
    currentUser,
    isLoading,
    isLoadingInitial,
    openDepartment,
    setOpenDepartment,
    onSubmit,
    recaptchaToken,
    setRecaptchaToken,
  };
};