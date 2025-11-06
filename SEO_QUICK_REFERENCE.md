# SEO Quick Reference - Toolizio
## Guia Rápido para Implementação

---

## 🚀 COMEÇAR EM 5 MINUTOS

### 1. Entender o Padrão (Copiar de CPF Generator)
```
src/app/cpf-generator/layout.tsx ← Use como template
```

### 2. Adaptar para Nova Ferramenta
```
ALTERAR:
- "CPF Generator" → "Sua Ferramenta"
- "/cpf-generator" → "/sua-ferramenta"
- "Generators" → "Sua Categoria"
```

### 3. Criar Arquivo
```
src/app/sua-ferramenta/layout.tsx ← Cole código adaptado
```

### 4. Testar
```
https://search.google.com/test/rich-results
- Cole URL da ferramenta
- Verifique sem erros
```

---

## 📝 TEMPLATE MÍNIMO

```typescript
import type { Metadata } from "next";
import { generateToolStructuredData, generateBreadcrumbStructuredData } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Nome da Ferramenta - Descrição Breve | Toolizio",
  description: "Descrição de 155-160 caracteres aqui...",
  keywords: ["palavra1", "palavra2", "palavra3", "palavra4"],
  openGraph: {
    title: "Nome da Ferramenta - Descrição | Toolizio",
    description: "Descrição curta",
    type: "website",
    url: "https://toolizio.com/ferramenta-slug",
    images: [
      {
        url: "/og-ferramenta-slug.png",
        width: 1200,
        height: 630,
        alt: "Nome da Ferramenta - Toolizio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nome da Ferramenta",
    description: "Descrição curta",
    images: ["/twitter-ferramenta-slug.png"],
  },
  alternates: {
    canonical: "https://toolizio.com/ferramenta-slug",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateToolStructuredData({
            name: 'Nome da Ferramenta',
            description: 'Descrição completa do que a ferramenta faz',
            url: 'https://toolizio.com/ferramenta-slug',
            category: 'UtilityApplication',
            image: 'https://toolizio.com/og-ferramenta-slug.png',
            ratingValue: 4.8,
            ratingCount: 100,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            toolName: 'Nome da Ferramenta',
            toolSlug: '/ferramenta-slug',
            categoryName: 'Nome da Categoria',
            categorySlug: 'categoria-slug',
          }),
        }}
      />
      {children}
    </>
  );
}
```

---

## 📋 CHECKLIST POR FERRAMENTA

```
[ ] Nome e descrição definidos
[ ] Keywords pesquisadas e selecionadas
[ ] Title único (55-60 caracteres)
[ ] Description (155-160 caracteres)
[ ] Canonical URL correto
[ ] OG image preparada (1200x630)
[ ] Twitter image preparada
[ ] Layout.tsx criado/atualizado
[ ] Testado no Google Structured Data
[ ] Sem erros TypeScript
[ ] Build passou
[ ] URL submetida no GSC
[ ] Indexação monitorada
```

---

## 🎯 PALAVRAS-CHAVE POR TIPO

### Generators
- generator, gerar, criar, online, grátis, ferramenta, válido, teste, desenvolvimento

### Converters
- converter, converter para, online, grátis, formato, transformar, rápido

### Security Tools
- hash, criptografia, gerador, seguro, desenvolvimento, teste, criptográfico

### Media Tools
- downloader, baixar, extrair, salvar, vídeo, imagem, qualidade

---

## 🔗 LINKS ÚTEIS

### Validação
- Google Structured Data: https://search.google.com/test/rich-results
- Lighthouse: https://pagespeed.web.dev/
- W3C Validator: https://validator.w3.org/

### Submission
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters

### Documentação
- Schema.org: https://schema.org
- Google Search Central: https://developers.google.com/search

---

## 🐛 TROUBLESHOOTING

### Erro: "Property 'xyz' is not allowed"
```
Solução: Use apenas propriedades válidas em Metadata
Checar: NextJS Metadata API docs
```

### Erro: "JSON-LD invalid"
```
Solução: Validar no Google Structured Data Tool
Checar: Aspas, vírgulas, tipos de dados
```

### Erro: "Title/Description muito longo"
```
Solução: Reduzir para tamanho máximo
Title: 55-60 caracteres
Description: 155-160 caracteres
```

### Página não indexada após 1 semana
```
Solução: 
1. Verificar robots.txt
2. Submeter manualmente no GSC
3. Verificar canonical URL
4. Checar para erros de rastreamento
```

---

## 📊 CHECKLIST DE QUALIDADE

