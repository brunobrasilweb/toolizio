"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";
import { trackGeneration, trackEvent } from "@/utils/analytics";

export default function InstagramVideoDownloader() {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>("");

  // Validate Instagram URL (basic)
  const isValidInstagramUrl = (value: string) => {
    if (!value) return false;
    try {
      const u = new URL(value.startsWith("http") ? value : `https://${value}`);
      return /instagram\.com/.test(u.hostname) && /\/p\/|\/reel\/|\/tv\//.test(u.pathname);
    } catch {
      return false;
    }
  };

  const handleFetch = async () => {
    setError("");
    setVideoUrl("");

    if (!isValidInstagramUrl(url)) {
      setError("Please enter a valid Instagram post or reel URL.");
      return;
    }

    setLoading(true);

    try {
      // Use an available third-party extractor endpoint. We will attempt to fetch
      // the Instagram page and parse the video URL from the meta tags server-side
      // via a client-side fetch to a public CORS-friendly endpoint. To avoid
      // introducing server code in this repo, we will use `https://r.jina.ai/http://...` as a text-proxy
      // and then parse the HTML to find the video URL. This keeps implementation
      // in-browser while respecting the repo constraint of no extra server.

      // Call server-side extractor API which fetches Instagram HTML and extracts video URL
      const apiRes = await fetch('/api/instagram-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.startsWith('http') ? url : `https://${url}` })
      });

      if (!apiRes.ok) {
        const err = await apiRes.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to extract video');
      }

      const data = await apiRes.json();
      const text = ''; // keep compatibility with next extraction flow (we use returned videoUrl below)

      // 1) Try to find meta tags like og:video, og:video:url or og:video:secure_url
      const metaMatch = text.match(/<meta[^>]+property=["'](?:og:video|og:video:url|og:video:secure_url|video:src)["'][^>]*content=["']([^"']+)["'][^>]*>/i);
      let foundUrl = metaMatch ? metaMatch[1] : null;

      // 2) If not found, parse any <script type="application/ld+json"> blocks and look for VideoObject
      if (!foundUrl) {
        const ldJsonRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
        let m;
        while (!foundUrl && (m = ldJsonRegex.exec(text))) {
          try {
            const data = JSON.parse(m[1]);
            // data may be an array or object
            const candidates = Array.isArray(data) ? data : [data];
            for (const item of candidates) {
              // common place: item.video.contentUrl or item.contentUrl
              if (item && typeof item === 'object') {
                if (item.video && item.video.contentUrl) {
                  foundUrl = item.video.contentUrl;
                  break;
                }
                if (item.contentUrl) {
                  foundUrl = item.contentUrl;
                  break;
                }
              }
            }
          } catch (e) {
            // ignore JSON parse errors
          }
        }
      }

      // 3) Attempt to locate embedded Instagram JSON containing "shortcode_media" and parse it
      if (!foundUrl) {
        const key = '"shortcode_media"';
        const idx = text.indexOf(key);
        if (idx !== -1) {
          // find the first '{' after the key and bracket-match to extract JSON object
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
                // try common paths
                if (parsed.video_url) foundUrl = parsed.video_url;
                else if (parsed.video_versions && Array.isArray(parsed.video_versions) && parsed.video_versions[0] && parsed.video_versions[0].url) foundUrl = parsed.video_versions[0].url;
                else if (parsed.clip && parsed.clip.playable_url) foundUrl = parsed.clip.playable_url;
                else if (parsed.playable_url) foundUrl = parsed.playable_url;
              } catch (e) {
                // ignore
              }
            }
          }
        }
      }

      // Fallbacks: try several common patterns that appear in Instagram HTML/JSON
      if (!foundUrl) {
        // 1) Common JSON keys used by Instagram pages
        const jsonKeys = [
          /"video_url":"([^"]+)"/i,
          /"playable_url":"([^"]+)"/i,
          /"playable_url_quality_hd":"([^"]+)"/i,
          /"play_url":"([^"]+)"/i,
          /"video_versions":\s*\[([^\]]+)\]/i
        ];

        for (const re of jsonKeys) {
          const jm = text.match(re);
          if (jm) {
            // video_versions may return an array of objects — try to extract a url inside
            if (re.source.includes('video_versions') && jm[1]) {
              const inner = jm[1];
              const urlMatch = inner.match(/"url":"([^"]+)"/i);
              if (urlMatch) {
                foundUrl = urlMatch[1];
              }
            } else {
              foundUrl = jm[1];
            }

            if (foundUrl) {
              foundUrl = foundUrl
                .replace(/\\u0026/g, "&")
                .replace(/\\\//g, "/")
                .replace(/&amp;/g, "&");
              break;
            }
          }
        }
      }

      // 2) If still not found, search the entire document for .mp4 links — handles Markdown or proxy outputs
      if (!foundUrl) {
        const mp4Match = text.match(/https?:\/\/[^\s"'<>]+\.mp4(?:\?[^\s"'<>]*)?/i);
        if (mp4Match) {
          foundUrl = mp4Match[0].replace(/&amp;/g, "&");
        }
      }

      // 3) Some proxies return Markdown-like content; try to extract first CDN video or scontent URL
      if (!foundUrl) {
        const cdnMatch = text.match(/https?:\/\/(?:scontent|video)\.[^\s"'<>]+/i);
        if (cdnMatch) {
          const candidate = cdnMatch[0];
          // prefer mp4 candidates; if candidate doesn't end with mp4, try to find mp4 nearby
          if (/\.mp4(?:\?|$)/i.test(candidate)) {
            foundUrl = candidate.replace(/&amp;/g, "&");
          } else {
            // search around the position for an mp4
            const idx = text.indexOf(candidate);
            const slice = text.slice(idx, idx + 1000);
            const nearby = slice.match(/https?:\/\/[^\s"'<>]+\.mp4(?:\?[^\s"'<>]*)?/i);
            if (nearby) foundUrl = nearby[0].replace(/&amp;/g, "&");
          }
        }
      }

      // If API returned a videoUrl, use it immediately
      if (data && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        trackGeneration("InstagramVideo-Extract");
        trackEvent("InstagramVideo", "Extract", "Success");
      } else {
        setError("Could not extract video URL from the Instagram page. Some posts may be protected or require authentication.");
        setLoading(false);
        return;
      }
      trackGeneration("InstagramVideo-Extract");
      trackEvent("InstagramVideo", "Extract", "Success");
    } catch (err: any) {
      console.error(err);
      setError("Failed to retrieve video. The post may be private or Instagram may block automated access.");
      trackEvent("InstagramVideo", "Extract", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    try {
      // Use server proxy to force attachment headers so browser downloads instead of opening
      const proxyUrl = `/api/instagram-proxy?url=${encodeURIComponent(videoUrl)}`;

      // Create a hidden iframe to trigger download without opening a tab
      let iframe = document.getElementById('download-iframe') as HTMLIFrameElement | null;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.id = 'download-iframe';
        document.body.appendChild(iframe);
      }
      iframe.src = proxyUrl;
      trackEvent("InstagramVideo", "Download", "Proxied");
    } catch (e) {
      // fallback to direct anchor
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "instagram-video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      trackEvent("InstagramVideo", "Download", "DirectFallback");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-8">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">← Back to Tools</Link>
        </nav>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-6">
            <ToolIcons.instagram className="h-8 w-8 text-slate-600 dark:text-slate-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Instagram Video Downloader</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Download Instagram videos and reels directly from the post URL. Quick, anonymous, and free.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instagram post or reel URL</label>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/SHORTCODE or https://www.instagram.com/reel/SHORTCODE"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            />
            <button
              onClick={handleFetch}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Fetching...' : 'Fetch Video'}
            </button>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</div>
          )}

          {videoUrl && (
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center md:text-left">Video Ready</h3>

              {/* Reels-style vertical preview (9:16) — slightly larger and responsive */}
              <div className="max-w-[380px] mx-auto mb-4">
                <div className="w-64 md:w-80 mx-auto bg-black rounded-lg overflow-hidden">
                  <video controls className="w-full aspect-[9/16] object-cover">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              <div className="flex gap-3 justify-center md:justify-start">
                <button onClick={handleDownload} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg">Download</button>
                <a href={videoUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg">Open in new tab</a>
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How it works</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Enter the URL</h4>
                <p className="text-gray-600 dark:text-gray-300">Paste the Instagram post or reel URL into the input and click "Fetch Video".</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Download</h4>
                <p className="text-gray-600 dark:text-gray-300">If a direct video URL is found, it will be displayed and you can preview or download it.</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
              <ul className="list-disc ml-5 text-gray-600 dark:text-gray-300">
                <li>Private or restricted posts cannot be downloaded.</li>
                <li>Instagram may change how its pages are structured, which can break extraction. We try multiple strategies but can’t guarantee availability.</li>
                <li>Do not use downloaded videos for copyright-infringing purposes.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ToolIcons.youtube className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Fast Extraction</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Attempts multiple extraction strategies to locate the direct video file.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <ToolIcons.check className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Preview in Browser</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Preview the extracted video before downloading.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <ToolIcons.info className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">No Signup</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Use the tool anonymously without creating an account.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <ToolIcons.warning className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Legal</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Respect copyright and terms of service when downloading content.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
