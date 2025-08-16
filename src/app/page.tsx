"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import CategoryHeader from "@/components/CategoryHeader";
import CategoryNav from "@/components/CategoryNav";
import SearchBar from "@/components/SearchBar";
import { useToolSearch } from "@/hooks/useToolSearch";
import { Suspense, useCallback } from "react";
import { 
  FileSpreadsheet, 
  Building2, 
  KeyRound, 
  Lock, 
  Search, 
  RefreshCw, 
  Youtube, 
  Clock,
  Instagram,
  Timer,
  QrCode,
  ImageIcon,
  FileText,
  Code,
  Calculator,
  Link2,
  MessageSquare,
  FileJson,
  FileCode,
  Table,
  Upload,
  Shield,
  Smartphone,
  Zap,
  TrendingUp,
  FileImage,
  Share2,
  Hash,
  Globe
} from "lucide-react";

;

// Structured data for categories and tools
const toolCategories = {
  generators: {
    title: "Generators",
    description: "Tools to generate data and codes",
    icon: Zap,
    color: "blue",
    tools: [
      {
        href: "/cpf-generator",
        icon: FileSpreadsheet,
        title: "CPF Generator",
        description: "Generate valid CPFs for testing and development quickly and securely",
        keywords: "cpf, cpf generator, validate cpf"
      },
      {
        href: "/cnpj-generator", 
        icon: Building2,
        title: "CNPJ Generator",
        description: "Generate valid CNPJs for business testing and development",
        keywords: "cnpj, cnpj generator, validate cnpj"
      },
      {
        href: "/password-generator",
        icon: KeyRound, 
        title: "Password Generator",
        description: "Create secure and customizable passwords with different criteria",
        keywords: "password, generator, security, strong password"
      },
      {
        href: "/qr-code-generator",
        icon: QrCode,
        title: "QR Code Generator", 
        description: "Create QR codes for URLs, texts and links instantly",
        keywords: "qr code, qrcode, qr generator"
      },
      {
        href: "/favicon-generator",
        icon: ImageIcon,
        title: "Favicon Generator",
        description: "Generate high-quality favicons for web, mobile and desktop",
        keywords: "favicon, icon, ico, png"
      },
      {
        href: "/uuid-generator",
        icon: Hash,
        title: "UUID Generator",
        description: "Generate unique identifiers (UUID) for applications and databases",
        keywords: "uuid, guid, unique identifier, v1, v4"
      }
    ]
  },
  security: {
    title: "Security & Cryptography", 
    description: "Security and analysis tools",
    icon: Shield,
    color: "red",
    tools: [
      {
        href: "/hash-generator",
        icon: Lock,
        title: "Hash Generator",
        description: "Generate secure hash values using MD5, SHA-1, SHA-256 and other algorithms",
        keywords: "hash, md5, sha256, cryptography"
      },
      {
        href: "/bcrypt-generator",
        icon: KeyRound,
        title: "Bcrypt Generator",
        description: "Generate bcrypt hashes from a text string in your browser. Adjustable salt rounds for testing and development.",
        keywords: "bcrypt, hash, bcrypt generator, password hashing"
      },
      {
        href: "/jwt-decoder", 
        icon: Search,
        title: "JWT Decoder",
        description: "Decode and analyze JWT tokens with detailed explanations",
        keywords: "jwt, json web token, decode, token"
      },
      {
        href: "/base64-tool",
        icon: RefreshCw,
        title: "Base64 Encoder",
        description: "Encode text to Base64 or decode Base64 to text",
        keywords: "base64, encode, decode, converter"
      },
      {
        href: "/ip-tool",
        icon: Globe,
        title: "IP Address Lookup",
        description: "Find and copy your public IP address instantly.",
        keywords: "ip, ip address, lookup, public ip, my ip, copy ip"
      }
    ]
  },
  converters: {
    title: "Converters",
    description: "Convert between different formats",
    icon: RefreshCw,
    color: "green", 
    tools: [
      {
        href: "/json-to-csv",
        icon: Table,
        title: "JSON to CSV",
        description: "Convert JSON data to CSV format with download option",
        keywords: "json, csv, converter, download"
      },
      {
        href: "/csv-to-json",
        icon: Upload,
        title: "CSV to JSON", 
        description: "Convert CSV files to JSON with upload and download",
        keywords: "csv, json, converter, upload"
      },
      {
        href: "/xml-to-json",
        icon: FileJson,
        title: "XML to JSON",
        description: "Convert XML to JSON with clean and formatted preview",
        keywords: "xml, json, converter, format"
      },
      {
        href: "/image-cropper",
        icon: ImageIcon,
        title: "Image Cropper",
        description: "Crop JPG and PNG images directly in your browser. Select area, choose aspect ratio and download the cropped image.",
        keywords: "image, crop, crop image, jpg, png, aspect ratio"
      },
      {
        href: "/json-to-xml",
        icon: FileCode,
        title: "JSON to XML",
        description: "Convert JSON to XML with clean and structured formatting",
        keywords: "json, xml, converter, format"
      },
      {
        href: "/md-to-pdf",
        icon: FileText,
        title: "Markdown to PDF",
        description: "Convert Markdown files to PDF with custom styling",
        keywords: "markdown, pdf, converter, md"
      },
      {
        href: "/html-to-pdf",
        icon: Code,
        title: "HTML to PDF", 
        description: "Convert HTML to PDF preserving all styling",
        keywords: "html, pdf, converter, css"
      },
      {
        href: "/pdf-to-jpg",
        icon: FileImage,
        title: "PDF to JPG Converter",
        description: "Convert PDF files to high-quality JPG images with batch processing",
        keywords: "pdf, jpg, converter, image, pdf to jpg, pdf to image"
      },
      {
        href: "/jpg-to-pdf",
        icon: ImageIcon,
        title: "JPG to PDF Converter",
        description: "Convert JPG, JPEG, and PNG images to PDF documents",
        keywords: "jpg, pdf, converter, image to pdf, jpg to pdf, png to pdf"
      },
      {
        href: "/image-compressor",
        icon: ImageIcon,
        title: "Image Compressor",
        description: "Compress JPG and PNG images to reduce file size while maintaining quality.",
        keywords: "image, compressor, jpg, png, compress, reduce size, optimize"
      }
      ,
      {
        href: "/image-resizer",
        icon: ImageIcon,
        title: "Image Resizer",
        description: "Resize JPG and PNG images directly in your browser. Change dimensions, keep aspect ratio and download the result.",
        keywords: "image, resize, resize image, jpg, png, change dimensions"
      }
    ]
  },
  social: {
    title: "Social Media",
    description: "Social media tools",
    icon: Share2,
    color: "purple",
    tools: [
      {
        href: "/youtube-thumbnail",
        icon: Youtube,
        title: "YouTube Thumbnail Downloader", 
        description: "Download YouTube video thumbnails in high quality",
        keywords: "youtube, thumbnail, download, image"
      },
      {
        href: "/instagram-image",
        icon: Instagram,
        title: "Instagram Image Downloader",
        description: "Download images from Instagram posts easily",
        keywords: "instagram, image, download, photo"
      },
      {
        href: "/whatsapp-link",
        icon: MessageSquare,
        title: "WhatsApp Link Generator",
        description: "Create direct chat links for WhatsApp with pre-filled messages",
        keywords: "whatsapp, link, chat, message"
      }
    ]
  },
  productivity: {
    title: "Productivity",
    description: "Tools to boost your productivity", 
    icon: TrendingUp,
    color: "orange",
    tools: [
      {
        href: "/pomodoro-timer",
        icon: Timer,
        title: "Pomodoro Timer",
        description: "Manage your tasks with customizable Pomodoro timer and notifications",
        keywords: "pomodoro, timer, productivity, focus"
      },
      {
        href: "/sorteio",
        icon: Timer,
        title: "Sorteio Online",
        description: "Cole uma lista de nomes e sorteie um vencedor com animação atraente",
        keywords: "sorteio, raffle, random, winner, sortear nomes"
      },
      {
        href: "/calculadora-salario",
        icon: Calculator, 
        title: "Calculadora de Salário",
        description: "Calcule seu salário líquido CLT com descontos de INSS e IRRF",
        keywords: "salario, calculadora, clt, inss, irrf"
      },
      {
        href: "/backlink-maker",
        icon: Link2,
        title: "Backlink Generator",
        description: "Generate quality backlinks to improve your website's SEO",
        keywords: "backlink, seo, link building, optimization"
      }
    ]
  },
  financial: {
    title: "Financial",
    description: "Financial and payment tools",
    icon: QrCode,
    color: "cyan",
    tools: [
      {
        href: "/pix-qrcode",
        icon: QrCode,
        title: "QR Code PIX",
        description: "Gere QR Codes para pagamentos via PIX de forma rápida e segura",
        keywords: "pix, qr code, pagamento, transferencia"
      }
    ]
  }
};

