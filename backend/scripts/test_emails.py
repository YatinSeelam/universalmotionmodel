#!/usr/bin/env python3
"""
Test script for email functionality.
Sends a test waitlist welcome email to EMAIL_ADMIN_TO.
"""

import os
import sys
from pathlib import Path

# Load environment variables FIRST before importing emailer
from dotenv import load_dotenv
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

# Add parent directory to path to import emailer
sys.path.insert(0, str(Path(__file__).parent.parent))

from emailer import send_waitlist_welcome

EMAIL_ADMIN_TO = os.getenv("EMAIL_ADMIN_TO")
EMAIL_ENABLED = os.getenv("EMAIL_ENABLED", "true").lower() == "true"

if __name__ == "__main__":
    print("🧪 Testing email functionality...\n")
    
    if not EMAIL_ENABLED:
        print("❌ Email is disabled (EMAIL_ENABLED=false)")
        print("   Set EMAIL_ENABLED=true in your .env file to test emails")
        sys.exit(1)
    
    if not EMAIL_ADMIN_TO:
        print("❌ EMAIL_ADMIN_TO not set in .env file")
        print("   Add EMAIL_ADMIN_TO=your-email@example.com to your .env file")
        sys.exit(1)
    
    print(f"📧 Sending test email to: {EMAIL_ADMIN_TO}")
    print("   Email type: Waitlist welcome\n")
    
    success = send_waitlist_welcome(
        email=EMAIL_ADMIN_TO,
        name="Test User",
    )
    
    if success:
        print("✅ Test email sent successfully!")
        print(f"   Check your inbox at {EMAIL_ADMIN_TO}")
    else:
        print("❌ Failed to send test email")
        print("   Check your RESEND_API_KEY and email configuration")
        sys.exit(1)

