import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const file = url.searchParams.get('file');
    const isSecure = url.searchParams.get('isSecure') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file specified' }, { status: 400 });
    }

    // 10. Local File Inclusion (Directory Traversal)
    let safePath = '';
    
    if (!isSecure) {
      // UNHARDENED: Blindly concatenates the user input into a file path
      // An attacker can send ?file=../../package.json to break out of the directory!
      safePath = path.join(process.cwd(), 'public', 'avatars', file);
    } else {
      // HARDENED: Strips out directory traversal sequences by using path.basename
      // ?file=../../package.json safely becomes just "package.json"
      const sanitizedFile = path.basename(file);
      safePath = path.join(process.cwd(), 'public', 'avatars', sanitizedFile);
    }

    try {
      // Just for the laboratory, we return it as text so it can be seen easily
      const fileContent = fs.readFileSync(safePath, 'utf-8');
      return new NextResponse(fileContent, {
        headers: { 'Content-Type': 'text/plain' },
      });
    } catch (err: any) {
      // Return the attempted path just for educational visibility in the lab
      return NextResponse.json({ error: `File not found at: ${safePath}` }, { status: 404 });
    }

  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