// Page component with search functionality
function HomePage() {
  const { 
    searchQuery, 
    setSearchQuery, 
    filteredCategories, 
    totalResults, 
    hasResults, 
    isSearching 
  } = useToolSearch({ categories: toolCategories });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Toolizio",
            "description": "Free online tools for developers and users",
            "url": "https://toolizio.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://toolizio.com?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section - SEO Optimized */}
        <section className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Free Online
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tools
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Over <strong>20 useful tools</strong> for developers, professionals and students. 
            CPF/CNPJ generator, secure passwords, converters, calculators and much more!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              100% Free
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              No Registration
            </span>
            <span className="flex items-center gap-1">
              <Smartphone className="w-4 h-4" />
              Mobile Friendly
            </span>
          </div>
        </section>

        {/* Search Bar */}
        <Suspense fallback={<div className="h-16 mb-8" />}>
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search for tools (e.g., CPF, password, converter)..."
          />
        </Suspense>

        {/* Search Results Summary */}
        {isSearching && (
          <div className="text-center mb-8">
            {hasResults ? (
              <p className="text-gray-600 dark:text-gray-400">
                Found <span className="font-medium text-blue-600 dark:text-blue-400">{totalResults}</span> tool{totalResults !== 1 ? 's' : ''} 
                {searchQuery && (
                  <> for "<span className="font-medium">{searchQuery}</span>"</>
                )}
              </p>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No tools found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No tools match your search for "<span className="font-medium">{searchQuery}</span>"
                </p>
                <button
                  onClick={() => handleSearch("")}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Clear search and view all tools
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tool Categories */}
        {hasResults && Object.entries(filteredCategories).map(([categoryKey, category]) => (
          <section key={categoryKey} className="mb-16" id={categoryKey}>
            {/* Category Header */}
            <CategoryHeader category={{
              ...category,
              icon: (toolCategories as any)[categoryKey].icon,
              color: (toolCategories as any)[categoryKey].color
            }} />

            {/* Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tools.map((tool) => (
                <ToolCard key={tool.href} tool={{
                  ...tool,
                  icon: (toolCategories as any)[categoryKey].tools.find((t: any) => t.href === tool.href)?.icon
                }} category={{
                  ...category,
                  color: (toolCategories as any)[categoryKey].color
                }} />
              ))}
            </div>
          </section>
        ))}

        {/* Show additional sections only when not searching */}
        {!isSearching && (
          <>
            {/* Statistics Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-white mb-16">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Trusted Tools
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold">20+</div>
                    <div className="text-blue-100">Tools</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold">100%</div>
                    <div className="text-blue-100">Free</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold">24/7</div>
                    <div className="text-blue-100">Available</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold">0</div>
                    <div className="text-blue-100">Registration</div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ/About Section */}
            <section className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why choose Toolizio?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Fast and Simple
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All tools work directly in your browser, no installations or downloads required.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Secure and Private
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your data is processed locally. We don't store any personal information.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Mobile Friendly
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All tools work perfectly on phones, tablets and computers.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
