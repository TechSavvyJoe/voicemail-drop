import { demoCustomers } from '@/lib/demo-data'
import EditCustomerClient from './client-page'

// Generate static params for static export
export async function generateStaticParams() {
  // For demo mode, generate params for demo customers
  return demoCustomers.map((customer) => ({
    id: customer.id,
  }))
}

// Server component that wraps the client component
export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditCustomerClient id={id} />
}
