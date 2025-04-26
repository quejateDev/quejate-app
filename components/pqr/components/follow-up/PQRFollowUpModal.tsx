"use client";

import { FileText, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { typeMap } from "@/constants/pqrMaps";
import { Step1Options } from "./steps/Step1Options";
import { Step3GeneratedDocument } from "./steps/Step3GeneratedDocument";
import { Step2Form } from "./steps/Step2Form";
import { TutelaFormData } from "./types";
import { calculateBusinessDaysExceeded } from "@/utils/dateHelpers";

type PQRFollowUpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pqrType: keyof typeof typeMap;
  pqrData: {
    entity: string;
    description: string;
    createdAt: Date;
  };
};

export function PQRFollowUpModal({
  open,
  onOpenChange,
  pqrType,
  pqrData,
}: PQRFollowUpModalProps) {
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);

  const typeLabel = typeMap[pqrType].label.toLowerCase();

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setStep(2);
  };

  const handleGenerateDocument = async (formData: TutelaFormData) => {
    setIsGenerating(true);
    try {
        const createdAtDate = new Date(pqrData.createdAt);
    if (isNaN(createdAtDate.getTime())) {
      throw new Error("Fecha de creación inválida");
    }
      const daysExceeded = calculateBusinessDaysExceeded(pqrData.createdAt);
      const response = await fetch("/api/legal-docs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          pqrType: pqrType,
          pqrDate: createdAtDate.toISOString().split('T')[0],
          daysExceeded: daysExceeded,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Error al generar el documento");
      }
  
      const data = await response.json();
      setGeneratedDocument(data.tutela);
      setStep(3);
    } catch (error) {
      console.error("Error generating document:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setSelectedOption(null);
    }, 300);
  };

  const renderStepContent = () => {
    const commonProps = {
      pqrType,
      typeLabel,
      onClose: handleClose,
      pqrData,
    };

    switch (step) {
      case 1:
        return <Step1Options {...commonProps} onOptionSelect={handleOptionSelect} />;
      case 2:
        return (
          <Step2Form
            {...commonProps}
            selectedOption={selectedOption}
            isGenerating={isGenerating}
            onGenerateDocument={handleGenerateDocument}
          />
        );
      case 3:
        return (
          <Step3GeneratedDocument
            {...commonProps}
            generatedDocument={generatedDocument}
            onClose={handleClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={step === 3 ? "sm:max-w-3xl max-h-screen overflow-hidden" : "sm:max-w-md"}>
        {step !== 3 && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {step === 1 ? "Seguimiento de PQRSD" : "Generar acción de tutela"}
            </DialogTitle>
          </DialogHeader>
        )}
        
        {renderStepContent()}
        
        {step > 1 && step < 3 && (
          <DialogFooter className="sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={isGenerating}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}