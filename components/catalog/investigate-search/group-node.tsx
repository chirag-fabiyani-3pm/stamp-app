import { Handle, Position } from 'reactflow'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export const GroupNode = ({ data }: { data: any }) => {
  const { name, count, level, fieldLabel } = data
  
  return (
    <div className={cn(
      "px-3 md:px-4 py-2 md:py-3 shadow-lg rounded-lg bg-background min-w-[120px] md:min-w-[140px] transition-all hover:shadow-xl relative",
      level === 0 && "border-0 bg-gradient-to-br from-primary/10 to-primary/20 shadow-primary/20",
      level === 1 && "border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30",
      level === 2 && "border-2 border-green-400 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/30",
      level >= 3 && "border-2 border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/30"
    )}>
      {/* Input handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-2 h-2 !bg-primary !border-0"
      />
      
      <div className="flex flex-col items-center text-center">
        <div className={cn(
          "w-4 h-4 rounded-full mb-2 shadow-sm",
          level === 0 && "bg-gradient-to-r from-primary to-primary/80",
          level === 1 && "bg-gradient-to-r from-blue-500 to-blue-600",
          level === 2 && "bg-gradient-to-r from-green-500 to-green-600", 
          level >= 3 && "bg-gradient-to-r from-orange-500 to-orange-600"
        )}></div>
        <h4 className="font-semibold text-sm text-foreground truncate max-w-[120px] mb-1" title={name}>
          {name}
        </h4>
        <p className="text-xs text-muted-foreground mb-2">
          {fieldLabel}
        </p>
        <Badge variant="outline" className={cn(
          "text-xs font-medium",
          level === 0 && "border-primary/50 text-primary bg-primary/5",
          level === 1 && "border-blue-400/50 text-blue-600 bg-blue-50 dark:bg-blue-950/30",
          level === 2 && "border-green-400/50 text-green-600 bg-green-50 dark:bg-green-950/30",
          level >= 3 && "border-orange-400/50 text-orange-600 bg-orange-50 dark:bg-orange-950/30"
        )}>
          {count} stamp{count !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      {/* Output handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-2 h-2 !bg-primary !border-0"
      />
    </div>
  )
} 