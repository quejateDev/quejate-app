import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Building2, Mail, Phone, MapPin } from "lucide-react";
import { OversightEntity } from "../types";
import { formatText } from "@/utils/formatText";

type OversightEntityListViewProps = {
  entities: OversightEntity[];
  isLoading: boolean;
  error: string | null;
  onEntitySelect: (entity: OversightEntity) => void;
  onBack: () => void;
};

export function OversightEntityListView({
  entities,
  isLoading,
  error,
  onEntitySelect,
  onBack,
}: OversightEntityListViewProps) {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Entes de Control</h2>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Entes de Control</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={onBack}>Volver</Button>
        </div>
      </div>
    );
  }

  if (entities.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Entes de Control</h2>
        </div>
        <div className="text-center py-8">
          <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            No se encontraron entes de control disponibles para tu ubicación.
          </p>
          <Button onClick={onBack}>Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Selecciona un Ente de Control</h2>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">
          Selecciona el ente de control ante el cual deseas escalar tu solicitud.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Importante:</strong> Al seleccionar un ente de control, se generará automáticamente 
            un documento oficial para presentar tu caso. Este documento incluirá todos los detalles 
            de tu solicitud.
          </p>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {entities.map((entity) => (
          <Card 
            key={entity.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onEntitySelect(entity)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-2">{entity.name}</h3>
                  
                  {entity.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {entity.description}
                    </p>
                  )}
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{entity.email}</span>
                    </div>
                    
                    {entity.phone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{entity.phone}</span>
                      </div>
                    )}
                    
                    {(entity.Municipality || entity.RegionalDepartment) && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {entity.Municipality?.name && `${formatText(entity.Municipality.name)}, `}
                          {formatText(entity.RegionalDepartment?.name)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button size="sm" className="ml-4">
                  Seleccionar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
