import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
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

        // TODO: Implement actual authentication logic
        // For now, we'll simulate a successful login
        if (email === 'demo@sumwise.ai' && password === 'demo123') {
            return NextResponse.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: '1',
                    email: email,
                    name: 'Demo User'
                },
                token: 'demo-jwt-token-' + Date.now()
            })
        }

        // Simulate authentication failure
        return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
        )

    } catch (error) {
        console.error('Sign in error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 