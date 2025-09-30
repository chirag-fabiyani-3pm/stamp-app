import React, { useState, useMemo } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { BookOpen, Search } from "lucide-react"
import { PaperTypeData, StampData } from "@/types/catalog"
import { Skeleton } from "@/components/ui/skeleton"

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
  const [searchTerm, setSearchTerm] = useState("")

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

  const filteredStamps = useMemo(() => {
    if (!searchTerm) return stamps

    return stamps.filter(
      (stamp) =>
        stamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stamp.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stamp.color.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [stamps, searchTerm])

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
    <div className="mt-4 px-2 sm:px-4">
      {collageStamps.length > 0 && (
        <div className="mb-6 sm:mb-8">
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
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        {/* Search Controls */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search stamps by name, catalog number, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:focus:border-amber-600 text-sm h-10 sm:h-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Card Layout (hidden on md+) */}
      <div className="md:hidden space-y-3 mb-6">
        {filteredStamps.map((stamp, index) => (
          <React.Fragment key={stamp.id}>
            {/* Main stamp card */}
            <div
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onStampClick(stamp)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm font-medium min-w-fit">
                      #{index + 1}
                    </span>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {stamp.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {(stamp as any).description && (stamp as any).description !== 'N/A' ? (stamp as any).description : 'Stamps with Unknown Description'}
                  </p>
                </div>
              </div>

              {/* Price section */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Mint</span>
                  <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-1 text-sm font-medium rounded">
                    {stamp.mintValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stamp.mintValue) : '-'}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Used</span>
                  <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 text-sm font-medium rounded">
                    {stamp.usedValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stamp.usedValue) : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Varieties/instances as separate cards */}
            {stamp.instances && stamp.instances.map((instance) => (
              <div
                key={instance.id}
                className="bg-gray-50 dark:bg-gray-800 border-l-4 border-l-gray-400 dark:border-l-gray-600 rounded-lg p-3 ml-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
                      {(instance as any).name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {instance.description && instance.description !== 'N/A' ? instance.description : 'Stamps with Unknown Description'}
                    </p>
                  </div>
                </div>

                {/* Price section for instances */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Mint</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${instance.mintValue ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                      {instance.mintValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format((instance as any).mintValue) : '-'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Used</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${instance.usedValue ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                      {instance.usedValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format((instance as any).usedValue) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Desktop Table Layout (hidden on mobile) */}
      <div className="hidden md:block bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm mb-8 max-w-5xl mx-auto rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Table Header */}
            <thead>
              <tr className="border-b-2 border-gray-400 dark:border-gray-600">
                <th className="text-left py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">SR No.</th>
                <th className="text-left py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Description</th>
                <th className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Mint</th>
                <th className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Used</th>
              </tr>
            </thead>
            <tbody>
              {filteredStamps.map((stamp, index) => {
                return (
                  <React.Fragment key={stamp.id}>
                    {/* Main stamp entry */}
                    <tr
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => onStampClick(stamp)}
                    >
                      <td className="py-3 px-4 font-medium text-black dark:text-gray-100">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-black dark:text-gray-100 flex flex-col gap-2">
                        <span className="font-medium">{stamp.name}</span>
                        <span className="text-gray-600 dark:text-gray-400 block">
                          {(stamp as any).description && (stamp as any).description !== 'N/A' ? (stamp as any).description : 'Stamps with Unknown Description'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                          {stamp.mintValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stamp.mintValue) : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                          {stamp.usedValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(stamp.usedValue) : '-'}
                        </span>
                      </td>
                    </tr>

                    {/* Varieties/instances listed as separate rows with indentation */}
                    {stamp.instances && stamp.instances.map((instance) => (
                      <tr
                        key={instance.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="py-2 px-4 text-xs text-gray-600 dark:text-gray-400"></td>
                        <td className="py-2 px-4 text-xs text-gray-700 dark:text-gray-300 pl-8 flex flex-col gap-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {(instance as any).name}
                          </span>
                          <span>
                            {instance.description && instance.description !== 'N/A' ? instance.description : 'Stamps with Unknown Description'}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center text-xs">
                          {instance.mintValue ? (
                            <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                              {instance.mintValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format((instance as any).mintValue) : '-'}
                            </span>
                          ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                        </td>
                        <td className="py-2 px-4 text-center text-xs">
                          {instance.usedValue ? (
                            <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                              {instance.usedValue ? new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format((instance as any).usedValue) : '-'}
                            </span>
                          ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStamps.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 dark:text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            No stamps found
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
} 
