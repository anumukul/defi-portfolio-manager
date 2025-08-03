import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const API_KEY = process.env.NEXT_PUBLIC_1INCH_API_KEY;
  
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    console.log('🔄 1inch protocols request');

    const response = await fetch(`https://api.1inch.dev/swap/v6.0/1/protocols`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 1inch protocols error:', response.status, errorText);
      return NextResponse.json(
        { error: `1inch protocols API error: ${response.status}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ 1inch protocols data received');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Protocols API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}