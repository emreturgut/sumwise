import { NextRequest, NextResponse } from 'next/server'
import { signUpUser } from '@/lib/auth'
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
        const { email, password, confirmPassword } = body

        // Input validation
        if (!email || !password || !confirmPassword) {
            return NextResponse.json(
                { error: 'Email, password, and password confirmation are required' },
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

        // Password validation
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            )
        }

        // Password confirmation validation
        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            )
        }

        // Create user account
        const result = await signUpUser(email, password)

        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
            user: result.user,
            token: result.token
        }, { status: 201 })

    } catch (error: any) {
        console.error('Sign up error:', error)

        // Handle specific signup errors
        if (error.message === 'User with this email already exists') {
            return NextResponse.json(
                { error: error.message },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 