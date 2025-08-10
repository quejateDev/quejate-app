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


## Modelos 
model User {
  id                String              @id @default(uuid())
  password          String
  name         String
  email             String              @unique
  phone             String
  role              UserRole
  ...
  givenRatings      Rating[]            @relation("ClientGivenRatings")
  lawyerRequests    LawyerRequest[]
  lawyerProfile     Lawyer?   

}

- Los usuarios pueden tener un perfil de abogado opcional, lo que permite que un usuario sea tanto un cliente como un abogado.
- Los usuarios pueden calificar abogados, lo que se maneja a través del modelo `Rating`.
- Los usuarios pueden enviar solicitudes a abogados, lo que se maneja a través del modelo `LawyerRequest`.

model Lawyer {
  id              String     @id @default(uuid())
  userId          String     @unique
  user            User       @relation(fields: [userId], references: [id])
  documentType     DocumentType
  identityDocument String
  specialties     String[]
  description     String?
  feePerHour      Float?
  feePerService   Float?
  receivedRatings Rating[]   @relation("LawyerReceivedRatings")
  lawyerRequests  LawyerRequest[]
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  @@index([userId])
}

- Los abogados tienen calificaciones recibidas, lo que se maneja a través del modelo `Rating`.
- Los abogados pueden recibir solicitudes de los usuarios, lo que se maneja a través del modelo `LawyerRequest`.


model LawyerRequest {
  id          String                @id @default(uuid())
  userId      String
  lawyerId    String
  pqrId       String?
  message     String
  serviceType String?
  status      LawyerRequestStatus   @default(PENDING)
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt
  
  user        User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
  lawyer      Lawyer                @relation(fields: [lawyerId], references: [id], onDelete: Cascade)
  pqr         PQRS?                 @relation(fields: [pqrId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([lawyerId])
  @@index([pqrId])
}

- Las solicitudes incluyen un mensaje, pqr, estado y usuario que las realiza.

model Rating {
  id         String   @id @default(uuid())
  lawyerId   String
  lawyer     Lawyer   @relation(fields: [lawyerId], references: [id], name: "LawyerReceivedRatings")
  clientId   String
  client    User      @relation(fields: [clientId], references: [id], name: "ClientGivenRatings")
  score      Int      
  createdAt  DateTime @default(now())

  @@unique([lawyerId, clientId])
  @@index([lawyerId])
  @@index([clientId])
}

- Las calificaciones incluyen un puntaje y referencias al abogado y al cliente que las realizan.