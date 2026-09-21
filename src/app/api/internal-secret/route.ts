import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // This endpoint simulates an internal administrative API or cloud metadata service
  // that should never be exposed to the public internet.
  // Real world example: AWS metadata endpoint http://169.254.169.254/latest/meta-data/
  
  return NextResponse.json({
    "instance-id": "i-1234567890abcdef0",
    "local-ipv4": "10.0.0.15",
    "iam-roles": "admin-role",
    "secret-access-key": "AKIAIOSFODNN7EXAMPLE:wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
  });
}
