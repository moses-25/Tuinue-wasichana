from flask import request
from flask_restx import Namespace, Resource
from app.controllers.admin_controller import AdminController
from app.middlewares.auth_middleware import roles_required
from flask_jwt_extended import jwt_required

admin_ns = Namespace('admin', description='Admin related operations')

@admin_ns.route('/dashboard')
class AdminDashboard(Resource):
    @jwt_required()
    @roles_required('admin')
    def get(self):
        stats = AdminController.get_dashboard_stats()
        return {
            'success': True,
            'data': stats,
            'message': 'Admin dashboard data.'
        }, 200

@admin_ns.route('/activities')
class AdminActivities(Resource):
    @jwt_required()
    @roles_required('admin')
    def get(self):
        activities = AdminController.get_recent_activities()
        return {
            'success': True,
            'activities': activities,
            'message': 'Recent activities.'
        }, 200

@admin_ns.route('/charities/<int:charity_id>/approve')
class AdminApproveCharity(Resource):
    @jwt_required()
    @roles_required('admin')
    def post(self, charity_id):
        result = AdminController.approve_charity(charity_id)
        return {
            'success': result.get('success', True),
            'data': result.get('data', {}),
            'message': result.get('message', 'Charity approved.')
        }, 200

@admin_ns.route('/charities/<int:charity_id>/reject')
class AdminRejectCharity(Resource):
    @jwt_required()
    @roles_required('admin')
    def post(self, charity_id):
        data = request.get_json() or {}
        reason = data.get('reason')
        result = AdminController.reject_charity(charity_id, reason)
        return {
            'success': result.get('success', True),
            'data': result.get('data', {}),
            'message': result.get('message', 'Charity rejected.')
        }, 200

@admin_ns.route('/permission-requests')
class PermissionRequests(Resource):
    @jwt_required()
    @roles_required('admin')
    def get(self):
        # Stub for permission requests
        return {
            'success': True,
            'requests': [],
            'message': 'Permission requests.'
        }, 200

@admin_ns.route('/permission-requests/<int:request_id>/approve')
class ApprovePermissionRequest(Resource):
    @jwt_required()
    @roles_required('admin')
    def post(self, request_id):
        # Stub for approving permission request
        return {
            'success': True,
            'message': 'Permission request approved.'
        }, 200

@admin_ns.route('/permission-requests/<int:request_id>/reject')
class RejectPermissionRequest(Resource):
    @jwt_required()
    @roles_required('admin')
    def post(self, request_id):
        # Stub for rejecting permission request
        return {
            'success': True,
            'message': 'Permission request rejected.'
        }, 200

@admin_ns.route('/settings')
class AdminSettings(Resource):
    @jwt_required()
    @roles_required('admin')
    def get(self):
        # Stub for getting settings
        return {
            'success': True,
            'settings': {},
            'message': 'Settings retrieved.'
        }, 200
    @jwt_required()
    @roles_required('admin')
    def put(self):
        # Stub for updating settings
        return {
            'success': True,
            'message': 'Settings updated.'
        }, 200
