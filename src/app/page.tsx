import RealSwapInterface from '@/components/swap/RealSwapInterface'
import EnhancedPortfolioOverview from '@/components/portfolio/EnhancedPortfolioOverview'
import DashboardAnalytics from '@/components/analytics/DashboardAnalytics'
import LivePriceTracker from '@/components/portfolio/LivePriceTracker'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🚀 DeFi Portfolio Optimizer</h1>
              <p className="text-gray-600">Powered by 1inch Protocol</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                🟢 Live
              </div>
              <div className="text-sm text-gray-500">
                Real-time DeFi analytics
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <EnhancedPortfolioOverview />
            <DashboardAnalytics />
          </div>
          
          <div className="space-y-8">
            <RealSwapInterface />
            <LivePriceTracker />
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-2xl font-bold text-blue-600">8+</div>
            <div className="text-gray-600">1inch APIs</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-2xl font-bold text-green-600">Real-time</div>
            <div className="text-gray-600">Price Data</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-2xl font-bold text-purple-600">Multi-chain</div>
            <div className="text-gray-600">Support</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-2xl font-bold text-red-600">Pro-level</div>
            <div className="text-gray-600">Analytics</div>
          </div>
        </div>
      </main>
    </div>
  )
}