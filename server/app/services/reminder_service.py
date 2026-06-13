"""
Simplified reminder service for free plan deployment
Since Celery/Redis isn't available on free plan, we'll use database-based scheduling
"""
from app.services.database import db
from app.models.reminder import Reminder
from app.models.user import User
from app.models.charity import Charity
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class ReminderService:
    """Database-based reminder service for free plan"""
    
    @staticmethod
    def create_reminder(user_id, charity_id, amount, days_from_now=30):
        """Create a reminder for future donation"""
        try:
            scheduled_time = datetime.utcnow() + timedelta(days=days_from_now)
            
            reminder = Reminder(
                user_id=user_id,
                charity_id=charity_id,
                amount=amount,
                scheduled_time=scheduled_time,
                status='pending'
            )
            
            db.session.add(reminder)
            db.session.commit()
            
            logger.info(f"Created reminder for user {user_id}, charity {charity_id}")
            return reminder
            
        except Exception as e:
            logger.error(f"Error creating reminder: {str(e)}")
            db.session.rollback()
            return None
    
    @staticmethod
    def get_due_reminders():
        """Get reminders that are due for processing"""
        try:
            now = datetime.utcnow()
            due_reminders = Reminder.query.filter(
                Reminder.status == 'pending',
                Reminder.scheduled_time <= now
            ).all()
            
            return due_reminders
            
        except Exception as e:
            logger.error(f"Error getting due reminders: {str(e)}")
            return []
    
    @staticmethod
    def process_due_reminders():
        """Process all due reminders (called manually or via cron)"""
        try:
            due_reminders = ReminderService.get_due_reminders()
            processed_count = 0
            
            for reminder in due_reminders:
                if ReminderService.send_reminder_notification(reminder):
                    reminder.status = 'sent'
                    processed_count += 1
                else:
                    reminder.status = 'failed'
                
                # Schedule next reminder for recurring donations
                if reminder.status == 'sent':
                    ReminderService.create_reminder(
                        reminder.user_id,
                        reminder.charity_id,
                        reminder.amount,
                        days_from_now=30
                    )
            
            db.session.commit()
            logger.info(f"Processed {processed_count} reminders")
            return processed_count
            
        except Exception as e:
            logger.error(f"Error processing reminders: {str(e)}")
            db.session.rollback()
            return 0
    
    @staticmethod
    def send_reminder_notification(reminder):
        """Send reminder notification (placeholder for email/SMS integration)"""
        try:
            user = User.query.get(reminder.user_id)
            charity = Charity.query.get(reminder.charity_id)
            
            if not user or not charity:
                logger.error(f"User or charity not found for reminder {reminder.id}")
                return False
            
            # In a real application, you would send an email/SMS here
            # For now, we'll just log the reminder
            logger.info(f"Reminder sent to {user.email} for {charity.name} - Amount: {reminder.amount}")
            
            # Here you would integrate with email service (SendGrid, AWS SES, etc.)
            # send_email(
            #     to=user.email,
            #     subject=f"Monthly Donation Reminder - {charity.name}",
            #     body=f"Hi {user.name}, this is a reminder for your monthly donation of {reminder.amount} to {charity.name}"
            # )
            
            return True
            
        except Exception as e:
            logger.error(f"Error sending reminder notification: {str(e)}")
            return False
    
    @staticmethod
    def cleanup_old_reminders(days_old=180):
        """Clean up old processed reminders"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days_old)
            old_reminders = Reminder.query.filter(
                Reminder.scheduled_time < cutoff_date,
                Reminder.status.in_(['sent', 'failed'])
            ).all()
            
            count = len(old_reminders)
            for reminder in old_reminders:
                db.session.delete(reminder)
            
            db.session.commit()
            logger.info(f"Cleaned up {count} old reminders")
            return count
            
        except Exception as e:
            logger.error(f"Error cleaning up old reminders: {str(e)}")
            return 0