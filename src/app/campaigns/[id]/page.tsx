import { demoCampaigns } from '@/lib/demo-data'
import CampaignDetailClient from './client-page'

// Generate static params for static export
export async function generateStaticParams() {
  // For demo mode, generate params for demo campaigns
  return demoCampaigns.map((campaign) => ({
    id: campaign.id,
  }))
}

// Server component that wraps the client component
export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CampaignDetailClient id={id} />
}
