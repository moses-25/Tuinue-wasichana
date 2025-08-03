#!/usr/bin/env python3
"""
Automatic Database Migration System
Detects model changes and applies schema updates automatically
"""

import os
import sys
import logging
from sqlalchemy import create_engine, text, inspect, MetaData, Table, Column
from sqlalchemy.exc import OperationalError, ProgrammingError
import psycopg2
from psycopg2 import sql

# Add the Backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DatabaseMigrator:
    def __init__(self, database_url):
        self.database_url = database_url
        self.engine = create_engine(database_url)
        self.inspector = inspect(self.engine)
        
    def get_model_columns(self):
        """Get expected columns from all models"""
        from app import create_app
        from app.services.database import db
        
        # Import all models to ensure they're registered
        from app.models.user import User
        from app.models.charity import Charity
        from app.models.charity_application import CharityApplication
        from app.models.donation import Donation
        from app.models.payment import Payment
        from app.models.story import Story
        from app.models.beneficiary import Beneficiary
        from app.models.inventory import Inventory
        from app.models.reminder import Reminder
        
        app = create_app()
        
        with app.app_context():
            model_columns = {}
            
            # Get all tables from SQLAlchemy metadata
            for table_name, table in db.metadata.tables.items():
                columns = {}
                for column in table.columns:
                    columns[column.name] = {
                        'type': str(column.type),
                        'nullable': column.nullable,
                        'default': str(column.default) if column.default else None,
                        'primary_key': column.primary_key,
                        'foreign_key': bool(column.foreign_keys)
                    }
                model_columns[table_name] = columns
                
            return model_columns
    
    def get_database_columns(self):
        """Get actual columns from database"""
        database_columns = {}
        
        try:
            table_names = self.inspector.get_table_names()
            
            for table_name in table_names:
                columns = {}
                db_columns = self.inspector.get_columns(table_name)
                
                for column in db_columns:
                    columns[column['name']] = {
                        'type': str(column['type']),
                        'nullable': column['nullable'],
                        'default': str(column['default']) if column['default'] else None,
                        'primary_key': column.get('primary_key', False)
                    }
                
                database_columns[table_name] = columns
                
        except Exception as e:
            logger.warning(f"Could not inspect database: {e}")
            
        return database_columns
    
    def detect_missing_columns(self, model_columns, db_columns):
        """Detect columns that exist in models but not in database"""
        missing_columns = {}
        
        for table_name, model_cols in model_columns.items():
            if table_name not in db_columns:
                # Entire table is missing
                missing_columns[table_name] = {'table_missing': True, 'columns': model_cols}
                continue
                
            db_cols = db_columns[table_name]
            table_missing = {}
            
            for col_name, col_info in model_cols.items():
                if col_name not in db_cols:
                    table_missing[col_name] = col_info
                    
            if table_missing:
                missing_columns[table_name] = {'table_missing': False, 'columns': table_missing}
                
        return missing_columns
    
    def generate_alter_statements(self, missing_columns):
        """Generate SQL ALTER statements for missing columns"""
        statements = []
        
        for table_name, info in missing_columns.items():
            if info.get('table_missing'):
                logger.info(f"Table {table_name} is missing - will be created by SQLAlchemy")
                continue
                
            for col_name, col_info in info['columns'].items():
                # Map SQLAlchemy types to PostgreSQL types
                pg_type = self.map_sqlalchemy_to_postgres_type(col_info['type'])
                
                # Build ALTER TABLE statement
                alter_stmt = f"ALTER TABLE {table_name} ADD COLUMN {col_name} {pg_type}"
                
                # Add constraints
                if not col_info['nullable']:
                    if col_info['default'] and col_info['default'] != 'None':
                        default_val = self.extract_default_value(col_info['default'], pg_type)
                        alter_stmt += f" DEFAULT {default_val} NOT NULL"
                    else:
                        # For NOT NULL columns without default, add a sensible default
                        default_val = self.get_default_value_for_type(pg_type)
                        alter_stmt += f" DEFAULT {default_val} NOT NULL"
                else:
                    if col_info['default'] and col_info['default'] != 'None':
                        default_val = self.extract_default_value(col_info['default'], pg_type)
                        alter_stmt += f" DEFAULT {default_val}"
                
                statements.append(alter_stmt)
                logger.info(f"Will add column: {table_name}.{col_name} ({pg_type})")
                
        return statements
    
    def map_sqlalchemy_to_postgres_type(self, sqlalchemy_type):
        """Map SQLAlchemy types to PostgreSQL types"""
        type_mapping = {
            'INTEGER': 'INTEGER',
            'VARCHAR': 'VARCHAR(255)',
            'TEXT': 'TEXT',
            'DATETIME': 'TIMESTAMP',
            'BOOLEAN': 'BOOLEAN',
            'FLOAT': 'REAL',
            'DECIMAL': 'DECIMAL',
        }
        
        # Handle VARCHAR with length
        if 'VARCHAR(' in sqlalchemy_type:
            return sqlalchemy_type
            
        # Handle ENUM types
        if 'ENUM' in sqlalchemy_type:
            return 'VARCHAR(50)'  # Fallback for enums
            
        # Get base type
        base_type = sqlalchemy_type.split('(')[0].upper()
        return type_mapping.get(base_type, 'TEXT')
    
    def extract_default_value(self, default_str, pg_type):
        """Extract actual default value from SQLAlchemy default string"""
        if not default_str or default_str == 'None':
            return self.get_default_value_for_type(pg_type)
        
        # Handle ColumnDefault wrapper
        if 'ColumnDefault(' in default_str:
            # Extract the value inside ColumnDefault(value) or ColumnDefault('value')
            start_paren = default_str.find('(') + 1
            end_paren = default_str.rfind(')')
            
            if start_paren > 0 and end_paren > start_paren:
                inner_value = default_str[start_paren:end_paren].strip()
                
                # Handle quoted strings: ColumnDefault('Kenya')
                if inner_value.startswith("'") and inner_value.endswith("'"):
                    value = inner_value[1:-1]  # Remove quotes
                    # For string values, wrap in quotes
                    if 'VARCHAR' in pg_type or 'TEXT' in pg_type:
                        return f"'{value}'"
                    else:
                        return value
                
                # Handle numeric values: ColumnDefault(10000)
                elif inner_value.isdigit() or (inner_value.replace('.', '').replace('-', '').isdigit()):
                    return inner_value
                
                # Handle other values
                else:
                    if 'VARCHAR' in pg_type or 'TEXT' in pg_type:
                        return f"'{inner_value}'"
                    else:
                        return inner_value
        
        # Handle direct string values
        if default_str.startswith("'") and default_str.endswith("'"):
            return default_str
        
        # Handle numeric values
        if default_str.isdigit() or (default_str.replace('.', '').replace('-', '').isdigit()):
            return default_str
        
        # Handle boolean values
        if default_str.lower() in ['true', 'false']:
            return default_str.upper()
        
        # For string types, ensure quotes
        if 'VARCHAR' in pg_type or 'TEXT' in pg_type:
            return f"'{default_str}'"
        
        return default_str

    def get_default_value_for_type(self, pg_type):
        """Get sensible default values for different types"""
        if 'INTEGER' in pg_type:
            return '0'
        elif 'VARCHAR' in pg_type or 'TEXT' in pg_type:
            return "''"
        elif 'BOOLEAN' in pg_type:
            return 'FALSE'
        elif 'TIMESTAMP' in pg_type:
            return 'NOW()'
        elif 'REAL' in pg_type or 'DECIMAL' in pg_type:
            return '0.0'
        else:
            return 'NULL'
    
    def create_enums_if_needed(self):
        """Create ENUM types if they don't exist"""
        enum_statements = []
        
        # Define required enums
        enums = {
            'user_role_enum': ['donor', 'charity', 'admin'],
            'charity_status_enum': ['pending', 'approved', 'rejected'],
            'donation_status_enum': ['pending', 'complete', 'failed', 'cancelled'],
            'payment_status_enum': ['pending', 'completed', 'failed', 'cancelled'],
            'payment_method_enum': ['mpesa', 'card', 'bank_transfer']
        }
        
        try:
            with self.engine.connect() as conn:
                for enum_name, values in enums.items():
                    # Check if enum exists
                    check_query = text("SELECT 1 FROM pg_type WHERE typname = :enum_name")
                    result = conn.execute(check_query, {'enum_name': enum_name}).fetchone()
                    
                    if not result:
                        values_str = "', '".join(values)
                        create_enum = f"CREATE TYPE {enum_name} AS ENUM ('{values_str}')"
                        enum_statements.append(create_enum)
                        logger.info(f"Will create enum: {enum_name}")
                        
        except Exception as e:
            logger.warning(f"Could not check enums: {e}")
            
        return enum_statements
    
    def execute_migrations(self, statements):
        """Execute migration statements with safety checks"""
        if not statements:
            logger.info("No migrations needed")
            return True
            
        try:
            with self.engine.connect() as conn:
                with conn.begin():
                    for statement in statements:
                        try:
                            logger.info(f"Executing: {statement}")
                            conn.execute(text(statement))
                            logger.info("✅ Statement executed successfully")
                        except Exception as stmt_error:
                            # Handle specific errors gracefully
                            error_msg = str(stmt_error).lower()
                            if 'already exists' in error_msg or 'duplicate column' in error_msg:
                                logger.warning(f"⚠️  Column already exists, skipping: {statement}")
                                continue
                            else:
                                logger.error(f"❌ Statement failed: {statement}")
                                raise stmt_error
                        
            logger.info("All migrations executed successfully!")
            return True
            
        except Exception as e:
            logger.error(f"Migration failed: {e}")
            return False
    
    def run_migrations(self):
        """Main migration process"""
        logger.info("Starting automatic database migration...")
        
        try:
            # Step 1: Create enums if needed
            logger.info("Checking for required ENUM types...")
            enum_statements = self.create_enums_if_needed()
            
            if enum_statements:
                logger.info("Creating missing ENUM types...")
                if not self.execute_migrations(enum_statements):
                    return False
            
            # Step 2: Create tables if they don't exist
            logger.info("Creating missing tables...")
            from app import create_app
            from app.services.database import db
            
            app = create_app()
            with app.app_context():
                db.create_all()
                logger.info("Tables created/verified successfully")
            
            # Step 3: Check for missing columns
            logger.info("Analyzing model changes...")
            model_columns = self.get_model_columns()
            db_columns = self.get_database_columns()
            
            missing_columns = self.detect_missing_columns(model_columns, db_columns)
            
            if not missing_columns:
                logger.info("Database schema is up to date!")
                return True
            
            # Step 4: Generate and execute ALTER statements
            logger.info("Generating migration statements...")
            alter_statements = self.generate_alter_statements(missing_columns)
            
            if alter_statements:
                logger.info("Applying schema changes...")
                return self.execute_migrations(alter_statements)
            else:
                logger.info("No column migrations needed")
                return True
                
        except Exception as e:
            logger.error(f"Migration process failed: {e}")
            return False

def main():
    """Main function to run migrations"""
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        logger.error("DATABASE_URL environment variable not set")
        return False
    
    # Handle Render's postgres:// URL format
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    migrator = DatabaseMigrator(database_url)
    return migrator.run_migrations()

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)