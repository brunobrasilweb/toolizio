# Guia de Implementação SEO - Layouts de Ferramentas

## Visão Geral

Este documento fornece instruções passo-a-passo para adicionar metadados SEO otimizados e JSON-LD estruturado a todas as páginas de ferramentas do Toolizio.

## Padrão de Implementação

Cada ferramenta deve seguir este padrão em seu `layout.tsx`:

```typescript
import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Tool Name - Clear, Descriptive Title with Keywords",
  description: "Compelling description (155-160 characters) that explains what the tool does and its benefits for users.",
  keywords: [
    "primary-keyword",
    "secondary-keyword",
    "related-terms",
    "tool-specific-keywords",
  ],
  openGraph: {
    title: "Tool Name - Tool Title | Toolizio",
    description: "Short description for social sharing",
    type: "website",
    url: "https://toolizio.com/tool-slug",
    images: [
      {
        url: "/og-tool-slug.png",
        width: 1200,
        height: 630,
        alt: "Tool Name - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tool Name - Tool Title",
    description: "Short description for Twitter",
    images: ["/twitter-tool-slug.png"],
  },
  alternates: {
    canonical: "https://toolizio.com/tool-slug",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateToolStructuredData({
            name: 'Tool Name',
            description: 'Detailed description of what the tool does',
            url: 'https://toolizio.com/tool-slug',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/og-tool-slug.png',
            ratingValue: 4.8,
            ratingCount: 100,
          }),
        }}
      />
      
      {/* JSON-LD Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'Tool Name',
            toolSlug: '/tool-slug',
            categoryName: 'Category Name', // Get from categories data
            categorySlug: 'category-slug',   // Get from categories data
          }),
        }}
      />
      
      {children}
    </>
  );
}
```

## Checklist de Implementação

Para cada ferramenta, execute:

- [ ] Criar/atualizar `src/app/[tool-slug]/layout.tsx` com metadados
- [ ] Adicionar titulo único e descritivo (55-60 caracteres)
- [ ] Adicionar descrição clara (155-160 caracteres)
- [ ] Adicionar 4-8 keywords relevantes
- [ ] Adicionar imagem Open Graph `og-[tool-slug].png` (1200x630)
- [ ] Adicionar imagem Twitter `twitter-[tool-slug].png`
- [ ] Definir canonical URL correta
- [ ] Importar e usar `generateToolStructuredData()`
- [ ] Importar e usar `generateBreadcrumbStructuredData()`
- [ ] Testar com Google Structured Data Tool
- [ ] Verificar no PageSpeed Insights

## Ferramentas Prioritárias (Fase 1)

Implementar SEO para estas 15 ferramentas primeiro (maior tráfego):

1. **cpf-generator** ✅ (já implementado)
2. **password-generator**
3. **qr-code-generator**
4. **cnpj-generator**
5. **base64-tool**
6. **hash-generator**
7. **jwt-decoder**
8. **uuid-generator**
9. **json-to-csv**
10. **csv-to-json**
11. **xml-to-json**
12. **json-to-xml**
13. **barcode-generator**
14. **favicon-generator**
15. **email-extractor** (se existir)

## Ferramentas Secundárias (Fase 2)

Implementar para as 20+ ferramentas restantes:

- youtube-thumbnail
- instagram-image
- instagram-video
- youtube-video
- pomodoro-timer
- pix-qrcode
- md-to-pdf
- html-to-pdf
- html-to-image
- calorie-calculator
- age-calculator
- salary-calculator
- compound-interest
- fuel-consumption
- image-resizer
- image-cropper
- image-compressor
- bcrypt-generator
- barcode-generator
- whatsapp-link
- contact-extractor

## Dicas de SEO por Categoria

### Generators (cpf-generator, password-generator, etc.)

**Title Pattern:** `{Tool Name} - Generate {What} Online Free | Toolizio`  
**Description Pattern:** `Free {tool name} to create valid {items} instantly for {use case}. No registration needed.`

**Example:**
- Title: `Password Generator - Create Secure Passwords Online | Toolizio`
- Description: `Free password generator to create strong, secure passwords instantly for all your accounts.`

### Converters (base64-tool, json-to-csv, etc.)

