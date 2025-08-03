#!/usr/bin/env python3
"""
Manual migration command
Run this script to manually apply database migrations
"""

import os
import sys
import argparse

# Add the Backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def run_migrations(dry_run=False):
    """Run database migrations"""
    from database_migrator import DatabaseMigrator
    
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL environment variable not set")
        return False
    
    # Handle Render's postgres:// URL format
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    print(f"🔄 Running migrations for database...")
    print(f"📍 Database URL: {database_url.split('@')[1] if '@' in database_url else 'localhost'}")
    
    if dry_run:
        print("🧪 DRY RUN MODE - No changes will be applied")
    
    migrator = DatabaseMigrator(database_url)
    
    if dry_run:
        # Just show what would be done
        try:
            model_columns = migrator.get_model_columns()
            db_columns = migrator.get_database_columns()
            missing_columns = migrator.detect_missing_columns(model_columns, db_columns)
            
            if not missing_columns:
                print("✅ No migrations needed - database is up to date")
                return True
            
            print("📋 The following changes would be applied:")
            for table_name, info in missing_columns.items():
                if info.get('table_missing'):
                    print(f"  📄 Create table: {table_name}")
                else:
                    for col_name, col_info in info['columns'].items():
                        print(f"  ➕ Add column: {table_name}.{col_name} ({col_info['type']})")
            
            return True
            
        except Exception as e:
            print(f"❌ Dry run failed: {e}")
            return False
    else:
        return migrator.run_migrations()

def check_database_status():
    """Check current database status"""
    from database_migrator import DatabaseMigrator
    
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL environment variable not set")
        return False
    
    # Handle Render's postgres:// URL format
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    try:
        migrator = DatabaseMigrator(database_url)
        
        print("📊 Database Status Check")
        print("=" * 40)
        
        # Get current state
        model_columns = migrator.get_model_columns()
        db_columns = migrator.get_database_columns()
        
        print(f"📋 Models define {len(model_columns)} tables")
        print(f"🗄️  Database has {len(db_columns)} tables")
        
        # Check for differences
        missing_columns = migrator.detect_missing_columns(model_columns, db_columns)
        
        if not missing_columns:
            print("✅ Database schema is up to date!")
        else:
            print("⚠️  Schema differences found:")
            for table_name, info in missing_columns.items():
                if info.get('table_missing'):
                    print(f"  ❌ Missing table: {table_name}")
                else:
                    missing_count = len(info['columns'])
                    print(f"  📝 Table {table_name}: {missing_count} missing columns")
        
        return True
        
    except Exception as e:
        print(f"❌ Status check failed: {e}")
        return False

def main():
    """Main function with command line arguments"""
    parser = argparse.ArgumentParser(description='Database Migration Tool')
    parser.add_argument('command', choices=['migrate', 'status', 'dry-run'], 
                       help='Command to run')
    parser.add_argument('--force', action='store_true', 
                       help='Force migration even if there are warnings')
    
    args = parser.parse_args()
    
    print("🚀 Tuinue Wasichana Database Migration Tool")
    print("=" * 50)
    
    if args.command == 'status':
        success = check_database_status()
    elif args.command == 'dry-run':
        success = run_migrations(dry_run=True)
    elif args.command == 'migrate':
        success = run_migrations(dry_run=False)
    else:
        print("❌ Unknown command")
        success = False
    
    if success:
        print("\n✅ Operation completed successfully!")
    else:
        print("\n❌ Operation failed!")
        sys.exit(1)

if __name__ == '__main__':
    main()