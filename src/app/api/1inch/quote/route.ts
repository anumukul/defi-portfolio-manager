import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const API_KEY = process.env.NEXT_PUBLIC_1INCH_API_KEY;
  const { searchParams } = new URL(request.url);
  
  const src = searchParams.get('src');
  const dst = searchParams.get('dst');
  const amount = searchParams.get('amount');
  const from = searchParams.get('from');
  
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
      slippage: '1',
      disableEstimate: 'false',
      allowPartialFill: 'false'
    });

    const response = await fetch(`https://api.1inch.dev/swap/v6.0/1/quote?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `1inch quote API error: ${response.status}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Quote API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}