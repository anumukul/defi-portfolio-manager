const API_BASE_URL = process.env.NEXT_PUBLIC_1INCH_API_URL || 'https://api.1inch.dev'
const API_KEY = process.env.NEXT_PUBLIC_1INCH_API_KEY

export class OneInchAPI {
  private baseURL: string
  private apiKey: string

  constructor() {
    this.baseURL = API_BASE_URL
    this.apiKey = API_KEY || ''
  }

  private async request(endpoint: string, chainId: number = 1) {
    const url = `${this.baseURL}/swap/v6.0/${chainId}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(url, { headers })
    
    if (!response.ok) {
      throw new Error(`1inch API error: ${response.statusText}`)
    }
    
    return response.json()
  }

  async getTokens(chainId: number = 1) {
    return this.request('/tokens', chainId)
  }

  async getBalance(walletAddress: string, chainId: number = 1) {
    return this.request(`/balance/${walletAddress}`, chainId)
  }

  async getSwapQuote(params: {
    src: string
    dst: string
    amount: string
    from: string
    chainId: number
  }) {
    const queryParams = new URLSearchParams({
      src: params.src,
      dst: params.dst,
      amount: params.amount,
      from: params.from,
    })
    
    return this.request(`/quote?${queryParams}`, params.chainId)
  }
}

export const oneInchAPI = new OneInchAPI()