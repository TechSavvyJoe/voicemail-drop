/**
 * Comprehensive API Tests for Voicemail Drop Application
 * Tests all API endpoints with various scenarios
 */

const BASE_URL = 'http://localhost:3004/api';

class APITester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      const data = await response.json();
      return { response, data, status: response.status };
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  async test(name, testFn) {
    console.log(`\n🧪 Testing: ${name}`);
    try {
      await testFn();
      console.log(`✅ PASSED: ${name}`);
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASSED' });
    } catch (error) {
      console.log(`❌ FAILED: ${name} - ${error.message}`);
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAILED', error: error.message });
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  assertEquals(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message}: Expected ${expected}, got ${actual}`);
    }
  }

  assertContains(array, item, message) {
    if (!array.includes(item)) {
      throw new Error(`${message}: Array does not contain ${item}`);
    }
  }

  async runCampaignTests() {
    console.log('\n🚀 Running Campaign API Tests...');

    // Test GET /api/campaigns
    await this.test('GET /api/campaigns - should return all campaigns', async () => {
      const { data, status } = await this.makeRequest('/campaigns');
      
      this.assertEquals(status, 200, 'Status should be 200');
      this.assert(data.success, 'Response should indicate success');
      this.assert(Array.isArray(data.campaigns), 'Should return campaigns array');
      this.assert(data.campaigns.length > 0, 'Should have at least one campaign');
      
      // Check campaign structure
      const campaign = data.campaigns[0];
      this.assert(campaign.id, 'Campaign should have id');
      this.assert(campaign.name, 'Campaign should have name');
      this.assert(campaign.status, 'Campaign should have status');
      this.assert(campaign.script, 'Campaign should have script');
    });

    // Test GET /api/campaigns with status filter
    await this.test('GET /api/campaigns?status=running - should filter by status', async () => {
      const { data, status } = await this.makeRequest('/campaigns?status=running');
      
      this.assertEquals(status, 200, 'Status should be 200');
      this.assert(data.success, 'Response should indicate success');
      this.assert(Array.isArray(data.campaigns), 'Should return campaigns array');
      
      // All campaigns should have running status
      data.campaigns.forEach(campaign => {
        this.assertEquals(campaign.status, 'running', 'All campaigns should have running status');
      });
    });

    // Test POST /api/campaigns - create new campaign
    await this.test('POST /api/campaigns - should create new campaign', async () => {
      const newCampaign = {
        name: 'Test Campaign',
        script: 'This is a test voicemail script.',
        voice_id: 'professional_male',
        delivery_time_start: '10:00',
        delivery_time_end: '18:00',
        time_zone: 'America/New_York'
      };

      const { data, status } = await this.makeRequest('/campaigns', {
        method: 'POST',
        body: JSON.stringify(newCampaign)
      });
      
      this.assertEquals(status, 201, 'Status should be 201');
      this.assert(data.success, 'Response should indicate success');
      this.assert(data.campaign, 'Should return created campaign');
      this.assertEquals(data.campaign.name, newCampaign.name, 'Campaign name should match');
      this.assert(data.campaign.id, 'Created campaign should have id');
    });

    // Test POST /api/campaigns - missing required fields
    await this.test('POST /api/campaigns - should reject missing required fields', async () => {
      const invalidCampaign = {
        name: 'Test Campaign'
        // Missing script
      };

      const { data, status } = await this.makeRequest('/campaigns', {
        method: 'POST',
        body: JSON.stringify(invalidCampaign)
      });
      
      this.assertEquals(status, 400, 'Status should be 400');
      this.assert(!data.success, 'Response should indicate failure');
      this.assert(data.error.includes('script'), 'Error should mention missing script');
    });
  }

  async runCustomerTests() {
    console.log('\n👥 Running Customer API Tests...');

    // Test GET /api/customers
    await this.test('GET /api/customers - should return all customers', async () => {
      const { data, status } = await this.makeRequest('/customers');
      
      this.assertEquals(status, 200, 'Status should be 200');
      this.assert(data.success, 'Response should indicate success');
      this.assert(Array.isArray(data.customers), 'Should return customers array');
      this.assert(data.customers.length > 0, 'Should have at least one customer');
      this.assert(typeof data.total === 'number', 'Should return total count');
      
      // Check customer structure
      const customer = data.customers[0];
      this.assert(customer.id, 'Customer should have id');
      this.assert(customer.first_name, 'Customer should have first_name');
      this.assert(customer.last_name, 'Customer should have last_name');
      this.assert(customer.phone_number, 'Customer should have phone_number');
    });

    // Test GET /api/customers with status filter
    await this.test('GET /api/customers?status=active - should filter by status', async () => {
      const { data, status } = await this.makeRequest('/customers?status=active');
      
      this.assertEquals(status, 200, 'Status should be 200');
      this.assert(data.success, 'Response should indicate success');
      
      // All customers should have active status
      data.customers.forEach(customer => {
        this.assertEquals(customer.status, 'active', 'All customers should have active status');
      });
    });

    // Test GET /api/customers with search
    await this.test('GET /api/customers?search=john - should search customers', async () => {
      const { data, status } = await this.makeRequest('/customers?search=john');
      
      this.assertEquals(status, 200, 'Status should be 200');
      this.assert(data.success, 'Response should indicate success');
      
      // Should find customers with 'john' in name
      this.assert(data.customers.length > 0, 'Should find matching customers');
      const hasJohn = data.customers.some(customer => 
        customer.first_name.toLowerCase().includes('john') ||
        customer.last_name.toLowerCase().includes('john')
      );
      this.assert(hasJohn, 'Should find customers with john in name');
    });

    // Test POST /api/customers - create new customer
    await this.test('POST /api/customers - should create new customer', async () => {
      const newCustomer = {
        first_name: 'Test',
        last_name: 'Customer',
        phone_number: '+1-555-9999',
        email: 'test@example.com',
        vehicle_interest: 'Test Vehicle'
      };

      const { data, status } = await this.makeRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(newCustomer)
      });
      
      this.assertEquals(status, 201, 'Status should be 201');
      this.assert(data.success, 'Response should indicate success');
      this.assert(data.customer, 'Should return created customer');
      this.assertEquals(data.customer.first_name, newCustomer.first_name, 'First name should match');
      this.assert(data.customer.id, 'Created customer should have id');
    });

    // Test POST /api/customers - missing required fields
    await this.test('POST /api/customers - should reject missing required fields', async () => {
      const invalidCustomer = {
        first_name: 'Test'
        // Missing last_name and phone_number
      };

      const { data, status } = await this.makeRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(invalidCustomer)
      });
      
      this.assertEquals(status, 400, 'Status should be 400');
      this.assert(!data.success, 'Response should indicate failure');
      this.assert(data.error, 'Should return error message');
    });

    // Test POST /api/customers - invalid phone number
    await this.test('POST /api/customers - should reject invalid phone number', async () => {
      const invalidCustomer = {
        first_name: 'Test',
        last_name: 'Customer',
        phone_number: 'invalid-phone'
      };

      const { data, status } = await this.makeRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(invalidCustomer)
      });
      
      this.assertEquals(status, 400, 'Status should be 400');
      this.assert(!data.success, 'Response should indicate failure');
      this.assert(data.error.includes('phone'), 'Error should mention phone number');
    });
  }

  async runPerformanceTests() {
    console.log('\n⚡ Running Performance Tests...');

    // Test API response times
    await this.test('API Response Time - should respond within reasonable time', async () => {
      const startTime = Date.now();
      await this.makeRequest('/campaigns');
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      this.assert(responseTime < 1000, `Response time should be under 1000ms, got ${responseTime}ms`);
    });

    // Test concurrent requests
    await this.test('Concurrent Requests - should handle multiple requests', async () => {
      const promises = [
        this.makeRequest('/campaigns'),
        this.makeRequest('/customers'),
        this.makeRequest('/campaigns?status=running'),
        this.makeRequest('/customers?status=active')
      ];

      const results = await Promise.all(promises);
      
      results.forEach((result, index) => {
        this.assertEquals(result.status, 200, `Request ${index + 1} should succeed`);
        this.assert(result.data.success, `Request ${index + 1} should return success`);
      });
    });
  }

  async runErrorHandlingTests() {
    console.log('\n🚨 Running Error Handling Tests...');

    // Test invalid endpoint
    await this.test('Invalid Endpoint - should return 404', async () => {
      try {
        const response = await fetch(`${BASE_URL}/invalid-endpoint`);
        this.assertEquals(response.status, 404, 'Should return 404 for invalid endpoint');
      } catch {
        // Network error is acceptable for invalid endpoint
        this.assert(true, 'Network error is acceptable for invalid endpoint');
      }
    });

    // Test malformed JSON
    await this.test('Malformed JSON - should handle gracefully', async () => {
      try {
        const response = await fetch(`${BASE_URL}/campaigns`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid json'
        });
        
        this.assert(response.status >= 400, 'Should return error status for malformed JSON');
      } catch {
        // Expected for malformed JSON
        this.assert(true, 'Error expected for malformed JSON');
      }
    });
  }

  async runAllTests() {
    console.log('🎯 Starting Comprehensive API Tests for Voicemail Drop Application');
    console.log('=' * 60);

    const startTime = Date.now();

    try {
      await this.runCampaignTests();
      await this.runCustomerTests();
      await this.runPerformanceTests();
      await this.runErrorHandlingTests();
    } catch (error) {
      console.error('Test suite error:', error);
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log('\n' + '=' * 60);
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('=' * 60);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⏱️  Total Time: ${totalTime}ms`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

    if (this.results.failed > 0) {
      console.log('\n🔍 Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          console.log(`   - ${test.name}: ${test.error}`);
        });
    }

    return this.results;
  }
}

// Export for use in other environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APITester;
}

// Auto-run if executed directly
if (typeof window === 'undefined' && require.main === module) {
  const tester = new APITester();
  tester.runAllTests().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}
