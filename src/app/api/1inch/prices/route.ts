import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const API_KEY = process.env.ONEINCH_API_KEY || process.env.NEXT_PUBLIC_1INCH_API_KEY;
  const API_URL = process.env.ONEINCH_API_URL || process.env.NEXT_PUBLIC_1INCH_API_URL;
  
  const { searchParams } = new URL(request.url);
  const tokens = searchParams.get('tokens');
  
  if (!tokens) {
    return NextResponse.json({ error: 'No tokens specified' }, { status: 400 });
  }

  if (!API_KEY) {
    console.log('⚠️ No API key found, using fallback prices');
    return NextResponse.json({
      '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7': 1.00, // USDC
      '0xdAC17F958D2ee523a2206206994597C13D831ec7': 1.00, // USDT  
      '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 43250.00, // WBTC
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': 2645.00 // WETH
    });
  }

  try {
    console.log('🔄 1inch prices request for tokens:', tokens);

    const response = await fetch(`${API_URL}/price/v1.1/1/${tokens}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('❌ 1inch prices error:', response.status);
      
      // Return fallback prices
      return NextResponse.json({
        '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7': 1.00,
        '0xdAC17F958D2ee523a2206206994597C13D831ec7': 1.00,
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 43250.00,
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': 2645.00
      });
    }

    const data = await response.json();
    console.log('✅ 1inch prices data received');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Prices API Error:', error);
    
    // Return fallback prices
    return NextResponse.json({
      '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7': 1.00,
      '0xdAC17F958D2ee523a2206206994597C13D831ec7': 1.00,
      '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 43250.00,
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': 2645.00
    });
  }
}