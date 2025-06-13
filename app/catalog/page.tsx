"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StampCard } from "@/components/catalog/stamp-card"
import { Search, Filter, ChevronDown, ChevronRight, Loader2, Eye } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { SOACode } from "@/components/catalog/soa-code"
import { StampTree, StampDetailModal } from '@/components/catalog/stamp-tree'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { AuthGuard } from "@/components/auth/route-guard"

// API Types based on the provided structure
interface ApiStamp {
  id: string
  catalogId: string
  name: string
  publisher: string
  country: string
  stampImageUrl: string
  catalogName: string
  catalogNumber: string
  seriesName: string
  issueDate: string
  denominationValue: number
  denominationCurrency: string
  denominationSymbol: string
  color: string
  design: string
  theme: string
  artist: string
  engraver: string
  printing: string
  paperType: string
  perforation: string
  size: string
  specialNotes: string
  historicalContext: string
  printingQuantity: number
  usagePeriod: string
  rarenessLevel: string
  hasGum: boolean
  gumCondition: string
  description: string
  watermark: string | null
}

interface ApiHierarchy {
  key: string
  stamps: ApiStamp[]
}

interface ApiSeries {
  items: {
    seriesName: string
    hierarchies: ApiHierarchy[]
  }[]
}

interface ApiPaginatedResponse {
  items: {
    seriesName: string
    hierarchies: ApiHierarchy[]
  }[]
  hasNextPage: boolean
  hasPreviousPage: boolean
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}

// Transformed types for internal use
interface TransformedStamp {
  id: string
  name: string
  imagePath: string
  position: string
  description: string
  colorNumber?: number
  colorName: string
  year: string
  denomination: string
            catalogNumbers: {
    soa?: number
    sg?: string
    scott?: string
    michel?: string
  }
  marketValue?: string
  features: string[]
  printingMethod: string
  paper: string
  country: string
  issueSeries: string
  code: string
  varieties: { name: string; description: string }[]
  watermarkType?: string
  cancellation?: string
  collectorGroup?: string
  rarityRating: string
  grade?: string
  notes: string
  // Additional properties to match Stamp interface
  errors?: string[]
  catalogSystems?: Record<string, { code: string; notes?: string }>
  specializedCatalogs?: { name: string; description: string; countrySpecific?: boolean }[]
  certifier?: string
  itemType?: string
  perforationType?: string
  plates?: string
  plating?: {
    positionNumber?: string
    gridReference?: string
    flawDescription?: string
    textOnFace?: string
    plateNumber?: string
    settingNumber?: string
    textColor?: string
    flawImage?: string | null
  }
  purchasePrice?: string
  purchaseDate?: string
  visualAppeal?: number
}

interface DenominationHierarchy {
  key: string
  denominationValue: number
  denominationSymbol: string
  varieties: TransformedStamp[]
}

interface SeriesGroup {
  id: string
  seriesName: string
  description: string
  image: string
  country: string
  yearRange: string
  totalStamps: number
  hierarchies: DenominationHierarchy[]
}

// Helper function to get JWT from cookies or localStorage
const getJWT = (): string | null => {
  // Try to get from localStorage first
  if (typeof window !== 'undefined') {
    try {
      const stampUserData = localStorage.getItem('stamp_user_data');
      if (stampUserData) {
        const userData = JSON.parse(stampUserData);
        if (userData && userData.jwt) {
          return userData.jwt;
        }
      }
    } catch (error) {
      console.error('Error parsing stamp_user_data from localStorage:', error);
    }

    // Try to get from cookies
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'stamp_jwt') {
        return value;
      }
    }
  }
  return null;
};

