import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";

type OversightDocumentLoadingViewProps = {
  oversightEntityName: string;
  onBack: () => void;
};

export function OversightDocumentLoadingView({
  oversightEntityName,
  onBack,
}: OversightDocumentLoadingViewProps) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Generando Documento</h2>
      </div>

      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <FileText className="h-16 w-16 text-blue-600" />
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin absolute -bottom-1 -right-1" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          Generando documento para {oversightEntityName}
        </h3>
        
        <p className="text-muted-foreground mb-4">
          Estamos preparando el documento oficial para presentar ante el ente de control seleccionado.
          Este proceso puede tomar unos momentos.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-blue-800">
            El documento incluirá toda la información relevante de tu solicitud y 
            los datos necesarios para el proceso de escalamiento.
          </p>
        </div>
      </div>
    </div>
  );
}
