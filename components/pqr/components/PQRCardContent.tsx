type PQRCardContentProps = {
    pqr: {
      customFieldValues: {
        name: string;
        value: string;
      }[];
      department: {
        entity: {
          name: string;
        };
      };
    };
  };
  
export function PQRCardContent({ pqr }: PQRCardContentProps) {
return (
    <div className="space-y-4">
    <div>
        <h1 className="font-semibold text-md">
        {pqr.customFieldValues.find(
            (field) => field.name === "Título" || "Titulo"
        )?.value || "No Title"}
        </h1>
        <p className="text-xs text-muted-foreground mb-5">
        Entidad: {pqr.department.entity.name}
        </p>
        <p className="text-sm">
        {pqr.customFieldValues.find((field) => field.name === "Descripción")
            ?.value || "No Description"}
        </p>
    </div>
    </div>
);
}