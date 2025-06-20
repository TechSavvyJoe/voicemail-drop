import { NextRequest, NextResponse } from 'next/server';

// Mock customers data for testing
const mockCustomers = [
  {
    id: 'cust-1',
    organization_id: 'org-1',
    first_name: 'John',
    last_name: 'Smith',
    phone_number: '+1-555-0123',
    email: 'john.smith@email.com',
    vehicle_interest: '2024 Toyota Camry',
    last_contact: '2024-11-20',
    status: 'active',
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-20T14:30:00Z'
  },
  {
    id: 'cust-2',
    organization_id: 'org-1',
    first_name: 'Sarah',
    last_name: 'Johnson',
    phone_number: '+1-555-0124',
    email: 'sarah.johnson@email.com',
    vehicle_interest: '2024 Honda Accord',
    last_contact: '2024-11-18',
    status: 'active',
    created_at: '2024-10-15T09:00:00Z',
    updated_at: '2024-11-18T16:45:00Z'
  },
  {
    id: 'cust-3',
    organization_id: 'org-1',
    first_name: 'Michael',
    last_name: 'Brown',
    phone_number: '+1-555-0125',
    email: 'michael.brown@email.com',
    vehicle_interest: '2024 Ford F-150',
    last_contact: '2024-11-22',
    status: 'active',
    created_at: '2024-11-05T11:30:00Z',
    updated_at: '2024-11-22T10:15:00Z'
  },
  {
    id: 'cust-4',
    organization_id: 'org-1',
    first_name: 'Emily',
    last_name: 'Davis',
    phone_number: '+1-555-0126',
    email: 'emily.davis@email.com',
    vehicle_interest: '2024 Chevrolet Malibu',
    last_contact: '2024-11-19',
    status: 'inactive',
    created_at: '2024-10-20T13:00:00Z',
    updated_at: '2024-11-19T12:20:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Add small delay to simulate real API
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    
    let filteredCustomers = mockCustomers;
    
    if (status) {
      filteredCustomers = filteredCustomers.filter(customer => customer.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.first_name.toLowerCase().includes(searchLower) ||
        customer.last_name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone_number.includes(search)
      );
    }
    
    return NextResponse.json({ 
      customers: filteredCustomers,
      total: filteredCustomers.length,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch customers',
      success: false 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'phone_number'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}`,
          success: false 
        }, { status: 400 });
      }
    }
    
    // Validate phone number format
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(body.phone_number)) {
      return NextResponse.json({ 
        error: 'Invalid phone number format',
        success: false 
      }, { status: 400 });
    }
    
    const newCustomer = {
      id: `cust-${Date.now()}`,
      organization_id: 'org-1',
      ...body,
      status: body.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add delay to simulate real API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return NextResponse.json({ 
      customer: newCustomer,
      success: true 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ 
      error: 'Failed to create customer',
      success: false 
    }, { status: 500 });
  }
}
