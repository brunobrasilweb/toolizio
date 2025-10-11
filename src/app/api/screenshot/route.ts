import { NextResponse } from 'next/server'
import playwright from 'playwright'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')
    const format = (searchParams.get('format') || 'png').toLowerCase()

    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })
    if (!/^https?:\/\//i.test(url)) return NextResponse.json({ error: 'Invalid url scheme' }, { status: 400 })

    // Basic protection: limit URL length
    if (url.length > 2000) return NextResponse.json({ error: 'URL too long' }, { status: 400 })

    // NOTE: This endpoint performs a server-side navigation and screenshot.
    // Be careful with SSRF security in production — consider a domain whitelist.

    const browser = await playwright.chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    const page = await context.newPage()

    // Navigate and wait for network to be idle
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    // Give a short extra time for dynamic content
    await page.waitForTimeout(300)

    const options: any = { fullPage: true }
    if (format === 'jpeg' || format === 'jpg') {
      options.type = 'jpeg'
      options.quality = 85
    } else {
      options.type = 'png'
    }

    const buffer = await page.screenshot(options)
    await browser.close()

    const contentType = options.type === 'jpeg' ? 'image/jpeg' : 'image/png'
    return new Response(buffer, { headers: { 'Content-Type': contentType } })
  } catch (err: any) {
    console.error('Screenshot error:', err)
    return NextResponse.json({ error: 'Failed to capture' }, { status: 500 })
  }
}
