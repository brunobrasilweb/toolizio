import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sorteio - Faça um sorteio online de nomes | Toolizio',
  description: 'Ferramenta gratuita para realizar sorteios online: cole uma lista de nomes e sorteie um vencedor com animação atraente. Resultado em destaque e opção de copiar.',
  keywords: [
    'sorteio',
    'sorteio online',
    'random',
    'sortear nomes',
    'raffle',
    'winner',
    'toolizio'
  ],
  openGraph: {
    title: 'Sorteio - Sorteie nomes online | Toolizio',
    description: 'Ferramenta gratuita para realizar sorteios online: cole uma lista de nomes e sorteie um vencedor com animação atraente.',
    type: 'website',
    url: 'https://toolizio.com/sorteio',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Sorteio - Toolizio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sorteio - Faça um sorteio online de nomes',
    description: 'Cole uma lista de nomes e sorteie um vencedor com animação atraente.',
  },
  alternates: {
    canonical: 'https://toolizio.com/sorteio',
  },
}

export default function SorteioLayout({ children }: { children: React.ReactNode }) {
  return children
}
