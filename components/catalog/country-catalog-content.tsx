"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import ReactCountryFlag from "react-country-flag"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronRight, Quote } from "lucide-react"

import { CountryOption } from "@/types/catalog"
import isoCountries from "i18n-iso-countries"
import enLocale from "i18n-iso-countries/langs/en.json"
import { CountryCatalogSkeleton } from "./investigate-search/loading-skeletons"

isoCountries.registerLocale(enLocale as any)

type CountryCatalogContentProps = {
  countries: CountryOption[]
  onCountryClick: (country: CountryOption) => void
  loading?: boolean
}

export function CountryCatalogContent({ countries, onCountryClick, loading = false }: CountryCatalogContentProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries
    const term = searchTerm.toLowerCase()
    return countries.filter((country) =>
      (country.name && country.name.toLowerCase().includes(term)) ||
      country.description?.toLowerCase().includes(term) ||
      country.code.toLowerCase().includes(term)
    )
  }, [searchTerm, countries])

  if (loading) {
    return <CountryCatalogSkeleton />
  }

  return (
    <section>
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Explore by Country</h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Browse our premium catalog of stamps organized by country. Each collection features stamps that have earned collector approval through careful authentication and grading.
        </p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <Input
          type="text"
          placeholder="Search countries..."
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-primary dark:focus:ring-amber-500 focus:border-transparent transition-all duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {filteredCountries.map((country) => {
          const countriesForFlag = country.name && country.name.includes(',') ? country.name.split(',').map(c => c.trim()) : [country.name || '']
          const countryCodes: string[] = []
          countriesForFlag.forEach(country => {
            countryCodes.push(isoCountries.getAlpha2Code(country, "en") || "")
          })
          return <article
            key={country.code}
            className="group cursor-pointer"
            onClick={() => onCountryClick(country)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] dark:bg-gray-800 dark:border-gray-700">
              <div className="relative h-56 overflow-hidden w-full">
                <Image
                  src={country.featuredStampUrl || "/images/stamps/no-image-available.png"}
                  alt={`Premium stamps from ${country.name || 'Unknown Country'}`}
                  fill
                  className="object-contain transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    if (target.src !== "/images/stamps/no-image-available.png") {
                      target.src = "/images/stamps/no-image-available.png"
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Badge className="bg-primary text-white border-white/30 text-xs font-medium">
                      {country.totalStamps.toLocaleString()} stamps
                    </Badge>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 px-4 py-2 rounded-lg bg-black/30 backdrop-blur-sm">
                  <h3 className="text-xl font-extrabold text-white leading-tight mb-0.5 flex items-center">
                    {countryCodes.map((code) => (
                      <>
                        {code ?
                          <ReactCountryFlag
                            countryCode={code.toUpperCase()}
                            svg
                            style={{
                              width: '1.2em',
                              height: '1.2em',
                              marginRight: '0.5em',
                            }}
                            title={country.name || 'Unknown Country'}
                            className="rounded-sm"
                          /> : <></>}
                      </>
                    ))}
                    {country.name || 'Unknown Country'}
                  </h3>
                  <p className="text-gray-200 text-sm line-clamp-2">{country.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-300 text-xs font-medium">
                      {country.firstIssue} - {country.lastIssue}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 pt-2">
                <p className="text-gray-600 text-xs italic mb-2.5 relative dark:text-gray-300 line-clamp-3">
                  <Quote className="w-2.5 h-2.5 text-primary dark:text-amber-400 absolute -top-0.5 -left-0.5 opacity-60" />
                  <span className="ml-3.5">{country.historicalNote}</span>
                </p>

                <div className="flex items-center justify-between mt-2.5">
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900 group-hover:scale-105 transition-transform duration-300 px-2.5 py-0.5 text-xs h-auto">
                    Browse Catalog
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </div>
          </article>
        })}
      </div>

      {filteredCountries.length === 0 && searchTerm && (
        <div className="text-center py-12 md:py-16">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Catalogs Found</h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            We couldn't find any countries matching your search. Try a different term or explore our featured collections.
          </p>
        </div>
      )}
    </section>
  )
}


