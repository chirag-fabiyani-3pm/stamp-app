"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Check, Camera, Upload, RotateCcw, AlertCircle, Loader2, X, CheckCircle } from "lucide-react"
import Image from "next/image"
import StampViewer from "@/components/scan/stamp-viewer"
import ReferenceInfo from "@/components/scan/reference-info"
import StampObservationManager from "@/components/scan/stamp-observation-manager"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { AuthGuard } from "@/components/auth/route-guard"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// API Response interfaces
interface ApiStampResponse {
  isStamp?: boolean
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

interface ImageSearchResponse {
  aiResponse: ApiStampResponse
  similarStamps: ApiStampResponse[]
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
const transformApiStampToInternal = (apiStamp: ApiStampResponse, capturedImageUrl?: string) => {
  return {
    id: apiStamp.id,
    name: apiStamp.name,
    // Use captured image since API response won't have stampImageUrl for aiResponse
    imagePath: capturedImageUrl || apiStamp.stampImageUrl || "/placeholder-stamp.png",
    country: apiStamp.country,
    year: new Date(apiStamp.issueDate).getFullYear().toString(),
    description: apiStamp.description,
    watermarkOptions: apiStamp.watermark ? [apiStamp.watermark, "None"] : ["None"],
    perforationOptions: [apiStamp.perforation, "Imperforate", "10", "12.5", "Roulette 7"],
    possibleErrors: [
      "Colour Shift",
      "Double Print", 
      "Doctor Blade",
      "Ink Blob",
      "White Spots",
      "Colour Omitted",
      "Re-Entries",
      "Re-Touch",
      "Offset",
      "Print Process Error"
    ],
    certifiers: ["Expert Committee", "RPSNZ", "BPA", "APS"],
    paperTypes: [apiStamp.paperType, "Thick", "Thin", "Wove", "Laid"],
    printTypes: [apiStamp.printing, "Typography", "Lithography", "Intaglio"],
    millimeterMeasurements: [apiStamp.size, "20 x 24", "21 x 25", "19 x 23", "Other"],
    colors: [apiStamp.color, "Red", "Blue", "Green", "Brown"],
    grades: ["Fine", "Very Fine", "Good", "Poor", "Superb"],
    rarityRatings: [apiStamp.rarenessLevel, "Common", "Scarce", "Rare", "Very Rare", "Extremely Rare"],
    // Additional API data
    catalogId: apiStamp.catalogId,
    catalogName: apiStamp.catalogName,
    catalogNumber: apiStamp.catalogNumber,
    seriesName: apiStamp.seriesName,
    denominationValue: apiStamp.denominationValue,
    denominationCurrency: apiStamp.denominationCurrency,
    denominationSymbol: apiStamp.denominationSymbol,
    design: apiStamp.design,
    theme: apiStamp.theme,
    artist: apiStamp.artist,
    engraver: apiStamp.engraver,
    printingQuantity: apiStamp.printingQuantity,
    usagePeriod: apiStamp.usagePeriod,
    hasGum: apiStamp.hasGum,
    gumCondition: apiStamp.gumCondition,
    specialNotes: apiStamp.specialNotes,
    historicalContext: apiStamp.historicalContext
  };
};

// Helper function to map API stamp data to form fields
const mapApiStampToFormData = (apiStamp: ApiStampResponse) => {
  return {
    // Basic identification
    watermark: apiStamp.watermark || "unknown-watermark",
    perforation: apiStamp.perforation || "unknown-perforation", 
    paper: apiStamp.paperType || "unknown-paper",
    printType: apiStamp.printing || "unknown-print",
    certifier: "none-certifier", // Not provided by API
    itemType: "Stamp", // Default from API context
    color: apiStamp.color || "unknown-color",
    millimeterSize: apiStamp.size || "unknown-size",
    
    // Error and condition info
    errors: [], // Will be filled during observation
    colourShift: {
      active: false,
      directions: []
    },
    shiftDistance: {
      left: 0,
      right: 0, 
      up: 0,
      down: 0
    },
    
    // Grading and rarity
    grade: "", // Will be assessed during observation
    visualAppeal: 50, // Default, will be assessed
    rarityRating: apiStamp.rarenessLevel || "unknown-rarity",
    
    // Catalog and identification
    plateNumber: "", // Not provided by API
    words: `${apiStamp.denominationValue} ${apiStamp.denominationCurrency}`,
    
    // Purchase info (empty for new scans)
    purchasePrice: "",
    purchaseDate: "",
    notes: `${apiStamp.specialNotes}${apiStamp.historicalContext ? ` | ${apiStamp.historicalContext}` : ''}`,
    
    // Additional API data for reference
    catalogId: apiStamp.catalogId,
    catalogName: apiStamp.catalogName,
    catalogNumber: apiStamp.catalogNumber,
    seriesName: apiStamp.seriesName,
    country: apiStamp.country,
    issueDate: apiStamp.issueDate,
    design: apiStamp.design,
    theme: apiStamp.theme,
    artist: apiStamp.artist,
    engraver: apiStamp.engraver,
    printingQuantity: apiStamp.printingQuantity,
    usagePeriod: apiStamp.usagePeriod,
    hasGum: apiStamp.hasGum,
    gumCondition: apiStamp.gumCondition
  };
};

// Mock database of reference stamps
const referenceStampDatabase = [
  {
    id: "chalon-1d-red",
    name: "Chalon Head 1d Red",
    imagePath: "/images/stamps/1d-red.png",
    country: "New Zealand",
    year: "1855",
    description: "Chalon 1d Red Denomination",
    watermarkOptions: ["None", "Large Star", "Small Star", "NZ"],
    perforationOptions: ["Imperforate", "10", "12.5", "Roulette 7"],
    possibleErrors: [
      "Colour Shift",
      "Double Print",
      "Doctor Blade",
      "Ink Blob",
      "White Spots",
      "Colour Omitted",
      "Re-Entries",
      "Re-Touch",
      "Offset",
      "Print Process Error"
    ],
    certifiers: ["Expert Committee", "RPSNZ", "BPA", "APS"],
    paperTypes: ["Thick", "Thin", "Wove", "Laid"],
    printTypes: ["Typography", "Lithography", "Intaglio"],
    millimeterMeasurements: ["20 x 24", "21 x 25", "19 x 23", "Other"],
    colors: ["Red", "Carmine", "Rose Red", "Brownish Red"],
    grades: ["Fine", "Very Fine", "Good", "Poor", "Superb"],
    rarityRatings: ["Common", "Scarce", "Rare", "Very Rare", "Extremely Rare"]
  },
  {
    id: "chalon-2d-blue",
    name: "Chalon Head 2d Blue",
    imagePath: "/images/stamps/2d-blue.png",
    country: "New Zealand",
    year: "1855",
    description: "Chalon 2d Blue Denomination",
    watermarkOptions: ["None", "Large Star", "NZ"],
    perforationOptions: ["Imperforate", "10", "12.5", "Roulette 7"],
    possibleErrors: [
      "Colour Shift",
      "Offset",
      "Doctor Blade",
      "Re-Entries",
      "Colour Omitted",
      "White Spots",
      "Double Print"
    ],
    certifiers: ["Expert Committee", "RPSNZ", "BPA", "APS"],
    paperTypes: ["Thick", "Thin", "Wove", "Laid"],
    printTypes: ["Typography", "Lithography", "Intaglio"],
    millimeterMeasurements: ["20 x 24", "21 x 25", "19 x 23", "Other"],
    colors: ["Blue", "Pale Blue", "Ultramarine", "Greenish Blue"],
    grades: ["Fine", "Very Fine", "Good", "Poor", "Superb"],
    rarityRatings: ["Common", "Scarce", "Rare", "Very Rare", "Extremely Rare"]
  },
  {
    id: "chalon-6d-brown",
    name: "Chalon Head 6d Brown",
    imagePath: "/images/stamps/6d-brown.png",
    country: "New Zealand",
    year: "1855",
    description: "Chalon 6d Brown Denomination",
    watermarkOptions: ["None", "Large Star", "Script"],
    perforationOptions: ["Imperforate", "10", "12.5"],
    possibleErrors: [
      "Colour Shift",
      "Colour Omitted",
      "Re-Touch",
      "Double Print",
      "Doctor Blade",
      "White Spots"
    ],
    certifiers: ["Expert Committee", "RPSNZ", "BPA", "APS"],
    paperTypes: ["Thick", "Thin", "Wove", "Laid"],
    printTypes: ["Typography", "Lithography", "Intaglio"],
    millimeterMeasurements: ["20 x 24", "21 x 25", "19 x 23", "Other"],
    colors: ["Brown", "Pale Brown", "Chestnut", "Red Brown"],
    grades: ["Fine", "Very Fine", "Good", "Poor", "Superb"],
    rarityRatings: ["Common", "Scarce", "Rare", "Very Rare", "Extremely Rare"]
  },
  {
    id: "penny-black",
    name: "Penny Black",
    imagePath: "/images/stamps/penny-black.png",
    country: "Great Britain",
    year: "1840",
    description: "World's First Adhesive Postage Stamp",
    watermarkOptions: ["Small Crown"],
    perforationOptions: ["Imperforate"],
    possibleErrors: [
      "Re-Entries",
      "Plate Varieties",
      "Ink Blob",
      "Double Print",
      "Re-Touch"
    ],
    certifiers: ["Expert Committee", "RPSL", "BPA", "APS"],
    paperTypes: ["Wove", "Laid", "Thin"],
    printTypes: ["Intaglio"],
    millimeterMeasurements: ["19 x 22", "18.5 x 22", "Other"],
    colors: ["Black", "Grey Black", "Deep Black"],
    grades: ["Fine", "Very Fine", "Good", "Poor", "Superb"],
    rarityRatings: ["Scarce", "Rare", "Very Rare"]
  }
];

// Simulated database of stamps that would be found in a real database
// In a real app, this would come from a database query
const simulatedStampDatabase = [
  {
    refId: "chalon-1d-red",
    name: "Chalon Head 1d Red",
    certifier: "Expert Committee",
    itemType: "Single",
    colour: "Red",
    country: "New Zealand",
    wordsSymbols: "ONE PENNY",
    imageDescription: "Queen Victoria profile facing left on red background",
    dateOfIssue: "1855-07-18T00:00:00.000Z",
    paperType: "Wove",
    perforationType: "Imperforate",
    watermarkType: "Large Star",
    error: "None",
    cancellation: "",
    plates: "1",
    plating: {
      positionNumber: "17",
      gridReference: "r3-5",
      flawDescription: "Small white dot in lower right corner, consistent across all stamps from this position",
      textOnFace: "ONE PENNY",
      plateNumber: "1",
      settingNumber: "2",
      textColor: "Red",
      flawImage: null
    },
    collectorGroup: "",
    rarityRating: "Rare (R) - 1,000-10,000 exist",
    grade: "Very Fine",
    purchasePrice: "350.00",
    purchaseDate: "2023-05-12",
    notes: "Excellent example of the early Chalon Head design",
    visualAppeal: 85
  },
  {
    refId: "penny-black",
    name: "Penny Black",
    certifier: "BPA",
    itemType: "Single",
    colour: "Black",
    country: "Great Britain",
    wordsSymbols: "POSTAGE ONE PENNY",
    imageDescription: "Queen Victoria profile on black background with no country name",
    dateOfIssue: "1840-05-01T00:00:00.000Z",
    paperType: "Wove",
    perforationType: "Imperforate",
    watermarkType: "Small Crown",
    error: "None",
    cancellation: "Red Maltese Cross",
    plates: "1A",
    plating: {
      positionNumber: "A-G",
      gridReference: "r10-1",
      flawDescription: "Check letters in lower corners (A in lower left, G in lower right). Small line break in the SW frame line.",
      textOnFace: "POSTAGE ONE PENNY",
      plateNumber: "1A",
      settingNumber: "",
      textColor: "Black",
      flawImage: null
    },
    collectorGroup: "",
    rarityRating: "Very Rare (VR) - 100-1,000 exist",
    grade: "Fine",
    purchasePrice: "2500.00",
    purchaseDate: "2023-03-15",
    notes: "Classic example with clear Maltese Cross cancellation",
    visualAppeal: 92
  },
  {
    refId: "chalon-2d-blue",
    name: "Chalon Head 2d Blue",
    certifier: "RPSNZ",
    itemType: "Block",
    colour: "Ultramarine",
    country: "New Zealand",
    wordsSymbols: "TWO PENCE",
    imageDescription: "Queen Victoria profile facing left on blue background",
    dateOfIssue: "1855-07-18T00:00:00.000Z",
    paperType: "Laid",
    perforationType: "10",
    watermarkType: "Large Star",
    error: "Re-Entries",
    cancellation: "",
    plates: "2",
    plating: {
      positionNumber: "23",
      gridReference: "r4-5",
      flawDescription: "Double entry visible in lower frame line. Consistent re-entry flaw showing doubling of the bottom inscription.",
      textOnFace: "TWO PENCE",
      plateNumber: "2",
      settingNumber: "3",
      textColor: "Blue",
      flawImage: null
    },
    collectorGroup: "Chalon Study Group",
    rarityRating: "Very Rare (VR) - 100-1,000 exist",
    grade: "Superb",
    purchasePrice: "1250.00",
    purchaseDate: "2022-03-15",
    notes: "Exceptional example of the re-entry variety, highly sought after by specialists",
    visualAppeal: 95
  },
  {
    refId: "chalon-6d-brown",
    name: "Chalon Head 6d Brown",
    certifier: "Expert Committee",
    itemType: "Single",
    colour: "Chestnut",
    country: "New Zealand",
    wordsSymbols: "SIX PENCE",
    imageDescription: "Queen Victoria profile facing left on brown background",
    dateOfIssue: "1855-09-22T00:00:00.000Z",
    paperType: "Wove",
    perforationType: "12.5",
    watermarkType: "Large Star",
    error: "Colour Shift",
    cancellation: "Auckland Obliterator",
    plates: "3",
    plating: {
      positionNumber: "8",
      gridReference: "r2-4",
      flawDescription: "Noticeable break in the right frame line approximately 5mm from the top. Small white spot in the Queen's hair.",
      textOnFace: "SIX PENCE",
      plateNumber: "3",
      settingNumber: "1",
      textColor: "Brown",
      flawImage: null
    },
    collectorGroup: "",
    rarityRating: "Rare (R) - 1,000-10,000 exist",
    grade: "Very Fine",
    purchasePrice: "875.00",
    purchaseDate: "2023-01-20",
    notes: "Excellent color and centering for this issue",
    visualAppeal: 88
  },
  {
    refId: "penny-black",
    name: "Penny Black",
    certifier: "RPSL",
    itemType: "Cover",
    colour: "Deep Black",
    country: "Great Britain",
    wordsSymbols: "POSTAGE ONE PENNY",
    imageDescription: "Queen Victoria profile on black background with no country name",
    dateOfIssue: "1840-05-06T00:00:00.000Z",
    paperType: "Wove",
    perforationType: "Imperforate",
    watermarkType: "Small Crown",
    error: "Plate Varieties",
    cancellation: "Black Maltese Cross",
    plates: "2",
    plating: {
      positionNumber: "T-L",
      gridReference: "r5-7",
      flawDescription: "Check letters T-L (top left-bottom left). Plate 2 with characteristic 'ray flaws' in the background. The 'T' in 'POSTAGE' shows a small break.",
      textOnFace: "POSTAGE ONE PENNY T L",
      plateNumber: "2",
      settingNumber: "",
      textColor: "Black",
      flawImage: null
    },
    collectorGroup: "GB Classics Society",
    rarityRating: "Very Rare (VR) - 100-1,000 exist",
    grade: "Fine",
    purchasePrice: "2500.00",
    purchaseDate: "2021-11-03",
    notes: "On cover with London datestamp. Plate 2 examples are scarcer than Plate 1.",
    visualAppeal: 85
  },
  {
    refId: "penny-black",
    name: "Penny Black",
    certifier: "BPA",
    itemType: "Block",
    colour: "Grey Black",
    country: "Great Britain",
    wordsSymbols: "POSTAGE ONE PENNY",
    imageDescription: "Queen Victoria profile on black background with no country name",
    dateOfIssue: "1840-05-01T00:00:00.000Z",
    paperType: "Wove",
    perforationType: "Imperforate",
    watermarkType: "Small Crown",
    error: "Double Print",
    cancellation: "",
    plates: "1B",
    plating: {
      positionNumber: "Block C-D/E-F",
      gridReference: "r3-1,2/r4-1,2",
      flawDescription: "Block of 4 with check letters C-D/E-F. Position C shows a characteristic flaw in the NE corner square. Position F shows a small white flaw in the Queen's hair.",
      textOnFace: "POSTAGE ONE PENNY C D E F",
      plateNumber: "1B",
      settingNumber: "",
      textColor: "Black",
      flawImage: null
    },
    collectorGroup: "Penny Black Study Group",
    rarityRating: "Extremely Rare (ER) - Under 100 exist",
    grade: "Very Fine",
    purchasePrice: "12500.00",
    purchaseDate: "2020-06-15",
    notes: "Mint block of four. Extremely rare in this condition. From the Sir Gawaine Baillie collection.",
    visualAppeal: 98
  }
];

function ScanPage() {
  // Toast hook for notifications
  const { toast } = useToast();

  // State for the scan interface
  const [currentView, setCurrentView] = useState<"scan" | "reference" | "observation">("scan");
  const [scanID, setScanID] = useState<string>("");
  const [selectedStamp, setSelectedStamp] = useState<any>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [recognitionStatus, setRecognitionStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");

  // Observation states
  const [stampObservations, setStampObservations] = useState({
    watermark: "unknown-watermark",
    perforation: "unknown-perforation",
    paper: "unknown-paper",
    printType: "unknown-print",
    certifier: "none-certifier",
    itemType: "unknown-type",
    color: "unknown-color",
    millimeterSize: "unknown-size",
    errors: [] as string[],
    colourShift: {
      active: false,
      directions: [] as string[]
    },
    shiftDistance: {
      left: 0,
      right: 0,
      up: 0,
      down: 0
    },
    grade: "",
    visualAppeal: 50, // 0-100
    rarityRating: "unknown-rarity",
    plateNumber: "",
    words: "",
    purchasePrice: "",
    purchaseDate: "",
    notes: ""
  });

  // Camera/scan related refs and states
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // State for detailed stamp modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalStamp, setDetailModalStamp] = useState<any>(null);

  // Effect to synchronize srcObject between videos when active
  useEffect(() => {
    if (cameraActive && videoRef.current?.srcObject && visibleVideoRef.current) {
      visibleVideoRef.current.srcObject = videoRef.current.srcObject;
    }
  }, [cameraActive, videoRef.current?.srcObject]);

  // Add a polyfill helper for browser compatibility
  const getMediaDevices = () => {
    const navigator = window.navigator as any;

    // Try legacy APIs and alternative methods
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices;
    }

    // Legacy webkit prefix used in some mobile browsers
    if (navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
      navigator.mediaDevices = navigator.mediaDevices || {};

      // Add polyfill for getUserMedia for older browsers
      navigator.mediaDevices.getUserMedia = function (constraints: MediaStreamConstraints) {
        const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // If it's not a real function, reject
        if (!getUserMedia) {
          return Promise.reject(new Error("getUserMedia is not implemented in this browser"));
        }

        // Otherwise, wrap the legacy callback version in a promise
        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };

      return navigator.mediaDevices;
    }

    // No getUserMedia support
    return null;
  };

  // Add mobile detection utility
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
  };

