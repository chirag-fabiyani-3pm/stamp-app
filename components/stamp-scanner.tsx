"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload, Loader2, Check, AlertCircle, RefreshCw, ZoomIn, Search } from "lucide-react"
import StampResult from "@/components/stamp-result"
import EditableStampResult from "@/components/editable-stamp-result"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import StampRefinementModal from "@/components/stamp-refinement-modal"

export default function StampScanner() {
  const [activeTab, setActiveTab] = useState("camera")
  const [scanState, setScanState] = useState<"idle" | "scanning" | "success" | "error">("idle")
  const [showResults, setShowResults] = useState(false)
  const [showEditableResults, setShowEditableResults] = useState(false)
  const [recognitionConfidence, setRecognitionConfidence] = useState(87)
  const [possibleMatches, setPossibleMatches] = useState(3)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isRefinementOpen, setIsRefinementOpen] = useState(false)
  const [selectedFeatureType, setSelectedFeatureType] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [analyzingStatus, setAnalyzingStatus] = useState<string | null>(null)
  const [analyzeStage, setAnalyzeStage] = useState(0)
  const [identifiedStampType, setIdentifiedStampType] = useState<string | null>(null)

  // Mock data for demonstration
  const mockStampData = {
    country: "New Zealand",
    year: 1935,
    denomination: "1 Penny",
    color: "Purple",
    condition: "Excellent",
    rarity: "Uncommon",
    designElements: ["Portrait of King George V", "Silver Jubilee medallion", "Royal crown", "New Zealand inscription"],
    historicalSignificance:
      "This stamp was issued to commemorate the Silver Jubilee (25th anniversary) of King George V's accession to the throne. It was part of a series of commemorative stamps issued throughout the British Empire to celebrate this significant royal milestone.",
    estimatedValue: "NZ$45 - NZ$60",
    catalogReference: "SG 573, Scott 145",
    soaCode: "SOA-NZ-004.1",
    similarVarieties: [
      { id: "nz-silver-jubilee-1d-purple", name: "1d Purple", differentiatingFeatures: ["Standard perforations", "Normal watermark"] },
      { id: "nz-silver-jubilee-1d-purple-inv", name: "1d Purple (Inverted Watermark)", differentiatingFeatures: ["Standard perforations", "Inverted watermark"] },
      { id: "nz-silver-jubilee-1d-purple-imperf", name: "1d Purple (Imperforate)", differentiatingFeatures: ["No perforations", "Normal watermark"] },
    ],
    possibleVarieties: [
      { name: "Standard Issue", probability: 65, id: "nz-silver-jubilee-1d-purple" },
      { name: "Inverted Watermark", probability: 25, id: "nz-silver-jubilee-1d-purple-inv" },
      { name: "Imperforate Error", probability: 10, id: "nz-silver-jubilee-1d-purple-imperf" },
    ]
  }

  useEffect(() => {
    return () => {
      // Clean up camera when component unmounts
      if (isCameraActive) {
        stopCamera();
      }
    };
  }, [isCameraActive]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setScanState("error");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Start the scanning process with the captured image
        handleScan();
      }
    }
  };

  const runImageAnalysis = () => {
    setAnalyzingStatus("Analyzing image...");
    setAnalyzeStage(1);
    
    // Simulate analysis stages
    setTimeout(() => {
      setAnalyzingStatus("Detecting stamp borders...");
      setAnalyzeStage(2);
    }, 800);
    
    setTimeout(() => {
      setAnalyzingStatus("Identifying color profile...");
      setAnalyzeStage(3);
    }, 1600);
    
    setTimeout(() => {
      setAnalyzingStatus("Detecting design elements...");
      setAnalyzeStage(4);
    }, 2400);
    
    setTimeout(() => {
      setAnalyzingStatus("Matching against catalog...");
      setAnalyzeStage(5);
    }, 3200);
    
    setTimeout(() => {
      setAnalyzingStatus("Analyzing perforations and watermarks...");
      setAnalyzeStage(6);
    }, 4000);
    
    setTimeout(() => {
      setIdentifiedStampType("Silver Jubilee Series (1935)");
      setAnalyzingStatus("Complete! Stamp identified.");
      setAnalyzeStage(7);
    }, 4800);
    
    setTimeout(() => {
      setScanState("success");
      setShowResults(true);
    }, 5500);
  };

  const handleScan = () => {
    setScanState("scanning");
    runImageAnalysis();
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScanState("scanning");
      
      // Display the uploaded image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && canvasRef.current) {
          const img = new Image();
          img.onload = () => {
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // Run the analysis on the uploaded image
                runImageAnalysis();
              }
            }
          };
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  const handleEditDetails = () => {
    setShowResults(false);
    setShowEditableResults(true);
  }

  const handleCompleteEdit = (editedData: any) => {
    console.log("Edited stamp data:", editedData);
    // In a real app, you would save this data to your database
    setShowEditableResults(false);
    // Show success message or redirect
  }

  const handleOpenRefinement = () => {
    setIsRefinementOpen(true);
  }

  const handleCloseRefinement = () => {
    setIsRefinementOpen(false);
  }

  const handleRefinementComplete = (refinedData: any) => {
    console.log("Refined stamp identification:", refinedData);
    setIsRefinementOpen(false);
    
    // In a real app, you would update the identified stamp with the refined data
    // and then show the updated results
    setShowResults(true);
  }

  if (showResults) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Scan Results</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleOpenRefinement}>Refine Identification</Button>
            <Button onClick={handleEditDetails}>Edit Details</Button>
          </div>
        </div>
        <StampResult data={mockStampData} />
        {isRefinementOpen && (
          <StampRefinementModal 
            isOpen={isRefinementOpen} 
            onClose={handleCloseRefinement} 
            onComplete={handleRefinementComplete}
            stampData={mockStampData}
          />
        )}
      </div>
    )
  }

  if (showEditableResults) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => {
              setShowEditableResults(false);
              setShowResults(true);
            }}
            className="mr-4"
          >
            Back to Results
          </Button>
          <h2 className="text-2xl font-bold">Edit Stamp Details</h2>
        </div>
        <EditableStampResult data={mockStampData as any} onComplete={handleCompleteEdit} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Image Recognition Scanner</h2>
        <p className="text-muted-foreground">
          Scan or upload an image of your stamp to identify it and explore its varieties.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera" onClick={() => activeTab !== "camera" && startCamera()}>
            <Camera className="mr-2 h-4 w-4" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="upload" onClick={() => isCameraActive && stopCamera()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-muted relative flex items-center justify-center overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className={`h-full w-full object-cover transform scale-${zoomLevel}`} 
                  style={{ transform: `scale(${zoomLevel})` }}
                  onPlay={() => setIsCameraActive(true)}
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isCameraActive && scanState === "idle" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <Camera className="h-20 w-20 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg mb-4">Camera access required</p>
                    <Button 
                      onClick={startCamera} 
                      variant="default" 
                      size="lg"
                      className="px-8"
                    >
                      Start Camera
                    </Button>
                  </div>
                )}

                {scanState === "scanning" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                    <div className="text-center text-white space-y-4 max-w-md px-4">
                      {analyzeStage < 7 ? (
                        <Loader2 className="mx-auto h-8 w-8 animate-spin mb-2" />
                      ) : (
                        <Check className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      )}
                      <p className="font-medium">{analyzingStatus}</p>
                      
                      {identifiedStampType && (
                        <div className="mt-2 bg-primary/20 p-2 rounded">
                          <p className="text-sm font-semibold">Identified: {identifiedStampType}</p>
                        </div>
                      )}
                      
                      <Progress value={(analyzeStage / 7) * 100} className="h-1" />
                      
                      <div className="grid grid-cols-3 gap-1 w-full mt-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1 rounded-full ${
                              i < analyzeStage ? 'bg-primary' : 'bg-primary/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {scanState === "success" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                    <div className="text-center">
                      <Check className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <p className="font-medium">Stamp identified!</p>
                    </div>
                  </div>
                )}

                {scanState === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                    <div className="text-center">
                      <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
                      <p className="font-medium">Could not identify stamp</p>
                      <p className="text-sm text-muted-foreground mt-1">Try again with better lighting</p>
                    </div>
                  </div>
                )}

                {isCameraActive && scanState === "idle" && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="bg-white/80 hover:bg-white"
                            onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.25))}
                            disabled={zoomLevel <= 1}
                          >
                            <ZoomIn className="h-4 w-4 rotate-180" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zoom Out</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="bg-white/80 hover:bg-white"
                            onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                            disabled={zoomLevel >= 3}
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zoom In</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={captureImage} 
              disabled={scanState === "scanning" || !isCameraActive} 
              className="w-full max-w-xs"
            >
              {scanState === "scanning" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning...
                </>
              ) : (
                "Scan Stamp"
              )}
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Image Recognition Tips</h3>
            <ul className="text-sm space-y-1">
              <li className="flex items-start gap-2">
                <div className="min-w-4 mt-0.5">•</div>
                <span>Position the entire stamp within the frame, including perforations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-4 mt-0.5">•</div>
                <span>Use natural lighting to reveal watermarks and fine details</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-4 mt-0.5">•</div>
                <span>After initial identification, you can refine by specific features</span>
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">Upload Stamp Image</h3>
                  <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to browse your files</p>
                  <input type="file" id="stamp-upload" accept="image/*" className="hidden" onChange={handleUpload} />
                  <Button asChild>
                    <label htmlFor="stamp-upload">Select Image</label>
                  </Button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Advanced Features</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Our AI can identify stamps and suggest possible varieties based on visual characteristics.
              After initial identification, you can refine the results by examining specific features.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  <Search className="h-3 w-3 mr-1" /> 
                  Watermark Detection
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <Search className="h-3 w-3 mr-1" /> 
                  Perforation Analysis
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  <Search className="h-3 w-3 mr-1" /> 
                  Paper Type
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                  <Search className="h-3 w-3 mr-1" /> 
                  Color Variants
                </Badge>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
