from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from app.controllers.admin_controller import AdminController
from app.middlewares.auth_middleware import roles_required

admin_ns = Namespace('admin', description='Admin related operations')

@admin_ns.route('/dashboard')
class AdminDashboard(Resource):
    @admin_ns.doc('get_admin_dashboard')
    @roles_required('admin')
    def get(self):
        """Get admin dashboard statistics"""
        return AdminController.get_dashboard_stats()

@admin_ns.route('/activities')
class AdminActivities(Resource):
    @admin_ns.doc('get_recent_activities')
    @roles_required('admin')
    def get(self):
        """Get recent system activities"""
        return AdminController.get_recent_activities()

@admin_ns.route('/charities/<int:charity_id>/approve')
class AdminApproveCharity(Resource):
    @admin_ns.doc('approve_charity')
    @roles_required('admin')
    def post(self, charity_id):
        """Approve a charity"""
        return AdminController.approve_charity(charity_id)

@admin_ns.route('/charities/<int:charity_id>/reject')
class AdminRejectCharity(Resource):
    @admin_ns.doc('reject_charity')
    @roles_required('admin')
    def post(self, charity_id):
        """Reject a charity"""
        data = request.get_json() or {}
        reason = data.get('reason')
        return AdminController.reject_charity(charity_id, reason)