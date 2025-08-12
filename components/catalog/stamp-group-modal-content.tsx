import React from "react"
import { StampGroupData, StampData } from "@/types/catalog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { getStampsForStampGroup } from "@/lib/data/list-catalog-data"
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
  
  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-6" />

        <div className="border rounded-lg overflow-hidden dark:border-gray-700 w-full sm:w-auto">
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
      <p className="text-gray-700 dark:text-gray-300 mb-4">{stampGroupData.description}</p>

      <div className="border rounded-lg overflow-hidden dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800 hidden sm:table-row">
              <TableHead className="w-[100px] text-gray-700 dark:text-gray-300">Image</TableHead>
              <TableHead className="text-left py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Description</TableHead>
              <TableHead className="text-center py-3 px-4 font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Mint</TableHead>
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
                  <TableCell className="py-3 px-4 font-medium text-black dark:text-gray-100 flex flex-col gap-2">
                    <span className="font-medium">{stamp.name}</span>
                    <span className="text-gray-500 dark:text-gray-400"> {(stamp as any).description}</span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                      {stamp.estimatedMarketValue ? `$${stamp.estimatedMarketValue.toFixed(2)}` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center hidden sm:table-cell">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                      {stamp.actualPrice ? `$${stamp.actualPrice.toFixed(2)}` : '-'}
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
                      <span className="font-medium text-black dark:text-gray-100 text-sm">
                        {stamp.denominationValue}{stamp.denominationSymbol} {stamp.color}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 sm:hidden w-1/2 text-right">
                    <div className="text-sm mb-1">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                        Mint: {stamp.estimatedMarketValue ? `$${stamp.estimatedMarketValue.toFixed(2)}` : '-'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded dark:bg-gray-700 dark:text-gray-200">
                        Used: {stamp.actualPrice ? `$${stamp.actualPrice.toFixed(2)}` : '-'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                
                {/* Varieties/instances listed as separate rows with indentation */}
                {stamp.instances && stamp.instances.map((instance) => (
                  <TableRow 
                    key={instance.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => onStampClick(instance as unknown as StampData)}
                  >
                    <TableCell className="py-2 px-4 text-xs text-gray-600 dark:text-gray-400 hidden sm:table-cell"></TableCell>
                    <TableCell className="py-2 px-4 text-xs text-gray-700 dark:text-gray-300 pl-8 flex flex-col gap-2">
                      <span>{(instance as any).name && `${(instance as any).name}`}</span>
                      <span className="text-gray-500 dark:text-gray-400"> {instance.description}</span>
                    </TableCell>
                    <TableCell className="py-2 px-4 text-center text-xs hidden sm:table-cell">
                      {instance.mintValue ? (
                        <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                          {instance.mintValue}
                        </span>
                      ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                    </TableCell>
                    <TableCell className="py-2 px-4 text-center text-xs hidden sm:table-cell">
                      {instance.usedValue ? (
                        <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                          {instance.usedValue}
                        </span>
                      ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                    </TableCell>
                    <TableCell className="py-2 px-4 sm:hidden w-1/2">
                      <span className="text-xs text-gray-700 dark:text-gray-300">
                        {instance.code && `${instance.code}. `}{instance.description}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-4 sm:hidden w-1/2 text-right">
                      <div className="text-xs mb-1">
                        {instance.mintValue ? (
                          <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                            Mint: {instance.mintValue}
                          </span>
                        ) : <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">-</span>}
                      </div>
                      <div className="text-xs">
                        {instance.usedValue ? (
                          <span className={`px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200`}>
                            Used: {instance.usedValue}
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
