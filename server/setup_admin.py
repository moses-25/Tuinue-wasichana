#!/usr/bin/env python3
"""
Setup script to configure admin credentials for deployment.
Run this before deploying to customize your admin user details.
"""

import os
import re
import secrets
import string

def generate_secure_password(length=16):
    """Generate a secure password with mixed characters."""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password

def validate_email(email):
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def update_render_yaml(admin_name, admin_email, admin_password):
    """Update render.yaml with new admin credentials."""
    
    render_yaml_path = 'render.yaml'
    
    if not os.path.exists(render_yaml_path):
        print(f"❌ {render_yaml_path} not found!")
        return False
    
    try:
        with open(render_yaml_path, 'r') as f:
            content = f.read()
        
        # Update admin credentials
        content = re.sub(
            r'value: ".*?"  # ADMIN_NAME',
            f'value: "{admin_name}"',
            content
        )
        content = re.sub(
            r'value: ".*?"  # ADMIN_EMAIL', 
            f'value: "{admin_email}"',
            content
        )
        content = re.sub(
            r'value: ".*?"  # ADMIN_PASSWORD',
            f'value: "{admin_password}"',
            content
        )
        
        # If patterns don't exist, update the values directly
        content = re.sub(
            r'(- key: ADMIN_NAME\s+value: ")[^"]*(")',
            f'\\1{admin_name}\\2',
            content
        )
        content = re.sub(
            r'(- key: ADMIN_EMAIL\s+value: ")[^"]*(")',
            f'\\1{admin_email}\\2',
            content
        )
        content = re.sub(
            r'(- key: ADMIN_PASSWORD\s+value: ")[^"]*(")',
            f'\\1{admin_password}\\2',
            content
        )
        
        with open(render_yaml_path, 'w') as f:
            f.write(content)
        
        print(f"✅ Updated {render_yaml_path} with new admin credentials")
        return True
        
    except Exception as e:
        print(f"❌ Error updating {render_yaml_path}: {e}")
        return False

def main():
    """Main setup function."""
    
    print("🔧 Tuinue Wasichana Admin Setup")
    print("=" * 40)
    print("Configure your admin user for deployment\n")
    
    # Get admin details
    print("👤 Admin User Details:")
    
    # Admin name
    while True:
        admin_name = input("Full Name (e.g., 'John Doe'): ").strip()
        if admin_name:
            break
        print("❌ Name cannot be empty!")
    
    # Admin email
    while True:
        admin_email = input("Email (e.g., 'admin@yourdomain.com'): ").strip()
        if admin_email and validate_email(admin_email):
            break
        print("❌ Please enter a valid email address!")
    
    # Admin password
    print("\n🔐 Password Options:")
    print("1. Generate secure password automatically")
    print("2. Enter custom password")
    
    while True:
        choice = input("Choose option (1 or 2): ").strip()
        if choice in ['1', '2']:
            break
        print("❌ Please enter 1 or 2!")
    
    if choice == '1':
        admin_password = generate_secure_password()
        print(f"🔑 Generated password: {admin_password}")
    else:
        while True:
            admin_password = input("Enter password (min 8 characters): ").strip()
            if len(admin_password) >= 8:
                break
            print("❌ Password must be at least 8 characters!")
    
    # Confirm details
    print("\n📋 Admin User Summary:")
    print(f"   Name: {admin_name}")
    print(f"   Email: {admin_email}")
    print(f"   Password: {'*' * len(admin_password)}")
    
    confirm = input("\n✅ Confirm these details? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ Setup cancelled")
        return
    
    # Update render.yaml
    print("\n🔄 Updating configuration...")
    
    if update_render_yaml(admin_name, admin_email, admin_password):
        print("\n🎉 Setup completed successfully!")
        print("\n📝 Next Steps:")
        print("1. Commit your changes to Git")
        print("2. Push to your repository")
        print("3. Deploy to Render")
        print("4. Login with your admin credentials")
        print("\n🔒 Security Reminder:")
        print("- Keep your admin credentials secure")
        print("- Change password after first login")
        print("- Don't share credentials publicly")
        
        # Save credentials to a secure file (optional)
        save_creds = input("\n💾 Save credentials to .admin_credentials file? (y/N): ").strip().lower()
        if save_creds == 'y':
            try:
                with open('.admin_credentials', 'w') as f:
                    f.write(f"Admin Name: {admin_name}\n")
                    f.write(f"Admin Email: {admin_email}\n")
                    f.write(f"Admin Password: {admin_password}\n")
                    f.write(f"Created: {os.popen('date').read().strip()}\n")
                print("✅ Credentials saved to .admin_credentials")
                print("⚠️  Remember to keep this file secure and don't commit it to Git!")
            except Exception as e:
                print(f"❌ Error saving credentials: {e}")
    
    else:
        print("❌ Setup failed. Please check the errors above.")

if __name__ == '__main__':
    main()