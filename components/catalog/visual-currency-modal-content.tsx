import React, { useState, useMemo } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Archive, ChevronRight, Coins, Search } from "lucide-react"
import { CurrencyOption, YearOption } from "@/types/catalog"
import { useCatalogData } from "@/lib/context/catalog-data-context"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton";

interface CurrencyModalContentProps {
  data: { year: YearOption, currencies: CurrencyOption[], countryCode: string, seriesName: string }
  onCurrencyClick: (currency: CurrencyOption) => void
  isLoading: boolean;
}

export function CurrencyModalContent({
  data,
  onCurrencyClick,
  isLoading
}: CurrencyModalContentProps) {
  const { stamps } = useCatalogData()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) return data.currencies

    return data.currencies.filter(currency =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data.currencies, searchTerm])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md mx-auto" />
        <div className="w-full overflow-x-auto">
          <div className="bg-card rounded-lg border border-border shadow-sm w-full">
            <div className="border-b border-border bg-muted/50 px-4 py-2">
              <div className="grid grid-cols-6 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <Skeleton className="h-4 w-10 col-span-1 hidden sm:block" />
                <Skeleton className="h-4 w-1/2 col-span-2" />
                <Skeleton className="h-4 w-1/2 col-span-1" />
                <Skeleton className="h-4 w-1/2 col-span-1 hidden sm:block" />
                <Skeleton className="h-4 w-1/2 col-span-1" />
                <Skeleton className="h-4 w-4 col-span-1 hidden sm:block" />
              </div>
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="grid grid-cols-6 gap-4 items-center text-sm">
                    <Skeleton className="h-8 w-8 rounded-full col-span-1 hidden sm:flex" />
                    <Skeleton className="h-4 w-3/4 col-span-2" />
                    <Skeleton className="h-4 w-1/2 col-span-1 hidden sm:block" />
                    <Skeleton className="h-4 w-1/2 col-span-1 hidden sm:block" />
                    <Skeleton className="h-4 w-1/3 col-span-1" />
                    <Skeleton className="h-4 w-4 col-span-1 hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search currencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background text-foreground border border-input focus:border-primary"
        />
      </div>

      <div className="w-full overflow-x-auto">
                  <div className="bg-card rounded-lg border border-border shadow-sm w-full min-w-[700px]">
            {/* Currencies Table Header */}
            <div className="border-b border-border bg-muted/50 px-4 py-2">
              <div className="grid grid-cols-9 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <div className="col-span-1 text-center">Image</div>
                <div className="col-span-2 text-left">Currency</div>
                <div className="col-span-2 text-center">Code</div>
                <div className="col-span-1 text-center">Symbol</div>
                <div className="col-span-1 text-right">Stamps</div>
                <div className="col-span-1 text-right"></div>
                <div className="col-span-1 text-right"></div>
              </div>
            </div>

          {/* Currencies Rows */}
          <div className="divide-y divide-border">
            {filteredCurrencies.map((currency) => (
              <div
                key={currency.code}
                className="cursor-pointer px-4 py-3 hover:bg-muted/70 transition-colors"
                onClick={() => onCurrencyClick(currency)}
              >
                <div className="grid grid-cols-9 gap-4 items-center text-sm">
                  <div className="col-span-1 text-center">
                    <Image
                      src={currency.featuredStampUrl || '/images/stamps/no-image-available.png'}
                      alt={`${currency.name} stamps`}
                      width={40}
                      height={50}
                      className="rounded border border-border mx-auto"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== '/images/stamps/no-image-available.png') {
                          target.src = '/images/stamps/no-image-available.png';
                        }
                      }}
                    />
                  </div>
                  <div className="col-span-2 font-semibold text-foreground">
                    <div className="flex flex-col">
                      <span className="font-bold">{currency.name}</span>
                      <span className="text-xs text-muted-foreground sm:hidden">
                        {currency.symbol} • {currency.code}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <Badge variant="outline">{currency.code}</Badge>
                  </div>
                  <div className="col-span-1 font-mono text-foreground text-center">
                    {currency.symbol}
                  </div>
                  <div className="col-span-1 text-right font-medium text-muted-foreground">
                    <div className="flex items-center justify-end space-x-1">
                      <Archive className="h-4 w-4 text-muted-foreground" />
                      <span>{currency.totalStamps}</span>
                    </div>
                  </div>
                  <div className="col-span-1 text-right flex justify-end">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Coins className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="col-span-1 text-right flex justify-end">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
