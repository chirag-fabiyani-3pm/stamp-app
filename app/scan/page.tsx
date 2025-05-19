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
import { Check, Camera, Upload, RotateCcw, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import StampViewer from "@/components/scan/stamp-viewer"
import ReferenceInfo from "@/components/scan/reference-info"
import StampObservationManager from "@/components/scan/stamp-observation-manager"
import StampOptions from "@/components/scan/stamp-options"

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
    rarityRating: "Scarce (S) - 100,000-1,000,000 exist",
    grade: "Fine",
    purchasePrice: "500.00",
    purchaseDate: "2022-11-03",
    notes: "First adhesive postage stamp in the world",
    visualAppeal: 80
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

export default function ScanPage() {
  // State for the scan interface
  const [currentView, setCurrentView] = useState<"scan" | "reference" | "observation" | "options">("scan");
  const [scanID, setScanID] = useState<string>("");
  const [selectedStamp, setSelectedStamp] = useState<any>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [recognitionStatus, setRecognitionStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  
  // Root level options state
  const [stampRootOptions, setStampRootOptions] = useState({
    id: "",
    name: "",
    certifier: "",
    itemType: "",
    colour: "",
    country: "",
    wordsSymbols: "",
    imageDescription: "",
    dateOfIssue: "",
    paperType: "",
    perforationType: "",
    watermarkType: "",
    error: "",
    cancellation: "",
    plates: "",
    plating: {
      positionNumber: "",
      gridReference: "",
      flawDescription: "",
      textOnFace: "",
      plateNumber: "",
      settingNumber: "",
      textColor: "",
      flawImage: null
    },
    collectorGroup: "",
    rarityRating: "",
    grade: "",
    purchasePrice: "",
    purchaseDate: "",
    notes: "",
    visualAppeal: 50
  });
  
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
      navigator.mediaDevices.getUserMedia = function(constraints: MediaStreamConstraints) {
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
  
  // Camera functions
  const startCamera = async () => {
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
      simulateIdentification(imageDataUrl);
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
        
        // Always use penny-black for consistent demo experience
        findStampMatch("penny-black");
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Enhanced simulate function for a better demo
  const simulateIdentification = (imageDataUrl: string) => {
    setIsScanning(true);
    setScanProgress(0);
    setRecognitionStatus("scanning");
    
    // Always use penny-black for consistent demo experience
    const stampToRecognize = "penny-black";
    
    // Simulate progress with more realistic timing
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        // Add some randomness to the progress for realism
        return Math.min(95, prev + Math.floor(Math.random() * 15) + 5);
      });
    }, 200);
    
    // Simulate completion after a short delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setScanProgress(100);
      
      // Use the pre-selected stamp for guaranteed auto-population demonstration
      findStampMatch(stampToRecognize);
      setIsScanning(false);
      setRecognitionStatus("success");
    }, 2000);
  };
  
  // Function to find and set the matched stamp - modified to auto-populate
  const findStampMatch = (stampId: string) => {
    const stamp = referenceStampDatabase.find(s => s.id === stampId);
    if (stamp) {
      setSelectedStamp(stamp);
      const newScanID = Date.now().toString(36).substring(2, 7).toUpperCase();
      setScanID(newScanID);
      
      // Check if this stamp exists in a simulated database and auto-populate data
      // In a real application, this would be a database lookup
      const existingStampData = simulatedStampDatabase.find(s => s.refId === stampId);
      
      if (existingStampData) {
        // Auto-populate from existing data
        // Convert any legacy string-based plating data to the new object format if needed
        const platingData = typeof existingStampData.plating === 'string' 
          ? {
              positionNumber: "",
              gridReference: "",
              flawDescription: existingStampData.plating || "", // Use old string as description
              textOnFace: "",
              plateNumber: existingStampData.plates || "",
              settingNumber: "",
              textColor: "",
              flawImage: null
            }
          : existingStampData.plating || {
              positionNumber: "",
              gridReference: "",
              flawDescription: "",
              textOnFace: "",
              plateNumber: existingStampData.plates || "",
              settingNumber: "",
              textColor: "",
              flawImage: null
            };
            
        setStampRootOptions({
          id: newScanID,
          name: existingStampData.name,
          certifier: existingStampData.certifier,
          itemType: existingStampData.itemType,
          colour: existingStampData.colour,
          country: existingStampData.country,
          wordsSymbols: existingStampData.wordsSymbols,
          imageDescription: existingStampData.imageDescription,
          dateOfIssue: existingStampData.dateOfIssue,
          paperType: existingStampData.paperType,
          perforationType: existingStampData.perforationType,
          watermarkType: existingStampData.watermarkType,
          error: existingStampData.error,
          cancellation: existingStampData.cancellation,
          plates: existingStampData.plates,
          plating: platingData,
          collectorGroup: existingStampData.collectorGroup || "",
          rarityRating: existingStampData.rarityRating,
          grade: existingStampData.grade,
          purchasePrice: existingStampData.purchasePrice,
          purchaseDate: existingStampData.purchaseDate,
          notes: existingStampData.notes,
          visualAppeal: existingStampData.visualAppeal,
        });
        
        // Also update observations to match existing data
        setStampObservations({
          watermark: existingStampData.watermarkType || "unknown-watermark",
          perforation: existingStampData.perforationType || "unknown-perforation",
          paper: existingStampData.paperType || "unknown-paper",
          printType: "unknown-print", // Assume this might not be in our data
          certifier: existingStampData.certifier || "none-certifier",
          itemType: existingStampData.itemType || "unknown-type",
          color: existingStampData.colour || "unknown-color",
          millimeterSize: "unknown-size",
          errors: existingStampData.error !== "None" ? [existingStampData.error] : [],
          colourShift: {
            active: existingStampData.error === "Colour Shift",
            directions: []
          },
          shiftDistance: {
            left: 0,
            right: 0,
            up: 0,
            down: 0
          },
          grade: existingStampData.grade || "",
          visualAppeal: existingStampData.visualAppeal || 50,
          rarityRating: existingStampData.rarityRating || "unknown-rarity",
          plateNumber: existingStampData.plates || "",
          words: existingStampData.wordsSymbols || "",
          purchasePrice: existingStampData.purchasePrice || "",
          purchaseDate: existingStampData.purchaseDate || "",
          notes: existingStampData.notes || ""
        });
      } else {
        // Pre-populate with defaults from reference stamp
        setStampRootOptions(prev => ({
          ...prev,
          id: newScanID,
          name: stamp.name,
          country: stamp.country,
          colour: stamp.colors[0] || "",
          perforationType: stamp.perforationOptions[0] || "",
          watermarkType: stamp.watermarkOptions[0] || "",
          plating: {
            positionNumber: "",
            gridReference: "",
            flawDescription: "",
            textOnFace: "",
            plateNumber: "",
            settingNumber: "",
            textColor: "",
            flawImage: null
          }
        }));
      }
      
      setCurrentView("reference");
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
  
  // Root options update handler
  const updateRootOption = (field: string, value: any) => {
    setStampRootOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Navigation functions
  const goToObservation = () => {
    setCurrentView("observation");
  };
  
  const goToReference = () => {
    setCurrentView("reference");
  };
  
  const goToOptions = () => {
    setCurrentView("options");
  };
  
  const openDefectiveFolder = () => {
    // In a real app, this would open a folder of defective images
    alert("Opening defective image folder...");
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
    setStampRootOptions({
      id: "",
      name: "",
      certifier: "",
      itemType: "",
      colour: "",
      country: "",
      wordsSymbols: "",
      imageDescription: "",
      dateOfIssue: "",
      paperType: "",
      perforationType: "",
      watermarkType: "",
      error: "",
      cancellation: "",
      plates: "",
      plating: {
        positionNumber: "",
        gridReference: "",
        flawDescription: "",
        textOnFace: "",
        plateNumber: "",
        settingNumber: "",
        textColor: "",
        flawImage: null
      },
      collectorGroup: "",
      rarityRating: "",
      grade: "",
      purchasePrice: "",
      purchaseDate: "",
      notes: "",
      visualAppeal: 50
    });
    setCurrentView("scan");
  };
  
  const applyObservations = () => {
    // After recording observations, go to root options
    goToOptions();
  };
  
  const saveRootOptions = () => {
    // In a real app, this would save all data to a database
    console.log("Saving all stamp data for stamp ID:", scanID);
    console.log("Reference stamp:", selectedStamp?.name);
    console.log("Observations:", stampObservations);
    console.log("Root Options:", stampRootOptions);
    
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
                              Access Camera
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
                  <div className="border-2 rounded-lg mx-auto overflow-hidden bg-white">
                    <img
                      src={capturedImage}
                      alt="Captured stamp"
                      className="w-full object-contain"
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
                        onClick={() => simulateIdentification(capturedImage)}
                        className="gap-2 w-full sm:w-auto"
                      >
                        <Check className="size-4" />
                        Identify Stamp
                      </Button>
                    </div>
                  )}
                  
                  {recognitionStatus === "error" && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Could not identify the stamp. Please try again with a clearer image.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
          </CardContent>
          
          {recognitionStatus === "success" && !capturedImage && (
            <CardFooter className="bg-muted/30 p-4">
              <Alert className="w-full bg-green-50 border-green-400">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Stamp details saved successfully to your collection.
                </AlertDescription>
              </Alert>
            </CardFooter>
          )}
        </Card>
      )}
      
      {currentView === "reference" && selectedStamp && (
        <div className="space-y-4 md:space-y-6">
          <Card className="border-2 shadow-md">
            <CardHeader className="bg-muted/50 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-4 md:pb-3">
              <div>
                <CardTitle className="text-lg md:text-xl">Reference Stamp</CardTitle>
                <CardDescription>
                  Match your stamp with this reference information
                </CardDescription>
              </div>
              <div className="flex items-center text-sm">
                <span className="mr-2 text-muted-foreground">Image ID: </span>
                <Badge variant="outline" className="font-mono">{scanID}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
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
            </CardContent>
          </Card>
        </div>
      )}
      
      {currentView === "observation" && selectedStamp && (
        <div className="flex-1 overflow-hidden">
          <StampObservationManager
            selectedStamp={{
              id: selectedStamp.refId,
              image: selectedStamp.imagePath || capturedImage || "",
            }}
            onSave={applyObservations}
            onCancel={() => setCurrentView("scan")}
          />
        </div>
      )}
      
      {currentView === "options" && selectedStamp && (
        <div className="space-y-4 md:space-y-6">
          <Card className="border-2 shadow-md">
            <CardHeader className="bg-muted/50 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-4 md:pb-3">
              <div>
                <CardTitle className="text-lg md:text-xl">Stamp Cataloging Options</CardTitle>
                <CardDescription>
                  Adjust and finalize catalog details for this stamp
                </CardDescription>
              </div>
              <div className="flex items-center text-sm">
                <span className="mr-2 text-muted-foreground">Image ID: </span>
                <Badge variant="outline" className="font-mono">{scanID}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Auto-population reminder */}
              {simulatedStampDatabase.some(s => s.refId === selectedStamp.id) && (
                <div className="px-4 md:px-6 pt-4 md:pt-6">
                  <Alert className="bg-primary/10 border-primary">
                    <Check className="h-4 w-4 text-primary" />
                    <AlertTitle>Pre-populated details</AlertTitle>
                    <AlertDescription>
                      Fields have been pre-filled based on your existing records. You can review and modify if needed.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-6 pt-4">
                <div className="lg:col-span-1">
                  <div className="sticky top-4">
                    <div className="mb-4 overflow-hidden bg-white rounded-lg shadow-md">
                      <Card className="border-none shadow-sm">
                        <CardContent className="p-4 aspect-square relative">
                          <div className="absolute inset-0">
                            <Image
                              src={selectedStamp.imagePath}
                              alt={selectedStamp.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="border-none shadow-sm">
                      <CardHeader className="pb-2 pt-3">
                        <CardTitle className="text-base">Reference Details</CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0">
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between border-b border-muted pb-1">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{selectedStamp.name}</span>
                          </div>
                          {selectedStamp.description && (
                            <div className="flex justify-between border-b border-muted pb-1">
                              <span className="text-muted-foreground">Description:</span>
                              <span className="font-medium">{selectedStamp.description}</span>
                            </div>
                          )}
                          {selectedStamp.year && (
                            <div className="flex justify-between border-b border-muted pb-1">
                              <span className="text-muted-foreground">Year:</span>
                              <span className="font-medium">{selectedStamp.year}</span>
                            </div>
                          )}
                          {selectedStamp.country && (
                            <div className="flex justify-between border-b border-muted pb-1">
                              <span className="text-muted-foreground">Country:</span>
                              <span className="font-medium">{selectedStamp.country}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <StampOptions 
                    stampData={stampRootOptions}
                    onUpdate={updateRootOption}
                    onSave={saveRootOptions}
                    onOpenDefectiveFolder={openDefectiveFolder}
                    referenceData={selectedStamp}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
