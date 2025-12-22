import { NextRequest } from 'next/server';

export function checkIP(req: NextRequest): boolean {
  const allowedIP = process.env.ALLOWED_IP;
  if (!allowedIP) {
    // If ALLOWED_IP is not set, allow all requests (for development)
    return true;
  }
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                   req.headers.get('x-real-ip') ||
                   (req as any).ip ||
                   'unknown';
  return clientIP === allowedIP;
}