// Helper function to transform API stamp to internal format
const transformStamp = (apiStamp: ApiStamp, position: string = "variety"): TransformedStamp => {
  return {
    id: apiStamp.id,
    name: apiStamp.name,
    imagePath: apiStamp.stampImageUrl,
    position,
    description: apiStamp.description,
    colorName: apiStamp.color,
    year: new Date(apiStamp.issueDate).getFullYear().toString(),
    denomination: `${apiStamp.denominationValue}${apiStamp.denominationSymbol}`,
            catalogNumbers: {
      sg: apiStamp.catalogNumber || undefined,
    },
    features: [
      ...(apiStamp.perforation ? [apiStamp.perforation] : []),
      ...(apiStamp.watermark ? ['Watermark'] : []),
      ...(apiStamp.hasGum ? ['Original Gum'] : []),
    ],
    printingMethod: apiStamp.printing,
    paper: apiStamp.paperType,
    country: apiStamp.country,
    issueSeries: apiStamp.seriesName,
    code: apiStamp.catalogId,
        varieties: [
      { name: "Color", description: apiStamp.color },
      { name: "Design", description: apiStamp.design },
      { name: "Theme", description: apiStamp.theme },
    ],
    watermarkType: apiStamp.watermark || undefined,
    collectorGroup: apiStamp.theme,
    rarityRating: apiStamp.rarenessLevel,
    notes: apiStamp.specialNotes + (apiStamp.historicalContext ? ` | ${apiStamp.historicalContext}` : ''),
  };
};

// Helper function to create dynamic accordion data
const createAccordionData = (seriesGroup: SeriesGroup) => {
  const totalStamps = seriesGroup.hierarchies.reduce((total, hierarchy) => 
    total + hierarchy.varieties.length, 0);
  
  const allStamps = seriesGroup.hierarchies.flatMap(h => h.varieties);
  const firstStamp = allStamps[0];
  
  return {
    country: firstStamp?.country || "Unknown",
    years: seriesGroup.yearRange,
    description: `${seriesGroup.seriesName} series with ${seriesGroup.hierarchies.length} denominations and ${totalStamps} total stamps`,
    stampCount: totalStamps,
    denominationCount: seriesGroup.hierarchies.length,
    types: `${seriesGroup.hierarchies.length} denominations: ${seriesGroup.hierarchies.map(h => h.key).join(", ")}`,
    // Additional dynamic data
    printingMethods: Array.from(new Set(allStamps.map(s => s.printingMethod))),
    colors: Array.from(new Set(allStamps.map(s => s.colorName))),
    features: Array.from(new Set(allStamps.flatMap(s => s.features))),
    themes: Array.from(new Set(allStamps.map(s => s.collectorGroup).filter(Boolean))),
  };
};

// Helper function to organize API data into series groups
const organizeStampsBySeries = (apiData: ApiSeries): SeriesGroup[] => {
  return apiData.items.map(series => {
    const hierarchies: DenominationHierarchy[] = series.hierarchies.map(hierarchy => {
      const stamps = hierarchy.stamps.map(stamp => transformStamp(stamp, "variety"));
      
      // All stamps go into varieties array
      const varieties = stamps;
      
      // Extract denomination info from the first stamp
      const firstStamp = hierarchy.stamps[0];
      
      return {
        key: hierarchy.key,
        denominationValue: firstStamp.denominationValue,
        denominationSymbol: firstStamp.denominationSymbol,
        varieties,
      };
    });

    // Get year range from all stamps in the series
    const allStamps = series.hierarchies.flatMap(h => h.stamps);
    const years = allStamps.map(s => new Date(s.issueDate).getFullYear());
    const yearRange = years.length > 1 ? `${Math.min(...years)}-${Math.max(...years)}` : years[0]?.toString() || "Unknown";

    // Get series image from first available stamp
    const firstStamp = allStamps[0];
      
      return {
      id: series.seriesName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      seriesName: series.seriesName,
      description: firstStamp?.description || `${series.seriesName} stamp series`,
      image: firstStamp?.stampImageUrl || '',
      country: firstStamp?.country || 'Unknown',
      yearRange,
      totalStamps: allStamps.length,
      hierarchies,
    };
  });
};

// New Hierarchical Tree interfaces and types
interface TreeNode {
  id: string
  catalogNumber: string
  stamp: TransformedStamp
  children: TreeNode[]
  level: number
  position: { row: number; col: number }
  isExpanded: boolean
}

interface HierarchicalTreeProps {
  seriesGroup: SeriesGroup
  onStampClick: (stamp: TransformedStamp) => void
}

