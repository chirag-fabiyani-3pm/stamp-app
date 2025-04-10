import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface RelatedStampsProps {
  currentStampId: number
}

export default function RelatedStamps({ currentStampId }: RelatedStampsProps) {
  // In a real app, this would fetch related stamps from an API or database
  // For now, we'll just show some sample related stamps
  const relatedStamps = [
    {
      id: currentStampId === 1 ? 2 : 1,
      name: currentStampId === 1 ? "Coronation Series" : "Silver Jubilee",
      country: currentStampId === 1 ? "United Kingdom" : "New Zealand",
      year: currentStampId === 1 ? 1953 : 1935,
      denomination: currentStampId === 1 ? "3d" : "1d",
      image:
        currentStampId === 1
          ? "/placeholder.svg?height=200&width=200&text=UK+1953"
          : "/placeholder.svg?height=200&width=200&text=NZ+1935",
    },
    {
      id: currentStampId === 3 ? 2 : 3,
      name: currentStampId === 3 ? "Coronation Series" : "Independence Issue",
      country: currentStampId === 3 ? "United Kingdom" : "India",
      year: currentStampId === 3 ? 1953 : 1947,
      denomination: currentStampId === 3 ? "3d" : "1 Anna",
      image:
        currentStampId === 3
          ? "/placeholder.svg?height=200&width=200&text=UK+1953"
          : "/placeholder.svg?height=200&width=200&text=India+1947",
    },
    {
      id: 4,
      name: "Bicentennial",
      country: "United States",
      year: 1976,
      denomination: "13c",
      image: "/placeholder.svg?height=200&width=200&text=US+1976",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Related Stamps</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {relatedStamps.map((stamp) => (
          <Card key={stamp.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={stamp.image || "/placeholder.svg"}
                alt={`${stamp.country} ${stamp.name} stamp`}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">{stamp.name}</h3>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{stamp.country}</span>
                <span>{stamp.year}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link href={`/catalog/stamp-${stamp.id}`} className="text-sm text-primary hover:underline">
                View Details
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
