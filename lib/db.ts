import { Pool } from 'pg'

declare global {
    var pool: Pool | undefined
}

export const pool =
    globalThis.pool ??
    new Pool({
        host: 'aws-1-ap-northeast-1.pooler.supabase.com',
        port: 6543,
        database: 'postgres',
        user: 'postgres.jvplgcmiwkzlzcdjuesq',  // ← full username for pooler
        password: 'ChessMate2024',
        ssl: { rejectUnauthorized: false },
    })

if (process.env.NODE_ENV !== 'production') globalThis.pool = pool