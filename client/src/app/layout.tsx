import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

import { InitialLoaderGate } from '@/components/initial-loader-gate'
import { PageTransition } from '@/components/PageTransition'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'FleetFlow',
  description: 'Truck dispatch management',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider afterSignOutUrl="/">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <InitialLoaderGate>
              <PageTransition>{children}</PageTransition>
            </InitialLoaderGate>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
