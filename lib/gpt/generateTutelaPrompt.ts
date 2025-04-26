export const generateTutelaPrompt = ({
  fullName,
  documentNumber,
  city,
  department,
  rightViolated,
  entity,
  pqrType,
  pqrDate,
  daysExceeded,
  pqrDescription,
}: {
  fullName: string;
  documentNumber: string;
  city: string;
  department: string;
  rightViolated: string;
  entity: string;
  pqrType: string;
  pqrDate: string;
  daysExceeded: number;
  pqrDescription: string;
}) => `
Redacta una acción de tutela en Colombia teniendo en cuenta los siguientes datos, usando **solo texto plano**, sin negritas, sin cursivas, sin formato Markdown, ni símbolos como asteriscos (*).

- Nombre del solicitante: ${fullName}
- Documento de identidad: ${documentNumber}
- Ciudad y departamento: ${city}, ${department}
- Derecho fundamental vulnerado: ${rightViolated}
- Entidad demandada: ${entity}
- Fecha de radicación de la PQRSD: ${pqrDate}
- Tipo de solicitud: ${pqrType}
- Días hábiles transcurridos sin respuesta: ${daysExceeded}
- Descripción de la solicitud: ${pqrDescription}
- Fecha de la acción de tutela: ${new Date().toLocaleDateString('es-CO')}

La tutela debe estar orientada a proteger el derecho fundamental de petición por la falta de respuesta en el tiempo legal (15 días hábiles). Especifica los hechos, derechos vulnerados, pretensiones y solicita respuesta inmediata.

Al final del documento, incluye una sección para la firma del solicitante que diga:

"Firma del solicitante:

___________________________
${fullName}
C.C. ${documentNumber}"
`;
