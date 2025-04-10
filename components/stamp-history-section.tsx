interface StampHistorySectionProps {
  history: string
}

export default function StampHistorySection({ history }: StampHistorySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-3">Historical Context</h3>
        <p className="text-muted-foreground">{history}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-muted p-6 rounded-lg">
          <h4 className="font-medium mb-2">Historical Events of the Era</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Major political developments of the time</li>
            <li>Cultural and social context</li>
            <li>Economic conditions that influenced the stamp's issuance</li>
            <li>Postal system developments</li>
          </ul>
        </div>

        <div className="bg-muted p-6 rounded-lg">
          <h4 className="font-medium mb-2">Philatelic Significance</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Importance in stamp collecting history</li>
            <li>Notable features that make this stamp special</li>
            <li>Printing techniques and innovations</li>
            <li>Collection and preservation notes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
