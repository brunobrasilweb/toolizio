### Instruções de uso
- Preencha todos os campos entre colchetes `[]` antes de usar.
- O conteúdo da página (para o usuário final) deve ser em inglês, conforme especificado no template — o prompt porém pode estar em português.
- O implementador deve seguir fielmente os padrões visuais e funcionais do repositório.
- A implementação deve ser real: não usar placeholders que quebrem o build.

---

## Template (preencha os placeholders)

Título: Implementar nova página de ferramenta — [TOOL_NAME] (slug: [SLUG])

Descrição resumida:
- Criar uma nova página totalmente funcional para a ferramenta chamada "[TOOL_NAME]" na rota `/[SLUG]` usando o app router do Next.js e TypeScript.
- A página deverá ser escrita em inglês (conteúdo visível ao usuário).
- Seguir exatamente os padrões visuais e funcionais das páginas existentes (por exemplo: `Image Compressor`).
- SEO otimizado (title, meta description, canonical, structured data / JSON-LD).
- Layout consistente: reutilizar componentes do projeto em `src/components` (Header, Footer, CategoryHeader, ToolCard, GoogleAnalytics, etc.).
- Incluir descrição detalhada, lista de features (com ícones compatíveis com `lib/iconMap.tsx`), seção "How it works", exemplos de input/output, CTAs e integração com Google Analytics.
- Garantir que a ferramenta apareça como um card na página principal (ou listagem de categoria) e que a rota seja adicionada em `public/sitemap.xml`.
- Evitar bibliotecas externas desnecessárias; priorizar APIs nativas do browser e utilitários já presentes no projeto.
- A implementação deve compilar sem erros com `npm run build` e executar com `npm run dev`.

Campos obrigatórios (preencher):
- TOOL_NAME: [TOOL_NAME]
- SLUG: [slug-sem-barras-ou-espaços] (exemplo: image-compressor)
- SHORT_DESCRIPTION (1 frase): [short description]
- LONG_DESCRIPTION (2–4 parágrafos, em inglês): [long description]
- FEATURES (lista de objetos): [
  { title: "Fast compression", icon: "compress", description: "…" },
  ...
]
- HOW_IT_WORKS (lista ordenada de passos): ["Upload image", "Choose quality", "Download result"]
- CATEGORY (uma das categorias existentes; especifique): [category-slug]
- HOMEPAGE_PROMO (boolean): true/false (se true, atualizar listagem principal)
- THUMBNAIL_PATH (relativo a `public/`): [public/images/<file>.png]
- OG_IMAGE (caminho se diferente do thumbnail): [public/og/<file>.png]
- ANALYTICS_EVENT (string): ex.: `tool_[slug]_used`
- SEO_META (opcional): { title: "", description: "", keywords: ["", ""] }

Arquivos/alterações a criar ou editar (específico):
- Adicionar:
  - `src/app/[SLUG]/page.tsx` — UI principal da página + componentes server/client conforme necessário (conteúdo em inglês).
  - `src/app/[SLUG]/layout.tsx` — se a página precisar de wrappers de layout específicos (seguir padrão do projeto).
  - Opcional: `src/app/[SLUG]/head.tsx` — caso queira separar meta tags.
- Editar:
  - `src/app/page.tsx` ou o arquivo que renderiza a lista de ferramentas (para exibir o `ToolCard`) — adicionar a entrada ou garantir que a fonte de dados inclui a nova ferramenta.
  - `data/categories/[category].json` ou outro arquivo de dados usado pelo projeto — adicionar metadados da ferramenta seguindo o formato existente.
  - `public/sitemap.xml` — inserir um nó `<url>` com a rota `https://<SEU_DOMÍNIO>/<SLUG>` (manter XML válido).
- Integrações:
  - Reutilizar `components/GoogleAnalytics.tsx` (ou o helper existente) para disparar o evento `ANALYTICS_EVENT` no CTA principal e em downloads.
  - Usar ícones via `lib/iconMap.tsx` e `components/ToolIcons.tsx` para consistência visual.

Contrato mínimo (inputs/outputs, modos de erro):
- Inputs: arquivo/imagem/texto ou outros inputs definidos em HOW_IT_WORKS.
- Outputs: arquivo processado para download, preview na UI, mensagens para o usuário.
- Modos de erro: tipo de arquivo inválido, arquivo muito grande, erro de processamento — tratar com mensagens amigáveis e sem quebrar SSR.
- Critérios de sucesso:
  - Página renderiza com o mesmo layout das outras ferramentas.
  - Tags de SEO preenchidas corretamente.
  - Card da ferramenta visível na homepage/categoria.
  - Entrada adicionada em `public/sitemap.xml`.
  - `npm run build` conclui sem erros de tipagem/linters críticos.

Casos de borda importantes:
- Upload de tipos de arquivo não suportados -> mensagem de validação.
- Arquivos muito grandes -> limite claro e falha graciosa.
- Falta de thumbnail/OG -> fallback para imagem padrão do site.
- Processamento lento -> exibir spinner e permitir cancelamento quando aplicável.
- Sem JS (SSR) -> garantir que título e descrição principais sejam server-rendered para SEO.

Boas práticas (Next.js + TypeScript):
- Usar React Server Components onde apropriado; marcar componentes clientes com `'use client'` apenas quando necessário.
- Manter componentes pequenos e reutilizáveis.
- Preferir APIs nativas para manipulação de arquivos; adicionar dependências apenas se justificadas.
- Tipar todas as props e retornos; evitar `any`.
- Colocar efeitos colaterais em hooks; disparos de analytics apenas no lado cliente.
- Usar classes Tailwind já adotadas no projeto para manter consistência visual.
- Acessibilidade: usar atributos ARIA e elementos semânticos.
- Usar `next/image` para imagens otimizadas quando apropriado.
- Para downloads, usar Blob + URL.createObjectURL e clique programático.

Guia rápido para atualizar o `sitemap.xml`:
- Abrir `public/sitemap.xml` e inserir:
  <url>
    <loc>https://<SEU_DOMINIO>/<SLUG></loc>
    <lastmod>[YYYY-MM-DD]</lastmod>
  </url>
- Garantir que o XML continue válido. Se o projeto possuir gerador de sitemap, preferir atualizar a fonte do gerador.

Google Analytics:
- Reutilizar `components/GoogleAnalytics.tsx`. Exemplo de uso no clique do CTA:
  analytics.trackEvent('[ANALYTICS_EVENT]', { tool: '[SLUG]', action: 'start' });
- Garantir que o disparo ocorra apenas no lado cliente.

Critérios de qualidade e verificação (comandos PowerShell):
- Build:
```powershell
npm run build
```
- Iniciar servidor de desenvolvimento:
```powershell
npm run dev
```
- Opcional: lint/type-check (se existir no package.json):
```powershell
npm run lint
npm run type-check
```
- Teste rápido (smoke test):
  - Abrir http://localhost:3000/[SLUG] e verificar renderização.
  - Clicar no CTA principal para disparar analytics e processamento.
  - Confirmar que o card aparece na homepage e que `public/sitemap.xml` contém a rota.

Diretrizes para commits/PR:
- Nome da branch: `feat/tool/[slug]`
- Commit message: `feat: add [TOOL_NAME] page (/[slug])`
- Descrição do PR: resumo, arquivos alterados, passos de QA, checklist (build/dev OK).

Checklist para PR:
- [ ] Build OK
- [ ] Dev server OK
- [ ] Tool aparece na homepage
- [ ] Sitemap atualizado
- [ ] Analytics disparado no CTA



