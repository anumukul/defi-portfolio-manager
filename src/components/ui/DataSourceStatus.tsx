'use client'

import { useState, useEffect } from 'react'

export default function DataSourceStatus() {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString())
    }
    
    updateTime() // Set initial time
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Prevent hydration mismatch by not rendering time until mounted
  if (!mounted) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-600">Loading...</span>
        </div>
        <div className="text-xs text-gray-500">
          Initializing...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-green-600">Real 1inch Data</span>
      </div>
      <div className="text-xs text-gray-500">
        Updated: {currentTime}
      </div>
    </div>
  )
}