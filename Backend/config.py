import os
from dotenv import load_dotenv

load_dotenv()

DB_CONF = {
    'host': os.getenv('PGHOST'),
    'port': int(os.getenv('PGPORT', 5432)),
    'dbname': os.getenv('PGDATABASE'),
    'user': os.getenv('PGUSER'),
    'password': os.getenv('PGPASSWORD'),
}