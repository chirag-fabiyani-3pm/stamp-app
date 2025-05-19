"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SOACode } from "./soa-code"
import { useTheme } from "next-themes"
import ReactFlow, {
  Node,
  Edge,
  ConnectionLineType,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  Handle,
} from 'reactflow'
import 'reactflow/dist/style.css'
import dagre from 'dagre'
import { Button } from "@/components/ui/button"

// Custom CSS for ReactFlow
const reactFlowStyles = `
  .reactflow-wrapper .react-flow__edge {
    z-index: 1000 !important;
  }
  
  .reactflow-wrapper .react-flow__edge path {
    stroke: var(--edge-stroke-color) !important;
    stroke-width: 3px !important;
  }
  
  .reactflow-wrapper .react-flow__edge path.react-flow__edge-path {
    stroke: var(--edge-stroke-color) !important;
    stroke-width: 3px !important;
  }
  
  .reactflow-wrapper .react-flow__edge-path {
    stroke: var(--edge-stroke-color) !important;
    stroke-width: 3px !important;
  }
  
  .reactflow-wrapper .react-flow__edge.animated path {
    stroke-dasharray: 5,5 !important;
    animation: dashdraw 0.5s linear infinite !important;
  }
  
  .reactflow-wrapper.light .react-flow__background {
    background-color: #f8fafc !important;
  }

  .reactflow-wrapper.dark .react-flow__background {
    background-color: rgb(30 41 59) !important;
  }
  
  @keyframes dashdraw {
    from {
      stroke-dashoffset: 10;
    }
  }
`;

interface Stamp {
  id: string
  name: string
  imagePath: string
  position: string
  description?: string
  colorNumber?: number
  colorName?: string
  year?: string
  denomination?: string
  catalogNumbers?: {
    soa?: number
    sg?: string
    scott?: string
    michel?: string
  }
  marketValue?: string
  features?: string[]
  printingMethod?: string
  paper?: string
  errors?: string[]
  country?: string
  issueSeries?: string
  code?: string
  catalogSystems?: Record<string, { code: string; notes?: string }>
  specializedCatalogs?: { name: string; description: string; countrySpecific?: boolean }[]
  varieties?: { title?: string; name: string; description?: string }[]
  certifier?: string
  itemType?: string
  perforationType?: string
  watermarkType?: string
  cancellation?: string
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
  collectorGroup?: string
  rarityRating?: string
  grade?: string
  purchasePrice?: string
  purchaseDate?: string
  notes?: string
  visualAppeal?: number
}

interface StampTreeProps {
  title: string
  subtitle?: string
  stamps: Stamp[]
  rootStamp?: Stamp
  connections?: Array<{ from: string, to: string }>
}

interface StampDetailModalProps {
  stamp: Stamp | null
  isOpen: boolean
  onClose: () => void
  rootStamp?: Stamp
}

