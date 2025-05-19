import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RelatedStampsProps {
  currentStampId: string
}

// Sample related stamps data
const relatedStampsData = {
  "silver-jubilee": [
    {
      id: "chalon-head",
      name: "Chalon Head",
      country: "New Zealand",
      year: 1855,
      denomination: "1 Penny",
      image: "/placeholder.svg",
      description: "The iconic first stamp of New Zealand featuring Queen Victoria",
    },
    {
      id: "smiling-boys",
      name: "Smiling Boys Health",
      country: "New Zealand",
      year: 1931,
      denomination: "1 Penny + 1 Penny",
      image: "/placeholder.svg",
      description: "Rare charity stamp issued to fund children's health camps",
    },
    {
      id: "coronation-series",
      name: "Coronation Series",
      country: "United Kingdom",
      year: 1953,
      denomination: "2 Shillings 6 Pence",
      image: "/placeholder.svg",
      description: "Commemorating the coronation of Queen Elizabeth II",
    },
  ],
  "coronation-series": [
    {
      id: "silver-jubilee",
      name: "Silver Jubilee",
      country: "New Zealand",
      year: 1935,
      denomination: "1 Penny",
      image: "/placeholder.svg",
      description: "Commemorating King George V's 25th year on the throne",
    },
    {
      id: "queen-elizabeth-2",
      name: "Queen Elizabeth II",
      country: "Australia",
      year: 1953,
      denomination: "3 Pence",
      image: "/placeholder.svg",
      description: "Australian stamp celebrating the coronation of Queen Elizabeth II",
    },
    {
      id: "independence-issue",
      name: "Independence Issue",
      country: "India",
      year: 1947,
      denomination: "3.5 Annas",
      image: "/placeholder.svg",
      description: "Commemorating India's independence from British rule",
    },
  ],
  // Default related stamps for any other stamp
  default: [
    {
      id: "silver-jubilee",
      name: "Silver Jubilee",
      country: "New Zealand",
      year: 1935,
      denomination: "1 Penny",
      image: "/placeholder.svg",
      description: "Commemorating King George V's 25th year on the throne",
    },
    {
      id: "coronation-series",
      name: "Coronation Series",
      country: "United Kingdom",
      year: 1953,
      denomination: "2 Shillings 6 Pence",
      image: "/placeholder.svg",
      description: "Commemorating the coronation of Queen Elizabeth II",
    },
    {
      id: "independence-issue",
      name: "Independence Issue",
      country: "India",
      year: 1947,
      denomination: "3.5 Annas",
      image: "/placeholder.svg",
      description: "Commemorating India's independence from British rule",
    },
  ],
}

export default function RelatedStamps({ currentStampId }: RelatedStampsProps) {
  // Get related stamps based on current stamp ID, or use default if not found
  const relatedStamps = relatedStampsData[currentStampId as keyof typeof relatedStampsData] || relatedStampsData.default

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Related Stamps</h2>
      <p className="text-muted-foreground">
        Stamps from the same era, country, or with similar historical significance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {relatedStamps.map((stamp) => (
          <Card key={stamp.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={stamp.image || "/placeholder.svg"}
                alt={`${stamp.name} stamp from ${stamp.country}, ${stamp.year}`}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">{stamp.name}</h3>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{stamp.country}</span>
                <span>{stamp.year}</span>
              </div>
              <p className="text-sm mt-2 line-clamp-2">{stamp.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/stamps/${stamp.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
