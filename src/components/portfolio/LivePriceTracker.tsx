'use client'

import { useState, useEffect } from 'react'

interface TokenPrice {
  [address: string]: number
}

export default function LivePriceTracker() {
  const [prices, setPrices] = useState<TokenPrice>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrices = async () => {
    try {
      console.log('🔄 Fetching live prices...')
      
      const tokenAddresses = [
        '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7', // USDC
        '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'  // WBTC
      ].join(',')

      const response = await fetch(`/api/1inch/prices?tokens=${tokenAddresses}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Live prices updated:', data)
        setPrices(data)
        setError(null)
      } else {
        console.warn('⚠️ API failed, using fallback prices')
        setPrices({
          '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7': 1.00,
          '0xdAC17F958D2ee523a2206206994597C13D831ec7': 1.00,
          '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 43250.00
        })
        setError('Using demo prices')
      }
    } catch (error) {
      console.error('❌ Price fetch failed:', error)
      setPrices({
        '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7': 1.00,
        '0xdAC17F958D2ee523a2206206994597C13D831ec7': 1.00,
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 43250.00
      })
      setError('Network error - using demo prices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-3">📈 Live Token Prices</h3>
        <div className="animate-pulse">Loading prices...</div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-3">📈 Live Token Prices</h3>
      
      {error && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        {Object.entries(prices).map(([tokenAddress, price]) => {
          const getTokenInfo = (addr: string) => {
            if (addr.includes('A0b86a33')) return { symbol: 'USDC', name: 'USD Coin' }
            if (addr.includes('dAC17F95')) return { symbol: 'USDT', name: 'Tether USD' }
            if (addr.includes('2260FAC5')) return { symbol: 'WBTC', name: 'Wrapped Bitcoin' }
            return { symbol: 'TOKEN', name: 'Unknown Token' }
          }
          
          const tokenInfo = getTokenInfo(tokenAddress)
          
          return (
            <div key={tokenAddress} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div className="text-sm">
                <div className="font-medium">{tokenInfo.symbol}</div>
                <div className="text-xs text-gray-500">{tokenAddress.substring(0, 8)}...</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">
                  ${typeof price === 'number' ? price.toLocaleString() : price}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Updates every 30 seconds • Powered by 1inch
      </div>
    </div>
  )
}