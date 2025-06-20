# Voicemail Drop API Documentation

## 🚀 Overview

The Voicemail Drop API provides programmatic access to all core functionality including customer management, campaign creation, voicemail delivery, and TCPA compliance features.

## 🔐 Authentication

All API requests require authentication using Bearer tokens:

```javascript
const response = await fetch('/api/customers', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

## 📋 Core Endpoints

### Customers API

#### GET /api/customers
Retrieve paginated list of customers

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search by name, phone, or email
- `status` (string): Filter by status (active, inactive, dnc)
- `priority` (string): Filter by priority (hot, high, medium, low)

**Response:**
```json
{
  "customers": [
    {
      "id": "cust-123",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "email": "john@example.com",
      "status": "active",
      "priority": "high",
      "vehicleInterest": "SUV",
      "assignedTo": "sales-rep-1",
      "lastContact": "2024-01-15T10:30:00Z",
      "leadScore": 85,
      "source": "website",
      "createdAt": "2024-01-10T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### POST /api/customers
Create new customer

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1987654321",
  "email": "jane@example.com",
  "vehicleInterest": "Sedan",
  "source": "referral",
  "assignedTo": "sales-rep-2"
}
```

#### GET /api/customers/:id
Get customer by ID

#### PUT /api/customers/:id
Update customer information

#### DELETE /api/customers/:id
Delete customer (soft delete)

### Campaigns API

#### GET /api/campaigns
List all campaigns with filtering

**Query Parameters:**
- `status` (string): draft, active, paused, completed
- `type` (string): immediate, scheduled, recurring

**Response:**
```json
{
  "campaigns": [
    {
      "id": "camp-456",
      "name": "Holiday Promotion",
      "status": "active",
      "type": "scheduled",
      "message": "Happy holidays! Check out our special offers...",
      "scheduledFor": "2024-12-15T14:00:00Z",
      "targetAudience": {
        "filters": {
          "priority": ["hot", "high"],
          "vehicleInterest": ["SUV", "Truck"]
        },
        "count": 250
      },
      "deliveryStats": {
        "sent": 150,
        "delivered": 145,
        "failed": 5
      },
      "createdAt": "2024-12-01T09:00:00Z"
    }
  ]
}
```

#### POST /api/campaigns
Create new campaign

**Request Body:**
```json
{
  "name": "New Year Sale",
  "message": "Start the year with a new car! Visit us today.",
  "type": "immediate",
  "targetAudience": {
    "filters": {
      "status": ["active"],
      "priority": ["hot", "high"]
    }
  },
  "deliveryOptions": {
    "respectTimeZones": true,
    "hourStart": 9,
    "hourEnd": 18
  }
}
```

#### GET /api/campaigns/:id
Get campaign details

#### PUT /api/campaigns/:id
Update campaign

#### POST /api/campaigns/:id/start
Start campaign execution

#### POST /api/campaigns/:id/pause
Pause active campaign

### Voicemail API

#### POST /api/voicemail/send
Send individual voicemail

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "message": "Hello, this is a test voicemail message.",
  "customerId": "cust-123",
  "campaignId": "camp-456"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "msg-789",
  "status": "queued",
  "estimatedDelivery": "2024-01-15T10:35:00Z",
  "cost": 0.0075
}
```

#### GET /api/voicemail/status/:messageId
Get delivery status

**Response:**
```json
{
  "messageId": "msg-789",
  "status": "delivered",
  "deliveredAt": "2024-01-15T10:33:22Z",
  "duration": 23,
  "attempts": 1,
  "cost": 0.0075
}
```

### TCPA Compliance API

#### GET /api/tcpa/dnc-check/:phoneNumber
Check if phone number is on Do Not Call list

**Response:**
```json
{
  "phoneNumber": "+1234567890",
  "isOnDNC": false,
  "dateAdded": null,
  "reason": null
}
```

#### POST /api/tcpa/opt-out
Add phone number to DNC list

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "reason": "customer_request",
  "source": "voicemail_response"
}
```

#### GET /api/tcpa/audit-log
Get TCPA compliance audit log

**Query Parameters:**
- `startDate` (string): ISO date string
- `endDate` (string): ISO date string
- `action` (string): dnc_check, opt_out, voicemail_sent

#### GET /api/tcpa/compliance-report
Generate compliance report

**Response:**
```json
{
  "reportPeriod": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z"
  },
  "metrics": {
    "totalVoicemails": 1250,
    "dncViolations": 0,
    "timeViolations": 2,
    "frequencyViolations": 1,
    "complianceScore": 99.8
  },
  "violations": [
    {
      "type": "time_violation",
      "phoneNumber": "+1234567890",
      "timestamp": "2024-01-15T21:30:00Z",
      "reason": "Sent outside allowed hours"
    }
  ]
}
```

### Analytics API

#### GET /api/analytics/dashboard
Get dashboard metrics

**Response:**
```json
{
  "overview": {
    "totalCustomers": 1250,
    "activeCampaigns": 3,
    "voicemailsThisMonth": 850,
    "conversionRate": 12.5
  },
  "recentActivity": [
    {
      "type": "campaign_completed",
      "name": "Holiday Promotion",
      "timestamp": "2024-01-15T16:00:00Z",
      "metrics": {
        "sent": 250,
        "delivered": 245,
        "responses": 31
      }
    }
  ],
  "topPerformers": {
    "campaigns": [
      {
        "id": "camp-123",
        "name": "Trade-in Special",
        "responseRate": 18.5
      }
    ],
    "salesReps": [
      {
        "id": "rep-456",
        "name": "John Sales",
        "conversionRate": 22.3
      }
    ]
  }
}
```

#### GET /api/analytics/campaigns/:id
Get detailed campaign analytics

#### GET /api/analytics/customers/lead-scoring
Get lead scoring analytics

#### GET /api/analytics/performance
Get performance metrics over time

### File Upload API

#### POST /api/upload/customers
Upload customer list (CSV format)

**Request:** Multipart form data with CSV file

**Response:**
```json
{
  "success": true,
  "processed": 150,
  "created": 142,
  "updated": 8,
  "errors": [
    {
      "row": 23,
      "field": "phone",
      "message": "Invalid phone number format"
    }
  ]
}
```

## 🔧 SDK Integration

### JavaScript/TypeScript SDK

```javascript
import { VoicemailDropAPI } from '@voicemail-drop/sdk';

