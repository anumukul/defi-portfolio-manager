'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { usePortfolio } from '@/hooks/usePortfolio'
import PortfolioOverview from '@/components/portfolio/PortfolioOverview'
import RealSwapInterface from '@/components/swap/RealSwapInterface' // ✅ Changed this line
import ChainSwitcher from '@/components/ui/ChainSwitcher'
import PriceChart from '@/components/portfolio/PriceChart'
import DataSourceStatus from '@/components/ui/DataSourceStatus'
import OneInchStatus from '@/components/ui/OneInchStatus'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { totalValue } = usePortfolio()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-600">
              {isConnected ? `Managing ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect your wallet to get started'}
            </p>
            <DataSourceStatus />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isConnected && <ChainSwitcher />}
          
          {isConnected ? (
            <button
              onClick={() => disconnect()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => connect({ connector: injected() })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
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
          <p className="text-sm text-gray-600 mt-1">Auto-updating every 30s</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">24h Change</h3>
          <p className="text-3xl font-bold text-green-600">+6.2%</p>
          <p className="text-sm text-gray-600 mt-1">+${(totalValue * 0.062).toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Builder</h3>
          <p className="text-3xl font-bold text-blue-600">anumukul456</p>
          <p className="text-sm text-gray-600 mt-1">August 2, 2025</p>
        </div>
      </div>
      
      {isConnected ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
            <PortfolioOverview />
            <PriceChart />
          </div>
          <div className="space-y-6">
            <OneInchStatus />
            <RealSwapInterface /> {/* ✅ Changed this line */}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🚀</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            DeFi Portfolio Manager with Real 1inch Integration
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Track your DeFi portfolio and swap tokens using real 1inch API integration.
          </p>
          <button
            onClick={() => connect({ connector: injected() })}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg"
          >
            Connect Wallet & Start Trading
          </button>
          <div className="mt-6 text-sm text-gray-500">
            Built by anumukul456 • Real 1inch API integration
          </div>
        </div>
      )}
    </div>
  )
}