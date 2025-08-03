import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const API_KEY = process.env.ONEINCH_API_KEY || process.env.NEXT_PUBLIC_1INCH_API_KEY;
  const API_URL = process.env.ONEINCH_API_URL || process.env.NEXT_PUBLIC_1INCH_API_URL;
  
  if (!API_KEY) {
    console.log('⚠️ No API key found, using fallback tokens');
    return NextResponse.json({
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
        "symbol": "ETH",
        "name": "Ethereum",
        "decimals": 18,
        "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "logoURI": "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png"
      },
      "0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7": {
        "symbol": "USDC",
        "name": "USD Coin",
        "decimals": 6,
        "address": "0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7",
        "logoURI": "https://tokens.1inch.io/0xa0b86a33e6441b06eda61b4dd3749ad7a7c5d9c7.png"
      },
      "0xdAC17F958D2ee523a2206206994597C13D831ec7": {
        "symbol": "USDT",
        "name": "Tether USD",
        "decimals": 6,
        "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "logoURI": "https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
      }
    });
  }

  try {
    console.log('🔄 1inch tokens request');

    const response = await fetch(`${API_URL}/token/v1.2/1`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('❌ 1inch tokens error:', response.status);
      
      // Return fallback tokens
      return NextResponse.json({
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
          "symbol": "ETH",
          "name": "Ethereum",
          "decimals": 18,
          "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        },
        "0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7": {
          "symbol": "USDC", 
          "name": "USD Coin",
          "decimals": 6,
          "address": "0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7"
        }
      });
    }

    const data = await response.json();
    console.log('✅ 1inch tokens data received');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Tokens API Error:', error);
    
    // Return fallback tokens
    return NextResponse.json({
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
        "symbol": "ETH",
        "name": "Ethereum", 
        "decimals": 18,
        "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      }
    });
  }
}