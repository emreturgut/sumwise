import { NextRequest, NextResponse } from 'next/server'
import { signInUser } from '@/lib/auth'
import { testConnection } from '@/lib/database'

export async function POST(request: NextRequest) {
    try {
        // Test database connection first
        const dbConnected = await testConnection()
        if (!dbConnected) {
            return NextResponse.json(
                { error: 'Database connection failed. Please ensure PostgreSQL is running.' },
                { status: 503 }
            )
        }

        const body = await request.json()
        const { email, password } = body

        // Input validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Get client IP and User-Agent for session tracking
        const ipAddress = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
        const userAgent = request.headers.get('user-agent') || 'unknown'

        // Authenticate user
        const result = await signInUser(email, password, ipAddress, userAgent)

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: result.user,
            token: result.token
        })

    } catch (error: any) {
        console.error('Sign in error:', error)

        // Handle specific authentication errors
        if (error.message === 'Invalid email or password' || error.message === 'Account is deactivated') {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 