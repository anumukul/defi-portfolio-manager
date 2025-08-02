'use client'

export default function PriceChart() {
  // Demo chart data
  const chartData = [
    { time: '00:00', value: 5000 },
    { time: '04:00', value: 5150 },
    { time: '08:00', value: 5050 },
    { time: '12:00', value: 5300 },
    { time: '16:00', value: 5250 },
    { time: '20:00', value: 5300 },
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Portfolio Performance (24h)</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">24h Change</span>
          <span className="text-green-600 font-medium">+$300 (+6.0%)</span>
        </div>
        
        {/* Simple ASCII chart */}
        <div className="h-32 flex items-end justify-between bg-gray-50 p-4 rounded">
          {chartData.map((point, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div 
                className="bg-blue-500 w-8 rounded-t"
                style={{ 
                  height: `${(point.value / 5300) * 80}px`,
                  minHeight: '20px'
                }}
              />
              <span className="text-xs text-gray-500">{point.time}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-600">High</div>
            <div className="font-semibold">$5,350</div>
          </div>
          <div>
            <div className="text-gray-600">Low</div>
            <div className="font-semibold">$5,000</div>
          </div>
          <div>
            <div className="text-gray-600">Volume</div>
            <div className="font-semibold">$12.5K</div>
          </div>
        </div>
      </div>
    </div>
  )
}