### Technical
- [ ] Sem erros de lint
- [ ] TypeScript valida
- [ ] Build sem warnings
- [ ] Sem console errors

### SEO
- [ ] Estrutura de dados válida
- [ ] Title único e otimizado
- [ ] Description clara e concisa
- [ ] Keywords relevantes
- [ ] Canonical correto
- [ ] Sem conteúdo duplicado

### Content
- [ ] Título atrai cliques
- [ ] Descrição descreve valor
- [ ] Palavras-chave naturais
- [ ] Match com intenção do usuário

### Performance
- [ ] Lighthouse score > 85
- [ ] Core Web Vitals OK
- [ ] Mobile-friendly
- [ ] Page load < 3s

---

## 📅 EXEMPLO DE WORKFLOW

### Segunda (1ª ferramenta)
```
09:00 - Copiar template CPF Generator
09:10 - Adaptar para nova ferramenta
09:30 - Salvar arquivo
09:35 - Testar no Google
09:45 - Corrigir erros
10:00 - Deploy para produção
Total: ~1 hora
```

### Terça-Sexta (2-4 ferramentas/dia)
```
Repetir processo acima
Tempo: 1 hora por ferramenta
```

### Sexta (Review semanal)
```
16:00 - Revisar todas implementações
16:30 - Testar estrutura de dados
17:00 - Submeter URLs no GSC
17:30 - Documentar próximos passos
Total: 1.5 horas
```

---

## 💡 PRO TIPS

### Dica 1: Copiar Estrutura de Dados
```
Copiar generateToolStructuredData() exatamente
Apenas mudar: name, description, url, image, ratingCount
```

### Dica 2: Reutilizar Keywords
```
Consultar categories.json para inspiração
Usar padrões de outros layouts como referência
```

### Dica 3: Testar Localmente
```
npm run dev
Acessar http://localhost:3000/ferramenta
Inspecionar meta tags (F12 → Head)
```

### Dica 4: Submeter em Batch
```
Implementar 5 ferramentas
Build única vez
Deploy única vez
Submeter 5 URLs juntas no GSC
```

### Dica 5: Monitorar Progresso
```
Criar planilha com:
- Ferramenta
- Data implementação
- Data indexação
- Ranking
- CTR
```

---

## 🎓 ORDEM RECOMENDADA

### Fase 1 (Semanas 1-2)
1. password-generator
2. qr-code-generator
3. cnpj-generator
4. base64-tool
5. hash-generator

### Fase 2 (Semanas 3-4)
6. uuid-generator
7. json-to-csv
8. csv-to-json
9. xml-to-json
10. json-to-xml

### Fase 3 (Semanas 5-6)
11. jwt-decoder
12. barcode-generator
13. favicon-generator
14. credit-card-generator
15. calorie-calculator

### Fase 4 (Semanas 7-8)
16-50+ Ferramentas restantes

---

## ⏱️ TEMPO ESTIMADO

```
Por ferramenta:
- Adaptar template: 5 min
- Criar arquivo: 5 min
- Testar: 10 min
- Deploy: 5 min
- Submeter GSC: 5 min
TOTAL: ~30 min por ferramenta

Bulk de 5 ferramentas:
- Adaptar 5: 25 min
- Criar 5: 25 min
- Testar 5: 20 min
- Build + Deploy: 10 min
- Submeter 5: 10 min
TOTAL: ~90 min (18 min por ferramenta média)
```

---

## 📞 SUPORTE RÁPIDO

### Tenho dúvida sobre...

**Metadados?**
→ Ver `SEO_LAYOUT_EXAMPLES.txt`

**Implementação?**
→ Copiar `cpf-generator/layout.tsx`

**Testes?**
→ https://search.google.com/test/rich-results

**Problemas?**
→ Ler `SEO_AUDIT_REPORT.md` seção Troubleshooting

**Plano geral?**
→ Consultar `PLANO_ACAO_90_DIAS.md`

---

## ✅ MARCA COMO PRONTO

Quando você puder marcar todos como ✅, a ferramenta está pronta:

```
SEO Completo para Ferramenta X:

✅ layout.tsx criado com metadados
✅ Estrutura JSON-LD válida
✅ Breadcrumb schema implementado
✅ Open Graph e Twitter cards
✅ Canonical URL correto
✅ Robots meta tag incluído
✅ Testado no Google
✅ Build sem erros
✅ Deploy em produção
✅ URL submetida no GSC
```

---

**Versão:** 1.0 Quick Reference  
**Data:** 6 de Novembro de 2025  
**Status:** ✅ PRONTO PARA USO

Use este guia como referência rápida durante a implementação!
