import type { Metadata } from "next"
import StampVarietyDetailClient from "./stamp-variety-detail"

export const generateMetadata = async ({ params }: { params: { stampId: string; varietyId: string } }): Promise<Metadata> => {
  // Use default metadata
  return {
    title: "Stamp Variety Detail - Stamps of Approval",
    description: "View detailed information about a specific stamp variety, including rarity, catalog references, and more",
  }
}

export default async function StampVarietyDetailPage({ params }: { params: { stampId: string; varietyId: string } }) {
  // Pass params directly to avoid the NextJS warning about awaiting params
  return <StampVarietyDetailClient stampId={params.stampId} varietyId={params.varietyId} />
}
