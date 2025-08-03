'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'

interface SwapQuote {
  dstAmount: string
  estimatedGas: string
  protocols: any[]
}

export default function RealSwapInterface() {
  const { address, isConnected } = useAccount()
  const [fromToken, setFromToken] = useState('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') // WETH
  const [toToken, setToToken] = useState('0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7') // USDC
  const [amount, setAmount] = useState('')
  const [quote, setQuote] = useState<SwapQuote | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGetQuote = async () => {
    if (!amount || !isConnected || !address) return

    setIsLoading(true)
    setError('')
    
    try {
      const amountWei = (parseFloat(amount) * 1e18).toString()
      
      const response = await fetch(`/api/1inch/quote?` + new URLSearchParams({
        src: fromToken,
        dst: toToken,
        amount: amountWei,
        from: address
      }))

      if (response.ok) {
        const quoteData = await response.json()
        setQuote(quoteData)
        console.log('✅ Real 1inch quote:', quoteData)
      } else {
        const errorData = await response.json()
        setError(`Quote failed: ${errorData.error}`)
      }
    } catch (error) {
      setError('Network error getting quote')
      console.error('❌ Quote error:', error)
    }
    setIsLoading(false)
  }

  const tokenOptions = [
    { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', name: 'Wrapped Ether' },
    { address: '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7', symbol: 'USDC', name: 'USD Coin' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', name: 'Wrapped Bitcoin' },
    { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI', name: 'Uniswap' }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">🔄 1inch Swap</h3>
        <div className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
          Real 1inch API
        </div>
      </div>
      
      <div className="space-y-4">
        {/* From Token */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 border rounded-lg px-3 py-3 text-lg"
            />
            <select 
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="border rounded-lg px-3 py-3 min-w-[120px]"
            >
              {tokenOptions.map(token => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Direction */}
        <div className="text-center">
          <button 
            onClick={() => {
              setFromToken(toToken)
              setToToken(fromToken)
              setQuote(null)
            }}
            className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-colors"
          >
            ⇅
          </button>
        </div>

        {/* To Token */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={quote ? (parseFloat(quote.dstAmount) / 1e6).toFixed(6) : '0.0'}
              readOnly
              placeholder="0.0"
              className="flex-1 border rounded-lg px-3 py-3 bg-white text-lg"
            />
            <select 
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="border rounded-lg px-3 py-3 min-w-[120px]"
            >
              {tokenOptions.map(token => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Get Quote Button */}
        <button
          onClick={handleGetQuote}
          disabled={!amount || !isConnected || isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
        >
          {isLoading ? '⏳ Getting Real Quote...' : '💎 Get 1inch Quote'}
        </button>

        {/* Quote Results */}
        {quote && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="font-semibold text-green-800 mb-2">✅ Real 1inch Quote Received!</div>
            <div className="space-y-1 text-sm text-green-700">
              <div>You'll receive: {(parseFloat(quote.dstAmount) / 1e6).toFixed(6)} {tokenOptions.find(t => t.address === toToken)?.symbol}</div>
              <div>Estimated gas: {parseInt(quote.estimatedGas || '0').toLocaleString()}</div>
              <div>Protocols: {quote.protocols?.length || 0} routes found</div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Connection Status */}
        {!isConnected && (
          <div className="text-center text-gray-500 py-4">
            🔗 Connect wallet to use real 1inch swaps
          </div>
        )}
      </div>
    </div>
  )
}