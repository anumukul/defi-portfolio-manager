'use client'

import { usePortfolio } from '@/hooks/usePortfolio'

export default function DataSourceStatus() {
  const { dataSource, lastUpdated, error } = usePortfolio()

  const getStatusInfo = () => {
    switch (dataSource) {
      case 'api':
        return {
          icon: '🔗',
          text: 'Live Data',
          color: 'bg-green-100 text-green-800 border-green-300'
        }
      case 'demo':
        return {
          icon: '🎭',
          text: '1inch Pending - Demo Mode',
          color: 'bg-blue-100 text-blue-800 border-blue-300'
        }
      case 'disconnected':
        return {
          icon: '🔌',
          text: 'Wallet Disconnected',
          color: 'bg-gray-100 text-gray-800 border-gray-300'
        }
      default:
        return {
          icon: '❓',
          text: 'Unknown',
          color: 'bg-gray-100 text-gray-800 border-gray-300'
        }
    }
  }

  const status = getStatusInfo()

  return (
    <div className="space-y-2">
      <div className={`px-3 py-1 rounded-full text-xs border ${status.color} inline-flex items-center gap-1`}>
        <span>{status.icon}</span>
        <span>{status.text}</span>
      </div>
      
      {error && (
        <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
          {error}
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        Updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  )
}