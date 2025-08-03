'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

interface PortfolioSnapshot {
  timestamp: number
  totalValue: number
  tokenBalances: { [symbol: string]: number }
  prices: { [symbol: string]: number }
}

interface PerformanceMetrics {
  totalReturn: number
  totalReturnPercent: number
  dayChange: number
  dayChangePercent: number
  bestPerformer: { symbol: string; change: number }
  worstPerformer: { symbol: string; change: number }
}

export default function PortfolioPerformance() {
  const { address, isConnected } = useAccount()
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>([])
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h')
  const [isLoading, setIsLoading] = useState(false)

  // Simulate portfolio history (in real app, this would come from backend)
  const generateMockHistory = () => {
    const now = Date.now()
    const snapshots: PortfolioSnapshot[] = []
    
    // Generate 30 days of mock data
    for (let i = 30; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000)
      const baseValue = 50000
      const volatility = 0.05 // 5% daily volatility
      const randomFactor = 1 + (Math.random() - 0.5) * volatility * 2
      
      snapshots.push({
        timestamp,
        totalValue: baseValue * randomFactor * (1 + Math.sin(i / 5) * 0.1),
        tokenBalances: {
          'WETH': 15 + Math.random() * 2,
          'USDC': 25000 + Math.random() * 5000,
          'WBTC': 0.8 + Math.random() * 0.2,
          'UNI': 1000 + Math.random() * 200
        },
        prices: {
          'WETH': 2500 + Math.random() * 200,
          'USDC': 1.00,
          'WBTC': 45000 + Math.random() * 3000,
          'UNI': 6 + Math.random() * 2
        }
      })
    }
    
    return snapshots
  }

  const calculateMetrics = (snapshots: PortfolioSnapshot[], timeframe: string) => {
    if (snapshots.length < 2) return null

    const latest = snapshots[snapshots.length - 1]
    let comparison: PortfolioSnapshot

    switch (timeframe) {
      case '24h':
        comparison = snapshots[snapshots.length - 2] || snapshots[0]
        break
      case '7d':
        comparison = snapshots[Math.max(0, snapshots.length - 8)] || snapshots[0]
        break
      case '30d':
        comparison = snapshots[0]
        break
      default:
        comparison = snapshots[0]
    }

    const totalReturn = latest.totalValue - comparison.totalValue
    const totalReturnPercent = (totalReturn / comparison.totalValue) * 100

    // Calculate token performance
    const tokenPerformances = Object.keys(latest.tokenBalances).map(symbol => {
      const latestPrice = latest.prices[symbol] || 0
      const comparisonPrice = comparison.prices[symbol] || 0
      const change = comparisonPrice > 0 ? ((latestPrice - comparisonPrice) / comparisonPrice) * 100 : 0
      return { symbol, change }
    })

    const bestPerformer = tokenPerformances.reduce((best, current) => 
      current.change > best.change ? current : best
    )
    
    const worstPerformer = tokenPerformances.reduce((worst, current) => 
      current.change < worst.change ? current : worst
    )

    return {
      totalReturn,
      totalReturnPercent,
      dayChange: totalReturn, // Simplified for demo
      dayChangePercent: totalReturnPercent,
      bestPerformer,
      worstPerformer
    }
  }

  useEffect(() => {
    if (isConnected) {
      setIsLoading(true)
      // Simulate API call delay
      setTimeout(() => {
        const mockSnapshots = generateMockHistory()
        setSnapshots(mockSnapshots)
        const calculatedMetrics = calculateMetrics(mockSnapshots, timeframe)
        setMetrics(calculatedMetrics)
        setIsLoading(false)
      }, 1000)
    }
  }, [isConnected, timeframe])

  if (!isConnected) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-bold mb-4">📈 Portfolio Performance</h3>
        <div className="text-center py-8 text-gray-500">
          Connect wallet to view portfolio performance analytics
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">📈 Portfolio Performance</h3>
          <div className="animate-spin">⏳</div>
        </div>
        <div className="text-center py-8 text-gray-500">
          Analyzing portfolio performance...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">📈 Portfolio Performance</h3>
        <div className="flex gap-2">
          {(['24h', '7d', '30d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {metrics && (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-800">Total Return</div>
              <div className={`text-2xl font-bold ${metrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.totalReturn >= 0 ? '+' : ''}${metrics.totalReturn.toFixed(2)}
              </div>
              <div className={`text-sm ${metrics.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.totalReturnPercent >= 0 ? '+' : ''}{metrics.totalReturnPercent.toFixed(2)}%
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-800">Best Performer</div>
              <div className="text-xl font-bold text-blue-600">{metrics.bestPerformer.symbol}</div>
              <div className="text-sm text-green-600">
                +{metrics.bestPerformer.change.toFixed(2)}%
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
              <div className="text-sm font-medium text-orange-800">Worst Performer</div>
              <div className="text-xl font-bold text-orange-600">{metrics.worstPerformer.symbol}</div>
              <div className="text-sm text-red-600">
                {metrics.worstPerformer.change.toFixed(2)}%
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="text-sm font-medium text-purple-800">Volatility</div>
              <div className="text-xl font-bold text-purple-600">Medium</div>
              <div className="text-sm text-purple-600">±5.2% daily</div>
            </div>
          </div>

          {/* Portfolio Value Chart (Simplified) */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-4">Portfolio Value Over Time</h4>
            <div className="h-32 flex items-end gap-1">
              {snapshots.slice(-30).map((snapshot, index) => {
                const height = ((snapshot.totalValue - 45000) / 10000) * 100
                return (
                  <div
                    key={index}
                    className="bg-blue-500 rounded-t min-h-[4px] flex-1"
                    style={{ height: `${Math.max(4, height)}%` }}
                    title={`$${snapshot.totalValue.toLocaleString()}`}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>

          {/* Asset Allocation */}
          <div>
            <h4 className="font-semibold mb-3">Current Asset Allocation</h4>
            <div className="space-y-2">
              {Object.entries(snapshots[snapshots.length - 1]?.tokenBalances || {}).map(([symbol, balance]) => {
                const price = snapshots[snapshots.length - 1]?.prices[symbol] || 0
                const value = balance * price
                const total = snapshots[snapshots.length - 1]?.totalValue || 1
                const percentage = (value / total) * 100

                return (
                  <div key={symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded" />
                      <span className="font-medium">{symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${value.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500 text-center">
        Performance data simulated for demo • Built with 1inch APIs
      </div>
    </div>
  )
}