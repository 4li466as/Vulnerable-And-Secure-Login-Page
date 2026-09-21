import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getDb } from '@/lib/db';

const execAsync = promisify(exec);

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, isSecure } = body;

    // 7. Verbose Error Handling (Information Leakage via Type Confusion)
    let normalizedEmail = '';
    try {
      // If an attacker sends {"email": 1234} instead of a string, this throws a TypeError!
      normalizedEmail = email.toLowerCase();
    } catch (e: any) {
      if (!isSecure) {
         // UNHARDENED: Dumps the raw V8 engine stack trace back to the browser
         return NextResponse.json({ error: e.stack }, { status: 500 });
      } else {
         // HARDENED: Logs internally, shows safe message
         console.error("[Secure Log] Type validation error:", e.message);
         return NextResponse.json({ error: 'Invalid input format for email.' }, { status: 400 });
      }
    }

    // 1. Request Throttling / Concurrency Control
    if (isSecure) {
      const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
      const now = Date.now();
      const windowMs = 60 * 1000;
      
      const record = rateLimitMap.get(ip) || { count: 0, timestamp: now };
      if (now - record.timestamp > windowMs) {
        record.count = 0;
        record.timestamp = now;
      }
      record.count += 1;
      rateLimitMap.set(ip, record);

      if (record.count > 5) {
        return NextResponse.json({ error: 'Too many requests from this IP, please try again after a minute.' }, { status: 429 });
      }
    }

    const database = getDb();
    
    return new Promise<NextResponse>((resolve) => {
      if (!isSecure) {
        // UNHARDENED: SQLi Vulnerable
        const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
        database.get(query, async (err: any, row: any) => {
          await handleResponse(err, row, email, isSecure, resolve, database);
        });
      } else {
        // HARDENED: Parameterized Query
        const query = `SELECT * FROM users WHERE email = ?`;
        database.get(query, [email], async (err: any, row: any) => {
          if (err || !row) return await handleResponse(err, null, email, isSecure, resolve, database);

          const isValid = await bcrypt.compare(password, row.password_hash);
          await handleResponse(null, isValid ? row : null, email, isSecure, resolve, database);
        });
      }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

async function handleResponse(
  err: any, 
  row: any, 
  email: string, 
  isSecure: boolean, 
  resolve: (val: any) => void,
  database: any
) {
  if (err) return resolve(NextResponse.json({ error: 'Database error' }, { status: 500 }));

  if (row) {
    // We safely use the email pulled directly from the database row (e.g. admin@admin.com), NOT the raw input string.
    let feedback = `Welcome back, <strong>${row.email}</strong>!`;
    resolve(NextResponse.json({ success: true, message: feedback, userId: row.id }));
  } else {
    // 5. Blind OS Command Injection
    if (!isSecure) {
      try {
        // UNHARDENED: Vulnerable to command injection, but NO OUTPUT is returned to the user (Blind)
        // A hacker can test this by injecting `& ping -n 5 127.0.0.1` and observing the 5-second delay.
        await execAsync(`echo Failed login for ${email}`);
      } catch (e: any) {
        // Fail silently
      }
    } else {
      console.log(`[Secure Logger]: Failed login for ${email}`);
    }
    
    resolve(NextResponse.json({ success: false, error: `Invalid credentials` }, { status: 401 }));
  }
}
