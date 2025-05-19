"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StampCard } from "@/components/catalog/stamp-card"
import { Search, Filter, ChevronDown, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { SOACode } from "@/components/catalog/soa-code"
import { StampTree } from '@/components/catalog/stamp-tree'
import { stampDataById } from './[stampId]/page'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

// Helper function to get local image path
const getLocalImagePath = (name: string): string => {
  if (!name) return '/images/stamps/placeholder.png'; // Default placeholder
  
  // Map certain names to specific images for better accuracy
  const imageMap: Record<string, string> = {
    // Main series images
    "Chalon Heads": "chalon-heads",
    "1d Red": "1d-red",
    "2d Blue": "2d-blue",
    "6d Brown": "6d-brown",
    "Penny Black": "penny-black",
    "Side Faces": "side-faces",
    "1s Green": "1s-green",
    
    // Specific varieties
    "Chalon Head Imperforate": "chalon-head-imperforate",
    "Chalon Head with Watermark": "chalon-head-with-watermark",
    "Blue with Watermark": "blue-with-watermark",
    "Blue Imperforate": "blue-imperforate",
    "Brown Imperforate": "brown-imperforate",
    "Brown Script Watermark": "brown-script-watermark",
    "Green Imperforate": "green-imperforate",
    "Green with Large Star Watermark": "green-with-large-star-watermark",
    "1d Lilac": "1d-lilac"
  };
  
  // Check if we have a direct mapping for this stamp name
  if (imageMap[name]) {
    return `/images/stamps/${imageMap[name]}.png`;
  }
  
  // Default fallback - sanitize the name
  const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `/images/stamps/${sanitizedName}.png`;
};

// Data structure for stamp groups and varieties
const stampSeries = [
  {
    id: "chalon",
    title: "Chalon Heads (Full Face Queens)",
    description: "The iconic first stamps of New Zealand featuring Queen Victoria",
    image: getLocalImagePath("Chalon Heads"),
    country: "New Zealand",
    yearRange: "1855-1873",
    groups: [
      {
        id: "chalon-1d-red",
        title: "Chalon 1d Red (Color #1)",
        country: "New Zealand",
        year: "1855",
        description: "Full Face Queens - 1d Red Denomination",
        image: getLocalImagePath("1d Red"),
        colorNumber: 1,
        colorName: "Red",
        denomination: "1D",
        varieties: [
          {
            id: "stamp-1",
            title: "Chalon Head Imperforate",
            subTitle: "London Print",
            image: getLocalImagePath("Chalon Head Imperforate"),
            year: "1855",
            country: "NZ",
            denomination: "1D",
            catalogNumbers: {
              soa: 1,
              sg: "1",
              scott: "1",
              michel: "1",
            },
            description: "1855 1d Red Imperforate (Chalon Head) - London Print",
            marketValue: "$5,000 - $7,500",
            features: ["Imp"],
          },
          {
            id: "stamp-1a",
            title: "Chalon Head with Watermark",
            subTitle: "London Print",
            image: getLocalImagePath("Chalon Head with Watermark"),
            year: "1855",
            country: "NZ",
            denomination: "1D",
            catalogNumbers: {
              soa: 1,
              sg: "1a",
              scott: "1a",
              michel: "1a",
            },
            description: "1855 1d Red with Large Star Watermark - London Print",
            marketValue: "$8,000 - $12,000",
            features: ["Wmk"],
          },
        ]
      },
      {
        id: "chalon-2d-blue",
        title: "Chalon 2d Blue (Color #3)",
        country: "New Zealand",
        year: "1855",
        description: "Full Face Queens - 2d Blue Denomination",
        image: getLocalImagePath("2d Blue"),
        colorNumber: 3,
        colorName: "Blue",
        denomination: "2D",
        varieties: [
          {
            id: "stamp-2",
            title: "Blue with Watermark",
            subTitle: "London Print",
            image: getLocalImagePath("Blue with Watermark"),
            year: "1855",
            country: "NZ",
            denomination: "2D",
            catalogNumbers: {
              soa: 2,
              sg: "2",
              scott: "2",
              michel: "2",
            },
            description: "1855 2d Blue with Watermark - London Print",
            marketValue: "$3,500 - $4,200",
            features: ["Wmk"],
          },
          {
            id: "stamp-2a",
            title: "Blue Imperforate",
            subTitle: "London Print",
            image: getLocalImagePath("Blue Imperforate"),
            year: "1855",
            country: "NZ",
            denomination: "2D",
            catalogNumbers: {
              soa: 2,
              sg: "2a",
              scott: "2b",
              michel: "2a",
            },
            description: "1855 2d Blue Imperforate - London Print",
            marketValue: "$4,500 - $6,000",
            features: ["Imp"],
          }
        ]
      },
      {
        id: "chalon-6d-brown",
        title: "Chalon 6d Brown (Color #8)",
        country: "New Zealand",
        year: "1857",
        description: "Full Face Queens - 6d Brown Denomination",
        image: getLocalImagePath("6d Brown"),
        colorNumber: 8,
        colorName: "Brown",
        denomination: "6D",
        varieties: [
          {
            id: "stamp-10",
            title: "Brown Imperforate",
            subTitle: "London Print",
            image: getLocalImagePath("Brown Imperforate"),
            year: "1857",
            country: "NZ",
            denomination: "6D",
            catalogNumbers: {
              soa: 10,
              sg: "10",
              scott: "10",
              michel: "10",
            },
            description: "1857 6d Brown Imperforate (Chalon Head) - London Print",
            marketValue: "$6,500 - $8,200",
            features: ["Imp"],
          },
          {
            id: "stamp-10a",
            title: "Brown Script Watermark",
            subTitle: "London Print",
            image: getLocalImagePath("Brown Script Watermark"),
            year: "1857",
            country: "NZ",
            denomination: "6D",
            catalogNumbers: {
              soa: 10,
              sg: "10a",
              scott: "10var",
              michel: "10a",
            },
            description: "1857 6d Brown with Script Watermark - London Print",
            marketValue: "$8,500 - $12,000",
            features: ["Wmk", "scr"],
          }
        ]
      },
      {
        id: "chalon-1s-green",
        title: "Chalon 1s Green (Color #10)",
        country: "New Zealand",
        year: "1858",
        description: "Full Face Queens - 1 Shilling Green Denomination",
        image: getLocalImagePath("1s Green"),
        colorNumber: 10,
        colorName: "Green",
        denomination: "1S",
        varieties: [
          {
            id: "stamp-15",
            title: "Green Imperforate",
            subTitle: "London Print",
            image: getLocalImagePath("Green Imperforate"),
            year: "1858",
            country: "NZ",
            denomination: "1S",
            catalogNumbers: {
              soa: 15,
              sg: "15",
              scott: "15",
              michel: "15",
            },
            description: "1858 1s Green Imperforate (Chalon Head) - London Print",
            marketValue: "$7,500 - $9,000",
            features: ["Imp"],
          },
          {
            id: "stamp-15a",
            title: "Green with Large Star Watermark",
            subTitle: "London Print",
            image: getLocalImagePath("Green with Large Star Watermark"),
            year: "1858",
            country: "NZ",
            denomination: "1S",
            catalogNumbers: {
              soa: 15,
              sg: "15a",
              scott: "15a",
              michel: "15a",
            },
            description: "1858 1s Green with Large Star Watermark - London Print",
            marketValue: "$9,000 - $12,000",
            features: ["Wmk", "lstar"],
          }
        ]
      }
    ]
  },
  {
    id: "side-faces",
    title: "Side Faces",
    description: "Queen Victoria Side Face Portrait series",
    image: getLocalImagePath("Side Faces"),
    country: "New Zealand",
    yearRange: "1873-1892",
    groups: [
      {
        id: "side-faces-1d-lilac",
        title: "Side Face 1d Lilac",
        country: "New Zealand",
        year: "1873",
        description: "First Side Face Series - 1d Lilac",
        image: getLocalImagePath("1d Lilac"),
        colorNumber: 12,
        colorName: "Lilac",
        denomination: "1D",
        varieties: [
          {
            id: "stamp-20",
            title: "Lilac Perf 12.5",
            subTitle: "First Side Face",
            image: getLocalImagePath("Lilac Perf 12.5"),
            year: "1873",
            country: "NZ",
            denomination: "1D",
            catalogNumbers: {
              soa: 20,
              sg: "140",
              scott: "51",
              michel: "44",
            },
            description: "1873 1d Lilac Queen Victoria Side Face - Perf 12.5",
            marketValue: "$150 - $200",
            features: ["Perf.12.5"],
          },
          {
            id: "stamp-20a",
            title: "Lilac Perf 10",
            subTitle: "First Side Face",
            image: getLocalImagePath("Lilac Perf 10"),
            year: "1874",
            country: "NZ",
            denomination: "1D",
            catalogNumbers: {
              soa: 20,
              sg: "156",
              scott: "51a",
              michel: "44a",
            },
            description: "1874 1d Lilac Queen Victoria Side Face - Perf 10",
            marketValue: "$190 - $250",
            features: ["Perf.10"],
          }
        ]
      },
      {
        id: "side-faces-2d-rose",
        title: "Side Face 2d Rose",
        country: "New Zealand",
        year: "1873",
        description: "First Side Face Series - 2d Rose",
        image: getLocalImagePath("2d Rose"),
        colorNumber: 13,
        colorName: "Rose",
        denomination: "2D",
        varieties: [
          {
            id: "stamp-21",
            title: "Rose Perf 12.5",
            subTitle: "First Side Face",
            image: getLocalImagePath("Rose Perf 12.5"),
            year: "1873",
            country: "NZ",
            denomination: "2D",
            catalogNumbers: {
              soa: 21,
              sg: "141",
              scott: "52",
              michel: "45",
            },
            description: "1873 2d Rose Queen Victoria Side Face - Perf 12.5",
            marketValue: "$220 - $300",
            features: ["Perf.12.5"],
          }
        ]
      }
    ]
  },
  {
    id: "second-sidefaces",
    title: "Second Side Faces",
    description: "Queen Victoria Side Face Portrait second series with updated design",
    image: getLocalImagePath("Second Side Faces"),
    country: "New Zealand",
    yearRange: "1882-1900",
    groups: [
      {
        id: "second-sidefaces-1d-rose",
        title: "Second Side Face 1d Rose",
        country: "New Zealand",
        year: "1882",
        description: "Second Side Face Series - 1d Rose",
        image: getLocalImagePath("1d Rose"),
        colorNumber: 22,
        colorName: "Rose",
        denomination: "1D",
        varieties: [
          {
            id: "stamp-30",
            title: "Rose Die 1",
            subTitle: "Second Side Face",
            image: getLocalImagePath("Rose Die 1"),
            year: "1882",
            country: "NZ",
            denomination: "1D",
            catalogNumbers: {
              soa: 30,
              sg: "187",
              scott: "61",
              michel: "54",
            },
            description: "1882 1d Rose Queen Victoria Second Side Face - Die 1",
            marketValue: "$45 - $75",
            features: ["Die.1"],
          },
          {
            id: "stamp-30a",
            title: "Rose Die 2",
            subTitle: "Second Side Face",
            image: getLocalImagePath("Rose Die 2"),
            year: "1882",
            country: "NZ",
            denomination: "1D",
            catalogNumbers: {
              soa: 30,
              sg: "188",
              scott: "61a",
              michel: "54a",
            },
            description: "1882 1d Rose Queen Victoria Second Side Face - Die 2",
            marketValue: "$55 - $85",
            features: ["Die.2"],
          }
        ]
      }
    ]
  },
  {
    id: "pictorials-1898",
    title: "1898 Pictorials",
    description: "First pictorial issue showing scenic landscapes of New Zealand",
    image: getLocalImagePath("1898 Pictorials"),
    country: "New Zealand",
    yearRange: "1898-1908",
    groups: [
      {
        id: "pictorials-1d-lake-taupo",
        title: "1d Lake Taupo",
        country: "New Zealand",
        year: "1898",
        description: "1898 Pictorials - 1d Lake Taupo",
        image: getLocalImagePath("1d Lake Taupo"),
        colorNumber: 40,
        colorName: "Blue & Brown",
        denomination: "1D",
        varieties: [
          {
            id: "stamp-40",
            title: "Lake Taupo Blue & Brown",
            subTitle: "London Print",
            image: getLocalImagePath("Lake Taupo Blue & Brown"),
            year: "1898",
            country: "NZ",
            denomination: "1D",
            catalogNumbers: {
              soa: 40,
              sg: "246",
              scott: "70",
              michel: "74",
            },
            description: "1898 1d Blue & Brown Lake Taupo - London Print",
            marketValue: "$35 - $50",
            features: ["Perf.14"],
          },
          {
            id: "stamp-40a",
            title: "Lake Taupo Blue & Brown",
            subTitle: "Local Print",
            image: getLocalImagePath("Lake Taupo Blue & Brown Local Print"),
            year: "1899",
            country: "NZ",
            denomination: "1D",
            catalogNumbers: {
              soa: 40,
              sg: "269",
              scott: "83",
              michel: "86",
            },
            description: "1899 1d Blue & Brown Lake Taupo - Local Print",
            marketValue: "$25 - $40",
            features: ["Perf.11"],
          }
        ]
      },
      {
        id: "pictorials-2d-pembroke-peak",
        title: "2d Pembroke Peak",
        country: "New Zealand",
        year: "1898",
        description: "1898 Pictorials - 2d Pembroke Peak",
        image: getLocalImagePath("2d Pembroke Peak"),
        colorNumber: 41,
        colorName: "Lake Rose",
        denomination: "2D",
        varieties: [
          {
            id: "stamp-41",
            title: "Pembroke Peak Lake Rose",
            subTitle: "London Print",
            image: getLocalImagePath("Pembroke Peak Lake Rose"),
            year: "1898",
            country: "NZ",
            denomination: "2D",
            catalogNumbers: {
              soa: 41,
              sg: "248",
              scott: "72",
              michel: "76",
            },
            description: "1898 2d Lake Rose Pembroke Peak - London Print",
            marketValue: "$45 - $75",
            features: ["Perf.14"],
          }
        ]
      },
      {
        id: "pictorials-9d-terrace-pink",
        title: "9d Pink Terrace",
        country: "New Zealand",
        year: "1898",
        description: "1898 Pictorials - 9d Pink Terrace",
        image: getLocalImagePath("9d Pink Terrace"),
        colorNumber: 43,
        colorName: "Purple",
        denomination: "9D",
        varieties: [
          {
            id: "stamp-43",
            title: "Pink Terrace Purple",
            subTitle: "London Print",
            image: getLocalImagePath("Pink Terrace Purple"),
            year: "1898",
            country: "NZ",
            denomination: "9D",
            catalogNumbers: {
              soa: 43,
              sg: "254",
              scott: "78",
              michel: "83",
            },
            description: "1898 9d Purple Pink Terrace - London Print",
            marketValue: "$120 - $175",
            features: ["Perf.14"],
          },
          {
            id: "stamp-43a",
            title: "Pink Terrace Purple",
            subTitle: "Local Print",
            image: getLocalImagePath("Pink Terrace Purple Local Print"),
            year: "1899",
            country: "NZ",
            denomination: "9D",
            catalogNumbers: {
              soa: 43,
              sg: "276",
              scott: "89",
              michel: "93",
            },
            description: "1899 9d Purple Pink Terrace - Local Print",
            marketValue: "$95 - $140",
            features: ["Perf.11", "Wmk"],
          }
        ]
      }
    ]
  },
  {
    id: "australia-kangaroo",
    title: "Australia Kangaroo Series",
    description: "First stamps of unified Australia featuring the kangaroo design",
    image: getLocalImagePath("Australia Kangaroo Series"),
    country: "Australia",
    yearRange: "1913-1946",
    groups: [
      {
        id: "kangaroo-1d-red",
        title: "1d Red Kangaroo",
        country: "Australia",
        year: "1913",
        description: "First Watermark Series - 1d Red Kangaroo",
        image: getLocalImagePath("1d Red Kangaroo"),
        colorNumber: 50,
        colorName: "Red",
        denomination: "1D",
        varieties: [
          {
            id: "stamp-50",
            title: "1d Red Kangaroo",
            subTitle: "First Watermark",
            image: getLocalImagePath("1d Red Kangaroo"),
            year: "1913",
            country: "AU",
            denomination: "1D",
            catalogNumbers: {
              soa: 50,
              sg: "2",
              scott: "2",
              michel: "2",
            },
            description: "1913 1d Red Kangaroo & Map - First Watermark",
            marketValue: "$25 - $40",
            features: ["Wmk.1"],
          }
        ]
      },
      {
        id: "kangaroo-2d-grey",
        title: "2d Grey Kangaroo",
        country: "Australia",
        year: "1913",
        description: "First Watermark Series - 2d Grey Kangaroo",
        image: getLocalImagePath("2d Grey Kangaroo"),
        colorNumber: 51,
        colorName: "Grey",
        denomination: "2D",
        varieties: [
          {
            id: "stamp-51",
            title: "2d Grey Kangaroo",
            subTitle: "First Watermark",
            image: getLocalImagePath("2d Grey Kangaroo"),
            year: "1913",
            country: "AU",
            denomination: "2D",
            catalogNumbers: {
              soa: 51,
              sg: "3",
              scott: "3",
              michel: "3",
            },
            description: "1913 2d Grey Kangaroo & Map - First Watermark",
            marketValue: "$35 - $55",
            features: ["Wmk.1"],
          }
        ]
      }
    ]
  },
  {
    id: "penny-black",
    title: "Penny Black & Relatives",
    description: "The world's first postage stamp and its early successors",
    image: getLocalImagePath("Penny Black"),
    country: "Great Britain",
    yearRange: "1840-1841",
    groups: [
      {
        id: "penny-black-standard",
        title: "Penny Black",
        country: "Great Britain",
        year: "1840",
        description: "World's First Adhesive Postage Stamp",
        image: getLocalImagePath("Penny Black"),
        colorNumber: 60,
        colorName: "Black",
        denomination: "1D",
        varieties: [
          {
            id: "stamp-60",
            title: "Penny Black",
            subTitle: "Plate 1a",
            image: getLocalImagePath("Penny Black Plate 1a"),
            year: "1840",
            country: "GB",
            denomination: "1D",
            catalogNumbers: {
              soa: 60,
              sg: "1",
              scott: "1",
              michel: "1",
            },
            description: "1840 Penny Black - Plate 1a - May 1840",
            marketValue: "$800 - $2,000",
            features: ["Plate.1a"],
          },
          {
            id: "stamp-60a",
            title: "Penny Black",
            subTitle: "Plate 2",
            image: getLocalImagePath("Penny Black Plate 2"),
            year: "1840",
            country: "GB",
            denomination: "1D",
            catalogNumbers: {
              soa: 60,
              sg: "2",
              scott: "1",
              michel: "1",
            },
            description: "1840 Penny Black - Plate 2 - May/June 1840",
            marketValue: "$750 - $1,800",
            features: ["Plate.2"],
          }
        ]
      },
      {
        id: "penny-red",
        title: "Penny Red",
        country: "Great Britain",
        year: "1841",
        description: "Successor to the Penny Black",
        image: getLocalImagePath("Penny Red"),
        colorNumber: 61,
        colorName: "Red",
        denomination: "1D",
        varieties: [
          {
            id: "stamp-61",
            title: "Penny Red",
            subTitle: "Imperforate",
            image: getLocalImagePath("Penny Red Imperforate"),
            year: "1841",
            country: "GB",
            denomination: "1D",
            catalogNumbers: {
              soa: 61,
              sg: "8",
              scott: "3",
              michel: "3",
            },
            description: "1841 Penny Red - Imperforate - Plate 5",
            marketValue: "$100 - $250",
            features: ["Imp", "Plate.5"],
          }
        ]
      }
    ]
  }
]

// Flat list of all groups (for search and filtering)
const allStampGroups = stampSeries.flatMap(series => series.groups)

// Component for a Stamp Group Card
function StampGroupCard({ group, onToggle, isExpanded }: { 
  group: typeof allStampGroups[0], 
  onToggle: () => void,
  isExpanded: boolean
}) {
  const router = useRouter();
  
  return (
    <Card className="overflow-hidden">
      <div 
        className="flex items-center p-4 cursor-pointer" 
        onClick={onToggle}
      >
        <div className="h-12 w-12 relative mr-4 rounded-md overflow-hidden border">
          <Image 
            src={group.image || getLocalImagePath(group.title)}
            alt={group.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{group.title}</h3>
          <p className="text-sm text-muted-foreground">{group.description}</p>
        </div>
        <div>
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </div>
      </div>
      
      {isExpanded && (
        <CardContent className="pt-0 pb-4 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.varieties.map((stamp) => (
              <StampCard 
                key={stamp.id}
                id={stamp.id}
                title={stamp.title}
                image={stamp.image || getLocalImagePath(`${group.title} ${stamp.title}`)}
                year={stamp.year}
                country={stamp.country}
                denomination={stamp.denomination}
                catalogNumbers={stamp.catalogNumbers}
                description={stamp.description}
                marketValue={stamp.marketValue}
                features={stamp.features}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Component for a Series Card
function SeriesCard({ series, expandedGroups, toggleGroup }: {
  series: typeof stampSeries[0],
  expandedGroups: Record<string, boolean>,
  toggleGroup: (id: string) => void
}) {
  const [isSeriesExpanded, setIsSeriesExpanded] = useState(false);
  
  const toggleSeries = () => {
    setIsSeriesExpanded(!isSeriesExpanded);
  };
  
  return (
    <Card>
      <div 
        className="flex items-center p-6 cursor-pointer" 
        onClick={toggleSeries}
      >
        <div className="h-16 w-16 relative mr-6 rounded-md overflow-hidden border">
          <Image 
            src={series.image || getLocalImagePath(series.title)}
            alt={series.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{series.title}</h3>
          <p className="text-muted-foreground">{series.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs font-normal">{series.country}</Badge>
            <Badge variant="outline" className="text-xs font-normal">{series.yearRange}</Badge>
          </div>
        </div>
        <div>
          {isSeriesExpanded ? <ChevronDown className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </div>
      </div>
      
      {isSeriesExpanded && (
        <CardContent className="pt-0 pb-6 px-6">
          <div className="space-y-4">
            {series.groups.length > 0 ? (
              series.groups.map((group) => (
                <StampGroupCard 
                  key={group.id}
                  group={group}
                  onToggle={() => toggleGroup(group.id)}
                  isExpanded={!!expandedGroups[group.id]}
                />
              ))
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-muted-foreground">No stamp groups available in this series yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [selectedFilters, setSelectedFilters] = useState({
    country: "all",
    year: "all",
    denomination: "",
    color: "",
    errors: "",
    features: new Set<string>()
  });
  
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Simplified catalog structure showing main stamp groups
  const mainStampGroups = [
    {
      id: "chalon",
      title: "Chalon Heads (Full Face Queens)",
      country: "New Zealand",
      years: "1855-1873",
      image: getLocalImagePath("Chalon Heads"),
      description: "The iconic first stamps of New Zealand featuring Queen Victoria",
      stampCount: 10,
      types: "4 denominations with multiple varieties",
    },
    {
      id: "penny-black",
      title: "Penny Black",
      country: "Great Britain",
      years: "1840",
      image: getLocalImagePath("Penny Black"),
      description: "The world's first adhesive postage stamp used in a public postal system",
      stampCount: 3,
      types: "Two plate varieties and root stamp",
    },
    {
      id: "side-face",
      title: "Side Face Queens",
      country: "New Zealand",
      years: "1873-1892",
      image: getLocalImagePath("Side Faces"),
      description: "Second major issue of New Zealand featuring Queen Victoria in profile",
      stampCount: 4,
      types: "Three stamps with different perforations",
    },
    {
      id: "pictorials",
      title: "First Pictorials",
      country: "New Zealand",
      years: "1898-1908",
      image: "/images/stamps/pictorials.png",
      description: "Featuring New Zealand landscapes, native birds, and cultural scenes",
      stampCount: 4,
      types: "Three scenic views plus root stamp",
    },
    // Add more dummy stamp groups
    {
      id: "australian-kangaroo",
      title: "Australian Kangaroo Series",
      country: "Australia",
      years: "1913-1935",
      image: "/images/stamps/kangaroo-map.png", 
      description: "First national issues of Australia showing a kangaroo on a map of Australia",
      stampCount: 4,
      types: "Three denominations plus root stamp",
    },
    {
      id: "kgv-heads",
      title: "King George V Heads",
      country: "Australia",
      years: "1914-1936",
      image: "/images/stamps/kgv-heads.png",
      description: "Australia's definitive series featuring King George V in profile",
      stampCount: 4,
      types: "Three denominations plus root stamp",
    },
    {
      id: "jubilee",
      title: "1935 Silver Jubilee Series",
      country: "Great Britain",
      years: "1935",
      image: "/images/stamps/silver-jubilee.png",
      description: "Commemorative series for King George V's Silver Jubilee",
      stampCount: 4,
      types: "Three denominations plus root stamp",
    },
    {
      id: "seahorses",
      title: "Seahorses High Values",
      country: "Great Britain",
      years: "1913-1934",
      image: "/images/stamps/seahorses.png",
      description: "High value definitive stamps showing Britannia riding seahorses",
      stampCount: 4,
      types: "Three printer varieties plus root stamp",
    },
    {
      id: "usa-prexies",
      title: "Presidential Series (Prexies)",
      country: "United States",
      years: "1938-1954",
      image: "/images/stamps/prexies.png",
      description: "Definitive series featuring portraits of US Presidents",
      stampCount: 4,
      types: "Three values plus root stamp",
    },
    {
      id: "penny-red",
      title: "Penny Red",
      country: "Great Britain",
      years: "1841-1879",
      image: "/images/stamps/penny-red.png",
      description: "Successor to the Penny Black with hundreds of plate varieties",
      stampCount: 4,
      types: "Three perforation varieties plus root stamp",
    },
    {
      id: "machin",
      title: "Machin Definitives",
      country: "Great Britain",
      years: "1967-Present",
      image: "/images/stamps/machin.png",
      description: "Iconic portrait of Queen Elizabeth II by Arnold Machin",
      stampCount: 4,
      types: "Three values plus error variety",
    },
    {
      id: "ross-dependency",
      title: "Ross Dependency Issues",
      country: "New Zealand",
      years: "1957-Present",
      image: "/images/stamps/ross-dependency.png",
      description: "Stamps issued for the New Zealand Antarctic Territory",
      stampCount: 4,
      types: "Three Antarctic theme stamps plus root stamp",
    }
  ];
  
  // Handle navigation to stamp tree view
  const navigateToStampTree = (stampId: string) => {
    // Navigation handled by the Link component
    console.log("Navigating to stamp tree for", stampId);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Clear filters function
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFilters({
      country: "all",
      year: "all",
      denomination: "",
      color: "",
      errors: "",
      features: new Set<string>()
    });
    setCurrentPage(1);
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  // Filter stamps based on search term and filters
  const filteredStamps = mainStampGroups.filter(group => {
    // Text search
    const matchesSearch = 
      group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Country filter
    const matchesCountry = selectedFilters.country === "" || selectedFilters.country === "all" ? 
      true : 
      group.country.toLowerCase() === selectedFilters.country.toLowerCase();
    
    // Year filter (simplified - just checking if year range contains the filter year)
    const matchesYear = selectedFilters.year === "" || selectedFilters.year === "all" ? 
      true : 
      group.years.includes(selectedFilters.year);
    
    return matchesSearch && matchesCountry && matchesYear;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredStamps.length / itemsPerPage);
  const paginatedStamps = filteredStamps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Page change handler
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of results on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-start">
        <div className="w-full md:w-64 space-y-4">
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
          
          <div className="p-4 border rounded-lg space-y-4 bg-card">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Filters</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={clearFilters}
              >
                Clear
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Country</label>
                <Select 
                  value={selectedFilters.country}
                  onValueChange={(value) => handleFilterChange('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any country</SelectItem>
                    <SelectItem value="New Zealand">New Zealand</SelectItem>
                    <SelectItem value="Great Britain">Great Britain</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Year Range</label>
                <Select
                  value={selectedFilters.year}
                  onValueChange={(value) => handleFilterChange('year', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any period</SelectItem>
                    <SelectItem value="1840">1840s</SelectItem>
                    <SelectItem value="185">1850s</SelectItem>
                    <SelectItem value="187">1870s</SelectItem>
                    <SelectItem value="189">1890s</SelectItem>
                    <SelectItem value="19">1900s</SelectItem>
                    <SelectItem value="193">1930s</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Features</label>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input type="checkbox" id="feature-wmk" className="mr-2" />
                    <label htmlFor="feature-wmk" className="text-sm">Watermark Varieties</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="feature-imp" className="mr-2" />
                    <label htmlFor="feature-imp" className="text-sm">Imperforate</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="feature-err" className="mr-2" />
                    <label htmlFor="feature-err" className="text-sm">Errors & Varieties</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Stamp Catalog</h1>
            <div className="text-sm text-muted-foreground">
              Showing {paginatedStamps.length} of {filteredStamps.length} items
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full col-span-full space-y-4">
            {paginatedStamps.map(stamp => (
              <AccordionItem 
                value={stamp.id} 
                key={stamp.id} 
                className="border rounded-lg w-full overflow-hidden transition-all duration-300 hover:border-primary/20 data-[state=open]:shadow-lg bg-gradient-to-r from-card to-background"
              >
                <AccordionTrigger className="w-full px-6 py-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center w-full gap-6">
                    <div className="h-16 w-16 relative rounded-md overflow-hidden border">
                      <Image 
                        src={stamp.image} 
                        alt={stamp.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 text-left space-y-1.5">
                      <div className="font-semibold text-lg tracking-tight">{stamp.title}</div>
                      <div className="text-muted-foreground text-sm font-medium">{stamp.country}, {stamp.years}</div>
                      <div className="text-muted-foreground text-sm mt-1 line-clamp-2">{stamp.description}</div>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline" className="bg-background/50">{stamp.stampCount} stamps</Badge>
                        <Badge variant="secondary" className="bg-secondary/80">{stamp.types}</Badge>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-muted/5 px-0 pb-8 border-t">
                  {stampDataById[stamp.id] ? (
                    <div className="w-full px-6 pt-4">
                      <h3 className="text-lg font-medium mb-4 text-center">{stamp.title} - Hierarchy Tree</h3>
                      <StampTree
                        title={`STAMP HIERARCHY TREE`}
                        subtitle={stampDataById[stamp.id].subtitle}
                        stamps={stampDataById[stamp.id].stamps}
                        rootStamp={stampDataById[stamp.id].rootStamp}
                        connections={stampDataById[stamp.id].connections}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground p-4">No tree data available for this stamp.</div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredStamps.length === 0 && (
            <div className="text-center p-12 border rounded-lg">
              <div className="text-3xl mb-2">😕</div>
              <h3 className="text-lg font-medium mb-1">No stamps found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {filteredStamps.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
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
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-9 h-9"
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
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Import for the Heart, Eye, and Folder icons
import { Heart, Eye, Folder } from "lucide-react"

