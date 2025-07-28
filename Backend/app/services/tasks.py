from celery_app import celery_app
from app.models.reminder import Reminder
from app.models.donation import Donation
from app.models.user import User
from app.models.charity import Charity
from app.services.database import db
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

@celery_app.task
def send_monthly_reminder(reminder_id):
    """Send monthly donation reminder to user"""
    try:
        reminder = Reminder.query.get(reminder_id)
        if not reminder:
            logger.error(f"Reminder with ID {reminder_id} not found")
            return False

        user = User.query.get(reminder.user_id)
        charity = Charity.query.get(reminder.charity_id)
        
        if not user or not charity:
            logger.error(f"User or charity not found for reminder {reminder_id}")
            return False

        # In a real application, you would send an email/SMS here
        # For now, we'll just log the reminder
        logger.info(f"Sending monthly reminder to {user.email} for {charity.name} - Amount: {reminder.amount}")
        
        # Here you would integrate with email service (SendGrid, AWS SES, etc.)
        # send_email(
        #     to=user.email,
        #     subject=f"Monthly Donation Reminder - {charity.name}",
        #     body=f"Hi {user.name}, this is a reminder for your monthly donation of {reminder.amount} to {charity.name}"
        # )
        
        reminder.status = 'sent'
        db.session.commit()
        
        # Schedule next month's reminder
        next_month = reminder.scheduled_time + timedelta(days=30)
        new_reminder = Reminder(
            user_id=reminder.user_id,
            charity_id=reminder.charity_id,
            amount=reminder.amount,
            scheduled_time=next_month,
            status='pending'
        )
        db.session.add(new_reminder)
        db.session.commit()
        
        # Schedule the next reminder
        send_monthly_reminder.apply_async(args=[new_reminder.id], eta=next_month)
        
        return True
        
    except Exception as e:
        logger.error(f"Error sending reminder {reminder_id}: {str(e)}")
        return False

@celery_app.task
def process_pending_reminders():
    """Process all pending reminders that are due"""
    try:
        now = datetime.utcnow()
        pending_reminders = Reminder.query.filter(
            Reminder.status == 'pending',
            Reminder.scheduled_time <= now
        ).all()
        
        logger.info(f"Processing {len(pending_reminders)} pending reminders")
        
        for reminder in pending_reminders:
            send_monthly_reminder.delay(reminder.id)
            
        return len(pending_reminders)
        
    except Exception as e:
        logger.error(f"Error processing pending reminders: {str(e)}")
        return 0

@celery_app.task
def cleanup_old_reminders():
    """Clean up old sent/failed reminders"""
    try:
        # Delete reminders older than 6 months
        cutoff_date = datetime.utcnow() - timedelta(days=180)
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
