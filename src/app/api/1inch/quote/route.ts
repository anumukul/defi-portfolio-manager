import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fromTokenAddress = searchParams.get('fromTokenAddress');
  const toTokenAddress = searchParams.get('toTokenAddress');
  const amount = searchParams.get('amount');
  
  // Validate required parameters
  if (!fromTokenAddress || !toTokenAddress || !amount) {
    return NextResponse.json({
      dstAmount: '0',
      fromToken: { 
        symbol: 'ETH', 
        address: fromTokenAddress || '0xEee...', 
        decimals: 18 
      },
      toToken: { 
        symbol: 'USDC', 
        address: toTokenAddress || '0xA0b...', 
        decimals: 6 
      },
      message: 'Demo quote - missing parameters'
    });
  }

  const API_KEY = process.env.ONEINCH_API_KEY || process.env.NEXT_PUBLIC_1INCH_API_KEY;
  const API_URL = process.env.ONEINCH_API_URL || process.env.NEXT_PUBLIC_1INCH_API_URL;
  
  if (!API_KEY) {
    console.log('⚠️ No API key, using demo quote');
    
    // Calculate demo quote (1 ETH = ~2645 USDC)
    const amountNum = parseFloat(amount) || 0;
    const demoRate = 2645; // ETH to USDC rate
    const dstAmount = (amountNum / 1e18 * demoRate * 1e6).toString();
    
    return NextResponse.json({
      dstAmount,
      fromToken: { 
        symbol: 'ETH', 
        address: fromTokenAddress, 
        decimals: 18 
      },
      toToken: { 
        symbol: 'USDC', 
        address: toTokenAddress, 
        decimals: 6 
      },
      protocols: [['UNISWAP_V3']],
      message: 'Demo quote - API key required for real data'
    });
  }

  try {
    console.log('🔄 Getting quote:', {
      from: fromTokenAddress.substring(0, 8) + '...',
      to: toTokenAddress.substring(0, 8) + '...',
      amount: amount.substring(0, 10) + '...'
    });

    const response = await fetch(
      `${API_URL}/swap/v6.0/1/quote?src=${fromTokenAddress}&dst=${toTokenAddress}&amount=${amount}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'accept': 'application/json'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Real quote received');
      return NextResponse.json(data);
    } else {
      console.log('⚠️ Quote API failed, using demo quote');
      
      // Demo quote calculation
      const amountNum = parseFloat(amount) || 0;
      const demoRate = 2645;
      const dstAmount = (amountNum / 1e18 * demoRate * 1e6).toString();
      
      return NextResponse.json({
        dstAmount,
        fromToken: { 
          symbol: 'ETH', 
          address: fromTokenAddress, 
          decimals: 18 
        },
        toToken: { 
          symbol: 'USDC', 
          address: toTokenAddress, 
          decimals: 6 
        },
        protocols: [['UNISWAP_V3']],
        message: `Demo quote (API returned ${response.status})`
      });
    }
    
  } catch (error) {
    console.error('Quote API Error:', error);
    
    // Demo quote fallback
    const amountNum = parseFloat(amount) || 0;
    const demoRate = 2645;
    const dstAmount = (amountNum / 1e18 * demoRate * 1e6).toString();
    
    return NextResponse.json({
      dstAmount,
      fromToken: { 
        symbol: 'ETH', 
        address: fromTokenAddress, 
        decimals: 18 
      },
      toToken: { 
        symbol: 'USDC', 
        address: toTokenAddress, 
        decimals: 6 
      },
      protocols: [['UNISWAP_V3']],
      message: 'Demo quote - network error'
    });
  }
}