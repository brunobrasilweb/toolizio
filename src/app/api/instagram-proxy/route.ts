import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
  const url = req.nextUrl.searchParams.get('url');
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    // Basic validation
    try { new URL(url); } catch { return NextResponse.json({ error: 'Invalid url' }, { status: 400 }); }

    const res = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return NextResponse.json({ error: `Upstream fetch failed: ${res.status}` }, { status: 502 });

    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const filename = 'instagram-video.mp4';

    // Stream response back with attachment header
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new Response(res.body, { status: 200, headers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body || {};
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    try { new URL(url); } catch { return NextResponse.json({ error: 'Invalid url' }, { status: 400 }); }

    const res = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return NextResponse.json({ error: `Upstream fetch failed: ${res.status}` }, { status: 502 });

    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const filename = 'instagram-video.mp4';
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new Response(res.body, { status: 200, headers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
