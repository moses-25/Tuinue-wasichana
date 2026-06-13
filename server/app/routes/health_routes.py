from flask import jsonify
from flask_restx import Namespace, Resource
from app.services.database import db
from app.models.user import User
import os
import redis
from datetime import datetime

health_ns = Namespace('health', description='Health check and monitoring endpoints')

@health_ns.route('/')
class HealthCheck(Resource):
    @health_ns.doc('health_check')
    def get(self):
        """Basic health check endpoint"""
        return {
            'status': 'healthy',
            'service': 'tuinue-wasichana-api',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0'
        }, 200

@health_ns.route('/detailed')
class DetailedHealthCheck(Resource):
    @health_ns.doc('detailed_health_check')
    def get(self):
        """Detailed health check with service dependencies"""
        health_status = {
            'status': 'healthy',
            'service': 'tuinue-wasichana-api',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0',
            'environment': os.getenv('FLASK_ENV', 'development'),
            'checks': {}
        }
        
        # Database health check
        try:
            db.session.execute('SELECT 1')
            user_count = User.query.count()
            health_status['checks']['database'] = {
                'status': 'healthy',
                'user_count': user_count
            }
        except Exception as e:
            health_status['checks']['database'] = {
                'status': 'unhealthy',
                'error': str(e)
            }
            health_status['status'] = 'unhealthy'
        
        # Redis health check
        try:
            redis_url = os.getenv('REDIS_URL')
            if redis_url:
                r = redis.from_url(redis_url)
                r.ping()
                health_status['checks']['redis'] = {
                    'status': 'healthy'
                }
            else:
                health_status['checks']['redis'] = {
                    'status': 'not_configured'
                }
        except Exception as e:
            health_status['checks']['redis'] = {
                'status': 'unhealthy',
                'error': str(e)
            }
        
        # Environment variables check
        required_vars = ['SECRET_KEY', 'JWT_SECRET_KEY', 'DATABASE_URL']
        missing_vars = [var for var in required_vars if not os.getenv(var)]
        
        health_status['checks']['environment'] = {
            'status': 'healthy' if not missing_vars else 'unhealthy',
            'missing_variables': missing_vars
        }
        
        if missing_vars:
            health_status['status'] = 'unhealthy'
        
        status_code = 200 if health_status['status'] == 'healthy' else 503
        return health_status, status_code

@health_ns.route('/ready')
class ReadinessCheck(Resource):
    @health_ns.doc('readiness_check')
    def get(self):
        """Readiness check for load balancer"""
        try:
            # Check if database is accessible
            db.session.execute('SELECT 1')
            return {'status': 'ready'}, 200
        except Exception as e:
            return {'status': 'not_ready', 'error': str(e)}, 503

@health_ns.route('/live')
class LivenessCheck(Resource):
    @health_ns.doc('liveness_check')
    def get(self):
        """Liveness check for container orchestration"""
        return {'status': 'alive'}, 200