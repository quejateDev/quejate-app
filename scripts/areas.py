import pandas as pd
import psycopg2
from urllib.parse import urlparse
import uuid
from datetime import datetime

# Configuración de Supabase
DATABASE_URL = os.getenv("DATABASE_URL")


# Conexión a la base de datos
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

def get_entity_id(cursor, entity_name):
    """Obtener el ID de una entidad por su nombre"""
    cursor.execute('SELECT id FROM public."Entity" WHERE name = %s', (entity_name,))
    result = cursor.fetchone()
    return result[0] if result else None

# Proceso principal
def main():
    print("🔍 Iniciando proceso de importación de departamentos...")
    
    # 1. Validar archivo Excel
    try:
        df = pd.read_excel('EntidadesCategorias.xlsx', sheet_name='Areas')
        required_columns = ['name', 'description', 'email', 'entity']
        assert all(col in df.columns for col in required_columns)
        print(f"✅ Excel válido. {len(df)} registros encontrados.")
    except Exception as e:
        print(f"❌ Error en el Excel: {str(e)}")
        return

    # 2. Procesar cada registro
    conn = get_db_connection()
    cursor = conn.cursor()
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    success_count = 0
    error_count = 0
    
    for _, row in df.iterrows():
        try:
            # Validar campos requeridos
            if pd.isna(row['name']) or str(row['name']).strip() == '':
                print(f"⚠️ Fila {_+2}: Nombre vacío - omitiendo")
                error_count += 1
                continue
                
            if pd.isna(row['entity']) or str(row['entity']).strip() == '':
                print(f"⚠️ Fila {_+2}: Entidad vacía - omitiendo")
                error_count += 1
                continue
                
            if pd.isna(row['email']) or str(row['email']).strip() == '':
                print(f"⚠️ Fila {_+2}: Email vacío - omitiendo")
                error_count += 1
                continue

            # Obtener entityId
            entity_id = get_entity_id(cursor, row['entity'].strip())
            if not entity_id:
                print(f"⚠️ Fila {_+2}: Entidad '{row['entity']}' no encontrada - omitiendo")
                error_count += 1
                continue

            # Preparar datos
            department_id = str(uuid.uuid4())
            name = row['name'].strip()
            description = row['description'].strip() if pd.notna(row['description']) else None
            email = row['email'].strip()

            # Insertar en la base de datos
            cursor.execute(
                """INSERT INTO public."Department" 
                   (id, name, description, "createdAt", "updatedAt", "entityId", email)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                (
                    department_id,
                    name,
                    description,
                    current_time,
                    current_time,
                    entity_id,
                    email
                )
            )
            print(f"✅ {name} - Insertado correctamente")
            success_count += 1
            
        except Exception as e:
            print(f"⚠️ Error procesando fila {_+2}: {str(e)}")
            error_count += 1
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print(f"\n🎉 Proceso completado! Resultados:")
    print(f"  - Correctos: {success_count}")
    print(f"  - Errores: {error_count}")
    print(f"  - Total procesados: {len(df)}")

if __name__ == "__main__":
    main()