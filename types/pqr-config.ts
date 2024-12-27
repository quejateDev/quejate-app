import * as z from "zod";

export const pqrConfigSchema = z.object({
  allowAnonymous: z.boolean().default(false),
  requireEvidence: z.boolean().default(false),
  maxResponseTime: z.string().min(1, "El tiempo de respuesta es requerido"),
  notifyEmail: z.boolean().default(true),
  autoAssign: z.boolean().default(false),
});

export type PQRConfigFormValues = z.infer<typeof pqrConfigSchema>;

export interface PQRConfigFormProps {
  areaId: string;
  initialData?: PQRConfigFormValues;
}

export const PqrFieldsSchema = z.object({
  customFields: z.array(
    z.object({
      name: z.string(),
      required: z.boolean(),
      type: z.enum(["email", "phone", "text", "file"]),
    })
  ),
});

export type PQRFieldsFormValues = {
  customFields: CustomField[];
};

export type CustomField = {
  name: string;
  required: boolean;
  type: "email" | "phone" | "text" | "file";
};
