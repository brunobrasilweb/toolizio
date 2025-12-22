import { NextResponse, NextRequest } from 'next/server';
import { checkIP } from '../../../utils/ipCheck';

function normalizeUrl(input: string, base?: string) {
  try {
    return new URL(input, base).toString();
  } catch {
    return null;
  }
}

function sameOrigin(a: URL, b: URL) {
  return a.protocol === b.protocol && a.hostname === b.hostname && a.port === b.port;
}

function extractLinks(html: string, baseUrl: string) {
  const hrefs: string[] = [];
  const re = /<a[^>]+href=["']?([^"' >]+)/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1];
    const normalized = normalizeUrl(raw, baseUrl);
    if (normalized) hrefs.push(normalized);
  }
  return hrefs;
}

function extractEmails(html: string) {
  const set = new Set<string>();
  // simple email regex
  const re = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  let m;
  while ((m = re.exec(html))) set.add(m[0].toLowerCase());
  return Array.from(set);
}

function extractPhones(html: string, country: string) {
  const set = new Set<string>();
  // Loose phone regex: international and common formats
  const phoneRe = /(?:\+?\d{1,3}[ \-\.])?(?:\(\d{1,4}\)|\d{1,4})[ \-\.]*\d{1,4}(?:[ \-\.]*\d{1,9})+/g;
  let m;
  while ((m = phoneRe.exec(html))) {
    const raw = m[0].trim();
    // Basic filtering: remove short matches
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 6) continue;
    // If country specified, prefer matches with that country code
    if (country === 'any' || (country === 'us' && /(^\+?1|\(1\))/.test(raw)) || (country === 'br' && /(^\+?55)/.test(raw)) || (country === 'uk' && /(^\+?44)/.test(raw)) || (country === 'de' && /(^\+?49)/.test(raw)) || (country === 'fr' && /(^\+?33)/.test(raw))) {
      set.add(raw);
    } else if (country === 'any') {
      set.add(raw);
    }
  }
  return Array.from(set);
}

export async function POST(req: NextRequest) {
  if (!checkIP(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { url, country = 'any' } = body || {};
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    const startUrl = url.startsWith('http') ? url : `https://${url}`;
    let start;
    try { start = new URL(startUrl); } catch { return NextResponse.json({ error: 'Invalid URL' }, { status: 400 }); }

    const visited = new Set<string>();
    const queue: string[] = [start.toString()];
    const emails = new Set<string>();
    const phones = new Set<string>();

  const maxPages = 100;

    // Create a ReadableStream to stream progress and final result as JSON lines
    const stream = new ReadableStream({
      async pull(controller) {
        while (queue.length && visited.size < maxPages) {
          const current = queue.shift()!;
          if (visited.has(current)) continue;
          visited.add(current);

          // fetch page
          let text = '';
          try {
            const res = await fetch(current, { headers: { 'User-Agent': 'ToolizioBot/1.0' } });
            if (!res.ok) {
              // send progress but continue
              controller.enqueue(encode(JSON.stringify({ type: 'progress', processed: visited.size, queue: queue.length, current })));
              continue;
            }
            text = await res.text();
          } catch (e) {
            controller.enqueue(encode(JSON.stringify({ type: 'progress', processed: visited.size, queue: queue.length, current })));
            continue;
          }

          // extract
          const foundEmails = extractEmails(text);
          for (const e of foundEmails) emails.add(e);
          const foundPhones = extractPhones(text, country);
          for (const p of foundPhones) phones.add(p);

          // send progress update
          controller.enqueue(encode(JSON.stringify({ type: 'progress', processed: visited.size, queue: queue.length, current })));

          // extract links and enqueue internal ones
          const links = extractLinks(text, current);
          for (const l of links) {
            try {
              const u = new URL(l);
              if (sameOrigin(u, start)) {
                if (!visited.has(u.toString()) && !queue.includes(u.toString())) queue.push(u.toString());
              }
            } catch { /* ignore invalid */ }
          }
        }

        // final result
        controller.enqueue(encode(JSON.stringify({ type: 'result', emails: Array.from(emails), phones: Array.from(phones) })));
        controller.close();
      }
    });

    return new NextResponse(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}

function encode(s: string) {
  return new TextEncoder().encode(s + '\n');
}
