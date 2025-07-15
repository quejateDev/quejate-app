
# SCRIPTS DE CARGA DE DATOS - MANUAL DE USO

## DESCRIPCION

Estos scripts permiten cargar datos de forma automatizada desde archivos CSV/Excel a una base de datos Supabase, incluyendo el manejo de relaciones entre tablas y la subida de archivos a AWS S3.

---

## SCRIPTS DISPONIBLES

### departamentosMunicipios.py

- Carga datos geográficos (departamentos y municipios)
- Requiere archivo CSV con estructura específica
- Valida y evita duplicados

### entities.py

- Importa entidades desde Excel
- Sube imágenes asociadas a AWS S3
- Establece relaciones con categorías y ubicaciones
- Maneja transformación de datos complejos

### oversightEntities.py

- Carga entidades de supervisión
- Valida consistencia de datos
- Gestiona relaciones con otras tablas

---

## REQUISITOS PREVIOS

- Tener instalado Python 3.8 o superior
- Credenciales de acceso a:
  - Supabase (URL y API Key)
  - AWS S3 (Access Key y Secret)
- Archivos de datos en la carpeta `/data` con los nombres exactos
- Archivos de los iconos en la carpeta `/icons` con los nombres exactos

---

## CONFIGURACION

1. Instalar dependencias
2. Crear archivo `.env` con:
   ```env
   SUPABASE_URL="tu_url"
   SUPABASE_KEY="tu_key"
   AWS_ACCESS_KEY_ID="tu_key_aws"
   AWS_SECRET_ACCESS_KEY="tu_secret_aws"
   S3_BUCKET="nombre_bucket"
   ```

---

## INSTRUCCIONES DE USO

1. Preparar los archivos de datos:
   - Verificar que tengan las columnas requeridas
   - Colocarlos en la carpeta `/data`
2. Ejecutar los scripts en orden:
   ```bash
   python departamentosMunicipios.py
   python entities.py
   python oversightEntities.py
   ```

---

## NOTAS IMPORTANTES

- Los nombres de columnas en los archivos deben coincidir exactamente con los esperados por los scripts
- Antes de ejecutar, verificar que las tablas en Supabase tengan la estructura correcta
- Para problemas con AWS S3, revisar permisos del bucket
- En caso de errores, los scripts generan logs detallados