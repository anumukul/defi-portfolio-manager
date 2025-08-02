import { useAccount, useChainId } from 'wagmi'
import { useState, useEffect } from 'react'
import { oneInchAPI } from '@/lib/1inch-api'

interface TokenBalance {
  symbol: string
  name: string
  decimals: number
  balance: string
  price?: number
  value?: number
}

interface PortfolioData {
  totalValue: number
  tokens: TokenBalance[]
  isLoading: boolean
  error: string | null
}

export function usePortfolio(): PortfolioData {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    totalValue: 0,
    tokens: [],
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    if (!isConnected || !address) {
      setPortfolioData({
        totalValue: 0,
        tokens: [],
        isLoading: false,
        error: null,
      })
      return
    }

    const fetchPortfolioData = async () => {
      setPortfolioData(prev => ({ ...prev, isLoading: true, error: null }))
      
      try {
        // Fetch token balances from 1inch API
        const balanceData = await oneInchAPI.getBalance(address, chainId)
        
        // Transform the data
        const tokens: TokenBalance[] = Object.entries(balanceData).map(([tokenAddress, tokenData]: [string, any]) => ({
          symbol: tokenData.symbol || 'Unknown',
          name: tokenData.name || 'Unknown Token',
          decimals: tokenData.decimals || 18,
          balance: tokenData.balance || '0',
          price: 0, // We'll add price fetching later
          value: 0,
        }))

        // Calculate total value (placeholder for now)
        const totalValue = tokens.reduce((sum, token) => sum + (token.value || 0), 0)

        setPortfolioData({
          totalValue,
          tokens,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
        setPortfolioData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to fetch portfolio data. Using demo data.',
          // Add some demo data for development
          tokens: [
            {
              symbol: 'ETH',
              name: 'Ethereum',
              decimals: 18,
              balance: '1500000000000000000', // 1.5 ETH
              price: 2300,
              value: 3450,
            },
            {
              symbol: 'USDC',
              name: 'USD Coin',
              decimals: 6,
              balance: '1000000000', // 1000 USDC
              price: 1,
              value: 1000,
            },
            {
              symbol: 'UNI',
              name: 'Uniswap',
              decimals: 18,
              balance: '100000000000000000000', // 100 UNI
              price: 8.5,
              value: 850,
            },
          ],
          totalValue: 5300,
        }))
      }
    }

    fetchPortfolioData()
  }, [address, isConnected, chainId])

  return portfolioData
}