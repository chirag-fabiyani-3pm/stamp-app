"use client"

import React from "react"
import { StampTree } from "@/components/catalog/stamp-tree"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Helper function to get local image path
const getLocalImagePath = (name: string): string => {
  if (!name) return '/images/stamps/placeholder.png'; // Default placeholder
  
  // Map certain names to specific images for better accuracy
  const imageMap: Record<string, string> = {
    // Main series images
    "Chalon Heads": "/images/stamps/chalon-heads.png",
    "1d Red": "/images/stamps/1d-red.png",
    "2d Blue": "/images/stamps/2d-blue.png",
    "6d Brown": "/images/stamps/6d-brown.png",
    "Penny Black": "/images/stamps/penny-black.png",
    "1s Green": "/images/stamps/1s-green.png",
    
    // Specific varieties
    "Chalon Head Imperforate": "/images/stamps/chalon-head-imperforate.png",
    "Chalon Head with Watermark": "/images/stamps/chalon-head-with-watermark.png",
    "Blue with Watermark": "/images/stamps/blue-with-watermark.png",
    "Blue Imperforate": "/images/stamps/blue-imperforate.png",
    "Brown Imperforate": "/images/stamps/brown-imperforate.png",
    "Brown Script Watermark": "/images/stamps/brown-script-watermark.png",
    "Green Imperforate": "/images/stamps/green-imperforate.png",
    "Green with Large Star Watermark": "/images/stamps/green-with-large-star-watermark.png",
    "1d Lilac": "/images/stamps/1d-lilac.png",
    "Side Faces": "/images/stamps/side-faces.png",
    "2d Rose": "/images/stamps/2d-rose.png",
    "1d Lake Taupo": "/images/stamps/1d-lake-taupo.png",
    "2d Pembroke Peak": "/images/stamps/2d-pembroke-peak.png",
    "9d Pink Terrace": "/images/stamps/9d-pink-terrace.png"
  };
  
  // Check if we have a direct mapping for this stamp name
  if (imageMap[name]) {
    return imageMap[name];
  }
  
  // Default fallback - sanitize the name
  const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `/images/stamps/${sanitizedName}.png`;
};

