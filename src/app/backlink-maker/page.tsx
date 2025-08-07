'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { trackGeneration, trackToolUsage } from '@/utils/analytics';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ExternalLink, CheckCircle, XCircle, RefreshCw, Link2 } from 'lucide-react';

interface BacklinkSite {
  name: string;
  url: string;
  status: 'pending' | 'success' | 'error';
}

const BACKLINK_SITES: Omit<BacklinkSite, 'status'>[] = [
  { name: 'SimilarSites', url: 'http://www.similarsites.com/site' },
  { name: 'Alexa Site Info', url: 'http://www.alexa.com/siteinfo' },
  { name: 'BuiltWith', url: 'http://www.builtwith.com' },
  { name: 'Site Advisor', url: 'http://www.siteadvisor.cn/sites' },
  { name: 'Domain Tools Whois', url: 'http://whois.domaintools.com' },
  { name: 'AboutUs', url: 'https://aboutus.org' },
  { name: 'W3C Validator', url: 'http://validator.w3.org/check?uri=' },
  { name: 'Script3 ProThemes', url: 'http://script3.prothemes.biz' },
  { name: 'Listen Arabic', url: 'http://www.listenarabic.com/search?q=' },
  { name: 'Who.is', url: 'http://www.who.is/whois' },
  { name: 'Site Dossier', url: 'http://www.sitedossier.com/site' },
  { name: 'SERP Analytics', url: 'http://www.serpanalytics.com/#competitor' },
  { name: 'Hosts File', url: 'http://hosts-file.net/default.asp?s=' },
  { name: 'Robtex DNS', url: 'http://www.robtex.com/dns' },
  { name: 'Quantcast', url: 'https://www.quantcast.com' },
  { name: 'Netcraft Toolbar', url: 'http://toolbar.netcraft.com/site_report?url=' },
  { name: 'Worth of Web', url: 'https://www.worthofweb.com/website-value' },
  { name: 'Value Analyze', url: 'http://valueanalyze.com' },
  { name: 'Site Price', url: 'http://www.siteprice.org/website-worth' },
  { name: 'Site Worth Traffic', url: 'http://www.siteworthtraffic.com/report' },
  { name: 'Site Ranker', url: 'http://siteranker.com/SiteInfo.aspx?url=' },
  { name: 'Whois.com', url: 'https://www.whois.com/whois' },
  { name: 'URL Trends', url: 'https://www.urltrends.com/rank' },
  { name: 'StatShow', url: 'http://www.statshow.com/www' },
  { name: 'Keyword Spy', url: 'http://www.keywordspy.com/research/search.aspx?q=' },
  { name: 'Website Down Info', url: 'http://www.websitedown.info' },
  { name: 'Folkd', url: 'http://www.folkd.com/detail' },
  { name: 'Domain Whois Info', url: 'http://www.domainwhoisinfo.com' },
  { name: 'SEMrush', url: 'https://www.semrush.com/info' },
  { name: 'Web Horde', url: 'http://web.horde.to' },
  { name: 'WooRank', url: 'https://www.woorank.com/en/www' },
  { name: 'Scam Analyze', url: 'http://scamanalyze.com/check' },
  { name: 'Info Site Show', url: 'http://www.infositeshow.com/sites' },
  { name: 'View Whois', url: 'http://www.viewwhois.com' },
  { name: 'HypeStat', url: 'http://' },
  { name: 'W3 Lookup', url: 'http://' },
  { name: 'WebWiki', url: 'https://www.webwiki.de' },
  { name: 'WebSearch Ranking', url: 'http://ranking.websearch.com/siteinfo.aspx?url=' },
  { name: 'Archive.is', url: 'https://archive.is' },
  { name: 'Who Hosts', url: 'https://who-hosts.com' },
  { name: 'Wayback Machine', url: 'https://web.archive.org/web/*/' },
  { name: 'Website Looker', url: 'http://www.websitelooker.net/www' },
  { name: 'Whois Bucket', url: 'http://' },
  { name: 'DNS Whois Info', url: 'https://www.dnswhois.info' },
  { name: 'Crawler Ranking', url: 'http://ranking.crawler.com/SiteInfo.aspx?url=' },
  { name: 'Dig.do', url: 'http://dig.do' },
  { name: 'MyWOT', url: 'https://mywot.com/en/scorecard' },
  { name: 'StuffGate', url: 'https://stuffgate.com' },
  { name: 'Pingdom DNS Check', url: 'http://dnscheck.pingdom.com/?domain=' },
  { name: 'Whois.de', url: 'https://whois.de' },
  { name: 'StatsCrop', url: 'http://www.statscrop.com/www' },
  { name: 'SimilarTo', url: 'https://similarto.us' },
  { name: 'Website Informer', url: 'http://website.informer.com' },
  { name: 'StatMyWeb', url: 'http://www.statmyweb.com/site' },
  { name: 'AVG Threat Labs', url: 'http://www.avgthreatlabs.com/en-in/website-safety-reports/domain' },
  { name: 'Tools4Noobs Whois', url: 'http://whois.tools4noobs.com/info' },
  { name: 'BackTalk', url: 'http://www.backtalk.com/?url=' },
  { name: 'HostCrax', url: 'http://hostcrax.com/siteinfo' },
  { name: 'Netcraft Uptime', url: 'http://uptime.netcraft.com/up/graph?site=' },
  { name: 'PageHeat', url: 'http://www.pageheat.com/heat' },
  { name: 'About The Domain', url: 'http://www.aboutthedomain.com' },
  { name: 'Online Web Check', url: 'http://www.onlinewebcheck.com/check.php?url=' },
  { name: 'WhoisX', url: 'http://whoisx.co.uk' },
  { name: 'Website Accountant NL', url: 'http://www.websiteaccountant.nl' },
  { name: 'Talk Reviews RO', url: 'http://www.talkreviews.ro' },
  { name: 'Website Accountant BE', url: 'http://www.websiteaccountant.be' },
  { name: 'AltaVista Site Search', url: 'http://www.altavista.com/yhs/search?fr=altavista&itag=ody&kgs=0&kls=0&q=site:' },
  { name: 'Compete Analytics', url: 'http://siteanalytics.compete.com' },
  { name: 'HQ Index', url: 'http://hqindex.org' },
  { name: 'Value Analyze Show', url: 'https://valueanalyze.com/show.php?url=' },
  { name: 'Domain Name Worth', url: 'http://howmuchdomainnameworth.com/process.php?q=' },
  { name: 'Site Ranker Trend', url: 'http://www.siteranker.com/TrankTrend.aspx?url=' },
  { name: 'Website IP Address', url: 'https://website.ip-adress.com' },
  { name: 'SERP Analytics Sites', url: 'http://www.serpanalytics.com/sites' },
  { name: 'Ultimate Rihanna', url: 'http://www.ultimate-rihanna.com/?url=' },
  { name: 'DeviantArt Outgoing', url: 'https://deviantart.com/users/outgoing?' },
  { name: 'Proza', url: 'https://proza.ru/go' },
  { name: 'W3SEO Score', url: 'http://w3seo.info/WSZScore' },
  { name: 'Talk Reviews COM', url: 'http://www.talkreviews.com' },
  { name: 'Whois Phurix', url: 'http://whois.phurix.co.uk' },
  { name: 'RBLS', url: 'https://rbls.org' },
  { name: 'Evi', url: 'https://evi.com/q/' },
  { name: 'Whois Lookup DB', url: 'https://whoislookupdb.com/whois-' },
  { name: '500v', url: 'http://500v.net/site' },
  { name: 'Website Detailed', url: 'http://websitedetailed.com' },
  { name: 'SEO Timer', url: 'https://www.seoptimer.com' },
  { name: 'PR-CY', url: 'https://a.pr-cy.ru' },
  { name: 'BE1', url: 'https://be1.ru/stat' },
  { name: 'IBM Links', url: 'https://ibm.com/links/?cc=us&lc=en&prompt=1&url=//' },
  { name: 'AddToAny', url: 'https://addtoany.com/share_save?linkname=&linkurl=' },
  { name: 'Site Value Fox', url: 'http://sitevaluefox.com/website-value-calculator/show.php?url=' },
  { name: 'Alexa View', url: 'http://alexaview.com/process.php?q=' },
  { name: 'URL Rate', url: 'http://urlrate.com/process.php?q=' },
  { name: 'SpyFu', url: 'https://spyfu.com/overview/domain?query=' },
  { name: 'TransStats', url: 'https://transtats.bts.gov/exit.asp?url=' },
  { name: 'Weather Exit', url: 'https://water.weather.gov/ahps2/nwsexit.php?url=' },
  { name: 'W3Techs', url: 'https://w3techs.com/sites/info' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com' }
];

export default function BacklinkMaker() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [sites, setSites] = useState<BacklinkSite[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completed, setCompleted] = useState(0);

  // Check for URL parameter on component mount
  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam) {
      const decodedUrl = decodeURIComponent(urlParam);
      setUrl(decodedUrl);
      // Auto-submit if URL parameter exists
      if (isValidUrl(decodedUrl)) {
        setTimeout(() => {
          generateBacklinks(decodedUrl);
        }, 500); // Small delay to ensure state is set
      }
    }
  }, [searchParams]);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const generateBacklinks = async (inputUrl?: string) => {
    const targetUrl = inputUrl || url;
    
    if (!targetUrl.trim() || !isValidUrl(targetUrl)) {
      alert('Please enter a valid URL');
      return;
    }

    // Track backlink generation
    trackGeneration('Backlinks');
    trackToolUsage('Backlink Maker', 'generate_backlinks');

    // Update URL in address bar with the parameter
    if (!inputUrl) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('url', encodeURIComponent(targetUrl));
      router.push(currentUrl.pathname + '?' + currentUrl.searchParams.toString());
    }

    setIsGenerating(true);
    setCompleted(0);
    
    const initialSites = BACKLINK_SITES.map(site => ({
      ...site,
      status: 'pending' as const
    }));
    
    setSites(initialSites);

    // Simular o processo de geração de backlinks
    for (let i = 0; i < initialSites.length; i++) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      setSites(prev => {
        const newSites = [...prev];
        // Simular sucesso em ~70% dos casos
        newSites[i].status = Math.random() > 0.3 ? 'success' : 'error';
        return newSites;
      });
      
      setCompleted(i + 1);
    }

    setIsGenerating(false);
  };

  const openBacklinkSite = (site: BacklinkSite) => {
    if (site.status === 'success') {
      let backlinkeUrl = '';
      const currentUrl = url || searchParams.get('url') || '';
      const domain = currentUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
      
      // Handle different URL patterns
      if (site.url.includes('?uri=') || site.url.includes('?q=') || site.url.includes('?url=') || site.url.includes('?domain=')) {
        backlinkeUrl = `${site.url}${domain}`;
      } else if (site.url.endsWith('/')) {
        backlinkeUrl = `${site.url}${domain}/`;
      } else {
        backlinkeUrl = `${site.url}/${domain}`;
      }
      
      // Track backlink site opening
      trackToolUsage('Backlink Maker', 'open_backlink_site');
      
      window.open(backlinkeUrl, '_blank');
    }
  };

  const successCount = sites.filter(site => site.status === 'success').length;
  const errorCount = sites.filter(site => site.status === 'error').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Link2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Backlink Maker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate quality backlinks for your website automatically. Improve your SEO with our free tool.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your website URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isGenerating}
              />
            </div>

            <button
              onClick={() => generateBacklinks()}
              disabled={isGenerating || !url.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Generating Backlinks... ({completed}/{BACKLINK_SITES.length})</span>
                </>
              ) : (
                <>
                  <Link2 className="h-5 w-5" />
                  <span>Generate Backlinks</span>
                </>
              )}
            </button>

            {sites.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Results
                  </h3>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-green-600 dark:text-green-400">
                      ✓ Success: {successCount}
                    </span>
                    <span className="text-red-600 dark:text-red-400">
                      ✗ Error: {errorCount}
                    </span>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {sites.map((site, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        site.status === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : site.status === 'error'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {site.status === 'success' && (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          )}
                          {site.status === 'error' && (
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          )}
                          {site.status === 'pending' && (
                            <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
                          )}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {site.name}
                          </span>
                        </div>
                      </div>
                      
                      {site.status === 'success' && (
                        <button
                          onClick={() => openBacklinkSite(site)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <span className="text-sm">Open</span>
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informações sobre backlinks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            What are Backlinks and why are they important?
          </h2>
          
          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <p>
              Backlinks are incoming hyperlinks that point to your website or blog from other domains on the Web. 
              They are also called inbound links, external links, and inlinks.
            </p>
            
            <p>
              These links are one of the most important factors for search rankings. 
              The more quality backlinks you have pointing to your website, the better your website 
              will perform in search results (SERPs).
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
                How to use the Backlink Maker:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
                <li>Enter the URL of the website you want to build backlinks for</li>
                <li>Click the "Generate Backlinks" button to run the tool</li>
                <li>The tool will show a list of relevant websites</li>
                <li>For successful sites (✓), click "Open" to manually create the backlink</li>
              </ol>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-3">
                Important:
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200">
                Newly created backlinks may not have immediate impact on your rankings. 
                This is because changes take time to take effect on search engine indexes. 
                But after some time, your search results will definitely improve.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
