"""
Health monitoring to prevent app crashes and continuous restarts
"""
import logging
import traceback
from functools import wraps

logger = logging.getLogger(__name__)

def safe_route(f):
    """Decorator to catch and log errors in routes without crashing the app"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in route {f.__name__}: {e}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return {
                'success': False,
                'error': 'Internal server error',
                'message': 'An error occurred while processing your request'
            }, 500
    return decorated_function

def setup_error_handlers(app):
    """Setup global error handlers to prevent crashes"""
    
    @app.errorhandler(404)
    def not_found(error):
        return {
            'success': False,
            'error': 'Not found',
            'message': 'The requested resource was not found'
        }, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {error}")
        return {
            'success': False,
            'error': 'Internal server error',
            'message': 'An internal error occurred'
        }, 500
    
    @app.errorhandler(Exception)
    def handle_exception(e):
        logger.error(f"Unhandled exception: {e}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return {
            'success': False,
            'error': 'Internal server error',
            'message': 'An unexpected error occurred'
        }, 500