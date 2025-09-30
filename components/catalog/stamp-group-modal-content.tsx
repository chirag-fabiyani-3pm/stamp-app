import React from "react"
import { StampGroupData, StampData } from "@/types/catalog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton";

interface StampGroupModalContentProps {
  stampGroupData: StampGroupData
  stamps: StampData[]
  onStampClick: (stamp: StampData) => void
  isLoading: boolean;
}

export function StampGroupModalContent({
  stampGroupData,
  stamps,
  onStampClick,
  isLoading
}: StampGroupModalContentProps) {
  const collageStamps = React.useMemo(() => {
    const seen = new Set<string>()
    const unique: StampData[] = []

    for (const stamp of stamps) {
      const key = stamp.stampImageUrl || stamp.id
      if (!key || seen.has(key) || key === '/images/stamps/no-image-available.png') continue
      seen.add(key)
      unique.push(stamp)
      if (unique.length >= 18) break
    }

    return unique
  }, [stamps])

  const collageLayout = React.useMemo(() => {
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
      <div className="p-4">
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200/60 bg-gradient-to-br from-slate-100 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 shadow-sm">
            <Skeleton className="h-56 w-full rounded-3xl" />
          </div>
        </div>
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-6" />

        <div className="border rounded-lg dark:border-gray-700 -mx-4 sm:mx-0 overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800 hidden sm:table-row">
                <TableHead className="w-[100px] text-gray-700 dark:text-gray-300"><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead className="text-left py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"><Skeleton className="h-4 w-32" /></TableHead>
                <TableHead className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"><Skeleton className="h-4 w-16" /></TableHead>
              </TableRow>
              <TableRow className="bg-gray-50 dark:bg-gray-800 sm:hidden">
                <TableHead className="text-gray-700 dark:text-gray-300 w-1/2"><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead className="text-center text-gray-700 dark:text-gray-300 w-1/2"><Skeleton className="h-4 w-16" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <React.Fragment key={i}>
                  <TableRow className="border-b border-gray-200 dark:border-gray-700 hidden sm:table-row">
                    <TableCell className="py-3 px-4"><Skeleton className="h-12 w-12 rounded" /></TableCell>
                    <TableCell className="py-3 px-4"><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell className="py-3 px-4 text-center"><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                    <TableCell className="py-3 px-4 text-center"><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                  </TableRow>
                  <TableRow key={`mobile-${i}`} className="border-b border-gray-200 dark:border-gray-700 sm:hidden">
                    <TableCell className="py-3 px-4 w-1/2">
                      <Skeleton className="h-12 w-12 rounded mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell className="py-3 px-4 w-1/2 text-right">
                      <Skeleton className="h-6 w-12 mx-auto mb-2" />
                      <Skeleton className="h-6 w-12 mx-auto" />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
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
                   {primaryStamp?.seriesName ?? stampGroupData.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {stampGroupData.printingMethod} · {stampGroupData.perforation} · {stampGroupData.totalStamps} stamp{stampGroupData.totalStamps === 1 ? "" : "s"}
                </p>
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
                      className={`relative aspect-[3/4] overflow-hidden rounded-xl border border-white/80 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/90 shadow-lg shadow-slate-200/70 dark:shadow-black/30 transition duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl ${rotation} ${offset} ${collageLayout.card}`}
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
              <TableHead className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Finest Used</TableHead>
              <TableHead className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Used</TableHead>
            </TableRow>
            <TableRow className="bg-gray-50 dark:bg-gray-800 sm:hidden">
              <TableHead className="text-gray-700 dark:text-gray-300 w-1/2">Description</TableHead>
              <TableHead className="text-center text-gray-700 dark:text-gray-300 w-1/2">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stamps.map((stamp) => (
              <React.Fragment key={stamp.id}>
                {/* Main stamp entry */}
                <TableRow 
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => onStampClick(stamp)}
                >
                  <TableCell className="py-3 px-4 hidden sm:table-cell">
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
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium text-black dark:text-gray-100 hidden sm:table-cell">
                    <div className="flex flex-col gap-2">
                      <span className="font-medium">{stamp.name}{stamp.catalogNumber ? ` (${stamp.catalogNumber})` : ''}</span>
                      <span className="text-gray-500 dark:text-gray-400"> {(stamp as any).description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                      {stamp.mintValue ? `$${stamp.mintValue.toFixed(2)}` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                      {stamp.finestUsedValue ? `$${stamp.finestUsedValue.toFixed(2)}` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                      {stamp.usedValue ? `$${stamp.usedValue.toFixed(2)}` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 sm:hidden w-1/2">
                    <div className="flex items-center gap-2">
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
                      <span className="font-medium text-black dark:text-gray-100 text-sm truncate">
                        {stamp.denominationValue}{stamp.denominationSymbol} {stamp.color}
                      </span>
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
                        Finest Used: {stamp.finestUsedValue ? `$${stamp.finestUsedValue.toFixed(2)}` : '-'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                        Used: {stamp.usedValue ? `$${stamp.usedValue.toFixed(2)}` : '-'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Varieties/instances listed as separate rows with indentation */}
                {stamp.instances && stamp.instances.map((instance) => (
                  <TableRow 
                    key={instance.id}
                    className="border-b border-gray-100 dark:border-gray-800 transition-colors"
                  >
                    <TableCell className="py-2 px-4 text-xs text-gray-600 dark:text-gray-400 hidden sm:table-cell"></TableCell>
                    <TableCell className="py-2 px-4 text-xs text-gray-700 dark:text-gray-300 pl-8 hidden sm:table-cell">
                      <div className="flex flex-col gap-2">
                        <span>{(instance as any).name && `${(instance as any).name} ${(instance as any).catalogNumber && (instance as any).catalogNumber !== '-' ? ` (${(instance as any).catalogNumber})` : ''}`}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 px-4 text-center text-xs hidden sm:table-cell">
                      {instance.mintValue ? (
                        <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                          ${instance.mintValue}
                        </span>
                      ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                    </TableCell>
                    <TableCell className="py-2 px-4 text-center text-xs hidden sm:table-cell">
                      {instance.finestUsedValue ? (
                        <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                          ${instance.finestUsedValue}
                        </span>
                      ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                    </TableCell>
                    <TableCell className="py-2 px-4 text-center text-xs hidden sm:table-cell">
                      {instance.usedValue ? (
                        <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                          ${instance.usedValue}
                        </span>
                      ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                    </TableCell>
                    <TableCell className="py-2 px-4 sm:hidden w-1/2">
                      <span className="text-xs text-gray-700 dark:text-gray-300">
                      <span>{(instance as any).name && `${(instance as any).name} ${(instance as any).catalogNumber && (instance as any).catalogNumber !== '-' ? ` (${(instance as any).catalogNumber})` : ''}`}</span>
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-4 sm:hidden w-1/2 text-right">
                      <div className="text-xs mb-1">
                        {instance.mintValue ? (
                          <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                            Mint: ${instance.mintValue}
                          </span>
                        ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                      </div>
                      <div className="text-xs">
                        {instance.finestUsedValue ? (
                          <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                            Finest Used: ${instance.finestUsedValue}
                          </span>
                        ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                      </div>
                      <div className="text-xs">
                        {instance.usedValue ? (
                          <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                            Used: ${instance.usedValue}
                          </span>
                        ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {stamps.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No stamps found for this stamp group.</p>
        </div>
      )}
    </div>
  )
} 
