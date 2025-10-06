import { NextRequest, NextResponse } from 'next/server'

// GET endpoint for testing
export async function GET() {
    return NextResponse.json({
        message: 'Test endpoint is working!',
        methods: ['GET', 'POST'],
        timestamp: new Date().toISOString()
    })
}

// POST endpoint for testing
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        return NextResponse.json({
            message: 'Test POST endpoint is working!',
            receivedData: body,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        return NextResponse.json({
            message: 'Test POST endpoint is working!',
            note: 'No JSON body provided or invalid JSON',
            timestamp: new Date().toISOString()
        })
    }
} 