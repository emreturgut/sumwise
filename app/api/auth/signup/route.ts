import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
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

        // TODO: Check if user already exists
        // TODO: Hash password before storing
        // TODO: Store user in database

        // Simulate user already exists check
        if (email === 'existing@sumwise.ai') {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            )
        }

        // Simulate successful registration
        const newUser = {
            id: 'user-' + Date.now(),
            email: email,
            name: email.split('@')[0],
            createdAt: new Date().toISOString()
        }

        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
            user: newUser,
            token: 'demo-jwt-token-' + Date.now()
        }, { status: 201 })

    } catch (error) {
        console.error('Sign up error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 