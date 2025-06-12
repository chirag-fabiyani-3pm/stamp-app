import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Home, Edit, Eye, PlusCircle, ZoomIn, ZoomOut, RotateCcw, Loader2, Info } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getUserData } from "@/lib/api/auth";
import categoriesData from "@/categories.json";

export interface CategoryField {
    id: string;
    label: string;
    type?: "text" | "textarea" | "select" | "date" | "color";
    description?: string;
    options?: string[];
    defaultValue?: string;
    showWhen?: {
        field: string;
        value: string;
    };
}

export interface Category extends CategoryField {
    children?: Category[];
}

interface NavigationPathItem {
    id: string;
    label: string;
    category: Category;
}

interface StampObservationManagerProps {
    selectedStamp: {
        id: string;
        image: string;
        scannedImage?: string;
        // Additional API data for comprehensive mapping
        apiData?: {
            id: string;
            catalogId: string;
            name: string;
            publisher: string;
            country: string;
            stampImageUrl: string;
            catalogName: string;
            catalogNumber: string;
            seriesName: string;
            issueDate: string;
            denominationValue: number;
            denominationCurrency: string;
            denominationSymbol: string;
            color: string;
            design: string;
            theme: string;
            artist: string;
            engraver: string;
            printing: string;
            paperType: string;
            perforation: string;
            size: string;
            specialNotes: string;
            historicalContext: string;
            printingQuantity: number;
            usagePeriod: string;
            rarenessLevel: string;
            hasGum: boolean;
            gumCondition: string;
            description: string;
            watermark: string | null;
            actualPrice?: number;
            estimatedPrice?: number;
        } | null;
        // Complete stamp data for reference
        stampData?: any;
    };
    onCancel?: () => void;
    onSuccess?: (message: string, stampData?: any) => void;
}

// Define the category structure based on comprehensive philatelic attributes
const categories: Category[] = categoriesData as Category[];

// Add this helper function after the interfaces and before the component
function formatFieldId(id: string): string {
    // First split by camelCase
    const camelCaseSplit = id.replace(/([A-Z])/g, ' $1');

    // Then split by numbers and other separators
    const words = camelCaseSplit.split(/[\s_-]+/);

    // Capitalize first letter of each word and join with spaces
    return words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim();
}

// Helper function to recursively search for a category label
function findCategoryInTree(id: string, categories: Category[]): Category | null {
    for (const category of categories) {
        // Check current category
        if (category.id.toLowerCase() === id.toLowerCase()) {
            return category;
        }

        // Check children if they exist
        if (category.children && category.children.length > 0) {
            const foundInChildren = findCategoryInTree(id, category.children);
            if (foundInChildren) {
                return foundInChildren;
            }
        }
    }
    return null;
}

// Helper function to find category label by id
function findCategoryLabel(id: string, categories: Category[]): string {
    // Search through the entire category tree
    const foundCategory = findCategoryInTree(id, categories);
    if (foundCategory?.label) return foundCategory?.label;

    // If not found, format the id as a readable label
    return formatFieldId(id);
}

// Helper function to initialize form data structure from categories
function initializeFormDataFromCategories(categories: Category[]): Record<string, any> {
    return categories.reduce((acc, category) => {
        if (category.type) {
            // If it's a field, initialize with default value or empty string
            acc[category.id.toLowerCase()] = category.defaultValue || '';
        } else {
            // If it's a category with children, recursively initialize
            const childData = category.children ? initializeFormDataFromCategories(category.children) : {};
            if (Object.keys(childData).length > 0) {
                acc[category.id.toLowerCase()] = childData;
            }
        }
        return acc;
    }, {} as Record<string, any>);
}

// Comprehensive mapping function from API data to nested category structure
function mapApiDataToFormStructure(apiData: any): Record<string, any> {
    if (!apiData) return {};

    // Helper function to map color to the nested color structure
    const mapColorData = (color: string) => {
        if (!color || typeof color !== 'string') return null;
        
        const colorLower = color.toLowerCase();
        
        // Determine color type and specific shade
        let colorType = 'Single Color';
        let colorCategory = '';
        let colorShade = '';

        // Map common colors to categories
        if (colorLower.includes('purple') || colorLower.includes('violet') || colorLower.includes('mauve') || colorLower.includes('lilac')) {
            colorCategory = 'purple';
            if (colorLower.includes('reddish')) colorShade = 'Reddish Purple (R.Pur)';
            else if (colorLower.includes('slate')) colorShade = 'Slate Purple (Pur,slt)';
            else if (colorLower.includes('lilac')) colorShade = 'Lilac (Pur,li)';
            else if (colorLower.includes('violet')) colorShade = 'Violet (Pur,vi)';
            else if (colorLower.includes('mauve')) colorShade = 'Mauve (Pur,mve)';
            else colorShade = 'Violet (Pur,vi)'; // Default
        } else if (colorLower.includes('brown') || colorLower.includes('sepia') || colorLower.includes('chocolate')) {
            colorCategory = 'brown';
            if (colorLower.includes('purple')) colorShade = 'Purple Brown (Br.pur)';
            else if (colorLower.includes('sepia')) colorShade = 'Sepia Brown (Br.sep)';
            else if (colorLower.includes('red')) colorShade = 'Red Brown (Br.r)';
            else if (colorLower.includes('chocolate')) colorShade = 'Chocolate Brown (Br.cho)';
            else colorShade = 'Red Brown (Br.r)'; // Default
        } else if (colorLower.includes('red') || colorLower.includes('carmine') || colorLower.includes('rose') || colorLower.includes('orange')) {
            colorCategory = 'red';
            if (colorLower.includes('deep')) colorShade = 'Deep Red (R.dp)';
            else if (colorLower.includes('bright')) colorShade = 'Bright Red (R.bgt)';
            else if (colorLower.includes('orange')) colorShade = 'Orange (R.or)';
            else if (colorLower.includes('rose')) colorShade = 'Rose (R.rs)';
            else if (colorLower.includes('carmine')) colorShade = 'Carmine (R.car)';
            else colorShade = 'Bright Red (R.bgt)'; // Default
        } else if (colorLower.includes('blue') || colorLower.includes('indigo') || colorLower.includes('ultramarine') || colorLower.includes('turquoise')) {
            colorCategory = 'blue';
            if (colorLower.includes('indigo')) colorShade = 'Indigo (Blu.in)';
            else if (colorLower.includes('royal')) colorShade = 'Royal Blue (Blu.roy)';
            else if (colorLower.includes('ultramarine')) colorShade = 'Ultramarine (Blu.ult)';
            else if (colorLower.includes('turquoise')) colorShade = 'Deep Turquoise (Blu.tur.dp)';
            else colorShade = 'Royal Blue (Blu.roy)'; // Default
        } else if (colorLower.includes('green') || colorLower.includes('sage') || colorLower.includes('emerald') || colorLower.includes('olive')) {
            colorCategory = 'green';
            if (colorLower.includes('sage')) colorShade = 'Sage (Gr.sag)';
            else if (colorLower.includes('emerald')) colorShade = 'Emerald (Gr.em)';
            else if (colorLower.includes('olive')) colorShade = 'Olive (Gr.ol)';
            else colorShade = 'Emerald (Gr.em)'; // Default
        } else if (colorLower.includes('black')) {
            colorCategory = 'black';
            if (colorLower.includes('grey') || colorLower.includes('gray')) colorShade = 'Grey Black (Blk.gry)';
            else colorShade = 'Pure Black (Bla)';
        } else if (colorLower.includes('grey') || colorLower.includes('gray')) {
            colorCategory = 'grey';
            if (colorLower.includes('brownish')) colorShade = 'Brownish Grey (Gry.br)';
            else if (colorLower.includes('light')) colorShade = 'Light Grey (Gry.lt)';
            else if (colorLower.includes('dark')) colorShade = 'Dark Grey (Gry.dk)';
            else colorShade = 'Light Grey (Gry.lt)'; // Default
        } else if (colorLower.includes('yellow') || colorLower.includes('golden')) {
            colorCategory = 'yellow';
            if (colorLower.includes('pale')) colorShade = 'Pale Yellow (Yel.pal)';
            else if (colorLower.includes('bright')) colorShade = 'Bright Yellow (Yel.bgt)';
            else if (colorLower.includes('golden')) colorShade = 'Golden Yellow (Yel.gld)';
            else colorShade = 'Bright Yellow (Yel.bgt)'; // Default
        } else {
            // Return null for unknown colors instead of defaulting to red
            return null;
        }

        return {
            colortype: colorType,
            singlecolor: {
                [colorCategory]: {
                    [`${colorCategory}shade`]: colorShade
                }
            }
        };
    };

    // Helper function to map paper type
    const mapPaperType = (paperType: string) => {
        if (!paperType || typeof paperType !== 'string') return null;
        
        const paperLower = paperType.toLowerCase();
        
        if (paperLower.includes('white')) return 'White Paper (P.wh)';
        if (paperLower.includes('toned')) return 'Toned Paper (P.ton)';
        if (paperLower.includes('chalk')) return 'Chalk-Surfaced Paper (P.clk)';
        if (paperLower.includes('prelure')) return 'Prelure Paper (P.prel)';
        if (paperLower.includes('fluorescent')) return 'Fluorescent Paper (P.flo)';
        if (paperLower.includes('self-adhesive')) return 'Self-Adhesive Paper (P.slf)';
        if (paperLower.includes('phosphor')) return 'Phosphorised Paper (P.phs)';
        if (paperLower.includes('gum arabic')) return 'Gum Arabic Paper (P.arb.gmd)';
        if (paperLower.includes('pva')) return 'PVA Gum Paper (P.alch)';
        if (paperLower.includes('wove')) return 'White Paper (P.wh)'; // Default for wove
        if (paperLower.includes('laid')) return 'White Paper (P.wh)'; // Default for laid
        
        return null; // Return null for unknown paper types
    };

    // Helper function to map perforation type
    const mapPerforationType = (perforation: string) => {
        if (!perforation || typeof perforation !== 'string') return null;
        
        const perfLower = perforation.toLowerCase();
        
        if (perfLower.includes('imperforate')) return 'Imperforate (Per.imp)';
        if (perfLower.includes('line')) return 'Line Perforation (Per.l)';
        if (perfLower.includes('comb')) return 'Comb Perforation (Per.cmb)';
        if (perfLower.includes('harrow')) return 'Harrow Perforation (Per.h)';
        if (perfLower.includes('roulette')) return 'Rouletting (Per.rlt)';
        if (perfLower.includes('elliptical')) return 'Elliptical Perforation (Per,el.)';
        if (perfLower.includes('part-perforated')) return 'Part-Perforated (Per.rlt,srp.)';
        if (perfLower.includes('syncopated')) return 'Syncopated Perforation (Per.rlt,syn.)';
        if (perfLower.includes('die-cut')) return 'Self-Adhesive Die-Cut (Per.di.ct)';
        
        return null; // Return null for unknown perforation types
    };

    // Helper function to map printing method
    const mapPrintingMethod = (printing: string) => {
        if (!printing || typeof printing !== 'string') return null;
        
        const printLower = printing.toLowerCase();
        
        if (printLower.includes('recess')) return 'Recess Printing (Prnt.rec)';
        if (printLower.includes('intaglio')) return 'Intaglio (Prnt.rec.int)';
        if (printLower.includes('line-engraved') || printLower.includes('engraved')) return 'Line-Engraved (Prnt.rec.len)';
        if (printLower.includes('typography') || printLower.includes('letterpress')) return 'Typography/Letterpress (Prnt.typ)';
        if (printLower.includes('lithograph') || printLower.includes('offset')) return 'Lithography/Offset (Prnt.lth)';
        if (printLower.includes('gravure') || printLower.includes('photogravure')) return 'Gravure/Photogravure (Prnt.grv)';
        if (printLower.includes('flexography')) return 'Flexography (Prnt.flx)';
        if (printLower.includes('screen')) return 'Screen Printing (Prnt.scr)';
        if (printLower.includes('héliogravure')) return 'Héliogravure (Prnt.hel)';
        
        return null; // Return null for unknown printing methods
    };

    // Helper function to map watermark
    const mapWatermark = (watermark: string | null) => {
        if (!watermark || typeof watermark !== 'string' || watermark.toLowerCase() === 'none' || watermark.trim() === '') {
            return {
                watermarkpresence: 'No - No Watermark'
            };
        }

        const wmkLower = watermark.toLowerCase();
        let specificWatermark = 'Other/Custom';
        
        if (wmkLower.includes('large star')) specificWatermark = 'Large Star (Wmk.ls)';
        else if (wmkLower.includes('crown') && wmkLower.includes('cc')) specificWatermark = 'Crown Over CC (Wmk.C.ovrCC)';
        else if (wmkLower.includes('nz') && wmkLower.includes('star')) specificWatermark = 'NZ and Star 6mm (W7)';
        else if (wmkLower.includes('usps')) specificWatermark = 'Double Line "USPS"';
        else if (wmkLower.includes('sands') && wmkLower.includes('mcdougall')) specificWatermark = '"SANDS & McDOUGALL MELBOURNE" (W2 a)';

        const watermarkData: any = {
            watermarkpresence: 'Yes - Watermark Present',
            watermarkdetails: {
                generaltypes: {
                    wmktype: 'Single Watermark (Wmk.sgl)' // Default
                },
                wmkorientation: {
                    orientation: 'Normal'
                },
                specifictypes: {
                    wmkspecific: specificWatermark
                }
            },
            wmkerrors: {
                wmkerror: 'No Error'
            }
        };

        // Add custom watermark description if needed
        if (specificWatermark === 'Other/Custom') {
            watermarkData.watermarkdetails.specifictypes.customwatermark = watermark;
        }

        return watermarkData;
    };

    // Helper function to map country to available options
    const mapCountry = (country: string) => {
        if (!country || typeof country !== 'string') return null;
        
        const countryLower = country.toLowerCase();
        
        if (countryLower.includes('new zealand')) return 'New Zealand';
        if (countryLower.includes('australia')) return 'Australia';
        if (countryLower.includes('great britain') || countryLower.includes('united kingdom') || countryLower.includes('uk')) return 'Great Britain';
        if (countryLower.includes('united states') || countryLower.includes('usa') || countryLower.includes('america')) return 'United States';
        if (countryLower.includes('canada')) return 'Canada';
        
        return null; // Return null for countries not in the predefined list
    };

    // Helper function to map rarity rating
    const mapRarityRating = (rarenessLevel: string) => {
        if (!rarenessLevel || typeof rarenessLevel !== 'string') return null;
        
        const rarityLower = rarenessLevel.toLowerCase();
        
        if (rarityLower.includes('common') || rarityLower.includes('least rare')) return '1 - Least rare (500,001 – 1,000,000)';
        if (rarityLower.includes('scarce') && !rarityLower.includes('very')) return '3 - (25,001 – 100,000)';
        if (rarityLower.includes('rare') && !rarityLower.includes('very') && !rarityLower.includes('extremely')) return '5 - (1001 – 5000)';
        if (rarityLower.includes('very rare')) return '7 - (51 – 150)';
        if (rarityLower.includes('extremely rare') || rarityLower.includes('extremely')) return '10 - Extremely Rare';
        
        return null; // Return null for unknown rarity levels
    };

    // Build the complete form structure using only predefined categories
    const formData: Record<string, any> = {
        // Item Type
        ittyp: {
            ittypsel: 'Stamp'
        }
    };

    // Primary Details - this is crucial for most stamp code fields
    const primaryDetails: any = {};
    
    // Only add country if we can map it properly
    const country = apiData.country ? mapCountry(apiData.country) : null;
    if (country) {
        primaryDetails.country = country;
    }
    
    // Add issue date if available
    if (apiData.issueDate) {
        primaryDetails.issuedate = new Date(apiData.issueDate).toISOString().split('T')[0];
    }
    
    // Add denomination information
    if (apiData.denominationValue !== undefined || apiData.denominationCurrency || apiData.denominationSymbol) {
        primaryDetails.denomination = {
            denominationvalue: apiData.denominationValue?.toString() || '',
            denominationcurrency: apiData.denominationCurrency || '',
            denominationsymbol: apiData.denominationSymbol || ''
        };
    }
    
    // Add other primary details
    if (apiData.artist) primaryDetails.designer = apiData.artist;
    if (apiData.engraver) primaryDetails.printer = apiData.engraver;
    if (apiData.catalogNumber) primaryDetails.cataloguenumber = apiData.catalogNumber;
    
    // Add ownership and purchase info with defaults
    primaryDetails.ownershipstatus = 'Owned';
    if (apiData.actualPrice) primaryDetails.purchaseprice = apiData.actualPrice.toString();
    primaryDetails.purchasedate = new Date().toISOString().split('T')[0];
    
    // Combine notes only if they exist
    const notes = [
        apiData.specialNotes,
        apiData.historicalContext,
        apiData.description
    ].filter(Boolean);
    if (notes.length > 0) {
        primaryDetails.notes = notes.join(' | ');
    }
    
    // Add primaryDetails to form data
    if (Object.keys(primaryDetails).length > 0) {
        formData.primarydetails = primaryDetails;
    }

    // Only add colors if we can map them properly
    const colorData = apiData.color ? mapColorData(apiData.color) : null;
    if (colorData) {
        formData.colors = colorData;
    }

    // Paper Characteristics - only add if we can map them
    const paperType = apiData.paperType ? mapPaperType(apiData.paperType) : null;
    if (paperType) {
        formData.paperchar = {
            papertypes: {
                papertype: paperType
            }
        };
        
        // Only add paper variations if we have paper type data
        if (apiData.paperType?.toLowerCase().includes('laid')) {
            formData.paperchar.papervariations = {
                papervariation: apiData.paperType.toLowerCase().includes('horizontal') 
                    ? 'Horizontal laid (P.hor)' 
                    : 'Vertical laid (P.ver)'
            };
        }
    }

    // Printing Characteristics - only add if we can map them
    const printMethod = apiData.printing ? mapPrintingMethod(apiData.printing) : null;
    if (printMethod) {
        formData.printchar = {
            printmethods: {
                printmethod: printMethod
            }
        };
    }

    // Watermarks - always add since we handle null/empty watermarks
    formData.wmkchar = mapWatermark(apiData.watermark);

    // Perforation and Separation - only add if we can map them
    const perfType = apiData.perforation ? mapPerforationType(apiData.perforation) : null;
    if (perfType) {
        formData.perfsep = {
            perftypes: {
                perftype: perfType
            }
        };
    }

    // Rarity - only add if we can map it
    const rarityRating = apiData.rarenessLevel ? mapRarityRating(apiData.rarenessLevel) : null;
    if (rarityRating) {
        formData.knownrarity = {
            rarityrating: rarityRating
        };
        if (apiData.printingQuantity) {
            formData.knownrarity.stampprintcount = apiData.printingQuantity.toString();
        }
    }

    // Grading - only add if we have gum condition data
    if (apiData.hasGum !== undefined) {
        formData.grading = {
            condition: apiData.hasGum ? 'Mint Never Hinged' : 'Used',
            detailedgrading: {
                papercondition: {
                    gumcondition: apiData.hasGum ? '1 - Original, pristine, no fingerprints' : '8 - No gum'
                }
            }
        };
    }

    return formData;
}