const api = new VoicemailDropAPI({
  baseURL: 'https://your-domain.com/api',
  apiKey: 'your-api-key'
});

// Create customer
const customer = await api.customers.create({
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890'
});

// Send voicemail
const voicemail = await api.voicemail.send({
  phoneNumber: customer.phone,
  message: 'Hello John, we have a great deal for you!'
});

// Check delivery status
const status = await api.voicemail.getStatus(voicemail.messageId);
```

### Python SDK

```python
from voicemail_drop import VoicemailDropAPI

api = VoicemailDropAPI(
    base_url='https://your-domain.com/api',
    api_key='your-api-key'
)

# Create customer
customer = api.customers.create({
    'firstName': 'Jane',
    'lastName': 'Smith',
    'phone': '+1987654321'
})

# Create and start campaign
campaign = api.campaigns.create({
    'name': 'Summer Sale',
    'message': 'Summer sale now on! Visit us today.',
    'target_audience': {
        'filters': {'priority': ['hot', 'high']}
    }
})

api.campaigns.start(campaign['id'])
```

## 📊 Webhooks

### Webhook Events

Configure webhook URLs to receive real-time notifications:

#### voicemail.delivered
```json
{
  "event": "voicemail.delivered",
  "timestamp": "2024-01-15T10:33:22Z",
  "data": {
    "messageId": "msg-789",
    "campaignId": "camp-456",
    "customerId": "cust-123",
    "phoneNumber": "+1234567890",
    "duration": 23,
    "cost": 0.0075
  }
}
```

#### voicemail.failed
```json
{
  "event": "voicemail.failed",
  "timestamp": "2024-01-15T10:35:00Z",
  "data": {
    "messageId": "msg-790",
    "campaignId": "camp-456",
    "customerId": "cust-124",
    "phoneNumber": "+1234567891",
    "error": "number_not_reachable",
    "attempts": 3
  }
}
```

#### campaign.completed
```json
{
  "event": "campaign.completed",
  "timestamp": "2024-01-15T16:00:00Z",
  "data": {
    "campaignId": "camp-456",
    "name": "Holiday Promotion",
    "stats": {
      "sent": 250,
      "delivered": 245,
      "failed": 5,
      "cost": 1.8375
    }
  }
}
```

### Webhook Security

Verify webhook authenticity using signature headers:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## 🚨 Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_PHONE_NUMBER",
    "message": "The provided phone number is not valid",
    "details": {
      "field": "phoneNumber",
      "value": "123-456-7890",
      "expected": "E.164 format (+1234567890)"
    }
  }
}
```

### Common Error Codes

- `TCPA_VIOLATION` - Request violates TCPA regulations
- `DNC_LIST_VIOLATION` - Phone number is on Do Not Call list
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INVALID_PHONE_NUMBER` - Phone number format invalid
- `CAMPAIGN_NOT_FOUND` - Campaign does not exist
- `CUSTOMER_NOT_FOUND` - Customer does not exist

## 🔄 Rate Limits

### Default Limits

- **API Requests**: 1000 requests per hour per API key
- **Voicemail Sending**: 100 voicemails per minute
- **File Uploads**: 10 uploads per hour
- **Webhook Deliveries**: 500 deliveries per hour

### Rate Limit Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 875
X-RateLimit-Reset: 1642784400
```

## 📚 Examples

### Complete Campaign Workflow

```javascript
// 1. Upload customer list
const uploadResult = await api.upload.customers(csvFile);

// 2. Create campaign
const campaign = await api.campaigns.create({
  name: 'Q1 Promotion',
  message: 'Quarter 1 specials now available!',
  targetAudience: {
    filters: { priority: ['hot', 'high'] }
  }
});

// 3. Start campaign
await api.campaigns.start(campaign.id);

// 4. Monitor progress
const status = await api.campaigns.get(campaign.id);
console.log(`Sent: ${status.deliveryStats.sent}/${status.targetAudience.count}`);

// 5. Get analytics
const analytics = await api.analytics.campaigns(campaign.id);
console.log(`Response rate: ${analytics.responseRate}%`);
```

### TCPA Compliance Check

```javascript
async function sendCompliantVoicemail(phoneNumber, message) {
  // Check DNC list
  const dncCheck = await api.tcpa.dncCheck(phoneNumber);
  if (dncCheck.isOnDNC) {
    throw new Error('Phone number is on Do Not Call list');
  }
  
  // Check time restrictions
  const now = new Date();
  const hour = now.getHours();
  if (hour < 8 || hour > 21) {
    throw new Error('Outside allowed calling hours');
  }
  
  // Send voicemail
  const result = await api.voicemail.send({
    phoneNumber,
    message: message + ' Reply STOP to opt out.'
  });
  
  return result;
}
```

---

## 🆘 Support

For API support and documentation updates:
- **Email**: api-support@voicemaildrop.com
- **Documentation**: https://docs.voicemaildrop.com
- **Status Page**: https://status.voicemaildrop.com