// New Hierarchical Tree Component with improved UI matching current theme
function HierarchicalTreeView({ seriesGroup, onStampClick }: HierarchicalTreeProps) {
  const [expandedHierarchies, setExpandedHierarchies] = useState<Set<string>>(new Set());
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const [seriesSearchTerm, setSeriesSearchTerm] = useState("");
  const [currentDenominationPage, setCurrentDenominationPage] = useState(1);
  const [denominationsPerPage] = useState(10);
  const [showAllDenominations, setShowAllDenominations] = useState(false);
  const [selectedDenominationFilter, setSelectedDenominationFilter] = useState("all");
  
  const toggleHierarchyExpansion = (hierarchyKey: string) => {
    setExpandedHierarchies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hierarchyKey)) {
        newSet.delete(hierarchyKey);
      } else {
        newSet.add(hierarchyKey);
      }
      return newSet;
    });
  };

  const handleStampClick = (stamp: TransformedStamp) => {
    setSelectedStamp(stamp.id);
    onStampClick(stamp);
  };

  // Filter hierarchies based on search and denomination filter
  const filteredHierarchies = useMemo(() => {
    return seriesGroup.hierarchies.filter(hierarchy => {
      const matchesSearch = seriesSearchTerm === "" || 
        hierarchy.varieties.some(variety => 
          variety.name.toLowerCase().includes(seriesSearchTerm.toLowerCase()) ||
          variety.colorName.toLowerCase().includes(seriesSearchTerm.toLowerCase()) ||
          variety.denomination.toLowerCase().includes(seriesSearchTerm.toLowerCase())
        );
      
      const matchesDenomination = selectedDenominationFilter === "all" || 
        hierarchy.key === selectedDenominationFilter;
      
      return matchesSearch && matchesDenomination;
    });
  }, [seriesGroup.hierarchies, seriesSearchTerm, selectedDenominationFilter]);

  // Pagination for denominations
  const totalDenominations = filteredHierarchies.length;
  const totalPages = Math.ceil(totalDenominations / denominationsPerPage);
  const paginatedHierarchies = showAllDenominations ? 
    filteredHierarchies : 
    filteredHierarchies.slice(
      (currentDenominationPage - 1) * denominationsPerPage,
      currentDenominationPage * denominationsPerPage
    );

  // Get unique denomination values for quick filter
  const uniqueDenominations = useMemo(() => {
    return Array.from(new Set(seriesGroup.hierarchies.map(h => h.key)));
  }, [seriesGroup.hierarchies]);

  // Expand all hierarchies when searching
  useEffect(() => {
    if (seriesSearchTerm) {
      // Recalculate matching hierarchies within the effect to avoid dependency loop
      const matchingHierarchies = seriesGroup.hierarchies.filter(hierarchy => {
        const matchesSearch = hierarchy.varieties.some(variety => 
          variety.name.toLowerCase().includes(seriesSearchTerm.toLowerCase()) ||
          variety.colorName.toLowerCase().includes(seriesSearchTerm.toLowerCase()) ||
          variety.denomination.toLowerCase().includes(seriesSearchTerm.toLowerCase())
        );
        
        const matchesDenomination = selectedDenominationFilter === "all" || 
          hierarchy.key === selectedDenominationFilter;
        
        return matchesSearch && matchesDenomination;
      });
      
      const matchingKeys = matchingHierarchies.map(h => h.key);
      setExpandedHierarchies(new Set(matchingKeys));
    }
  }, [seriesSearchTerm, selectedDenominationFilter, seriesGroup.hierarchies]); // Stable dependencies

  return (
    <div className="px-3 sm:px-4 lg:px-6 pb-4">
      <div className="bg-gradient-to-br from-background to-muted/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border shadow-sm">
        {/* Series Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {seriesGroup.seriesName.toUpperCase()}
            </h3>
            <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-primary/60 to-primary rounded-full"></div>
                </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>{seriesGroup.country}</span>
                </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary/70 rounded-full"></div>
              <span>{seriesGroup.yearRange}</span>
              </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
              <span>{totalDenominations} denominations</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search within series */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search stamps within this series..."
                  className="pl-8 text-sm"
                  value={seriesSearchTerm}
                  onChange={(e) => {
                    setSeriesSearchTerm(e.target.value);
                    setCurrentDenominationPage(1);
                  }}
                />
              </div>
            </div>
            
            {/* Quick denomination filter */}
            <div className="w-full sm:w-48">
              <Select 
                value={selectedDenominationFilter} 
                onValueChange={(value) => {
                  setSelectedDenominationFilter(value);
                  setCurrentDenominationPage(1);
                }}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Filter by denomination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All denominations</SelectItem>
                  {uniqueDenominations.map(denom => (
                    <SelectItem key={denom} value={denom}>{denom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
                  </div>
                  
          {/* Show results info and controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Showing {paginatedHierarchies.length} of {totalDenominations} denominations
              {seriesSearchTerm && ` (filtered by "${seriesSearchTerm}")`}
                    </div>
            <div className="flex items-center gap-2">
              {totalDenominations > denominationsPerPage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllDenominations(!showAllDenominations)}
                  className="text-xs h-7 sm:h-8"
                >
                  {showAllDenominations ? 'Show Paginated' : `Show All ${totalDenominations}`}
                </Button>
              )}
              {seriesSearchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSeriesSearchTerm("");
                    setSelectedDenominationFilter("all");
                    setExpandedHierarchies(new Set());
                  }}
                  className="text-xs h-7 sm:h-8"
                >
                  Clear Filters
                </Button>
              )}
                    </div>
                  </div>
                </div>

        {/* Quick Navigation Pills */}
        {!seriesSearchTerm && uniqueDenominations.length > 10 && (
          <div className="mb-4 sm:mb-6">
            <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Quick Jump to Denomination
            </div>
            <div className="flex flex-wrap gap-1 max-h-16 sm:max-h-20 overflow-y-auto">
              {uniqueDenominations.slice(0, 20).map(denom => (
                <Button
                  key={denom}
                  variant={selectedDenominationFilter === denom ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedDenominationFilter(denom);
                    setCurrentDenominationPage(1);
                    // Auto-expand the selected denomination
                    if (selectedDenominationFilter !== denom) {
                      setExpandedHierarchies(new Set([denom]));
                    }
                  }}
                  className="text-xs h-6 sm:h-7 px-1.5 sm:px-2"
                >
                  {denom}
                </Button>
              ))}
              {uniqueDenominations.length > 20 && (
                <span className="text-xs text-muted-foreground px-2 py-1">
                  +{uniqueDenominations.length - 20} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Hierarchy Grid */}
        <div className="space-y-4 sm:space-y-6">
          {paginatedHierarchies.map((hierarchy, hierarchyIndex) => {
            const isExpanded = expandedHierarchies.has(hierarchy.key);
            const hasVarieties = hierarchy.varieties.length > 0;
            const firstStamp = hierarchy.varieties[0];
            
            // Filter varieties within hierarchy based on search
            const filteredVarieties = hierarchy.varieties.filter(variety =>
              seriesSearchTerm === "" ||
              variety.name.toLowerCase().includes(seriesSearchTerm.toLowerCase()) ||
              variety.colorName.toLowerCase().includes(seriesSearchTerm.toLowerCase())
            );
            
            return (
              <div key={hierarchy.key} className="relative">
                {/* Denomination Header */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-card rounded-lg border-l-4 border-primary shadow-sm">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm sm:text-base">
                          {hierarchy.key.toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground">
                            {hierarchy.denominationValue}{hierarchy.denominationSymbol} Denomination
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {firstStamp?.name || 'No stamps available'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-xs">
                          {filteredVarieties.length} stamps
                          {seriesSearchTerm && filteredVarieties.length !== hierarchy.varieties.length && 
                            <span className="ml-1 text-muted-foreground">of {hierarchy.varieties.length}</span>
                          }
              </Badge>
            </div>
                      {hasVarieties && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleHierarchyExpansion(hierarchy.key)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10"
                        >
                          <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Stamps Grid */}
                <div className="pl-2 sm:pl-4">
                  {/* Combined Varieties & Variations Section */}
                  {hasVarieties && isExpanded && <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                      Varieties & Variations
                      {filteredVarieties.length > 20 && (
                        <span className="ml-2 text-primary">
                          (Showing first 20 of {filteredVarieties.length})
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3 max-h-80 sm:max-h-96 overflow-y-auto">
                      {/* Show only first 20 varieties for performance */}
                      {filteredVarieties.slice(0, 20).map((variety, varietyIndex) => (
                    <div 
                      key={variety.id} 
                          className={`
                            relative group cursor-pointer transition-all duration-200
                          `}
                          onClick={() => handleStampClick(variety)}
                        >
                          <div className="bg-card rounded-lg p-2 sm:p-3 border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-2 sm:gap-3">
                              {/* Connection Line */}
                              <div className="flex flex-col items-center">
                                <div className="w-0.5 h-3 sm:h-4 bg-primary/30"></div>
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"></div>
                                <div className="w-0.5 h-3 sm:h-4 bg-primary/30"></div>
                              </div>
                              
                              {/* Stamp Image */}
                              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden border border-border shadow-sm">
                        <Image
                                  src={variety.imagePath}
                          alt={variety.name}
                          fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                                <div className="absolute top-0.5 right-0.5">
                                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full border border-background"></div>
                                </div>
                      </div>
                      
                              {/* Stamp Details */}
                      <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                  <h6 className="font-medium text-xs sm:text-sm text-foreground truncate">
                                    {variety.name}
                                  </h6>
                                  <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-xs">
                                    #{varietyIndex + 1}
                                  </Badge>
                        </div>
                                <div className="text-xs text-muted-foreground">
                                  <div className="flex items-center gap-2 sm:gap-3 mb-1">
                                    <span>{variety.year}</span>
                                    <span>{variety.colorName}</span>
                                  </div>
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    {variety.catalogNumbers.sg && (
                                      <Badge variant="outline" className="text-xs font-mono">
                                        SG {variety.catalogNumbers.sg}
                                      </Badge>
                                    )}
                                    <Badge variant="secondary" className="text-xs">
                                      {variety.printingMethod}
                                    </Badge>
                        </div>
                      </div>
                    </div>

                              {/* Action Indicator */}
                              <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                              </div>
                            </div>
                </div>
              </div>
            ))}
                    </div>
                    
                    {/* Load More Button for varieties */}
                    {filteredVarieties.length > 20 && (
                      <div className="text-center pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // This could open a modal or expand to show all varieties
                            console.log("Load more varieties for", hierarchy.key);
                          }}
                          className="text-xs h-7 sm:h-8"
                        >
                          View All {filteredVarieties.length} Varieties
                        </Button>
          </div>
        )}
                  </div>}

                  {/* Connecting Line to Next Denomination */}
                  {hierarchyIndex < paginatedHierarchies.length - 1 && (
                    <div className="flex justify-center my-4 sm:my-6">
                      <div className="w-0.5 h-6 sm:h-8 bg-gradient-to-b from-primary/30 to-primary"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      
        {/* Denomination Pagination */}
        {!showAllDenominations && totalPages > 1 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDenominationPage(Math.max(1, currentDenominationPage - 1))}
                disabled={currentDenominationPage === 1}
                className="text-xs h-7 sm:h-8"
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentDenominationPage - 2)) + i;
                  if (pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={currentDenominationPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentDenominationPage(pageNum)}
                        className="w-7 h-7 sm:w-8 sm:h-8 text-xs"
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDenominationPage(Math.min(totalPages, currentDenominationPage + 1))}
                disabled={currentDenominationPage === totalPages}
                className="text-xs h-7 sm:h-8"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {filteredHierarchies.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-muted-foreground mb-4 text-sm sm:text-base">
              No stamps found matching your search criteria
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSeriesSearchTerm("");
                setSelectedDenominationFilter("all");
              }}
              className="text-xs sm:text-sm"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
          <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3 text-center">
            Navigation Tips
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs">
            <div className="flex items-center gap-2">
              <Search className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Search to filter stamps</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Click to expand denomination</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Click stamp to view details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStamp, setSelectedStamp] = useState<TransformedStamp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    country: "all",
    year: "all",
    denomination: "all",
    color: "all",
    series: "all",
    printingMethod: "all",
    theme: "all",
    features: new Set<string>()
  });
  
  // API state
  const [seriesGroups, setSeriesGroups] = useState<SeriesGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Fetch data from API with filters
  const fetchCatalogData = async (page: number = currentPage, filters = selectedFilters, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);

      const jwt = getJWT();
      if (!jwt) {
        throw new Error('No JWT token found. Please login first.');
      }

      const url = new URL('https://3pm-stampapp-prod.azurewebsites.net/api/v1/StampCatalog/Hierarchy');
      url.searchParams.append('pageNumber', page.toString());
      url.searchParams.append('pageSize', pageSize.toString());
      
      // Add search parameter if provided
      if (search && search.trim() !== '') {
        url.searchParams.append('search', search.trim());
      }
      
      // Add filter parameters if they're not "all"
      if (filters.country && filters.country !== 'all') {
        url.searchParams.append('country', filters.country);
      }
      if (filters.series && filters.series !== 'all') {
        url.searchParams.append('series', filters.series);
      }
      if (filters.year && filters.year !== 'all') {
        url.searchParams.append('year', filters.year);
      }
      if (filters.denomination && filters.denomination !== 'all') {
        url.searchParams.append('denomination', filters.denomination);
      }
      if (filters.color && filters.color !== 'all') {
        url.searchParams.append('color', filters.color);
      }
      if (filters.printingMethod && filters.printingMethod !== 'all') {
        url.searchParams.append('printingMethod', filters.printingMethod);
      }
      if (filters.theme && filters.theme !== 'all') {
        url.searchParams.append('theme', filters.theme);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const apiData: ApiPaginatedResponse = await response.json();
      const transformedData = organizeStampsBySeries({ items: apiData.items });
      setSeriesGroups(transformedData);
      
      // Use actual pagination data from API response
      setTotalCount(apiData.totalCount);
      setHasNextPage(apiData.hasNextPage);
      setHasPreviousPage(apiData.hasPreviousPage);
      
      console.log('Fetched paginated data:', {
        page: apiData.pageNumber,
        pageSize: apiData.pageSize,
        totalCount: apiData.totalCount,
        totalPages: apiData.totalPages,
        hasNextPage: apiData.hasNextPage,
        hasPreviousPage: apiData.hasPreviousPage,
        resultCount: transformedData.length
      });
    } catch (err) {
      console.error('Error fetching catalog data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch catalog data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData(1);
  }, []);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
    fetchCatalogData(1, selectedFilters, newSearchTerm);
  };
  
  // Clear filters function
  const clearFilters = () => {
    const clearedFilters = {
      country: "all",
      year: "all",
      denomination: "all",
      color: "all",
      series: "all",
      printingMethod: "all",
      theme: "all",
      features: new Set<string>()
    };
    setSearchTerm("");
    setSelectedFilters(clearedFilters);
    setCurrentPage(1);
    fetchCatalogData(1, clearedFilters, "");
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: value
    };
    setSelectedFilters(newFilters);
    setCurrentPage(1);
    fetchCatalogData(1, newFilters, searchTerm);
  };
  
  // Static filter data - since filtering is server-side, we don't need to derive from current data
  const getFilterData = useMemo(() => {
    // For now, use static filter options. In a real app, you might want to fetch these from an API endpoint
    return {
      countries: ["British Guiana", "United Kingdom", "United States", "Germany", "France", "Canada", "Australia"], // Static list
      series: [], // Will be populated from current page data for reference only
      years: Array.from({length: 50}, (_, i) => (new Date().getFullYear() - i).toString()), // Last 50 years
      denominations: ["1¢", "2¢", "3¢", "4¢", "5¢", "6¢", "8¢", "10¢", "12¢", "15¢", "20¢", "24¢", "25¢", "30¢", "50¢", "96¢"], // Common denominations
      colors: ["Red", "Blue", "Green", "Yellow", "Black", "Brown", "Purple", "Orange", "Pink", "Gray"],
      printingMethods: ["Typographed", "Lithographed", "Engraved", "Offset", "Rotary"],
      themes: ["Historical", "Nature", "People", "Architecture", "Art", "Sports", "Transportation"],
      features: ["Watermark", "Perforation", "Original Gum", "Overprint"],
      // Year ranges for easier filtering
      yearRanges: [
        { label: "Pre-1880", value: "pre-1880", years: ["1870", "1871", "1872", "1873", "1874", "1875", "1876", "1877", "1878", "1879"] },
        { label: "1880s", value: "1880s", years: ["1880", "1881", "1882", "1883", "1884", "1885", "1886", "1887", "1888", "1889"] },
        { label: "1890s", value: "1890s", years: ["1890", "1891", "1892", "1893", "1894", "1895", "1896", "1897", "1898", "1899"] },
        { label: "1900s", value: "1900s", years: ["1900", "1901", "1902", "1903", "1904", "1905", "1906", "1907", "1908", "1909"] },
        { label: "1910s+", value: "1910s", years: ["1910", "1911", "1912", "1913", "1914", "1915", "1916", "1917", "1918", "1919", "1920"] }
      ]
    };
  }, []); // No dependencies since it's static
  
  // Remove frontend filtering - all filtering is now done server-side
  // Use server data directly since API handles filtering and pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedSeriesGroups = seriesGroups; // Server already returns filtered and paginated data
  
  // Page change handler
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchCatalogData(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle stamp click to open modal
  const handleStampClick = (stamp: TransformedStamp) => {
    setSelectedStamp(stamp);
    setIsModalOpen(true);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading catalog data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-lg font-medium">Error Loading Catalog</div>
            <div className="text-muted-foreground">{error}</div>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-2 sm:py-4 lg:py-8 px-2 sm:px-4">
      {/* Mobile Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Stamp Catalog</h1>
        </div>
        
        {/* Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:hidden">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search stamps..."
                className="pl-8 text-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="sm:hidden flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <div className="hidden sm:block text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({seriesGroups.length} series on this page)
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Desktop Sidebar & Mobile Collapsible Filters */}
        <div className={`w-full lg:w-72 xl:w-80 space-y-4 ${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
          {/* Desktop Search */}
          <div className="hidden sm:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search stamps..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            </div>
          </div>
          
          <div className="p-3 sm:p-4 lg:p-5 border rounded-lg space-y-4 bg-card">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm sm:text-base">Filters</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Country Filter */}
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Country</label>
                <Select 
                  value={selectedFilters.country}
                  onValueChange={(value) => handleFilterChange('country', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Any country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any country</SelectItem>
                    {getFilterData.countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Series Filter */}
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Series</label>
                <Select
                  value={selectedFilters.series}
                  onValueChange={(value) => handleFilterChange('series', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Any series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any series</SelectItem>
                    {getFilterData.series.map(series => (
                      <SelectItem key={series} value={series} className="text-xs sm:text-sm">
                        <span className="truncate">{series}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Year Range Filter */}
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Year Period</label>
                <Select
                  value={selectedFilters.year}
                  onValueChange={(value) => handleFilterChange('year', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Any period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any period</SelectItem>
                    {getFilterData.yearRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Denomination Filter */}
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Denomination</label>
                <Select
                  value={selectedFilters.denomination}
                  onValueChange={(value) => handleFilterChange('denomination', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Any denomination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any denomination</SelectItem>
                    {getFilterData.denominations.slice(0, 20).map(denom => (
                      <SelectItem key={denom} value={denom}>{denom}</SelectItem>
                    ))}
                    {getFilterData.denominations.length > 20 && (
                      <div className="px-2 py-1 text-xs text-muted-foreground">
                        +{getFilterData.denominations.length - 20} more available
                    </div>
                    )}
                  </SelectContent>
                </Select>
                  </div>

                {/* Color Filter */}
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Color</label>
                  <Select
                    value={selectedFilters.color}
                    onValueChange={(value) => handleFilterChange('color', value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Any color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any color</SelectItem>
                      {getFilterData.colors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                    </div>

                {/* Printing Method Filter */}
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Printing Method</label>
                  <Select
                    value={selectedFilters.printingMethod}
                    onValueChange={(value) => handleFilterChange('printingMethod', value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Any method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any method</SelectItem>
                      {getFilterData.printingMethods.map(method => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  </div>

                {/* Theme Filter */}
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Theme</label>
                  <Select
                    value={selectedFilters.theme}
                    onValueChange={(value) => handleFilterChange('theme', value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Any theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any theme</SelectItem>
                      {getFilterData.themes.filter((theme): theme is string => Boolean(theme && theme.trim() !== '')).map(theme => (
                        <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Summary */}
              {Object.values(selectedFilters).some(filter => 
                (typeof filter === 'string' && filter !== "" && filter !== "all") ||
                (filter instanceof Set && filter.size > 0)
              ) && (
                <div className="pt-3 border-t">
                  <div className="text-xs sm:text-sm font-medium mb-2">Active Filters:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(selectedFilters).map(([key, value]) => {
                      if (typeof value === 'string' && value !== "" && value !== "all") {
                        return (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {key}: {value}
                          </Badge>
                        );
                      }
                      return null;
                    })}
            </div>
          </div>
              )}
              </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Results Summary */}
          <div className="sm:hidden mb-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ({paginatedSeriesGroups.length} series on this page)
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
            {paginatedSeriesGroups.map(seriesGroup => {
              const accordionData = createAccordionData(seriesGroup);
              
              return (
              <AccordionItem 
                  value={seriesGroup.id} 
                  key={seriesGroup.id} 
                className="border rounded-lg w-full overflow-hidden transition-all duration-300 hover:border-primary/20 data-[state=open]:shadow-lg bg-gradient-to-r from-card to-background"
              >
                  <AccordionTrigger className="w-full px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center w-full gap-3 sm:gap-4 lg:gap-6">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 relative rounded-md overflow-hidden border shrink-0">
                      <Image 
                          src={seriesGroup.image} 
                          alt={seriesGroup.seriesName}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                      <div className="flex-1 text-left space-y-1 min-w-0">
                        <div className="font-semibold text-sm sm:text-base lg:text-lg tracking-tight truncate">
                          {seriesGroup.seriesName}
                      </div>
                        <div className="text-muted-foreground text-xs sm:text-sm font-medium">
                          {accordionData.country}, {accordionData.years}
                        </div>
                        <div className="text-muted-foreground text-xs sm:text-sm line-clamp-2 lg:line-clamp-none">
                          {accordionData.description}
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                          <Badge variant="outline" className="bg-background/50 text-xs">
                            {accordionData.stampCount} stamps
                          </Badge>
                          <Badge variant="secondary" className="bg-secondary/80 text-xs">
                            {accordionData.denominationCount} denominations
                          </Badge>
                      </div>
                  </div>
                </div>
              </AccordionTrigger>
                <AccordionContent className="bg-muted/5 px-0 pb-4 sm:pb-6 lg:pb-8 border-t">
                  <div className="w-full">
                    <div className="px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4 pb-2">
                      <h3 className="text-base sm:text-lg font-medium">
                        {seriesGroup.seriesName} - Series Tree
                      </h3>
                    </div>
                    
                    <HierarchicalTreeView
                      seriesGroup={seriesGroup}
                        onStampClick={handleStampClick}
                      />
                  </div>
              </AccordionContent>
            </AccordionItem>
            );
          })}
        </Accordion>
        
        {paginatedSeriesGroups.length === 0 && !loading && (
          <div className="text-center p-8 sm:p-12 border rounded-lg">
            <div className="text-2xl sm:text-3xl mb-2">😕</div>
            <h3 className="text-base sm:text-lg font-medium mb-1">No stamps found</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              {currentPage > 1 ? 'No more results on this page. Try going back to earlier pages.' : 'Try adjusting your search or filters'}
            </p>
            {currentPage > 1 ? (
              <Button variant="outline" onClick={() => handlePageChange(1)}>
                Go to first page
              </Button>
            ) : (
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={!hasPreviousPage}
                className="hidden sm:inline-flex text-xs sm:text-sm"
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
                className="text-xs sm:text-sm"
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-1 sm:px-2 text-muted-foreground text-xs sm:text-sm">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-7 h-7 sm:w-9 sm:h-9 text-xs sm:text-sm"
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))
                }
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="text-xs sm:text-sm"
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={!hasNextPage}
                className="hidden sm:inline-flex text-xs sm:text-sm"
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    
    {/* Stamp Detail Modal */}
    <StampDetailModal
      stamp={selectedStamp as any}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      rootStamp={selectedStamp as any}
    />
  </div>
);
}

export default function ProtectedCatalogPage() {
  return (
    <AuthGuard>
      <CatalogPage />
    </AuthGuard>
  )
}

