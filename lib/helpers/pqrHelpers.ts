export const getCustomFieldValue = (
  fields: { name: string; value: string }[],
  ...possibleNames: string[]
): string => {
  if (!fields || !Array.isArray(fields)) return "";

  const lowerNames = possibleNames.map((name) => name.toLowerCase().trim());
  const foundField = fields.find((field) =>
    lowerNames.some((name) => field.name.toLowerCase().trim().includes(name))
  );

  return foundField?.value || "";
};

export const getPQRDescription = (
  fields: { name: string; value: string }[]
): string => {
  return getCustomFieldValue(
    fields,
    "Descripción",
    "Descripcion",
    "Description",
    "Detalle"
  );
};
