# Sumwise AI - Content Summarization Platform

Sumwise is an AI-powered content summarization platform that helps users quickly extract key insights from articles, videos, web pages, and documents.

## Features

- 🤖 AI-powered content summarization
- 📊 Interactive dashboard with animated features
- 🔐 User authentication and session management  
- 📱 Responsive design with modern UI
- 🗄️ PostgreSQL database integration
- 🔍 API testing dashboard
- 🐳 Docker containerization

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Docker
- **Authentication**: JWT with bcrypt
- **UI Components**: Radix UI, Lucide Icons

## Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Docker and Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-summarizer
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up PostgreSQL Database

```bash
# Create environment variables file
cp .env.example .env.local

# Start PostgreSQL with Docker
npm run docker:up

# This will start:
# - PostgreSQL on port 5432
# - pgAdmin on port 5050
```

### 4. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Database Setup

The application uses PostgreSQL with Docker for local development. See [SETUP_POSTGRESQL.md](./SETUP_POSTGRESQL.md) for detailed setup instructions.

### Quick Commands

```bash
# Start database
npm run docker:up

# Stop database  
npm run docker:down

# Reset database (removes all data)
npm run db:reset

# View database logs
npm run docker:logs
```

### Test Credentials

```
Email: demo@sumwise.ai
Password: demo123
```

## API Documentation

### Available Endpoints

- `GET /api/health` - Health check with database status
- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signup` - User registration
- `GET/POST /api/test` - Test endpoints

### Interactive Testing

Visit `http://localhost:3000/api-test` for an interactive API testing dashboard.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   ├── health/       # Health check
│   │   └── test/         # Test endpoints
│   ├── signin/           # Sign in page
│   ├── signup/           # Sign up page
│   ├── api-test/         # API testing dashboard
│   └── page.tsx          # Home page
├── lib/                   # Utility libraries
│   ├── database.ts       # Database connection and queries
│   └── auth.ts           # Authentication utilities
├── database/             # Database initialization
│   └── init/            # SQL scripts for setup
├── components/           # React components
├── docker-compose.yml    # Docker configuration
└── SETUP_POSTGRESQL.md   # Database setup guide
```

## Development

### Database Management

Access pgAdmin at `http://localhost:5050`:
- Email: `admin@sumwise.ai`
- Password: `admin123`

### Environment Variables

Required variables in `.env.local`:

```env
DATABASE_URL="postgresql://sumwise_user:sumwise_password@localhost:5432/sumwise_db"
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint

# Docker commands
npm run docker:up    # Start PostgreSQL
npm run docker:down  # Stop PostgreSQL
npm run docker:logs  # View logs
npm run db:reset     # Reset database
```

## Features Overview

### Frontend

- **Dynamic homepage** with typewriter animations
- **User authentication** pages (sign in/up)
- **Responsive design** for all devices
- **Interactive features** with Framer Motion
- **Modern UI components** with Tailwind CSS

### Backend

- **RESTful API** with Next.js API routes
- **PostgreSQL integration** with connection pooling
- **JWT authentication** with secure session management
- **Password hashing** with bcrypt
- **Error handling** and validation
- **Health monitoring** endpoints

### Database

- **User management** with proper authentication
- **Session tracking** for security
- **Future-ready schema** for content summaries
- **Automated initialization** with Docker
- **Sample data** for testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

### Manual Testing

1. Visit `http://localhost:3000/api-test`
2. Test all API endpoints interactively
3. Check database connectivity
4. Test user registration and login

### API Testing with curl

```bash
# Health check
curl http://localhost:3000/api/health

# Sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@sumwise.ai","password":"demo123"}'
```

## Deployment

### Production Setup

1. Set up PostgreSQL database (not Docker)
2. Configure environment variables
3. Build the application: `npm run build`
4. Start production server: `npm start`

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-super-secure-random-secret"
NODE_ENV="production"
```

## Troubleshooting

### Common Issues

1. **Database connection failed**: Ensure Docker is running
2. **Port conflicts**: Check if ports 3000, 5432, or 5050 are in use
3. **Environment variables**: Make sure `.env.local` exists and is properly configured

### Getting Help

- Check [SETUP_POSTGRESQL.md](./SETUP_POSTGRESQL.md) for database issues
- View logs: `npm run docker:logs`
- Reset everything: `npm run db:reset`

## License

This project is licensed under the MIT License - see the LICENSE file for details. 