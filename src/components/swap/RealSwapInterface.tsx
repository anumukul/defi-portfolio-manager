'use client'

import { useState, useEffect } from 'react'

interface Token {
  symbol: string
  address: string
  decimals: number
}

export default function RealSwapInterface() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [fromToken, setFromToken] = useState<string>('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
  const [toToken, setToToken] = useState<string>('0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [quoteData, setQuoteData] = useState<any>(null)

  useEffect(() => {
    fetchTokens()
  }, [])

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/1inch/tokens')
      const data = await response.json()
      const tokenArray = Object.values(data).slice(0, 8) as Token[]
      setTokens(tokenArray)
    } catch (error) {
      setTokens([
        { symbol: 'ETH', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', decimals: 18 },
        { symbol: 'USDC', address: '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7', decimals: 6 },
        { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 }
      ])
    }
  }

  const getQuote = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return

    setLoading(true)
    try {
      const fromTokenData = tokens.find(t => t.address === fromToken)
      const amount = (parseFloat(fromAmount) * Math.pow(10, fromTokenData?.decimals || 18)).toString()
      
      const response = await fetch(
        `/api/1inch/quote?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${amount}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setQuoteData(data)
        
        const toTokenData = tokens.find(t => t.address === toToken)
        const outputAmount = parseFloat(data.dstAmount || '0') / Math.pow(10, toTokenData?.decimals || 6)
        setToAmount(outputAmount.toFixed(6))
      }
    } catch (error) {
      console.error('Quote error:', error)
    }
    setLoading(false)
  }

  const executeSwap = () => {
    if (!quoteData || !fromAmount || !toAmount) {
      alert('Please get a quote first!')
      return
    }

    const fromSymbol = tokens.find(t => t.address === fromToken)?.symbol || 'Token'
    const toSymbol = tokens.find(t => t.address === toToken)?.symbol || 'Token'
    
    alert(`🎉 Swap Executed Successfully!\n\n${fromAmount} ${fromSymbol} → ${toAmount} ${toSymbol}\n\nTransaction would be sent to your wallet for signing.\n\nNote: This is a hackathon demo with real quotes.`)
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">🔄 Token Swap</h2>
      
      {/* From Section */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <select 
              className="bg-white p-2 rounded-lg border font-medium"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
            >
              {tokens.map(token => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="0.0"
              className="text-right text-xl font-medium bg-transparent border-none outline-none"
              value={fromAmount}
              onChange={(e) => {
                setFromAmount(e.target.value)
                setToAmount('')
                setQuoteData(null)
              }}
              style={{ width: '120px' }}
            />
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center my-4">
        <button 
          onClick={() => {
            const temp = fromToken
            setFromToken(toToken)
            setToToken(temp)
            setFromAmount('')
            setToAmount('')
            setQuoteData(null)
          }}
          className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-all duration-200 transform hover:scale-110"
        >
          <span className="text-xl">⇅</span>
        </button>
      </div>

      {/* To Section */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <select 
              className="bg-white p-2 rounded-lg border font-medium"
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
            >
              {tokens.map(token => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <div className="text-right text-xl font-medium text-gray-600" style={{ width: '120px' }}>
              {loading ? '...' : toAmount || '0.0'}
            </div>
          </div>
        </div>
      </div>

      {/* Quote Info */}
      {quoteData && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Rate:</span>
              <span className="font-medium">
                1 {tokens.find(t => t.address === fromToken)?.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4)} {tokens.find(t => t.address === toToken)?.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Route:</span>
              <span className="font-medium">1inch Optimized</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={getQuote}
          disabled={!fromAmount || loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            fromAmount && !loading
              ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Getting Quote...' : 'Get Quote'}
        </button>
        
        {quoteData && (
          <button
            onClick={executeSwap}
            className="w-full py-3 px-4 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
          >
            Execute Swap 🚀
          </button>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Real quotes powered by 1inch • Demo execution
      </div>
    </div>
  )
}