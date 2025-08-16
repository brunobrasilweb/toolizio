import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

function isInstagramUrl(value: string) {
  try {
    const u = new URL(value);
    return /(^|\.)instagram\.com$/.test(u.hostname) || u.hostname.endsWith('instagram.com');
  } catch {
    return false;
  }
}

function tryExtractFromHtml(text: string): string | null {
  // 1) meta tags
  const metaMatch = text.match(/<meta[^>]+property=["'](?:og:video|og:video:url|og:video:secure_url|video:src)["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (metaMatch) return metaMatch[1];

  // 2) ld+json
  const ldJsonRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = ldJsonRegex.exec(text))) {
    try {
      const data = JSON.parse(m[1]);
      const candidates = Array.isArray(data) ? data : [data];
      for (const item of candidates) {
        if (item && typeof item === 'object') {
          if (item.video && item.video.contentUrl) return item.video.contentUrl;
          if (item.contentUrl) return item.contentUrl;
        }
      }
    } catch {
      // ignore
    }
  }

  // 3) try find JSON with shortcode_media
  const key = '"shortcode_media"';
  const idx = text.indexOf(key);
  if (idx !== -1) {
    const start = text.indexOf('{', idx);
    if (start !== -1) {
      let depth = 0;
      let end = -1;
      for (let i = start; i < text.length; i++) {
        const ch = text[i];
        if (ch === '{') depth++;
        else if (ch === '}') depth--;
        if (depth === 0) { end = i; break; }
      }
      if (end !== -1) {
        const jsonStr = text.slice(start, end + 1);
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.video_url) return parsed.video_url;
          if (parsed.video_versions && Array.isArray(parsed.video_versions) && parsed.video_versions[0] && parsed.video_versions[0].url) return parsed.video_versions[0].url;
          if (parsed.playable_url) return parsed.playable_url;
        } catch {
          // ignore
        }
      }
    }
  }

  // 4) search for mp4 or scontent CDN
  const mp4Match = text.match(/https?:\/\/[^\s"'<>]+\.mp4(?:\?[^\s"'<>]*)?/i);
  if (mp4Match) return mp4Match[0];

  const cdnMatch = text.match(/https?:\/\/scontent\.[^\s"'<>]+/i);
  if (cdnMatch) return cdnMatch[0];

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body || {};
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    const target = url.startsWith('http') ? url : `https://${url}`;
    if (!isInstagramUrl(target)) return NextResponse.json({ error: 'Invalid Instagram URL' }, { status: 400 });

    // Use Playwright to load the page and execute JS
    let browser = null;
    try {
      browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', viewport: { width: 1280, height: 800 } });
      const page = await context.newPage();
      await page.goto(target, { waitUntil: 'networkidle', timeout: 25000 }).catch(() => null);

      // Wait for video element or JS-injected data for a short time
      await page.waitForTimeout(800); // give page a moment
      const waitResult = await Promise.race([
        page.waitForSelector('video', { timeout: 4000 }).then(() => 'video').catch(() => null),
        page.waitForFunction(() => !!document.querySelector('script') && /video_url|playable_url|shortcode_media/.test(document.body.innerText), { timeout: 4000 }).then(() => 'script').catch(() => null),
        Promise.resolve(null)
      ]).catch(() => null);

      // Evaluate multiple extraction strategies in-page
      const domResult = await page.evaluate(() => {
        try {
          // 1) video tags
          const videos = Array.from(document.querySelectorAll('video'));
          for (const v of videos) {
            const el = v as HTMLVideoElement;
            if (el.currentSrc) return el.currentSrc;
            if (el.src) return el.src;
            const source = el.querySelector('source');
            if (source && source.getAttribute('src')) return source.getAttribute('src');
          }

          // 2) meta tags
          const meta = document.querySelector('meta[property="og:video"]') || document.querySelector('meta[property="og:video:url"]') || document.querySelector('meta[property="og:video:secure_url"]');
          if (meta) return meta.getAttribute('content');

          // 3) search script tags for JSON-like video_url or playable_url
          const scripts = Array.from(document.querySelectorAll('script'));
          for (const s of scripts) {
            const txt = (s.textContent || '').trim();
            if (!txt) continue;
            // common keys
            const re = /"(video_url|playable_url|playable_url_quality_hd)":"([^"]+)"/i;
            const jm = txt.match(re);
            if (jm) return jm[2].replace(/\\u0026/g, '&');
            // search for mp4
            const mp4 = txt.match(/https?:\/\/[^\s"']+\.mp4(?:\?[^\s"']*)?/i);
            if (mp4) return mp4[0];
          }

          return null;
        } catch (e) {
          return null;
        }
      });

      if (domResult) {
        await browser.close();
        const cleaned = domResult.replace(/\\u0026/g, '&').replace(/&amp;/g, '&');
        return NextResponse.json({ videoUrl: cleaned });
      }

      // Fallback: get page content and try HTML parsing
      const content = await page.content();
      const found = tryExtractFromHtml(content);
      if (found) {
        await browser.close();
        const cleaned = found.replace(/\\u0026/g, '&').replace(/&amp;/g, '&');
        return NextResponse.json({ videoUrl: cleaned });
      }

      // As a last fallback, try the text-proxy
      try {
        const proxyUrl = `https://r.jina.ai/http://${target.replace(/^https?:\/\//, '')}`;
        const proxyRes = await fetch(proxyUrl);
        if (proxyRes.ok) {
          const proxyText = await proxyRes.text();
          const proxyFound = tryExtractFromHtml(proxyText);
          if (proxyFound) {
            await browser.close();
            const cleaned = proxyFound.replace(/\\u0026/g, '&').replace(/&amp;/g, '&');
            return NextResponse.json({ videoUrl: cleaned });
          }
        }
      } catch {
        // ignore
      }

      await browser.close();
      return NextResponse.json({ error: 'Could not extract video URL from Instagram page' }, { status: 422 });
    } catch (err: any) {
      if (browser) await browser.close();
      return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
