import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HistoryEvent {
  date: string
  event: string
}

interface StampHistorySectionProps {
  history: HistoryEvent[]
}

export default function StampHistorySection({ history }: StampHistorySectionProps) {
  // Sort history events by date (oldest to newest)
  const sortedHistory = [...history].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-muted pl-6 ml-3">
          {sortedHistory.map((item, index) => {
            // Format date for display
            const date = new Date(item.date)
            const formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })

            return (
              <div key={index} className="mb-8 relative">
                <div className="absolute -left-[31px] mt-1.5 h-5 w-5 rounded-full border border-primary bg-background flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">{formattedDate}</div>
                  <div className="text-muted-foreground">{item.event}</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
