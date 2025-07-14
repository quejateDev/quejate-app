import pandas as pd
import psycopg2
from psycopg2 import sql
from urllib.parse import urlparse
import uuid
from datetime import datetime
import boto3
from botocore.exceptions import NoCredentialsError
import os
import mimetypes

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_BUCKET = os.getenv("AWS_BUCKET")

# Configurar cliente S3 con ACL público
s3 = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
    config=boto3.session.Config(signature_version='s3v4')
)

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
                'ACL': 'public-read'  # Esto hace que el objeto sea público
            }
        )
        
        return f"https://{bucket_name}.s3.{AWS_REGION}.amazonaws.com/{s3_key}"
    except Exception as e:
        print(f"⚠️ Error subiendo {file_path}: {str(e)}")
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

def main():
    print("🔍 Iniciando proceso de importación...")
    # 1. Validar archivo Excel
    try:
        df = pd.read_excel('EntidadesCategorias.xlsx', sheet_name='Categorias')
        required_columns = ['nombre', 'descripcion', 'imageUrl']
        assert all(col in df.columns for col in required_columns)
        print(f"✅ Excel válido. {len(df)} registros encontrados.")
    except Exception as e:
        print(f"❌ Error en el Excel: {str(e)}")
        return

    # 2. Procesar cada registro
    conn = get_db_connection()
    cursor = conn.cursor()
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    for _, row in df.iterrows():
        category_id = str(uuid.uuid4())
        image_url = None
        
        # Procesar imagen solo si hay nombre de archivo
        if pd.notna(row['imageUrl']) and str(row['imageUrl']).strip():
            image_name = str(row['imageUrl']).strip()
            local_path = os.path.join('json-icons', image_name)
            s3_key = f"categories/{category_id}/{image_name}"
            
            if os.path.exists(local_path):
                image_url = upload_to_s3(local_path, AWS_BUCKET, s3_key)
                status = image_url or "❌ Fallo al subir"
            else:
                status = "❌ Archivo local no encontrado"
            
            print(f"🖼️ {row['nombre']}: {status}")
        
        # Insertar en la base de datos
        try:
            cursor.execute(
                """INSERT INTO public."Category" 
                   (id, name, description, "createdAt", "updatedAt", "imageUrl")
                   VALUES (%s, %s, %s, %s, %s, %s)
                   ON CONFLICT (name) DO NOTHING""",
                (
                    category_id,
                    row['nombre'].strip(),
                    row['descripcion'] if pd.notna(row['descripcion']) else None,
                    current_time,
                    current_time,
                    image_url
                )
            )
            print(f"✅ {row['nombre']} - Insertado correctamente")
        except Exception as e:
            print(f"⚠️ Error insertando {row['nombre']}: {str(e)}")
    
    conn.commit()
    cursor.close()
    conn.close()
    print("🎉 Proceso completado!")

if __name__ == "__main__":
    main()