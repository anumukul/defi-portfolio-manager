'use client'

import './globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/config'
import { useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-gray-50">
              <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    DeFi Portfolio Manager
                  </h1>
                </div>
              </header>
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}