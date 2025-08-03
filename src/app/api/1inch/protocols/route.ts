import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Use server-side environment variable first, fallback to public
  const API_KEY = process.env.ONEINCH_API_KEY || process.env.NEXT_PUBLIC_1INCH_API_KEY;
  const API_URL = process.env.ONEINCH_API_URL || process.env.NEXT_PUBLIC_1INCH_API_URL;
  
  if (!API_KEY) {
    console.log('⚠️ No API key found, using fallback data');
    return NextResponse.json({
      protocols: [
        {
          "id": "UNISWAP_V3",
          "title": "Uniswap V3",
          "img": "https://1inch.io/img/liquidity-sources/uniswap-v3.svg"
        },
        {
          "id": "ONE_INCH_LIMIT_ORDER",
          "title": "1inch Limit Order Protocol",
          "img": "https://1inch.io/img/liquidity-sources/1inch.svg"
        },
        {
          "id": "SUSHISWAP",
          "title": "SushiSwap",
          "img": "https://1inch.io/img/liquidity-sources/sushiswap.svg"
        },
        {
          "id": "CURVE",
          "title": "Curve",
          "img": "https://1inch.io/img/liquidity-sources/curve.svg"
        },
        {
          "id": "BALANCER_V2",
          "title": "Balancer V2",
          "img": "https://1inch.io/img/liquidity-sources/balancer.svg"
        }
      ],
      message: "Demo protocols data - working fallback"
    });
  }

  try {
    console.log('🔄 1inch protocols request with API key:', API_KEY.substring(0, 8) + '...');

    const response = await fetch(`${API_URL}/swap/v6.0/1/protocols`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 1inch protocols error:', response.status, errorText);
      
      // Return fallback data instead of error
      return NextResponse.json({
        protocols: [
          {
            "id": "UNISWAP_V3",
            "title": "Uniswap V3",
            "img": "https://1inch.io/img/liquidity-sources/uniswap-v3.svg"
          },
          {
            "id": "ONE_INCH_LIMIT_ORDER",
            "title": "1inch Limit Order Protocol", 
            "img": "https://1inch.io/img/liquidity-sources/1inch.svg"
          },
          {
            "id": "CURVE",
            "title": "Curve",
            "img": "https://1inch.io/img/liquidity-sources/curve.svg"
          }
        ],
        message: `Fallback data (API returned ${response.status})`
      });
    }

    const data = await response.json();
    console.log('✅ 1inch protocols data received:', Object.keys(data).length, 'protocols');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Protocols API Error:', error);
    
    // Return fallback data instead of 500 error
    return NextResponse.json({
      protocols: [
        {
          "id": "UNISWAP_V3",
          "title": "Uniswap V3",
          "img": "https://1inch.io/img/liquidity-sources/uniswap-v3.svg"
        },
        {
          "id": "CURVE",
          "title": "Curve",
          "img": "https://1inch.io/img/liquidity-sources/curve.svg"
        }
      ],
      message: "Fallback data due to network error"
    });
  }
}