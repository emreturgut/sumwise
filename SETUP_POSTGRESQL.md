# PostgreSQL Setup Guide

This guide will help you set up PostgreSQL with Docker for the Sumwise application.

## Prerequisites

- Docker and Docker Compose installed on your machine
- Node.js and npm/pnpm installed

## Step-by-Step Setup

### 1. Clone and Install Dependencies

```bash
# Install new dependencies
npm install
# or
pnpm install
```

### 2. Create Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add the following environment variables to `.env.local`:

```env
# Database Configuration
DATABASE_URL="postgresql://sumwise_user:sumwise_password@localhost:5432/sumwise_db"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sumwise_db
DB_USER=sumwise_user
DB_PASSWORD=sumwise_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# App Configuration
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Start PostgreSQL with Docker

```bash
# Start PostgreSQL and pgAdmin
npm run docker:up

# Or manually with docker compose
docker compose up -d
```

This will start:
- **PostgreSQL** on port `5432`
- **pgAdmin** on port `5050` (optional database management UI)

### 4. Verify Database Setup

The database will be automatically initialized with:
- Database tables (users, sessions, summaries)
- Sample data for testing
- Proper indexes and triggers

### 5. Test the Setup

```bash
# Start the Next.js application
npm run dev

# Test the API
curl http://localhost:3000/api/health
```

You should see a response like:
```json
{
  "status": "OK",
  "message": "Sumwise API is running",
  "database": {
    "connected": true,
    "message": "Database connected successfully"
  },
  "timestamp": "2025-01-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

### 6. Use the API Test Dashboard

Visit `http://localhost:3000/api-test` to test all endpoints interactively.

## Database Management

### pgAdmin Access

If you want to manage the database visually:

1. Open `http://localhost:5050` in your browser
2. Login with:
   - Email: `admin@sumwise.ai`
   - Password: `admin123`
3. Add server connection:
   - Host: `postgres` (container name)
   - Port: `5432`
   - Database: `sumwise_db`
   - Username: `sumwise_user`
   - Password: `sumwise_password`

### Docker Commands

```bash
# Start containers
npm run docker:up

# Stop containers
npm run docker:down

# View PostgreSQL logs
npm run docker:logs

# Reset database (removes all data)
npm run db:reset

# Connect to PostgreSQL directly
docker exec -it sumwise-postgres psql -U sumwise_user -d sumwise_db
```

## Testing Authentication

### Pre-seeded Test Users

The database comes with test users:

1. **Demo User**
   - Email: `demo@sumwise.ai`
   - Password: `demo123`
   - Status: Active, Email verified

2. **Test User**
   - Email: `test@example.com`
   - Password: `demo123`
   - Status: Active, Email not verified

3. **Existing User**
   - Email: `existing@sumwise.ai`
   - Password: `demo123`
   - Use this to test "user already exists" error

### API Testing

```bash
# Test sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@sumwise.ai","password":"demo123"}'

# Test sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"password123","confirmPassword":"password123"}'
```

## Database Schema

### Tables Created

1. **users** - User accounts
   - id, email, password_hash, name, created_at, updated_at
   - is_active, email_verified, last_login

2. **sessions** - JWT session management
   - id, user_id, token_hash, expires_at, created_at
   - ip_address, user_agent

3. **summaries** - Content summaries (for future features)
   - id, user_id, original_url, original_title
   - original_content, summary_text, summary_type

## Troubleshooting

### PostgreSQL Connection Issues

1. **Check if Docker is running:**
   ```bash
   docker ps
   ```

2. **Check container logs:**
   ```bash
   npm run docker:logs
   ```

3. **Reset everything:**
   ```bash
   npm run db:reset
   ```

### Port Conflicts

If ports 5432 or 5050 are already in use:

1. Stop the conflicting services
2. Or modify ports in `docker-compose.yml`
3. Update the DATABASE_URL in `.env.local`

### Environment Variables

Make sure `.env.local` exists and contains all required variables. The app will fall back to defaults but may not work correctly.

## Production Considerations

When deploying to production:

1. **Change JWT_SECRET** to a strong, random value
2. **Use environment-specific database credentials**
3. **Enable SSL for database connections**
4. **Set up proper backup strategy**
5. **Configure connection pooling**
6. **Set up monitoring and logging**

## Next Steps

With PostgreSQL set up, you can now:
- Use real authentication instead of mock data
- Store user sessions securely
- Develop summary storage features
- Scale the application with proper database support

The application now has a solid foundation for production deployment! 