// Stamp data by ID
export const stampDataById: Record<string, any> = {
  "chalon": {
    id: "chalon",
    name: "Chalon Heads",
    subtitle: "New Zealand Chalons",
    description: "The iconic first stamps of New Zealand featuring Queen Victoria",
    imagePath: getLocalImagePath("Chalon Heads"),
    rootStamp: {
      id: "chalon-root",
      name: "Chalon Heads",
      imagePath: getLocalImagePath("1d Red"),
      position: "3-3",
      description: "The iconic first stamps of New Zealand featuring Queen Victoria, known as the Chalon Heads or Full Face Queens.",
      year: "1855-1873",
      colorName: "Various",
      country: "New Zealand",
      code: "FFQ-MAIN",
      issueSeries: "First Pictorials",
      printingMethod: "Letterpress",
      paper: "Handmade Wove Paper",
      perforationType: "Various (Imperforate to 13)",
      watermarkType: "Large Star",
      cancellation: "Various Provincial Cancellations",
      catalogNumbers: {
        soa: 1,
        sg: "1-125",
        scott: "1-50",
        michel: "1-48"
      },
      catalogSystems: {
        "Campbell Paterson": { code: "A1-Z10", notes: "Specialized NZ catalog" },
        "Minkus": { code: "NZ1-50", notes: "Global catalog" }
      },
      specializedCatalogs: [
        { 
          name: "The Postage Stamps of New Zealand", 
          description: "Royal Philatelic Society of NZ publication", 
          countrySpecific: true 
        },
        { 
          name: "Stanley Gibbons Commonwealth & British Empire Stamps", 
          description: "Specialized catalog for Commonwealth stamps", 
          countrySpecific: false 
        }
      ],
      marketValue: "$1,000 - $15,000 (varies by type)",
      features: ["Classic Design", "First Issue", "Queen Victoria Portrait"],
      errors: [
        "Plate flaws on various positions",
        "Color shifts on some printings",
        "Double impressions reported"
      ],
      plates: "Plates 1 & 2",
      plating: {
        positionNumber: "Various",
        gridReference: "Full sheet layout",
        flawDescription: "Multiple plate flaws documented across different printings",
        textOnFace: "POSTAGE, NEW ZEALAND",
        plateNumber: "1-2"
      },
      certifier: "Royal Philatelic Society of New Zealand",
      itemType: "Definitive Series",
      collectorGroup: "Classic New Zealand",
      rarityRating: "R3-R5 (varies by type)",
      grade: "Fine to Very Fine",
      notes: "The Chalon Heads represent New Zealand's first postage stamp issue, featuring a portrait of Queen Victoria based on the 1837 painting by Alfred Edward Chalon. These stamps were printed in London and later in New Zealand, with various papers, perforations, and watermarks creating numerous collectible varieties."
    },
    stamps: [
      {
        id: "chalon-1d-red",
        name: "1d Red",
        imagePath: getLocalImagePath("1d Red"),
        position: "1-2",
        description: "Full Face Queens - 1d Red Denomination",
        year: "1855",
        denomination: "1D",
        colorNumber: 1,
        colorName: "Red",
        country: "New Zealand",
        code: "FFQ-1D",
        issueSeries: "First Pictorials",
        printingMethod: "Letterpress",
        paper: "Handmade Wove Paper",
        perforationType: "Imperforate",
        watermarkType: "Large Star",
        cancellation: "Barred Numeral Obliterators",
        catalogNumbers: {
          soa: 1,
          sg: "1-15",
          scott: "1-10",
          michel: "1-8"
        },
        marketValue: "$3,000 - $8,000",
        features: ["First Value", "London Print", "Carmine-Red Shade"],
        errors: [
          "Plate wear on later printings",
          "Misaligned transfers on some sheets"
        ],
        plates: "Plate 1",
        plating: {
          positionNumber: "Various",
          gridReference: "A1-L10",
          flawDescription: "Retouched corner in position C7",
          textOnFace: "ONE PENNY",
          plateNumber: "1"
        },
        certifier: "BPA (British Philatelic Association)",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R4",
        grade: "Fine",
        purchasePrice: "$4,500",
        purchaseDate: "2018-05-12",
        notes: "The 1d Red was the first denomination issued in the Chalon Head series. The earliest printings from London are particularly sought after."
      },
      {
        id: "chalon-2d-blue",
        name: "2d Blue",
        imagePath: getLocalImagePath("2d Blue"),
        position: "1-3",
        description: "Full Face Queens - 2d Blue Denomination",
        year: "1855",
        denomination: "2D",
        colorNumber: 3,
        colorName: "Blue",
        country: "New Zealand",
        code: "FFQ-2D",
        issueSeries: "First Pictorials",
        printingMethod: "Letterpress",
        paper: "Handmade Wove Paper",
        perforationType: "Imperforate initially, later perforated 12-13",
        watermarkType: "Large Star",
        cancellation: "Various Provincial Cancellations",
        catalogNumbers: {
          soa: 2,
          sg: "2-36",
          scott: "2-15",
          michel: "2-12"
        },
        marketValue: "$2,500 - $7,000",
        features: ["Deep Blue Shade", "London Print"],
        errors: [
          "Plate flaw in position 10",
          "Double impressions on some sheets"
        ],
        plates: "Plate 1",
        plating: {
          positionNumber: "Various",
          gridReference: "A1-L10",
          flawDescription: "Retouched frame line in position E4",
          textOnFace: "TWO PENCE",
          plateNumber: "1"
        },
        certifier: "RPSL (Royal Philatelic Society London)",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R3-R4",
        grade: "Very Fine",
        purchasePrice: "$3,800",
        purchaseDate: "2019-11-20",
        notes: "The 2d Blue was one of the most commonly used denominations for domestic mail in early New Zealand."
      },
      {
        id: "chalon-6d-brown",
        name: "6d Brown",
        imagePath: getLocalImagePath("6d Brown"),
        position: "1-4",
        description: "Full Face Queens - 6d Brown Denomination",
        year: "1857",
        denomination: "6D",
        colorNumber: 8,
        colorName: "Brown",
        country: "New Zealand",
        code: "FFQ-6D",
        issueSeries: "First Pictorials",
        printingMethod: "Letterpress",
        paper: "Handmade Wove Paper",
        perforationType: "Imperforate initially, later perforated 12-13",
        watermarkType: "Large Star",
        cancellation: "Barred Numeral Obliterators",
        catalogNumbers: {
          soa: 10,
          sg: "10-40",
          scott: "10-25",
          michel: "10-15"
        },
        marketValue: "$5,000 - $9,000",
        features: ["Deep Chocolate Brown", "London Print"],
        errors: [
          "Plate cracks on later printings",
          "Misplaced entries on some positions"
        ],
        plates: "Plate 1",
        plating: {
          positionNumber: "Various",
          gridReference: "A1-L10",
          flawDescription: "Constant flaw in Queen's hair on position G6",
          textOnFace: "SIX PENCE",
          plateNumber: "1"
        },
        certifier: "PF (Philatelic Foundation)",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R4",
        grade: "Fine-Very Fine",
        purchasePrice: "$6,200",
        purchaseDate: "2020-03-15",
        visualAppeal: 8,
        notes: "The 6d Brown was primarily used for overseas mail to the UK and was one of the more valuable denominations in the series."
      },
      {
        id: "chalon-1s-green",
        name: "1s Green",
        imagePath: getLocalImagePath("1s Green"),
        position: "1-5",
        description: "Full Face Queens - 1 Shilling Green Denomination",
        year: "1858",
        denomination: "1S",
        colorNumber: 11,
        colorName: "Green",
        country: "New Zealand",
        code: "FFQ-1S",
        issueSeries: "First Pictorials",
        printingMethod: "Letterpress",
        paper: "Handmade Wove Paper",
        perforationType: "Imperforate initially, later perforated 12-13",
        watermarkType: "Large Star",
        cancellation: "Barred Numeral Obliterators",
        catalogNumbers: {
          soa: 15,
          sg: "15-45",
          scott: "15-30",
          michel: "15-22"
        },
        marketValue: "$7,500 - $12,000",
        features: ["Deep Emerald Green", "London Print", "High Value"],
        errors: [
          "Plate wear on positions 3 and 7",
          "Color variations from yellow-green to deep green"
        ],
        plates: "Plate 1",
        plating: {
          positionNumber: "Various",
          gridReference: "A1-L10",
          flawDescription: "Constant flaw in lower right corner on position D8",
          textOnFace: "ONE SHILLING",
          plateNumber: "1"
        },
        certifier: "RPSNZ (Royal Philatelic Society of New Zealand)",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R5",
        grade: "Very Fine",
        purchasePrice: "$8,500",
        purchaseDate: "2021-01-08",
        visualAppeal: 9,
        notes: "The 1s Green was the highest denomination in the initial Chalon series and is particularly scarce in fine condition."
      },
      {
        id: "chalon-imperf-1d",
        name: "1d Imperforate",
        imagePath: getLocalImagePath("Chalon Head Imperforate"),
        position: "2-1",
        description: "1855 1d Red Imperforate (Chalon Head) - London Print",
        year: "1855",
        denomination: "1D",
        colorNumber: 1,
        colorName: "Red",
        country: "New Zealand",
        code: "FFQ-1D-IMP",
        issueSeries: "First Pictorials",
        printingMethod: "Letterpress",
        paper: "Handmade Wove Paper",
        perforationType: "Imperforate",
        watermarkType: "None",
        cancellation: "Barred Numeral Obliterators",
        catalogNumbers: {
          soa: 1,
          sg: "1",
          scott: "1",
          michel: "1"
        },
        marketValue: "$5,000 - $7,500",
        features: ["Imperforate", "First Printing", "London Print"],
        errors: [
          "Plate wear on early impressions",
          "Varying ink density across sheet"
        ],
        plates: "Plate 1",
        plating: {
          positionNumber: "Various",
          gridReference: "A1-L10",
          flawDescription: "Small dot in Queen's hair on position B3",
          textOnFace: "ONE PENNY",
          plateNumber: "1"
        },
        certifier: "BPA (British Philatelic Association)",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R4",
        grade: "Fine",
        purchasePrice: "$5,800",
        purchaseDate: "2017-09-23",
        visualAppeal: 7,
        notes: "The imperforate 1d Red is one of the earliest New Zealand stamps and is highly sought after by specialists."
      },
      {
        id: "chalon-wmk-1d",
        name: "1d Watermark",
        imagePath: getLocalImagePath("Chalon Head with Watermark"),
        position: "4-1",
        description: "1855 1d Red with Large Star Watermark - London Print",
        year: "1855",
        denomination: "1D",
        colorNumber: 1,
        colorName: "Red",
        country: "New Zealand",
        code: "FFQ-1D-WMK",
        issueSeries: "First Pictorials",
        printingMethod: "Letterpress",
        paper: "Handmade Wove Paper",
        perforationType: "Imperforate",
        watermarkType: "Large Star",
        cancellation: "Barred Numeral Obliterators",
        catalogNumbers: {
          soa: 1,
          sg: "1a",
          scott: "1a",
          michel: "1a"
        },
        marketValue: "$8,000 - $12,000",
        features: ["Watermarked", "First Printing", "London Print"],
        errors: [
          "Inverted watermarks on some examples",
          "Misplaced watermarks reported"
        ],
        plates: "Plate 1",
        plating: {
          positionNumber: "Various",
          gridReference: "A1-L10",
          flawDescription: "Small break in frame line on position F5",
          textOnFace: "ONE PENNY",
          plateNumber: "1"
        },
        certifier: "RPSL (Royal Philatelic Society London)",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R5",
        grade: "Very Fine",
        purchasePrice: "$9,200",
        purchaseDate: "2019-06-14",
        visualAppeal: 9,
        notes: "The watermarked 1d Red is particularly scarce and represents an important early printing variation."
      },
      {
        id: "chalon-imperf-2d",
        name: "2d Imperforate",
        imagePath: getLocalImagePath("Blue Imperforate"),
        position: "2-3",
        description: "1855 2d Blue Imperforate - London Print",
        year: "1855",
        denomination: "2D",
        colorNumber: 3,
        colorName: "Blue",
        country: "New Zealand",
        code: "FFQ-2D-IMP",
        issueSeries: "First Pictorials",
        printingMethod: "Letterpress",
        paper: "Handmade Wove Paper",
        perforationType: "Imperforate",
        watermarkType: "None",
        cancellation: "Barred Numeral Obliterators",
        catalogNumbers: {
          soa: 2,
          sg: "2a",
          scott: "2b",
          michel: "2a"
        },
        marketValue: "$4,500 - $6,000",
        features: ["Imperforate", "Deep Blue", "London Print"],
        errors: [
          "Plate flaws on positions 8 and 12",
          "Varying shades from pale to deep blue"
        ],
        plates: "Plate 1",
        plating: {
          positionNumber: "Various",
          gridReference: "A1-L10",
          flawDescription: "Break in outer frame line on position C9",
          textOnFace: "TWO PENCE",
          plateNumber: "1"
        },
        certifier: "PF (Philatelic Foundation)",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R4",
        grade: "Fine-Very Fine",
        purchasePrice: "$4,800",
        purchaseDate: "2018-11-05",
        visualAppeal: 8,
        notes: "The imperforate 2d Blue is one of the most visually striking stamps from the Chalon series with its deep blue color."
      },
      {
        id: "chalon-wmk-2d",
        name: "2d Watermark",
        imagePath: getLocalImagePath("Blue with Watermark"),
        position: "4-3",
        description: "1855 2d Blue with Watermark - London Print",
        year: "1855",
        denomination: "2D",
        colorNumber: 3,
        colorName: "Blue",
        country: "New Zealand",
        code: "FFQ-2D-WMK",
        issueSeries: "First Pictorials",
        printingMethod: "Letterpress",
        paper: "Handmade Wove Paper",
        perforationType: "Imperforate",
        watermarkType: "Large Star",
        cancellation: "Barred Numeral Obliterators",
        catalogNumbers: {
          soa: 2,
          sg: "2",
          scott: "2",
          michel: "2"
        },
        marketValue: "$3,500 - $4,200",
        features: ["Watermarked", "London Print"],
        errors: [
          "Double watermarks on rare examples",
          "Partial watermarks reported"
        ],
        plates: "Plate 1",
        plating: {
          positionNumber: "Various",
          gridReference: "A1-L10",
          flawDescription: "Small dot in Queen's tiara on position H7",
          textOnFace: "TWO PENCE",
          plateNumber: "1"
        },
        certifier: "RPSNZ (Royal Philatelic Society of New Zealand)",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R3",
        grade: "Fine",
        purchasePrice: "$3,600",
        purchaseDate: "2020-02-18",
        visualAppeal: 7,
        notes: "The watermarked 2d Blue represents the standard issue of this denomination in the Chalon series."
      },
      {
        id: "chalon-imperf-6d",
        name: "6d Imperforate",
        imagePath: getLocalImagePath("Brown Imperforate"),
        position: "2-5",
        description: "1857 6d Brown Imperforate (Chalon Head) - London Print",
        year: "1857",
        denomination: "6D",
        colorNumber: 8,
        colorName: "Brown",
        catalogNumbers: {
          soa: 10,
          sg: "10",
          scott: "10",
          michel: "10"
        }
      },
      {
        id: "chalon-wmk-6d",
        name: "6d Script Watermark",
        imagePath: getLocalImagePath("Brown Script Watermark"),
        position: "4-5",
        description: "1857 6d Brown with Script Watermark - London Print",
        year: "1857",
        denomination: "6D",
        colorNumber: 8,
        colorName: "Brown",
        catalogNumbers: {
          soa: 10,
          sg: "10a",
          scott: "10var",
          michel: "10a"
        }
      }
    ],
    connections: [
      { from: "chalon-root", to: "chalon-1d-red" },
      { from: "chalon-root", to: "chalon-2d-blue" },
      { from: "chalon-root", to: "chalon-6d-brown" },
      { from: "chalon-root", to: "chalon-1s-green" },
      { from: "chalon-1d-red", to: "chalon-imperf-1d" },
      { from: "chalon-1d-red", to: "chalon-wmk-1d" },
      { from: "chalon-2d-blue", to: "chalon-imperf-2d" },
      { from: "chalon-2d-blue", to: "chalon-wmk-2d" },
      { from: "chalon-6d-brown", to: "chalon-imperf-6d" },
      { from: "chalon-6d-brown", to: "chalon-wmk-6d" }
    ]
  },
  "penny-black": {
    id: "penny-black",
    name: "Penny Black",
    subtitle: "World's First Postage Stamp",
    description: "The world's first adhesive postage stamp used in a public postal system",
    imagePath: getLocalImagePath("Penny Black"),
    rootStamp: {
      id: "penny-black-root",
      name: "Penny Black",
      imagePath: getLocalImagePath("Penny Black"),
      position: "3-3",
      description: "The world's first adhesive postage stamp, issued in Great Britain on May 1, 1840.",
      year: "1840",
      colorName: "Black",
      country: "Great Britain",
      code: "PB-MAIN",
      issueSeries: "First Postage Stamps",
      printingMethod: "Line Engraving",
      paper: "Handmade Wove Paper",
      perforationType: "Imperforate",
      watermarkType: "Small Crown",
      cancellation: "Red Maltese Cross",
      catalogNumbers: {
        sg: "1-11",
        scott: "1",
        michel: "1"
      },
      catalogSystems: {
        "Gibbons Specialised": { code: "AS1-AS11", notes: "Specialized GB catalog" },
        "Deegam": { code: "1.1.1-1.1.11", notes: "Plate varieties" }
      },
      specializedCatalogs: [
        { 
          name: "The Penny Black Plates", 
          description: "Specialized reference for plating Penny Blacks", 
          countrySpecific: true 
        },
        { 
          name: "Great Britain Queen Victoria Specialized", 
          description: "Comprehensive catalog of Victorian issues", 
          countrySpecific: true 
        }
      ],
      marketValue: "$1,000 - $25,000 (varies by plate and condition)",
      features: ["First Postage Stamp", "Queen Victoria Portrait", "Line Engraved"],
      errors: [
        "Inverted watermarks",
        "Double letters in corner squares",
        "Plate cracks and flaws"
      ],
      plates: "Plates 1-11",
      plating: {
        positionNumber: "Various",
        gridReference: "A1-TL",
        flawDescription: "Multiple plate flaws documented across different plates",
        textOnFace: "POSTAGE, ONE PENNY",
        plateNumber: "1-11"
      },
      certifier: "Royal Philatelic Society London",
      itemType: "Definitive",
      collectorGroup: "Classic Great Britain",
      rarityRating: "R3-R6 (varies by plate)",
      grade: "Fine to Very Fine",
      notes: "The Penny Black was the world's first adhesive postage stamp used in a public postal system. It was issued in Great Britain on May 1, 1840, for official use from May 6, 1840. The stamp features a profile of Queen Victoria on a black background and was printed by Perkins, Bacon & Co. All Penny Blacks were printed from plates 1-11, with each stamp on the sheet having unique corner letters to identify its position."
    },
    stamps: [
      {
        id: "penny-black-plate1",
        name: "Penny Black Plate 1",
        imagePath: getLocalImagePath("Penny Black"),
        position: "1-2",
        description: "First printing plate of the Penny Black",
        year: "1840",
        denomination: "1d",
        colorNumber: 1,
        colorName: "Black",
        country: "Great Britain",
        code: "PB-P1",
        issueSeries: "First Postage Stamps",
        printingMethod: "Line Engraving",
        paper: "Handmade Wove Paper",
        perforationType: "Imperforate",
        watermarkType: "Small Crown",
        cancellation: "Red Maltese Cross",
        catalogNumbers: {
          sg: "1",
          scott: "1",
          michel: "1"
        },
        marketValue: "$1,500 - $5,000",
        features: ["First Plate", "Early Printing", "May 1840 Issue"],
        errors: [
          "Plate wear on positions C-K",
          "Double letter in position JL"
        ],
        plates: "Plate 1",
        plating: {
          positionNumber: "Various",
          gridReference: "A1-TL",
          flawDescription: "Constant flaw in check letters of position JL",
          textOnFace: "POSTAGE, ONE PENNY",
          plateNumber: "1"
        },
        certifier: "BPA (British Philatelic Association)",
        itemType: "Definitive",
        collectorGroup: "Classic Great Britain",
        rarityRating: "R4",
        grade: "Fine",
        purchasePrice: "$3,200",
        purchaseDate: "2019-05-01",
        visualAppeal: 8,
        notes: "Plate 1 was the first plate used to print the Penny Black and is distinguished by its generally fine impression and clear details."
      },
      {
        id: "penny-black-plate2",
        name: "Penny Black Plate 2",
        imagePath: getLocalImagePath("Penny Black"),
        position: "1-3",
        description: "Second printing plate of the Penny Black",
        year: "1840",
        denomination: "1d",
        colorNumber: 1,
        colorName: "Black",
        country: "Great Britain",
        code: "PB-P2",
        issueSeries: "First Postage Stamps",
        printingMethod: "Line Engraving",
        paper: "Handmade Wove Paper",
        perforationType: "Imperforate",
        watermarkType: "Small Crown",
        cancellation: "Red Maltese Cross",
        catalogNumbers: {
          sg: "2",
          scott: "1",
          michel: "1"
        },
        marketValue: "$1,200 - $4,500",
        features: ["Second Plate", "May-June 1840 Issue"],
        errors: [
          "Plate crack across positions E-F",
          "Shifted transfers on row T"
        ],
        plates: "Plate 2",
        plating: {
          positionNumber: "Various",
          gridReference: "A1-TL",
          flawDescription: "Distinctive ray flaws in position TG",
          textOnFace: "POSTAGE, ONE PENNY",
          plateNumber: "2"
        },
        certifier: "RPSL (Royal Philatelic Society London)",
        itemType: "Definitive",
        collectorGroup: "Classic Great Britain",
        rarityRating: "R3",
        grade: "Very Fine",
        purchasePrice: "$4,100",
        purchaseDate: "2020-03-12",
        visualAppeal: 9,
        notes: "Plate 2 of the Penny Black is notable for its generally good impression quality and was used for a relatively short period."
      }
    ],
    connections: [
      { from: "penny-black-root", to: "penny-black-plate1" },
      { from: "penny-black-root", to: "penny-black-plate2" }
    ]
  },
  "side-face": {
    id: "side-face",
    name: "Side Face Queens",
    subtitle: "New Zealand Side Faces",
    description: "Second major issue of New Zealand featuring Queen Victoria in profile",
    imagePath: getLocalImagePath("Side Faces"),
    rootStamp: {
      id: "side-face-root",
      name: "Side Face Queens",
      imagePath: getLocalImagePath("Side Faces"),
      position: "3-3",
      description: "The second major definitive issue of New Zealand featuring Queen Victoria in profile view.",
      year: "1873-1892",
      colorName: "Various",
      country: "New Zealand",
      code: "SF-MAIN",
      issueSeries: "Side Face Queens",
      printingMethod: "Letterpress",
      paper: "Various papers including NZ and Star watermark",
      perforationType: "Various (10, 12.5, and compound)",
      watermarkType: "NZ and Star",
      cancellation: "Various circular date stamps",
      catalogNumbers: {
        soa: 20,
        sg: "140-200",
        scott: "51-69",
        michel: "44-60"
      },
      catalogSystems: {
        "Campbell Paterson": { code: "C1-D10", notes: "Specialized NZ catalog" },
        "Stanley Gibbons": { code: "NZ140-200", notes: "Commonwealth catalog" }
      },
      marketValue: "$50 - $5,000 (varies by rarity)",
      features: ["Profile Portrait", "Second Major Issue", "Multiple Perforations"],
      errors: [
        "Perforation varieties",
        "Paper variations",
        "Color shades"
      ],
      certifier: "Royal Philatelic Society of New Zealand",
      itemType: "Definitive Series",
      collectorGroup: "Classic New Zealand",
      rarityRating: "R2-R4 (varies by type)",
      grade: "Fine to Very Fine",
      notes: "The Side Face Queens series replaced the Chalon Heads in 1873 and featured a profile portrait of Queen Victoria. The series went through several printings with different perforations, papers, and watermarks."
    },
    stamps: [
      {
        id: "side-face-1d-lilac",
        name: "1d Lilac",
        imagePath: getLocalImagePath("1d Lilac"),
        position: "1-2",
        description: "First Side Face Series - 1d Lilac",
        year: "1873",
        denomination: "1D",
        colorNumber: 12,
        colorName: "Lilac",
        country: "New Zealand",
        code: "SF-1D",
        issueSeries: "Side Face Queens",
        printingMethod: "Letterpress",
        paper: "NZ watermark paper",
        perforationType: "Perf 12.5",
        watermarkType: "NZ and Star",
        catalogNumbers: {
          soa: 20,
          sg: "140",
          scott: "51",
          michel: "44"
        },
        marketValue: "$150 - $200",
        features: ["First Side Face Series", "Perf 12.5", "Lilac Shade"],
        plates: "Plate 1",
        certifier: "RPSNZ",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R2",
        grade: "Fine",
        notes: "The 1d Lilac was one of the most common denominations in the first Side Face issue."
      },
      {
        id: "side-face-2d-rose",
        name: "2d Rose",
        imagePath: getLocalImagePath("2d Rose"),
        position: "1-3",
        description: "First Side Face Series - 2d Rose",
        year: "1873",
        denomination: "2D",
        colorNumber: 13,
        colorName: "Rose",
        country: "New Zealand",
        code: "SF-2D",
        issueSeries: "Side Face Queens",
        printingMethod: "Letterpress",
        paper: "NZ watermark paper",
        perforationType: "Perf 12.5",
        watermarkType: "NZ and Star",
        catalogNumbers: {
          soa: 21,
          sg: "141",
          scott: "52",
          michel: "45"
        },
        marketValue: "$220 - $300",
        features: ["First Side Face Series", "Perf 12.5", "Rose Shade"],
        plates: "Plate 2",
        certifier: "RPSNZ",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R2",
        grade: "Fine",
        notes: "The 2d Rose was commonly used for domestic letter postage in the first Side Face issue."
      },
      {
        id: "side-face-1d-perf-10",
        name: "1d Lilac Perf 10",
        imagePath: getLocalImagePath("1d Lilac"),
        position: "2-2",
        description: "First Side Face Series - 1d Lilac with Perforation 10",
        year: "1874",
        denomination: "1D",
        colorNumber: 12,
        colorName: "Lilac",
        country: "New Zealand",
        code: "SF-1D-P10",
        issueSeries: "Side Face Queens",
        printingMethod: "Letterpress",
        paper: "NZ watermark paper",
        perforationType: "Perf 10",
        watermarkType: "NZ and Star",
        catalogNumbers: {
          soa: 20,
          sg: "156",
          scott: "51a",
          michel: "44a"
        },
        marketValue: "$190 - $250",
        features: ["First Side Face Series", "Perf 10", "Lilac Shade"],
        plates: "Plate 1",
        certifier: "RPSNZ",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R3",
        grade: "Fine",
        notes: "The Perf 10 variety of the 1d Lilac is less common than the Perf 12.5 version."
      }
    ],
    connections: [
      { from: "side-face-root", to: "side-face-1d-lilac" },
      { from: "side-face-root", to: "side-face-2d-rose" },
      { from: "side-face-root", to: "side-face-1d-perf-10" }
    ]
  },
  "pictorials": {
    id: "pictorials",
    name: "First Pictorials",
    subtitle: "New Zealand Scenic Issue",
    description: "Featuring New Zealand landscapes, native birds, and cultural scenes",
    imagePath: "/images/stamps/pictorials.png",
    rootStamp: {
      id: "pictorials-root",
      name: "First Pictorials",
      imagePath: "/images/stamps/pictorials.png",
      position: "3-3",
      description: "New Zealand's first pictorial issue featuring landscapes, birds, and Māori scenes.",
      year: "1898-1908",
      colorName: "Various",
      country: "New Zealand",
      code: "PIC-MAIN",
      issueSeries: "First Pictorials",
      printingMethod: "Recess Printing and Lithography",
      paper: "Various (Unwatermarked, Waterlow, Local)",
      perforationType: "Various (11-16, compound)",
      watermarkType: "Unwatermarked, NZ and Star, Sideways",
      catalogNumbers: {
        soa: 40,
        sg: "246-280",
        scott: "70-83",
        michel: "74-93"
      },
      marketValue: "$30 - $6,000 (varies by rarity)",
      features: ["Scenic Views", "Multicolor Designs", "Multiple Printings"],
      errors: [
        "Inverted centers on Lake Taupo",
        "Color shifts",
        "Double perforations"
      ],
      certifier: "Royal Philatelic Society of New Zealand",
      itemType: "Definitive Series",
      collectorGroup: "Classic New Zealand",
      rarityRating: "R2-R5 (varies by stamp)",
      grade: "Fine to Very Fine",
      notes: "The First Pictorials were a landmark series that broke from traditional designs by featuring New Zealand scenery rather than the monarch. The series went through several printings with different perforations and watermarks between 1898 and 1908."
    },
    stamps: [
      {
        id: "pictorials-1d-lake-taupo",
        name: "1d Lake Taupo",
        imagePath: getLocalImagePath("1d Lake Taupo"),
        position: "1-2",
        description: "1898 Pictorials - 1d Lake Taupo",
        year: "1898",
        denomination: "1D",
        colorNumber: 40,
        colorName: "Blue & Brown",
        country: "New Zealand",
        code: "PIC-1D",
        issueSeries: "First Pictorials",
        printingMethod: "Recess Printing",
        paper: "Unwatermarked paper",
        perforationType: "Perf 14",
        watermarkType: "Unwatermarked",
        catalogNumbers: {
          soa: 40,
          sg: "246",
          scott: "70",
          michel: "74"
        },
        marketValue: "$35 - $50",
        features: ["London Print", "Blue & Brown", "Perf 14"],
        errors: ["Inverted centers (rare)"],
        certifier: "RPSNZ",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R2",
        grade: "Fine",
        notes: "The 1d Lake Taupo features a scenic view of Mount Ruapehu and canoe. The London Print has a distinctive deep blue color."
      },
      {
        id: "pictorials-2d-pembroke",
        name: "2d Pembroke Peak",
        imagePath: getLocalImagePath("2d Pembroke Peak"),
        position: "1-3",
        description: "1898 Pictorials - 2d Pembroke Peak",
        year: "1898",
        denomination: "2D",
        colorNumber: 41,
        colorName: "Lake Rose",
        country: "New Zealand",
        code: "PIC-2D",
        issueSeries: "First Pictorials",
        printingMethod: "Recess Printing",
        paper: "Unwatermarked paper",
        perforationType: "Perf 14",
        watermarkType: "Unwatermarked",
        catalogNumbers: {
          soa: 41,
          sg: "248",
          scott: "72",
          michel: "76"
        },
        marketValue: "$45 - $75",
        features: ["London Print", "Lake Rose", "Perf 14"],
        certifier: "RPSNZ",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R2",
        grade: "Fine",
        notes: "The 2d Pembroke Peak features a view of Milford Sound with Pembroke Peak in the background."
      },
      {
        id: "pictorials-9d-terrace",
        name: "9d Pink Terrace",
        imagePath: getLocalImagePath("9d Pink Terrace"),
        position: "2-2",
        description: "1898 Pictorials - 9d Pink Terrace",
        year: "1898",
        denomination: "9D",
        colorNumber: 43,
        colorName: "Purple",
        country: "New Zealand",
        code: "PIC-9D",
        issueSeries: "First Pictorials",
        printingMethod: "Recess Printing",
        paper: "Unwatermarked paper",
        perforationType: "Perf 14",
        watermarkType: "Unwatermarked",
        catalogNumbers: {
          soa: 43,
          sg: "254",
          scott: "78",
          michel: "83"
        },
        marketValue: "$120 - $175",
        features: ["London Print", "Purple", "Perf 14"],
        certifier: "RPSNZ",
        itemType: "Definitive",
        collectorGroup: "Classic New Zealand",
        rarityRating: "R3",
        grade: "Fine",
        notes: "The 9d Pink Terrace depicts the famous Pink Terrace of Lake Rotomahana, which was destroyed in the 1886 eruption of Mount Tarawera."
      }
    ],
    connections: [
      { from: "pictorials-root", to: "pictorials-1d-lake-taupo" },
      { from: "pictorials-root", to: "pictorials-2d-pembroke" },
      { from: "pictorials-root", to: "pictorials-9d-terrace" }
    ]
  },
  "australian-kangaroo": {
    id: "australian-kangaroo",
    name: "Australian Kangaroo Series",
    subtitle: "First Commonwealth Series",
    description: "First national issues of Australia showing a kangaroo on a map of Australia",
    imagePath: "/images/stamps/kangaroo-map.png",
    rootStamp: {
      id: "kangaroo-root",
      name: "Kangaroo Series",
      imagePath: "/images/stamps/kangaroo-map.png",
      position: "3-3",
      description: "Australia's first Commonwealth postage stamps featuring a kangaroo on a map of Australia.",
      year: "1913-1935",
      colorName: "Various",
      country: "Australia",
      code: "AUS-KAN",
      issueSeries: "Kangaroo and Map",
      printingMethod: "Letterpress",
      paper: "Various papers with different watermarks",
      perforationType: "Various (11-14)",
      watermarkType: "Large Crown over A, Small Crown over A, C of A",
      catalogNumbers: {
        sg: "1-45",
        scott: "1-54",
        michel: "1-40"
      },
      marketValue: "$20 - $50,000 (varies by denomination and rarity)",
      features: ["Map Design", "Multiple Watermarks", "High Values"],
      errors: [
        "Inverted watermarks",
        "Monogram varieties",
        "Plate flaws"
      ],
      certifier: "Royal Philatelic Society of Australia",
      itemType: "Definitive Series",
      collectorGroup: "Classic Australia",
      rarityRating: "R2-R6 (varies by stamp)",
      grade: "Fine to Very Fine",
      notes: "The Kangaroo and Map series was Australia's first national postage stamp issue following federation. The design by Blamire Young features a kangaroo on a stylized map of Australia. The series was issued in multiple watermarks between 1913 and 1935."
    },
    stamps: [
      {
        id: "kangaroo-1d-red",
        name: "1d Red",
        imagePath: "/images/stamps/1d-red-kangaroo.png",
        position: "1-2",
        description: "First Watermark 1d Red Kangaroo",
        year: "1913",
        denomination: "1D",
        colorName: "Red",
        country: "Australia",
        code: "KAN-1D",
        issueSeries: "Kangaroo and Map",
        printingMethod: "Letterpress",
        paper: "Crown over A watermark paper",
        perforationType: "Perf 11.5-12",
        watermarkType: "First Watermark (Crown over A)",
        catalogNumbers: {
          sg: "2",
          scott: "2",
          michel: "2"
        },
        marketValue: "$25 - $40",
        features: ["First Watermark", "Red", "Common Value"],
        certifier: "RPSV",
        itemType: "Definitive",
        collectorGroup: "Classic Australia",
        rarityRating: "R1",
        grade: "Fine",
        notes: "The 1d Red Kangaroo was the most commonly used value for postcards and was printed in large quantities."
      },
      {
        id: "kangaroo-2d-grey",
        name: "2d Grey",
        imagePath: "/images/stamps/2d-grey-kangaroo.png",
        position: "1-3",
        description: "First Watermark 2d Grey Kangaroo",
        year: "1913",
        denomination: "2D",
        colorName: "Grey",
        country: "Australia",
        code: "KAN-2D",
        issueSeries: "Kangaroo and Map",
        printingMethod: "Letterpress",
        paper: "Crown over A watermark paper",
        perforationType: "Perf 11.5-12",
        watermarkType: "First Watermark (Crown over A)",
        catalogNumbers: {
          sg: "3",
          scott: "3",
          michel: "3"
        },
        marketValue: "$35 - $55",
        features: ["First Watermark", "Grey", "Common Value"],
        certifier: "RPSV",
        itemType: "Definitive",
        collectorGroup: "Classic Australia",
        rarityRating: "R1",
        grade: "Fine",
        notes: "The 2d Grey Kangaroo was commonly used for domestic letter rates."
      },
      {
        id: "kangaroo-5-pound",
        name: "£5 Grey & Yellow",
        imagePath: "/images/stamps/5-pound-kangaroo.png",
        position: "2-2",
        description: "First Watermark £5 Grey & Yellow Kangaroo",
        year: "1913",
        denomination: "£5",
        colorName: "Grey & Yellow",
        country: "Australia",
        code: "KAN-5P",
        issueSeries: "Kangaroo and Map",
        printingMethod: "Letterpress",
        paper: "Crown over A watermark paper",
        perforationType: "Perf 11.5-12",
        watermarkType: "First Watermark (Crown over A)",
        catalogNumbers: {
          sg: "30",
          scott: "16",
          michel: "16"
        },
        marketValue: "$30,000 - $50,000",
        features: ["First Watermark", "High Value", "Grey & Yellow"],
        certifier: "RPSV",
        itemType: "Definitive",
        collectorGroup: "Classic Australia",
        rarityRating: "R6",
        grade: "Very Fine",
        notes: "The £5 Grey & Yellow Kangaroo is one of Australia's most valuable stamps and was primarily used for fiscal purposes."
      }
    ],
    connections: [
      { from: "kangaroo-root", to: "kangaroo-1d-red" },
      { from: "kangaroo-root", to: "kangaroo-2d-grey" },
      { from: "kangaroo-root", to: "kangaroo-5-pound" }
    ]
  },
  "kgv-heads": {
    id: "kgv-heads",
    name: "King George V Heads",
    subtitle: "Australian KGV Definitives",
    description: "Australia's definitive series featuring King George V in profile",
    imagePath: "/images/stamps/kgv-heads.png",
    rootStamp: {
      id: "kgv-root",
      name: "KGV Heads",
      imagePath: "/images/stamps/kgv-heads.png",
      position: "3-3",
      description: "Australia's second definitive series featuring a portrait of King George V.",
      year: "1914-1936",
      colorName: "Various",
      country: "Australia",
      code: "AUS-KGV",
      issueSeries: "King George V Heads",
      printingMethod: "Letterpress",
      paper: "Various papers with different watermarks",
      perforationType: "Various (11-14.5, compound)",
      watermarkType: "Large Crown over A, Small Crown over A, C of A",
      catalogNumbers: {
        sg: "46-139",
        scott: "60-76",
        michel: "47-128"
      },
      marketValue: "$5 - $10,000 (varies by rarity)",
      features: ["Single-Lined Profile", "Multiple Shades", "Die Varieties"],
      errors: [
        "Inverted watermarks",
        "Substituted clichés",
        "Shade varieties"
      ],
      certifier: "Royal Philatelic Society of Australia",
      itemType: "Definitive Series",
      collectorGroup: "Classic Australia",
      rarityRating: "R1-R5 (varies by stamp)",
      grade: "Fine to Very Fine",
      notes: "The King George V Heads series, designed by Samuel Reading, was issued alongside the Kangaroo and Map series and became Australia's workhorse definitives. The series is noted for its many color variations, perforation types, and die varieties."
    },
    stamps: [
      {
        id: "kgv-1d-red",
        name: "1d Red",
        imagePath: "/images/stamps/kgv-1d-red.png",
        position: "1-2",
        description: "King George V 1d Red",
        year: "1914",
        denomination: "1D",
        colorName: "Red",
        country: "Australia",
        code: "KGV-1D",
        issueSeries: "King George V Heads",
        printingMethod: "Letterpress",
        paper: "Crown over A watermark paper",
        perforationType: "Perf 14",
        watermarkType: "First Watermark (Crown over A)",
        catalogNumbers: {
          sg: "47",
          scott: "60",
          michel: "47"
        },
        marketValue: "$15 - $30",
        features: ["Die I", "Large Crown Watermark", "Red"],
        certifier: "RPSV",
        itemType: "Definitive",
        collectorGroup: "Classic Australia",
        rarityRating: "R1",
        grade: "Fine",
        notes: "The 1d Red KGV was the most common denomination for postcards and was printed in enormous quantities with many shade variations."
      },
      {
        id: "kgv-1d-green",
        name: "1d Green",
        imagePath: "/images/stamps/kgv-1d-green.png",
        position: "1-3",
        description: "King George V 1d Green",
        year: "1924",
        denomination: "1D",
        colorName: "Green",
        country: "Australia",
        code: "KGV-1DG",
        issueSeries: "King George V Heads",
        printingMethod: "Letterpress",
        paper: "Small Crown over A watermark paper",
        perforationType: "Perf 13.5",
        watermarkType: "Small Multiple Watermark",
        catalogNumbers: {
          sg: "76",
          scott: "67",
          michel: "76"
        },
        marketValue: "$8 - $15",
        features: ["Die II", "Small Multiple Watermark", "Green"],
        certifier: "RPSV",
        itemType: "Definitive",
        collectorGroup: "Classic Australia",
        rarityRating: "R1",
        grade: "Fine",
        notes: "The 1d Green replaced the 1d Red in 1924 when Australia adopted the UPU color scheme for postage."
      },
      {
        id: "kgv-4d-orange",
        name: "4d Orange",
        imagePath: "/images/stamps/kgv-4d-orange.png",
        position: "2-2",
        description: "King George V 4d Orange",
        year: "1914",
        denomination: "4D",
        colorName: "Orange",
        country: "Australia",
        code: "KGV-4D",
        issueSeries: "King George V Heads",
        printingMethod: "Letterpress",
        paper: "Crown over A watermark paper",
        perforationType: "Perf 14",
        watermarkType: "First Watermark (Crown over A)",
        catalogNumbers: {
          sg: "62",
          scott: "64",
          michel: "62"
        },
        marketValue: "$45 - $75",
        features: ["Single Watermark", "Bright Orange", "Scarce Value"],
        certifier: "RPSV",
        itemType: "Definitive",
        collectorGroup: "Classic Australia",
        rarityRating: "R3",
        grade: "Fine",
        notes: "The 4d Orange KGV was used for heavier letters and more specialized postal services."
      }
    ],
    connections: [
      { from: "kgv-root", to: "kgv-1d-red" },
      { from: "kgv-root", to: "kgv-1d-green" },
      { from: "kgv-root", to: "kgv-4d-orange" }
    ]
  },
  "jubilee": {
    id: "jubilee",
    name: "1935 Silver Jubilee Series",
    subtitle: "King George V 25th Anniversary",
    description: "Commemorative series for King George V's Silver Jubilee",
    imagePath: "/images/stamps/silver-jubilee.png",
    rootStamp: {
      id: "jubilee-root",
      name: "Silver Jubilee Series",
      imagePath: "/images/stamps/silver-jubilee.png",
      position: "3-3",
      description: "Commemorative series issued for the 25th anniversary of King George V's reign in 1935.",
      year: "1935",
      colorName: "Various",
      country: "Great Britain",
      code: "GB-JUB",
      issueSeries: "Silver Jubilee",
      printingMethod: "Photogravure",
      paper: "Watermarked paper",
      perforationType: "Perf 14",
      watermarkType: "Multiple Crown and GvR",
      catalogNumbers: {
        sg: "453-456",
        scott: "226-229",
        michel: "186-189"
      },
      marketValue: "$25 - $200 (varies by denomination)",
      features: ["Common Design", "Colonial Issue", "Commemorative Series"],
      certifier: "Royal Philatelic Society London",
      itemType: "Commemorative Series",
      collectorGroup: "Commonwealth",
      rarityRating: "R2-R3",
      grade: "Very Fine",
      notes: "The Silver Jubilee issue was a significant omnibus issue that was released throughout the British Empire with a common design but different colors and denominations for each colony. The series commemorated King George V's 25th year on the throne."
    },
    stamps: [
      {
        id: "jubilee-0.5d",
        name: "½d Green",
        imagePath: "/images/stamps/jubilee-halfpenny.png",
        position: "1-2",
        description: "Silver Jubilee ½d Green",
        year: "1935",
        denomination: "½D",
        colorName: "Green",
        country: "Great Britain",
        code: "JUB-HD",
        issueSeries: "Silver Jubilee",
        printingMethod: "Photogravure",
        paper: "Watermarked paper",
        perforationType: "Perf 14",
        watermarkType: "Multiple Crown and GvR",
        catalogNumbers: {
          sg: "453",
          scott: "226",
          michel: "186"
        },
        marketValue: "$8 - $15",
        features: ["Lowest Value", "Green", "Windsor Castle Design"],
        certifier: "RPSL",
        itemType: "Commemorative",
        collectorGroup: "Commonwealth",
        rarityRating: "R1",
        grade: "Very Fine",
        notes: "The ½d value was used primarily for printed papers and postcards."
      },
      {
        id: "jubilee-1d",
        name: "1d Scarlet",
        imagePath: "/images/stamps/jubilee-1d.png",
        position: "1-3",
        description: "Silver Jubilee 1d Scarlet",
        year: "1935",
        denomination: "1D",
        colorName: "Scarlet",
        country: "Great Britain",
        code: "JUB-1D",
        issueSeries: "Silver Jubilee",
        printingMethod: "Photogravure",
        paper: "Watermarked paper",
        perforationType: "Perf 14",
        watermarkType: "Multiple Crown and GvR",
        catalogNumbers: {
          sg: "454",
          scott: "227",
          michel: "187"
        },
        marketValue: "$10 - $18",
        features: ["Standard Rate", "Scarlet", "Windsor Castle Design"],
        certifier: "RPSL",
        itemType: "Commemorative",
        collectorGroup: "Commonwealth",
        rarityRating: "R1",
        grade: "Very Fine",
        notes: "The 1d value was the standard letter rate at the time."
      },
      {
        id: "jubilee-2.5d",
        name: "2½d Ultramarine",
        imagePath: "/images/stamps/jubilee-2andhalfd.png",
        position: "2-2",
        description: "Silver Jubilee 2½d Ultramarine",
        year: "1935",
        denomination: "2½D",
        colorName: "Ultramarine",
        country: "Great Britain",
        code: "JUB-HHD",
        issueSeries: "Silver Jubilee",
        printingMethod: "Photogravure",
        paper: "Watermarked paper",
        perforationType: "Perf 14",
        watermarkType: "Multiple Crown and GvR",
        catalogNumbers: {
          sg: "455",
          scott: "228",
          michel: "188"
        },
        marketValue: "$15 - $25",
        features: ["Foreign Rate", "Ultramarine", "Windsor Castle Design"],
        certifier: "RPSL",
        itemType: "Commemorative",
        collectorGroup: "Commonwealth",
        rarityRating: "R2",
        grade: "Very Fine",
        notes: "The 2½d value was the foreign letter rate."
      }
    ],
    connections: [
      { from: "jubilee-root", to: "jubilee-0.5d" },
      { from: "jubilee-root", to: "jubilee-1d" },
      { from: "jubilee-root", to: "jubilee-2.5d" }
    ]
  },
  "seahorses": {
    id: "seahorses",
    name: "Seahorses High Values",
    subtitle: "King George V High Values",
    description: "High value definitive stamps showing Britannia riding seahorses",
    imagePath: "/images/stamps/seahorses.png",
    rootStamp: {
      id: "seahorses-root",
      name: "Seahorses Series",
      imagePath: "/images/stamps/seahorses.png",
      position: "3-3",
      description: "High value definitives of Great Britain featuring Britannia riding seahorses, designed by Bertram Mackennal.",
      year: "1913-1934",
      colorName: "Various",
      country: "Great Britain",
      code: "GB-SEA",
      issueSeries: "Seahorses",
      printingMethod: "Recess Printing (Intaglio)",
      paper: "Watermarked paper",
      perforationType: "Perf 14",
      watermarkType: "Multiple Cypher, Multiple GvR, Multiple Royal Cypher",
      catalogNumbers: {
        sg: "399-417",
        scott: "173-180",
        michel: "150-177"
      },
      marketValue: "$150 - $5,000 (varies by printing)",
      features: ["High Values", "Classic Design", "Multiple Printings"],
      errors: [
        "Shade varieties",
        "Re-entries",
        "Plate flaws"
      ],
      certifier: "Royal Philatelic Society London",
      itemType: "Definitive High Values",
      collectorGroup: "Classic Great Britain",
      rarityRating: "R3-R5",
      grade: "Very Fine",
      notes: "The Seahorses design is considered one of the most beautiful British stamps. The series was printed by three different printers (Waterlow, De La Rue, and Bradbury Wilkinson) over more than 20 years, creating many collectible varieties."
    },
    stamps: [
      {
        id: "seahorse-2s6d-waterlow",
        name: "2/6 Waterlow Brown",
        imagePath: "/images/stamps/seahorse-2s6d-waterlow.png",
        position: "1-2",
        description: "Seahorses 2/6 Brown (Waterlow Print)",
        year: "1913",
        denomination: "2/6",
        colorName: "Brown",
        country: "Great Britain",
        code: "SEA-26W",
        issueSeries: "Seahorses",
        printingMethod: "Recess Printing (Intaglio)",
        paper: "Watermarked paper",
        perforationType: "Perf 14",
        watermarkType: "Multiple Cypher",
        catalogNumbers: {
          sg: "399",
          scott: "173",
          michel: "151"
        },
        marketValue: "$250 - $400",
        features: ["Waterlow Print", "Brown", "First Printing"],
        certifier: "RPSL",
        itemType: "Definitive",
        collectorGroup: "Classic Great Britain",
        rarityRating: "R3",
        grade: "Very Fine",
        notes: "The Waterlow printings are considered the finest of the Seahorses, with sharp detail and rich colors."
      },
      {
        id: "seahorse-5s-waterlow",
        name: "5s Waterlow Rose-Red",
        imagePath: "/images/stamps/seahorse-5s-waterlow.png",
        position: "1-3",
        description: "Seahorses 5s Rose-Red (Waterlow Print)",
        year: "1913",
        denomination: "5s",
        colorName: "Rose-Red",
        country: "Great Britain",
        code: "SEA-5W",
        issueSeries: "Seahorses",
        printingMethod: "Recess Printing (Intaglio)",
        paper: "Watermarked paper",
        perforationType: "Perf 14",
        watermarkType: "Multiple Cypher",
        catalogNumbers: {
          sg: "401",
          scott: "174",
          michel: "153"
        },
        marketValue: "$500 - $800",
        features: ["Waterlow Print", "Rose-Red", "High Value"],
        certifier: "RPSL",
        itemType: "Definitive",
        collectorGroup: "Classic Great Britain",
        rarityRating: "R4",
        grade: "Very Fine",
        notes: "The 5s value was used for heavier parcels and fiscal purposes."
      },
      {
        id: "seahorse-2s6d-bradbury",
        name: "2/6 Bradbury Chocolate-Brown",
        imagePath: "/images/stamps/seahorse-2s6d-bradbury.png",
        position: "2-2",
        description: "Seahorses 2/6 Chocolate-Brown (Bradbury Wilkinson Print)",
        year: "1934",
        denomination: "2/6",
        colorName: "Chocolate-Brown",
        country: "Great Britain",
        code: "SEA-26B",
        issueSeries: "Seahorses",
        printingMethod: "Recess Printing (Intaglio)",
        paper: "Watermarked paper",
        perforationType: "Perf 14",
        watermarkType: "Multiple Royal Cypher",
        catalogNumbers: {
          sg: "415",
          scott: "179",
          michel: "175"
        },
        marketValue: "$150 - $250",
        features: ["Bradbury Wilkinson Print", "Chocolate-Brown", "Final Printing"],
        certifier: "RPSL",
        itemType: "Definitive",
        collectorGroup: "Classic Great Britain",
        rarityRating: "R3",
        grade: "Very Fine",
        notes: "The Bradbury Wilkinson printings are the last of the Seahorses series, with a slightly different appearance from the earlier prints."
      }
    ],
    connections: [
      { from: "seahorses-root", to: "seahorse-2s6d-waterlow" },
      { from: "seahorses-root", to: "seahorse-5s-waterlow" },
      { from: "seahorses-root", to: "seahorse-2s6d-bradbury" }
    ]
  },
  "usa-prexies": {
    id: "usa-prexies",
    name: "Presidential Series (Prexies)",
    subtitle: "US Presidential Definitives",
    description: "Definitive series featuring portraits of US Presidents",
    imagePath: "/images/stamps/prexies.png",
    rootStamp: {
      id: "prexies-root",
      name: "Presidential Series",
      imagePath: "/images/stamps/prexies.png",
      position: "3-3",
      description: "US definitive series featuring portraits of all deceased US Presidents through Calvin Coolidge.",
      year: "1938-1954",
      colorName: "Various",
      country: "United States",
      code: "US-PREX",
      issueSeries: "Presidential Series",
      printingMethod: "Rotary Press Printing",
      paper: "Unwatermarked paper",
      perforationType: "Perf 11x10.5",
      watermarkType: "Unwatermarked",
      catalogNumbers: {
        scott: "803-834",
        michel: "423-454"
      },
      marketValue: "$5 - $2,500 (varies by denomination)",
      features: ["Presidential Portraits", "Definitive Series", "Long-Running Issue"],
      errors: [
        "Perforation errors",
        "Color shifts",
        "Missing USIR watermarks"
      ],
      certifier: "American Philatelic Society",
      itemType: "Definitive Series",
      collectorGroup: "US Regular Issues",
      rarityRating: "R1-R5 (varies by value)",
      grade: "Very Fine",
      notes: "The Presidential Series, commonly known as the 'Prexies,' was issued in 1938 during the Franklin D. Roosevelt administration. Roosevelt was an avid stamp collector, and this series represented all deceased presidents at that time. The series remained in use until the 1950s."
    },
    stamps: [
      {
        id: "prexies-1c",
        name: "1¢ Washington",
        imagePath: "/images/stamps/prexie-1c.png",
        position: "1-2",
        description: "1¢ George Washington",
        year: "1938",
        denomination: "1¢",
        colorName: "Green",
        country: "United States",
        code: "PREX-01",
        issueSeries: "Presidential Series",
        printingMethod: "Rotary Press Printing",
        paper: "Unwatermarked paper",
        perforationType: "Perf.11x10.5",
        watermarkType: "Unwatermarked",
        catalogNumbers: {
          scott: "804",
          michel: "424"
        },
        marketValue: "$0.50 - $2",
        features: ["Green", "Washington", "Common Value"],
        certifier: "APS",
        itemType: "Definitive",
        collectorGroup: "US Regular Issues",
        rarityRating: "R1",
        grade: "Very Fine",
        notes: "The 1¢ Washington was used for postcards and printed matter."
      },
      {
        id: "prexies-3c",
        name: "3¢ Jefferson",
        imagePath: "/images/stamps/prexie-3c.png",
        position: "1-3",
        description: "3¢ Thomas Jefferson",
        year: "1938",
        denomination: "3¢",
        colorName: "Purple",
        country: "United States",
        code: "PREX-03",
        issueSeries: "Presidential Series",
        printingMethod: "Rotary Press Printing",
        paper: "Unwatermarked paper",
        perforationType: "Perf.11x10.5",
        watermarkType: "Unwatermarked",
        catalogNumbers: {
          scott: "807",
          michel: "427"
        },
        marketValue: "$0.50 - $2",
        features: ["Purple", "Jefferson", "First Class Rate"],
        certifier: "APS",
        itemType: "Definitive",
        collectorGroup: "US Regular Issues",
        rarityRating: "R1",
        grade: "Very Fine",
        notes: "The 3¢ Jefferson was the standard letter rate stamp and the most commonly used value in the series."
      },
      {
        id: "prexies-5-dollar",
        name: "$5 Coolidge",
        imagePath: "/images/stamps/prexie-5dollar.png",
        position: "2-2",
        description: "$5 Calvin Coolidge",
        year: "1938",
        denomination: "$5",
        colorName: "Red",
        country: "United States",
        code: "PREX-5D",
        issueSeries: "Presidential Series",
        printingMethod: "Rotary Press Printing",
        paper: "Unwatermarked paper",
        perforationType: "Perf.11x10.5",
        watermarkType: "Unwatermarked",
        catalogNumbers: {
          scott: "834",
          michel: "454"
        },
        marketValue: "$85 - $150",
        features: ["Red", "Coolidge", "Highest Value"],
        certifier: "APS",
        itemType: "Definitive",
        collectorGroup: "US Regular Issues",
        rarityRating: "R4",
        grade: "Very Fine",
        notes: "The $5 Coolidge was the highest value in the series and primarily used for large parcels and registered mail."
      }
    ],
    connections: [
      { from: "prexies-root", to: "prexies-1c" },
      { from: "prexies-root", to: "prexies-3c" },
      { from: "prexies-root", to: "prexies-5-dollar" }
    ]
  },
  "penny-red": {
    id: "penny-red",
    name: "Penny Red",
    subtitle: "Great Britain Line Engraved",
    description: "Successor to the Penny Black with hundreds of plate varieties",
    imagePath: "/images/stamps/penny-red.png",
    rootStamp: {
      id: "penny-red-root",
      name: "Penny Red",
      imagePath: "/images/stamps/penny-red.png",
      position: "3-3",
      description: "The successor to the Penny Black, featuring Queen Victoria in red, with numerous plates and varieties.",
      year: "1841-1879",
      colorName: "Red",
      country: "Great Britain",
      code: "GB-PR",
      issueSeries: "Line Engraved",
      printingMethod: "Line Engraving",
      paper: "Various papers with different watermarks",
      perforationType: "Imperforate initially, later Perf 14 and 16",
      watermarkType: "Small Crown, Large Crown",
      catalogNumbers: {
        sg: "8-43",
        scott: "3-33",
        michel: "3-26"
      },
      marketValue: "$20 - $5,000 (varies by plate and rarity)",
      features: ["Line Engraved", "Red Color", "Many Plates"],
      errors: [
        "Inverted watermarks",
        "Imperforate varieties",
        "Plate flaws"
      ],
      certifier: "Royal Philatelic Society London",
      itemType: "Definitive Series",
      collectorGroup: "Classic Great Britain",
      rarityRating: "R2-R5 (varies by plate)",
      grade: "Very Fine",
      notes: "The Penny Red replaced the Penny Black in 1841 and was Britain's workhorse stamp for nearly four decades. It went through numerous changes in watermark, paper, perforation, and plate numbers, with over 400 plates used for the various printings."
    },
    stamps: [
      {
        id: "penny-red-imp",
        name: "Penny Red Imperforate",
        imagePath: "/images/stamps/penny-red-imperforate.png",
        position: "1-2",
        description: "Penny Red Imperforate (1841-1854)",
        year: "1841",
        denomination: "1d",
        colorName: "Red-Brown",
        country: "Great Britain",
        code: "PR-IMP",
        issueSeries: "Line Engraved",
        printingMethod: "Line Engraving",
        paper: "Watermarked paper",
        perforationType: "Imperforate",
        watermarkType: "Small Crown",
        catalogNumbers: {
          sg: "8-10",
          scott: "3-4",
          michel: "3-4"
        },
        marketValue: "$100 - $300",
        features: ["Imperforate", "Red-Brown", "Small Crown Watermark"],
        certifier: "RPSL",
        itemType: "Definitive",
        collectorGroup: "Classic Great Britain",
        rarityRating: "R3",
        grade: "Fine",
        notes: "The imperforate Penny Red was the immediate successor to the Penny Black, changed to red to make the cancellation more visible."
      },
      {
        id: "penny-red-perf",
        name: "Penny Red Perforated",
        imagePath: "/images/stamps/penny-red-perforated.png",
        position: "1-3",
        description: "Penny Red Perforated (1854-1858)",
        year: "1854",
        denomination: "1d",
        colorName: "Red",
        country: "Great Britain",
        code: "PR-PERF",
        issueSeries: "Line Engraved",
        printingMethod: "Line Engraving",
        paper: "Watermarked paper",
        perforationType: "Perf 14",
        watermarkType: "Small Crown",
        catalogNumbers: {
          sg: "17-20",
          scott: "8-10",
          michel: "7-8"
        },
        marketValue: "$50 - $150",
        features: ["Perforated", "Red", "Small Crown Watermark"],
        certifier: "RPSL",
        itemType: "Definitive",
        collectorGroup: "Classic Great Britain",
        rarityRating: "R2",
        grade: "Fine",
        notes: "The introduction of perforation in 1854 was a major innovation that made stamps easier to separate."
      },
      {
        id: "penny-red-plate-225",
        name: "Penny Red Plate 225",
        imagePath: "/images/stamps/penny-red-plate-225.png",
        position: "2-2",
        description: "Penny Red Plate 225 (Rare Plate)",
        year: "1878",
        denomination: "1d",
        colorName: "Red",
        country: "Great Britain",
        code: "PR-P225",
        issueSeries: "Line Engraved",
        printingMethod: "Line Engraving",
        paper: "Watermarked paper",
        perforationType: "Perf 14",
        watermarkType: "Large Crown",
        catalogNumbers: {
          sg: "43",
          scott: "33",
          michel: "26"
        },
        marketValue: "$2,500 - $5,000",
        features: ["Rare Plate", "Red", "Large Crown Watermark"],
        certifier: "RPSL",
        itemType: "Definitive",
        collectorGroup: "Classic Great Britain",
        rarityRating: "R5",
        grade: "Fine",
        notes: "Plate 225 is one of the rarest plates of the Penny Red series, with very few examples known. The plate was prepared but saw limited use."
      }
    ],
    connections: [
      { from: "penny-red-root", to: "penny-red-imp" },
      { from: "penny-red-root", to: "penny-red-perf" },
      { from: "penny-red-root", to: "penny-red-plate-225" }
    ]
  },
  "machin": {
    id: "machin",
    name: "Machin Definitives",
    subtitle: "Queen Elizabeth II Portrait Series",
    description: "Iconic portrait of Queen Elizabeth II by Arnold Machin",
    imagePath: "/images/stamps/machin.png",
    rootStamp: {
      id: "machin-root",
      name: "Machin Definitives",
      imagePath: "/images/stamps/machin.png",
      position: "3-3",
      description: "The iconic definitive series featuring a sculpted portrait of Queen Elizabeth II by Arnold Machin.",
      year: "1967-Present",
      colorName: "Various",
      country: "Great Britain",
      code: "GB-MAC",
      issueSeries: "Machin Definitives",
      printingMethod: "Various (Photogravure, Intaglio, Digital)",
      paper: "Various papers",
      perforationType: "Various perforation types",
      watermarkType: "Various (Unwatermarked, Multiple Crowns, etc.)",
      catalogNumbers: {
        sg: "723-onwards",
        scott: "MH1-onwards",
        michel: "430-onwards"
      },
      marketValue: "$0.50 - $5,000 (varies by rarity)",
      features: ["Profile Portrait", "Single-Color Designs", "Longest-Running Series"],
      errors: [
        "Missing phosphor bands",
        "Imperforate errors",
        "Color shifts"
      ],
      certifier: "Royal Philatelic Society London",
      itemType: "Definitive Series",
      collectorGroup: "Modern Great Britain",
      rarityRating: "R1-R5 (varies by stamp)",
      grade: "Very Fine",
      notes: "The Machin series, introduced in 1967, is the world's longest-running stamp series still in production. Based on a plaster cast by sculptor Arnold Machin, the design has remained essentially unchanged for over 50 years, though with numerous variations in color, value, paper, phosphor bands, and security features."
    },
    stamps: [
      {
        id: "machin-4d-sepia",
        name: "4d Sepia",
        imagePath: "/images/stamps/machin-4d-sepia.png",
        position: "1-2",
        description: "First Machin Issue 4d Sepia",
        year: "1967",
        denomination: "4d",
        colorName: "Sepia",
        country: "Great Britain",
        code: "MAC-4D",
        issueSeries: "Machin Definitives",
        printingMethod: "Photogravure",
        paper: "Unwatermarked paper",
        perforationType: "Perf 15x14",
        watermarkType: "Unwatermarked",
        catalogNumbers: {
          sg: "726",
          scott: "MH4",
          michel: "433"
        },
        marketValue: "$0.75 - $1.50",
        features: ["First Issue", "Sepia", "Pre-Decimal"],
        certifier: "RPSL",
        itemType: "Definitive",
        collectorGroup: "Modern Great Britain",
        rarityRating: "R1",
        grade: "Very Fine",
        notes: "The 4d Sepia was part of the first Machin issue in 1967 and was used for the domestic letter rate."
      },
      {
        id: "machin-1p-crimson",
        name: "1p Crimson",
        imagePath: "/images/stamps/machin-1p-crimson.png",
        position: "1-3",
        description: "Decimal Machin 1p Crimson",
        year: "1971",
        denomination: "1p",
        colorName: "Crimson",
        country: "Great Britain",
        code: "MAC-1P",
        issueSeries: "Machin Definitives",
        printingMethod: "Photogravure",
        paper: "Unwatermarked paper",
        perforationType: "Perf 15x14",
        watermarkType: "Unwatermarked",
        catalogNumbers: {
          sg: "723",
          scott: "MH24",
          michel: "554"
        },
        marketValue: "$0.50 - $1",
        features: ["Decimal Currency", "Crimson", "Common Value"],
        certifier: "RPSL",
        itemType: "Definitive",
        collectorGroup: "Modern Great Britain",
        rarityRating: "R1",
        grade: "Very Fine",
        notes: "The 1p Crimson was issued as part of the decimal currency transition in 1971 and became one of the most recognizable Machins."
      },
      {
        id: "machin-rare-error",
        name: "£1 Missing Silver",
        imagePath: "/images/stamps/machin-error.png",
        position: "2-2",
        description: "£1 Missing Silver Error",
        year: "1991",
        denomination: "£1",
        colorName: "Brown-Ochre",
        country: "Great Britain",
        code: "MAC-E1",
        issueSeries: "Machin Definitives",
        printingMethod: "Photogravure",
        paper: "Unwatermarked paper",
        perforationType: "Perf 15x14",
        watermarkType: "Unwatermarked",
        catalogNumbers: {
          sg: "1442Ea",
          scott: "MH180a",
          michel: "1341F"
        },
        marketValue: "$2,500 - $4,000",
        features: ["Missing Silver", "Major Error", "High Value"],
        certifier: "RPSL",
        itemType: "Error",
        collectorGroup: "Modern Great Britain",
        rarityRating: "R5",
        grade: "Very Fine",
        notes: "This famous error occurred when the silver Queen's head was omitted from the printing process, resulting in a brown-ochre stamp with no portrait."
      }
    ],
    connections: [
      { from: "machin-root", to: "machin-4d-sepia" },
      { from: "machin-root", to: "machin-1p-crimson" },
      { from: "machin-root", to: "machin-rare-error" }
    ]
  },
  "ross-dependency": {
    id: "ross-dependency",
    name: "Ross Dependency Issues",
    subtitle: "New Zealand Antarctic Territory",
    description: "Stamps issued for the New Zealand Antarctic Territory",
    imagePath: "/images/stamps/ross-dependency.png",
    rootStamp: {
      id: "ross-dependency-root",
      name: "Ross Dependency Issues",
      imagePath: "/images/stamps/ross-dependency.png",
      position: "3-3",
      description: "Stamps issued for the Ross Dependency, New Zealand's territorial claim in Antarctica.",
      year: "1957-Present",
      colorName: "Various",
      country: "New Zealand (Ross Dependency)",
      code: "NZ-RD",
      issueSeries: "Ross Dependency",
      printingMethod: "Various (Lithography, Photogravure)",
      paper: "Unwatermarked paper",
      perforationType: "Various (13-14.5)",
      watermarkType: "Unwatermarked",
      catalogNumbers: {
        sg: "RD1-onwards",
        scott: "L1-onwards",
        michel: "1-onwards"
      },
      marketValue: "$5 - $1,000 (varies by issue)",
      features: ["Antarctic Themes", "Limited Distribution", "Territorial Issue"],
      certifier: "Royal Philatelic Society of New Zealand",
      itemType: "Territorial Issues",
      collectorGroup: "Polar Philately",
      rarityRating: "R2-R4",
      grade: "Very Fine",
      notes: "The Ross Dependency postal issues began in 1957 to establish New Zealand's territorial claims in Antarctica. The stamps are valid for postage within New Zealand but are primarily used at Scott Base in Antarctica and are popular with polar theme collectors."
    },
    stamps: [
      {
        id: "ross-1957-3d",
        name: "1957 3d Penguin",
        imagePath: "/images/stamps/ross-3d-penguin.png",
        position: "1-2",
        description: "First Ross Dependency Issue 3d Penguin",
        year: "1957",
        denomination: "3d",
        colorName: "Blue",
        country: "New Zealand (Ross Dependency)",
        code: "RD-3D",
        issueSeries: "Ross Dependency",
        printingMethod: "Photogravure",
        paper: "Unwatermarked paper",
        perforationType: "Perf 13.5",
        watermarkType: "Unwatermarked",
        catalogNumbers: {
          sg: "RD1",
          scott: "L1",
          michel: "1"
        },
        marketValue: "$15 - $25",
        features: ["First Issue", "Penguin", "Pre-Decimal"],
        certifier: "RPSNZ",
        itemType: "Territorial",
        collectorGroup: "Polar Philately",
        rarityRating: "R2",
        grade: "Very Fine",
        notes: "Part of the first set of Ross Dependency stamps issued to coincide with the Trans-Antarctic Expedition and the International Geophysical Year."
      },
      {
        id: "ross-1957-1s",
        name: "1957 1s Ship",
        imagePath: "/images/stamps/ross-1s-ship.png",
        position: "1-3",
        description: "First Ross Dependency Issue 1s Ship",
        year: "1957",
        denomination: "1s",
        colorName: "Brown",
        country: "New Zealand (Ross Dependency)",
        code: "RD-1S",
        issueSeries: "Ross Dependency",
        printingMethod: "Photogravure",
        paper: "Unwatermarked paper",
        perforationType: "Perf 13.5",
        watermarkType: "Unwatermarked",
        catalogNumbers: {
          sg: "RD4",
          scott: "L4",
          michel: "4"
        },
        marketValue: "$25 - $40",
        features: ["First Issue", "HMNZS Endeavour", "Pre-Decimal"],
        certifier: "RPSNZ",
        itemType: "Territorial",
        collectorGroup: "Polar Philately",
        rarityRating: "R3",
        grade: "Very Fine",
        notes: "Features the HMNZS Endeavour, the New Zealand supply ship for Antarctic operations."
      },
      {
        id: "ross-1982-25c",
        name: "1982 25c Research",
        imagePath: "/images/stamps/ross-25c-research.png",
        position: "2-2",
        description: "25c Antarctic Research",
        year: "1982",
        denomination: "25c",
        colorName: "Multicolor",
        country: "New Zealand (Ross Dependency)",
        code: "RD-25C",
        issueSeries: "Ross Dependency",
        printingMethod: "Lithography",
        paper: "Unwatermarked paper",
        perforationType: "Perf 14",
        watermarkType: "Unwatermarked",
        catalogNumbers: {
          sg: "RD25",
          scott: "L15",
          michel: "15"
        },
        marketValue: "$3 - $6",
        features: ["Research Theme", "Decimal", "Modern Issue"],
        certifier: "RPSNZ",
        itemType: "Territorial",
        collectorGroup: "Polar Philately",
        rarityRating: "R1",
        grade: "Very Fine",
        notes: "Part of a set highlighting scientific research in Antarctica."
      }
    ],
    connections: [
      { from: "ross-dependency-root", to: "ross-1957-3d" },
      { from: "ross-dependency-root", to: "ross-1957-1s" },
      { from: "ross-dependency-root", to: "ross-1982-25c" }
    ]
  }
}

export default function StampDetailPage({ params }: { params: { stampId: string } }) {
  const { stampId } = params;
  const stampData = stampDataById[stampId];
  
  if (!stampData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Stamp Not Found</h1>
          <p className="mb-6">The requested stamp could not be found.</p>
          <Button asChild>
            <Link href="/catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button asChild>
            <Link href="/catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
            </Link>
          </Button>
          <h1 className="text-2xl font-bold mt-2">{stampData.name}</h1>
          <p className="text-muted-foreground">{stampData.description}</p>
        </div>
      </div>
      
      <Card className="mb-6 overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-slate-900 text-white pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="w-6 h-6 bg-primary/80 rounded flex items-center justify-center text-white text-xs font-medium">H</div>
            Stamp Hierarchy Tree
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <StampTree
            title={`STAMP HIERARCHY TREE`}
            subtitle={stampData.subtitle}
            stamps={stampData.stamps}
            rootStamp={stampData.rootStamp}
            connections={stampData.connections}
          />
        </CardContent>
      </Card>
    </div>
  );
}
