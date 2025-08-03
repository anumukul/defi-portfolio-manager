'use client'

import { useState, useEffect } from 'react'

interface TokenPrice {
  [address: string]: string
}

export default function LivePriceTracker() {
  const [prices, setPrices] = useState<TokenPrice>({})
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const majorTokens = {
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': 'WETH',
    '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7': 'USDC',
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 'WBTC',
    '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984': 'UNI',
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': 'DAI',
    '0x514910771AF9Ca656af840dff83E8264EcF986CA': 'LINK'
  }

  const fetchPrices = async () => {
    try {
      const tokenAddresses = Object.keys(majorTokens).join(',')
      const response = await fetch(`/api/1inch/prices?tokens=${tokenAddresses}`)
      
      if (response.ok) {
        const data = await response.json()
        setPrices(data)
        setLastUpdate(new Date())
        console.log('✅ Live prices updated:', data)
      } else {
        console.error('❌ Price fetch failed')
      }
    } catch (error) {
      console.error('❌ Price fetch error:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">📊 Live Token Prices</h3>
          <div className="animate-spin">⏳</div>
        </div>
        <div className="text-center py-8 text-gray-500">
          Loading real-time prices from 1inch...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">📊 Live Token Prices</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 font-medium">LIVE 1inch API</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(majorTokens).map(([address, symbol]) => {
          const price = prices[address]
          const formattedPrice = price ? parseFloat(price).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
          }) : 'Loading...'

          return (
            <div key={address} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{symbol}</div>
                  <div className="text-lg font-bold text-blue-600">{formattedPrice}</div>
                </div>
                <div className="text-2xl">
                  {symbol === 'WETH' && '⟠'}
                  {symbol === 'USDC' && '💵'}
                  {symbol === 'WBTC' && '₿'}
                  {symbol === 'UNI' && '🦄'}
                  {symbol === 'DAI' && '🔶'}
                  {symbol === 'LINK' && '🔗'}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {lastUpdate && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          Last updated: {lastUpdate.toLocaleTimeString()} via 1inch Price API
        </div>
      )}

      <button
        onClick={fetchPrices}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
      >
        🔄 Refresh Prices
      </button>
    </div>
  )
}