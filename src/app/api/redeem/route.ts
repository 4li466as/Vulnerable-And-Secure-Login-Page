import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { isSecure } = await req.json();
    
    // Simulate resolving the user from a secure session token
    // In a real app, this comes from reading the HttpOnly cookie
    const loggedInUserId = 2; // Hardcoded to the test user for this lab

    const database = getDb();
    
    return new Promise<NextResponse>((resolve) => {
      // Step 1: Check if the user has already redeemed the $500 coupon
      database.get(`SELECT balance, has_redeemed FROM users WHERE id = ?`, [loggedInUserId], async (err, row: any) => {
        if (err || !row) return resolve(NextResponse.json({ error: 'User not found' }, { status: 404 }));
        
        if (row.has_redeemed === 1) {
          return resolve(NextResponse.json({ error: 'Coupon already redeemed!' }, { status: 400 }));
        }

        // 8. Business Logic Flaw (Race Condition / TOCTOU)
        if (!isSecure) {
          // UNHARDENED: There is a slow asynchronous process between the check and the update.
          // (e.g. validating the coupon with a third-party API)
          // If an attacker sends 10 requests at the exact same millisecond, all 10 will pass 
          // the 'has_redeemed === 0' check above before any of them reach the UPDATE statement below!
          await new Promise(r => setTimeout(r, 500)); // Simulate slow 3rd party API call

          const newBalance = row.balance + 500;
          database.run(`UPDATE users SET balance = ?, has_redeemed = 1 WHERE id = ?`, [newBalance, loggedInUserId], (updateErr) => {
            if (updateErr) return resolve(NextResponse.json({ error: 'Redeem failed' }, { status: 500 }));
            resolve(NextResponse.json({ success: true, message: `Redeemed! New balance: $${newBalance}` }));
          });
        } else {
          // HARDENED: Uses an atomic database operation or a database-level lock.
          // We enforce the condition directly inside the UPDATE statement.
          database.run(`UPDATE users SET balance = balance + 500, has_redeemed = 1 WHERE id = ? AND has_redeemed = 0`, [loggedInUserId], function(updateErr) {
            // @ts-ignore - sqlite3 run callback context has 'this.changes'
            if (updateErr || this.changes === 0) {
              return resolve(NextResponse.json({ error: 'Coupon already redeemed or failed.' }, { status: 400 }));
            }
            // Fetch updated balance for display
            database.get(`SELECT balance FROM users WHERE id = ?`, [loggedInUserId], (err, newRow: any) => {
               resolve(NextResponse.json({ success: true, message: `Redeemed securely! New balance: $${newRow.balance}` }));
            });
          });
        }
      });
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
