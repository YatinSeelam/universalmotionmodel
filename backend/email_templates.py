"""
Email templates for transactional emails.
All templates return HTML content suitable for Resend.
"""


def waitlist_welcome(name: str = None, email: str = None) -> tuple[str, str]:
    """
    Generate welcome email for waitlist signup.
    Returns (subject, html_body).
    """
    subject = "Welcome to Universal Motion Model!"
    
    greeting = f"Hi {name}," if name else "Hi there,"
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <p style="font-size: 16px; margin: 0 0 20px 0;">{greeting}</p>
        
        <p style="font-size: 16px; margin: 0 0 20px 0;">
            Thank you for joining the waitlist! We're excited to have you on board.
        </p>
        
        <p style="font-size: 16px; margin: 0 0 20px 0;">
            We're building a platform to help research labs and robot operators collect, 
            manage, and improve robot motion data. You'll be among the first to know when 
            Universal Motion Model launches.
        </p>
        
        <p style="font-size: 16px; margin: 0 0 30px 0;">
            In the meantime, if you have any questions or ideas, feel free to reach out.
        </p>
        
        <p style="font-size: 16px; margin: 0;">
            Best regards,<br>
            The Universal Motion Model Team
        </p>
    </body>
    </html>
    """
    
    return subject, html


def lab_request_confirmation(name: str = None, org: str = None) -> tuple[str, str]:
    """
    Generate confirmation email for lab request submission.
    Returns (subject, html_body).
    """
    subject = "Lab Integration Request Received"
    
    greeting = f"Hi {name}," if name else "Hi there,"
    org_text = f" from {org}" if org else ""
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <p style="font-size: 16px; margin: 0 0 20px 0;">{greeting}</p>
        
        <p style="font-size: 16px; margin: 0 0 20px 0;">
            Thank you{org_text} for your interest in integrating Universal Motion Model with your lab!
        </p>
        
        <p style="font-size: 16px; margin: 0 0 20px 0;">
            We've received your lab integration request and will review it shortly. 
            Our team will get back to you within a few business days to discuss 
            how we can help with your robot learning project.
        </p>
        
        <p style="font-size: 16px; margin: 0 0 30px 0;">
            If you have any urgent questions, feel free to reply to this email.
        </p>
        
        <p style="font-size: 16px; margin: 0;">
            Best regards,<br>
            The Universal Motion Model Team
        </p>
    </body>
    </html>
    """
    
    return subject, html


def lab_request_admin_notification(payload: dict) -> tuple[str, str]:
    """
    Generate admin notification email for new lab request.
    Returns (subject, html_body).
    
    payload should contain: name, email, org, use_case
    """
    subject = f"New Lab Integration Request: {payload.get('org', 'Unknown')}"
    
    name = payload.get('name', 'N/A')
    email = payload.get('email', 'N/A')
    org = payload.get('org', 'N/A')
    use_case = payload.get('use_case', 'N/A')
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <p style="font-size: 16px; margin: 0 0 20px 0;">A new lab integration request has been submitted:</p>
        
        <div style="border-left: 3px solid #ddd; padding-left: 20px; margin: 20px 0;">
            <p style="margin: 10px 0; font-size: 16px;"><strong>Name:</strong> {name}</p>
            <p style="margin: 10px 0; font-size: 16px;"><strong>Email:</strong> <a href="mailto:{email}" style="color: #0066cc;">{email}</a></p>
            <p style="margin: 10px 0; font-size: 16px;"><strong>Organization:</strong> {org}</p>
            <p style="margin: 10px 0; font-size: 16px;"><strong>Use Case:</strong></p>
            <p style="margin: 10px 0; padding-left: 10px; font-size: 16px; color: #666;">{use_case}</p>
        </div>
        
        <p style="font-size: 14px; color: #666; margin: 30px 0 0 0;">
            Review this request in your admin dashboard.
        </p>
    </body>
    </html>
    """
    
    return subject, html