**Title Pattern:** `{Format} to {Format} Converter - Free Online Tool | Toolizio`  
**Description Pattern:** `Convert {format} to {format} easily with our free online converter. Fast, secure, and no registration required.`

**Example:**
- Title: `JSON to CSV Converter - Free Online Tool | Toolizio`
- Description: `Convert JSON to CSV format instantly. Fast, secure conversion with no registration required.`

### Security Tools (hash-generator, bcrypt-generator, etc.)

**Title Pattern:** `{Tool Name} - Secure {Cryptographic Operation} Tool | Toolizio`  
**Description Pattern:** `Generate secure {hashes/cryptographic items} instantly with our free {tool name}. Perfect for developers and testers.`

**Example:**
- Title: `Hash Generator - MD5, SHA256, SHA512 Secure Hash Tool | Toolizio`
- Description: `Generate MD5, SHA1, SHA256, SHA512 hashes instantly. Free cryptographic hash generator for developers.`

### Media Tools (youtube-thumbnail, instagram-image, etc.)

**Title Pattern:** `{Platform} {Item} Downloader - Download Free Online | Toolizio`  
**Description Pattern:** `Download {platform} {items} in high quality instantly. Fast, free, and no registration needed.`

**Example:**
- Title: `YouTube Thumbnail Downloader - Download Video Thumbnails Free | Toolizio`
- Description: `Download YouTube video thumbnails in high quality instantly. Free, fast, and no registration required.`

## Palavras-Chave (Keywords) por Categoria

### Generators
- generator, generate, create, online, free, tool, valid, testing, development, instant

### Converters
- converter, convert, online, free, tool, format, json, csv, xml, easy, instant

### Security
- hash, generator, cryptographic, secure, md5, sha, bcrypt, encryption, development, testing

### Media
- downloader, download, extract, save, video, image, youtube, instagram, quality, high

## Exemplos Completos

### Exemplo 1: Password Generator

**Title:** `Password Generator - Create Strong Secure Passwords Online | Toolizio`  
**Description:** `Free password generator to create strong, secure passwords with customizable options. Instant generation, no sign-up.`  
**Keywords:** `password generator, strong password, secure password, random password, password maker, free tool`

### Exemplo 2: JSON to CSV Converter

**Title:** `JSON to CSV Converter - Free Online Data Converter Tool | Toolizio`  
**Description:** `Convert JSON data to CSV format instantly with our free online converter. No registration, fast, and secure.`  
**Keywords:** `json to csv, converter, json converter, csv converter, data converter, online converter`

### Exemplo 3: Hash Generator

**Title:** `Hash Generator - MD5, SHA1, SHA256, SHA512 Hash Tool | Toolizio`  
**Description:** `Generate MD5, SHA1, SHA256, SHA512 cryptographic hashes instantly. Free hash generator for developers and security.`  
**Keywords:** `hash generator, md5, sha256, sha512, cryptographic hash, online tool, development`

## Validação e Testes

Após implementar, execute:

1. **Google Structured Data Tester:**
   - https://search.google.com/test/rich-results
   - Cole a URL da ferramenta
   - Verifique se não há erros

2. **Google PageSpeed Insights:**
   - https://pagespeed.web.dev/
   - Analise performance e core web vitals

3. **XML Sitemap Validator:**
   - Verifique se a URL está no sitemap dinâmico
   - Verifique se lastmod está atualizado

4. **Google Search Console:**
   - Submeta a URL para indexação
   - Monitore erros de rastreamento

## Automação Futura

Para acelerar a implementação em massa:

1. **Criar script que:**
   - Lê categorias JSON
   - Gera layout.tsx automaticamente
   - Insere metadados corretos
   - Adiciona JSON-LD scripts

2. **Benefícios:**
   - Consistência garantida
   - Economia de tempo
   - Fácil manutenção
   - Atualizações automáticas

## Recursos Adicionais

- [Google Search Central SEO Starter Guide](https://developers.google.com/search/docs)
- [Schema.org Documentation](https://schema.org)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Moz SEO Best Practices](https://moz.com/beginners-guide-to-seo)

---

**Status de Implementação:** Fase 1 iniciada com CPF Generator como exemplo  
**Próximo Passo:** Implementar para as 14 ferramentas prioritárias restantes  
**Prazo Sugerido:** 1-2 semanas para Fase 1, Fase 2 em paralelo
