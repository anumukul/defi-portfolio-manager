'use client'

import { useState, useEffect } from 'react'

export default function OneInchStatus() {
  const [status, setStatus] = useState({
    isOnline: false,
    isLoading: true,
    message: 'Checking 1inch API...',
    lastCheck: new Date()
  })

  useEffect(() => {
    const checkStatus = async () => {
      setStatus(prev => ({ ...prev, isLoading: true, message: 'Checking 1inch API...' }))
      
      try {
        // Use our server route instead of direct API call
        const response = await fetch('/api/1inch/tokens')
        
        if (response.ok) {
          const data = await response.json()
          setStatus({
            isOnline: true,
            isLoading: false,
            message: `✅ 1inch API Online (${Object.keys(data.tokens || {}).length} tokens)`,
            lastCheck: new Date()
          })
        } else {
          setStatus({
            isOnline: false,
            isLoading: false,
            message: '❌ 1inch API Error',
            lastCheck: new Date()
          })
        }
      } catch (error) {
        setStatus({
          isOnline: false,
          isLoading: false,
          message: '❌ Connection Failed',
          lastCheck: new Date()
        })
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000) // Check every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">1inch API Status</h3>
        <div className={`w-2 h-2 rounded-full ${status.isOnline ? 'bg-green-400' : 'bg-red-400'} ${status.isLoading ? 'animate-pulse' : ''}`}></div>
      </div>
      
      <div className="text-xs text-gray-600 mb-1">
        {status.message}
      </div>
      
      <div className="text-xs text-gray-400">
        Last checked: {status.lastCheck.toLocaleTimeString()}
      </div>
      
      {status.isOnline && (
        <div className="mt-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
          🚀 Ready for real swaps & data
        </div>
      )}
    </div>
  )
}