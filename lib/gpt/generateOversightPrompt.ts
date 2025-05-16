export const generateOversightPrompt = ({
  fullName,
  oversightEntity,
  entity,
  pqrType,
  pqrDate,
  daysExceeded,
  pqrDescription,
}: {
  fullName: string;
  oversightEntity: string;
  entity: string;
  pqrType: string;
  pqrDate: string;
  daysExceeded: number;
  pqrDescription: string;
}) => `
Redacta un documento formal dirigido al ente de control competente en Colombia, denunciando la vulneración de derechos por falta de respuesta a una PQRSD. El documento debe ser profesional, claro y contener toda la información relevante, usando solo texto plano, sin negritas, sin cursivas, sin formato Markdown, ni símbolos como asteriscos.

- Nombre del solicitante: ${fullName}
- Entidad demandada: ${entity}
- Fecha de radicación de la PQRSD: ${pqrDate}
- Tipo de solicitud: ${pqrType}
- Días hábiles transcurridos sin respuesta: ${daysExceeded}
- Descripción de la solicitud: ${pqrDescription}
- Fecha de la acción del documento: ${new Date().toLocaleDateString('es-CO')}
- Entidad de control competente: ${oversightEntity}

REQUISITOS:
- Lenguaje formal y respetuoso
- Referencia a normas aplicables
- Sin espacio para firma
- Evitar repeticiones innecesarias
- Del solicitante solo se debe incluir el nombre completo
`;