  // Modified camera functions
  const startCamera = async () => {
    // For mobile devices, we'll use the native camera app instead
    if (isMobileDevice()) {
      // On mobile, we'll trigger the file input with camera capture
      const fileInput = document.getElementById('mobile-camera-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
      return;
    }

    // Desktop camera logic (existing code)
    try {
      setCameraError(null);
      console.log("Starting camera...");

      // Check if running in a secure context
      if (window.isSecureContext === false) {
        console.error("Not in a secure context, camera API may not work");
      }

      // Get appropriate media devices object with polyfill support
      const mediaDevices = getMediaDevices();
      if (!mediaDevices) {
        throw new Error("Camera API is not supported in your browser. Please use a modern browser or try the file upload option.");
      }

      // Use simple constraints for mobile
      let constraints: MediaStreamConstraints = {
        audio: false,
        video: true
      };

      // Try with more specific constraints only for browsers that support them
      try {
        // Test if detailed constraints work
        await mediaDevices.getSupportedConstraints();

        // If supported, use more specific constraints
        constraints = {
          audio: false,
          video: {
            facingMode: "environment",
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 }
          }
        };
      } catch (error) {
        console.warn("Detailed constraints not supported, using basic video: true");
      }

      console.log("Requesting camera with constraints:", constraints);

      // Request camera access with appropriate error handling
      let stream;
      try {
        stream = await mediaDevices.getUserMedia(constraints);
      } catch (err: any) {
        console.error("First camera request failed:", err);

        // Fallback to simplest possible constraints as last resort
        if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
          console.log("Trying fallback with minimal constraints");
          stream = await mediaDevices.getUserMedia({ video: true, audio: false });
        } else {
          throw err; // Re-throw if it's not a constraints issue
        }
      }

      console.log("Camera stream obtained successfully");

      // Make sure the video element exists
      if (!videoRef.current) {
        console.error("Video element reference is null");
        throw new Error("Video element not found");
      }

      // Set up the video element with the stream
      videoRef.current.srcObject = stream;

      console.log("Setting up event listeners");
      // Create a promise to handle video loading
      const videoLoadPromise = new Promise<void>((resolve, reject) => {
        if (!videoRef.current) return reject("Video element not found");

        // Set timeout for metadata loading
        const timeoutId = setTimeout(() => {
          console.warn("Video metadata loading timed out, trying to continue anyway");
          resolve(); // Resolve anyway after timeout
        }, 3000);

        // Set up event listeners
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          clearTimeout(timeoutId);
          resolve();
        };

        videoRef.current.onerror = (e) => {
          console.error("Video element error:", e);
          clearTimeout(timeoutId);
          reject("Video loading failed");
        };
      });

