import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'a_very_secret_key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'super_secret_jwt_key')

    DATABASE_URL = os.getenv('DATABASE_URL')

    if DATABASE_URL:
        # Handle Render's postgres:// URL format
        if DATABASE_URL.startswith('postgres://'):
            DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    else:
        # Development fallback
        DATABASE_URL = 'sqlite:///tuinue_dev.db'

    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Celery Configuration (Free plan fallback)
    USE_REDIS = os.getenv('USE_REDIS', 'true').lower() == 'true'
    
    if USE_REDIS:
        CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
        CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
    else:
        # Use database as broker for free plan (limited functionality)
        CELERY_BROKER_URL = f"db+{DATABASE_URL}"
        CELERY_RESULT_BACKEND = f"db+{DATABASE_URL}"
    
    # Session Configuration
    SESSION_TYPE = os.getenv('SESSION_TYPE', 'redis' if USE_REDIS else 'sqlalchemy')
    
    # Mpesa Configuration
    MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY')
    MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET')
    MPESA_BUSINESS_SHORT_CODE = os.getenv('MPESA_BUSINESS_SHORT_CODE')
    MPESA_PASSKEY = os.getenv('MPESA_PASSKEY')
    MPESA_CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL', 'https://yourdomain.com/api/v1/payments/verify')
    
    # Environment detection
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV == 'development'
    
    # Free plan optimizations
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_size': 5,  # Reduced for free plan
        'max_overflow': 0,  # No overflow for free plan
    }
