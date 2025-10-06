import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userDb, sessionDb } from './database'

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Hash password
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verify JWT token
export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

// Create session with JWT
export async function createSession(userId: number, ipAddress?: string, userAgent?: string) {
    // Generate JWT token
    const token = generateToken({ userId, type: 'auth' })

    // Create token hash for database storage
    const tokenHash = await bcrypt.hash(token, 10)

    // Calculate expiration date (7 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Store session in database
    await sessionDb.create(userId, tokenHash, expiresAt, ipAddress, userAgent)

    return token
}

// Validate session
export async function validateSession(token: string): Promise<{ valid: boolean; userId?: number }> {
    try {
        // Verify JWT token structure
        const decoded = verifyToken(token)
        if (!decoded || !decoded.userId) {
            return { valid: false }
        }

        // Check if session exists in database
        const tokenHash = await bcrypt.hash(token, 10)
        const session = await sessionDb.findValid(tokenHash)

        if (!session) {
            return { valid: false }
        }

        return { valid: true, userId: session.user_id }
    } catch (error) {
        console.error('Session validation error:', error)
        return { valid: false }
    }
}

// Logout - invalidate session
export async function invalidateSession(token: string): Promise<void> {
    try {
        const tokenHash = await bcrypt.hash(token, 10)
        await sessionDb.delete(tokenHash)
    } catch (error) {
        console.error('Session invalidation error:', error)
    }
}

// Sign in user
export async function signInUser(email: string, password: string, ipAddress?: string, userAgent?: string) {
    // Find user by email
    const user = await userDb.findByEmail(email)
    if (!user) {
        throw new Error('Invalid email or password')
    }

    // Check if user is active
    if (!user.is_active) {
        throw new Error('Account is deactivated')
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
        throw new Error('Invalid email or password')
    }

    // Update last login
    await userDb.updateLastLogin(user.id)

    // Create session
    const token = await createSession(user.id, ipAddress, userAgent)

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: user.email_verified
        },
        token
    }
}

// Sign up user
export async function signUpUser(email: string, password: string, name?: string) {
    // Check if user already exists
    const existingUser = await userDb.findByEmail(email)
    if (existingUser) {
        throw new Error('User with this email already exists')
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const newUser = await userDb.create(email, passwordHash, name)
    if (!newUser) {
        throw new Error('Failed to create user')
    }

    // Create session
    const token = await createSession(newUser.id)

    return {
        user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            emailVerified: false
        },
        token
    }
}

// Get user from token
export async function getUserFromToken(token: string) {
    const session = await validateSession(token)
    if (!session.valid || !session.userId) {
        return null
    }

    const user = await userDb.findById(session.userId)
    if (!user) {
        return null
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.email_verified
    }
}

// Clean expired sessions (run periodically)
export async function cleanExpiredSessions() {
    try {
        await sessionDb.cleanExpired()
        console.log('Expired sessions cleaned')
    } catch (error) {
        console.error('Error cleaning expired sessions:', error)
    }
} 