# PQR Follow-up Modal - Refactored Structure

Este directorio contiene la lógica refactorizada del modal de seguimiento de PQR, separada en múltiples archivos para mejor organización y mantenibilidad.

## Estructura de Archivos

### 📁 components/
Componentes UI reutilizables y específicos:

- **ActionButton.tsx** - Botón de acción con icono animado
- **FollowUpOptionsList.tsx** - Lista de opciones de seguimiento según el tipo de PQR
- **MainOptionsView.tsx** - Vista principal con opciones de seguimiento
- **TutelaFormView.tsx** - Vista del formulario de tutela
- **DocumentExportView.tsx** - Vista de exportación de documentos

### 📁 hooks/
Hooks personalizados para lógica de estado:

- **usePQRFollowUp.ts** - Hook principal que maneja todo el estado y lógica del modal

### 📁 services/
Servicios para llamadas a la API:

- **pqrFollowUpService.ts** - Servicio que encapsula todas las llamadas a la API

### 📁 constants/
Constantes y configuraciones:

- **followUpOptions.ts** - Configuración de opciones de seguimiento y mapeo por tipo de PQR

### 📄 Archivos principales:
- **PQRFollowUpModal.tsx** - Modal original
- **index.ts** - Archivo barrel para exportaciones
- **types.ts** - Tipos TypeScript (ya existente)

## Beneficios de la Refactorización

### ✅ Separación de Responsabilidades
- **UI Components**: Solo se encargan de la presentación
- **Business Logic**: Separada en hooks y servicios
- **API Calls**: Centralizadas en servicios
- **Configuration**: Separada en constantes

### ✅ Reutilización
- Componentes pueden ser reutilizados en otras partes de la aplicación
- Servicios pueden ser utilizados en otros contextos
- Hook puede ser utilizado en diferentes componentes

### ✅ Mantenibilidad
- Cada archivo tiene una responsabilidad específica
- Más fácil encontrar y modificar código específico
- Tests más fáciles de escribir para cada parte

### ✅ Legibilidad
- Archivos más pequeños y enfocados
- Lógica más clara y fácil de entender
- Mejor organización del código

## Uso

```tsx
import { PQRFollowUpModal } from "@/components/pqr/follow-up";

// O importar componentes específicos
import { 
  usePQRFollowUp, 
  ActionButton, 
  pqrFollowUpService 
} from "@/components/pqr/follow-up";
```

## Generación de Documentación
Para generar los documentos como tutelas y otros documentos relacionados, puedes utilizar el servicio `pqrFollowUpService` que encapsula la lógica de generación y exportación de documentos.

La generación la hace el backend unificado (`quejate-backend`, módulo `legal`, Tarea 10). El servicio
llama a `POST /api/legal-docs/document` en el mismo origen, y esa ruta reenvía al backend con la
cookie de sesión.

Antes se usaba una Lambda de AWS invocada **desde el navegador**, porque una función de Vercel en el
plan Hobby cortaba a los 10 segundos. Esa URL iba en el bundle público, sin sesión ni límite (H-25).
Hoy el techo de 10 s se evita declarando `maxDuration = 60` en las dos rutas de `app/api/legal-docs`.

No hace falta ninguna variable de entorno en la web: `OPENAI_API_KEY` vive solo en el backend.



