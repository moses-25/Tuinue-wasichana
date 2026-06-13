# Tuinue Wasichana API - Postman Testing Guide

This guide provides comprehensive instructions for testing all API endpoints using Postman.

## 📋 Table of Contents

1. [Setup](#setup)
2. [Environment Variables](#environment-variables)
3. [Authentication Flow](#authentication-flow)
4. [API Endpoints Testing](#api-endpoints-testing)
5. [Test Scenarios](#test-scenarios)
6. [Error Handling](#error-handling)

## 🚀 Setup

### Prerequisites
- Postman installed
- Backend server running on `http://localhost:5000`
- PostgreSQL database running
- Redis server running (for Celery tasks)

### Base URL
```
http://localhost:5000/api/v1
```

## 🔧 Environment Variables

Create a Postman environment with the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | `http://localhost:5000/api/v1` | API base URL |
| `donor_token` | `{{donor_access_token}}` | Donor JWT token |
| `charity_token` | `{{charity_access_token}}` | Charity JWT token |
| `admin_token` | `{{admin_access_token}}` | Admin JWT token |
| `charity_id` | `1` | Sample charity ID |
| `donation_id` | `1` | Sample donation ID |

## 🔐 Authentication Flow

### 1. User Registration

**Endpoint:** `POST /users/register`

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "donor"
}
```

**Expected Response (201):**
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor",
    "created_at": "2024-01-01T10:00:00"
}
```

### 2. User Login

**Endpoint:** `POST /users/login`

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Expected Response (200):**
```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "donor"
    }
}
```

**⚠️ Important:** Copy the `access_token` and set it in your environment variables.

### 3. Test Protected Endpoint

**Endpoint:** `GET /users/protected`

**Headers:**
```
Authorization: Bearer {{donor_token}}
```

**Expected Response (200):**
```json
{
    "message": "Hello John Doe! You are donor."
}
```

## 📊 API Endpoints Testing

### 👤 User Management

#### Register Different User Types

1. **Register Donor:**
```json
POST /users/register
{
    "name": "Jane Donor",
    "email": "donor@test.com",
    "password": "password123",
    "role": "donor"
}
```

2. **Register Charity User:**
```json
POST /users/register
{
    "name": "Charity Manager",
    "email": "charity@test.com",
    "password": "password123",
    "role": "charity"
}
```

3. **Register Admin:**
```json
POST /users/register
{
    "name": "System Admin",
    "email": "admin@test.com",
    "password": "password123",
    "role": "admin"
}
```

### 🏢 Charity Management

#### 1. Apply for Charity Status

**Endpoint:** `POST /charities/apply`

**Headers:**
```
Authorization: Bearer {{donor_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
    "organization_name": "Help Children Foundation",
    "mission": "To provide education and healthcare to underprivileged children"
}
```

**Expected Response (201):**
```json
{
    "id": 1,
    "user_id": 1,
    "organization_name": "Help Children Foundation",
    "mission": "To provide education and healthcare to underprivileged children",
    "status": "pending",
    "submitted_at": "2024-01-01T10:00:00",
    "reviewed_at": null
}
```

#### 2. Get All Charity Applications (Admin Only)

**Endpoint:** `GET /charities/applications`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

#### 3. Approve Charity Application (Admin Only)

**Endpoint:** `POST /charities/applications/{application_id}/approve`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

#### 4. Get Approved Charities (Public)

**Endpoint:** `GET /charities/`

**No authentication required**

**Expected Response (200):**
```json
[
    {
        "id": 1,
        "owner_id": 1,
        "name": "Help Children Foundation",
        "description": "To provide education and healthcare to underprivileged children",
        "status": "approved",
        "created_at": "2024-01-01T10:00:00"
    }
]
```

#### 5. Get Charity Details

**Endpoint:** `GET /charities/{charity_id}`

**Expected Response (200):**
```json
{
    "id": 1,
    "owner_id": 1,
    "name": "Help Children Foundation",
    "description": "To provide education and healthcare to underprivileged children",
    "status": "approved",
    "created_at": "2024-01-01T10:00:00"
}
```

### 💰 Donation Management

#### 1. Make a Donation

**Endpoint:** `POST /donations/donate`

**Headers:**
```
Authorization: Bearer {{donor_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
    "charity_id": 1,
    "amount": 100.00,
    "recurring": false,
    "is_anonymous": false,
    "payment_method": "mpesa",
    "transaction_id": "TEST123456789"
}
```

**Expected Response (201):**
```json
{
    "id": 1,
    "user_id": 1,
    "charity_id": 1,
    "amount": "100.00",
    "recurring": false,
    "status": "complete",
    "is_anonymous": false,
    "timestamp": "2024-01-01T10:00:00"
}
```

#### 2. Setup Recurring Donation

**Endpoint:** `POST /donations/recurring`

**Headers:**
```
Authorization: Bearer {{donor_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
    "charity_id": 1,
    "amount": 50.00,
    "is_anonymous": false
}
```

#### 3. Get My Donations

**Endpoint:** `GET /donations/my-donations`

**Headers:**
```
Authorization: Bearer {{donor_token}}
```

### 💳 Payment Processing

#### 1. Initiate Mpesa Payment

**Endpoint:** `POST /payments/mpesa`

**Headers:**
```
Authorization: Bearer {{donor_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
    "phone_number": "254712345678",
    "amount": 100.00,
    "charity_id": 1,
    "recurring": false,
    "is_anonymous": false
}
```

**Expected Response (200):**
```json
{
    "success": true,
    "message": "STK push initiated successfully",
    "donation_id": 1,
    "checkout_request_id": "ws_CO_123456789"
}
```

#### 2. Payment Callback (Webhook)

**Endpoint:** `POST /payments/verify`

**Request Body (Success):**
```json
{
    "Body": {
        "stkCallback": {
            "MerchantRequestID": "MR_123456789",
            "CheckoutRequestID": "ws_CO_123456789",
            "ResultCode": 0,
            "ResultDesc": "The service request is processed successfully.",
            "CallbackMetadata": {
                "Item": [
                    {
                        "Name": "Amount",
                        "Value": 100.00
                    },
                    {
                        "Name": "MpesaReceiptNumber",
                        "Value": "MPX123456789"
                    },
                    {
                        "Name": "PhoneNumber",
                        "Value": 254712345678
                    }
                ]
            }
        }
    }
}
```

### 📖 Story Management

#### 1. Create Story (Charity Only)

**Endpoint:** `POST /stories/`

**Headers:**
```
Authorization: Bearer {{charity_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
    "title": "Our Impact in 2024",
    "content": "This year we helped 500 children get access to quality education..."
}
```

#### 2. Get All Stories (Public)

**Endpoint:** `GET /stories/`

#### 3. Update Story

**Endpoint:** `PUT /stories/{story_id}`

**Headers:**
```
Authorization: Bearer {{charity_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
    "title": "Updated Title",
    "content": "Updated content..."
}
```

### 👥 Beneficiary Management

#### 1. Create Beneficiary

**Endpoint:** `POST /beneficiaries/charities/{charity_id}/beneficiaries`

**Headers:**
```
Authorization: Bearer {{charity_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "John Doe",
    "description": "A 10-year-old student who needs school supplies"
}
```

#### 2. Get Charity Beneficiaries

**Endpoint:** `GET /beneficiaries/charities/{charity_id}/beneficiaries`

**Headers:**
```
Authorization: Bearer {{charity_token}}
```

#### 3. Update Beneficiary

**Endpoint:** `PUT /beneficiaries/{beneficiary_id}`

**Headers:**
```
Authorization: Bearer {{charity_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "John Updated",
    "description": "Updated description",
    "inventory_given": true
}
```

### 📦 Inventory Management

#### 1. Create Inventory Item

**Endpoint:** `POST /inventory/charities/{charity_id}/inventory`

**Headers:**
```
Authorization: Bearer {{charity_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
    "item_name": "School Books",
    "quantity": 50,
    "beneficiary_id": 1
}
```

#### 2. Get Charity Inventory

**Endpoint:** `GET /inventory/charities/{charity_id}/inventory`

**Headers:**
```
Authorization: Bearer {{charity_token}}
```

#### 3. Update Inventory Item

**Endpoint:** `PUT /inventory/{item_id}`

**Headers:**
```
Authorization: Bearer {{charity_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
    "item_name": "Updated Item Name",
    "quantity": 75,
    "beneficiary_id": 2
}
```

### 🔧 Admin Management

#### 1. Get Dashboard Stats

**Endpoint:** `GET /admin/dashboard`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
{
    "total_users": 10,
    "total_charities": 5,
    "approved_charities": 3,
    "pending_applications": 2,
    "total_donations": 25,
    "total_donation_amount": "5000.00"
}
```

#### 2. Get Recent Activities

**Endpoint:** `GET /admin/activities`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

#### 3. Approve Charity

**Endpoint:** `POST /admin/charities/{charity_id}/approve`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

#### 4. Reject Charity

**Endpoint:** `POST /admin/charities/{charity_id}/reject`

**Headers:**
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
    "reason": "Insufficient documentation provided"
}
```

## 🧪 Test Scenarios

### Scenario 1: Complete Donor Journey

1. Register as donor
2. Login and get token
3. View available charities
4. Make a donation
5. Setup recurring donation
6. View donation history

### Scenario 2: Charity Management Flow

1. Register as donor
2. Apply for charity status
3. Admin approves application
4. Login as charity user
5. Create stories
6. Add beneficiaries
7. Manage inventory
8. View donors and donations

### Scenario 3: Admin Workflow

1. Login as admin
2. View dashboard statistics
3. Review charity applications
4. Approve/reject applications
5. Monitor recent activities

### Scenario 4: Payment Processing

1. Initiate Mpesa payment
2. Simulate payment callback
3. Verify payment status
4. Check donation completion

## ❌ Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
    "message": "Missing required fields"
}
```

#### 401 Unauthorized
```json
{
    "message": "Missing Authorization Header"
}
```

#### 403 Forbidden
```json
{
    "message": "Access forbidden: Insufficient role"
}
```

#### 404 Not Found
```json
{
    "message": "Resource not found"
}
```

#### 409 Conflict
```json
{
    "message": "User with that email already exists"
}
```

#### 500 Internal Server Error
```json
{
    "message": "Internal server error"
}
```

## 📝 Testing Checklist

### Authentication
- [ ] User registration (donor, charity, admin)
- [ ] User login
- [ ] Protected endpoint access
- [ ] Invalid credentials handling
- [ ] Token expiration

### Charity Management
- [ ] Charity application submission
- [ ] Application approval/rejection
- [ ] Public charity listing
- [ ] Charity details retrieval

### Donations
- [ ] One-time donation
- [ ] Recurring donation setup
- [ ] Anonymous donations
- [ ] Donation history

### Payments
- [ ] Mpesa payment initiation
- [ ] Payment callback handling
- [ ] Payment failure scenarios

### Stories
- [ ] Story creation
- [ ] Story listing
- [ ] Story updates
- [ ] Story deletion

### Beneficiaries
- [ ] Beneficiary creation
- [ ] Beneficiary listing
- [ ] Beneficiary updates
- [ ] Inventory assignment

### Inventory
- [ ] Inventory item creation
- [ ] Inventory listing
- [ ] Item distribution tracking
- [ ] Inventory updates

### Admin Functions
- [ ] Dashboard statistics
- [ ] Activity monitoring
- [ ] Charity management
- [ ] User oversight

## 🚀 Quick Start Collection

Import this Postman collection to get started quickly:

```json
{
    "info": {
        "name": "Tuinue Wasichana API",
        "description": "Complete API testing collection for Tuinue Wasichana platform"
    },
    "variable": [
        {
            "key": "base_url",
            "value": "http://localhost:5000/api/v1"
        }
    ]
}
```

## 📞 Support

If you encounter any issues while testing:

1. Check server logs for detailed error messages
2. Verify database connectivity
3. Ensure all required services are running
4. Validate request headers and body format
5. Check authentication token validity

Happy Testing! 🎉