import { Handle, Position } from 'reactflow'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { StampData } from '@/types/catalog'

interface StampNodeProps {
  data: { 
    stamp: StampData,
    onStampClick: (stamp: StampData) => void
  }
}

export const StampNode = ({ data }: StampNodeProps) => {
  const { stamp, onStampClick } = data
  
  return (
    <div 
      className="group cursor-pointer transition-all duration-200 hover:shadow-xl rounded-lg p-2 md:p-3 bg-background border-2 border-muted hover:border-primary/50 min-w-[200px] md:min-w-[220px] max-w-[260px] md:max-w-[280px] hover:scale-105 relative"
      onClick={() => onStampClick && onStampClick(stamp)}
    >
      {/* Input handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-2 h-2 !bg-primary !border-0"
      />
      
      <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-12 md:w-14 h-12 md:h-14 relative flex-shrink-0 bg-muted/10 rounded-lg overflow-hidden shadow-sm">
          <Image
            src={stamp.stampImageUrl || "/placeholder.svg"}
            alt={stamp.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm leading-tight mb-1 text-foreground truncate" title={stamp.name}>
            {stamp.name}
          </h4>
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mb-1">
            <Badge variant="outline" className="text-xs px-2 py-0.5 h-auto bg-primary/5 border-primary/30 text-primary">
              {stamp.denominationValue} {stamp.denominationSymbol}
            </Badge>
            <span className="bg-muted/50 px-1 py-0.5 rounded text-xs">
              {stamp.issueYear || 'Unknown'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            #{stamp.catalogNumber}
          </p>
        </div>
        
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ChevronRight className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  )
} 