      // Wait for video to be ready
      await videoLoadPromise;

      if (videoRef.current) {
        console.log("Playing video");
        try {
          await videoRef.current.play();
          console.log("Camera started successfully");
          setCameraActive(true);
        } catch (e) {
          console.error("Error playing video:", e);
          throw new Error("Failed to start video playback");
        }
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraActive(false);

      // Provide specific error messages based on error type
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          setCameraError("Camera access denied. Please check your permissions.");
        } else if (error.name === 'NotFoundError') {
          setCameraError("No camera found on your device.");
        } else if (error.name === 'NotReadableError') {
          setCameraError("Camera is already in use by another application.");
        } else if (error.name === 'AbortError') {
          setCameraError("Camera access was aborted. Please try again.");
        } else if (error.name === 'NotSupportedError') {
          setCameraError("Your device or browser doesn't support camera access.");
        } else {
          setCameraError(`Camera error: ${error.name}. Please try file upload instead.`);
        }
      } else {
        setCameraError(error instanceof Error ? error.message : "Could not access camera. Please try file upload.");
      }
    }
  };

  const stopCamera = () => {
    try {
      console.log("Stopping camera...");

      if (!videoRef.current || !videoRef.current.srcObject) {
        console.log("No active camera to stop");
        return;
      }

      // Get all tracks and stop them
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();

      if (tracks.length === 0) {
        console.log("No tracks found in the stream");
      } else {
        console.log(`Stopping ${tracks.length} media tracks`);
        tracks.forEach(track => {
          track.stop();
          console.log(`Stopped track: ${track.kind}`);
        });
      }

      // Clean up video element
      videoRef.current.srcObject = null;
      setCameraActive(false);
      console.log("Camera stopped successfully");
    } catch (error) {
      console.error("Error stopping camera:", error);
      // Even if there's an error, ensure we mark the camera as inactive
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    try {
      console.log("Capturing image from camera...");

      if (!canvasRef.current) {
        console.error("Canvas reference is null");
        setCameraError("Cannot capture image: canvas not available");
        return;
      }

      // Need to check both video refs now
      if (!videoRef.current || !visibleVideoRef.current) {
        console.error("Video reference is null");
        setCameraError("Cannot capture image: video not available");
        return;
      }

      // Use the visible video for capture since it's the one displaying in the UI
      const videoToCapture = visibleVideoRef.current;

      // Check if video is actually playing
      if (videoToCapture.paused || videoToCapture.ended || !cameraActive) {
        console.error("Video is not actively playing");
        setCameraError("Cannot capture image: camera not active");
        return;
      }

      const context = canvasRef.current.getContext('2d');
      if (!context) {
        console.error("Could not get canvas context");
        setCameraError("Cannot capture image: browser support issue");
        return;
      }

      console.log(`Video dimensions: ${videoToCapture.videoWidth}x${videoToCapture.videoHeight}`);

      // Set canvas dimensions to match video
      canvasRef.current.width = videoToCapture.videoWidth || 640;
      canvasRef.current.height = videoToCapture.videoHeight || 480;

      // Clear the canvas first
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw the video frame to the canvas
      context.drawImage(videoToCapture, 0, 0, canvasRef.current.width, canvasRef.current.height);
      console.log("Image drawn to canvas");

      // Convert to image and display
      const imageDataUrl = canvasRef.current.toDataURL('image/png');
      console.log("Image captured successfully");

      // Clean up camera resources
      stopCamera();

      // Set the captured image and start identification
      setCapturedImage(imageDataUrl);
      performImageIdentification(imageDataUrl);
    } catch (error) {
      console.error("Error capturing image:", error);
      setCameraError("Failed to capture image. Please try again.");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setCapturedImage(imageDataUrl);

        // Use the new API-based identification
        performImageIdentification(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle mobile camera capture
  const handleMobileCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setCapturedImage(imageDataUrl);

        // Use the new API-based identification
        performImageIdentification(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  // Enhanced API-based identification function
  const performImageIdentification = async (imageDataUrl: string) => {
    setIsScanning(true);
    setScanProgress(0);
    setRecognitionStatus("scanning");

    try {
      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('StampImage', blob, 'stamp-image.jpg');

      // Get JWT token
      const jwt = getJWT();
      if (!jwt) {
        throw new Error('No JWT token found. Please login first.');
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return Math.min(90, prev + Math.floor(Math.random() * 15) + 5);
        });
      }, 200);

      // Make API call
      const apiResponse = await fetch('https://3pm-stampapp-prod.azurewebsites.net/api/v1/StampCatalog/SearchByImage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`
        },
        body: formData
      });

      clearInterval(progressInterval);

      if (!apiResponse.ok) {
        throw new Error(`API request failed: ${apiResponse.status} ${apiResponse.statusText}`);
      }

      const searchResult: ImageSearchResponse = await apiResponse.json();
      setScanProgress(100);

      // Process the API response
      if (searchResult.aiResponse && searchResult.aiResponse.isStamp) {
        processStampMatches(searchResult, imageDataUrl);
        setIsScanning(false);
        setRecognitionStatus("success");
      } else {
        throw new Error('No stamp detected in the image');
      }

    } catch (error) {
      console.error('Image identification failed:', error);
      setIsScanning(false);
      setRecognitionStatus("error");
      
      // Show error to user
      handleError(
        "Image Identification Failed",
        error instanceof Error ? error.message : 'Unknown error occurred while identifying the stamp'
      );
    }
  };

  // Function to process API stamp matches
  const processStampMatches = (searchResult: ImageSearchResponse, imageDataUrl: string) => {
    let primaryMatch: any = null;
    const similarMatches: any[] = [];

    // Process the main AI response as the primary match
    if (searchResult.aiResponse) {
      const transformedStamp = transformApiStampToInternal(searchResult.aiResponse, imageDataUrl);
      primaryMatch = {
        ...transformedStamp,
        apiData: searchResult.aiResponse
      };
    }

    // Process similar stamps as reference matches (use catalog images, not captured image)
    if (searchResult.similarStamps && searchResult.similarStamps.length > 0) {
      searchResult.similarStamps.forEach((similarStamp, index) => {
        const transformedStamp = transformApiStampToInternal(similarStamp, undefined);
        similarMatches.push({
          ...transformedStamp,
          apiData: similarStamp
        });
      });
    }

    if (primaryMatch) {
      // Set the structured response with separate primary and similar matches
      setSelectedStamp({ 
        primaryMatch, 
        similarMatches, 
        selectedIndex: 0,
        selectedType: 'primary' // Track whether primary or similar stamp is selected
      });
      const newScanID = Date.now().toString(36).substring(2, 7).toUpperCase();
      setScanID(newScanID);
      setCurrentView("reference");
    } else {
      throw new Error('No matching stamps found');
    }
  };

  // Function to handle user's final stamp selection
  const selectFinalStamp = (selectedMatch: any, index: number) => {
    // Update the selected stamp to the user's choice
    setSelectedStamp({ ...selectedMatch, finalSelection: true });

    // Use the API data to pre-populate form fields
    if (selectedMatch.apiData) {
      const formData = mapApiStampToFormData(selectedMatch.apiData);
      setStampObservations(formData);
    } else {
      // Fallback to basic pre-population for legacy stamps
      console.log("Using reference stamp defaults for:", selectedMatch.name);
    }
  };

  // Handle observation form updates
  const updateObservation = (field: string, value: any) => {
    setStampObservations(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleErrorType = (errorType: string) => {
    setStampObservations(prev => {
      const errors = [...prev.errors];
      if (errors.includes(errorType)) {
        return { ...prev, errors: errors.filter(e => e !== errorType) };
      } else {
        return { ...prev, errors: [...errors, errorType] };
      }
    });
  };

  const toggleColourShiftDirection = (direction: string) => {
    setStampObservations(prev => {
      const directions = [...prev.colourShift.directions];
      if (directions.includes(direction)) {
        return {
          ...prev,
          colourShift: {
            ...prev.colourShift,
            directions: directions.filter(d => d !== direction)
          }
        };
      } else {
        return {
          ...prev,
          colourShift: {
            ...prev.colourShift,
            directions: [...directions, direction]
          }
        };
      }
    });
  };

  const updateShiftDistance = (direction: string, value: number) => {
    setStampObservations(prev => ({
      ...prev,
      shiftDistance: {
        ...prev.shiftDistance,
        [direction]: value
      }
    }));
  };

  // Navigation functions
  const goToObservation = () => {
    setCurrentView("observation");
  };

  const goToReference = () => {
    setCurrentView("reference");
  };

  const resetScan = () => {
    setCapturedImage(null);
    setSelectedStamp(null);
    setStampObservations({
      watermark: "unknown-watermark",
      perforation: "unknown-perforation",
      paper: "unknown-paper",
      printType: "unknown-print",
      certifier: "none-certifier",
      itemType: "unknown-type",
      color: "unknown-color",
      millimeterSize: "unknown-size",
      errors: [],
      colourShift: {
        active: false,
        directions: []
      },
      shiftDistance: {
        left: 0,
        right: 0,
        up: 0,
        down: 0
      },
      grade: "",
      visualAppeal: 50,
      rarityRating: "unknown-rarity",
      plateNumber: "",
      words: "",
      purchasePrice: "",
      purchaseDate: "",
      notes: ""
    });
    setCurrentView("scan");
  };

  const applyObservations = () => {
    // After recording observations, save and complete the process
    console.log("Saving all stamp data for stamp ID:", scanID);
    console.log("Reference stamp:", selectedStamp?.name);
    console.log("Observations:", stampObservations);

    // Show success message
    setCurrentView("scan");
    setCapturedImage(null);
    setSelectedStamp(null);

    // Show success Alert instead of using alert()
    setRecognitionStatus("success");
    setTimeout(() => {
      resetScan();
    }, 3000);
  };

  // Function to open stamp detail modal
  const openStampDetail = (stamp: any) => {
    setDetailModalStamp(stamp);
    setDetailModalOpen(true);
  };

  // Handle successful stamp save
  const handleSaveSuccess = (message: string, stampData?: any) => {
    // Show success toast
    toast({
      title: "Success!",
      description: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {message}
        </div>
      ),
      variant: "success",
    });

    // Reset the entire scan state to allow for a new scan
    resetScan();
  };

  // Handle errors with toast
  const handleError = (title: string, message: string) => {
    toast({
      title: title,
      description: (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {message}
        </div>
      ),
      variant: "destructive",
    });
  };

  // Updates for mobile responsiveness
  return (
    <div className="container mx-auto py-4 md:py-6 px-4 md:px-6 max-w-4xl">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
        <div className="size-6 md:size-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">S</div>
        Stamp Scanner
      </h1>

      {/* Always render the video element but keep it hidden when not active */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        disablePictureInPicture
        disableRemotePlayback
        className={cameraActive ? "hidden" : "hidden"}
        style={{ position: "absolute", width: 0, height: 0 }}
      ></video>

      {currentView === "scan" && (
        <Card className="mb-4 md:mb-6 border-2 shadow-md overflow-hidden">
          <CardHeader className="bg-muted/50 p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Scan Your Stamp</CardTitle>
            <CardDescription>
              Position your stamp in view of the camera or upload an image
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              {!capturedImage && (
                <>
                  <div className="border-2 border-dashed rounded-lg aspect-video w-full mx-auto flex items-center justify-center bg-muted/30 relative">
                    {cameraActive ? (
                      <div className="w-full h-full">
                        <video
                          ref={visibleVideoRef}
                          autoPlay
                          playsInline
                          muted
                          disablePictureInPicture
                          disableRemotePlayback
                          controls={false}
                          className="w-full h-full object-cover"
                          style={{ transform: 'scaleX(1)' }}
                        ></video>
                      </div>
                    ) : (
                      <div className="text-center p-4 sm:p-6 md:p-8 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
                          <div className="size-12 sm:size-16 md:size-24 rounded-full bg-muted flex items-center justify-center">
                            <Camera className="size-6 sm:size-8 md:size-10 text-primary" />
                          </div>
                          <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-[280px] sm:max-w-md">
                            Use camera to scan your stamp or upload an image from your device
                          </p>
                          {cameraError && (
                            <Alert variant="destructive" className="mt-1 mb-1 py-2 text-xs sm:text-sm">
                              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              <AlertTitle className="text-xs sm:text-sm">Camera Error</AlertTitle>
                              <AlertDescription className="text-xs">
                                {cameraError}
                              </AlertDescription>
                            </Alert>
                          )}
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-xs sm:max-w-none justify-center">
                            <Button
                              onClick={startCamera}
                              className="gap-2 w-full sm:w-auto text-xs sm:text-sm"
                              size="default"
                            >
                              <Camera className="size-3 sm:size-4" />
                              {isMobileDevice() ? "Open Camera" : "Access Camera"}
                            </Button>
                            <div className="relative w-full sm:w-auto">
                              <Button
                                variant="outline"
                                className="gap-2 w-full sm:w-auto text-xs sm:text-sm"
                                size="default"
                              >
                                <Upload className="size-3 sm:size-4" />
                                Upload Image
                              </Button>
                              <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileUpload}
                              />
                            </div>
                          </div>

                          {/* Hidden input for mobile camera capture */}
                          <input
                            id="mobile-camera-input"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleMobileCameraCapture}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {cameraActive && (
                    <div className="flex justify-center mt-4 md:mt-6">
                      <Button
                        onClick={captureImage}
                        className="px-6 md:px-8 gap-2 w-full sm:w-auto"
                        size="default"
                      >
                        <Camera className="size-4" />
                        Capture
                      </Button>
                    </div>
                  )}
                </>
              )}

              {capturedImage && (
                <div className="space-y-4">
                  <div className="border-2 rounded-lg mx-auto overflow-hidden bg-white max-w-md">
                    <img
                      src={capturedImage}
                      alt="Captured stamp"
                      className="w-full h-auto object-contain max-h-96"
                    />
                  </div>

                  {isScanning ? (
                    <div className="space-y-4 mx-auto">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin text-primary" />
                          <span className="text-sm md:text-base">Analyzing image...</span>
                        </div>
                        <span className="text-sm md:text-base">{scanProgress}%</span>
                      </div>
                      <Progress value={scanProgress} className="h-2" />
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4 md:mt-6">
                      <Button
                        variant="outline"
                        onClick={resetScan}
                        className="gap-2 w-full sm:w-auto"
                      >
                        <RotateCcw className="size-4" />
                        Retake
                      </Button>
                      <Button
                        onClick={() => {
                          if (capturedImage) {
                            performImageIdentification(capturedImage);
                          } else {
                            console.error('No captured image available');
                            alert('No image available to identify. Please capture or upload an image first.');
                          }
                        }}
                        className="gap-2 w-full sm:w-auto"
                        disabled={!capturedImage}
                      >
                        <Check className="size-4" />
                        Identify Stamp
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
          </CardContent>
        </Card>
      )}

      {currentView === "reference" && selectedStamp && (
        <div className="space-y-4 md:space-y-6">
          <Card className="border-2 shadow-md">
            <CardHeader className="bg-muted/50 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-4 md:pb-3">
              <div>
                <CardTitle className="text-lg md:text-xl">
                  {selectedStamp.primaryMatch ? "AI Identified Stamp" : "Reference Stamp"}
                </CardTitle>
                <CardDescription>
                  {selectedStamp.primaryMatch
                    ? "Our AI has identified your stamp. Review the details and similar stamps below."
                    : "Match your stamp with this reference information"
                  }
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {selectedStamp.primaryMatch ? (
                // New structure with primary match and similar stamps
                <div className="space-y-6">
                  {/* Primary AI Match */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">AI Identified Stamp</h3>
                      <Badge variant="default" className="text-xs">Primary Match</Badge>
                    </div>
                    
                    <Card className={`border-2 max-w-sm mx-auto ${selectedStamp.selectedType === 'primary' && selectedStamp.selectedIndex === 0
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border'
                    }`}>
                      <CardContent className="space-y-4 flex-1 flex flex-col px-4 py-4">
                        <div className="aspect-square relative bg-white rounded border overflow-hidden">
                          <Image
                            src={selectedStamp.primaryMatch.imagePath}
                            alt={selectedStamp.primaryMatch.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="space-y-3 flex-1 flex flex-col">
                          <div>
                            <h3 className="font-semibold text-sm line-clamp-2 mb-2 leading-tight">{selectedStamp.primaryMatch.name}</h3>
                            <p className="text-xs text-muted-foreground truncate leading-relaxed">{selectedStamp.primaryMatch.description}</p>
                          </div>

                          {/* Essential info only */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1.5">
                              <Badge variant="outline" className="text-xs px-2 py-1">
                                {selectedStamp.primaryMatch.country}
                              </Badge>
                              <Badge variant="secondary" className="text-xs px-2 py-1">
                                {selectedStamp.primaryMatch.year}
                              </Badge>
                            </div>
                            
                            {/* Show denomination and series if available */}
                            {(selectedStamp.primaryMatch.denominationValue || selectedStamp.primaryMatch.seriesName) && (
                              <div className="flex flex-wrap gap-1.5">
                                {selectedStamp.primaryMatch.denominationValue && (
                                  <Badge variant="outline" className="text-xs bg-muted/30 px-2 py-1">
                                    {selectedStamp.primaryMatch.denominationValue}{selectedStamp.primaryMatch.denominationSymbol}
                                  </Badge>
                                )}
                                {selectedStamp.primaryMatch.seriesName && (
                                  <Badge variant="outline" className="text-xs bg-muted/30 px-2 py-1 max-w-[120px] truncate">
                                    {selectedStamp.primaryMatch.seriesName}
                                  </Badge>
                                )}
                              </div>
                            )}
                            
                            {/* Show color and catalog info */}
                            <div className="flex flex-wrap gap-1.5">
                              {(selectedStamp.primaryMatch.colors && selectedStamp.primaryMatch.colors.length > 0) || selectedStamp.primaryMatch.color ? (
                                <Badge variant="outline" className="text-xs bg-muted/30 px-2 py-1">
                                  {selectedStamp.primaryMatch.color || selectedStamp.primaryMatch.colors[0]}
                                </Badge>
                              ) : null}
                              {selectedStamp.primaryMatch.catalogName && selectedStamp.primaryMatch.catalogNumber && (
                                <Badge variant="outline" className="text-xs bg-muted/30 px-2 py-1">
                                  {selectedStamp.primaryMatch.catalogName} {selectedStamp.primaryMatch.catalogNumber}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Show rarity if available */}
                            {selectedStamp.primaryMatch.rarenessLevel && (
                              <div className="flex flex-wrap gap-1.5">
                                <Badge variant="secondary" className="text-xs px-2 py-1">
                                  {selectedStamp.primaryMatch.rarenessLevel}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 pt-3 mt-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs h-8 min-w-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                openStampDetail(selectedStamp.primaryMatch);
                              }}
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 text-xs h-8 min-w-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStamp((prev: any) => ({ ...prev, selectedIndex: 0, selectedType: 'primary' }));
                              }}
                              variant={selectedStamp.selectedType === 'primary' && selectedStamp.selectedIndex === 0 ? "default" : "outline"}
                            >
                              {selectedStamp.selectedType === 'primary' && selectedStamp.selectedIndex === 0 ? "Selected" : "Select"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Similar Stamps Section */}
                  {selectedStamp.similarMatches && selectedStamp.similarMatches.length > 0 && (
                    <div className="space-y-4">
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertTitle>Similar Stamps Found</AlertTitle>
                        <AlertDescription>
                          We found {selectedStamp.similarMatches.length} similar stamp{selectedStamp.similarMatches.length !== 1 ? 's' : ''} that might be related to your stamp.
                          You can review these as alternative options.
                        </AlertDescription>
                      </Alert>

                      {/* Similar stamps grid */}
                      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {selectedStamp.similarMatches.map((match: any, index: number) => (
                          <Card
                            key={match.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 min-h-[450px] w-full ${selectedStamp.selectedType === 'similar' && selectedStamp.selectedIndex === index
                              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/50'
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              openStampDetail(match);
                            }}
                          >
                            <CardContent className="space-y-4 flex-1 flex flex-col px-4 py-4">
                              <div className="aspect-square relative bg-white rounded border overflow-hidden">
                                <Image
                                  src={match.imagePath}
                                  alt={match.name}
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>
                              <div className="space-y-3 flex-1 flex flex-col">
                                <div>
                                  <h3 className="font-semibold text-sm line-clamp-2 mb-2 leading-tight">{match.name}</h3>
                                  <p className="text-xs text-muted-foreground truncate leading-relaxed">{match.description}</p>
                                </div>

                                {/* Essential info only */}
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-1.5">
                                    <Badge variant="outline" className="text-xs px-2 py-1">
                                      {match.country}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs px-2 py-1">
                                      {match.year}
                                    </Badge>
                                  </div>
                                  
                                  {/* Show denomination and series if available */}
                                  {(match.denominationValue || match.seriesName) && (
                                    <div className="flex flex-wrap gap-1.5">
                                      {match.denominationValue && (
                                        <Badge variant="outline" className="text-xs bg-muted/30 px-2 py-1">
                                          {match.denominationValue}{match.denominationSymbol}
                                        </Badge>
                                      )}
                                      {match.seriesName && (
                                        <Badge variant="outline" className="text-xs bg-muted/30 px-2 py-1 truncate">
                                          {match.seriesName}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Show color and catalog info */}
                                  <div className="flex flex-wrap gap-1.5">
                                    {(match.colors && match.colors.length > 0) || match.color ? (
                                      <Badge variant="outline" className="text-xs bg-muted/30 px-2 py-1">
                                        {match.color || match.colors[0]}
                                      </Badge>
                                    ) : null}
                                    {match.catalogName && match.catalogNumber && (
                                      <Badge variant="outline" className="text-xs bg-muted/30 px-2 py-1">
                                        {match.catalogName} {match.catalogNumber}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {/* Show rarity if available */}
                                  {match.rarenessLevel && (
                                    <div className="flex flex-wrap gap-1.5">
                                      <Badge variant="secondary" className="text-xs px-2 py-1">
                                        {match.rarenessLevel}
                                      </Badge>
                                    </div>
                                  )}
                                </div>

                                {/* Action buttons - pushed to bottom */}
                                <div className="flex flex-col sm:flex-row gap-2 pt-3 mt-auto">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs h-8 min-w-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openStampDetail(match);
                                    }}
                                  >
                                    View Details
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="flex-1 text-xs h-8 min-w-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedStamp((prev: any) => ({ ...prev, selectedIndex: index, selectedType: 'similar' }));
                                    }}
                                    variant={selectedStamp.selectedType === 'similar' && selectedStamp.selectedIndex === index ? "default" : "outline"}
                                  >
                                    {selectedStamp.selectedType === 'similar' && selectedStamp.selectedIndex === index ? "Selected" : "Select"}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Show summary for large numbers of similar matches */}
                      {selectedStamp.similarMatches.length > 6 && (
                        <div className="text-center text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                          <p>Showing all {selectedStamp.similarMatches.length} similar stamps for reference.</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={resetScan}
                      className="gap-2"
                    >
                      <RotateCcw className="size-4" />
                      Start Over
                    </Button>
                    <Button
                      onClick={() => {
                        let selectedMatch;
                        if (selectedStamp.selectedType === 'primary') {
                          selectedMatch = selectedStamp.primaryMatch;
                        } else {
                          selectedMatch = selectedStamp.similarMatches[selectedStamp.selectedIndex];
                        }
                        selectFinalStamp(selectedMatch, selectedStamp.selectedIndex);
                        goToObservation();
                      }}
                      className="gap-2"
                      disabled={!selectedStamp.selectedType || (selectedStamp.selectedType === 'similar' && selectedStamp.selectedIndex === undefined)}
                    >
                      <Check className="size-4" />
                      Confirm Selection
                    </Button>
                  </div>
                </div>
              ) : (
                // Single match view (existing logic)
                <>
                  {/* Auto-population notification */}
                  {simulatedStampDatabase.some(s => s.refId === selectedStamp.id) && (
                    <Alert className="mb-4 md:mb-6 bg-primary/10 border-primary">
                      <Check className="h-4 w-4 text-primary" />
                      <AlertTitle>Stamp found in collection</AlertTitle>
                      <AlertDescription>
                        This stamp has been identified in your collection. Details have been automatically filled in.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <StampViewer
                        stamp={selectedStamp}
                        scanID={scanID}
                        onBack={resetScan}
                      />
                    </div>

                    <ReferenceInfo
                      stamp={selectedStamp}
                      onAccept={goToObservation}
                      onReject={resetScan}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {currentView === "observation" && selectedStamp && (
        <div className="flex-1 overflow-hidden">
          <StampObservationManager
            selectedStamp={{
              id: selectedStamp.finalSelection ? selectedStamp.id : selectedStamp.refId,
              image: selectedStamp.finalSelection ? selectedStamp.imagePath : (selectedStamp.imagePath || capturedImage || ""),
              scannedImage: capturedImage || undefined,
              apiData: selectedStamp.finalSelection ? selectedStamp.apiData : null,
              stampData: selectedStamp
            }}
            onCancel={() => setCurrentView("scan")}
            onSuccess={handleSaveSuccess}
          />
        </div>
      )}

      {/* Stamp Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-lg">{detailModalStamp?.name}</DialogTitle>
          </DialogHeader>

          {detailModalStamp && (
            <div className="space-y-4">
              {/* Image */}
              <div className="w-full aspect-square relative bg-white rounded-lg border overflow-hidden">
                <Image
                  src={detailModalStamp.imagePath}
                  alt={detailModalStamp.name}
                  fill
                  className="object-contain p-4"
                />
              </div>

              {/* All Information in compact list */}
              <div className="space-y-3">
                {/* Basic Details */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground border-b pb-1">Basic Information</h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Country</span>
                      <span className="font-medium">{detailModalStamp.country}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Year</span>
                      <span className="font-medium">{detailModalStamp.year}</span>
                    </div>
                    {detailModalStamp.seriesName && (
                      <div className="flex justify-between items-start">
                        <span className="text-muted-foreground">Series</span>
                        <span className="font-medium text-right max-w-[200px] text-xs leading-tight">{detailModalStamp.seriesName}</span>
                      </div>
                    )}
                    {detailModalStamp.denominationValue && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Denomination</span>
                        <span className="font-medium">{detailModalStamp.denominationValue}{detailModalStamp.denominationSymbol}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Description</span>
                      <span className="font-medium text-right max-w-[200px] text-xs leading-tight">{detailModalStamp.description}</span>
                    </div>
                  </div>
                </div>

                {/* Catalog Information */}
                {(detailModalStamp.catalogName || detailModalStamp.catalogNumber || detailModalStamp.catalogId) && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-1">Catalog Information</h3>
                    <div className="space-y-1.5 text-sm">
                      {detailModalStamp.catalogName && detailModalStamp.catalogNumber && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">{detailModalStamp.catalogName}</span>
                          <Badge variant="outline" className="text-xs">
                            {detailModalStamp.catalogNumber}
                          </Badge>
                        </div>
                      )}
                      {detailModalStamp.catalogId && (
                        <div className="flex justify-between items-start">
                          <span className="text-muted-foreground">Catalog ID</span>
                          <span className="font-medium text-right max-w-[200px] text-xs leading-tight break-all">{detailModalStamp.catalogId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Technical Specifications */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground border-b pb-1">Technical Details</h3>
                  <div className="space-y-1.5 text-sm">
                    {(detailModalStamp.colors && detailModalStamp.colors.length > 0) || detailModalStamp.color && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Color</span>
                        <Badge variant="secondary" className="text-xs">
                          {detailModalStamp.color || detailModalStamp.colors[0]}
                        </Badge>
                      </div>
                    )}

                    {detailModalStamp.design && (
                      <div className="flex justify-between items-start">
                        <span className="text-muted-foreground">Design</span>
                        <span className="font-medium text-right max-w-[200px] text-xs leading-tight">{detailModalStamp.design}</span>
                      </div>
                    )}

                    {detailModalStamp.theme && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Theme</span>
                        <Badge variant="outline" className="text-xs">
                          {detailModalStamp.theme}
                        </Badge>
                      </div>
                    )}

                    {((detailModalStamp.watermarkOptions && detailModalStamp.watermarkOptions.length > 0) || detailModalStamp.watermark) && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Watermark</span>
                        <Badge variant="outline" className="text-xs">
                          {detailModalStamp.watermark || detailModalStamp.watermarkOptions[0]}
                        </Badge>
                      </div>
                    )}

                    {((detailModalStamp.perforationOptions && detailModalStamp.perforationOptions.length > 0) || detailModalStamp.perforation) && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Perforation</span>
                        <Badge variant="outline" className="text-xs">
                          {detailModalStamp.perforation || detailModalStamp.perforationOptions[0]}
                        </Badge>
                      </div>
                    )}

                    {((detailModalStamp.paperTypes && detailModalStamp.paperTypes.length > 0) || detailModalStamp.paperType) && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Paper</span>
                        <Badge variant="outline" className="text-xs">
                          {detailModalStamp.paperType || detailModalStamp.paperTypes[0]}
                        </Badge>
                      </div>
                    )}

                    {((detailModalStamp.printTypes && detailModalStamp.printTypes.length > 0) || detailModalStamp.printing) && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Printing</span>
                        <Badge variant="outline" className="text-xs">
                          {detailModalStamp.printing || detailModalStamp.printTypes[0]}
                        </Badge>
                      </div>
                    )}

                    {detailModalStamp.size && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Size</span>
                        <span className="font-medium text-xs">{detailModalStamp.size}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Production Information */}
                {(detailModalStamp.artist || detailModalStamp.engraver || detailModalStamp.printingQuantity || detailModalStamp.usagePeriod) && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-1">Production Details</h3>
                    <div className="space-y-1.5 text-sm">
                      {detailModalStamp.artist && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Artist</span>
                          <span className="font-medium text-xs">{detailModalStamp.artist}</span>
                        </div>
                      )}
                      {detailModalStamp.engraver && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Engraver</span>
                          <span className="font-medium text-xs">{detailModalStamp.engraver}</span>
                        </div>
                      )}
                      {detailModalStamp.printingQuantity && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Print Quantity</span>
                          <span className="font-medium text-xs">{detailModalStamp.printingQuantity.toLocaleString()}</span>
                        </div>
                      )}
                      {detailModalStamp.usagePeriod && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Usage Period</span>
                          <span className="font-medium text-xs">{detailModalStamp.usagePeriod}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Condition & Rarity */}
                {(detailModalStamp.rarenessLevel || detailModalStamp.hasGum !== undefined || detailModalStamp.gumCondition) && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-1">Condition & Rarity</h3>
                    <div className="space-y-1.5 text-sm">
                      {detailModalStamp.rarenessLevel && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Rarity</span>
                          <Badge variant="secondary" className="text-xs">
                            {detailModalStamp.rarenessLevel}
                          </Badge>
                        </div>
                      )}
                      {detailModalStamp.hasGum !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Has Gum</span>
                          <Badge variant={detailModalStamp.hasGum ? "default" : "outline"} className="text-xs">
                            {detailModalStamp.hasGum ? "Yes" : "No"}
                          </Badge>
                        </div>
                      )}
                      {detailModalStamp.gumCondition && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Gum Condition</span>
                          <span className="font-medium text-xs">{detailModalStamp.gumCondition}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Historical Information */}
                {(detailModalStamp.specialNotes || detailModalStamp.historicalContext) && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-1">Historical Information</h3>
                    <div className="space-y-1.5 text-sm">
                      {detailModalStamp.specialNotes && (
                        <div>
                          <span className="text-muted-foreground block mb-1">Special Notes</span>
                          <p className="text-xs leading-relaxed bg-muted/30 p-2 rounded">{detailModalStamp.specialNotes}</p>
                        </div>
                      )}
                      {detailModalStamp.historicalContext && (
                        <div>
                          <span className="text-muted-foreground block mb-1">Historical Context</span>
                          <p className="text-xs leading-relaxed bg-muted/30 p-2 rounded">{detailModalStamp.historicalContext}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setDetailModalOpen(false)} className="flex-1">
              Close
            </Button>
            <Button
              onClick={() => {
                if (detailModalStamp) {
                  // Check if it's the primary match
                  if (selectedStamp.primaryMatch && selectedStamp.primaryMatch.id === detailModalStamp.id) {
                    setSelectedStamp((prev: any) => ({ ...prev, selectedIndex: 0, selectedType: 'primary' }));
                  } else {
                    // Check if it's in similar matches
                    const matchIndex = selectedStamp.similarMatches?.findIndex((m: any) => m.id === detailModalStamp.id);
                    if (matchIndex !== -1) {
                      setSelectedStamp((prev: any) => ({ ...prev, selectedIndex: matchIndex, selectedType: 'similar' }));
                    }
                  }
                }
                setDetailModalOpen(false);
              }}
              className="flex-1"
            >
              Select This Stamp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ProtectedScanPage() {
  return (
    <AuthGuard>
      <ScanPage />
      <Toaster />
    </AuthGuard>
  )
}
