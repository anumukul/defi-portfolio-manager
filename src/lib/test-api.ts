interface TestResult {
  success: boolean;
  tokenCount?: number;
  method?: string;
  error?: string;
}

export async function test1InchAPI(): Promise<TestResult> {
  try {
    // Test 1: Get supported tokens
    const tokensResponse = await fetch('/api/1inch/tokens');
    
    if (tokensResponse.ok) {
      const tokensData = await tokensResponse.json();
      const tokenCount = Object.keys(tokensData).length;
      
      return {
        success: true,
        tokenCount,
        method: 'Tokens API'
      };
    }

    // Test 2: Get token prices
    const pricesResponse = await fetch('/api/1inch/prices?tokens=0xA0b86a33E6441b06EdA61B4Dd3749aD7A7C5D9c7');
    
    if (pricesResponse.ok) {
      const pricesData = await pricesResponse.json();
      
      return {
        success: true,
        tokenCount: Object.keys(pricesData).length,
        method: 'Prices API'
      };
    }

    return {
      success: false,
      error: 'All API endpoints failed'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: `Network error: ${errorMessage}`
    };
  }
}