from Backend.celery_app import celery_app
from Backend.app.models.reminder import Reminder
from Backend.app.services.database import db
from datetime import datetime

@celery_app.task
def send_monthly_reminder(reminder_id):
    with celery_app.app_context():
        reminder = Reminder.query.get(reminder_id)
        if reminder:
            # In a real application, you would send an email/SMS here
            print(f"Sending monthly reminder to user {reminder.user_id} for charity {reminder.charity_id} for amount {reminder.amount}")
            reminder.status = 'sent'
            db.session.commit()
        else:
            print(f"Reminder with ID {reminder_id} not found.")

@celery_app.task
def schedule_monthly_reminders():
    with celery_app.app_context():
        # This task would typically run once a month to schedule reminders
        # For demonstration, let's just print a message
        print("Scheduling monthly reminders...")
        # Example: Find all recurring donations and schedule reminders for next month
        # from app.models.donation import Donation
        # recurring_donations = Donation.query.filter_by(recurring=True).all()
        # for donation in recurring_donations:
        #     # Calculate next month's reminder time
        #     next_month = datetime.utcnow().replace(day=1) + timedelta(days=32) # rough next month
        #     next_month = next_month.replace(day=1)
        #     new_reminder = Reminder(
        #         user_id=donation.user_id,
        #         charity_id=donation.charity_id,
        #         amount=donation.amount,
        #         scheduled_time=next_month,
        #         status='pending'
        #     )
        #     db.session.add(new_reminder)
        #     db.session.commit()
        #     send_monthly_reminder.delay(new_reminder.id)
