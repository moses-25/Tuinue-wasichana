from flask import jsonify
from app.models.charity import Charity
from app.models.charity_application import CharityApplication
from app.models.user import User
from app.models.donation import Donation
from app.services.database import db
from datetime import datetime

class AdminController:
    @staticmethod
    def get_dashboard_stats():
        """Get admin dashboard statistics"""
        total_users = User.query.count()
        total_charities = Charity.query.count()
        approved_charities = Charity.query.filter_by(status='approved').count()
        pending_applications = CharityApplication.query.filter_by(status='pending').count()
        total_donations = Donation.query.filter_by(status='complete').count()
        
        # Calculate total donation amount
        total_amount = db.session.query(db.func.sum(Donation.amount)).filter_by(status='complete').scalar() or 0
        
        return jsonify({
            'total_users': total_users,
            'total_charities': total_charities,
            'approved_charities': approved_charities,
            'pending_applications': pending_applications,
            'total_donations': total_donations,
            'total_donation_amount': str(total_amount)
        })

    @staticmethod
    def get_recent_activities():
        """Get recent system activities"""
        # Recent donations
        recent_donations = Donation.query.filter_by(status='complete').order_by(
            Donation.timestamp.desc()
        ).limit(10).all()
        
        # Recent charity applications
        recent_applications = CharityApplication.query.order_by(
            CharityApplication.submitted_at.desc()
        ).limit(10).all()
        
        activities = []
        
        for donation in recent_donations:
            activities.append({
                'type': 'donation',
                'message': f'New donation of {donation.amount} to charity ID {donation.charity_id}',
                'timestamp': donation.timestamp.isoformat(),
                'amount': str(donation.amount)
            })
        
        for application in recent_applications:
            activities.append({
                'type': 'application',
                'message': f'New charity application: {application.organization_name}',
                'timestamp': application.submitted_at.isoformat(),
                'status': application.status
            })
        
        # Sort by timestamp
        activities.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify(activities[:20])  # Return top 20 recent activities

    @staticmethod
    def approve_charity(charity_id):
        """Approve a charity"""
        charity = Charity.query.get(charity_id)
        if not charity:
            return jsonify({'message': 'Charity not found'}), 404
        
        if charity.status == 'approved':
            return jsonify({'message': 'Charity already approved'}), 400
        
        charity.status = 'approved'
        db.session.commit()
        
        return jsonify({
            'message': 'Charity approved successfully',
            'charity': charity.to_dict()
        }), 200

    @staticmethod
    def reject_charity(charity_id, reason=None):
        """Reject a charity"""
        charity = Charity.query.get(charity_id)
        if not charity:
            return jsonify({'message': 'Charity not found'}), 404
        
        if charity.status == 'rejected':
            return jsonify({'message': 'Charity already rejected'}), 400
        
        charity.status = 'rejected'
        db.session.commit()
        
        return jsonify({
            'message': 'Charity rejected successfully',
            'charity': charity.to_dict(),
            'reason': reason
        }), 200