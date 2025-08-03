
export async function test1InchAPI() {
  console.log('🧪 Testing 1inch API via server route...');
  
  try {
   
    const response = await fetch('/api/1inch/tokens', {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 1inch API is working via server route!');
      console.log('📊 Available tokens:', Object.keys(data.tokens || {}).length);
      return { 
        success: true, 
        tokenCount: Object.keys(data.tokens || {}).length,
        method: 'server-route'
      };
    } else {
      const errorData = await response.json();
      console.error('❌ Server API Error:', response.status, errorData);
      return { 
        success: false, 
        error: `Server error: ${response.status} - ${errorData.error}` 
      };
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return { 
      success: false, 
      error: `Network error: ${error.message}` 
    };
  }
}