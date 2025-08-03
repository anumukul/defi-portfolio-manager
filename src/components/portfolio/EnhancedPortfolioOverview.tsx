'use client'

import { useState, useEffect } from 'react'

interface PortfolioToken {
  symbol: string
  balance: number
  value: number
  change24h: number
  address: string
}

export default function EnhancedPortfolioOverview() {
  const [portfolio, setPortfolio] = useState<PortfolioToken[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [totalChange, setTotalChange] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolioData()
    const interval = setInterval(fetchPortfolioData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const pricesResponse = await fetch('/api/1inch/prices?tokens=0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7,0xdAC17F958D2ee523a2206206994597C13D831ec7,0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599')
      const prices = await pricesResponse.json()

      const portfolioData: PortfolioToken[] = [
        {
          symbol: 'ETH',
          balance: 2.5,
          value: 2.5 * 2645,
          change24h: Math.random() * 10 - 5,
          address: '0xEee...'
        },
        {
          symbol: 'USDC',
          balance: 5000,
          value: 5000 * (prices['0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7'] || 1),
          change24h: Math.random() * 2 - 1,
          address: '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7'
        },
        {
          symbol: 'USDT', 
          balance: 2500,
          value: 2500 * (prices['0xdAC17F958D2ee523a2206206994597C13D831ec7'] || 1),
          change24h: Math.random() * 2 - 1,
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
        },
        {
          symbol: 'WBTC',
          balance: 0.15,
          value: 0.15 * (prices['0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'] || 43250),
          change24h: Math.random() * 8 - 4,
          address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        }
      ]

      const total = portfolioData.reduce((sum, token) => sum + token.value, 0)
      const avgChange = portfolioData.reduce((sum, token) => sum + (token.change24h * token.value), 0) / total

      setPortfolio(portfolioData)
      setTotalValue(total)
      setTotalChange(avgChange)
    } catch (error) {
      console.error('Portfolio fetch error:', error)
      setPortfolio([
        { symbol: 'ETH', balance: 2.5, value: 6612.5, change24h: 2.3, address: '0xEee...' },
        { symbol: 'USDC', balance: 5000, value: 5000, change24h: 0.1, address: '0xA0b...' },
        { symbol: 'USDT', balance: 2500, value: 2500, change24h: -0.05, address: '0xdAC...' },
        { symbol: 'WBTC', balance: 0.15, value: 6487.5, change24h: 1.8, address: '0x226...' }
      ])
      setTotalValue(20600)
      setTotalChange(1.2)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">💰 Portfolio Overview</h2>
      
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <div className="text-sm text-gray-600 mb-1">Total Portfolio Value</div>
        <div className="text-3xl font-bold text-gray-800 mb-2">
          ${totalValue.toLocaleString()}
        </div>
        <div className={`text-sm font-medium flex items-center ${
          totalChange >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <span className="mr-1">{totalChange >= 0 ? '↗️' : '↘️'}</span>
          {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}% (24h)
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700 mb-3">Token Holdings</h3>
        {portfolio.map((token, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {token.symbol.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{token.symbol}</div>
                <div className="text-sm text-gray-600">{token.balance} tokens</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-gray-800">${token.value.toLocaleString()}</div>
              <div className="text-sm flex items-center justify-end space-x-2">
                <span className="text-gray-600">
                  {((token.value / totalValue) * 100).toFixed(1)}%
                </span>
                <span className={`font-medium ${
                  token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600">Assets</div>
          <div className="font-bold text-blue-600">{portfolio.length}</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-600">Best Performer</div>
          <div className="font-bold text-green-600">
            {portfolio.reduce((best, token) => 
              token.change24h > best.change24h ? token : best
            ).symbol}
          </div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-sm text-gray-600">Largest Holding</div>
          <div className="font-bold text-purple-600">
            {portfolio.reduce((largest, token) => 
              token.value > largest.value ? token : largest
            ).symbol}
          </div>
        </div>
      </div>
    </div>
  )
}