import os
import pandas as pd
import psycopg2
from psycopg2 import sql
from urllib.parse import urlparse
import uuid
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL")


url = urlparse(DATABASE_URL)

# 2. Conectar con SSL
conn = psycopg2.connect(
    host=url.hostname,
    port=url.port,
    dbname=url.path[1:],
    user=url.username,
    password=url.password,
    sslmode="require"
)
cursor = conn.cursor()

# Validar estructura del Excel
print("🔍 Validando estructura del Excel...")
try:
    # Leer el archivo Excel (xlsx) y la hoja específica
    df = pd.read_excel('EntidadesCategorias.xlsx', sheet_name='EntesControl')
    
    # Verificar columnas requeridas (nombre, email, descripcion)
    required_columns = ['nombre', 'email', 'descripcion']
    assert all(col in df.columns for col in required_columns), "❌ Faltan columnas requeridas en el Excel"
    
    # Verificar que no haya nombres duplicados en el Excel
    assert not df['nombre'].duplicated().any(), "❌ Hay nombres duplicados en el Excel"
    
    print(f"✅ Excel válido. Registros encontrados: {len(df)}")
except Exception as e:
    print(f"❌ Error en el archivo Excel: {str(e)}")
    exit()

# Proceso de carga
print("🟡 Iniciando proceso de carga...")
current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

for _, row in df.iterrows():
    # Generar un UUID para el ID
    entity_id = str(uuid.uuid4())
    
    try:
        cursor.execute(
            sql.SQL("""
            INSERT INTO public."OversightEntity" 
                (id, name, email, phone, description, "createdAt", "updatedAt")
            VALUES 
                (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (name) DO NOTHING
            """),
            (
                entity_id,
                row['nombre'].strip(),  # Eliminar espacios en blanco
                row['email'].strip().lower() if pd.notna(row['email']) else None,
                None,  # phone no está en el Excel
                row['descripcion'] if pd.notna(row['descripcion']) else None,
                current_time,
                current_time
            )
        )
    except Exception as e:
        print(f"⚠️ Error insertando registro {row['nombre']}: {str(e)}")
        continue

conn.commit()
cursor.close()
conn.close()
print("✅ Datos de entidades de control cargados a Supabase correctamente!")