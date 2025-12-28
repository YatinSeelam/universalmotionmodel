"""
Email service using Resend API.
Handles transactional emails with error handling and rate limiting protection.
"""

import os
import logging
from typing import Optional
from dotenv import load_dotenv
from resend import Emails
from email_templates import (
    waitlist_welcome,
    lab_request_confirmation,
    lab_request_admin_notification,
)

# Load environment variables (in case this module is imported before main.py loads .env)
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment variables
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM", "Universal Motion Model <onboarding@resend.dev>")
EMAIL_ADMIN_TO = os.getenv("EMAIL_ADMIN_TO")
EMAIL_REPLY_TO = os.getenv("EMAIL_REPLY_TO")
EMAIL_ENABLED = os.getenv("EMAIL_ENABLED", "true").lower() == "true"

# Set Resend API key in environment (required by resend package)
if RESEND_API_KEY:
    os.environ["RESEND_API_KEY"] = RESEND_API_KEY

# Initialize Resend client status
if RESEND_API_KEY and EMAIL_ENABLED:
    logger.info("✅ Resend email client ready (API key configured)")
elif not EMAIL_ENABLED:
    logger.info("📧 Email sending is disabled (EMAIL_ENABLED=false)")
else:
    logger.warning("⚠️  RESEND_API_KEY not set, emails will not be sent")


def send_email(
    to: str,
    subject: str,
    html: str,
    text: Optional[str] = None,
    reply_to: Optional[str] = None,
) -> bool:
    """
    Send an email using Resend.
    
    Args:
        to: Recipient email address
        subject: Email subject
        html: HTML email body
        text: Optional plain text version
        reply_to: Optional reply-to address
    
    Returns:
        True if email was sent successfully, False otherwise
    """
    # If email is disabled, log and return success (don't fail the request)
    if not EMAIL_ENABLED:
        logger.info(f"📧 Email disabled - would send to {to}: {subject}")
        return True
    
    # Check if API key is configured
    if not RESEND_API_KEY:
        logger.error(f"❌ Cannot send email: RESEND_API_KEY not set")
        return False
    
    # Validate required fields
    if not to or not subject or not html:
        logger.error(f"❌ Cannot send email: missing required fields (to, subject, or html)")
        return False
    
    try:
        # Prepare email params
        params = {
            "from": EMAIL_FROM,
            "to": [to] if isinstance(to, str) else to,
            "subject": subject,
            "html": html,
        }
        
        if text:
            params["text"] = text
        
        if reply_to:
            params["reply_to"] = reply_to
        elif EMAIL_REPLY_TO:
            params["reply_to"] = EMAIL_REPLY_TO
        
        # Send email using Emails.send() class method
        response = Emails.send(params)
        
        # Log success
        logger.info(f"✅ Email sent to {to}: {subject} (ID: {response.get('id', 'unknown')})")
        return True
        
    except Exception as e:
        # Log error but don't crash
        error_msg = str(e)
        logger.error(f"❌ Failed to send email to {to}: {error_msg}")
        
        # Check for Resend domain verification error
        if "only send testing emails to your own email" in error_msg.lower():
            logger.warning(f"⚠️  Resend restriction: Can only send to verified email with default domain")
            logger.warning(f"   To send to {to}, verify a domain at https://resend.com/domains")
            logger.warning(f"   Or use your verified email ({EMAIL_ADMIN_TO}) for testing")
        
        import traceback
        logger.debug(traceback.format_exc())
        return False


def send_waitlist_welcome(email: str, name: Optional[str] = None) -> bool:
    """Send welcome email to waitlist signup."""
    subject, html = waitlist_welcome(name=name, email=email)
    return send_email(to=email, subject=subject, html=html)


def send_lab_request_confirmation(email: str, name: Optional[str] = None, org: Optional[str] = None) -> bool:
    """Send confirmation email to lab requester."""
    subject, html = lab_request_confirmation(name=name, org=org)
    return send_email(to=email, subject=subject, html=html)


def send_lab_request_admin_notification(payload: dict) -> bool:
    """Send notification email to admin about new lab request."""
    if not EMAIL_ADMIN_TO:
        logger.warning("⚠️  EMAIL_ADMIN_TO not set, skipping admin notification")
        return False
    
    subject, html = lab_request_admin_notification(payload)
    return send_email(to=EMAIL_ADMIN_TO, subject=subject, html=html)

