'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

interface LimitOrder {
  orderHash: string
  signature: string
  data: {
    makerAsset: string
    takerAsset: string
    makingAmount: string
    takingAmount: string
    maker: string
  }
  createDateTime: string
  fillableBalance: string
  orderStatus: number
}

export default function LimitOrderInterface() {
  const { address, isConnected } = useAccount()
  const [orders, setOrders] = useState<LimitOrder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  
  // New limit order form
  const [fromToken, setFromToken] = useState('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
  const [toToken, setToToken] = useState('0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7')
  const [sellAmount, setSellAmount] = useState('')
  const [buyAmount, setBuyAmount] = useState('')
  const [duration, setDuration] = useState('24h')

  const tokenOptions = [
    { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', name: 'Wrapped Ether' },
    { address: '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7', symbol: 'USDC', name: 'USD Coin' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', name: 'Wrapped Bitcoin' },
    { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI', name: 'Uniswap' }
  ]

  const fetchLimitOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/1inch/limit-orders?limit=20')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
        console.log('✅ Limit orders loaded:', data.orders?.length)
      }
    } catch (error) {
      console.error('❌ Limit orders fetch error:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (isConnected) {
      fetchLimitOrders()
    }
  }, [isConnected])

  const getOrderStatusText = (status: number) => {
    switch (status) {
      case 1: return { text: 'Active', color: 'text-green-600 bg-green-100' }
      case 2: return { text: 'Partially Filled', color: 'text-yellow-600 bg-yellow-100' }
      case 3: return { text: 'Cancelled', color: 'text-red-600 bg-red-100' }
      default: return { text: 'Unknown', color: 'text-gray-600 bg-gray-100' }
    }
  }

  const calculateLimitPrice = () => {
    if (!sellAmount || !buyAmount) return '0.00'
    return (parseFloat(buyAmount) / parseFloat(sellAmount)).toFixed(6)
  }

  if (!isConnected) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-bold mb-4">📋 1inch Limit Orders</h3>
        <div className="text-center py-8 text-gray-500">
          Connect wallet to create and manage limit orders
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">📋 1inch Limit Orders</h3>
        <div className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
          Advanced Trading
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'create' 
              ? 'border-b-2 border-purple-500 text-purple-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ➕ Create Order
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'manage' 
              ? 'border-b-2 border-purple-500 text-purple-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📊 Active Orders ({orders.length})
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🎯 Create Limit Order</h4>
            <p className="text-sm text-purple-700">
              Set your desired price and let 1inch execute automatically when conditions are met
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sell Token */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">You Sell</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <select 
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="border rounded-lg px-3 py-2 min-w-[100px]"
                >
                  {tokenOptions.map(token => (
                    <option key={token.address} value={token.address}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buy Token */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">You Receive</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <select 
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="border rounded-lg px-3 py-2 min-w-[100px]"
                >
                  {tokenOptions.map(token => (
                    <option key={token.address} value={token.address}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Limit Price:</span>
                <span className="ml-2 font-medium">{calculateLimitPrice()}</span>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="ml-2 border rounded px-2 py-1 text-xs"
                >
                  <option value="1h">1 Hour</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                </select>
              </div>
            </div>
          </div>

          <button
            disabled={!sellAmount || !buyAmount}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            🚀 Create Limit Order (Demo)
          </button>

          <div className="text-xs text-gray-500 text-center">
            Limit order creation requires wallet signature • Demo mode for hackathon
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block">⏳</div>
              <div className="text-gray-500 mt-2">Loading active limit orders...</div>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order, index) => {
                const status = getOrderStatusText(order.orderStatus)
                const sellToken = tokenOptions.find(t => t.address === order.data.makerAsset)
                const buyToken = tokenOptions.find(t => t.address === order.data.takerAsset)
                
                return (
                  <div key={order.orderHash || index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          {sellToken?.symbol || 'Unknown'} → {buyToken?.symbol || 'Unknown'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createDateTime).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Sell Amount</div>
                        <div className="font-medium">
                          {(parseFloat(order.data.makingAmount) / 1e18).toFixed(4)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Buy Amount</div>
                        <div className="font-medium">
                          {(parseFloat(order.data.takingAmount) / 1e6).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Fillable</div>
                        <div className="font-medium">
                          {(parseFloat(order.fillableBalance || '0') / 1e18).toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <div>No active limit orders found</div>
              <div className="text-sm mt-2">Create your first limit order to get started</div>
            </div>
          )}

          <button
            onClick={fetchLimitOrders}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            🔄 Refresh Orders
          </button>
        </div>
      )}
    </div>
  )
}