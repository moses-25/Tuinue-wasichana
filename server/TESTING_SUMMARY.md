# 🧪 Tuinue Wasichana - Testing Summary

This document provides a comprehensive overview of the testing setup for the Tuinue Wasichana API.

## 📁 Test Structure

```
tests/
├── conftest.py              # Test configuration and fixtures
├── test_auth.py            # Authentication tests
├── test_charity_api.py     # Charity management tests
├── test_donation_api.py    # Donation system tests
├── test_payment_api.py     # Payment processing tests
├── test_story_api.py       # Story management tests
├── test_beneficiary_api.py # Beneficiary management tests
├── test_inventory_api.py   # Inventory management tests
└── test_admin_api.py       # Admin functionality tests
```

## 🚀 Running Tests

### Option 1: Interactive Test Runner
```bash
python run_tests.py
```

### Option 2: Run All Tests
```bash
source venv/bin/activate
python -m pytest tests/ -v
```

### Option 3: Run Specific Test Categories
```bash
# Authentication tests
python run_tests.py auth

# Charity tests
python run_tests.py charity

# Payment tests
python run_tests.py payment
```

### Option 4: Run Individual Test Files
```bash
python -m pytest tests/test_auth.py -v
python -m pytest tests/test_donation_api.py -v
```

## 🔧 Test Configuration

### Test Database
- Uses SQLite in-memory database for testing
- Automatically created and destroyed for each test
- No impact on your development database

### Test Fixtures
- **app**: Flask application instance
- **client**: Test client for making requests
- **donor_user**: Test donor user
- **charity_user**: Test charity user
- **admin_user**: Test admin user
- **approved_charity**: Test approved charity
- **auth_headers_***: Authorization headers for different user types

## 📊 Test Coverage

### Authentication Tests (`test_auth.py`)
- ✅ User registration (success, duplicate email, missing fields)
- ✅ User login (success, invalid credentials, non-existent user)
- ✅ Protected endpoint access (with/without token)

### Charity Management Tests (`test_charity_api.py`)
- ✅ Charity application submission
- ✅ Application approval/rejection by admin
- ✅ Public charity listing
- ✅ Charity details retrieval
- ✅ Charity dashboard (donors, donations)
- ✅ Authorization checks

### Donation Tests (`test_donation_api.py`)
- ✅ One-time donations
- ✅ Recurring donation setup
- ✅ Donation history retrieval
- ✅ Invalid charity/amount handling
- ✅ Authorization checks

### Payment Tests (`test_payment_api.py`)
- ✅ Mpesa payment initiation
- ✅ Payment callback handling (success/failure)
- ✅ Payment verification
- ✅ Error scenarios
- ✅ Authorization checks

### Story Management Tests (`test_story_api.py`)
- ✅ Story creation by charities
- ✅ Public story listing
- ✅ Story updates and deletion
- ✅ Authorization checks

### Beneficiary Tests (`test_beneficiary_api.py`)
- ✅ Beneficiary creation
- ✅ Beneficiary listing by charity
- ✅ Beneficiary updates
- ✅ Inventory assignment tracking
- ✅ Authorization checks

### Inventory Tests (`test_inventory_api.py`)
- ✅ Inventory item creation
- ✅ Inventory listing by charity
- ✅ Item distribution tracking
- ✅ Beneficiary assignment
- ✅ Authorization checks

### Admin Tests (`test_admin_api.py`)
- ✅ Dashboard statistics
- ✅ Recent activities monitoring
- ✅ Charity approval/rejection
- ✅ System oversight functions
- ✅ Authorization checks

## 🛠️ Quick API Verification

### Basic API Test Script
```bash
python test_api_basic.py
```

This script performs basic connectivity tests:
1. User registration
2. User login
3. Protected endpoint access
4. Public endpoint access

### Manual Testing with Postman
Refer to `POSTMAN_TESTING_GUIDE.md` for comprehensive manual testing instructions.

## 📈 Test Results Example

```bash
$ python run_tests.py

🚀 Running Tuinue Wasichana API Tests...
==================================================

tests/test_auth.py::test_user_registration_success PASSED
tests/test_auth.py::test_user_login_success PASSED
tests/test_charity_api.py::test_charity_application_success PASSED
tests/test_donation_api.py::test_make_donation_success PASSED
tests/test_payment_api.py::test_initiate_mpesa_payment_success PASSED
...

✅ All tests passed successfully!
```

## 🔍 Test Data

### Sample Test Users
- **Donor**: `donor@test.com` / `password123`
- **Charity**: `charity@test.com` / `password123`
- **Admin**: `admin@test.com` / `password123`

### Sample Test Data
- **Charity**: "Test Charity Organization"
- **Donation Amount**: $100.00
- **Phone Number**: "254712345678"
- **Transaction ID**: "TEST123456789"

## 🚨 Common Issues & Solutions

### Issue: Connection Error
**Problem**: `Connection error - make sure the server is running`
**Solution**: Start the Flask development server:
```bash
source venv/bin/activate
flask run
```

### Issue: Database Migration Error
**Problem**: `Table doesn't exist`
**Solution**: Run database migrations:
```bash
flask db upgrade
```

### Issue: Import Errors
**Problem**: `ModuleNotFoundError`
**Solution**: Ensure virtual environment is activated:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: JWT Token Errors
**Problem**: `Token has expired` or `Invalid token`
**Solution**: Tokens are automatically generated in tests. For manual testing, get fresh tokens through login.

## 📋 Testing Checklist

### Before Running Tests
- [ ] Virtual environment activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Database migrations applied (`flask db upgrade`)
- [ ] Environment variables set (`.env` file)

### Test Categories to Run
- [ ] Authentication tests
- [ ] Charity management tests
- [ ] Donation system tests
- [ ] Payment processing tests
- [ ] Story management tests
- [ ] Beneficiary management tests
- [ ] Inventory management tests
- [ ] Admin functionality tests

### Manual Testing
- [ ] Postman collection imported
- [ ] Environment variables configured
- [ ] All endpoints tested
- [ ] Error scenarios verified

## 🎯 Next Steps

1. **Run the basic API test**: `python test_api_basic.py`
2. **Run the full test suite**: `python run_tests.py`
3. **Manual testing with Postman**: Follow `POSTMAN_TESTING_GUIDE.md`
4. **Performance testing**: Consider load testing for production
5. **Integration testing**: Test with real Mpesa sandbox

## 📞 Support

If you encounter issues:
1. Check the test output for specific error messages
2. Verify all services are running (Flask, PostgreSQL, Redis)
3. Ensure environment variables are properly set
4. Check the application logs for detailed error information

Happy Testing! 🎉