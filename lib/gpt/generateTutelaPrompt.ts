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
Redacta una acción de tutela completa y específica para Colombia, siguiendo la estructura legal establecida por la jurisprudencia constitucional colombiana, con los siguientes datos. 

INFORMACIÓN DEL CASO:
- Solicitante: ${fullName}
- Documento: ${documentNumber}
- Ubicación: ${city}, ${department}
- Entidad demandada: ${entity}
- Tipo de solicitud: ${pqrType}
- Fecha de radicación PQRSD: ${pqrDate}
- Días transcurridos sin respuesta: ${daysExceeded}
- Derecho fundamental vulnerado: ${rightViolated}
- Descripción del caso: ${pqrDescription}
- Fecha de presentación de la tutela: ${new Date().toLocaleDateString('es-CO')}

INSTRUCCIONES ESPECÍFICAS:
1. Sigue la estructura legal colombiana para acciones de tutela
2. Dirige la tutela al "Juzgado Civil Municipal de ${city}" (no uses indicaciones genéricas)
3. Usa información concreta y específica, nunca pongas texto entre paréntesis con instrucciones
4. Estructura obligatoria según normativa colombiana:
   - SEÑOR JUEZ (encabezado dirigido al juez)
   - Identificación completa del accionante
   - Identificación de la entidad accionada
   - HECHOS (numerados cronológicamente)
   - DERECHOS FUNDAMENTALES VULNERADOS
   - PRETENSIONES (lo que se solicita al juez)
   - FUNDAMENTOS DE DERECHO (marco normativo aplicable)
   - COMPETENCIA (por qué ese juzgado es competente)
   - PROCEDIBILIDAD (requisitos de procedencia de la tutela)
   - SOLICITUD FINAL
5. Al final del documento, incluir la siguiente fórmula de cierre en líneas separadas:
   "Atentamente,"
   "${fullName}"
   "C.C. ${documentNumber}"

CONTEXTO LEGAL COLOMBIANO:
- Constitución Política de Colombia, artículo 86
- Decreto 2591 de 1991 (reglamentario de la tutela)
- El plazo legal para responder PQRSD es de 15 días hábiles (Ley 1755 de 2015)
- Han transcurrido ${daysExceeded} días sin respuesta, configurando vía de hecho por omisión
- Se vulnera el derecho fundamental ${rightViolated}
- La tutela procede contra ${entity} por ser entidad pública/privada que presta servicio público
- Competencia: Juzgado del lugar donde ocurre la vulneración (${city})

FORMATO:
- Solo texto plano, sin markdown, sin negritas, sin cursivas
- No incluir título "Acción de Tutela"
- No incluir sección de firmas
- No usar paréntesis con instrucciones como "(indicar)", "(especificar)", etc.
- Ser completamente específico en todos los datos

EJEMPLO DE LO QUE NO DEBES HACER:
"Juzgado (indicar competente)"
"Entidad (nombre de la entidad)"
"Derecho (especificar derecho)"
Redacta el documento completo usando únicamente la información proporcionada, sin agregar indicaciones genéricas o texto entre paréntesis.
`;