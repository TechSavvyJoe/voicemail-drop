import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { CustomerSchema } from '@/lib/validations';

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) throw new Error('No token provided');
  
  const decoded = verifyToken(token) as { userId: string, organizationId: string };
  return { userId: decoded.userId, organizationId: decoded.organizationId };
}

export async function GET(request: NextRequest) {
  try {
    const { organizationId } = await getUserFromToken(request);
    const supabase = await createClient();

    // In demo mode, return mock customers
    if (!supabase) {
      const mockCustomers = [
        {
          id: 'demo-customer-1',
          organization_id: organizationId,
          first_name: 'John',
          last_name: 'Smith',
          phone_number: '555-0001',
          email: 'john.smith@email.com',
          vehicle_interest: 'Sedan',
          last_contact: '2024-06-15',
          notes: 'Interested in fuel-efficient vehicles',
          is_active: true,
          opt_out: false,
          created_at: '2024-06-01T09:00:00Z'
        },
        {
          id: 'demo-customer-2',
          organization_id: organizationId,
          first_name: 'Sarah',
          last_name: 'Johnson',
          phone_number: '555-0002',
          email: 'sarah.j@email.com',
          vehicle_interest: 'SUV',
          last_contact: '2024-06-18',
          notes: 'Looking for family vehicle',
          is_active: true,
          opt_out: false,
          created_at: '2024-06-10T11:15:00Z'
        }
      ];
      return NextResponse.json({ customers: mockCustomers });
    }

    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Customers fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch customers' },
        { status: 500 }
      );
    }

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Customers GET error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Unauthorized',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, organizationId } = await getUserFromToken(request);
    const body = await request.json();
    
    const supabase = await createClient();
    
    // In demo mode, return mock responses
    if (!supabase) {
      if (Array.isArray(body.customers)) {
        const mockCustomers = body.customers.map((customer: { firstName: string; lastName: string; phoneNumber: string; email?: string; vehicleInterest?: string; lastContact?: string; notes?: string }, index: number) => ({
          id: `demo-customer-${Date.now()}-${index}`,
          organization_id: organizationId,
          user_id: userId,
          first_name: customer.firstName,
          last_name: customer.lastName,
          phone_number: customer.phoneNumber,
          email: customer.email,
          vehicle_interest: customer.vehicleInterest,
          last_contact: customer.lastContact,
          notes: customer.notes,
          is_active: true,
          opt_out: false,
          created_at: new Date().toISOString()
        }));
        
        return NextResponse.json({
          customers: mockCustomers,
          message: `${mockCustomers.length} customers imported successfully`,
        });
      } else {
        const mockCustomer = {
          id: `demo-customer-${Date.now()}`,
          organization_id: organizationId,
          user_id: userId,
          first_name: body.firstName,
          last_name: body.lastName,
          phone_number: body.phoneNumber,
          email: body.email,
          vehicle_interest: body.vehicleInterest,
          last_contact: body.lastContact,
          notes: body.notes,
          is_active: true,
          opt_out: false,
          created_at: new Date().toISOString()
        };
        
        return NextResponse.json({
          customer: mockCustomer,
          message: 'Customer created successfully',
        });
      }
    }
    
    // Handle bulk upload
    if (Array.isArray(body.customers)) {
      const validatedCustomers = [];
      const errors = [];

      for (let i = 0; i < body.customers.length; i++) {
        try {
          const validatedCustomer = CustomerSchema.parse(body.customers[i]);
          validatedCustomers.push({
            organization_id: organizationId,
            customer_list_id: null, // Will be set if uploading to specific list
            first_name: validatedCustomer.firstName,
            last_name: validatedCustomer.lastName,
            phone_number: validatedCustomer.phoneNumber,
            email: validatedCustomer.email,
            vehicle_interest: validatedCustomer.vehicleInterest,
            last_contact: validatedCustomer.lastContact,
            notes: validatedCustomer.notes,
            is_active: true,
            opt_out: false
          });
        } catch (error) {
          errors.push({
            row: i + 1,
            error: error instanceof Error ? error.message : 'Invalid data',
          });
        }
      }

      if (errors.length > 0) {
        return NextResponse.json(
          { error: 'Validation errors', details: errors },
          { status: 400 }
        );
      }

      const { data: customers, error } = await supabase
        .from('customers')
        .insert(validatedCustomers)
        .select();

      if (error) {
        console.error('Customer bulk creation error:', error);
        const errorMessage = error.message || 'Unknown database error'
        return NextResponse.json(
          { 
            error: 'Failed to create customers',
            details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        customers,
        message: `${customers.length} customers imported successfully`,
      });
    }

    // Handle single customer creation
    const validatedCustomer = CustomerSchema.parse(body);

    const { data: customer, error } = await supabase
      .from('customers')
      .insert([
        {
          organization_id: organizationId,
          customer_list_id: null,
          first_name: validatedCustomer.firstName,
          last_name: validatedCustomer.lastName,
          phone_number: validatedCustomer.phoneNumber,
          email: validatedCustomer.email,
          vehicle_interest: validatedCustomer.vehicleInterest,
          last_contact: validatedCustomer.lastContact,
          notes: validatedCustomer.notes,
          is_active: true,
          opt_out: false
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Customer creation error:', error);
      const errorMessage = error.message || 'Unknown database error'
      return NextResponse.json(
        { 
          error: 'Failed to create customer',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      customer,
      message: 'Customer created successfully',
    });
  } catch (error) {
    console.error('Customers POST error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Unauthorized',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 401 }
    );
  }
}
