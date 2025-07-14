
import os
import pandas as pd
import psycopg2
from psycopg2 import sql
from urllib.parse import urlparse

# 1. Configurar conexión usando tu URL
DATABASE_URL = os.getenv("DATABASE_URL")

# Extraer componentes de la URL
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

print("🔍 Validando estructura del CSV...")
try:
    df = pd.read_csv('Departamentos_y_Municipios_de_Colombia_20250621.csv')
    required_columns = ['REGION', 'CÓDIGO DANE DEL DEPARTAMENTO', 'DEPARTAMENTO', 'CÓDIGO DANE DEL MUNICIPIO', 'MUNICIPIO']
    assert all(col in df.columns for col in required_columns), "❌ Faltan columnas requeridas"
    print(f"✅ CSV válido. Registros encontrados: {len(df)}")
except Exception as e:
    print(f"❌ Error en CSV: {str(e)}")
    exit()


print("🟡 Iniciando proceso de carga...")
# 4. Insertar departamentos
for _, row in df[['CÓDIGO DANE DEL DEPARTAMENTO', 'DEPARTAMENTO']].drop_duplicates().iterrows():
    cursor.execute(
        sql.SQL("""
        INSERT INTO public."RegionalDepartment" (id, name)
        VALUES (%s, %s)
        ON CONFLICT (id) DO NOTHING
        """),
        (row['CÓDIGO DANE DEL DEPARTAMENTO'], row['DEPARTAMENTO'].upper())
    )

# 5. Insertar municipios
for _, row in df.iterrows():
    cursor.execute(
        sql.SQL("""
        INSERT INTO public."Municipality" (id, name, "regionalDepartmentId")
        VALUES (%s, %s, %s)
        ON CONFLICT (id) DO NOTHING
        """),
        (row['CÓDIGO DANE DEL MUNICIPIO'], row['MUNICIPIO'].upper(), row['CÓDIGO DANE DEL DEPARTAMENTO'])
    )

conn.commit()
cursor.close()
conn.close()
print("✅ Datos cargados a Supabase correctamente!")