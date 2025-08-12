"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import ReactCountryFlag from "react-country-flag"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronRight, BookmarkPlus, Quote, Award, Telescope } from "lucide-react"

import { CountryOption } from "@/types/catalog"

type CountryCatalogContentProps = {
  countries: CountryOption[]
  onCountryClick: (country: CountryOption) => void
}

export function CountryCatalogContent({ countries, onCountryClick }: CountryCatalogContentProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries
    const term = searchTerm.toLowerCase()
    return countries.filter((country) =>
      country.name.toLowerCase().includes(term) ||
      country.description?.toLowerCase().includes(term) ||
      country.code.toLowerCase().includes(term)
    )
  }, [searchTerm, countries])

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredCountries.map((country) => (
          <article
            key={country.code}
            className="group cursor-pointer"
            onClick={() => onCountryClick(country)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] dark:bg-gray-800 dark:border-gray-700">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={country.featuredStampUrl || "/images/stamps/no-image-available.png"}
                  alt={`Premium stamps from ${country.name}`}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div className="absolute top-4 left-4">
                  <div className="flex items-center space-x-2">
                    <ReactCountryFlag countryCode={country.code} svg />
                    <Badge className="bg-white/20 backdrop-blur text-white border-white/30">
                      {country.totalStamps.toLocaleString()} stamps
                    </Badge>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{country.name}</h3>
                  <p className="text-gray-200 text-sm mb-3">{country.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">
                      {country.firstIssue} - {country.lastIssue}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-primary dark:text-amber-400" />
                      <span className="text-primary text-sm font-medium dark:text-amber-400">Approved Collection</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <blockquote className="text-gray-600 italic mb-4 relative dark:text-gray-300">
                  <Quote className="w-4 h-4 text-primary dark:text-amber-400 absolute -top-1 -left-1" />
                  <span className="ml-3">{country.historicalNote}</span>
                </blockquote>

                <div className="flex items-center justify-between">
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900">
                    Browse Catalog
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                  <div className="flex items-center space-x-1">
                    <BookmarkPlus className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity dark:text-gray-600 dark:group-hover:text-gray-400" />
                    <Telescope className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity dark:text-gray-600 dark:group-hover:text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
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


