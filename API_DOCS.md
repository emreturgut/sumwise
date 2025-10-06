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

### Text Summarization

#### POST /api/summarize
Summarize text using AWS Bedrock with Mistral Pixtral Large model.

**Request Body:**
```json
{
  "text": "Your long text to summarize here...",
  "language": "tr",
  "summary_length": "medium",
  "bullet_points": false,
  "custom_prompt": "Optional custom prompt"
}
```

**Request Parameters:**
- `text` (required): The text to summarize (minimum 100 characters)
- `language` (optional): Language code (`tr`, `en`, etc.) - auto-detected if not provided
- `summary_length` (optional): Length of summary - `short`, `medium` (default), or `long`
- `bullet_points` (optional): Return summary as bullet points (default: `false`)
- `custom_prompt` (optional): Custom prompt for summarization

**Success Response (200):**
```json
{
  "summary": "Your summarized text here...",
  "original_length": 1500,
  "summary_length": 250,
  "detected_language": "tr",
  "processing_time": 3.45,
  "model_used": "eu.mistral.pixtral-large-2502-v1:0",
  "chunks_processed": 1
}
```

**Error Responses:**
- `400`: Text too short (minimum 100 characters)
- `500`: Summarization failed or Bedrock service unavailable

**Features:**
- Automatically chunks long texts for processing
- Supports Turkish, English, and other languages
- Customizable summary length and format
- Smart paragraph and sentence-based chunking
- Multiple chunks are summarized and then combined into a final summary

#### GET /api/summarize
Health check for the summarization service.

**Response:**
```json
{
  "status": "healthy",
  "service": "Sumwise Text Summarization",
  "bedrock_available": true,
  "model_id": "eu.mistral.pixtral-large-2502-v1:0",
  "region": "eu-central-1"
}
```

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

**Summarize Text:**
```bash
# Basic summarization
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your long text here... (minimum 100 characters)",
    "summary_length": "medium"
  }'

# With all options
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your long text here...",
    "language": "tr",
    "summary_length": "short",
    "bullet_points": true
  }'

# Check summarization service health
curl http://localhost:3000/api/summarize
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