/**
 * Simple Integration Test for Development Server
 * Tests that the development server is running and responds correctly
 */

const TEST_URL = 'http://localhost:3004';

async function testServerResponse() {
  console.log('🔍 Testing development server response...');
  
  try {
    const response = await fetch(TEST_URL);
    
    if (response.ok) {
      console.log('✅ Development server is responding correctly');
      console.log(`   Status: ${response.status}`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);
      return true;
    } else {
      console.log(`❌ Server responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Failed to connect to development server: ${error.message}`);
    console.log('   Make sure the server is running with: npm run dev');
    return false;
  }
}

async function testAPIEndpoints() {
  console.log('\n🔍 Testing API endpoints...');
  
  const endpoints = [
    '/api/campaigns',
    '/api/customers'
  ];
  
  let allPassed = true;
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${TEST_URL}${endpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log(`✅ ${endpoint} - Working correctly`);
        } else {
          console.log(`⚠️  ${endpoint} - Response success: false`);
          allPassed = false;
        }
      } else {
        console.log(`❌ ${endpoint} - Status: ${response.status}`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function runQuickIntegrationTest() {
  console.log('🚀 Running Quick Integration Test');
  console.log('='.repeat(40));
  
  const serverOk = await testServerResponse();
  let apiOk = false;
  
  if (serverOk) {
    apiOk = await testAPIEndpoints();
  }
  
  console.log('\n' + '='.repeat(40));
  console.log('📊 INTEGRATION TEST RESULTS');
  console.log('='.repeat(40));
  console.log(`🌐 Server: ${serverOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔗 API: ${apiOk ? '✅ PASS' : '❌ FAIL'}`);
  
  if (serverOk && apiOk) {
    console.log('\n🎉 All integration tests passed!');
    console.log('   Your application is ready for development.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the details above.');
    if (!serverOk) {
      console.log('   Start the server with: npm run dev');
    }
  }
  
  return serverOk && apiOk;
}

// Export for programmatic use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runQuickIntegrationTest, testServerResponse, testAPIEndpoints };
}

// Auto-run if executed directly
if (typeof window === 'undefined' && require.main === module) {
  runQuickIntegrationTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}
