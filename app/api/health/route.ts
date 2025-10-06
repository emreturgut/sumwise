import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/database'

export async function GET() {
    // Test database connection
    const dbConnected = await testConnection()

    return NextResponse.json({
        status: dbConnected ? 'OK' : 'WARNING',
        message: 'Sumwise API is running',
        database: {
            connected: dbConnected,
            message: dbConnected ? 'Database connected successfully' : 'Database connection failed'
        },
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    })
} 