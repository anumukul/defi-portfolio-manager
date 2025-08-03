'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'

export default function SwapInterface() {
  const { address, isConnected } = useAccount()
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('USDC')
  const [amount, setAmount] = useState('')
  const [quote, setQuote] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGetQuote = async () => {
    if (!amount || !isConnected || !address) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/1inch/quote?` + new URLSearchParams({
        src: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
        dst: '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7', // USDC
        amount: (parseFloat(amount) * 1e18).toString(),
        from: address
      }))

      if (response.ok) {
        const quoteData = await response.json()
        setQuote(quoteData)
        console.log('✅ Real 1inch quote received:', quoteData)
      } else {
        console.error('❌ Quote failed')
      }
    } catch (error) {
      console.error('❌ Quote error:', error)
    }
    setIsLoading(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🔄 1inch Swap</h3>
        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          Real 1inch API
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <select 
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="ETH">ETH</option>
              <option value="WETH">WETH</option>
            </select>
          </div>
        </div>

        <div className="text-center">
          <button className="text-blue-500 hover:text-blue-600">
            ⇅
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={quote ? (parseInt(quote.dstAmount) / 1e6).toFixed(2) : '0.0'}
              readOnly
              placeholder="0.0"
              className="flex-1 border rounded-lg px-3 py-2 bg-gray-50"
            />
            <select 
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGetQuote}
          disabled={!amount || !isConnected || isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {isLoading ? '⏳ Getting Quote...' : '💸 Get Real Quote'}
        </button>

        {quote && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm">
            <div className="font-medium text-green-800">✅ Real 1inch Quote:</div>
            <div className="text-green-700">
              Receive: {(parseInt(quote.dstAmount) / 1e6).toFixed(2)} {toToken}
            </div>
            <div className="text-green-600 text-xs mt-1">
              Via 1inch Protocol • Gas: ~{parseInt(quote.estimatedGas || '0').toLocaleString()}
            </div>
          </div>
        )}

        {!isConnected && (
          <div className="text-center text-gray-500 text-sm">
            Connect wallet to use real 1inch swaps
          </div>
        )}
      </div>
    </div>
  )
}