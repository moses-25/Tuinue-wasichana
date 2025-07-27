import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'a_very_secret_key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'super_secret_jwt_key')

    DATABASE_URL = os.getenv('DATABASE_URL')

    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set. Please create a .env file and set it.")

    # Add a check to prevent common placeholder errors in the connection string.
    if ':port' in DATABASE_URL:
        raise ValueError("Your DATABASE_URL in the .env file seems to contain a placeholder ':port'. Please replace it with the actual database port number (e.g., ':3306' for MySQL).")

    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
