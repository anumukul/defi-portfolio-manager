import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { address } = await params;
    
    // Validate address format
    if (!address || !address.startsWith('0x') || address.length !== 42) {
      console.log('⚠️ Invalid address format, using demo balance');
      return NextResponse.json({
        [address]: {
          'ETH': '1500000000000000000', // 1.5 ETH
          '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7': '2500000000', // 2500 USDC
          '0xdAC17F958D2ee523a2206206994597C13D831ec7': '1000000000' // 1000 USDT
        },
        message: 'Demo balance data'
      });
    }

    const API_KEY = process.env.ONEINCH_API_KEY || process.env.NEXT_PUBLIC_1INCH_API_KEY;
    const API_URL = process.env.ONEINCH_API_URL || process.env.NEXT_PUBLIC_1INCH_API_URL;
    
    if (!API_KEY) {
      console.log('⚠️ No API key, using demo balance for:', address.substring(0, 8) + '...');
      return NextResponse.json({
        [address]: {
          'ETH': '1500000000000000000',
          '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7': '2500000000',
          '0xdAC17F958D2ee523a2206206994597C13D831ec7': '1000000000'
        },
        message: 'Demo balance - API key required for real data'
      });
    }

    // Try real 1inch balance API
    console.log('🔄 Fetching balance for:', address.substring(0, 8) + '...');
    
    const response = await fetch(`${API_URL}/balance/v1.2/1/balances/${address}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Real balance data received');
      return NextResponse.json(data);
    } else {
      console.log('⚠️ Balance API failed, using demo data');
      return NextResponse.json({
        [address]: {
          'ETH': '1500000000000000000',
          '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7': '2500000000',
          '0xdAC17F958D2ee523a2206206994597C13D831ec7': '1000000000'
        },
        message: `Demo balance (API returned ${response.status})`
      });
    }
    
  } catch (error) {
    console.log('⚠️ Balance API error, using demo data');
    return NextResponse.json({
      '0x742d35Cc6A354CA25E4e9D60D9a4c79b94e4e9B': {
        'ETH': '1500000000000000000',
        '0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7': '2500000000',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7': '1000000000'
      },
      message: 'Demo balance - network error'
    });
  }
}