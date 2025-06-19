'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { isDemoMode } from '@/lib/demo-data'
import { supabase } from '@/lib/supabase'

// Types
interface Customer {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email?: string
  vehicleInterest?: string
  lastContact?: string
  createdAt: string
  updatedAt: string
}

interface CreateCustomerData {
  firstName: string
  lastName: string
  phoneNumber: string
  email?: string
  vehicleInterest?: string
  lastContact?: string
}

interface UpdateCustomerData {
  id: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  email?: string
  vehicleInterest?: string
  lastContact?: string
}

// Demo data
const demoCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    phoneNumber: '+1234567890',
    email: 'john.smith@example.com',
    vehicleInterest: 'Toyota Camry',
    lastContact: '2024-01-15',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phoneNumber: '+1234567891',
    email: 'sarah.j@example.com',
    vehicleInterest: 'Honda Civic',
    lastContact: '2024-01-10',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Brown',
    phoneNumber: '+1234567892',
    email: 'mike.brown@example.com',
    vehicleInterest: 'Ford F-150',
    lastContact: '2024-01-12',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  }
]

// Helper function to add delay for demo purposes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API functions
async function fetchCustomers(): Promise<Customer[]> {
  await delay(300) // Simulate network delay
  
  if (isDemoMode || !supabase) {
    return demoCustomers
  }
  
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return (data || []).map(customer => ({
      id: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      phoneNumber: customer.phone_number,
      email: customer.email,
      vehicleInterest: customer.vehicle_interest,
      lastContact: customer.last_contact,
      createdAt: customer.created_at,
      updatedAt: customer.updated_at
    }))
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw new Error('Failed to fetch customers')
  }
}

async function createCustomer(customerData: CreateCustomerData): Promise<Customer> {
  await delay(500)
  
  if (isDemoMode || !supabase) {
    // Return mock created customer
    return {
      id: `demo-customer-${Date.now()}`,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      phoneNumber: customerData.phoneNumber,
      email: customerData.email,
      vehicleInterest: customerData.vehicleInterest,
      lastContact: customerData.lastContact,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        phone_number: customerData.phoneNumber,
        email: customerData.email,
        vehicle_interest: customerData.vehicleInterest,
        last_contact: customerData.lastContact
      }])
      .select()
      .single()

    if (error) throw error
    
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      phoneNumber: data.phone_number,
      email: data.email,
      vehicleInterest: data.vehicle_interest,
      lastContact: data.last_contact,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  } catch (error) {
    console.error('Error creating customer:', error)
    throw new Error('Failed to create customer')
  }
}

async function updateCustomer(updateData: UpdateCustomerData): Promise<Customer> {
  await delay(400)
  
  if (isDemoMode || !supabase) {
    // Return mock updated customer
    return {
      id: updateData.id,
      firstName: updateData.firstName || 'Updated',
      lastName: updateData.lastName || 'Customer',
      phoneNumber: updateData.phoneNumber || '+1234567890',
      email: updateData.email,
      vehicleInterest: updateData.vehicleInterest,
      lastContact: updateData.lastContact,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  try {
    const { id, ...updates } = updateData
    
    const updateObj: Record<string, string> = {
      updated_at: new Date().toISOString()
    }
    
    if (updates.firstName) updateObj.first_name = updates.firstName
    if (updates.lastName) updateObj.last_name = updates.lastName
    if (updates.phoneNumber) updateObj.phone_number = updates.phoneNumber
    if (updates.email) updateObj.email = updates.email
    if (updates.vehicleInterest) updateObj.vehicle_interest = updates.vehicleInterest
    if (updates.lastContact) updateObj.last_contact = updates.lastContact
    
    const { data, error } = await supabase
      .from('customers')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      phoneNumber: data.phone_number,
      email: data.email,
      vehicleInterest: data.vehicle_interest,
      lastContact: data.last_contact,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  } catch (error) {
    console.error('Error updating customer:', error)
    throw new Error('Failed to update customer')
  }
}

async function deleteCustomer(customerId: string): Promise<void> {
  await delay(300)
  
  if (isDemoMode || !supabase) {
    return // Mock deletion
  }
  
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting customer:', error)
    throw new Error('Failed to delete customer')
  }
}

// Hook
export function useCustomers() {
  const [refreshKey, setRefreshKey] = useState(0)
  const queryClient = useQueryClient()
  
  const customersQuery = useQuery({
    queryKey: ['customers', refreshKey],
    queryFn: fetchCustomers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setRefreshKey(prev => prev + 1)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setRefreshKey(prev => prev + 1)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setRefreshKey(prev => prev + 1)
    },
  })

  const refresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return {
    // Data
    customers: customersQuery.data || [],
    
    // Loading states
    isLoading: customersQuery.isLoading,
    isError: customersQuery.isError,
    error: customersQuery.error,
    
    // Mutations
    createCustomer: createMutation.mutateAsync,
    updateCustomer: updateMutation.mutateAsync,
    deleteCustomer: deleteMutation.mutateAsync,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Utils
    refresh,
  }
}

export type { Customer, CreateCustomerData, UpdateCustomerData }
