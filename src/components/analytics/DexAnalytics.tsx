'use client'

import { useState, useEffect } from 'react'

interface Protocol {
  id: string
  title: string
  img: string
}

interface LiquiditySource {
  id: string
  title: string
  liquidity: string
}

export default function DexAnalytics() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [liquiditySources, setLiquiditySources] = useState<LiquiditySource[]>([])
  const [selectedToken, setSelectedToken] = useState('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'protocols' | 'liquidity'>('protocols')

  const tokens = [
    { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH' },
    { address: '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7', symbol: 'USDC' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC' },
    { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI' }
  ]

  const fetchProtocols = async () => {
    try {
      const response = await fetch('/api/1inch/protocols')
      if (response.ok) {
        const data = await response.json()
        setProtocols(data.protocols || [])
        console.log('✅ Protocols loaded:', data.protocols?.length)
      }
    } catch (error) {
      console.error('❌ Protocols fetch error:', error)
    }
  }

  const fetchLiquidity = async (tokenAddress: string) => {
    try {
      const response = await fetch(`/api/1inch/liquidity?token=${tokenAddress}`)
      if (response.ok) {
        const data = await response.json()
        setLiquiditySources(data.liquiditySources || [])
        console.log('✅ Liquidity sources loaded:', data.liquiditySources?.length)
      }
    } catch (error) {
      console.error('❌ Liquidity fetch error:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchProtocols(),
        fetchLiquidity(selectedToken)
      ])
      setIsLoading(false)
    }
    loadData()
  }, [selectedToken])

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">🔍 DEX Analytics</h3>
          <div className="animate-spin">⏳</div>
        </div>
        <div className="text-center py-8 text-gray-500">
          Loading 1inch protocols and liquidity data...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">🔍 DEX Analytics</h3>
        <div className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
          Real 1inch Data
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('protocols')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'protocols' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🏪 Protocols ({protocols.length})
        </button>
        <button
          onClick={() => setActiveTab('liquidity')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'liquidity' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          💧 Liquidity Sources ({liquiditySources.length})
        </button>
      </div>

      {activeTab === 'protocols' && (
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Available DEX protocols on 1inch aggregator:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {protocols.slice(0, 12).map((protocol) => (
                <div key={protocol.id} className="bg-gray-50 p-3 rounded-lg text-center">
                  {protocol.img && (
                    <img 
                      src={protocol.img} 
                      alt={protocol.title}
                      className="w-8 h-8 mx-auto mb-2 rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                  <div className="text-xs font-medium text-gray-800">{protocol.title}</div>
                  <div className="text-xs text-gray-500">{protocol.id}</div>
                </div>
              ))}
            </div>
            {protocols.length > 12 && (
              <div className="text-center mt-4">
                <span className="text-sm text-gray-500">
                  +{protocols.length - 12} more protocols available
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'liquidity' && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Token for Liquidity Analysis:
            </label>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
            >
              {tokens.map(token => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {liquiditySources.slice(0, 8).map((source, index) => (
              <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{source.title}</div>
                    <div className="text-xs text-gray-500">{source.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">
                    {source.liquidity ? `$${parseFloat(source.liquidity).toLocaleString()}` : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">Liquidity</div>
                </div>
              </div>
            ))}
          </div>

          {liquiditySources.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No liquidity sources found for selected token
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => {
          fetchProtocols()
          fetchLiquidity(selectedToken)
        }}
        className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
      >
        🔄 Refresh Analytics Data
      </button>
    </div>
  )
}