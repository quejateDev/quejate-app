export const generateOversightPrompt = ({
  fullName,
  oversightEntity,
  entity,
  pqrType,
  pqrDate,
  daysExceeded,
  pqrDescription,
  department,
  city,
}: {
  fullName: string;
  oversightEntity: string;
  entity: string;
  pqrType: string;
  pqrDate: string;
  daysExceeded: number;
  pqrDescription: string;
  department: string;
  city?: string;
}) => `
Redacta un documento formal dirigido a la entidad de control competente en Colombia, en el que se denuncie la presunta vulneración de derechos por la falta de respuesta oportuna a una ${pqrType} presentada ante la entidad ${entity}. El documento debe ser claro, preciso y redactado en lenguaje jurídico formal, con base en las normas que regulan el derecho de petición y la atención de PQRSD en Colombia.

Incluye únicamente texto plano (sin negritas, cursivas, símbolos, ni formato Markdown) y asegúrate de evitar repeticiones innecesarias. No incluyas espacio para firma ni datos adicionales del solicitante aparte del nombre completo.

- Nombre del solicitante: ${fullName}
- Entidad demandada: ${entity}
- Fecha de radicación de la PQRSD: ${pqrDate}
- Tipo de solicitud: ${pqrType}
- Días hábiles transcurridos sin respuesta: ${daysExceeded}
- Descripción de la solicitud: ${pqrDescription}
- Fecha de la acción del documento: ${new Date().toLocaleDateString('es-CO')}
- Entidad de control competente: ${oversightEntity}
- Departamento: ${department}
- Ciudad / Municipio: ${city || "No especificado"}

REQUISITOS:
- Lenguaje formal y respetuoso
- Referencia a las normas legales aplicables (por ejemplo, Artículo 23 de la Constitución, Ley 1755 de 2015)
- Sin espacio para firma
- Evitar repeticiones innecesarias
- Del solicitante solo se debe incluir el nombre completo
`;