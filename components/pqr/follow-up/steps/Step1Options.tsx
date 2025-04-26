import { FileText, ChevronRight } from "lucide-react";
import type { StepProps } from "../types";

export function Step1Options({ pqrType, typeLabel, onOptionSelect }: StepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Selecciona el tipo de seguimiento que deseas realizar para tu {typeLabel}.
      </p>
      
      <div className="grid grid-cols-1 gap-3">
        {pqrType === "PETITION" || pqrType === "CLAIM" ? (
          <>
            <button
              onClick={() => onOptionSelect?.("tutela")}
              className="flex items-center justify-between p-4 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Generar acción de tutela</span>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-600" />
            </button>
            
            <button
              onClick={() => onOptionSelect?.("abogado")}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Contactar abogado</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              Para {typeLabel === "queja" ? "quejas" : "denuncias"}, el seguimiento 
              consiste en enviar pruebas adicionales a la entidad correspondiente.
              Pronto habilitaremos esta funcionalidad.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}