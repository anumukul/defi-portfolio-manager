'use client'

import { useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { parseEther } from 'viem'

interface SwapQuote {
  dstAmount: string
  estimatedGas: string
  protocols: any[]
}

interface SwapTransaction {
  to: string
  data: string
  value: string
  gas: string
  gasPrice: string
}

export default function RealSwapInterface() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [fromToken, setFromToken] = useState('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') // WETH
  const [toToken, setToToken] = useState('0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7') // USDC
  const [amount, setAmount] = useState('')
  const [quote, setQuote] = useState<SwapQuote | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [error, setError] = useState('')
  const [txHash, setTxHash] = useState('')

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

  const handleExecuteSwap = async () => {
    if (!quote || !isConnected || !address || !walletClient) return

    setIsSwapping(true)
    setError('')
    setTxHash('')
    
    try {
      const amountWei = (parseFloat(amount) * 1e18).toString()
      
      // Get swap transaction data from 1inch
      const response = await fetch(`/api/1inch/swap?` + new URLSearchParams({
        src: fromToken,
        dst: toToken,
        amount: amountWei,
        from: address,
        slippage: '1'
      }))

      if (!response.ok) {
        const errorData = await response.json()
        setError(`Swap preparation failed: ${errorData.error}`)
        return
      }

      const swapData: { tx: SwapTransaction } = await response.json()
      console.log('🔄 Executing swap transaction:', swapData)

      // Execute the transaction
      const hash = await walletClient.sendTransaction({
        to: swapData.tx.to as `0x${string}`,
        data: swapData.tx.data as `0x${string}`,
        value: BigInt(swapData.tx.value),
        gas: BigInt(swapData.tx.gas),
        gasPrice: BigInt(swapData.tx.gasPrice)
      })

      setTxHash(hash)
      console.log('✅ Swap transaction sent:', hash)
      
      // Reset form after successful swap
      setTimeout(() => {
        setQuote(null)
        setAmount('')
        setTxHash('')
      }, 10000)

    } catch (error: any) {
      console.error('❌ Swap execution error:', error)
      setError(`Transaction failed: ${error.message || 'Unknown error'}`)
    }
    setIsSwapping(false)
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
        <h3 className="text-xl font-bold">🔄 1inch Live Swap</h3>
        <div className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
          REAL EXECUTION
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

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGetQuote}
            disabled={!amount || !isConnected || isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            {isLoading ? '⏳ Getting Quote...' : '💎 Get 1inch Quote'}
          </button>

          {quote && (
            <button
              onClick={handleExecuteSwap}
              disabled={isSwapping || !walletClient}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              {isSwapping ? '🔄 Executing Swap...' : '🚀 Execute Real Swap'}
            </button>
          )}
        </div>

        {/* Quote Results */}
        {quote && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="font-semibold text-green-800 mb-2">✅ Ready to Execute!</div>
            <div className="space-y-1 text-sm text-green-700">
              <div>You'll receive: {(parseFloat(quote.dstAmount) / 1e6).toFixed(6)} {tokenOptions.find(t => t.address === toToken)?.symbol}</div>
              <div>Estimated gas: {parseInt(quote.estimatedGas || '0').toLocaleString()}</div>
              <div>Protocols: {quote.protocols?.length || 0} routes found</div>
            </div>
          </div>
        )}

        {/* Transaction Hash */}
        {txHash && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="font-semibold text-blue-800 mb-2">🎉 Swap Executed!</div>
            <div className="text-sm text-blue-700">
              <div>Transaction: <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">{txHash.slice(0, 10)}...{txHash.slice(-8)}</a></div>
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
            🔗 Connect wallet to execute real swaps
          </div>
        )}
      </div>
    </div>
  )
}