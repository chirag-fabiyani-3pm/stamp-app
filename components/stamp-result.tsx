import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface StampResultProps {
  data: {
    country: string
    year: number
    denomination: string
    color: string
    condition?: string
    rarity?: string
    designElements: string[]
    historicalSignificance: string
    estimatedValue?: string
    catalogReference?: string
  }
}

export default function StampResult({ data }: StampResultProps) {
  return (
    <div className="space-y-6">
      <div className="bg-primary/5 p-6 rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">Stamp Identified!</h3>
          {data.estimatedValue && <div className="text-lg font-medium text-primary">{data.estimatedValue}</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Country</h4>
            <p className="font-medium">{data.country}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Year of Issue</h4>
            <p className="font-medium">{data.year}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Denomination</h4>
            <p className="font-medium">{data.denomination}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Color</h4>
            <p className="font-medium">{data.color}</p>
          </div>

          {data.condition && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Condition</h4>
              <Badge variant="outline">{data.condition}</Badge>
            </div>
          )}

          {data.rarity && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Rarity</h4>
              <Badge variant="outline">{data.rarity}</Badge>
            </div>
          )}

          {data.catalogReference && (
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Catalog Reference</h4>
              <p className="font-medium">{data.catalogReference}</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Design Elements</h4>
          <ul className="list-disc pl-5 space-y-1">
            {data.designElements.map((element, index) => (
              <li key={index}>{element}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Historical Significance</h4>
          <p>{data.historicalSignificance}</p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Similar Stamps in Catalog</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={`/placeholder.svg?height=200&width=200&text=Similar Stamp ${i}`}
                  alt={`Similar stamp ${i}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-3">
                <h4 className="font-medium text-sm truncate">
                  {data.country} - {data.year + i} - {i}d
                </h4>
                <p className="text-xs text-muted-foreground">Silver Jubilee Series</p>
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <Link href={`/catalog/stamp-${i}`} className="text-xs text-primary hover:underline">
                  View Details
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
