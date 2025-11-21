import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Architecte Make AI - Créateur de Scénarios Intelligents',
  description: 'Générez des scénarios Make.com automatisés avec intelligence artificielle intégrée',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
