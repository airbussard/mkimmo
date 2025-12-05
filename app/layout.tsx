import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ConsentBanner } from '@/components/consent/ConsentBanner'
import { COMPANY_INFO } from '@/config/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: `${COMPANY_INFO.name} - Immobilien & Hausverwaltung`,
    template: `%s | ${COMPANY_INFO.name}`,
  },
  description:
    'Ihr kompetenter Partner für Immobilien und Hausverwaltung in Eschweiler und Umgebung. Wir unterstützen Sie beim Kauf, Verkauf und der Verwaltung Ihrer Immobilie.',
  keywords: [
    'Immobilien',
    'Hausverwaltung',
    'Makler',
    'Eschweiler',
    'Aachen',
    'Wohnung kaufen',
    'Haus kaufen',
    'Immobilienverwaltung',
  ],
  authors: [{ name: COMPANY_INFO.name }],
  creator: COMPANY_INFO.name,
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://moellerknabe.de',
    siteName: COMPANY_INFO.name,
    title: `${COMPANY_INFO.name} - Immobilien & Hausverwaltung`,
    description:
      'Ihr kompetenter Partner für Immobilien und Hausverwaltung in Eschweiler und Umgebung.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ConsentBanner />
      </body>
    </html>
  )
}
