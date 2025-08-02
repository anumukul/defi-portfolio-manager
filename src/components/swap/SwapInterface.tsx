'use client'

import { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { oneInchAPI } from '@/lib/1inch-api'

interface SwapQuote {
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  gas: string
  gasPrice: string
}

export default function SwapInterface() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  const [fromToken, setFromToken] = useState('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') // ETH
  const [toToken, setToToken] = useState('0xA0b86a33E6441d4c6Fc7e0fD8Fc3c8B3C6e87e4f') // USDC
  const [fromAmount, setFromAmount] = useState('')
  const [quote, setQuote] = useState<SwapQuote | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const commonTokens = [
    { symbol: 'ETH', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', name: 'Ethereum' },
    { symbol: 'USDC', address: '0xA0b86a33E6441d4c6Fc7e0fD8Fc3c8B3C6e87e4f', name: 'USD Coin' },
    { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether' },
    { symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', name: 'Uniswap' },
  ]

  const handleGetQuote = async () => {
    if (!isConnected || !address || !fromAmount) {
      setError('Please connect wallet and enter amount')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Convert amount to wei (assuming 18 decimals)
      const amountInWei = (parseFloat(fromAmount) * Math.pow(10, 18)).toString()
      
      const quoteData = await oneInchAPI.getSwapQuote({
        src: fromToken,
        dst: toToken,
        amount: amountInWei,
        from: address,
        chainId,
      })

      setQuote({
        fromToken,
        toToken,
        fromAmount,
        toAmount: (parseInt(quoteData.toAmount) / Math.pow(10, 18)).toString(),
        gas: quoteData.gas,
        gasPrice: quoteData.gasPrice,
      })
    } catch (error) {
      console.error('Error getting quote:', error)
      setError('Failed to get quote. Showing demo quote.')
      
      // Demo quote for development
      setQuote({
        fromToken,
        toToken,
        fromAmount,
        toAmount: (parseFloat(fromAmount) * 2300).toString(), // Demo: 1 ETH = 2300 USDC
        gas: '150000',
        gasPrice: '20000000000',
      })
    }

    setIsLoading(false)
  }

  const handleSwap = async () => {
    if (!quote || !isConnected || !address) return
    
    setIsLoading(true)
    setError(null)

    try {
      // This would execute the actual swap
      // For demo purposes, we'll just show a success message
      alert('Swap executed successfully! (Demo mode)')
    } catch (error) {
      console.error('Error executing swap:', error)
      setError('Failed to execute swap')
    }

    setIsLoading(false)
  }

  if (!isConnected) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Token Swap</h3>
        <p className="text-gray-500">Connect your wallet to start swapping</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-6">Token Swap</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* From Token */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">From</label>
          <div className="flex gap-2">
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {commonTokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol} - {token.name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            placeholder="Amount"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Swap Direction Arrow */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              const temp = fromToken
              setFromToken(toToken)
              setToToken(temp)
              setQuote(null)
            }}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ↕️
          </button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">To</label>
          <select
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {commonTokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol} - {token.name}
              </option>
            ))}
          </select>
          {quote && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold">≈ {parseFloat(quote.toAmount).toFixed(4)} tokens</div>
              <div className="text-sm text-gray-600">Gas: {quote.gas}</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleGetQuote}
            disabled={isLoading || !fromAmount}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Getting Quote...' : 'Get Quote'}
          </button>
          
          {quote && (
            <button
              onClick={handleSwap}
              disabled={isLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {isLoading ? 'Swapping...' : 'Execute Swap'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}