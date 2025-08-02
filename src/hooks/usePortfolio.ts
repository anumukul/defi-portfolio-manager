import { useAccount, useChainId } from 'wagmi'
import { useState, useEffect } from 'react'
import { defiAggregator } from '@/lib/defi-aggregator'

interface TokenBalance {
  symbol: string
  name: string
  decimals: number
  balance: string
  price: number
  value: number
  address: string
}

interface PortfolioData {
  totalValue: number
  tokens: TokenBalance[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date
  dataSource: string
}

export function usePortfolio(): PortfolioData {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    totalValue: 0,
    tokens: [],
    isLoading: false,
    error: null,
    lastUpdated: new Date(),
    dataSource: 'demo'
  })

  useEffect(() => {
    if (!isConnected || !address) {
      setPortfolioData({
        totalValue: 0,
        tokens: [],
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
        dataSource: 'disconnected'
      })
      return
    }

    const fetchPortfolioData = async () => {
      setPortfolioData(prev => ({ ...prev, isLoading: true, error: null }))
      
      try {
        const tokens = await defiAggregator.getPortfolioBalance(address, chainId)
        const totalValue = tokens.reduce((sum, token) => sum + token.value, 0)

        setPortfolioData({
          totalValue,
          tokens,
          isLoading: false,
          error: null,
          lastUpdated: new Date(),
          dataSource: tokens.length > 0 ? 'api' : 'demo'
        })
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
        
        // Fallback to demo data
        const demoTokens = await defiAggregator.getPortfolioBalance(address, chainId)
        const totalValue = demoTokens.reduce((sum, token) => sum + token.value, 0)
        
        setPortfolioData({
          totalValue,
          tokens: demoTokens,
          isLoading: false,
          error: 'Using demo data while 1inch verification is pending',
          lastUpdated: new Date(),
          dataSource: 'demo'
        })
      }
    }

    fetchPortfolioData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPortfolioData, 30000)
    return () => clearInterval(interval)
  }, [address, isConnected, chainId])

  return portfolioData
}