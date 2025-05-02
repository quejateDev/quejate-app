import { typeMap } from "@/constants/pqrMaps";
import { PQR } from "@/types/pqrsd";

export type PQRType = keyof typeof typeMap;

export type TutelaFormData = {
  fullName: string;
  documentNumber: string;
  city: string;
  department: string;
  rightViolated: string;
  entity: string;
  pqrDescription: string;
};

export type StepProps = {
  pqrType: PQRType;
  typeLabel: string;
  onOptionSelect?: (option: string) => void;
  onGenerateDocument?: (formData: TutelaFormData) => Promise<void>;
  onClose?: () => void;
  selectedOption?: string | null;
  isGenerating?: boolean;
  generatedDocument?: string | null;
  departments?: Array<{ id: string; name: string }>;
  municipalities?: Array<{ id: string; name: string }>;
  onDepartmentChange?: (departmentId: string) => void;
  pqrData?: PQR;
};