// Update the EditablePreviewItem interface to match the expected signature
function EditablePreviewItem({ 
    label, 
    value, 
    path, 
    onUpdate,
    categories,
    field
}: { 
    label: string; 
    value: any; 
    path: string[];
    onUpdate: (path: string[], value: string) => void;
    categories: Category[];
    field?: Category;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingValue, setEditingValue] = useState(String(value || ''));

    const handleEdit = () => {
        setIsEditing(true);
        setEditingValue(String(value || ''));
    };

    const handleSave = (newValue: string) => {
        onUpdate(path, newValue);
        setIsEditing(false);
    };

    const handleBlur = () => {
        handleSave(editingValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && field?.type !== 'textarea') {
            handleSave(editingValue);
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditingValue(String(value || ''));
        }
    };

    if (!field?.type) return null;

    return (
        <div className="group p-3 sm:p-4 hover:bg-muted/50 rounded-lg border transition-colors relative">
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleEdit}
                >
                    <Edit className="h-4 w-4" />
                </Button>
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                {findCategoryLabel(label, categories)}
            </div>
            {isEditing ? (
                <div className="pt-2">
                    {field.type === 'select' ? (
                        <Select
                            value={String(value)}
                            onValueChange={handleSave}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : field.type === 'textarea' ? (
                        <textarea
                            className="w-full min-h-[100px] p-2 border rounded"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            placeholder={field.description}
                            autoFocus
                        />
                    ) : field.type === 'color' ? (
                        <Input
                            type="color"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            placeholder={field.description}
                            autoFocus
                        />
                    ) : (
                        <Input
                            type={field.type === 'date' ? 'date' : 'text'}
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            placeholder={field.description}
                            autoFocus
                        />
                    )}
                </div>
            ) : (
                <div className="text-sm font-medium">{value || 'Click to edit'}</div>
            )}
        </div>
    );
}

