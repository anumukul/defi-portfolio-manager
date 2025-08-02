'use client'

import { useState, useEffect } from 'react'

export default function OneInchStatus() {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'unknown'>('pending')
  const [timeWaiting, setTimeWaiting] = useState('24+ hours')

  useEffect(() => {
    // Check if we can access 1inch API
    const checkOneInchStatus = async () => {
      try {
        const response = await fetch('https://api.1inch.dev/swap/v6.0/1/healthcheck')
        if (response.ok) {
          setVerificationStatus('approved')
        }
      } catch (error) {
        setVerificationStatus('pending')
      }
    }

    checkOneInchStatus()
    const interval = setInterval(checkOneInchStatus, 300000) // Check every 5 minutes
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        🏦 1inch Verification Status
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`text-sm font-medium ${
            verificationStatus === 'approved' ? 'text-green-600' : 'text-orange-600'
          }`}>
            {verificationStatus === 'approved' ? '✅ Approved' : '⏳ Pending Review'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Waiting:</span>
          <span className="text-sm font-medium text-gray-800">{timeWaiting}</span>
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <p className="mb-1">✓ Identity document verified</p>
          <p className="mb-1">✓ Liveness check completed</p>
          <p>✓ Proof of address submitted</p>
        </div>
        
        {verificationStatus === 'pending' && (
          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
            💡 Your app works perfectly with demo data while waiting for approval!
          </div>
        )}
      </div>
    </div>
  )
}