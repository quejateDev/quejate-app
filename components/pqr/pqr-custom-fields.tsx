interface PQRCustomFieldsProps {
  fields: Array<{
    name: string;
    value: string;
  }>;
}

export function PQRCustomFields({ fields }: PQRCustomFieldsProps) {
  if (!fields.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Información Adicional</h3>
      <div className="grid gap-2">
        {fields.map((field) => (
          <div key={field.name}>
            <span className="font-medium">{field.name}:</span>{" "}
            <span className="text-muted-foreground">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 