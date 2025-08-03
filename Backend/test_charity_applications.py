#!/usr/bin/env python3
"""
Test script to debug charity applications endpoint
"""
import requests
import json
import os
from datetime import datetime

# Configuration
BASE_URL = os.getenv('API_BASE_URL', 'https://tuinue-wasichana-z03y.onrender.com/api/v1')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'tuinuewasichana@gmail.com')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', '12345678')

def test_charity_applications():
    """Test the charity applications endpoint"""
    print("🧪 Testing Charity Applications Endpoint")
    print("=" * 50)
    
    # Step 1: Login as admin
    print("1. Logging in as admin...")
    login_data = {
        'email': ADMIN_EMAIL,
        'password': ADMIN_PASSWORD
    }
    
    try:
        login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"   Login Status: {login_response.status_code}")
        
        if login_response.status_code != 200:
            print(f"   Login failed: {login_response.text}")
            return False
            
        login_result = login_response.json()
        if not login_result.get('success'):
            print(f"   Login failed: {login_result.get('message', 'Unknown error')}")
            return False
            
        token = login_result.get('token')
        if not token:
            print("   No access token received")
            print(f"   Login response: {login_result}")
            return False
            
        print("   ✅ Login successful")
        
    except Exception as e:
        print(f"   ❌ Login error: {e}")
        return False
    
    # Step 2: Test charity applications endpoint
    print("\n2. Testing charity applications endpoint...")
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        apps_response = requests.get(f"{BASE_URL}/charities/applications", headers=headers)
        print(f"   Applications Status: {apps_response.status_code}")
        
        if apps_response.status_code != 200:
            print(f"   Applications failed: {apps_response.text}")
            return False
            
        apps_result = apps_response.json()
        print(f"   Response: {json.dumps(apps_result, indent=2)}")
        
        if apps_result.get('success'):
            applications = apps_result.get('applications', [])
            print(f"   ✅ Found {len(applications)} charity applications")
            
            for i, app in enumerate(applications[:3]):  # Show first 3
                print(f"      App {i+1}: {app.get('organization_name')} - {app.get('status')}")
        else:
            print(f"   ❌ Applications request failed: {apps_result.get('message', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"   ❌ Applications error: {e}")
        return False
    
    # Step 3: Test users endpoint
    print("\n3. Testing users endpoint...")
    try:
        users_response = requests.get(f"{BASE_URL}/users/", headers=headers)
        print(f"   Users Status: {users_response.status_code}")
        
        if users_response.status_code != 200:
            print(f"   Users failed: {users_response.text}")
            return False
            
        users_result = users_response.json()
        
        if users_result.get('success'):
            users = users_result.get('users', [])
            print(f"   ✅ Found {len(users)} users")
            
            for i, user in enumerate(users[:3]):  # Show first 3
                print(f"      User {i+1}: {user.get('name')} - {user.get('role')}")
        else:
            print(f"   ❌ Users request failed: {users_result.get('message', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"   ❌ Users error: {e}")
        return False
    
    print("\n✅ All tests passed!")
    return True

def test_health():
    """Test health endpoint"""
    print("\n🏥 Testing Health Endpoint")
    print("=" * 30)
    
    try:
        health_response = requests.get(f"{BASE_URL}/health")
        print(f"Health Status: {health_response.status_code}")
        
        if health_response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {health_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

if __name__ == "__main__":
    print(f"🚀 Testing API at: {BASE_URL}")
    print(f"📅 Test time: {datetime.now()}")
    print()
    
    # Test health first
    if not test_health():
        print("❌ Health check failed, stopping tests")
        exit(1)
    
    # Test charity applications
    if test_charity_applications():
        print("\n🎉 All tests completed successfully!")
    else:
        print("\n💥 Some tests failed!")
        exit(1)