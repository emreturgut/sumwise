# Sumwise API Documentation

## Overview
Sumwise backend API built with Next.js App Router. This document outlines the available endpoints and their usage.

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://sumwise.ai/api`

## API Test Dashboard
Visit `/api-test` to test all endpoints interactively.

## Endpoints

### Health Check

#### GET /api/health
Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Sumwise API is running",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

---

### Authentication

#### POST /api/auth/signin
Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "demo@sumwise.ai",
  "password": "demo123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "1",
    "email": "demo@sumwise.ai",
    "name": "Demo User"
  },
  "token": "demo-jwt-token-1234567890"
}
```

**Error Responses:**
- `400`: Missing email or password
- `400`: Invalid email format
- `401`: Invalid credentials
- `500`: Server error

**Test Credentials:**
- Email: `demo@sumwise.ai`
- Password: `demo123`

#### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "user-1234567890",
    "email": "user@example.com",
    "name": "user",
    "createdAt": "2025-01-01T12:00:00.000Z"
  },
  "token": "demo-jwt-token-1234567890"
}
```

**Error Responses:**
- `400`: Missing required fields
- `400`: Invalid email format
- `400`: Password too short (minimum 6 characters)
- `400`: Passwords don't match
- `409`: User already exists
- `500`: Server error

**Test Case for Existing User:**
- Email: `existing@sumwise.ai` (will return 409 error)

---

### Test Endpoints

#### GET /api/test
Test endpoint for GET requests.

**Response:**
```json
{
  "message": "Test endpoint is working!",
  "methods": ["GET", "POST"],
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

#### POST /api/test
Test endpoint for POST requests.

**Request Body:** (Any JSON data)
```json
{
  "message": "Hello from test!"
}
```

**Response:**
```json
{
  "message": "Test POST endpoint is working!",
  "receivedData": {
    "message": "Hello from test!"
  },
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

---

## Testing the API

### Using the Web Interface
1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000/api-test`
3. Use the interactive dashboard to test endpoints

### Using curl

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

**Sign In:**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@sumwise.ai","password":"demo123"}'
```

**Sign Up:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","confirmPassword":"test123"}'
```

**Test Endpoint:**
```bash
curl http://localhost:3000/api/test

curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from test!"}'
```

---

## Development Notes

### Current Implementation
- **Authentication**: Mock implementation with hardcoded test user
- **Database**: None (using in-memory simulation)
- **Password Hashing**: Not implemented yet
- **JWT Tokens**: Mock tokens generated

### TODO for Production
- [ ] Implement real database (PostgreSQL, MongoDB, etc.)
- [ ] Add password hashing (bcrypt)
- [ ] Implement proper JWT token generation and validation
- [ ] Add middleware for authentication
- [ ] Add rate limiting
- [ ] Add input sanitization
- [ ] Add comprehensive error handling
- [ ] Add logging
- [ ] Add API documentation with Swagger/OpenAPI
- [ ] Add CORS configuration
- [ ] Add environment variables for configuration

### Project Structure
```
app/
├── api/
│   ├── health/
│   │   └── route.ts          # Health check endpoint
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   │   └── route.ts      # Sign in endpoint
│   │   │   └── signup/
│   │   │       └── route.ts      # Sign up endpoint
│   │   └── test/
│   │       └── route.ts          # Test endpoints
│   ├── api-test/
│   │   └── page.tsx              # API test dashboard
│   ├── signin/
│   │   └── page.tsx              # Sign in page
│   ├── signup/
│   │   └── page.tsx              # Sign up page
│   └── page.tsx                  # Home page
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `409`: Conflict
- `500`: Internal Server Error 