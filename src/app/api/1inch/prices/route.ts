import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const API_KEY = process.env.NEXT_PUBLIC_1INCH_API_KEY;
  const { searchParams } = new URL(request.url);
  
  const tokens = searchParams.get('tokens'); // comma-separated token addresses
  const currency = searchParams.get('currency') || 'USD';
  
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    let url = `https://api.1inch.dev/price/v1.1/1`;
    
    if (tokens) {
      url += `/${tokens}`;
    }

    if (currency !== 'USD') {
      url += `?currency=${currency}`;
    }

    console.log('🔄 1inch price request:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 1inch price error:', response.status, errorText);
      return NextResponse.json(
        { error: `1inch price API error: ${response.status}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ 1inch price data received');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Price API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}