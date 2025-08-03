import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const API_KEY = process.env.ONEINCH_API_KEY || process.env.NEXT_PUBLIC_1INCH_API_KEY;
  const API_URL = process.env.ONEINCH_API_URL || process.env.NEXT_PUBLIC_1INCH_API_URL;
  
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '20';
  
  if (!API_KEY) {
    return NextResponse.json({
      orders: [],
      meta: { total: 0, limit: parseInt(limit) },
      message: "Demo limit orders - API key required for real data"
    });
  }

  try {
    console.log('🔄 1inch limit orders request');

    const response = await fetch(`${API_URL}/orderbook/v4.0/1/limit-order/orders?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('❌ 1inch limit orders error:', response.status);
      return NextResponse.json({
        orders: [],
        meta: { total: 0, limit: parseInt(limit) },
        message: `Fallback data (API returned ${response.status})`
      });
    }

    const data = await response.json();
    console.log('✅ 1inch limit orders data received');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Limit Orders API Error:', error);
    return NextResponse.json({
      orders: [],
      meta: { total: 0, limit: parseInt(limit) },
      message: "Fallback data due to network error"
    });
  }
}