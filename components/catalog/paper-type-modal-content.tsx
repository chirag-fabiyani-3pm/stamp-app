import React, { useMemo } from "react"
import Image from "next/image"
import { BookOpen, ChevronRight, ChevronDown, Eye } from "lucide-react"
import { PaperTypeData, StampData } from "@/types/catalog"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PaperTypeModalContentProps {
  paperTypeData: PaperTypeData
  stamps: StampData[]
  onStampClick: (stamp: StampData) => void
  isLoading: boolean;
}

export function PaperTypeModalContent({
  paperTypeData,
  stamps,
  onStampClick,
  isLoading
}: PaperTypeModalContentProps) {
  const [expandedStamps, setExpandedStamps] = React.useState<Set<string>>(new Set())

  const toggleStampExpansion = (stampId: string) => {
    const newExpanded = new Set(expandedStamps)
    if (newExpanded.has(stampId)) {
      newExpanded.delete(stampId)
    } else {
      newExpanded.add(stampId)
    }
    setExpandedStamps(newExpanded)
  }

  const collageStamps = useMemo(() => {
    const seen = new Set<string>()
    const unique: StampData[] = []

    for (const stamp of stamps) {
      const key = stamp.stampImageUrl || stamp.id
      if (!key || seen.has(key) || key === "/images/stamps/no-image-available.png") continue
      seen.add(key)
      unique.push(stamp)
      if (unique.length >= 18) break
    }

    return unique
  }, [stamps])

  const collageLayout = useMemo(() => {
    const count = collageStamps.length

    if (count === 0) {
      return {
        wrapper: "",
        header: "flex flex-wrap gap-4 items-baseline justify-between",
        headerText: "",
        grid: "grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4",
        card: ""
      }
    }

    if (count === 1) {
      return {
        wrapper: "mx-auto max-w-sm",
        header: "flex flex-col items-center gap-2 text-center",
        headerText: "text-center",
        grid: "grid-cols-1 justify-items-center gap-4",
        card: "w-48 sm:w-56"
      }
    }

    if (count === 2) {
      return {
        wrapper: "mx-auto max-w-2xl",
        header: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 text-center sm:text-left",
        headerText: "text-center sm:text-left",
        grid: "grid-cols-1 sm:grid-cols-2 justify-items-center sm:justify-items-stretch gap-5",
        card: "w-48 sm:w-full"
      }
    }

    if (count === 3) {
      return {
        wrapper: "mx-auto max-w-3xl",
        header: "flex flex-col sm:flex-row sm:flex-wrap sm:items-end sm:justify-between gap-3 text-center sm:text-left",
        headerText: "text-center sm:text-left",
        grid: "grid-cols-1 sm:grid-cols-3 justify-items-center sm:justify-items-stretch gap-5",
        card: "w-48 sm:w-full"
      }
    }

    if (count <= 9) {
      return {
        wrapper: "mx-auto max-w-5xl",
        header: "flex flex-wrap gap-4 items-baseline justify-between",
        headerText: "",
        grid: "grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4",
        card: ""
      }
    }

    return {
      wrapper: "mx-auto max-w-6xl",
      header: "flex flex-wrap gap-4 items-baseline justify-between",
      headerText: "",
      grid: "grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3 sm:gap-4",
      card: ""
    }
  }, [collageStamps.length])

  const primaryStamp = stamps[0]

  if (isLoading) {
    return (
      <div className="mt-4 px-2 sm:px-4">
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200/60 bg-gradient-to-br from-slate-100 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 shadow-sm">
            <Skeleton className="h-56 w-full rounded-3xl" />
          </div>
        </div>
        {/* Mobile Loading Skeleton */}
        <div className="md:hidden space-y-3 mb-6">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-3/4 mb-6" />

          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Skeleton className="h-3 w-8 mb-1" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-3 w-8 mb-1" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Loading Skeleton */}
        <div className="hidden md:block">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-3/4 mb-6" />

          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm max-w-5xl mx-auto rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-400 dark:border-gray-600">
                    <th className="text-left py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"><Skeleton className="h-4 w-16" /></th>
                    <th className="text-left py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"><Skeleton className="h-4 w-32" /></th>
                    <th className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"><Skeleton className="h-4 w-16" /></th>
                    <th className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"><Skeleton className="h-4 w-16" /></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-48" /></td>
                      <td className="py-3 px-4 text-center"><Skeleton className="h-6 w-12 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Skeleton className="h-6 w-12 mx-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {collageStamps.length > 0 && (
        <div className="mb-8">
          <div className={`relative overflow-hidden rounded-lg border border-gray-200/80 dark:border-gray-700/80 shadow-sm ${collageLayout.wrapper}`}>
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.65),_transparent_60%)]" />
            <div className={`relative px-6 pt-6 pb-4 ${collageLayout.header}`}>
              <div className={collageLayout.headerText}>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-50">
                  {paperTypeData.name}
                </h2>
              </div>
            </div>
            <div className="relative px-4 pb-6 sm:px-6">
              <div className={`grid ${collageLayout.grid}`}>
                {collageStamps.map((stamp, index) => {
                  const rotationClasses = [
                    "rotate-[-3deg]",
                    "rotate-[2deg]",
                    "rotate-[1deg]",
                    "rotate-[-1.5deg]",
                    "rotate-[3deg]",
                    "rotate-[-2deg]"
                  ]
                  const offsetClasses = [
                    "translate-y-[6px]",
                    "-translate-y-[4px]",
                    "translate-y-[2px]",
                    "-translate-y-[2px]",
                    "translate-y-[4px]",
                    "-translate-y-[6px]"
                  ]

                  const rotation = rotationClasses[index % rotationClasses.length]
                  const offset = offsetClasses[index % offsetClasses.length]
                  const imageSrc = stamp.stampImageUrl || "/images/stamps/no-image-available.png"

                  return (
                    <div
                      key={stamp.id}
                      className={`relative aspect-[3/4] overflow-hidden rounded-xl border border-white/80 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/90 shadow-lg shadow-slate-200/70 dark:shadow-black/30 transition duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-white/10 dark:from-slate-900/60 dark:to-slate-900/10" />
                      <div className="relative h-full w-full flex items-center justify-center">
                        <Image
                          src={imageSrc}
                          alt={`${stamp.denominationValue}${stamp.denominationSymbol} ${stamp.color}`}
                          width={200}
                          height={260}
                          className="object-contain drop-shadow-xl"
                          loading="lazy"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            e.currentTarget.src = "/images/stamps/no-image-available.png"
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="border rounded-lg dark:border-gray-700 -mx-4 sm:mx-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800 hidden sm:table-row">
              <TableHead className="w-[100px] text-gray-700 dark:text-gray-300">Image</TableHead>
              <TableHead className="text-left py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Description</TableHead>
              <TableHead className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Mint</TableHead>
              <TableHead className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Used</TableHead>
              <TableHead className="w-[60px] text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Actions</TableHead>
            </TableRow>
            <TableRow className="bg-gray-50 dark:bg-gray-800 sm:hidden">
              <TableHead className="text-gray-700 dark:text-gray-300 w-1/2">Description</TableHead>
              <TableHead className="text-center text-gray-700 dark:text-gray-300 w-1/2">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stamps.map((stamp, stampIndex) => {
              const hasInstances = stamp.instances && stamp.instances.length > 0
              const isExpanded = expandedStamps.has(stamp.id)

              return (
                <React.Fragment key={stamp.id}>
                  {/* Main stamp entry */}
                  <TableRow
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${hasInstances ? 'cursor-pointer' : ''}`}
                    onClick={hasInstances ? () => toggleStampExpansion(stamp.id) : () => onStampClick(stamp)}
                  >
                    <TableCell className="py-3 px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        {hasInstances && (
                          <div className="flex items-center justify-center w-5">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                        )}
                        <Image
                          src={stamp.stampImageUrl || "/images/stamps/no-image-available.png"}
                          alt={`${stamp.denominationValue}${stamp.denominationSymbol} ${stamp.color}`}
                          width={50}
                          height={50}
                          objectFit="contain"
                          className="rounded"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            e.currentTarget.src = "/images/stamps/no-image-available.png";
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 font-medium text-black dark:text-gray-100 hidden sm:table-cell">
                      <div className="flex flex-col gap-2">
                        <span className="font-medium">{stamp.name}{stamp.catalogNumber && stamp.catalogNumber !== '-' ? ` (${stamp.catalogNumber})` : ''}</span>
                      </div>
                    </TableCell>
                  <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                      {stamp.mintValue ? `$${stamp.mintValue.toFixed(2)}` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                      {stamp.usedValue ? `$${stamp.usedValue.toFixed(2)}` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStampClick(stamp);
                      }}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors group"
                      title="View stamp details"
                    >
                      <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                    </button>
                  </TableCell>
                  <TableCell className="py-3 px-4 sm:hidden w-1/2">
                    <div className="flex items-center gap-2">
                      {hasInstances && (
                        <div className="flex items-center justify-center w-4">
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                          )}
                        </div>
                      )}
                      <Image
                        src={stamp.stampImageUrl || "/images/stamps/no-image-available.png"}
                        alt={`${stamp.denominationValue}${stamp.denominationSymbol} ${stamp.color}`}
                        width={40}
                        height={40}
                        objectFit="contain"
                        className="rounded"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          e.currentTarget.src = "/images/stamps/no-image-available.png";
                        }}
                      />
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center gap-1">
                          {hasInstances && (
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              Parent
                            </span>
                          )}
                          <span className="font-medium text-black dark:text-gray-100 text-sm truncate flex-1">
                            {stamp.denominationValue}{stamp.denominationSymbol} {stamp.color}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">
                            {stamp.name}{stamp.catalogNumber && stamp.catalogNumber !== '-' ? ` (${stamp.catalogNumber})` : ''}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStampClick(stamp);
                            }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors group flex-shrink-0"
                            title="View stamp details"
                          >
                            <Eye className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 sm:hidden w-1/2 text-right">
                    <div className="text-sm mb-1">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                        Mint: {stamp.mintValue ? `$${stamp.mintValue.toFixed(2)}` : '-'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                        Used: {stamp.usedValue ? `$${stamp.usedValue.toFixed(2)}` : '-'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>

                  {/* Instances as indented table rows */}
                  {hasInstances && isExpanded && stamp.instances.map((instance, instanceIndex) => (
                    <TableRow
                      key={instance.id}
                      className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-25 dark:hover:bg-gray-800/50 transition-colors ${instanceIndex === stamp.instances.length - 1 ? 'border-b-0' : ''}`}
                    >
                      <TableCell className="py-3 px-4 hidden sm:table-cell">
                        <div className="flex items-center gap-3 pl-8">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-px bg-gray-300 dark:bg-gray-600"></div>
                            <div className="w-1.5 h-1.5 bg-orange-400 dark:bg-orange-500 rounded-full"></div>
                            <div className="w-3 h-px bg-gray-300 dark:bg-gray-600"></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200 hidden sm:table-cell">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50 px-2 py-0.5 rounded-full">
                            Variety
                          </span>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{(instance as any).name && `${(instance as any).name} ${(instance as any).catalogNumber && (instance as any).catalogNumber !== '-' ? ` (${(instance as any).catalogNumber})` : ''}`}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                        <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded dark:bg-green-900 dark:text-green-200">
                          {instance.mintValue ? `$${Number(instance.mintValue).toFixed(2)}` : '-'}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded dark:bg-blue-900 dark:text-blue-200">
                          {instance.usedValue ? `$${Number(instance.usedValue).toFixed(2)}` : '-'}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                        {/* Instances don't have individual detail views */}
                      </TableCell>
                      <TableCell className="py-3 px-4 sm:hidden w-1/2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 pl-4">
                            <div className="w-2 h-px bg-gray-300 dark:bg-gray-600"></div>
                            <div className="w-1 h-1 bg-blue-400 dark:bg-blue-500 rounded-full"></div>
                            <div className="w-2 h-px bg-gray-300 dark:bg-gray-600"></div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded-full">
                                Var {instanceIndex + 1}
                              </span>
                              <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                                {(instance as any).name && `${(instance as any).name} ${(instance as any).catalogNumber && (instance as any).catalogNumber !== '-' ? ` (${(instance as any).catalogNumber})` : ''}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 sm:hidden w-1/2 text-right">
                        <div className="space-y-1">
                          <div className="text-xs">
                            <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded dark:bg-green-900 dark:text-green-200">
                              Mint: {instance.mintValue ? `$${Number(instance.mintValue).toFixed(2)}` : '-'}
                            </span>
                          </div>
                          <div className="text-xs">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded dark:bg-blue-900 dark:text-blue-200">
                              Used: {instance.usedValue ? `$${Number(instance.usedValue).toFixed(2)}` : '-'}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {stamps.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No stamps found for this paper type.</p>
        </div>
      )}
    </div>
  )
} 
