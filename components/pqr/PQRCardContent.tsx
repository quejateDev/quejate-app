type PQRCardContentProps = {
    pqr: {
      subject?: string | null;
      description?: string | null;
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
    <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-md">
        {pqr.subject || "Sin título"}
        </h1>
        <p className="text-xs text-muted-foreground mb-5">
        Entidad: {pqr.department.entity.name}
        </p>
        <p className="text-sm">
        {pqr.description || "Sin descripción"}
        </p>

        <div className="flex flex-col  gap-2">
          {pqr.customFieldValues.map((field) => (
            <div key={field.name} className="text-xs text-muted-foreground">
              {field.name}: {field.value}
            </div>
          ))}
        </div>
    </div>
    </div>
);
}