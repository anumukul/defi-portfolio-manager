'use client'

import { useState } from 'react'
import { test1InchAPI } from '@/lib/test-api'

interface TestResult {
  success: boolean;
  tokenCount?: number;
  method?: string;
  error?: string;
}

export default function TestAPI() {
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)

  const runTest = async () => {
    setTesting(true)
    const result = await test1InchAPI()
    setTestResult(result)
    setTesting(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">🧪 1inch API Test</h3>
      
      <button
        onClick={runTest}
        disabled={testing}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Test 1inch APIs'}
      </button>

      {testResult && (
        <div className={`mt-4 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {testResult.success ? (
            <div>
              <div className="text-green-800 font-medium">✅ API Test Successful!</div>
              <div className="text-sm text-green-600 mt-1">
                Found {testResult.tokenCount} tokens using {testResult.method}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-red-800 font-medium">❌ API Test Failed</div>
              <div className="text-sm text-red-600 mt-1">{testResult.error}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}