import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const API_KEY = process.env.NEXT_PUBLIC_1INCH_API_KEY;
  const { searchParams } = new URL(request.url);
  
  const tokenAddress = searchParams.get('token') || '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    console.log('🔄 1inch liquidity request for token:', tokenAddress);

    const response = await fetch(`https://api.1inch.dev/swap/v6.0/1/liquidity-sources?token=${tokenAddress}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 1inch liquidity error:', response.status, errorText);
      return NextResponse.json(
        { error: `1inch liquidity API error: ${response.status}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ 1inch liquidity data received');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Liquidity API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}