// Update the PreviewItem component
function PreviewItem({ 
    label, 
    value, 
    level = 0, 
    categories,
    path = [],
    onUpdate
}: { 
    label: string; 
    value: any; 
    level?: number;
    categories: Category[];
    path?: string[];
    onUpdate?: (path: string[], value: string) => void;
}) {
    // if (!value) return null;

    // Find the current category/field definition
    const currentField = findCategoryInTree(label, categories);

    // If value is an object and not null
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const entries = Object.entries(value);
        if (entries.length === 0) return null;

        const nonPreviewItems: Array<{ key: string; value: any }> = [];
        const previewItems: Array<{ key: string; value: any }> = [];

        for(const [key, val] of entries) {
            if(val && typeof val === 'object' && !Array.isArray(val)) {
                previewItems.push({ key, value: val });
            } else {
                nonPreviewItems.push({ key, value: val });
            }
        }

        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">{findCategoryLabel(label, categories)}</h4>
                    <div className="h-px flex-1 bg-border"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginLeft: `${level > 0 ? (level + 1) * 10 : 0}px` }}>
                    {nonPreviewItems.map(({ key, value }) => (
                        <div key={key} className="space-y-2">
                            {onUpdate ? (
                                <EditablePreviewItem
                                    label={key}
                                    value={value}
                                    path={[...path, key]}
                                    onUpdate={onUpdate}
                                    categories={categories}
                                    field={findCategoryInTree(key, categories)!}
                                />
                            ) : (
                                <div className="group p-3 sm:p-4 hover:bg-muted/50 rounded-lg border transition-colors">
                                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                                        {findCategoryLabel(key, categories)}
                                    </div>
                                    <div className="text-sm font-medium">{String(value)}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-4" style={{ marginLeft: `${level > 0 ? (level + 1) * 10 : 0}px` }}>
                    {previewItems.map(({ key, value }) => (
                        <div key={key} className="space-y-2">
                            <PreviewItem 
                                label={key} 
                                value={value} 
                                level={level + 1} 
                                categories={categories}
                                path={[...path, key]}
                                onUpdate={onUpdate}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // For primitive values at root level
    return onUpdate ? (
        <EditablePreviewItem
            label={label}
            value={value}
            path={path}
            onUpdate={onUpdate}
            categories={categories}
            field={currentField!}
        />
    ) : (
        <div className="group p-3 sm:p-4 hover:bg-muted/50 rounded-lg border transition-colors">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                {findCategoryLabel(label, categories)}
            </div>
            <div className="text-sm font-medium">{String(value)}</div>
        </div>
    );
}

// Update the FormPreview component
function FormPreview({ data, categories, onUpdate }: { 
    data: Record<string, any>;
    categories: Category[];
    onUpdate?: (path: NavigationPathItem[], value: string) => void;
}) {
    if (Object.keys(data).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground">
                <div className="rounded-full bg-muted p-3 mb-3">
                    <Edit className="h-6 w-6" />
                </div>
                <div className="text-lg font-medium mb-1">No details added yet</div>
                <div className="text-sm">Fill in the form to see the preview here</div>
            </div>
        );
    }

    // Get category details for better organization
    const categoryDetails = categories.reduce((acc, cat) => {
        acc[cat.id.toLowerCase()] = {
            label: cat.label,
            order: categories.findIndex(c => c.id === cat.id)
        };
        return acc;
    }, {} as Record<string, { label: string; order: number }>);

    // Sort and group the data by categories
    const sortedEntries = Object.entries(data).sort(([keyA], [keyB]) => {
        const orderA = categoryDetails[keyA.toLowerCase()]?.order ?? Infinity;
        const orderB = categoryDetails[keyB.toLowerCase()]?.order ?? Infinity;
        return orderA - orderB;
    });

    // Create a wrapper function to convert string[] to NavigationPathItem[]
    const handleUpdate = onUpdate ? (path: string[], value: string) => {
        const navigationPath: NavigationPathItem[] = path.map(id => {
            const category = findCategoryInTree(id, categories);
            return {
                id,
                label: category?.label || formatFieldId(id),
                category: category || { id, label: formatFieldId(id) }
            };
        });
        onUpdate(navigationPath, value);
    } : undefined;

    return (
        <div className="space-y-8">
            {sortedEntries.map(([key, value]) => (
                <PreviewItem
                    key={key}
                    label={key}
                    value={value}
                    categories={categories}
                    path={[key]}
                    onUpdate={handleUpdate}
                />
            ))}
        </div>
    );
}

export default function StampObservationManager({
    selectedStamp,
    onCancel,
    onSuccess
}: StampObservationManagerProps) {
    const [navigationPath, setNavigationPath] = useState<NavigationPathItem[]>([]);
    
    // Add active tab state - Default to Preview tab for better user experience
    const [activeTab, setActiveTab] = useState("preview");
    
    // Add debug mode state for development
    const [debugMode, setDebugMode] = useState(false);
    
    // Initialize form data with API mapping if available
    const [formData, setFormData] = useState<Record<string, any>>(() => {
        const defaultData = initializeFormDataFromCategories(categories);
        
        // If we have API data, merge it with the default structure
        if (selectedStamp.apiData) {
            const apiMappedData = mapApiDataToFormStructure(selectedStamp.apiData);
            // Deep merge the API data with default data
            return { ...defaultData, ...apiMappedData };
        }
        
        return defaultData;
    });
    
    const [allCategories, setAllCategories] = useState<Category[]>(() => {
        return categories.map(cat => ({
            id: cat.id,
            label: cat.label,
            description: cat.description,
            type: cat.type,
            options: cat.options,
            showWhen: cat.showWhen,
            children: cat.children ? cat.children.map(child => ({
                ...child
            })) : undefined
        }));
    });

    // Clean up any double nesting issues in form data on component mount
    useEffect(() => {
        setFormData(prevData => {
            const cleanedData = { ...prevData };
            let hasChanges = false;
            
            // Fix double nesting in ittyp.ittypsel
            if (cleanedData.ittyp?.ittypsel && typeof cleanedData.ittyp.ittypsel === 'object' && cleanedData.ittyp.ittypsel.ittypsel) {
                console.log('Fixing double nesting in ittyp.ittypsel:', cleanedData.ittyp.ittypsel);
                cleanedData.ittyp.ittypsel = cleanedData.ittyp.ittypsel.ittypsel;
                hasChanges = true;
            }
            
            // Also check for any other potential double nesting patterns
            if (cleanedData.ittyp?.ittypsel && typeof cleanedData.ittyp.ittypsel === 'object' && 
                !cleanedData.ittyp.ittypsel.ittypsel && Object.keys(cleanedData.ittyp.ittypsel).length === 1) {
                // If it's an object with a single key that matches the field name, extract the value
                const keys = Object.keys(cleanedData.ittyp.ittypsel);
                if (keys[0] === 'ittypsel') {
                    console.log('Fixing alternative double nesting pattern:', cleanedData.ittyp.ittypsel);
                    cleanedData.ittyp.ittypsel = cleanedData.ittyp.ittypsel[keys[0]];
                    hasChanges = true;
                }
            }
            
            if (hasChanges) {
                console.log('Cleanup applied, new structure:', cleanedData.ittyp);
            }
            
            return cleanedData;
        });
    }, []);

    // Also add a useEffect to watch for form data changes and auto-fix double nesting
    useEffect(() => {
        if (formData.ittyp?.ittypsel && typeof formData.ittyp.ittypsel === 'object' && formData.ittyp.ittypsel.ittypsel) {
            console.log('Detected double nesting after form update, auto-fixing...');
            setFormData(prevData => {
                const fixed = { ...prevData };
                fixed.ittyp.ittypsel = fixed.ittyp.ittypsel.ittypsel;
                console.log('Auto-fixed to:', fixed.ittyp.ittypsel);
                return fixed;
            });
        }
    }, [formData.ittyp?.ittypsel]);

    // Add loading and error states for save operation
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Zoom state for both images
    const [catalogueZoom, setCatalogueZoom] = useState(1);
    const [scannedZoom, setScannedZoom] = useState(1);

    // Pan state for both images
    const [cataloguePan, setCataloguePan] = useState({ x: 0, y: 0 });
    const [scannedPan, setScannedPan] = useState({ x: 0, y: 0 });

    // Drag state
    const [isDragging, setIsDragging] = useState<'catalogue' | 'scanned' | null>(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragStartPan, setDragStartPan] = useState({ x: 0, y: 0 });

    // Refs for image containers to get actual dimensions
    const catalogueContainerRef = useRef<HTMLDivElement>(null);
    const scannedContainerRef = useRef<HTMLDivElement>(null);

    // Handle save with API call
    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(null);
        
        try {
            // Call the API to save stamp data
            const success = await saveStampToAPI(
                formData, 
                allCategories, 
                selectedStamp,
                selectedStamp.scannedImage
            );
            
            if (success) {
                // Call onSuccess callback with success message and redirect immediately
                if (onSuccess) {
                    onSuccess('Stamp details saved successfully!');
                }
                
                // Redirect back to scan page immediately
                if (onCancel) {
                    onCancel();
                }
            }
            
        } catch (error) {
            console.error('Failed to save stamp:', error);
            setSaveError(error instanceof Error ? error.message : 'Failed to save stamp details');
        } finally {
            setIsSaving(false);
        }
    };

    // Zoom handlers
    const handleCatalogueZoomIn = () => {
        setCatalogueZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleCatalogueZoomOut = () => {
        setCatalogueZoom(prev => {
            const newZoom = Math.max(prev - 0.25, 0.5);
            // Reset pan when zooming out to 1x or less
            if (newZoom <= 1) {
                setCataloguePan({ x: 0, y: 0 });
            }
            return newZoom;
        });
    };

    const handleScannedZoomIn = () => {
        setScannedZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleScannedZoomOut = () => {
        setScannedZoom(prev => {
            const newZoom = Math.max(prev - 0.25, 0.5);
            // Reset pan when zooming out to 1x or less
            if (newZoom <= 1) {
                setScannedPan({ x: 0, y: 0 });
            }
            return newZoom;
        });
    };

    // Reset pan handlers
    const resetCataloguePan = () => {
        setCataloguePan({ x: 0, y: 0 });
    };

    const resetScannedPan = () => {
        setScannedPan({ x: 0, y: 0 });
    };

    // Function to constrain pan values to current zoom bounds
    const constrainPan = (pan: { x: number; y: number }, zoom: number, imageType: 'catalogue' | 'scanned') => {
        if (zoom <= 1) return { x: 0, y: 0 };
        
        const maxPan = calculatePanBounds(zoom, imageType);
        return {
            x: Math.max(-maxPan, Math.min(maxPan, pan.x)),
            y: Math.max(-maxPan, Math.min(maxPan, pan.y))
        };
    };

    // Update pan constraints when zoom changes
    useEffect(() => {
        setCataloguePan(prev => constrainPan(prev, catalogueZoom, 'catalogue'));
    }, [catalogueZoom]);

    useEffect(() => {
        setScannedPan(prev => constrainPan(prev, scannedZoom, 'scanned'));
    }, [scannedZoom]);

    // Pan handlers
    const handleMouseDown = (e: React.MouseEvent, imageType: 'catalogue' | 'scanned') => {
        const zoom = imageType === 'catalogue' ? catalogueZoom : scannedZoom;
        if (zoom <= 1) return; // Only allow dragging when zoomed in

        setIsDragging(imageType);
        setDragStart({ x: e.clientX, y: e.clientY });
        setDragStartPan(imageType === 'catalogue' ? cataloguePan : scannedPan);
        e.preventDefault();
    };

    const handleTouchStart = (e: React.TouchEvent, imageType: 'catalogue' | 'scanned') => {
        const zoom = imageType === 'catalogue' ? catalogueZoom : scannedZoom;
        if (zoom <= 1 || e.touches.length !== 1) return;

        setIsDragging(imageType);
        const touch = e.touches[0];
        setDragStart({ x: touch.clientX, y: touch.clientY });
        setDragStartPan(imageType === 'catalogue' ? cataloguePan : scannedPan);
        e.preventDefault();
    };

    const calculatePanBounds = (zoom: number, imageType: 'catalogue' | 'scanned') => {
        // Get the actual container dimensions
        const containerRef = imageType === 'catalogue' ? catalogueContainerRef : scannedContainerRef;
        const container = containerRef.current;
        
        if (!container) {
            // Fallback to estimated size if ref not available
            return (zoom - 1) * 150;
        }

        // Get the actual container size (it's square, so width = height)
        const containerSize = container.offsetWidth;
        
        // When zoomed in, the image becomes larger than the container
        // The amount we can pan is half the difference between scaled image and container
        const scaledImageSize = containerSize * zoom;
        const overflow = (scaledImageSize - containerSize) / 2;
        
        // Return the maximum pan distance in pixels
        // This allows the edges of the zoomed image to reach the center of the container
        return overflow;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        const newPan = {
            x: dragStartPan.x + deltaX,
            y: dragStartPan.y + deltaY
        };

        // Calculate proper bounds based on zoom level
        const zoom = isDragging === 'catalogue' ? catalogueZoom : scannedZoom;
        const maxPan = calculatePanBounds(zoom, isDragging);
        
        // Clamp the pan values to the calculated bounds
        newPan.x = Math.max(-maxPan, Math.min(maxPan, newPan.x));
        newPan.y = Math.max(-maxPan, Math.min(maxPan, newPan.y));

        if (isDragging === 'catalogue') {
            setCataloguePan(newPan);
        } else {
            setScannedPan(newPan);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || e.touches.length !== 1) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - dragStart.x;
        const deltaY = touch.clientY - dragStart.y;
        
        const newPan = {
            x: dragStartPan.x + deltaX,
            y: dragStartPan.y + deltaY
        };

        // Calculate proper bounds based on zoom level
        const zoom = isDragging === 'catalogue' ? catalogueZoom : scannedZoom;
        const maxPan = calculatePanBounds(zoom, isDragging);
        
        // Clamp the pan values to the calculated bounds
        newPan.x = Math.max(-maxPan, Math.min(maxPan, newPan.x));
        newPan.y = Math.max(-maxPan, Math.min(maxPan, newPan.y));

        if (isDragging === 'catalogue') {
            setCataloguePan(newPan);
        } else {
            setScannedPan(newPan);
        }
        e.preventDefault();
    };

    const handleMouseUp = () => {
        setIsDragging(null);
    };

    const handleTouchEnd = () => {
        setIsDragging(null);
    };

    // Add global event listeners for mouse/touch events
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            handleMouseMove(e as any);
        };

        const handleGlobalTouchMove = (e: TouchEvent) => {
            if (!isDragging) return;
            handleTouchMove(e as any);
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(null);
        };

        const handleGlobalTouchEnd = () => {
            setIsDragging(null);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
            document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
            document.addEventListener('touchend', handleGlobalTouchEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.removeEventListener('touchmove', handleGlobalTouchMove);
            document.removeEventListener('touchend', handleGlobalTouchEnd);
        };
    }, [isDragging, dragStart, dragStartPan, catalogueZoom, scannedZoom]);

    // Helper function to find and update a category in the tree
    const updateCategoryInTree = (
        categories: Category[],
        path: NavigationPathItem[],
        updater: (category: Category) => Category
    ): Category[] => {
        if (path.length === 0) return categories;

        return categories.map(cat => {
            if (cat.id === path[0].id) {
                if (path.length === 1) {
                    const updatedCat = updater(cat);
                    return updatedCat;
                }
                return {
                    ...cat,
                    children: cat.children
                        ? updateCategoryInTree(cat.children, path.slice(1), updater)
                        : undefined
                };
            }
            return cat;
        });
    };

    // Function to add a new category at any level
    const handleAddCategory = (newCategory: Category) => {
        const currentPath = navigationPath;
        const categoryToAdd = { ...newCategory, children: [] };

        if (currentPath.length === 0) {
            // Adding at root level
            setAllCategories(prev => [...prev, categoryToAdd]);
            return;
        }

        // Add category at the current navigation path
        setAllCategories(prev =>
            updateCategoryInTree(prev, currentPath, (category) => ({
                ...category,
                children: [...(category.children || []), categoryToAdd]
            }))
        );
    };

    // Function to add a field at any level
    const handleAddField = (categoryId: string, newField: CategoryField) => {
        const currentPath = navigationPath;
        const fieldToAdd = { ...newField };

        setAllCategories(prev =>
            updateCategoryInTree(prev, currentPath, (category) => ({
                ...category,
                children: [...(category.children || []), fieldToAdd]
            }))
        );
    };

    // Create a more robust path mapping system
    const createFieldPath = (navigationPath: NavigationPathItem[], fieldId: string): string[] => {
        const pathSegments: string[] = [];
        
        // Debug logging for field path creation
        console.log('createFieldPath - Creating path for field:', fieldId);
            console.log('createFieldPath - navigationPath:', navigationPath.map(p => p.id));
        
        // Check if we're editing a field directly (last navigation item matches fieldId)
        const isDirectFieldEdit = navigationPath.length > 0 && 
            navigationPath[navigationPath.length - 1].id === fieldId;
        
        console.log('createFieldPath - isDirectFieldEdit:', isDirectFieldEdit);
        
        if (isDirectFieldEdit) {
            // We're editing the field directly, so navigation path includes the field
            // Map only the parent categories, not the field itself
            for (let i = 0; i < navigationPath.length - 1; i++) {
                const pathItem = navigationPath[i];
                const categoryId = pathItem.id;
                
                // Map specific categories to their form data keys
                switch (categoryId) {
                    case 'PrimaryDetails':
                        pathSegments.push('primarydetails');
                        break;
                    case 'Colors':
                        pathSegments.push('colors');
                        break;
                    case 'ItTyp':
                        pathSegments.push('ittyp');
                        break;
                    case 'PaperChar':
                        pathSegments.push('paperchar');
                        break;
                    case 'PrintChar':
                        pathSegments.push('printchar');
                        break;
                    case 'WmkChar':
                        pathSegments.push('wmkchar');
                        break;
                    case 'PerfSep':
                        pathSegments.push('perfsep');
                        break;
                    case 'Overprints':
                        pathSegments.push('overprints');
                        break;
                    case 'ErrorsVar':
                        pathSegments.push('errorsvar');
                        break;
                    case 'KnownRarity':
                        pathSegments.push('knownrarity');
                        break;
                    case 'Denomination':
                        pathSegments.push('denomination');
                        break;
                    case 'SingleColor':
                        pathSegments.push('singlecolor');
                        break;
                    case 'PaperTypes':
                        pathSegments.push('papertypes');
                        break;
                    case 'PrintMethods':
                        pathSegments.push('printmethods');
                        break;
                    case 'PerfTypes':
                        pathSegments.push('perftypes');
                        break;
                    case 'WatermarkDetails':
                        pathSegments.push('watermarkdetails');
                        break;
                    case 'SpecificTypes':
                        pathSegments.push('specifictypes');
                        break;
                    case 'WmkOrientation':
                        pathSegments.push('wmkorientation');
                        break;
                    case 'GeneralTypes':
                        pathSegments.push('generaltypes');
                        break;
                    default:
                        // For nested categories, use lowercase
                        pathSegments.push(categoryId.toLowerCase());
                        break;
                }
            }
            
            // Now add the final field mapping
            switch (fieldId) {
                case 'Country':
                    pathSegments.push('country');
                    break;
                case 'IssueDate':
                    pathSegments.push('issuedate');
                    break;
                case 'DenominationValue':
                    pathSegments.push('denominationvalue');
                    break;
                case 'DenominationCurrency':
                    pathSegments.push('denominationcurrency');
                    break;
                case 'DenominationSymbol':
                    pathSegments.push('denominationsymbol');
                    break;
                case 'OwnershipStatus':
                    pathSegments.push('ownershipstatus');
                    break;
                case 'PurchasePrice':
                    pathSegments.push('purchaseprice');
                    break;
                case 'PurchaseDate':
                    pathSegments.push('purchasedate');
                    break;
                case 'Notes':
                    pathSegments.push('notes');
                    break;
                case 'ColorType':
                    pathSegments.push('colortype');
                    break;
                case 'ItTypSel':
                    pathSegments.push('ittypsel');
                    break;
                case 'WatermarkPresence':
                    pathSegments.push('watermarkpresence');
                    break;
                case 'WmkSpecific':
                    pathSegments.push('wmkspecific');
                    break;
                case 'CustomWatermark':
                    pathSegments.push('customwatermark');
                    break;
                case 'Orientation':
                    pathSegments.push('orientation');
                    break;
                case 'WmkType':
                    pathSegments.push('wmktype');
                    break;
                case 'WmkError':
                    pathSegments.push('wmkerror');
                    break;
                case 'PaperType':
                    pathSegments.push('papertype');
                    break;
                case 'PrintMethod':
                    pathSegments.push('printmethod');
                    break;
                case 'PerfType':
                    pathSegments.push('perftype');
                    break;
                case 'OverprintPresence':
                    pathSegments.push('overprintpresence');
                    break;
                case 'ErrorPresence':
                    pathSegments.push('errorpresence');
                    break;
                case 'RarityRating':
                    pathSegments.push('rarityrating');
                    break;
                case 'PurpleShade':
                    pathSegments.push('purpleshade');
                    break;
                case 'BrownShade':
                    pathSegments.push('brownshade');
                    break;
                case 'RedShade':
                    pathSegments.push('redshade');
                    break;
                case 'BlueShade':
                    pathSegments.push('blueshade');
                    break;
                case 'GreenShade':
                    pathSegments.push('greenshade');
                    break;
                default:
                    pathSegments.push(fieldId.toLowerCase());
                    break;
            }
        } else {
            // Original logic for non-direct field edits (legacy path)
        // Map navigation path to form data structure
        for (let i = 0; i < navigationPath.length; i++) {
            const pathItem = navigationPath[i];
            const categoryId = pathItem.id;
            
                // Map specific categories to their form data keys (same as above)
            switch (categoryId) {
                case 'PrimaryDetails':
                    pathSegments.push('primarydetails');
                    break;
                case 'Colors':
                    pathSegments.push('colors');
                    break;
                case 'ItTyp':
                    pathSegments.push('ittyp');
                    break;
                case 'PaperChar':
                    pathSegments.push('paperchar');
                    break;
                case 'PrintChar':
                    pathSegments.push('printchar');
                    break;
                case 'WmkChar':
                    pathSegments.push('wmkchar');
                    break;
                case 'PerfSep':
                    pathSegments.push('perfsep');
                    break;
                case 'Overprints':
                    pathSegments.push('overprints');
                    break;
                case 'ErrorsVar':
                    pathSegments.push('errorsvar');
                    break;
                case 'KnownRarity':
                    pathSegments.push('knownrarity');
                    break;
                case 'Denomination':
                    pathSegments.push('denomination');
                    break;
                case 'SingleColor':
                    pathSegments.push('singlecolor');
                    break;
                case 'PaperTypes':
                    pathSegments.push('papertypes');
                    break;
                case 'PrintMethods':
                    pathSegments.push('printmethods');
                    break;
                case 'PerfTypes':
                    pathSegments.push('perftypes');
                    break;
                default:
                    // For nested categories, use lowercase
                    pathSegments.push(categoryId.toLowerCase());
                    break;
            }
        }
        
            // Add the field ID with proper mapping (same as above)
        // Special handling to prevent double nesting for item type
        if (pathSegments[pathSegments.length - 1] === 'ittyp' && fieldId === 'ItTypSel') {
            // For ItTypSel directly under ittyp, add 'ittypsel' only once
            pathSegments.push('ittypsel');
        } else {
            switch (fieldId) {
                case 'Country':
                    pathSegments.push('country');
                    break;
                case 'IssueDate':
                    pathSegments.push('issuedate');
                    break;
                case 'DenominationValue':
                    pathSegments.push('denominationvalue');
                    break;
                case 'DenominationCurrency':
                    pathSegments.push('denominationcurrency');
                    break;
                case 'DenominationSymbol':
                    pathSegments.push('denominationsymbol');
                    break;
                case 'OwnershipStatus':
                    pathSegments.push('ownershipstatus');
                    break;
                case 'PurchasePrice':
                    pathSegments.push('purchaseprice');
                    break;
                case 'PurchaseDate':
                    pathSegments.push('purchasedate');
                    break;
                case 'Notes':
                    pathSegments.push('notes');
                    break;
                case 'ColorType':
                    pathSegments.push('colortype');
                    break;
                case 'ItTypSel':
                    // This should never be reached due to special handling above
                    pathSegments.push('ittypsel');
                    break;
                case 'WatermarkPresence':
                    pathSegments.push('watermarkpresence');
                    break;
                    case 'WmkSpecific':
                        pathSegments.push('wmkspecific');
                        break;
                    case 'CustomWatermark':
                        pathSegments.push('customwatermark');
                        break;
                    case 'Orientation':
                        pathSegments.push('orientation');
                        break;
                    case 'WmkError':
                        pathSegments.push('wmkerror');
                        break;
                case 'PaperType':
                    pathSegments.push('papertype');
                    break;
                case 'PrintMethod':
                    pathSegments.push('printmethod');
                    break;
                case 'PerfType':
                    pathSegments.push('perftype');
                    break;
                case 'OverprintPresence':
                    pathSegments.push('overprintpresence');
                    break;
                case 'ErrorPresence':
                    pathSegments.push('errorpresence');
                    break;
                case 'RarityRating':
                    pathSegments.push('rarityrating');
                    break;
                case 'PurpleShade':
                    pathSegments.push('purpleshade');
                    break;
                case 'BrownShade':
                    pathSegments.push('brownshade');
                    break;
                case 'RedShade':
                    pathSegments.push('redshade');
                    break;
                case 'BlueShade':
                    pathSegments.push('blueshade');
                    break;
                case 'GreenShade':
                    pathSegments.push('greenshade');
                    break;
                default:
                    pathSegments.push(fieldId.toLowerCase());
                    break;
                }
            }
        }
        
        console.log('createFieldPath - Final path segments:', pathSegments);
        return pathSegments;
    };

    // Safely get nested value from object
    const getNestedValue = (obj: any, path: string[]): any => {
        let current = obj;
        for (const key of path) {
            if (current === null || current === undefined || typeof current !== 'object') {
                return '';
            }
            current = current[key];
        }
        return current;
    };

    // Safely set nested value in object
    const setNestedValue = (obj: any, path: string[], value: any): any => {
        if (path.length === 0) return obj;
        
        // Debug logging for watermark fields specifically
        if (path.some(p => p.includes('wmk'))) {
            console.log('setNestedValue - WATERMARK FIELD DETECTED:');
            console.log('setNestedValue - path:', path);
            console.log('setNestedValue - value:', value);
            console.log('setNestedValue - value type:', typeof value);
            console.log('setNestedValue - original obj structure:', JSON.stringify(obj, null, 2));
        }
        
        const newObj = JSON.parse(JSON.stringify(obj)); // Deep clone
        let current = newObj;
        
        // Navigate to the parent of the target property
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
            
            // If the key doesn't exist or is not an object, create an empty object
            if (!current[key] || typeof current[key] !== 'object' || Array.isArray(current[key])) {
                current[key] = {};
            }
            current = current[key];
        }
        
        // Set the final value DIRECTLY - this prevents double nesting
        const finalKey = path[path.length - 1];
        current[finalKey] = value; // Always set the value directly, never wrap in an object
        
        // Debug logging for watermark fields specifically
        if (path.some(p => p.includes('wmk'))) {
            console.log('setNestedValue - AFTER SETTING WATERMARK VALUE:');
            console.log('setNestedValue - final key:', finalKey);
            console.log('setNestedValue - value set to:', current[finalKey]);
            console.log('setNestedValue - new obj structure:', JSON.stringify(newObj, null, 2));
        }
        
        return newObj;
    };

    // Separate field handling for Edit Tab (navigation-based)
    const handleEditTabFieldChange = (navigationPath: NavigationPathItem[], fieldId: string, value: string) => {
        try {
            console.log('handleEditTabFieldChange - Called with:', {
                navigationPath: navigationPath.map(p => p.id),
                fieldId,
                value
            });
            
            // Special debugging for watermark fields
            if (fieldId.toLowerCase().includes('watermark') || navigationPath.some(p => p.id.toLowerCase().includes('wmk'))) {
                console.log('handleEditTabFieldChange - WATERMARK FIELD UPDATE detected!');
                console.log('handleEditTabFieldChange - Watermark field ID:', fieldId);
                console.log('handleEditTabFieldChange - Navigation path IDs:', navigationPath.map(p => p.id));
                console.log('handleEditTabFieldChange - New value:', value);
                console.log('handleEditTabFieldChange - Value type:', typeof value);
                console.log('handleEditTabFieldChange - Current wmkchar before update:', formData.wmkchar);
            }
            
            // TEMPORARY DEBUG: Direct handling for ItTypSel
            if (fieldId === 'ItTypSel') {
                console.log('handleEditTabFieldChange - DIRECT HANDLING for ItTypSel, setting value:', value);
                setFormData(prevData => {
                    const newData = { ...prevData };
                    if (!newData.ittyp) {
                        newData.ittyp = {};
                    }
                    newData.ittyp.ittypsel = value;  // Set directly as string
                    console.log('handleEditTabFieldChange - New formData.ittyp after direct set:', newData.ittyp);
                    return newData;
                });
                return; // Skip the complex path logic for now
            }
            
            // Create the actual path in the form data structure
            const formPath = createFieldPath(navigationPath, fieldId);
            
            console.log('handleEditTabFieldChange - Computed form path:', formPath);
            
            // Special debugging for watermark fields - show path details
            if (fieldId.toLowerCase().includes('watermark') || navigationPath.some(p => p.id.toLowerCase().includes('wmk'))) {
                console.log('handleEditTabFieldChange - WATERMARK PATH DETAILS:');
                console.log('handleEditTabFieldChange - Navigation path IDs:', navigationPath.map(p => p.id));
                console.log('handleEditTabFieldChange - Field ID:', fieldId);
                console.log('handleEditTabFieldChange - Computed form path:', formPath);
                console.log('handleEditTabFieldChange - Will set value at path:', formPath.join('.'));
            }
            
            // Update the form data using the robust setter
            let newFormData = setNestedValue(formData, formPath, value);
            
            // AUTO-SET WATERMARK PRESENCE: If any watermark detail is filled, set presence to "Yes"
            const isWatermarkDetailField = (
                fieldId.toLowerCase().includes('wmk') || 
                fieldId.toLowerCase().includes('watermark') || 
                navigationPath.some(p => p.id.toLowerCase().includes('wmk'))
            ) && fieldId !== 'WatermarkPresence'; // Don't trigger on the presence field itself
            
            if (isWatermarkDetailField && value && value.trim() !== '') {
                console.log('handleEditTabFieldChange - AUTO-SETTING watermark presence due to detail field update');
                
                // Ensure wmkchar structure exists
                if (!newFormData.wmkchar) {
                    newFormData.wmkchar = {};
                }
                
                // Set watermark presence to "Yes - Watermark Present"
                newFormData.wmkchar.watermarkpresence = 'Yes - Watermark Present';
                
                console.log('handleEditTabFieldChange - Auto-set watermark presence to:', newFormData.wmkchar.watermarkpresence);
            }
            
            console.log('handleEditTabFieldChange - About to set new form data');
            setFormData(newFormData);
            
            // Special debugging for watermark fields - log after update
            if (fieldId.toLowerCase().includes('watermark') || navigationPath.some(p => p.id.toLowerCase().includes('wmk'))) {
                console.log('handleEditTabFieldChange - Watermark field updated, new formData will be:', newFormData);
                console.log('handleEditTabFieldChange - New wmkchar after update:', newFormData.wmkchar);
                console.log('handleEditTabFieldChange - Value at computed path:', getNestedValue(newFormData, formPath));
            }
            
            console.log('handleEditTabFieldChange - Form data updated');
            
        } catch (error) {
            console.error('Error in handleEditTabFieldChange:', error, 'Navigation Path:', navigationPath, 'Field ID:', fieldId, 'Value:', value);
        }
    };

    // Separate field handling for Preview Tab (direct path-based)
    const handlePreviewTabFieldChange = (path: NavigationPathItem[], value: string) => {
        try {
            // Extract field ID from the last item in the path
            const fieldId = path[path.length - 1]?.id;
            if (!fieldId) {
                console.warn('Preview Tab - No field ID found in path:', path);
                return;
            }
            
            console.log('Preview Tab - Setting field:', fieldId, 'from full path:', path.map(p => p.id), 'to value:', value);
            
            // Create the actual path in the form data structure
            const formPath = createFieldPath(path.slice(0, -1), fieldId);
            
            console.log('Preview Tab - Computed form path:', formPath);
            
            // Update the form data using the robust setter
            const newFormData = setNestedValue(formData, formPath, value);
            setFormData(newFormData);
            
        } catch (error) {
            console.error('Error in handlePreviewTabFieldChange:', error, 'Path:', path, 'Value:', value);
        }
    };

    // Updated field value getter for Edit Tab (consistent with edit tab usage)
    const getEditTabFormValue = (navigationPath: NavigationPathItem[], fieldId: string): string => {
        try {
            console.log('getEditTabFormValue - Called with:', {
                navigationPath: navigationPath.map(p => p.id),
                fieldId
            });
            
            // TEMPORARY DEBUG: Direct check for ItTypSel
            if (fieldId === 'ItTypSel') {
                console.log('getEditTabFormValue - DIRECT CHECK for ItTypSel in formData.ittyp:', formData.ittyp);
                if (formData.ittyp?.ittypsel) {
                    let value = formData.ittyp.ittypsel;
                    console.log('getEditTabFormValue - Raw ittypsel value:', value, 'type:', typeof value);
                    
                    // Handle double nesting
                    if (typeof value === 'object' && value.ittypsel) {
                        value = value.ittypsel;
                        console.log('getEditTabFormValue - Extracted from nested structure:', value);
                    }
                    
                    if (typeof value === 'string') {
                        console.log('getEditTabFormValue - Returning ItTypSel string value:', value);
                        return value;
                    }
                }
                console.log('getEditTabFormValue - No valid ItTypSel value found, returning empty string');
                return '';
            }
            
            // Create the actual path in the form data structure  
            const formPath = createFieldPath(navigationPath, fieldId);
            
            console.log('getEditTabFormValue - Computed form path:', formPath);
            
            // Get the value using the robust getter
            const value = getNestedValue(formData, formPath);
            
            console.log('getEditTabFormValue - Retrieved raw value:', value, 'type:', typeof value);
        
        // Convert to string safely
        if (value === null || value === undefined) {
            console.log('getEditTabFormValue - Returning empty string for null/undefined');
            return '';
        }
        if (typeof value === 'string') {
            console.log('getEditTabFormValue - Returning string value:', value);
            return value;
        }
        if (typeof value === 'number') {
            const result = value.toString();
            console.log('getEditTabFormValue - Returning number as string:', result);
            return result;
        }
            if (typeof value === 'boolean') {
                const result = value.toString();
                console.log('getEditTabFormValue - Returning boolean as string:', result);
                return result;
            }
            
            // For complex objects, try to extract meaningful values
            if (typeof value === 'object' && !Array.isArray(value)) {
                console.log('getEditTabFormValue - Processing object value:', value);
                
                // SPECIAL HANDLING FOR DOUBLE-NESTED STRUCTURES
                // Check if this is a double-nested object where the field name is repeated
                const fieldIdLower = fieldId.toLowerCase();
                if (value[fieldIdLower] && typeof value[fieldIdLower] === 'string') {
                    const result = String(value[fieldIdLower]);
                    console.log('getEditTabFormValue - Extracted from double-nested fieldId:', result);
                    return result;
                }
                
                // Check for watermark-specific patterns
                if (fieldId === 'WmkSpecific' && value.wmkspecific) {
                    const result = String(value.wmkspecific);
                    console.log('getEditTabFormValue - Extracted wmkspecific:', result);
                    return result;
                }
                if (fieldId === 'WatermarkPresence' && value.watermarkpresence) {
                    const result = String(value.watermarkpresence);
                    console.log('getEditTabFormValue - Extracted watermarkpresence:', result);
                    return result;
                }
                if (fieldId === 'Orientation' && value.orientation) {
                    const result = String(value.orientation);
                    console.log('getEditTabFormValue - Extracted orientation:', result);
                    return result;
                }
                if (fieldId === 'WmkType' && value.wmktype) {
                    const result = String(value.wmktype);
                    console.log('getEditTabFormValue - Extracted wmktype:', result);
                    return result;
                }
                
                // Look for common field patterns
            if (value.perftype) {
                const result = String(value.perftype);
                console.log('getEditTabFormValue - Extracted perftype:', result);
                return result;
            }
            if (value.papertype) {
                const result = String(value.papertype);
                console.log('getEditTabFormValue - Extracted papertype:', result);
                return result;
            }
            if (value.colortype) {
                const result = String(value.colortype);
                console.log('getEditTabFormValue - Extracted colortype:', result);
                return result;
            }
            if (value.watermarkpresence) {
                const result = String(value.watermarkpresence);
                console.log('getEditTabFormValue - Extracted watermarkpresence:', result);
                return result;
            }
                
                // Return first string value found
            const stringValue = Object.values(value).find(v => typeof v === 'string');
            const result = stringValue ? String(stringValue) : '';
            console.log('getEditTabFormValue - Extracted first string value:', result);
            return result;
        }
        
        const result = String(value);
        console.log('getEditTabFormValue - Returning generic string conversion:', result);
        return result;
            
        } catch (error) {
            console.error('Error in getEditTabFormValue:', error, 'Navigation Path:', navigationPath, 'Field ID:', fieldId);
            return '';
        }
    };

    // Legacy function name kept for backwards compatibility but now uses Edit Tab logic
    const getNestedFormValue = getEditTabFormValue;

    // Legacy function name kept for backwards compatibility but now uses Preview Tab logic
    const handleFieldChange = handlePreviewTabFieldChange;

    // Update shouldShow to handle nested data structure
    const shouldShow = (item: Category): boolean => {
        if (!item.showWhen) return true;
        const { field, value } = item.showWhen;

        try {
            // Find the dependency field by searching through the entire form data structure
            // rather than using the current navigation path
            const findFieldValue = (data: any, fieldId: string): any => {
                if (!data || typeof data !== 'object') return null;
                
                // Debug logging for watermark specifically
                if (fieldId === 'WatermarkPresence') {
                    console.log('findFieldValue - Searching for WatermarkPresence in:', data);
                }
                
                // Check if the field exists directly at this level (try exact case first, then lowercase)
                if (data[fieldId]) {
                    let value = data[fieldId];
                    // If the value is an object with a key matching the fieldId, extract it
                    if (typeof value === 'object' && value !== null && value[fieldId.toLowerCase()]) {
                        value = value[fieldId.toLowerCase()];
                    }
                    if (fieldId === 'WatermarkPresence') {
                        console.log('findFieldValue - Found WatermarkPresence with exact case:', value);
                    }
                    return value;
                }
                if (data[fieldId.toLowerCase()]) {
                    let value = data[fieldId.toLowerCase()];
                    // If the value is an object with a key matching the fieldId, extract it
                    if (typeof value === 'object' && value !== null && value[fieldId.toLowerCase()]) {
                        value = value[fieldId.toLowerCase()];
                    }
                    if (fieldId === 'WatermarkPresence') {
                        console.log('findFieldValue - Found WatermarkPresence with lowercase:', value);
                    }
                    return value;
                }
                
                // Also try some common field name variations
                const variations = [
                    fieldId,
                    fieldId.toLowerCase(),
                    fieldId.replace(/([A-Z])/g, (match, letter, offset) => offset > 0 ? '_' + letter.toLowerCase() : letter.toLowerCase()),
                    fieldId.replace(/([A-Z])/g, (match, letter, offset) => offset > 0 ? letter.toLowerCase() : letter.toLowerCase())
                ];
                
                for (const variation of variations) {
                    if (data[variation]) {
                        let value = data[variation];
                        // If the value is an object with a key matching the fieldId, extract it
                        if (typeof value === 'object' && value !== null) {
                            if (value[fieldId.toLowerCase()]) {
                                value = value[fieldId.toLowerCase()];
                            } else if (value[variation]) {
                                value = value[variation];
                            }
                        }
                        if (fieldId === 'WatermarkPresence') {
                            console.log(`findFieldValue - Found WatermarkPresence with variation '${variation}':`, value);
                        }
                        return value;
                    }
                }
                
                // Recursively search through nested objects
                for (const [key, val] of Object.entries(data)) {
                    if (val && typeof val === 'object' && !Array.isArray(val)) {
                        const result = findFieldValue(val, fieldId);
                        if (result !== null) {
                            if (fieldId === 'WatermarkPresence') {
                                console.log(`findFieldValue - Found WatermarkPresence in nested object '${key}':`, result);
                            }
                            return result;
                        }
                    }
                }
                
                return null;
            };
            
            // Search for the field value in the entire form data
            const currentValue = findFieldValue(formData, field);
            
            console.log('shouldShow check:', {
                itemId: item.id,
                itemLabel: item.label,
                field,
                expectedValue: value,
                currentValue,
                currentValueType: typeof currentValue,
                formDataKeys: Object.keys(formData),
                shouldShow: String(currentValue || '') === value
            });
            
            // Special debug for watermark fields
            if (field === 'WatermarkPresence' || item.id.includes('Watermark')) {
                console.log('WATERMARK DEBUGGING:', {
                    itemId: item.id,
                    itemLabel: item.label,
                    field,
                    expectedValue: value,
                    currentValue,
                    wmkCharData: formData.wmkchar,
                    comparison: `"${String(currentValue || '')}" === "${value}"`,
                    result: String(currentValue || '') === value
                });
            }
            
            // Compare the final value with the expected value
            return String(currentValue || '') === value;
        } catch (error) {
            console.warn('Error in shouldShow:', error, 'Field:', field, 'Expected value:', value);
            return true; // Default to showing the item if there's an error
        }
    };

    // Helper function to find a category by path
    const findCategoryByPath = (path: NavigationPathItem[]): Category | undefined => {
        if (path.length === 0) return undefined;

        let categories = allCategories;
        let current: Category | undefined = undefined;

        for (const item of path) {
            current = categories.find(c => c.id === item.id);
            if (!current?.children) break;
            categories = current.children;
        }

        return current;
    };

    // Navigation handlers
    const handleCategoryClick = (category: Category) => {
        setNavigationPath([{ id: category.id, label: category.label, category }]);
    };

    const handleNestedCategoryClick = (category: Category) => {
        setNavigationPath([...navigationPath, { id: category.id, label: category.label, category }]);
    };

    // Render content based on current navigation path
    const renderContent = () => {
        const currentCategory = findCategoryByPath(navigationPath);

        // Root level - show all categories
        if (!currentCategory && navigationPath.length === 0) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allCategories.map((category) => (
                        <Button
                            key={category.id}
                            variant="outline"
                            className="h-auto w-full py-4 px-4 sm:px-6 text-left flex flex-col items-start overflow-hidden"
                            onClick={() => handleCategoryClick(category)}
                        >
                            <span className="font-medium truncate w-full">{category.label}</span>
                            {category.description && (
                                <span className="text-sm text-muted-foreground mt-1 line-clamp-2 w-full">
                                    {category.description}
                                </span>
                            )}
                        </Button>
                    ))}
                    <AddDialog />
                </div>
            );
        }

        // If current category is a field type, render the field input
        if (currentCategory?.type) {
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">{currentCategory.label}</h3>
                    <p className="text-sm text-muted-foreground">{currentCategory.description}</p>
                    {renderField(currentCategory)}
                </div>
            );
        }

        // Get children of current category
        const children = currentCategory?.children || [];
        const visibleChildren = children.filter(shouldShow);

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleChildren.map((child) => (
                        <Button
                            key={child.id}
                            variant="outline"
                            className="h-auto w-full py-4 px-4 sm:px-6 text-left flex flex-col items-start overflow-hidden"
                            onClick={() => handleNestedCategoryClick(child)}
                        >
                            <span className="font-medium truncate w-full">{child.label}</span>
                            {child.description && (
                                <span className="text-sm text-muted-foreground mt-1 line-clamp-2 w-full">
                                    {child.description}
                                </span>
                            )}
                        </Button>
                    ))}
                    <AddDialog categoryId={currentCategory?.id} />
                </div>
            </div>
        );
    };

    // Update renderField to use the correct Edit Tab functions
    const renderField = (field: Category) => {
        const currentValue = getEditTabFormValue(navigationPath, field.id);
        
        console.log('Rendering field:', field.id, 'with current value:', currentValue, 'navigation path:', navigationPath.map(p => p.id));

        switch (field.type) {
            case 'select':
                return (
                    <Select
                        value={currentValue}
                        onValueChange={(value) => handleEditTabFieldChange(navigationPath, field.id, value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case 'textarea':
                return (
                    <textarea
                        className="w-full min-h-[100px] p-2 border rounded"
                        value={currentValue}
                        onChange={(e) => handleEditTabFieldChange(navigationPath, field.id, e.target.value)}
                        placeholder={field.description}
                    />
                );
            case 'date':
                return (
                    <Input
                        type="date"
                        value={currentValue}
                        onChange={(e) => handleEditTabFieldChange(navigationPath, field.id, e.target.value)}
                    />
                );
            default:
                return (
                    <Input
                        type="text"
                        value={currentValue}
                        onChange={(e) => handleEditTabFieldChange(navigationPath, field.id, e.target.value)}
                        placeholder={field.description}
                    />
                );
        }
    };

    // Render breadcrumb navigation
    const renderBreadcrumbs = () => (
        <div className="flex items-center gap-1 sm:gap-2 text-sm text-muted-foreground overflow-x-auto">
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => setNavigationPath([])}
            >
                <Home className="h-4 w-4" />
            </Button>
            {navigationPath.map((item, index) => (
                <React.Fragment key={item.id}>
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate max-w-[120px] sm:max-w-none">{item.label}</span>
                </React.Fragment>
            ))}
        </div>
    );

    // Replace both dialog components with a unified AddDialog
    function AddDialog({ categoryId }: { categoryId?: string }) {
        const [type, setType] = useState<'category' | 'field'>('field');
        const [newItem, setNewItem] = useState({
            id: '',
            label: '',
            type: 'text' as const,
            description: '',
            children: [] as Category[]
        });

        const handleSubmit = () => {
            if (newItem.label && newItem.id) {
                if (type === 'category') {
                    // When adding a category/subcategory, don't include the type field
                    const { type: _, ...categoryData } = newItem;
                    handleAddCategory({
                        ...categoryData,
                        children: []
                    });
                } else {
                    // When adding a field, include the type field
                    handleAddField(categoryId!, {
                        ...newItem
                    });
                }
            }
        };

        return (
            <Dialog>
                <DialogTrigger className="gap-2 h-[104px] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                        <div className="flex flex-col items-center justify-center">
                            <PlusCircle className="h-5 w-5 mb-2" />
                            <span>Add New</span>
                        </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label>What would you like to add?</Label>
                            <RadioGroup
                                value={type}
                                onValueChange={(value: 'category' | 'field') => {
                                    setType(value);
                                    // Reset the type field when switching between category and field
                                    if (value === 'category') {
                                        setNewItem(prev => ({ ...prev, type: 'text' }));
                                    }
                                }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="category" id="category" />
                                    <Label htmlFor="category">
                                        {categoryId ? 'Subcategory' : 'Category'}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="field" id="field" />
                                    <Label htmlFor="field">Field</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="itemId">
                                    {type === 'category' ? (categoryId ? 'Subcategory' : 'Category') : 'Field'} ID
                                </Label>
                                <Input
                                    id="itemId"
                                    placeholder={`Enter a unique identifier`}
                                    value={newItem.id}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, id: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="itemLabel">
                                    {type === 'category' ? (categoryId ? 'Subcategory' : 'Category') : 'Field'} Label
                                </Label>
                                <Input
                                    id="itemLabel"
                                    placeholder={`Enter name`}
                                    value={newItem.label}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, label: e.target.value }))}
                                />
                            </div>
                            {type === 'field' && (
                                <div className="space-y-2">
                                    <Label htmlFor="fieldType">Field Type</Label>
                                    <Select
                                        value={newItem.type}
                                        onValueChange={(value: any) => setNewItem(prev => ({ ...prev, type: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select field type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="textarea">Text Area</SelectItem>
                                            <SelectItem value="select">Select</SelectItem>
                                            <SelectItem value="date">Date</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="itemDescription">Description</Label>
                                <Input
                                    id="itemDescription"
                                    placeholder={`Enter description`}
                                    value={newItem.description}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                        </div>

                        <Button onClick={handleSubmit} className="w-full">
                            Add {type === 'category' ? (categoryId ? 'Subcategory' : 'Category') : 'Field'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
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

    // Helper function to get user ID from localStorage
    const getUserId = (): string | null => {
        if (typeof window !== 'undefined') {
            try {
                const userData = getUserData();
                return userData?.userId || null;
            } catch (error) {
                console.error('Error getting user data:', error);
                return null;
            }
        }
        return null;
    };

    // Function to transform form data to API format
    const transformFormDataToApiFormat = (formData: Record<string, any>, categories: Category[]): any[] => {
        const result: any[] = [];

        // Helper function to determine field type based on category definition
        const getFieldType = (categoryId: string, fieldId: string): string => {
            const category = findCategoryInTree(categoryId, categories);
            if (category?.type === 'select') return 'Select Input';
            if (category?.type === 'textarea') return 'Text Area';
            if (category?.type === 'date') return 'Date Input';
            return 'Text Input';
        };

        // Helper function to get field options for select fields
        const getFieldOptions = (categoryId: string): string[] | undefined => {
            const category = findCategoryInTree(categoryId, categories);
            return category?.options;
        };

        // Recursive function to process nested form data
        const processFormData = (data: any, parentKey: string = '', level: number = 0): void => {
            if (!data || typeof data !== 'object') return;

            Object.entries(data).forEach(([key, value]) => {
                const fullKey = parentKey ? `${parentKey}.${key}` : key;
                
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    // This is a nested object, create a category entry
                    const categoryLabel = findCategoryLabel(key, categories);
                    const categoryItem: any = {
                        key: key,
                        label: categoryLabel,
                        type: 'Category',
                        value: '',
                        children: []
                    };

                    // Process children
                    const childrenData: any[] = [];
                    Object.entries(value).forEach(([childKey, childValue]) => {
                        if (childValue && typeof childValue === 'object' && !Array.isArray(childValue)) {
                            // Nested category
                            processNestedCategory(childValue, childKey, childrenData);
                        } else {
                            // Direct field
                            const fieldLabel = findCategoryLabel(childKey, categories);
                            const fieldType = getFieldType(fullKey, childKey);
                            const fieldOptions = getFieldOptions(`${fullKey}.${childKey}`);
                            
                            const fieldItem: any = {
                                key: childKey,
                                label: fieldLabel,
                                type: fieldType,
                                value: String(childValue || '')
                            };

                            if (fieldOptions && fieldOptions.length > 0) {
                                fieldItem.options = fieldOptions;
                            }

                            childrenData.push(fieldItem);
                        }
                    });

                    if (childrenData.length > 0) {
                        categoryItem.children = childrenData;
                        result.push(categoryItem);
                    }
                } else {
                    // This is a direct field value
                    const fieldLabel = findCategoryLabel(key, categories);
                    const fieldType = getFieldType(parentKey, key);
                    const fieldOptions = getFieldOptions(fullKey);
                    
                    const fieldItem: any = {
                        key: key,
                        label: fieldLabel,
                        type: fieldType,
                        value: String(value || '')
                    };

                    if (fieldOptions && fieldOptions.length > 0) {
                        fieldItem.options = fieldOptions;
                    }

                    result.push(fieldItem);
                }
            });
        };

        // Helper function to process nested categories
        const processNestedCategory = (data: any, categoryKey: string, parentChildren: any[]): void => {
            const categoryLabel = findCategoryLabel(categoryKey, categories);
            const categoryItem: any = {
                key: categoryKey,
                label: categoryLabel,
                type: 'Category',
                value: '',
                children: []
            };

            Object.entries(data).forEach(([key, value]) => {
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    // Further nested category
                    processNestedCategory(value, key, categoryItem.children);
                } else {
                    // Direct field
                    const fieldLabel = findCategoryLabel(key, categories);
                    const fieldType = getFieldType(categoryKey, key);
                    const fieldOptions = getFieldOptions(`${categoryKey}.${key}`);
                    
                    const fieldItem: any = {
                        key: key,
                        label: fieldLabel,
                        type: fieldType,
                        value: String(value || '')
                    };

                    if (fieldOptions && fieldOptions.length > 0) {
                        fieldItem.options = fieldOptions;
                    }

                    categoryItem.children.push(fieldItem);
                }
            });

            if (categoryItem.children.length > 0) {
                parentChildren.push(categoryItem);
            }
        };

        // Start processing from root level
        processFormData(formData);

        return result;
    };

    const getMergedStampData = (): any => {
        if (!selectedStamp.apiData) return {};

        const mergedData = { ...selectedStamp.apiData };
        
        console.log('DEBUG - getMergedStampData starting with:', {
            originalApiData: selectedStamp.apiData,
            formDataKeys: Object.keys(formData),
            primaryDetails: formData.primarydetails,
            paperChar: formData.paperchar
        });

        // Extract data from primarydetails (not primaryinfo)
        if (formData.primarydetails) {
            console.log('DEBUG - Processing primarydetails:', formData.primarydetails);
            
            if (formData.primarydetails.country) {
                mergedData.country = formData.primarydetails.country;
                console.log('DEBUG - Set country from form:', formData.primarydetails.country);
            }
            if (formData.primarydetails.issuedate) {
                mergedData.issueDate = formData.primarydetails.issuedate;
                console.log('DEBUG - Set issueDate from form:', formData.primarydetails.issuedate);
            }
            if (formData.primarydetails.cataloguenumber) {
                mergedData.catalogNumber = formData.primarydetails.cataloguenumber;
                console.log('DEBUG - Set catalogNumber from form:', formData.primarydetails.cataloguenumber);
            }
            
            // Handle denomination structure
            if (formData.primarydetails.denomination) {
                if (formData.primarydetails.denomination.denominationvalue) {
                    mergedData.denominationValue = parseFloat(formData.primarydetails.denomination.denominationvalue) || 0;
                }
                if (formData.primarydetails.denomination.denominationcurrency) {
                    mergedData.denominationCurrency = formData.primarydetails.denomination.denominationcurrency;
                }
                if (formData.primarydetails.denomination.denominationsymbol) {
                    mergedData.denominationSymbol = formData.primarydetails.denomination.denominationsymbol;
                }
            }
        }

        // Extract color from colors section
        if (formData.colors) {
            let colorValue = '';
            
            if (formData.colors.colortype === 'Single Color' && formData.colors.singlecolor) {
                // Extract single color value
                const singleColor = formData.colors.singlecolor;
                if (singleColor.purple?.purpleshade) {
                    const purpleShade = singleColor.purple.purpleshade;
                    colorValue = typeof purpleShade === 'string' ? purpleShade.split('(')[0].trim() : purpleShade;
                } else if (singleColor.brown?.brownshade) {
                    const brownShade = singleColor.brown.brownshade;
                    colorValue = typeof brownShade === 'string' ? brownShade.split('(')[0].trim() : brownShade;
                } else if (singleColor.red?.redshade) {
                    const redShade = singleColor.red.redshade;
                    colorValue = typeof redShade === 'string' ? redShade.split('(')[0].trim() : redShade;
                } else if (singleColor.blue?.blueshade) {
                    const blueShade = singleColor.blue.blueshade;
                    colorValue = typeof blueShade === 'string' ? blueShade.split('(')[0].trim() : blueShade;
                } else if (singleColor.green?.greenshade) {
                    const greenShade = singleColor.green.greenshade;
                    colorValue = typeof greenShade === 'string' ? greenShade.split('(')[0].trim() : greenShade;
                } else if (singleColor.black?.blackshade) {
                    const blackShade = singleColor.black.blackshade;
                    colorValue = typeof blackShade === 'string' ? blackShade.split('(')[0].trim() : blackShade;
                } else if (singleColor.grey?.greyshade) {
                    const greyShade = singleColor.grey.greyshade;
                    colorValue = typeof greyShade === 'string' ? greyShade.split('(')[0].trim() : greyShade;
                } else if (singleColor.yellow?.yellowshade) {
                    const yellowShade = singleColor.yellow.yellowshade;
                    colorValue = typeof yellowShade === 'string' ? yellowShade.split('(')[0].trim() : yellowShade;
                }
            } else if (formData.colors.colortype === 'Multiple Colors' && formData.colors.multiplecolors) {
                colorValue = formData.colors.multiplecolors.primarycolor || '';
            } else if (formData.colors.colortype) {
                // Handle direct color type values
                colorValue = formData.colors.colortype;
            }
            
            if (colorValue) {
                mergedData.color = colorValue;
            }
        }

        // Extract paper type from paper characteristics
        if (formData.paperchar?.papertypes?.papertype) {
            const paperType = formData.paperchar.papertypes.papertype;
            // Extract the descriptive part before the parentheses
            mergedData.paperType = typeof paperType === 'string' ? paperType.split('(')[0].trim() : paperType;
            console.log('DEBUG - Set paperType from form:', {
                originalPaperType: paperType,
                extractedPaperType: mergedData.paperType
            });
        }

        // Extract watermark info
        if (formData.wmkchar) {
            // Helper function to safely extract watermark presence
            const getWatermarkPresence = () => {
                if (formData.wmkchar.watermarkpresence) {
                    // Handle both direct string and nested object
                    if (typeof formData.wmkchar.watermarkpresence === 'string') {
                        return formData.wmkchar.watermarkpresence;
                    } else if (typeof formData.wmkchar.watermarkpresence === 'object' && formData.wmkchar.watermarkpresence.watermarkpresence) {
                        return formData.wmkchar.watermarkpresence.watermarkpresence;
                    }
                }
                return null;
            };
            
            const watermarkPresence = getWatermarkPresence();
            
            if (watermarkPresence === 'No - No Watermark') {
                mergedData.watermark = 'none';
            } else if (watermarkPresence === 'Yes - Watermark Present') {
                mergedData.watermark = 'present';
                // Try to get specific watermark info
                if (formData.wmkchar.watermarkdetails?.specifictypes) {
                    let wmkSpecific = formData.wmkchar.watermarkdetails.specifictypes.wmkspecific;
                    
                    // Handle double-nested wmkspecific
                    if (typeof wmkSpecific === 'object' && wmkSpecific.wmkspecific) {
                        wmkSpecific = wmkSpecific.wmkspecific;
                    }
                    
                    if (wmkSpecific) {
                        if (wmkSpecific === 'Other/Custom' && formData.wmkchar.watermarkdetails.specifictypes.customwatermark) {
                        mergedData.watermark = formData.wmkchar.watermarkdetails.specifictypes.customwatermark;
                    } else {
                            mergedData.watermark = typeof wmkSpecific === 'string' ? wmkSpecific.split('(')[0].trim() : wmkSpecific;
                    }
                }
                }
            } else if (typeof watermarkPresence === 'string') {
                // Direct watermark presence value
                mergedData.watermark = watermarkPresence;
            }
        }

        // Extract perforation type
        if (formData.perfsep?.perftypes?.perftype) {
            const perfType = formData.perfsep.perftypes.perftype;
            mergedData.perforation = typeof perfType === 'string' ? perfType.split('(')[0].trim() : perfType;
        }

        // Extract item type - check both possible paths
        if (formData.ittyp?.ittypsel) {
            (mergedData as any).itemType = formData.ittyp.ittypsel;
        } else if (formData.ittyp?.ittyp2) {
            (mergedData as any).itemType = formData.ittyp.ittyp2;
        }
        
        return mergedData;
    };

    // Function to generate stamp code from API data
    const generateStampCode = (apiData: any): string => {
        if (!apiData) return '';

        const parts: string[] = [];
        
        // Debug logging to understand the data structure
        console.log('generateStampCode - formData:', formData);
        console.log('generateStampCode - apiData:', apiData);

        // Country (Ctry) - abbreviated
        if (apiData.country) {
            let countryCode = '';
            // Safely convert to string and then to lowercase
            const country = typeof apiData.country === 'string' 
                ? apiData.country.toLowerCase() 
                : String(apiData.country).toLowerCase();
                
            if (country.includes('new zealand')) countryCode = 'NZ';
            else if (country.includes('australia')) countryCode = 'AU';
            else if (country.includes('great britain') || country.includes('united kingdom')) countryCode = 'GB';
            else if (country.includes('united states')) countryCode = 'US';
            else if (country.includes('canada')) countryCode = 'CA';
            else {
                // Safely extract country code
                const countryStr = typeof apiData.country === 'string' 
                    ? apiData.country 
                    : String(apiData.country);
                countryCode = countryStr.substring(0, 2).toUpperCase();
            }
            
            if (countryCode) parts.push(countryCode);
        }

        // Stamp Group (StGp) - using catalog number or series
        if (apiData.catalogNumber) {
            // Safely convert to string before regex
            const catalogStr = typeof apiData.catalogNumber === 'string' 
                ? apiData.catalogNumber 
                : String(apiData.catalogNumber);
            // Extract numeric part from catalog number
            const match = catalogStr.match(/\d+/);
            if (match) {
                parts.push(match[0].padStart(3, '0'));
            }
        }

        // Year (Yr) - from issue date
        if (apiData.issueDate) {
            const dateStr = typeof apiData.issueDate === 'string' 
                ? apiData.issueDate 
                : String(apiData.issueDate);
            const year = new Date(dateStr).getFullYear();
            if (!isNaN(year)) {
                parts.push(year.toString());
            }
        }

        // Currency (Cur) - from denomination - USE FORM DATA FIRST
        let currencyStr = '';
        if (formData.primarydetails?.denomination?.denominationcurrency) {
            currencyStr = String(formData.primarydetails.denomination.denominationcurrency);
            console.log('generateStampCode - Currency from form data:', currencyStr);
        } else if (apiData.denominationCurrency) {
            currencyStr = typeof apiData.denominationCurrency === 'string' 
                ? apiData.denominationCurrency 
                : String(apiData.denominationCurrency);
            console.log('generateStampCode - Currency from API data:', currencyStr);
        }
        if (currencyStr) parts.push(currencyStr);

        // Denomination (Dmn) - value and symbol - USE FORM DATA FIRST
        let denominationCode = '';
        if (formData.primarydetails?.denomination) {
            const denomValue = formData.primarydetails.denomination.denominationvalue;
            const denomSymbol = formData.primarydetails.denomination.denominationsymbol;
            
            console.log('generateStampCode - Denomination from form data - Value:', denomValue, 'Symbol:', denomSymbol);
            console.log('generateStampCode - Denomination types - Value type:', typeof denomValue, 'Symbol type:', typeof denomSymbol);
            
            // Safe conversion for denomination value
            let valueStr = '';
            if (denomValue !== null && denomValue !== undefined) {
                if (typeof denomValue === 'object') {
                    // Handle case where value is stored as an object (e.g., from select)
                    if (denomValue.value) {
                        valueStr = String(denomValue.value);
                    } else if (denomValue.label) {
                        valueStr = String(denomValue.label);
                    } else {
                        // Try to extract string representation
                        valueStr = Object.values(denomValue).find(v => typeof v === 'string') || '';
                    }
                } else {
                    valueStr = String(denomValue);
                }
            }
            
            // Safe conversion for denomination symbol
            let symbolStr = '';
            if (denomSymbol !== null && denomSymbol !== undefined) {
                if (typeof denomSymbol === 'object') {
                    // Handle case where symbol is stored as an object (e.g., from select)
                    if (denomSymbol.value) {
                        symbolStr = String(denomSymbol.value);
                    } else if (denomSymbol.label) {
                        symbolStr = String(denomSymbol.label);
                    } else {
                        // Try to extract string representation
                        symbolStr = Object.values(denomSymbol).find(v => typeof v === 'string') || '';
                    }
                } else {
                    symbolStr = String(denomSymbol);
                }
            }
            
            console.log('generateStampCode - Converted strings - Value:', valueStr, 'Symbol:', symbolStr);
            
            if (valueStr && valueStr.trim() !== '' && valueStr.trim() !== 'undefined') {
                denominationCode = valueStr.trim();
                if (symbolStr && symbolStr.trim() !== '' && symbolStr.trim() !== 'undefined') {
                    denominationCode += symbolStr.trim();
                }
                console.log('generateStampCode - Final denomination code:', denominationCode);
            }
        } else if (apiData.denominationValue !== undefined) {
            // Fallback to API data
            denominationCode = String(apiData.denominationValue);
            if (apiData.denominationSymbol) {
                const symbolStr = typeof apiData.denominationSymbol === 'string' 
                    ? apiData.denominationSymbol 
                    : String(apiData.denominationSymbol);
                denominationCode += symbolStr;
            }
            console.log('generateStampCode - Denomination from API data:', denominationCode);
        }
        
        if (denominationCode) parts.push(denominationCode);

        // Color (C) - use the exact same logic as getMergedStampData but extract code from parentheses
        let colorCode = '';
        if (formData.colors) {
            if (formData.colors.colortype === 'Single Color' && formData.colors.singlecolor) {
                // Extract color code from the same structure as getMergedStampData
                const singleColor = formData.colors.singlecolor;
                let colorShade = '';
                
                if (singleColor.purple?.purpleshade) {
                    colorShade = singleColor.purple.purpleshade;
                } else if (singleColor.brown?.brownshade) {
                    colorShade = singleColor.brown.brownshade;
                } else if (singleColor.red?.redshade) {
                    colorShade = singleColor.red.redshade;
                } else if (singleColor.blue?.blueshade) {
                    colorShade = singleColor.blue.blueshade;
                } else if (singleColor.green?.greenshade) {
                    colorShade = singleColor.green.greenshade;
                } else if (singleColor.black?.blackshade) {
                    colorShade = singleColor.black.blackshade;
                } else if (singleColor.grey?.greyshade) {
                    colorShade = singleColor.grey.greyshade;
                } else if (singleColor.yellow?.yellowshade) {
                    colorShade = singleColor.yellow.yellowshade;
                }
                
                // Extract code from parentheses if present and if colorShade is a string
                if (colorShade && typeof colorShade === 'string' && colorShade.includes('(') && colorShade.includes(')')) {
                    const match = colorShade.match(/\(([^)]+)\)/);
                    if (match) {
                        colorCode = match[1];
                    }
                }
            } else if (formData.colors.colortype === 'Multiple Colors' && formData.colors.multiplecolors) {
                // For multiple colors, use simple abbreviation
                const primaryColor = formData.colors.multiplecolors.primarycolor || '';
                const primaryColorStr = typeof primaryColor === 'string' 
                    ? primaryColor.toLowerCase() 
                    : String(primaryColor).toLowerCase();
                    
                if (primaryColorStr.includes('purple')) colorCode = 'Pur';
                else if (primaryColorStr.includes('brown')) colorCode = 'Br';
                else if (primaryColorStr.includes('red')) colorCode = 'R';
                else if (primaryColorStr.includes('blue')) colorCode = 'Blu';
                else if (primaryColorStr.includes('green')) colorCode = 'Gr';
                else if (primaryColorStr.includes('black')) colorCode = 'Blk';
                else if (primaryColorStr.includes('grey')) colorCode = 'Gry';
                else if (primaryColorStr.includes('yellow')) colorCode = 'Yel';
            }
        }
        
        // Fallback to apiData.color if no formData color is available
        if (!colorCode && apiData.color) {
            const colorStr = typeof apiData.color === 'string' 
                ? apiData.color.toLowerCase() 
                : String(apiData.color).toLowerCase();
                
            if (colorStr.includes('purple') || colorStr.includes('violet')) colorCode = 'Pur';
            else if (colorStr.includes('brown')) colorCode = 'Br';
            else if (colorStr.includes('red')) colorCode = 'R';
            else if (colorStr.includes('blue')) colorCode = 'Blu';
            else if (colorStr.includes('green')) colorCode = 'Gr';
            else if (colorStr.includes('black')) colorCode = 'Blk';
            else if (colorStr.includes('grey') || colorStr.includes('gray')) colorCode = 'Gry';
            else if (colorStr.includes('yellow')) colorCode = 'Yel';
            else {
                const safeColorStr = typeof apiData.color === 'string' 
                    ? apiData.color 
                    : String(apiData.color);
                colorCode = safeColorStr.substring(0, 2);
            }
        }
            
        if (colorCode) parts.push(colorCode);

        // Paper (Pa) - use the exact same logic as getMergedStampData but extract code from parentheses
        let paperCode = '';
        if (formData.paperchar?.papertypes?.papertype) {
            const paperType = formData.paperchar.papertypes.papertype;
            // Extract code from parentheses if present and if paperType is a string
            if (paperType && typeof paperType === 'string' && paperType.includes('(') && paperType.includes(')')) {
                const match = paperType.match(/\(([^)]+)\)/);
                if (match) {
                    paperCode = match[1];
                }
            }
        }
        
        // Fallback to apiData.paperType if no formData paper is available
        if (!paperCode && apiData.paperType) {
            paperCode = typeof apiData.paperType === 'string' 
                ? apiData.paperType.toLowerCase() 
                : String(apiData.paperType).toLowerCase();
        }
        
        if (paperCode) parts.push(paperCode);

        // Watermark (W) - USE FORM DATA FIRST - Updated to use variation and orientation
        let watermarkCode = '';
        console.log('generateStampCode - Watermark formData:', formData.wmkchar);
        
        // Helper function to safely extract watermark presence
        const getWatermarkPresence = () => {
        if (formData.wmkchar?.watermarkpresence) {
                // Handle both direct string and nested object
                if (typeof formData.wmkchar.watermarkpresence === 'string') {
                    return formData.wmkchar.watermarkpresence;
                } else if (typeof formData.wmkchar.watermarkpresence === 'object' && formData.wmkchar.watermarkpresence.watermarkpresence) {
                    return formData.wmkchar.watermarkpresence.watermarkpresence;
                }
            }
            return null;
        };
        
        const watermarkPresence = getWatermarkPresence();
        console.log('generateStampCode - Extracted watermark presence:', watermarkPresence);
            
            if (watermarkPresence === 'Yes - Watermark Present') {
            console.log('generateStampCode - Watermark is present, building code...');
            
            // Build watermark code from variation and orientation
            let wmkCode = 'Wmk';
            
            // Get specific watermark type
            if (formData.wmkchar.watermarkdetails?.specifictypes) {
                let wmkSpecific = formData.wmkchar.watermarkdetails.specifictypes.wmkspecific;
                
                // Handle double-nested wmkspecific
                if (typeof wmkSpecific === 'object' && wmkSpecific.wmkspecific) {
                    wmkSpecific = wmkSpecific.wmkspecific;
                }
                
                console.log('generateStampCode - Extracted watermark specific type:', wmkSpecific);
                
                    if (wmkSpecific === 'Other/Custom' && formData.wmkchar.watermarkdetails.specifictypes.customwatermark) {
                        // Use custom watermark description
                        const customWmk = formData.wmkchar.watermarkdetails.specifictypes.customwatermark;
                    // Remove spaces and special characters, keep alphanumeric
                    wmkCode += typeof customWmk === 'string' ? customWmk.replace(/[^a-zA-Z0-9]/g, '') : '';
                } else if (typeof wmkSpecific === 'string') {
                    // Parse specific watermark types
                    if (wmkSpecific.includes('NZ and Star 6mm')) {
                        wmkCode += 'NZStr6mm';
                    } else if (wmkSpecific.includes('Large Star')) {
                        wmkCode += 'LgStr';
                    } else if (wmkSpecific.includes('Crown Over CC')) {
                        wmkCode += 'CrownCC';
                    } else if (wmkSpecific.includes('Crown Over A')) {
                        wmkCode += 'CrownA';
                    } else if (wmkSpecific.includes('Double Line "USPS"')) {
                        wmkCode += 'USPS';
                    } else if (wmkSpecific.includes('SANDS & McDOUGALL MELBOURNE')) {
                        wmkCode += 'SandsMc';
                    } else {
                        // Extract code from parentheses if present
                        if (wmkSpecific.includes('(') && wmkSpecific.includes(')')) {
                        const match = wmkSpecific.match(/\(([^)]+)\)/);
                            wmkCode += match ? match[1].replace(/[^a-zA-Z0-9]/g, '') : wmkSpecific.substring(0, 6).replace(/[^a-zA-Z0-9]/g, '');
                    } else {
                            // Use first part of the description, cleaned
                            wmkCode += wmkSpecific.split('(')[0].trim().replace(/[^a-zA-Z0-9]/g, '').substring(0, 6);
                        }
                    }
                }
            }
            
            // Get orientation
            if (formData.wmkchar.watermarkdetails?.wmkorientation) {
                let orientation = formData.wmkchar.watermarkdetails.wmkorientation.orientation;
                
                // Handle double-nested orientation
                if (typeof orientation === 'object' && orientation.orientation) {
                    orientation = orientation.orientation;
                }
                
                console.log('generateStampCode - Extracted watermark orientation:', orientation);
                
                if (orientation === 'Inverted') {
                    wmkCode += 'In';
                } else if (orientation === 'Reversed') {
                    wmkCode += 'Rev';
                } else if (orientation === 'Inverted and Reversed') {
                    wmkCode += 'InRev';
                } else if (orientation === 'Sideways') {
                    wmkCode += 'Side';
                } else if (orientation === 'Sideways Inverted') {
                    wmkCode += 'SideIn';
                }
                // Normal orientation doesn't add suffix
            }
            
            watermarkCode = wmkCode;
            console.log('generateStampCode - Generated watermark code:', watermarkCode);
        } else if (apiData.watermark && (typeof apiData.watermark === 'string' ? apiData.watermark.toLowerCase() !== 'none' : true)) {
            // Fallback to API data - try to build basic code
            const watermark = typeof apiData.watermark === 'string' 
                ? apiData.watermark.toLowerCase() 
                : String(apiData.watermark).toLowerCase();
                
            if (watermark !== 'none' && watermark !== '') {
                watermarkCode = 'Wmk' + watermark.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6);
            }
            console.log('generateStampCode - Watermark from API data:', watermarkCode);
        }
        
        if (watermarkCode) parts.push(watermarkCode);

        // Perforation (P) - USE FORM DATA FIRST
        let perforationCode = '';
        if (formData.perfsep?.perftypes?.perftype) {
            const perfType = formData.perfsep.perftypes.perftype;
            // Extract code from parentheses if present
            if (typeof perfType === 'string' && perfType.includes('(') && perfType.includes(')')) {
                const match = perfType.match(/\(([^)]+)\)/);
                perforationCode = match ? match[1] : perfType.substring(0, 3);
            } else {
                perforationCode = typeof perfType === 'string' ? perfType.substring(0, 3) : '';
            }
        } else if (apiData.perforation) {
            // Fallback to API data
            const perf = typeof apiData.perforation === 'string' 
                ? apiData.perforation.toLowerCase() 
                : String(apiData.perforation).toLowerCase();
                
            perforationCode = perf.substring(0, 3);
        }
        
        if (perforationCode) parts.push(perforationCode);

        // Item Type and Number (ItNo) - FIXED VERSION
        let itemTypeCode = '';
        console.log('generateStampCode - Item type check:', formData.ittyp?.ittypsel);
        
        if (formData.ittyp?.ittypsel) {
            let itemType = formData.ittyp.ittypsel;
            
            // Handle case where value might still be nested (during transition)
            if (typeof itemType === 'object' && itemType !== null && itemType.ittypsel) {
                itemType = itemType.ittypsel;
                console.log('generateStampCode - Extracted from nested structure:', itemType);
            }
            
            // Convert to string safely
            itemType = String(itemType);
            console.log('generateStampCode - Final item type string:', itemType);
            
            // Generate codes based on item type
            if (itemType === 'Stamp') {
                itemTypeCode = 'St001';
            } else if (itemType === 'On Piece (OnP)') {
                itemTypeCode = 'OnP01';
            } else if (itemType === 'On Card (OnCrd)') {
                itemTypeCode = 'OnC01';
            } else if (itemType === 'On Envelope (OnEnv)') {
                itemTypeCode = 'OnE01';
            } else if (itemType === 'On Newspaper (OnNew)') {
                itemTypeCode = 'OnN01';
            } else {
                // For other types, extract abbreviation from parentheses or use first letters
                let abbreviation = '';
                
                if (itemType.includes('(') && itemType.includes(')')) {
                    // Extract content inside parentheses
                    const parenMatch = itemType.match(/\(([^)]+)\)/);
                    if (parenMatch && parenMatch[1]) {
                        abbreviation = parenMatch[1].replace(/[^A-Za-z]/g, ''); // Remove non-letters
                    }
                } else {
                    // Use first letter of each word
                    const words = itemType.split(/[\s\-_]+/).filter((word: string) => word.trim() !== '');
                    abbreviation = words.map((word: string) => word.charAt(0)).join('').toUpperCase();
                }
                
                itemTypeCode = (abbreviation || 'St') + '001';
            }
            
            console.log('generateStampCode - Generated item type code:', itemTypeCode);
        } else {
            itemTypeCode = 'St001';
            console.log('generateStampCode - Using default item type code');
        }
        
        if (itemTypeCode) parts.push(itemTypeCode);

        console.log('generateStampCode - Final parts:', parts);
        return parts.length > 0 ? `${parts.join('.')}` : '';
    };

    const currentStampCode = React.useMemo(() => {
        console.log('currentStampCode useMemo - Regenerating stamp code');
        console.log('currentStampCode useMemo - Current formData.wmkchar:', formData.wmkchar);
        const code = generateStampCode(getMergedStampData());
        console.log('currentStampCode useMemo - Generated code:', code);
        return code;
    }, [formData, selectedStamp.apiData]);

    // Enhanced stamp code analysis to identify missing parts
    const stampCodeAnalysis = React.useMemo(() => {
        console.log('stampCodeAnalysis useMemo - Regenerating analysis');
        console.log('stampCodeAnalysis useMemo - Current formData.wmkchar:', formData.wmkchar);
        
        const mergedData = getMergedStampData();
        const parts = [];
        
        // Helper function to safely extract string value
        const getStringValue = (value: any, fallback: string = ''): string => {
            if (value === null || value === undefined) return fallback;
            if (typeof value === 'string') return value;
            if (typeof value === 'number') return value.toString();
            if (typeof value === 'object') {
                // If it's an object, try to extract a meaningful string
                if (value.perftype) return String(value.perftype);
                if (value.papertype) return String(value.papertype);
                if (value.colortype) return String(value.colortype);
                // Return a generic representation for other objects
                return Object.values(value).join(' ') || fallback;
            }
            return String(value) || fallback;
        };
        
        // Country (Ctry)
        const hasCountry = !!mergedData.country;
        const countryCode = hasCountry ? (
            getStringValue(mergedData.country).includes('New Zealand') ? 'NZ' : 
            getStringValue(mergedData.country).includes('Australia') ? 'AU' : 
            getStringValue(mergedData.country).includes('Great Britain') ? 'GB' : 
            getStringValue(mergedData.country).includes('United States') ? 'US' : 
            getStringValue(mergedData.country).includes('Canada') ? 'CA' : 
            getStringValue(mergedData.country).substring(0, 2).toUpperCase()
        ) : '';
        
        parts.push({
            code: countryCode || 'Ctry',
            label: 'Country',
            isComplete: hasCountry,
            categoryPath: ['PrimaryDetails', 'Country'],
            description: 'Country that issued the stamp'
        });

        // Stamp Group (StGp) - This should go to catalog number under Primary Details
        const hasCatalogNumber = !!mergedData.catalogNumber;
        const catalogNumberStr = getStringValue(mergedData.catalogNumber);
        const stampGroup = hasCatalogNumber ? (
            catalogNumberStr.match(/\d+/)?.[0]?.padStart(3, '0') || catalogNumberStr
        ) : '';
        
        parts.push({
            code: stampGroup || 'StGp',
            label: 'Catalog Number',
            isComplete: hasCatalogNumber,
            categoryPath: ['PrimaryDetails'],
            description: 'Catalog number reference'
        });

        // Year (Yr)
        const hasIssueDate = !!mergedData.issueDate;
        const issueDateStr = getStringValue(mergedData.issueDate);
        const year = hasIssueDate ? new Date(issueDateStr).getFullYear() : null;
        
        parts.push({
            code: year ? year.toString() : 'Yr',
            label: 'Issue Date',
            isComplete: hasIssueDate && year !== null && !isNaN(year),
            categoryPath: ['PrimaryDetails', 'IssueDate'],
            description: 'Year of issue'
        });

        // Currency (Cur) - Check form data first, then merged data
        let hasCurrency = false;
        let currencyStr = '';
        if (formData.primarydetails?.denomination?.denominationcurrency) {
            hasCurrency = true;
            currencyStr = formData.primarydetails.denomination.denominationcurrency;
        } else if (mergedData.denominationCurrency) {
            hasCurrency = true;
            currencyStr = getStringValue(mergedData.denominationCurrency);
        }
        
        parts.push({
            code: currencyStr || 'Cur',
            label: 'Currency',
            isComplete: hasCurrency,
            categoryPath: ['PrimaryDetails', 'Denomination', 'DenominationCurrency'],
            description: 'Denomination currency'
        });

        // Denomination (Dmn) - Check form data first for value and symbol combination
        let hasDenomination = false;
        let denominationCode = '';
        if (formData.primarydetails?.denomination) {
            const denomValue = formData.primarydetails.denomination.denominationvalue;
            const denomSymbol = formData.primarydetails.denomination.denominationsymbol;
            
            // Safe conversion for denomination value
            let valueStr = '';
            if (denomValue !== null && denomValue !== undefined) {
                if (typeof denomValue === 'object') {
                    if (denomValue.value) {
                        valueStr = String(denomValue.value);
                    } else if (denomValue.label) {
                        valueStr = String(denomValue.label);
                    } else {
                        valueStr = Object.values(denomValue).find(v => typeof v === 'string') || '';
                    }
                } else {
                    valueStr = String(denomValue);
                }
            }
            
            // Safe conversion for denomination symbol
            let symbolStr = '';
            if (denomSymbol !== null && denomSymbol !== undefined) {
                if (typeof denomSymbol === 'object') {
                    if (denomSymbol.value) {
                        symbolStr = String(denomSymbol.value);
                    } else if (denomSymbol.label) {
                        symbolStr = String(denomSymbol.label);
                    } else {
                        symbolStr = Object.values(denomSymbol).find(v => typeof v === 'string') || '';
                    }
                } else {
                    symbolStr = String(denomSymbol);
                }
            }
            
            if (valueStr && valueStr.trim() !== '' && valueStr.trim() !== 'undefined') {
                hasDenomination = true;
                denominationCode = valueStr.trim();
                if (symbolStr && symbolStr.trim() !== '' && symbolStr.trim() !== 'undefined') {
                    denominationCode += symbolStr.trim();
                }
            }
        } else if (mergedData.denominationValue) {
            hasDenomination = true;
            const denominationValueStr = getStringValue(mergedData.denominationValue);
            const denominationSymbolStr = getStringValue(mergedData.denominationSymbol);
            denominationCode = `${denominationValueStr}${denominationSymbolStr}`;
        }
        
        parts.push({
            code: denominationCode || 'Dmn',
            label: 'Denomination Value',
            isComplete: hasDenomination,
            categoryPath: ['PrimaryDetails', 'Denomination', 'DenominationValue'],
            description: 'Face value of the stamp'
        });

        // Color (C)
        const hasColor = !!mergedData.color;
        const colorStr = getStringValue(mergedData.color);
        let colorCode = '';
        if (hasColor) {
            const color = colorStr.toLowerCase();
            if (color.includes('purple') || color.includes('violet')) colorCode = 'Pur';
            else if (color.includes('brown')) colorCode = 'Br';
            else if (color.includes('red')) colorCode = 'R';
            else if (color.includes('blue')) colorCode = 'Blu';
            else if (color.includes('green')) colorCode = 'Gr';
            else if (color.includes('black')) colorCode = 'Blk';
            else if (color.includes('grey') || color.includes('gray')) colorCode = 'Gry';
            else if (color.includes('yellow')) colorCode = 'Yel';
            else colorCode = colorStr.substring(0, 3);
        }
        
        parts.push({
            code: colorCode || 'C',
            label: 'Color',
            isComplete: hasColor,
            categoryPath: ['Colors', 'ColorType'],
            description: 'Primary color of the stamp'
        });

        // Paper (Pa)
        const hasPaper = !!mergedData.paperType;
        const paperTypeStr = getStringValue(mergedData.paperType);
        const paperCode = paperTypeStr ? (paperTypeStr.length > 3 ? paperTypeStr.substring(0, 3) : paperTypeStr) : '';
        
        parts.push({
            code: paperCode || 'Pa',
            label: 'Paper Type',
            isComplete: hasPaper,
            categoryPath: ['PaperChar', 'PaperTypes'],
            description: 'Paper type used'
        });

        // Watermark (W) - Check form data first - Updated to use variation and orientation
        let hasWatermark = false;
        let watermarkCode = '';
        
        // Helper function to safely extract watermark presence
        const getWatermarkPresence = () => {
        if (formData.wmkchar?.watermarkpresence) {
                // Handle both direct string and nested object
                if (typeof formData.wmkchar.watermarkpresence === 'string') {
                    return formData.wmkchar.watermarkpresence;
                } else if (typeof formData.wmkchar.watermarkpresence === 'object' && formData.wmkchar.watermarkpresence.watermarkpresence) {
                    return formData.wmkchar.watermarkpresence.watermarkpresence;
                }
            }
            return null;
        };
        
        const watermarkPresence = getWatermarkPresence();
            
            if (watermarkPresence === 'Yes - Watermark Present') {
                hasWatermark = true;
            
            // Build watermark code from variation and orientation (same logic as generateStampCode)
            let wmkCode = 'Wmk';
            
            // Get specific watermark type
            if (formData.wmkchar.watermarkdetails?.specifictypes) {
                let wmkSpecific = formData.wmkchar.watermarkdetails.specifictypes.wmkspecific;
                
                // Handle double-nested wmkspecific
                if (typeof wmkSpecific === 'object' && wmkSpecific.wmkspecific) {
                    wmkSpecific = wmkSpecific.wmkspecific;
                }
                
                    if (wmkSpecific === 'Other/Custom' && formData.wmkchar.watermarkdetails.specifictypes.customwatermark) {
                    // Use custom watermark description
                        const customWmk = formData.wmkchar.watermarkdetails.specifictypes.customwatermark;
                    // Remove spaces and special characters, keep alphanumeric
                    wmkCode += typeof customWmk === 'string' ? customWmk.replace(/[^a-zA-Z0-9]/g, '') : '';
                } else if (typeof wmkSpecific === 'string') {
                    // Parse specific watermark types
                    if (wmkSpecific.includes('NZ and Star 6mm')) {
                        wmkCode += 'NZStr6mm';
                    } else if (wmkSpecific.includes('Large Star')) {
                        wmkCode += 'LgStr';
                    } else if (wmkSpecific.includes('Crown Over CC')) {
                        wmkCode += 'CrownCC';
                    } else if (wmkSpecific.includes('Crown Over A')) {
                        wmkCode += 'CrownA';
                    } else if (wmkSpecific.includes('Double Line "USPS"')) {
                        wmkCode += 'USPS';
                    } else if (wmkSpecific.includes('SANDS & McDOUGALL MELBOURNE')) {
                        wmkCode += 'SandsMc';
                    } else {
                        // Extract code from parentheses if present
                        if (wmkSpecific.includes('(') && wmkSpecific.includes(')')) {
                        const match = wmkSpecific.match(/\(([^)]+)\)/);
                            wmkCode += match ? match[1].replace(/[^a-zA-Z0-9]/g, '') : wmkSpecific.substring(0, 6).replace(/[^a-zA-Z0-9]/g, '');
                    } else {
                            // Use first part of the description, cleaned
                            wmkCode += wmkSpecific.split('(')[0].trim().replace(/[^a-zA-Z0-9]/g, '').substring(0, 6);
                        }
                    }
                }
            }
            
            // Get orientation
            if (formData.wmkchar.watermarkdetails?.wmkorientation) {
                let orientation = formData.wmkchar.watermarkdetails.wmkorientation.orientation;
                
                // Handle double-nested orientation
                if (typeof orientation === 'object' && orientation.orientation) {
                    orientation = orientation.orientation;
                }
                
                console.log('generateStampCode - Extracted watermark orientation:', orientation);
                
                if (orientation === 'Inverted') {
                    wmkCode += 'In';
                } else if (orientation === 'Reversed') {
                    wmkCode += 'Rev';
                } else if (orientation === 'Inverted and Reversed') {
                    wmkCode += 'InRev';
                } else if (orientation === 'Sideways') {
                    wmkCode += 'Side';
                } else if (orientation === 'Sideways Inverted') {
                    wmkCode += 'SideIn';
                }
                // Normal orientation doesn't add suffix
            }
            
            watermarkCode = wmkCode;
        } else if (mergedData.watermark) {
            // Fallback to merged data - try to build basic code
            const watermarkStr = getStringValue(mergedData.watermark);
            hasWatermark = !!watermarkStr && 
                watermarkStr.toLowerCase() !== 'none' && 
                watermarkStr.toLowerCase() !== 'no - no watermark' &&
                watermarkStr.toLowerCase() !== '';
            if (hasWatermark) {
                watermarkCode = 'Wmk' + watermarkStr.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6);
            }
        }
        
        parts.push({
            code: watermarkCode || 'W',
            label: 'Watermark Variation & Orientation',
            isComplete: hasWatermark,
            categoryPath: ['WmkChar', 'WatermarkDetails'],
            description: 'Watermark variation and orientation details'
        });

        // Perforation (P)
        const perforationStr = getStringValue(mergedData.perforation);
        const hasPerforation = !!perforationStr;
        const perforationCode = hasPerforation ? (perforationStr.length > 3 ? perforationStr.substring(0, 3) : perforationStr) : '';
        
        parts.push({
            code: perforationCode || 'P',
            label: 'Perforation',
            isComplete: hasPerforation,
            categoryPath: ['PerfSep', 'PerfTypes'],
            description: 'Perforation type'
        });

        // Item Type and Number (ItNo) - Check form data first
        let hasItemType = false;
        let itemTypeCode = '';
        if (formData.ittyp?.ittypsel) {
            hasItemType = true;
            const itemType = formData.ittyp.ittypsel;
            
            if (itemType === 'Stamp') {
                itemTypeCode = 'St001';
            } else if (itemType === 'On Piece (OnP)') {
                itemTypeCode = 'OnP01';
            } else if (itemType === 'On Card (OnCrd)') {
                itemTypeCode = 'OnC01';
            } else if (itemType === 'On Envelope (OnEnv)') {
                itemTypeCode = 'OnE01';
            } else if (itemType === 'On Newspaper (OnNew)') {
                itemTypeCode = 'OnN01';
            } else {
                const typeStr = typeof itemType === 'string' ? itemType : String(itemType);
                const abbreviation = typeStr.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
                itemTypeCode = abbreviation + '01';
            }
        } else {
            // Check if we have basic details to default to stamp
            const hasBasicDetails = hasCountry && hasIssueDate;
            hasItemType = hasBasicDetails;
            itemTypeCode = hasBasicDetails ? 'St001' : '';
        }
        
        parts.push({
            code: itemTypeCode || 'ItNo',
            label: 'Item Type',
            isComplete: hasItemType,
            categoryPath: ['ItTyp', 'ItTypSel'],
            description: 'Item type and number'
        });

        return parts;
    }, [formData, selectedStamp.apiData]);

    // Function to scroll to a specific category section
    const scrollToCategory = (categoryPath: string[]) => {
        console.log('Attempting to scroll to category path:', categoryPath);
        
        // First, switch to the details tab using state
        setActiveTab("details");
        
        // Find the category in the tree
        let targetCategory = null;
        let pathToCategory: NavigationPathItem[] = [];
        
        // Build navigation path to the target category
        for (let i = 0; i < categoryPath.length; i++) {
            const categoryId = categoryPath[i];
            const category = findCategoryInTree(categoryId, allCategories);
            
            console.log(`Looking for category ${categoryId}, found:`, category);
            
            if (category) {
                pathToCategory.push({
                    id: categoryId,
                    label: category.label,
                    category: category
                });
                targetCategory = category;
            } else {
                console.warn(`Category ${categoryId} not found in category tree`);
                break; // Stop if we can't find a category in the path
            }
        }
        
        console.log('Built navigation path:', pathToCategory);
        
        if (targetCategory && pathToCategory.length > 0) {
            // Set navigation path to show the target category
            setNavigationPath(pathToCategory);
            
            // Scroll to the form section after a short delay to ensure rendering
            setTimeout(() => {
                const formSection = document.querySelector('[data-form-content]');
                if (formSection) {
                    console.log('Scrolling to form section');
                    formSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                } else {
                    console.warn('Form section not found');
                }
            }, 300); // Increased delay to ensure tab switching and navigation completes
        } else {
            console.error('Could not build navigation path to category');
        }
    };

    // Add state for sticky behavior
    const [isSticky, setIsSticky] = useState(false);
    const stampCodeRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);

    // Add scroll listener for sticky behavior
    useEffect(() => {
        let originalOffsetTop = 0;
        
        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;
            setScrollY(currentScrollY);
            
            if (stampCodeRef.current) {
                // Measure original position on first scroll
                if (originalOffsetTop === 0) {
                    originalOffsetTop = stampCodeRef.current.offsetTop;
                }
                
                const shouldBeSticky = currentScrollY >= originalOffsetTop;
                setIsSticky(shouldBeSticky);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call once to set initial state
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Interactive Stamp Code Component
    const InteractiveStampCode = () => (
        <>
            <div 
                ref={stampCodeRef}
                className={`mb-6 transition-all duration-200 ${
                    isSticky 
                        ? 'fixed top-0 left-0 right-0 z-50 px-3 sm:px-4' 
                        : 'relative'
                }`}
            >
                <div className={isSticky ? 'max-w-[1200px] mx-auto' : ''}>
                    <Card className={`border border-gray-200 ${
                        isSticky 
                            ? 'bg-white/95 backdrop-blur-sm shadow-md' 
                            : 'bg-gray-50/50'
                    }`}>
                        <div className="p-3">
                            <div className="flex flex-col items-center gap-3">
                                <div className="text-xs font-medium text-gray-600">
                                    Stamp Code
                                </div>
                                
                                {/* Interactive stamp code parts */}
                                <div className="flex flex-wrap items-center justify-center gap-1 text-sm font-mono">
                                    {stampCodeAnalysis.map((part, index) => (
                                        <React.Fragment key={part.label}>
                                            <button
                                                onClick={() => scrollToCategory(part.categoryPath)}
                                                className={`px-2 py-1 rounded border transition-all duration-200 cursor-pointer hover:scale-105 ${
                                                    part.isComplete
                                                        ? 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200 animate-pulse'
                                                }`}
                                                title={`${part.description}${part.isComplete ? ' (Complete)' : ' (Missing - Click to edit)'}`}
                                            >
                                                {part.code}
                                            </button>
                                            {index < stampCodeAnalysis.length - 1 && (
                                                <span className="text-gray-400">.</span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                                
                                {/* Legend */}
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                                        <span className="text-gray-600">Complete</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                                        <span className="text-gray-600">Missing (click to edit)</span>
                                    </div>
                                </div>
                                
                                {/* Info dialog */}
                                <Dialog>
                                    <DialogTrigger className="h-6 w-6 p-0 opacity-60 hover:opacity-90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground">
                                        <Info className="h-3 w-3 text-gray-600" />
                                    </DialogTrigger>
                                    <DialogContent className="max-w-lg py-2 gap-1">
                                        <DialogHeader className="pt-2 pb-0">
                                            <DialogTitle>Stamp Code Details</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-3 pt-2 max-h-[400px] overflow-y-auto">
                                            <p className="text-sm text-muted-foreground">
                                                Generated from stamp characteristics. Click on red (missing) parts to edit them.
                                            </p>
                                            
                                            <div className="border rounded-lg p-3 space-y-3">
                                                <div className="text-xs font-medium">Code Breakdown:</div>
                                                {stampCodeAnalysis.map((part) => (
                                                    <div key={part.label} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-1 text-xs font-mono rounded border ${
                                                                part.isComplete
                                                                    ? 'bg-green-100 border-green-300 text-green-800'
                                                                    : 'bg-red-100 border-red-300 text-red-800'
                                                            }`}>
                                                                {part.code}
                                                            </span>
                                                            <span className="text-sm font-medium">{part.label}</span>
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded ${
                                                            part.isComplete
                                                                ? 'bg-green-50 text-green-700'
                                                                : 'bg-red-50 text-red-700'
                                                        }`}>
                                                            {part.isComplete ? 'Complete' : 'Missing'}
                                                        </span>
                                                    </div>
                                                ))}
                                                
                                                <p className="text-xs text-muted-foreground mt-3">
                                                    Format: Ctry.StGp.Yr.Cur.Dmn.C.Pa.W.P.ItNo
                                                </p>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            {/* Placeholder to maintain layout when sticky */}
            {isSticky && (
                <div className="mb-6">
                    <Card className="border border-gray-200 bg-gray-50/50 opacity-0">
                        <div className="p-3">
                            <div className="flex flex-col items-center gap-3">
                                <div className="text-xs font-medium text-gray-600">Stamp Code</div>
                                <div className="flex flex-wrap items-center justify-center gap-1 text-sm font-mono">
                                    <div className="px-2 py-1 rounded border">Placeholder</div>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded"></div>
                                        <span>Placeholder</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );

    // Function to save stamp data to API
    const saveStampToAPI = async (
        formData: Record<string, any>, 
        categories: Category[], 
        selectedStamp: any,
        scannedImageDataUrl?: string
    ): Promise<boolean> => {
        try {
            // Get required data
            const jwt = getJWT();
            const userId = getUserId();
            
            if (!jwt) {
                throw new Error('No JWT token found. Please login first.');
            }
            
            if (!userId) {
                throw new Error('No user ID found. Please login first.');
            }

            // Transform form data to API format (this becomes StampDetailsJson)
            const stampDetailsJson = transformFormDataToApiFormat(formData, categories);
            
            // Get stamp catalog ID from selected stamp API data
            const stampCatalogId = selectedStamp?.apiData?.id || selectedStamp?.id || '';
            
            if (!stampCatalogId) {
                throw new Error('No stamp catalog ID found.');
            }

            // Get merged stamp data for extracting field values
            const mergedData = getMergedStampData();
            
            // Generate stamp code
            const stampCode = generateStampCode(mergedData);

            // Create FormData for multipart/form-data
            const apiFormData = new FormData();
            
            // Add all required fields according to new API specification - Enhanced to extract more from formData
            apiFormData.append('UserId', userId);
            apiFormData.append('StampCatalogId', stampCatalogId);
            apiFormData.append('StampCode', stampCode || '');
            apiFormData.append('Name', mergedData.name || selectedStamp?.apiData?.name || '');
            
            // Extract Publisher from formData if available
            let publisher = selectedStamp?.apiData?.publisher || '';
            // Note: Publisher, Printer, and Designer fields don't exist in current form structure
            // We'll use API data or leave empty
            apiFormData.append('Publisher', publisher);
            
            apiFormData.append('Country', mergedData.country || '');
            apiFormData.append('CatalogName', mergedData.catalogName || selectedStamp?.apiData?.catalogName || '');
            apiFormData.append('CatalogNumber', mergedData.catalogNumber || '');
            apiFormData.append('SeriesName', mergedData.seriesName || selectedStamp?.apiData?.seriesName || '');
            apiFormData.append('IssueDate', mergedData.issueDate || '');
            
            // Extract year from issue date - Enhanced to handle formData directly
            let issueYear = '';
            if (mergedData.issueDate) {
                issueYear = new Date(mergedData.issueDate).getFullYear().toString();
            } else if (formData.primarydetails?.issuedate) {
                issueYear = new Date(formData.primarydetails.issuedate).getFullYear().toString();
            }
            apiFormData.append('IssueYear', issueYear);
            
            apiFormData.append('DenominationValue', (mergedData.denominationValue || 0).toString());
            apiFormData.append('DenominationCurrency', mergedData.denominationCurrency || selectedStamp?.apiData?.denominationCurrency || '');
            apiFormData.append('DenominationSymbol', mergedData.denominationSymbol || selectedStamp?.apiData?.denominationSymbol || '');
            apiFormData.append('Color', mergedData.color || '');
            
            // Extract PaperType from formData - Enhanced extraction
            let paperType = mergedData.paperType || '';
            if (!paperType && formData.paperchar?.papertypes?.papertype) {
                // Extract descriptive part before parentheses
                const paperTypeValue = formData.paperchar.papertypes.papertype;
                paperType = typeof paperTypeValue === 'string' ? paperTypeValue.split('(')[0].trim() : paperTypeValue;
            }
            apiFormData.append('PaperType', paperType);
            
            // Extract additional fields that can be mapped from formData
            
            // Printing method
            let printing = selectedStamp?.apiData?.printing || '';
            if (formData.printchar?.printmethods?.printmethod) {
                const printMethod = formData.printchar.printmethods.printmethod;
                printing = typeof printMethod === 'string' ? printMethod.split('(')[0].trim() : printMethod;
            }
            
            // Perforation
            let perforation = selectedStamp?.apiData?.perforation || '';
            if (formData.perfsep?.perftypes?.perftype) {
                const perfType = formData.perfsep.perftypes.perftype;
                perforation = typeof perfType === 'string' ? perfType.split('(')[0].trim() : perfType;
            }
            
            // Watermark description
            let watermark = mergedData.watermark || selectedStamp?.apiData?.watermark || '';
            
            // Designer/Artist
            let artist = selectedStamp?.apiData?.artist || '';
            // Note: Designer field doesn't exist in current form structure
            
            // Theme/Subject
            let theme = selectedStamp?.apiData?.theme || '';
            // Note: Theme field doesn't exist in current form structure
            
            // Size
            let size = selectedStamp?.apiData?.size || '';
            // Note: Size field doesn't exist in current form structure
            
            // Add the extracted fields to FormData (these may be optional but included for completeness)
            if (printing) apiFormData.append('Printing', printing);
            if (perforation) apiFormData.append('Perforation', perforation);
            if (watermark) apiFormData.append('Watermark', watermark);
            if (artist) apiFormData.append('Artist', artist);
            if (theme) apiFormData.append('Theme', theme);
            if (size) apiFormData.append('Size', size);
            
            // StampDetailsJson is the transformed form data (formerly StampDetails)
            apiFormData.append('StampDetailsJson', JSON.stringify(stampDetailsJson));
            
            // Add pricing information
            apiFormData.append('EstimatedMarketValue', (selectedStamp?.apiData?.estimatedPrice || 0).toString());
            apiFormData.append('ActualPrice', (selectedStamp?.apiData?.actualPrice || 0).toString());
            
            // Add scanned image file if available (StampFileAttachment)
            if (scannedImageDataUrl) {
                try {
                    // Convert data URL to blob
                    const response = await fetch(scannedImageDataUrl);
                    const blob = await response.blob();
                    apiFormData.append('StampFileAttachment', blob, 'scanned-stamp.jpg');
                } catch (error) {
                    console.warn('Could not add scanned image to form data:', error);
                    // Continue without the image
                }
            }

            // Make API call
            const apiResponse = await fetch('https://3pm-stampapp-prod.azurewebsites.net/api/v1/Stamp', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwt}`
                    // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
                },
                body: apiFormData
            });

            if (!apiResponse.ok) {
                const errorText = await apiResponse.text();
                throw new Error(`API request failed: ${apiResponse.status} ${apiResponse.statusText}. ${errorText}`);
            }

            const result = await apiResponse.json();
            console.log('Stamp saved successfully:', result);
            
            return true;
        } catch (error) {
            console.error('Error saving stamp to API:', error);
            throw error;
        }
    };

    return (
        <div className="flex flex-col min-h-screen max-w-[1200px] mx-auto">
            <div className="px-3 sm:px-4 py-4 sm:py-6">
                {/* Header with Save/Cancel */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <h2 className="text-lg font-semibold">Stamp Details</h2>
                    
                    {/* Error display */}
                    {saveError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                            <strong>Error:</strong> {saveError}
                        </div>
                    )}
                    
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            onClick={onCancel} 
                            className="flex-1 sm:flex-none"
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSave} 
                            className="flex-1 sm:flex-none gap-2"
                            disabled={isSaving}
                        >
                            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {/* Stamp Images Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Left Side - Cropped Stamp */}
                    <div className="border rounded-lg p-3 sm:p-4">
                        <div className="text-sm font-medium mb-2">Catalogue Image</div>
                        <div 
                            ref={catalogueContainerRef}
                            className="aspect-square relative border rounded-lg overflow-hidden bg-gray-50 mb-4"
                        >
                            <div 
                                className={`w-full h-full flex items-center justify-center ${catalogueZoom > 1 ? 'cursor-grab' : ''} ${isDragging === 'catalogue' ? 'cursor-grabbing' : ''}`}
                                style={{ 
                                    transform: `scale(${catalogueZoom}) translate(${cataloguePan.x / catalogueZoom}px, ${cataloguePan.y / catalogueZoom}px)`,
                                    transition: isDragging === 'catalogue' ? 'none' : 'transform 0.2s ease-in-out'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, 'catalogue')}
                                onTouchStart={(e) => handleTouchStart(e, 'catalogue')}
                            >
                                <Image
                                    src={selectedStamp.image}
                                    alt="Catalogue stamp"
                                    fill
                                    className="object-contain pointer-events-none"
                                    draggable={false}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 sm:flex-none gap-1" 
                                onClick={handleCatalogueZoomIn}
                                disabled={catalogueZoom >= 3}
                            >
                                <ZoomIn className="h-3 w-3" />
                                Zoom In
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 sm:flex-none gap-1" 
                                onClick={handleCatalogueZoomOut}
                                disabled={catalogueZoom <= 0.5}
                            >
                                <ZoomOut className="h-3 w-3" />
                                Zoom Out
                            </Button>
                            {(cataloguePan.x !== 0 || cataloguePan.y !== 0) && (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 sm:flex-none gap-1" 
                                    onClick={resetCataloguePan}
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    Center
                                </Button>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 text-center">
                            Zoom: {Math.round(catalogueZoom * 100)}%
                            {catalogueZoom > 1 && <div className="text-xs">Click and drag to pan</div>}
                        </div>
                    </div>

                    {/* Right Side - Scanned Image */}
                    <div className="border rounded-lg p-3 sm:p-4">
                        <div className="text-sm font-medium mb-2">Scanned Image</div>
                        <div 
                            ref={scannedContainerRef}
                            className="aspect-square relative border rounded-lg overflow-hidden bg-gray-50 mb-4"
                        >
                            {selectedStamp.scannedImage ? (
                                <div 
                                    className={`w-full h-full flex items-center justify-center ${scannedZoom > 1 ? 'cursor-grab' : ''} ${isDragging === 'scanned' ? 'cursor-grabbing' : ''}`}
                                    style={{ 
                                        transform: `scale(${scannedZoom}) translate(${scannedPan.x / scannedZoom}px, ${scannedPan.y / scannedZoom}px)`,
                                        transition: isDragging === 'scanned' ? 'none' : 'transform 0.2s ease-in-out'
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, 'scanned')}
                                    onTouchStart={(e) => handleTouchStart(e, 'scanned')}
                                >
                                    <Image
                                        src={selectedStamp.scannedImage}
                                        alt="Scanned stamp"
                                        fill
                                        className="object-contain pointer-events-none"
                                        draggable={false}
                                    />
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <div className="text-sm">No scanned image</div>
                                        <div className="text-xs mt-1">Upload or capture an image</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 sm:flex-none gap-1" 
                                onClick={handleScannedZoomIn}
                                disabled={scannedZoom >= 3 || !selectedStamp.scannedImage}
                            >
                                <ZoomIn className="h-3 w-3" />
                                Zoom In
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 sm:flex-none gap-1" 
                                onClick={handleScannedZoomOut}
                                disabled={scannedZoom <= 0.5 || !selectedStamp.scannedImage}
                            >
                                <ZoomOut className="h-3 w-3" />
                                Zoom Out
                            </Button>
                            {(scannedPan.x !== 0 || scannedPan.y !== 0) && selectedStamp.scannedImage && (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 sm:flex-none gap-1" 
                                    onClick={resetScannedPan}
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    Center
                                </Button>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 text-center">
                            {selectedStamp.scannedImage ? (
                                <>
                                    Zoom: {Math.round(scannedZoom * 100)}%
                                    {scannedZoom > 1 && <div className="text-xs">Click and drag to pan</div>}
                                </>
                            ) : (
                                'No image available'
                            )}
                        </div>
                        {/* Price Information */}
                        {(selectedStamp.apiData || selectedStamp.apiData) && (
                            <div className="text-xs flex flex-row justify-center gap-5  text-muted-foreground mt-3 text-center w-full items-center">
                                {selectedStamp.apiData && (
                                    <div className="text-sm">
                                        Actual Price: 60$
                                    </div>
                                )}
                                {selectedStamp.apiData && (
                                    <div className="text-sm">
                                        Estimated Price: 70$
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Interactive Stamp Code - Better positioned after images, before form */}
                {formData && <InteractiveStampCode />}

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full">
                        <TabsTrigger value="details" className="flex items-center gap-2 w-1/2">
                            <Edit className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex items-center gap-2 w-1/2">
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Preview</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Navigation Header with Tabs */}
                    <TabsContent value="details">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 bg-white border-b mb-6">
                            <div className="flex items-center gap-2 min-w-0">
                                {renderBreadcrumbs()}
                            </div>

                            {/* Back button - only show when we're in a category */}
                            {!!navigationPath.length && (
                                <Button
                                    variant="outline"
                                    onClick={() => setNavigationPath(prev => prev.slice(0, -1))}
                                    className="gap-2 flex-shrink-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">Back to {navigationPath[navigationPath.length - 1].label}</span>
                                    <span className="sm:hidden">Back</span>
                                </Button>
                            )}
                        </div>

                        {/* Form Content */}
                        <Card className="p-3 sm:p-6 mb-6" data-form-content>
                            {renderContent()}
                        </Card>
                    </TabsContent>
                    <TabsContent value="preview">
                        <Card className="border-2 mt-4">
                            <div className="p-3 sm:p-4 border-b bg-muted/50">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">Details Preview</h3>
                                </div>
                            </div>
                            <div className="p-4 sm:p-8">
                                <FormPreview 
                                    data={formData} 
                                    categories={allCategories}
                                    onUpdate={handleFieldChange}
                                />
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
                
                {/* Debug Panel - Only show in development */}
                {debugMode && (
                    <Card className="mt-6 border-yellow-200 bg-yellow-50">
                        <div className="p-3 border-b bg-yellow-100">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-yellow-800">Debug Panel</h3>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setDebugMode(false)}
                                    className="text-yellow-600 hover:text-yellow-800"
                                >
                                    ×
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <h4 className="font-medium text-sm mb-2">Current Navigation Path:</h4>
                                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                                    {JSON.stringify(navigationPath.map(p => p.id), null, 2)}
                                </pre>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-sm mb-2">Current Form Data:</h4>
                                <pre className="text-xs bg-white p-2 rounded border max-h-64 overflow-auto">
                                    {JSON.stringify(formData, null, 2)}
                                </pre>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-sm mb-2">Merged Stamp Data (for code generation):</h4>
                                <pre className="text-xs bg-white p-2 rounded border max-h-32 overflow-auto">
                                    {JSON.stringify(getMergedStampData(), null, 2)}
                                </pre>
                            </div>
                        </div>
                    </Card>
                )}
                
                {/* Debug Mode Toggle */}
                {!debugMode && process.env.NODE_ENV === 'development' && (
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setDebugMode(true)}
                        className="mt-4 text-xs"
                    >
                        Show Debug Panel
                    </Button>
                )}
                
                {/* Temporary Debug Controls for Watermark Testing */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-4 border rounded-lg bg-yellow-50">
                        <h4 className="text-sm font-medium mb-2">Debug: Test Watermark ShowWhen & Stamp Code</h4>
                        <div className="flex gap-2 flex-wrap">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        wmkchar: {
                                            ...prev.wmkchar,
                                            watermarkpresence: "Yes - Watermark Present",
                                            watermarkdetails: {
                                                specifictypes: {
                                                    wmkspecific: "NZ and Star 6mm (W7)"
                                                },
                                                wmkorientation: {
                                                    orientation: "Inverted"
                                                }
                                            }
                                        }
                                    }));
                                    console.log('Debug: Set NZ Star watermark with Inverted orientation');
                                }}
                                className="text-xs"
                            >
                                Set NZ Star Inverted
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        wmkchar: {
                                            ...prev.wmkchar,
                                            watermarkpresence: "Yes - Watermark Present",
                                            watermarkdetails: {
                                                specifictypes: {
                                                    wmkspecific: "Large Star (Wmk.ls)"
                                                },
                                                wmkorientation: {
                                                    orientation: "Inverted and Reversed"
                                                }
                                            }
                                        }
                                    }));
                                    console.log('Debug: Set Large Star watermark with Inverted and Reversed orientation');
                                }}
                                className="text-xs"
                            >
                                Set Large Star InvRev
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        wmkchar: {
                                            ...prev.wmkchar,
                                            watermarkpresence: "No - No Watermark"
                                        }
                                    }));
                                    console.log('Debug: Set watermarkpresence to "No - No Watermark"');
                                }}
                                className="text-xs"
                            >
                                Set No Watermark
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                    console.log('Debug: Current formData.wmkchar:', formData.wmkchar);
                                    console.log('Debug: Current stamp code:', currentStampCode);
                                    const mergedData = getMergedStampData();
                                    console.log('Debug: Merged data:', mergedData);
                                    const testCode = generateStampCode(mergedData);
                                    console.log('Debug: Generated test code:', testCode);
                                }}
                                className="text-xs"
                            >
                                Log Current State
                            </Button>
                        </div>
                        <div className="text-xs mt-2 text-gray-600">
                            Current watermark presence: {(() => {
                                const wmkPresence = formData.wmkchar?.watermarkpresence;
                                if (typeof wmkPresence === 'object') {
                                    return JSON.stringify(wmkPresence);
                                }
                                return wmkPresence || 'Not set';
                            })()}
                        </div>
                        <div className="text-xs mt-1 text-gray-600">
                            Current stamp code: {currentStampCode}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 