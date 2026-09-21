import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { targetUserId, isSecure } = await req.json();
    const database = getDb();
    
    // Simulate resolving the user from a secure HttpOnly session cookie
    const loggedInUserId = 2; // Hardcoded to the test user for this lab

    // 6. Broken Access Control (IDOR)
    let queryUserId = targetUserId;
    if (isSecure) {
      queryUserId = loggedInUserId;
    }
    
    return new Promise<NextResponse>((resolve) => {
      database.get(`SELECT id, email, secret_data, is_admin, balance, premium_status FROM users WHERE id = ?`, [queryUserId], (err, row: any) => {
        if (err || !row) return resolve(NextResponse.json({ error: 'User not found' }, { status: 404 }));
        
        resolve(NextResponse.json({ 
          success: true, 
          profile: {
            id: row.id,
            email: row.email,
            secretData: row.secret_data,
            isAdmin: row.is_admin === 1,
            balance: row.balance,
            premiumStatus: row.premium_status === 1
          }
        }));
      });
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { isSecure, ...updateData } = body;
    const database = getDb();
    
    // Simulate resolving the user from a secure HttpOnly session cookie
    const loggedInUserId = 2; // Hardcoded to the test user for this lab

    return new Promise<NextResponse>((resolve) => {
      if (!isSecure) {
        // UNHARDENED: Simulates an ORM's blind object merge.
        // Developers often pass req.body directly to ORMs like Sequelize or Prisma: User.update(req.body)
        database.get(`SELECT * FROM users WHERE id = ?`, [loggedInUserId], (err, currentUser: any) => {
          if (err || !currentUser) return resolve(NextResponse.json({ error: 'User not found' }, { status: 404 }));
          
          // Deep merge the updateData into the currentUser object
          const mergedUser = { ...currentUser, ...updateData };
          
          database.run(`UPDATE users SET secret_data = ?, is_admin = ? WHERE id = ?`, 
            [mergedUser.secretData || mergedUser.secret_data, mergedUser.is_admin, loggedInUserId], 
            function(err) {
              if (err) return resolve(NextResponse.json({ error: 'Update failed' }, { status: 500 }));
              resolve(NextResponse.json({ success: true, message: 'Profile updated successfully!' }));
          });
        });
      } else {
        // HARDENED: Strictly whitelists ONLY the fields that are allowed to be updated by the user.
        // Even if they send 'is_admin', it is completely ignored.
        const safeSecretData = updateData.secretData || '';
        
        const query = `UPDATE users SET secret_data = ? WHERE id = ?`;
        database.run(query, [safeSecretData, loggedInUserId], function(err) {
          if (err) return resolve(NextResponse.json({ error: 'Update failed' }, { status: 500 }));
          resolve(NextResponse.json({ success: true, message: 'Profile updated securely!' }));
        });
      }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
