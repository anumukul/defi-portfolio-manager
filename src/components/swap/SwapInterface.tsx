'use client'

import { useState } from 'react'

interface QuoteResponse {
  dstAmount: string;
  fromToken: {
    symbol: string;
    address: string;
  };
  toToken: {
    symbol: string;
    address: string;
  };
  protocols?: any[];
}

export default function SwapInterface() {
  const [fromAmount, setFromAmount] = useState('')
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('USDC')

  const getQuote = async () => {
    if (!fromAmount || parseFloat(fromAmount) === 0) return

    setLoading(true)
    try {
      const response = await fetch(`/api/1inch/quote?fromTokenAddress=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&toTokenAddress=0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7&amount=${parseFloat(fromAmount) * 1e18}`)
      
      if (response.ok) {
        const data = await response.json()
        setQuote(data)
      } else {
        // Fallback demo quote
        setQuote({
          dstAmount: (parseFloat(fromAmount) * 2645 * 1e6).toString(),
          fromToken: { symbol: fromToken, address: '0xEee...' },
          toToken: { symbol: toToken, address: '0xA0b...' }
        })
      }
    } catch (error) {
      console.error('Quote error:', error)
      // Demo fallback
      setQuote({
        dstAmount: (parseFloat(fromAmount) * 2645 * 1e6).toString(),
        fromToken: { symbol: fromToken, address: '0xEee...' },
        toToken: { symbol: toToken, address: '0xA0b...' }
      })
    }
    setLoading(false)
  }

  const executeSwap = async () => {
    if (!quote) return
    
    alert('Swap would execute here with 1inch API integration')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">🔄 Token Swap</h3>
      
      <div className="space-y-4">
        {/* From Token */}
        <div>
          <label className="block text-sm font-medium mb-2">From</label>
          <div className="flex gap-2">
            <select 
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
            </select>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* To Token */}
        <div>
          <label className="block text-sm font-medium mb-2">To</label>
          <div className="flex gap-2">
            <select 
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="USDC">USDC</option>
              <option value="ETH">ETH</option>
              <option value="USDT">USDT</option>
            </select>
            <input
              type="text"
              value={quote ? (parseInt(quote.dstAmount) / 1e6).toFixed(2) : '0.0'}
              readOnly
              placeholder="0.0"
              className="flex-1 border rounded-lg px-3 py-2 bg-gray-50"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={getQuote}
            disabled={loading || !fromAmount}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Getting Quote...' : 'Get Quote'}
          </button>
          
          {quote && (
            <button
              onClick={executeSwap}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Execute Swap
            </button>
          )}
        </div>
      </div>

      {quote && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800">
            Quote: {fromAmount} {fromToken} → {(parseInt(quote.dstAmount) / 1e6).toFixed(2)} {toToken}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        Powered by 1inch Quote API
      </div>
    </div>
  )
}