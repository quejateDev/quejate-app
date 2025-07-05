import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, ChevronLeft } from "lucide-react";
import { TutelaFormGenerator } from "./TutelaFormGenerator";
import { PQR } from "@/types/pqrsd";
import { TutelaFormData } from "../types";

type TutelaFormViewProps = {
  pqrData: PQR;
  isLoading: boolean;
  onGenerateDocument: (formData: TutelaFormData) => void;
  onClose: () => void;
};

export function TutelaFormView({
  pqrData,
  isLoading,
  onGenerateDocument,
  onClose,
}: TutelaFormViewProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generar acción de tutela
        </DialogTitle>
      </DialogHeader>
      <TutelaFormGenerator
        onGenerateDocument={onGenerateDocument}
        isGenerating={isLoading}
        onClose={onClose}
        pqrData={pqrData}
      />
      <DialogFooter className="sm:justify-start">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </DialogFooter>
    </>
  );
}