// Custom node component for stamps
const StampNode = ({ data }: { data: any }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "system";

  return (
    <div className="relative group" onClick={data.onClick}>
      <div className={`
        overflow-hidden rounded-lg shadow-md border
        ${data.isRoot ? 'w-32 h-32 border-2' : 'w-20 h-20'} 
        transition-transform duration-200 transform hover:scale-105
        ${isDark 
          ? `${data.isRoot ? 'border-white' : 'border-slate-600'} bg-slate-700` 
          : `${data.isRoot ? 'border-slate-800' : 'border-slate-300'} bg-slate-100`
        }
      `}>
        {/* Add source handle at bottom */}
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${data.id}-source`}
          style={{ 
            bottom: -6, 
            width: 10, 
            height: 10, 
            background: isDark ? '#FFFFFF' : '#1e293b', 
            border: `2px solid ${isDark ? '#666' : '#cbd5e1'}` 
          }}
          isConnectable={false}
        />
        
        {/* Add target handle at top */}
        <Handle
          type="target"
          position={Position.Top}
          id={`${data.id}-target`}
          style={{ 
            top: -6, 
            width: 10, 
            height: 10, 
            background: isDark ? '#FFFFFF' : '#1e293b', 
            border: `2px solid ${isDark ? '#666' : '#cbd5e1'}`  
          }}
          isConnectable={false}
        />
        
        <Image
          src={data.imagePath}
          alt={data.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className={`mt-1 text-xs max-w-20 truncate text-center px-1 py-0.5 backdrop-blur-sm rounded
        ${isDark 
          ? 'text-slate-200 bg-slate-800/60' 
          : 'text-slate-800 bg-slate-200/80'
        }
      `}>
        {data.name}
      </div>
    </div>
  );
};

// Register custom node types
const nodeTypes = {
  stampNode: StampNode,
};

const StampDetailModal = ({ stamp, isOpen, onClose, rootStamp }: StampDetailModalProps) => {
  if (!stamp) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Enhanced header with background image and overlay */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
          <div className="absolute inset-0 overflow-hidden opacity-40">
            <Image
              src={stamp.imagePath}
              alt={stamp.name}
              fill
              className="object-cover blur-sm"
              sizes="100vw"
            />
          </div>
          <DialogHeader className="relative z-20 p-6 pb-8">
            <div className="flex items-center gap-2">
            {stamp.id === rootStamp?.id && (
                <Badge variant="secondary" className="text-xs font-normal px-2 py-0.5">Current Selection</Badge>
              )}
              {stamp.country && (
                <Badge variant="outline" className="text-xs font-normal px-2 py-0.5 bg-background/70 backdrop-blur-sm">{stamp.country}</Badge>
              )}
              {stamp.year && (
                <Badge variant="outline" className="text-xs font-normal px-2 py-0.5 bg-background/70 backdrop-blur-sm">{stamp.year}</Badge>
              )}
            </div>
            <DialogTitle className="text-2xl font-bold text-white mt-2 flex items-center gap-2">
              {stamp.name}
          </DialogTitle>
            <DialogDescription className="text-base text-slate-200 max-w-2xl">
            {stamp.description}
          </DialogDescription>
        </DialogHeader>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Image and identification */}
            <div className="md:col-span-1 space-y-5">
              <div className="aspect-square relative bg-muted/10 rounded-xl border overflow-hidden shadow-md">
              <Image
                src={stamp.imagePath}
                alt={stamp.name}
                fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
                {stamp.denomination && (
                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                    {stamp.denomination}
                  </div>
                )}
            </div>
            
            {stamp.catalogNumbers?.soa && (
                <div className="bg-muted/10 p-4 rounded-xl border shadow-sm">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Stamp Identification
                  </h3>
                <SOACode
                  stampNumber={stamp.catalogNumbers.soa}
                  country="NZ"
                  year={stamp.year?.slice(-2) || ""}
                  denomination={stamp.denomination || ""}
                  features={stamp.features || []}
                  description={stamp.description || ""}
                />
              </div>
            )}

              {(stamp.perforationType || stamp.watermarkType || stamp.cancellation) && (
                <div className="bg-muted/10 p-4 rounded-xl border shadow-sm">
                  <h3 className="text-sm font-medium mb-3 border-b pb-1 flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Physical Characteristics
                  </h3>
                  <div className="space-y-3">
                    {stamp.perforationType && (
                      <div>
                        <div className="text-xs text-muted-foreground">Perforation Type</div>
                        <div className="font-medium">{stamp.perforationType}</div>
                      </div>
                    )}
                    {stamp.watermarkType && (
                      <div>
                        <div className="text-xs text-muted-foreground">Watermark Type</div>
                        <div className="font-medium">{stamp.watermarkType}</div>
                      </div>
                    )}
                    {stamp.cancellation && (
                      <div>
                        <div className="text-xs text-muted-foreground">Cancellation</div>
                        <div className="font-medium">{stamp.cancellation}</div>
                      </div>
                    )}
                  </div>
          </div>
              )}
              
              {stamp.marketValue && (
                <div className="bg-muted/10 p-4 rounded-xl border shadow-sm">
                  <h3 className="text-sm font-medium mb-3 border-b pb-1 flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Market Information
                  </h3>
                  <div>
                    <div className="text-xs text-muted-foreground">Estimated Value</div>
                    <div className="font-medium text-primary text-lg">{stamp.marketValue}</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right column - Details */}
            <div className="md:col-span-2 space-y-5">
              <div className="bg-muted/5 p-5 rounded-xl border shadow-sm">
                <h3 className="text-base font-medium mb-4 pb-1 border-b flex items-center">
                  <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
                  {stamp.year && (
                    <div className="bg-background/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Year of Issue</div>
                    <div className="font-medium">{stamp.year}</div>
                  </div>
                )}
                {stamp.denomination && (
                    <div className="bg-background/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Denomination</div>
                    <div className="font-medium">{stamp.denomination}</div>
                  </div>
                )}
                {stamp.colorName && (
                    <div className="bg-background/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Color</div>
                    <div className="font-medium">
                      {stamp.colorNumber && <span>#{stamp.colorNumber} </span>}
                      {stamp.colorName}
                    </div>
                  </div>
                )}
                {stamp.position && (
                    <div className="bg-background/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Position</div>
                    <div className="font-medium">{stamp.position}</div>
                  </div>
                )}
                {stamp.printingMethod && (
                    <div className="bg-background/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Printing Method</div>
                    <div className="font-medium">{stamp.printingMethod}</div>
                  </div>
                )}
                {stamp.paper && (
                    <div className="bg-background/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Paper Type</div>
                    <div className="font-medium">{stamp.paper}</div>
                  </div>
                )}
                  {stamp.country && (
                    <div className="bg-background/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">Country</div>
                      <div className="font-medium">{stamp.country}</div>
              </div>
                  )}
                  {stamp.issueSeries && (
                    <div className="bg-background/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">Issue Series</div>
                      <div className="font-medium">{stamp.issueSeries}</div>
                    </div>
                  )}
                  {stamp.code && (
                    <div className="bg-background/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">Stamp Code</div>
                      <div className="font-medium">{stamp.code}</div>
                    </div>
                  )}
                  {stamp.itemType && (
                    <div className="bg-background/50 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">Item Type</div>
                      <div className="font-medium">{stamp.itemType}</div>
                    </div>
                  )}
                </div>
              </div>
              
              {(stamp.catalogNumbers?.sg || stamp.catalogNumbers?.scott || stamp.catalogNumbers?.michel) && (
                <div className="bg-muted/5 p-5 rounded-xl border shadow-sm">
                  <h3 className="text-base font-medium mb-4 pb-1 border-b flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Catalog References
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {stamp.catalogNumbers?.sg && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Stanley Gibbons</div>
                        <Badge variant="outline" className="mt-1 bg-background">SG {stamp.catalogNumbers.sg}</Badge>
                      </div>
                    )}
                    {stamp.catalogNumbers?.scott && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Scott</div>
                        <Badge variant="outline" className="mt-1 bg-background">Scott {stamp.catalogNumbers.scott}</Badge>
                      </div>
                    )}
                    {stamp.catalogNumbers?.michel && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Michel</div>
                        <Badge variant="outline" className="mt-1 bg-background">Michel {stamp.catalogNumbers.michel}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Add additional catalog systems if available */}
              {stamp.catalogSystems && Object.keys(stamp.catalogSystems).length > 0 && (
                <div className="bg-muted/5 p-5 rounded-xl border shadow-sm">
                  <h3 className="text-base font-medium mb-4 pb-1 border-b flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Additional Catalog Systems
                  </h3>
                  <dl className="space-y-3">
                    {Object.entries(stamp.catalogSystems).map(([system, info]) => (
                      <div key={system} className="bg-background/50 p-3 rounded-lg">
                        <dt className="text-xs text-muted-foreground">{system}:</dt>
                        <dd className="mt-1">
                          <Badge variant="outline" className="mr-1 bg-background">{info.code}</Badge>
                          {info.notes && <span className="text-xs text-muted-foreground block mt-1">{info.notes}</span>}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              
              {/* Add specialized catalogs section if available */}
              {stamp.specializedCatalogs && stamp.specializedCatalogs.length > 0 && (
                <div className="bg-muted/5 p-5 rounded-xl border shadow-sm">
                  <h3 className="text-base font-medium mb-4 pb-1 border-b flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Specialized Catalogs
                  </h3>
                  <div className="space-y-3">
                    {stamp.specializedCatalogs.map((catalog, index) => (
                      <div key={index} className="bg-background/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{catalog.name}</span>
                          {catalog.countrySpecific && (
                            <Badge variant="secondary" className="text-xs">Country Specific</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{catalog.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add plating information if available */}
              {(stamp.plates || (stamp.plating && Object.values(stamp.plating).some(val => val))) && (
                <div className="bg-muted/5 p-5 rounded-xl border shadow-sm">
                  <h3 className="text-base font-medium mb-4 pb-1 border-b flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Plating Information
                  </h3>
                  <div className="space-y-3">
                    {stamp.plates && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Plates</div>
                        <div className="font-medium">{stamp.plates}</div>
                      </div>
                    )}
                    {stamp.plating?.positionNumber && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Position Number</div>
                        <div className="font-medium">{stamp.plating.positionNumber}</div>
                      </div>
                    )}
                    {stamp.plating?.gridReference && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Grid Reference</div>
                        <div className="font-medium">{stamp.plating.gridReference}</div>
                      </div>
                    )}
                    {stamp.plating?.flawDescription && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Flaw Description</div>
                        <div className="text-sm">{stamp.plating.flawDescription}</div>
                      </div>
                    )}
                    {stamp.plating?.textOnFace && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Text on Face</div>
                        <div className="font-medium">{stamp.plating.textOnFace}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
              {/* Add collector information if available */}
              {(stamp.collectorGroup || stamp.rarityRating || stamp.grade || stamp.visualAppeal !== undefined || stamp.certifier) && (
                <div className="bg-muted/5 p-5 rounded-xl border shadow-sm">
                  <h3 className="text-base font-medium mb-4 pb-1 border-b flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Collector Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {stamp.collectorGroup && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Collector Group</div>
                        <div className="font-medium">{stamp.collectorGroup}</div>
                      </div>
                    )}
                    {stamp.rarityRating && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Rarity Rating</div>
                        <div className="font-medium">{stamp.rarityRating}</div>
                      </div>
                    )}
                    {stamp.grade && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Grade</div>
                        <div className="font-medium">{stamp.grade}</div>
                      </div>
                    )}
                    {stamp.visualAppeal !== undefined && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Visual Appeal</div>
                        <div className="font-medium flex items-center">
                          <span className="mr-1">{stamp.visualAppeal}/10</span>
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${stamp.visualAppeal * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {stamp.certifier && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Certifier</div>
                        <div className="font-medium">{stamp.certifier}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Add purchase information if available */}
              {(stamp.purchasePrice || stamp.purchaseDate) && (
                <div className="bg-muted/5 p-5 rounded-xl border shadow-sm">
                  <h3 className="text-base font-medium mb-4 pb-1 border-b flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Purchase Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {stamp.purchasePrice && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Purchase Price</div>
                        <div className="font-medium">{stamp.purchasePrice}</div>
                      </div>
                    )}
                    {stamp.purchaseDate && (
                      <div className="bg-background/50 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground">Purchase Date</div>
                        <div className="font-medium">{stamp.purchaseDate}</div>
                      </div>
                    )}
                </div>
              </div>
            )}
            
            {stamp.features && stamp.features.length > 0 && (
                <div className="bg-muted/5 p-5 rounded-xl border shadow-sm">
                  <h3 className="text-base font-medium mb-4 pb-1 border-b flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Special Features
                  </h3>
                <div className="flex flex-wrap gap-2">
                  {stamp.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="py-1 px-3">{feature}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {stamp.errors && stamp.errors.length > 0 && (
                <div className="bg-muted/5 p-5 rounded-xl border shadow-sm">
                  <h3 className="text-base font-medium mb-4 pb-1 border-b flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Known Errors & Varieties
                  </h3>
                  <ul className="space-y-2">
                  {stamp.errors.map((error, index) => (
                      <li key={index} className="bg-background/50 p-3 rounded-lg flex items-start">
                        <span className="inline-block w-5 h-5 bg-muted rounded-full mr-2 flex-shrink-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <span>{error}</span>
                      </li>
                  ))}
                </ul>
              </div>
            )}
              
              {stamp.varieties && stamp.varieties.length > 0 && (
                <div className="bg-muted/5 p-5 rounded-xl border shadow-sm">
                  <h3 className="text-base font-medium mb-4 pb-1 border-b flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Varieties
                  </h3>
                  <div className="space-y-3">
                    {stamp.varieties.map((variety, index) => (
                      <div key={index} className="bg-background/50 p-3 rounded-lg">
                        <div className="font-medium">{variety.title || variety.name}</div>
                        {variety.description && (
                          <div className="text-xs text-muted-foreground mt-1">{variety.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add notes section if available */}
              {stamp.notes && (
                <div className="bg-muted/5 p-5 rounded-xl border shadow-sm">
                  <h3 className="text-base font-medium mb-4 pb-1 border-b flex items-center">
                    <span className="inline-block w-4 h-4 bg-primary/20 rounded-full mr-2"></span>
                    Notes
                  </h3>
                  <div className="text-sm whitespace-pre-wrap bg-background/50 p-4 rounded-lg">{stamp.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center p-6 pt-4 border-t bg-muted/5">
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <Button variant="default" onClick={() => onClose()} className="gap-2">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper for dagre layout
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 120;
const nodeHeight = 120;

function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 40, ranksep: 80 }); // Top-Bottom, vertical tree

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
  });
}

// Main component
export function StampTree({ title, subtitle, stamps, rootStamp, connections = [] }: StampTreeProps) {
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "system";

  const handleStampClick = useCallback((stamp: Stamp) => {
    setSelectedStamp(stamp);
    setIsModalOpen(true);
  }, []);

  // Convert our stamp data to ReactFlow nodes
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];
    if (rootStamp) {
      nodes.push({
        id: rootStamp.id,
        type: 'stampNode',
        data: {
          ...rootStamp,
          isRoot: true,
          onClick: () => handleStampClick(rootStamp)
        },
        width: nodeWidth,
        height: nodeHeight,
        position: { x: 0, y: 0 },
      });
    }
    stamps.forEach((stamp) => {
      if (rootStamp && stamp.id === rootStamp.id) return;
      nodes.push({
        id: stamp.id,
        type: 'stampNode',
        data: {
          ...stamp,
          isRoot: false,
          onClick: () => handleStampClick(stamp)
        },
        width: nodeWidth,
        height: nodeHeight,
        position: { x: 0, y: 0 },
      });
    });
    return nodes;
  }, [stamps, rootStamp, handleStampClick]);

  // Edges from connections
  const initialEdges: Edge[] = useMemo(() => {
    const edges = connections.map((connection, index) => {
      const sourceHandleId = `${connection.from}-source`;
      const targetHandleId = `${connection.to}-target`;
      
      console.log(`Creating edge ${index}:`, {
        source: connection.from,
        sourceHandle: sourceHandleId,
        target: connection.to,
        targetHandle: targetHandleId
      });
      
      return {
        id: `edge-${index}`,
        source: connection.from,
        target: connection.to,
        sourceHandle: sourceHandleId,
        targetHandle: targetHandleId,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: isDark ? '#FFFFFF' : '#1e293b',
          strokeWidth: 3
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: isDark ? '#FFFFFF' : '#1e293b',
        },
      };
    });
    
    return edges;
  }, [connections, isDark]);

  // Layout nodes with dagre
  const layoutedNodes = useMemo(() => getLayoutedElements(initialNodes, initialEdges), [initialNodes, initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(getLayoutedElements(initialNodes, initialEdges));
    setEdges(initialEdges);
    // eslint-disable-next-line
  }, [initialNodes, initialEdges]);

  // Set CSS variables for edge colors based on theme
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--edge-stroke-color', 
      isDark ? '#FFFFFF' : '#1e293b'
    );
  }, [isDark]);

  return (
    <div className="relative w-full h-[600px]">
      {/* Apply custom CSS styles */}
      <style jsx global>{reactFlowStyles}</style>
      
      <div className={`rounded-lg p-4 md:p-0 overflow-hidden h-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div className="absolute top-4 left-4 z-10">
          <div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
            {subtitle && (
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{subtitle}</p>
            )}
          </div>
        </div>

        {/* ReactFlow component */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { stroke: isDark ? '#FFFFFF' : '#1e293b', strokeWidth: 3 },
            animated: false,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: isDark ? '#FFFFFF' : '#1e293b',
            },
          }}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
          nodesFocusable={false}
          nodesDraggable={false}
          className={`reactflow-wrapper ${isDark ? 'dark bg-slate-800' : 'light bg-slate-100'}`}
        >
          <Background 
            color={isDark ? "rgba(255,255,255,0.05)" : "rgba(30,41,59,0.05)"} 
            gap={50} 
          />
        </ReactFlow>
      </div>
      
      <StampDetailModal
        stamp={selectedStamp}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rootStamp={rootStamp}
      />
    </div>
  );
} 