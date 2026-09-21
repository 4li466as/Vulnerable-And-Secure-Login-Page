import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const targetUrl = url.searchParams.get('url');
    const isSecure = url.searchParams.get('isSecure') === 'true';

    if (!targetUrl) {
      return NextResponse.json({ error: 'No URL specified' }, { status: 400 });
    }

    // 10. Server-Side Request Forgery (SSRF)
    if (!isSecure) {
      // UNHARDENED: Blindly fetches whatever URL the client provides!
      // An attacker can request http://localhost:3000/api/internal-secret
      const response = await fetch(targetUrl);
      const text = await response.text();
      
      return new NextResponse(text, {
        headers: { 'Content-Type': 'text/plain' },
      });
    } else {
      // HARDENED: Validates the URL to ensure it's targeting an external whitelisted domain
      const parsedTarget = new URL(targetUrl);
      if (parsedTarget.hostname === 'localhost' || parsedTarget.hostname === '127.0.0.1') {
         return NextResponse.json({ error: 'Access to internal network is forbidden.' }, { status: 403 });
      }

      const response = await fetch(targetUrl);
      const text = await response.text();
      
      return new NextResponse(text, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  } catch (e: any) {
    return NextResponse.json({ error: `Fetch failed: ${e.message}` }, { status: 500 });
  }
}
