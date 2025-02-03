# Sistema de Gestión de PQRS (PQR Management System)

## 📋 Descripción

Sistema web moderno y escalable para la gestión de Peticiones, Quejas, Reclamos y Sugerencias (PQRS). Permite a los usuarios enviar y dar seguimiento a sus solicitudes, mientras proporciona a las organizaciones herramientas poderosas para su gestión.

## ✨ Características Principales

### 👥 Para Usuarios

- **Creación de PQRS**
  - Formularios dinámicos con campos personalizables
  - Soporte para múltiples tipos de archivos adjuntos
  - Opción de envío anónimo
  - Vista previa de archivos multimedia
  
- **Seguimiento**
  - Estado en tiempo real de las solicitudes
  - Tiempo restante para respuesta
  - Historial de actualizaciones
  - Sistema de notificaciones

- **Interacción**
  - Sistema de "Me gusta" para dar relevancia
  - Comentarios y respuestas
  - Compartir PQRS (si no es privado)

### 👨‍💼 Para Administradores

- **Gestión Organizacional**
  - Creación y administración de entidades
  - Configuración de departamentos y áreas
  - Asignación de roles y permisos

- **Configuración de PQRS**
  - Campos personalizados por departamento
  - Tiempos de respuesta configurables
  - Plantillas de respuesta
  - Reglas de asignación automática

- **Análisis y Reportes**
  - Dashboard con métricas clave
  - Reportes exportables
  - Estadísticas de rendimiento

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Shadcn UI** - Componentes reutilizables
- **Tailwind CSS** - Estilos utilitarios
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### Backend
- **Next.js API Routes** - API REST
- **Prisma ORM** - ORM para base de datos
- **PostgreSQL** - Base de datos principal
- **AWS S3** - Almacenamiento de archivos
- **NextAuth.js** - Autenticación y autorización

## 📁 Estructura del Proyecto

```
├── app/
│   ├── admin/              # Rutas administrativas
│   │   ├── area/          # Gestión de áreas
│   │   ├── entity/        # Gestión de entidades
│   │   └── users/         # Gestión de usuarios
│   ├── api/               # API endpoints
│   ├── dashboard/         # Panel de usuario
│   └── (landing)/         # Páginas públicas
├── components/
│   ├── forms/             # Formularios reutilizables
│   │   ├── area-form.tsx
│   │   ├── new-pqr.tsx
│   │   └── pqr-config-form.tsx
│   ├── ui/               # Componentes base
│   └── pqrs/             # Componentes específicos de PQRS
├── hooks/                # Custom hooks
├── lib/                 # Utilidades y configuraciones
├── prisma/              # Esquema y migraciones
└── services/            # Servicios de API
```

## 🚀 Configuración y Despliegue

### Requisitos Previos
- Node.js 18+
- PostgreSQL 14+
- Cuenta AWS con acceso a S3
- Yarn package manager

### Variables de Entorno
```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/pqrs"

# Autenticación
NEXTAUTH_SECRET="tu-secreto-seguro"
NEXTAUTH_URL="http://localhost:3000"

# AWS S3
AWS_ACCESS_KEY_ID="tu-access-key"
AWS_SECRET_ACCESS_KEY="tu-secret-key"
AWS_REGION="tu-region"
AWS_BUCKET="nombre-del-bucket"

# Configuración de la aplicación
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Sistema PQRS"
```

### Instalación y Ejecución

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/pqrs-system.git

# Instalar dependencias
cd pqrs-system
yarn install

# Configurar la base de datos
yarn prisma generate
yarn prisma db push

# Iniciar en desarrollo
yarn dev

# Construir para producción
yarn build
yarn start
```

## 📡 API Endpoints

### PQRS
```typescript
// Crear PQRS
POST /api/pqr
Body: {
  type: PQRSType
  departmentId: string
  title: string
  description: string
  attachments: Attachment[]
  customFields: CustomField[]
  isAnonymous: boolean
  isPrivate: boolean
}

// Listar PQRS
GET /api/pqr
Query: {
  page?: number
  limit?: number
  status?: PQRSStatus
  departmentId?: string
}

// Más endpoints documentados en /docs/api.md
```

## 🔒 Seguridad

- **Autenticación**
  - JWT con rotación de tokens
  - Protección CSRF
  - Rate limiting

- **Archivos**
  - URLs prefirmadas para S3
  - Validación de tipos MIME
  - Límites de tamaño configurables

- **API**
  - Validación de entrada con Zod
  - Sanitización de datos
  - Logging de accesos


## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

