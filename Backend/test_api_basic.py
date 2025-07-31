#!/usr/bin/env python3
"""
Basic API test script to verify endpoints are working
"""
import requests
import json
import sys

BASE_URL = "http://localhost:5000/api/v1"

def test_user_registration():
    """Test user registration endpoint"""
    print("🧪 Testing user registration...")
    
    url = f"{BASE_URL}/users/register"
    data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "role": "donor"
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 201:
            print("✅ User registration successful")
            return response.json()
        else:
            print(f"❌ User registration failed: {response.status_code}")
            print(response.text)
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - make sure the server is running on localhost:5000")
        return None

def test_user_login(email="test@example.com", password="password123"):
    """Test user login endpoint"""
    print("🧪 Testing user login...")
    
    url = f"{BASE_URL}/users/login"
    data = {
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("✅ User login successful")
            return response.json()
        else:
            print(f"❌ User login failed: {response.status_code}")
            print(response.text)
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - make sure the server is running on localhost:5000")
        return None

def test_protected_endpoint(token):
    """Test protected endpoint with token"""
    print("🧪 Testing protected endpoint...")
    
    url = f"{BASE_URL}/users/protected"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("✅ Protected endpoint access successful")
            return response.json()
        else:
            print(f"❌ Protected endpoint access failed: {response.status_code}")
            print(response.text)
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - make sure the server is running on localhost:5000")
        return None

def test_get_charities():
    """Test getting list of charities (public endpoint)"""
    print("🧪 Testing get charities endpoint...")
    
    url = f"{BASE_URL}/charities/"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("✅ Get charities successful")
            return response.json()
        else:
            print(f"❌ Get charities failed: {response.status_code}")
            print(response.text)
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - make sure the server is running on localhost:5000")
        return None

def main():
    """Run basic API tests"""
    print("🚀 Starting Basic API Tests")
    print("=" * 50)
    
    # Test 1: User Registration
    user_data = test_user_registration()
    if not user_data:
        print("❌ Cannot proceed without successful registration")
        sys.exit(1)
    
    print()
    
    # Test 2: User Login
    login_data = test_user_login()
    if not login_data:
        print("❌ Cannot proceed without successful login")
        sys.exit(1)
    
    token = login_data.get('access_token')
    if not token:
        print("❌ No access token received")
        sys.exit(1)
    
    print()
    
    # Test 3: Protected Endpoint
    protected_data = test_protected_endpoint(token)
    if not protected_data:
        print("❌ Protected endpoint test failed")
        sys.exit(1)
    
    print()
    
    # Test 4: Public Endpoint
    charities_data = test_get_charities()
    if charities_data is not None:  # Empty list is valid
        print(f"📊 Found {len(charities_data)} charities")
    
    print()
    print("🎉 All basic tests completed successfully!")
    print("=" * 50)
    print("Your API is working correctly!")
    print()
    print("Next steps:")
    print("1. Use the Postman collection for comprehensive testing")
    print("2. Run the full test suite with: python run_tests.py")
    print("3. Check the POSTMAN_TESTING_GUIDE.md for detailed testing instructions")

if __name__ == "__main__":
    main()