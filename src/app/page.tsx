'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { usePortfolio } from '@/hooks/usePortfolio'
import PortfolioOverview from '@/components/portfolio/PortfolioOverview'
import SwapInterface from '@/components/swap/SwapInterface'
import ChainSwitcher from '@/components/ui/ChainSwitcher'
import PriceChart from '@/components/portfolio/PriceChart'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { totalValue } = usePortfolio()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h2>
        
        <div className="flex items-center gap-4">
          {isConnected && <ChainSwitcher />}
          
          {isConnected ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={() => disconnect()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => connect({ connector: injected() })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Total Portfolio Value</h3>
          <p className="text-3xl font-bold text-green-600">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">24h Change</h3>
          <p className="text-3xl font-bold text-green-600">+6.0%</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Active Protocols</h3>
          <p className="text-3xl font-bold text-blue-600">3</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <PortfolioOverview />
          <PriceChart />
        </div>
        <div>
          <SwapInterface />
        </div>
      </div>
    </div>
  )
}