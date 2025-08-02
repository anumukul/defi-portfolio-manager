'use client'

import { usePortfolio } from '@/hooks/usePortfolio'

export default function PortfolioOverview() {
  const { totalValue, tokens, isLoading, error } = usePortfolio()

  const formatBalance = (balance: string, decimals: number) => {
    const balanceNum = parseInt(balance) / Math.pow(10, decimals)
    return balanceNum.toFixed(4)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Portfolio Overview</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Portfolio Overview</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {tokens.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
            <div>Token</div>
            <div>Balance</div>
            <div>Price</div>
            <div>Value</div>
          </div>
          
          {tokens.map((token, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 text-sm">
              <div className="flex items-center">
                <div>
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-gray-500 text-xs">{token.name}</div>
                </div>
              </div>
              <div>{formatBalance(token.balance, token.decimals)}</div>
              <div>{formatCurrency(token.price || 0)}</div>
              <div className="font-medium">{formatCurrency(token.value || 0)}</div>
            </div>
          ))}
          
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Portfolio Value:</span>
              <span className="text-green-600">{formatCurrency(totalValue)}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No tokens found in your portfolio</p>
      )}
    </div>
  )
}