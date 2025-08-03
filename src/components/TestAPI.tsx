'use client'

import { useState } from 'react'
import { test1InchAPI } from '@/lib/test-api'

export default function TestAPI() {
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)

  const runTest = async () => {
    setTesting(true)
    const result = await test1InchAPI()
    setTestResult(result)
    setTesting(false)
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
      <h3 className="font-bold text-yellow-800 mb-2">🧪 1inch API Test</h3>
      <button 
        onClick={runTest}
        disabled={testing}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Test 1inch API'}
      </button>
      
      {testResult && (
        <div className="mt-3">
          {testResult.success ? (
            <div className="text-green-600">
              ✅ API Working! Found {testResult.tokenCount} tokens
            </div>
          ) : (
            <div className="text-red-600">
              ❌ API Error: {testResult.error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}