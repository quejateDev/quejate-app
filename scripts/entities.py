import pandas as pd
import psycopg2
from psycopg2 import sql
from urllib.parse import urlparse
import uuid
from datetime import datetime
import boto3
import os
import mimetypes

# Configuración AWS
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_BUCKET = os.getenv("AWS_BUCKET")


# Configurar cliente S3
s3 = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
    config=boto3.session.Config(signature_version='s3v4')
)

# Configuración Supabase
DATABASE_URL = os.getenv("DATABASE_URL")

def upload_to_s3(file_path, bucket_name, s3_key):
    try:
        content_type = mimetypes.guess_type(file_path)[0] or 'binary/octet-stream'
        s3.upload_file(
            file_path,
            bucket_name,
            s3_key,
            ExtraArgs={
                'ContentType': content_type,
                'ACL': 'public-read'
            }
        )
        return f"https://{bucket_name}.s3.{AWS_REGION}.amazonaws.com/{s3_key}"
    except Exception as e:
        print(f"⚠️ Error subiendo imagen: {str(e)}")
        return None

def get_db_connection():
    url = urlparse(DATABASE_URL)
    return psycopg2.connect(
        host=url.hostname,
        port=url.port,
        dbname=url.path[1:],
        user=url.username,
        password=url.password,
        sslmode="require"
    )

def get_id_from_name(table, name, cursor):
    if pd.isna(name):
        return None
    try:
        # Limpiar el nombre: eliminar espacios y convertir a formato consistente
        cleaned_name = str(name).strip()
        
        # Búsqueda insensible a mayúsculas/minúsculas
        if table == '"Category"':  # Caso especial para Category
            cursor.execute(
                """SELECT id FROM public."Category" 
                   WHERE name ILIKE %s""",
                (cleaned_name,)
            )
        else:
            cursor.execute(
                sql.SQL("SELECT id FROM public.{} WHERE name ILIKE %s").format(sql.Identifier(table)),
                (cleaned_name,)
            )
        
        result = cursor.fetchone()
        return result[0] if result else None
    except Exception as e:
        print(f"⚠️ Error buscando '{name}' en {table}: {str(e)}")
        return None

def clean_string(value):
    if pd.isna(value):
        return None
    return str(value).strip()

def main():
    print("🚀 Iniciando importación de entidades...")
    
    # 1. Cargar y validar Excel
    try:
        df = pd.read_excel('EntidadesCategorias.xlsx', sheet_name='Entidades')
        required_columns = ['nombre', 'descripcion', 'categoria', 'imageUrl', 'email', 'departamento', 'municipio']
        assert all(col in df.columns for col in required_columns)
        
        # Convertir todas las columnas de texto a string y limpiar
        text_columns = ['nombre', 'descripcion', 'categoria', 'imageUrl', 'email', 'departamento', 'municipio']
        for col in text_columns:
            df[col] = df[col].apply(clean_string)
        
        print(f"✅ Excel válido. {len(df)} entidades encontradas.")
    except Exception as e:
        print(f"❌ Error en el Excel: {str(e)}")
        return

    # 2. Procesar cada entidad
    conn = get_db_connection()
    cursor = conn.cursor()
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    for index, row in df.iterrows():
        entity_id = str(uuid.uuid4())
        image_url = None
        
        print(f"\n📌 Procesando fila {index+1}: {row['nombre']}")
        
        # Subir imagen si existe
        if row['imageUrl'] and not pd.isna(row['imageUrl']):
            local_path = os.path.join('icons-entities', row['imageUrl'])
            s3_key = f"entities/{entity_id}/{row['imageUrl']}"
            
            if os.path.exists(local_path):
                image_url = upload_to_s3(local_path, AWS_BUCKET, s3_key)
                print(f"  🖼️ Imagen: {'✅ Subida' if image_url else '❌ Fallo'}")
            else:
                print(f"  ⚠️ Archivo no encontrado: {local_path}")
        
        # Obtener IDs de relaciones con manejo de errores
        category_id = get_id_from_name('Category', row['categoria'], cursor)
        dept_id = get_id_from_name('RegionalDepartment', row['departamento'], cursor)
        muni_id = get_id_from_name('Municipality', row['municipio'], cursor)
        
        # Verificar relaciones requeridas
        if not category_id:
            print(f"  ❌ Categoría no encontrada: {row['categoria']}")
            continue
            
        if not dept_id and row['departamento']:
            print(f"  ⚠️ Departamento no encontrado: {row['departamento']}")
            
        if not muni_id and row['municipio']:
            print(f"  ⚠️ Municipio no encontrado: {row['municipio']}")
        
        # Insertar entidad
        try:
            cursor.execute(
                """INSERT INTO public."Entity"
                   (id, name, description, "createdAt", "updatedAt", "categoryId",
                    "imageUrl", email, "municipalityId", "regionalDepartmentId", "isVerified")
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (
                    entity_id,
                    row['nombre'],
                    row['descripcion'],
                    current_time,
                    current_time,
                    category_id,
                    image_url,
                    row['email'].lower() if row['email'] else None,
                    muni_id,
                    dept_id,
                    False  # isVerified por defecto
                )
            )
            print(f"  ✅ Insertada correctamente")
        except Exception as e:
            print(f"  ❌ Error insertando: {str(e)}")
            continue
    
    conn.commit()
    cursor.close()
    conn.close()
    print("\n🎉 Proceso completado!")

if __name__ == "__main__":
    main()