import { ChevronRight, Home } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ModalStackItem } from "@/types/catalog"

interface BreadcrumbNavigationProps {
    modalStack: ModalStackItem[]
    onNavigate: (index: number) => void
    className?: string
}

const LEVEL_ICONS: { [key: string]: string } = {
    'country': '🌍',
    'series': '📚',
    'year': '📅',
    'currency': '💰',
    'denomination': '💵',
    'color': '🎨',
    'paper': '📄',
    'watermark': '💎',
    'perforation': '⚡',
    'itemType': '📦',
    'stampDetails': '🏆'
}

const LEVEL_COLORS: { [key: string]: string } = {
    'country': 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    'series': 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    'year': 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
    'currency': 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    'denomination': 'bg-cyan-100 text-cyan-700 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700',
    'color': 'bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
    'paper': 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
    'watermark': 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700',
    'perforation': 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
    'itemType': 'bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700',
    'stampDetails': 'bg-primary/20 text-primary border-primary/30 dark:bg-primary/20 dark:text-amber-300 dark:border-amber-600'
}

export function BreadcrumbNavigation({ modalStack, onNavigate, className }: BreadcrumbNavigationProps) {
    if (modalStack.length === 0) return null

    const getBreadcrumbLabel = (item: ModalStackItem): string => {
        const pathParts = item.stampCode.split('|||')
        
        switch (item.type) {
            case 'country':
                return item.data?.country?.name || pathParts[0]
            case 'series':
                return decodeURIComponent(pathParts[1] || 'Series')
            case 'year':
                return pathParts[2] || 'Year'
            case 'currency':
                return item.data?.currency?.code || pathParts[3] || 'Currency'
            case 'denomination':
                return pathParts[4] || 'Denomination'
            case 'color':
                return item.data?.color?.name || pathParts[5] || 'Color'
            case 'paper':
                return item.data?.paper?.name || pathParts[6] || 'Paper'
            case 'watermark':
                return item.data?.watermark?.name || pathParts[7] || 'Watermark'
            case 'perforation':
                return item.data?.perforation?.name || pathParts[8] || 'Perforation'
            case 'itemType':
                return item.data?.itemType?.name || pathParts[9] || 'Item Type'
            case 'stampDetails':
                return item.data?.stamp?.name || 'Stamp Details'
            default:
                return 'Unknown'
        }
    }

    return (
        <nav className={cn("flex items-center gap-1 flex-wrap", className)} aria-label="Breadcrumb navigation">
            {/* Home Icon - Close All */}
            <button
                onClick={() => onNavigate(-1)}
                className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Close all modals"
                aria-label="Close all modals"
            >
                <Home className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-amber-400 transition-colors" />
            </button>

            {/* Breadcrumb Items */}
            {modalStack.map((item, index) => {
                const isLast = index === modalStack.length - 1
                const icon = LEVEL_ICONS[item.type] || '📍'
                const colorClass = LEVEL_COLORS[item.type] || 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                const label = getBreadcrumbLabel(item)
                
                return (
                    <div key={index} className="flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-600" />
                        
                        <button
                            onClick={() => !isLast && onNavigate(index)}
                            disabled={isLast}
                            className={cn(
                                "group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200",
                                colorClass,
                                isLast 
                                    ? "cursor-default shadow-sm" 
                                    : "hover:shadow-md hover:scale-105 cursor-pointer",
                                !isLast && "hover:brightness-95 dark:hover:brightness-110"
                            )}
                            title={isLast ? "Current location" : `Navigate to ${label}`}
                            aria-current={isLast ? "page" : undefined}
                        >
                            <span className="text-sm">{icon}</span>
                            <span className="max-w-[120px] truncate">
                                {label}
                            </span>
                            {isLast && (
                                <Badge variant="outline" className="ml-1 px-1 py-0 text-[10px] border-current">
                                    Current
                                </Badge>
                            )}
                        </button>
                    </div>
                )
            })}
        </nav>
    )
}

