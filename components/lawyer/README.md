# Componentes de Registro de Abogado

Esta carpeta contiene los componentes modulares para el registro de abogados en la aplicación.

## Estructura

```
components/lawyer/
├── index.ts                     # Exportaciones principales
├── LawyerRegistrationForm.tsx   # Formulario principal de registro
├── ProfilePictureUploader.tsx   # Componente para subir foto de perfil
├── SpecialtiesManager.tsx       # Gestor de especialidades
└── VerificationModal.tsx        # Modal de verificación
```

## Hooks

```
hooks/
└── useLawyerRegistration.ts     # Hook personalizado con toda la lógica del formulario
```

## Componentes

### `useLawyerRegistration`
Hook personalizado que maneja toda la lógica del formulario de registro de abogados:
- Estado del formulario
- Validación de documentos
- Verificación con la Rama Judicial
- Envío de datos
- Manejo de errores

### `LawyerRegistrationForm`
Componente principal que renderiza todo el formulario usando los subcomponentes.

### `ProfilePictureUploader`
Componente reutilizable para subir y gestionar la foto de perfil:
- Vista previa de imagen
- Botón de carga
- Opción de remover imagen
- Estado de carga

### `SpecialtiesManager`
Componente para gestionar las especialidades legales:
- Agregar especialidades
- Remover especialidades
- Validación de entrada
- Interfaz intuitiva con chips

### `VerificationModal`
Modal que muestra el resultado de la verificación de la tarjeta profesional.

## Uso

```tsx
import { LawyerRegistrationForm, VerificationModal } from "@/components/lawyer";
import { useLawyerRegistration } from "@/hooks/useLawyerRegistration";

export default function LawyerRegistrationPage() {
  const {
    formData,
    loading,
    verificationModal,
    verificationStatus,
    currentSpecialty,
    documentTypeOptions,
    handleChange,
    handleSelectChange,
    handleFileChange,
    handleAddSpecialty,
    handleRemoveSpecialty,
    handleSubmit,
    setVerificationModal,
    setCurrentSpecialty,
  } = useLawyerRegistration();

  return (
    <>
      <LawyerRegistrationForm
        formData={formData}
        currentSpecialty={currentSpecialty}
        documentTypeOptions={documentTypeOptions}
        loading={loading}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        onFileChange={handleFileChange}
        onCurrentSpecialtyChange={setCurrentSpecialty}
        onAddSpecialty={handleAddSpecialty}
        onRemoveSpecialty={handleRemoveSpecialty}
      />
      
      <VerificationModal
        isOpen={verificationModal}
        verificationStatus={verificationStatus}
        onClose={() => setVerificationModal(false)}
      />
    </>
  );
}
```

## Tipos

Los tipos están centralizados en el hook `useLawyerRegistration.ts`:
- `LawyerFormData`: Estructura de datos del formulario
- `VerificationStatus`: Estado de verificación de la tarjeta profesional
