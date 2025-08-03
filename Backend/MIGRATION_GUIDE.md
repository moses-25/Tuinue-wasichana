# Database Migration System

This project includes an automatic database migration system that detects model changes and applies schema updates automatically during deployment.

## How It Works

The migration system automatically:
1. **Detects Model Changes** - Compares your SQLAlchemy models with the actual database schema
2. **Creates Missing Tables** - Uses SQLAlchemy's `db.create_all()` for new tables
3. **Adds Missing Columns** - Generates and executes `ALTER TABLE` statements for new columns
4. **Creates ENUM Types** - Ensures all required PostgreSQL ENUM types exist
5. **Handles Errors Gracefully** - Skips already existing columns and continues

## When Migrations Run

Migrations run automatically in multiple places to ensure reliability:

### 1. During Deployment (build.sh)
```bash
# Runs during Render deployment
python init_database.py
python database_migrator.py
```

### 2. At Application Startup (app.py)
```python
# Runs when the Flask app starts (backup)
migrator = DatabaseMigrator(database_url)
migrator.run_migrations()
```

### 3. Manual Execution
```bash
# Run migrations manually
python migrate.py migrate

# Check database status
python migrate.py status

# Dry run (see what would change)
python migrate.py dry-run
```

## Supported Changes

The migration system automatically handles:

✅ **New Tables** - Created via SQLAlchemy  
✅ **New Columns** - Added with ALTER TABLE  
✅ **Default Values** - Applied automatically  
✅ **NOT NULL Constraints** - With sensible defaults  
✅ **ENUM Types** - Created if missing  
✅ **Foreign Keys** - Handled by SQLAlchemy  

❌ **Not Supported** (requires manual intervention):
- Renaming columns
- Changing column types
- Dropping columns
- Complex constraints

## Example: Adding New Fields

When you add new fields to a model like this:

```python
class Charity(db.Model):
    # Existing fields...
    name = db.Column(db.String(255), nullable=False)
    
    # NEW FIELDS - will be auto-migrated
    location = db.Column(db.String(100), default='Kenya')
    category = db.Column(db.String(100), default='Health')
    goal = db.Column(db.Integer, default=10000)
```

The migration system will automatically:
1. Detect the new columns
2. Generate SQL: `ALTER TABLE charities ADD COLUMN location VARCHAR(100) DEFAULT 'Kenya'`
3. Execute the changes during deployment

## Manual Migration Commands

### Check Database Status
```bash
python migrate.py status
```
Shows current database state and any pending migrations.

### Preview Changes (Dry Run)
```bash
python migrate.py dry-run
```
Shows what migrations would be applied without making changes.

### Apply Migrations
```bash
python migrate.py migrate
```
Applies all pending migrations to the database.

## Environment Variables

The migration system uses these environment variables:

- `DATABASE_URL` - PostgreSQL connection string (required)
- `FLASK_ENV` - Set to 'production' to enable auto-migrations
- `INIT_DB` - Set to 'true' to force database initialization

## Safety Features

### Error Handling
- Skips columns that already exist
- Continues on non-critical errors
- Logs all operations for debugging

### Default Values
The system provides sensible defaults for NOT NULL columns:
- `INTEGER` → `0`
- `VARCHAR/TEXT` → `''` (empty string)
- `BOOLEAN` → `FALSE`
- `TIMESTAMP` → `NOW()`
- `DECIMAL/FLOAT` → `0.0`

### Transaction Safety
All migrations run within database transactions, so if something fails, changes are rolled back.

## Troubleshooting

### Migration Fails During Deployment
1. Check the build logs for specific error messages
2. The app will still start - migrations run again at startup
3. Use manual migration commands to diagnose issues

### Column Already Exists Error
This is normal and handled automatically. The system skips existing columns.

### ENUM Type Errors
The system creates all required ENUM types automatically. If you see ENUM errors, they're usually resolved on retry.

### Manual Intervention Needed
For complex changes (renaming, type changes), you may need to:
1. Create a custom migration script
2. Run SQL commands manually
3. Update the model after manual changes

## Best Practices

### Model Changes
1. **Add new fields** - Fully supported ✅
2. **Set sensible defaults** - Helps with NOT NULL columns
3. **Test locally first** - Use `migrate.py dry-run`
4. **Document complex changes** - For future reference

### Deployment
1. **Let auto-migration handle it** - Usually works perfectly
2. **Check logs** - Verify migrations completed successfully
3. **Test the app** - Ensure new features work as expected
4. **Manual backup** - For critical production changes

## Files in the Migration System

- `database_migrator.py` - Core migration logic
- `migrate.py` - Manual migration commands
- `init_database.py` - Database initialization (includes migrations)
- `build.sh` - Deployment script (runs migrations)
- `app.py` - Runtime migration backup

## Example Migration Log

```
🚀 Starting automatic database migration...
📋 Checking for required ENUM types...
✅ ENUM types verified
🗄️ Creating missing tables...
✅ Tables created/verified successfully
🔍 Analyzing model changes...
📝 Will add column: charities.location (VARCHAR(100))
📝 Will add column: charities.category (VARCHAR(100))
📝 Will add column: charities.goal (INTEGER)
🔄 Applying schema changes...
✅ Statement executed successfully: ALTER TABLE charities ADD COLUMN location VARCHAR(100) DEFAULT 'Kenya'
✅ Statement executed successfully: ALTER TABLE charities ADD COLUMN category VARCHAR(100) DEFAULT 'Health'
✅ Statement executed successfully: ALTER TABLE charities ADD COLUMN goal INTEGER DEFAULT 10000
✅ All migrations executed successfully!
```

This system ensures your database schema stays in sync with your models automatically, making deployments smooth and reliable! 🚀