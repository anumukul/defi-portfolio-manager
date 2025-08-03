import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const API_KEY = process.env.NEXT_PUBLIC_1INCH_API_KEY;
  const { searchParams } = new URL(request.url);
  
  const src = searchParams.get('src');
  const dst = searchParams.get('dst');
  const amount = searchParams.get('amount');
  const from = searchParams.get('from');
  const slippage = searchParams.get('slippage') || '1';
  
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  if (!src || !dst || !amount || !from) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const queryParams = new URLSearchParams({
      src,
      dst,
      amount,
      from,
      slippage,
      disableEstimate: 'false',
      allowPartialFill: 'false'
    });

    console.log('🔄 1inch swap request:', Object.fromEntries(queryParams));

    const response = await fetch(`https://api.1inch.dev/swap/v6.0/1/swap?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 1inch swap error:', response.status, errorText);
      return NextResponse.json(
        { error: `1inch swap API error: ${response.status}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ 1inch swap transaction data received');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Swap API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}