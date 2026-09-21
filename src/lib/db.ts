import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Global connection pool
let pool: Pool | null = null;

class PgSqliteWrapper {
  constructor(private pool: Pool) {}

  get(query: string, params: any, cb?: (err: any, row: any) => void) {
    if (typeof params === 'function') {
      cb = params;
      params = [];
    }
    
    // Convert sqlite3 '?' to pg '$1', '$2', etc.
    let pgQuery = query;
    if (params && params.length > 0) {
      let i = 1;
      pgQuery = pgQuery.replace(/\?/g, () => `$${i++}`);
    }

    this.pool.query(pgQuery, params || [])
      .then(res => {
        if (cb) cb(null, res.rows[0]);
      })
      .catch(err => {
        console.error("PgSqliteWrapper GET error:", err, pgQuery);
        if (cb) cb(err, null);
      });
  }

  run(query: string, params: any, cb?: (err: any) => void) {
    if (typeof params === 'function') {
      cb = params;
      params = [];
    }
    
    // Convert sqlite3 '?' to pg '$1', '$2', etc.
    let pgQuery = query;
    if (params && params.length > 0) {
      let i = 1;
      pgQuery = pgQuery.replace(/\?/g, () => `$${i++}`);
    }

    this.pool.query(pgQuery, params || [])
      .then(res => {
        if (cb) {
          // sqlite3 binds 'this' to an object with `changes`
          cb.call({ changes: res.rowCount || 0, lastID: 0 }, null);
        }
      })
      .catch(err => {
        console.error("PgSqliteWrapper RUN error:", err, pgQuery);
        if (cb) cb.call({ changes: 0, lastID: 0 }, err);
      });
  }
}

let dbWrapper: PgSqliteWrapper;

export function getDb() {
  if (!pool) {
    // Uses the POSTGRES_URL environment variable provided by Vercel Postgres / Neon / Supabase
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
    });
    
    dbWrapper = new PgSqliteWrapper(pool);

    // Auto-seed the database on first connection
    pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT, 
        email TEXT, 
        password TEXT, 
        password_hash TEXT, 
        failed_attempts INT DEFAULT 0, 
        locked_until INT DEFAULT 0, 
        secret_data TEXT, 
        is_admin INT DEFAULT 0, 
        balance INT DEFAULT 100, 
        premium_status INT DEFAULT 0, 
        has_redeemed INT DEFAULT 0
      )
    `).then(async () => {
      const { rowCount } = await pool!.query('SELECT 1 FROM users LIMIT 1');
      if (rowCount === 0) {
        const adminHash = bcrypt.hashSync('admin', 10);
        await pool!.query(`INSERT INTO users VALUES (1, 'admin@admin.com', 'admin', $1, 0, 0, 'TOP SECRET: Server Root Password is "hunter2"', 1, 9999, 1, 1)`, [adminHash]);
        
        const userHash = bcrypt.hashSync('242293', 10);
        await pool!.query(`INSERT INTO users VALUES (2, '242293@gmail.com', '242293', $1, 0, 0, 'Standard user profile data. Nothing special.', 0, 50, 0, 0)`, [userHash]);
        console.log("Database seeded successfully.");
      }
    }).catch(err => console.error("DB Seed Error:", err));
  }
  
  return dbWrapper;
}
