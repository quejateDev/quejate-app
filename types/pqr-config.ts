import * as z from "zod";

export const pqrConfigSchema = z.object({
  allowAnonymous: z.boolean().default(false),
  requireEvidence: z.boolean().default(false),
  maxResponseTime: z.string().min(1, "El tiempo de respuesta es requerido"),
  notifyEmail: z.boolean().default(true),
  autoAssign: z.boolean().default(false),
  // customFields: z
  //   .array(
  //     z.object({
  //       name: z.string().min(1, "El nombre es requerido"),
  //       required: z.boolean(),
  //       type: z.enum(["email", "phone", "text", "file"]),
  //     })
  //   )
  //   .default([]),
});

export type PQRConfigFormValues = z.infer<typeof pqrConfigSchema>;

export interface PQRConfigFormProps {
  areaId: string;
  initialData?: PQRConfigFormValues;
}

export type CustomField = {
  name: string;
  required: boolean;
  type: "email" | "phone" | "text" | "file";
};
