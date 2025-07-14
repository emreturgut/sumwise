import { Pool, PoolClient } from 'pg'

// Global connection pool
let pool: Pool | null = null

// Initialize database connection pool
function initializePool(): Pool {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL || 'postgresql://sumwise_user:sumwise_password@localhost:5432/sumwise_db',
            max: 20, // Maximum number of clients in the pool
            idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
            connectionTimeoutMillis: 2000, // How long to wait for a connection
        })

        // Handle pool errors
        pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err)
        })
    }
    return pool
}

// Get database connection
export async function getDbConnection(): Promise<PoolClient> {
    const dbPool = initializePool()
    try {
        const client = await dbPool.connect()
        return client
    } catch (error) {
        console.error('Error connecting to database:', error)
        throw error
    }
}

// Execute a query with automatic connection management
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const client = await getDbConnection()
    try {
        const result = await client.query(text, params)
        return result.rows as T[]
    } catch (error) {
        console.error('Database query error:', error)
        throw error
    } finally {
        client.release()
    }
}

// Execute a single query and return first row
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
    const results = await query<T>(text, params)
    return results.length > 0 ? results[0] : null
}

// Execute multiple queries in a transaction
export async function transaction<T>(
    callback: (client: PoolClient) => Promise<T>
): Promise<T> {
    const client = await getDbConnection()
    try {
        await client.query('BEGIN')
        const result = await callback(client)
        await client.query('COMMIT')
        return result
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Transaction error:', error)
        throw error
    } finally {
        client.release()
    }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
    try {
        const result = await query('SELECT NOW() as current_time')
        console.log('Database connected successfully:', result[0]?.current_time)
        return true
    } catch (error) {
        console.error('Database connection test failed:', error)
        return false
    }
}

// Clean up pool on app shutdown
export async function closePool(): Promise<void> {
    if (pool) {
        await pool.end()
        pool = null
        console.log('Database pool closed')
    }
}

// User-related database operations
export const userDb = {
    // Find user by email
    async findByEmail(email: string) {
        return await queryOne<{
            id: number
            email: string
            password_hash: string
            name: string
            created_at: string
            is_active: boolean
            email_verified: boolean
        }>('SELECT * FROM users WHERE email = $1', [email])
    },

    // Create new user
    async create(email: string, passwordHash: string, name?: string) {
        return await queryOne<{
            id: number
            email: string
            name: string
            created_at: string
        }>(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
            [email, passwordHash, name || email.split('@')[0]]
        )
    },

    // Update last login
    async updateLastLogin(userId: number) {
        await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [userId])
    },

    // Get user by ID
    async findById(id: number) {
        return await queryOne<{
            id: number
            email: string
            name: string
            created_at: string
            is_active: boolean
            email_verified: boolean
        }>('SELECT id, email, name, created_at, is_active, email_verified FROM users WHERE id = $1', [id])
    }
}

// Session-related database operations
export const sessionDb = {
    // Create session
    async create(userId: number, tokenHash: string, expiresAt: Date, ipAddress?: string, userAgent?: string) {
        return await queryOne<{
            id: number
            token_hash: string
            expires_at: string
        }>(
            'INSERT INTO sessions (user_id, token_hash, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5) RETURNING id, token_hash, expires_at',
            [userId, tokenHash, expiresAt, ipAddress, userAgent]
        )
    },

    // Find valid session
    async findValid(tokenHash: string) {
        return await queryOne<{
            id: number
            user_id: number
            expires_at: string
        }>('SELECT * FROM sessions WHERE token_hash = $1 AND expires_at > CURRENT_TIMESTAMP', [tokenHash])
    },

    // Delete session
    async delete(tokenHash: string) {
        await query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash])
    },

    // Clean expired sessions
    async cleanExpired() {
        const result = await query('DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP')
        return result
    }
} 