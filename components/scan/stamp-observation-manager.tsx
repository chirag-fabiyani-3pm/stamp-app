import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Home, ChevronDown, X, Edit, Eye, PlusCircle, ZoomIn, ZoomOut, RotateCcw, Loader2 } from "lucide-react";
import Image from "next/image";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getUserData } from "@/lib/api/auth";
import _ from "lodash";

interface CategoryField {
    id: string;
    label: string;
    type?: "text" | "textarea" | "select" | "date";
    description?: string;
    options?: string[];
    defaultValue?: string;
    showWhen?: {
        field: string;
        value: string;
    };
}

interface Category extends CategoryField {
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
        } | null;
        // Complete stamp data for reference
        stampData?: any;
    };
    onCancel?: () => void;
}

// Define the category structure based on comprehensive philatelic attributes
const categories: Category[] = [
    {
        id: 'ItTyp',
        label: 'Item Type',
        description: 'The fundamental classification for any philatelic object',
        children: [
            {
                id: 'ItTyp2',
                label: 'Item Type Selection',
                description: 'Type of collectible item',
                type: 'select',
                options: [
                    'Stamp',
                    'On Piece (OnP)',
                    'On Card (OnCrd)',
                    'On Envelope (OnEnv)',
                    'On Newspaper (OnNew)',
                    'Add Another Type'
                ],
                defaultValue: 'Stamp'
            },
            {
                id: 'ItTypOth',
                label: 'Other Type',
                description: 'Specify the custom item type',
                type: 'text',
                showWhen: {
                    field: 'ItTyp2',
                    value: 'Add Another Type'
                }
            }
        ]
    },
    {
        id: 'Colors',
        label: 'Colors',
        description: 'Pivotal attribute in philately, influencing value and identification',
        children: [
            {
                id: 'ColorType',
                label: 'Color Type',
                description: 'Primary color classification',
        type: 'select',
        options: [
            'Single Color',
            'Multiple Colors',
            'Pictorial'
        ],
        defaultValue: 'Single Color'
    },
    {
                id: 'SingleColor',
                label: 'Single Color',
                description: 'Single color stamps',
                showWhen: {
                    field: 'ColorType',
                    value: 'Single Color'
                },
                children: [
                    {
                        id: 'Purple',
                        label: 'Purple',
                        description: 'Purple color group and shades',
                        children: [
                            {
                                id: 'PurpleShade',
                                label: 'Purple Shade',
                                description: 'Specific purple shade',
        type: 'select',
                                options: [
                                    'Reddish Purple (R.Pur)',
                                    'Slate Purple (Pur,slt)',
                                    'Lilac (Pur,li)',
                                    'Violet (Pur,vi)',
                                    'Mauve (Pur,mve)'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'Brown',
                        label: 'Brown',
                        description: 'Brown color group and shades',
                        children: [
                            {
                                id: 'BrownShade',
                                label: 'Brown Shade',
                                description: 'Specific brown shade',
        type: 'select',
                                options: [
                                    'Purple Brown (Br.pur)',
                                    'Sepia Brown (Br.sep)',
                                    'Red Brown (Br.r)',
                                    'Chocolate Brown (Br.cho)'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'Red',
                        label: 'Red',
                        description: 'Red color group and shades',
                        children: [
                            {
                                id: 'RedShade',
                                label: 'Red Shade',
                                description: 'Specific red shade',
        type: 'select',
                                options: [
                                    'Deep Red (R.dp)',
                                    'Bright Red (R.bgt)',
                                    'Orange (R.or)',
                                    'Rose (R.rs)',
                                    'Carmine (R.car)'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'Blue',
                        label: 'Blue',
                        description: 'Blue color group and shades',
                        children: [
                            {
                                id: 'BlueShade',
                                label: 'Blue Shade',
                                description: 'Specific blue shade',
                                type: 'select',
                                options: [
                                    'Indigo (Blu.in)',
                                    'Royal Blue (Blu.roy)',
                                    'Ultramarine (Blu.ult)',
                                    'Deep Turquoise (Blu.tur.dp)'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'Green',
                        label: 'Green',
                        description: 'Green color group and shades',
                        children: [
                            {
                                id: 'GreenShade',
                                label: 'Green Shade',
                                description: 'Specific green shade',
                                type: 'select',
                                options: [
                                    'Sage (Gr.sag)',
                                    'Emerald (Gr.em)',
                                    'Olive (Gr.ol)'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'Black',
                        label: 'Black',
                        description: 'Black color group and shades',
                        children: [
                            {
                                id: 'BlackShade',
                                label: 'Black Shade',
                                description: 'Specific black shade',
                                type: 'select',
                                options: [
                                    'Grey Black (Blk.gry)',
                                    'Pure Black (Bla)'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'Grey',
                        label: 'Grey',
                        description: 'Grey color group and shades',
                        children: [
                            {
                                id: 'GreyShade',
                                label: 'Grey Shade',
                                description: 'Specific grey shade',
                                type: 'select',
                                options: [
                                    'Brownish Grey (Gry.br)',
                                    'Light Grey (Gry.lt)',
                                    'Dark Grey (Gry.dk)'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'Yellow',
                        label: 'Yellow',
                        description: 'Yellow color group and shades',
                        children: [
                            {
                                id: 'YellowShade',
                                label: 'Yellow Shade',
                                description: 'Specific yellow shade',
                                type: 'select',
                                options: [
                                    'Pale Yellow (Yel.pal)',
                                    'Bright Yellow (Yel.bgt)',
                                    'Golden Yellow (Yel.gld)'
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'MultipleColors',
                label: 'Multiple Colors',
                description: 'Multiple colors as part of the design',
                showWhen: {
                    field: 'ColorType',
                    value: 'Multiple Colors'
                },
                children: [
                    {
                        id: 'PrimaryColor',
                        label: 'Most Prevalent Color',
                        description: 'The most dominant color in the design',
                        type: 'select',
                        options: [
                            'Purple',
                            'Brown',
                            'Red',
                            'Blue',
                            'Green',
                            'Black',
                            'Grey',
                            'Yellow'
                        ]
                    },
                    {
                        id: 'SecondaryColors',
                        label: 'Other Colors Present',
                        description: 'Additional colors in the design (comma-separated)',
                        type: 'text'
                    },
                    {
                        id: 'ColorCount',
                        label: 'Number of Colors',
                        description: 'Total number of distinct colors',
                        type: 'select',
                        options: [
                            '2 colors',
                            '3 colors',
                            '4 colors',
                            '5+ colors'
                        ]
                    }
                ]
            },
            {
                id: 'Pictorial',
                label: 'Pictorial',
                description: 'A photograph or picture for the design',
                showWhen: {
                    field: 'ColorType',
                    value: 'Pictorial'
                },
                children: [
                    {
                        id: 'PictorialType',
                        label: 'Pictorial Type',
                        description: 'Type of pictorial design',
                        type: 'select',
                        options: [
                            'Photograph',
                            'Artwork/Painting',
                            'Drawing/Illustration',
                            'Mixed Media'
                        ]
                    },
                    {
                        id: 'DominantColors',
                        label: 'Dominant Colors',
                        description: 'Main colors visible in the pictorial design',
                        type: 'text'
                    }
                ]
            }
        ]
    },
    {
        id: 'PaperChar',
        label: 'Paper Characteristics',
        description: 'Define the material composition, texture, and orientation of the paper',
        children: [
            {
                id: 'PaperTypes',
                label: 'Paper Types',
                description: 'Different types of paper used in stamp production',
                children: [
                    {
                        id: 'PaperType',
        label: 'Paper Type',
                        description: 'Type of paper used',
        type: 'select',
                        options: [
                            'White Paper (P.wh)',
                            'Toned Paper (P.ton)',
                            'Chalk-Surfaced Paper (P.clk)',
                            'Prelure Paper (P.prel)',
                            'Fluorescent Paper (P.flo)',
                            'Self-Adhesive Paper (P.slf)',
                            'Phosphorised Paper (P.phs)',
                            'Gum Arabic Paper (P.arb.gmd)',
                            'PVA Gum Paper (P.alch)'
                        ]
                    }
                ]
            },
            {
                id: 'PaperVariations',
                label: 'Paper Variations',
                description: 'Paper grain orientation and variations',
                children: [
                    {
                        id: 'PaperVariation',
                        label: 'Paper Variation',
                        description: 'Paper grain orientation',
        type: 'select',
                        options: [
                            'Horizontal laid (P.hor)',
                            'Vertical laid (P.ver)'
                        ]
                    }
                ]
            },
            {
                id: 'PaperProdChar',
                label: 'Paper Production Characteristics',
                description: 'Production method characteristics',
                children: [
                    {
                        id: 'ProductionMethod',
                        label: 'Production Method',
                        description: 'How the paper was processed',
                        type: 'select',
                        options: [
                            'Gummed Before Printing (P.dry)',
                            'Printed on the Gummed Side (P.pr.gm)',
                            'Wet Printings (P.pr.wt)',
                            'Paper fold or crease (P.fol or P.crs)'
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'PrintChar',
        label: 'Printing Characteristics',
        description: 'Methods and processes employed to apply the design onto the stamp paper',
        children: [
            {
                id: 'PrintMethods',
                label: 'Printing Types/Methods',
                description: 'Primary printing techniques',
                children: [
                    {
                        id: 'PrintMethod',
                        label: 'Printing Method',
                        description: 'Primary printing technique used',
                        type: 'select',
                        options: [
                            'Recess Printing (Prnt.rec)',
                            'Intaglio (Prnt.rec.int)',
                            'Line-Engraved (Prnt.rec.len)',
                            'Typography/Letterpress (Prnt.typ)',
                            'Lithography/Offset (Prnt.lth)',
                            'Gravure/Photogravure (Prnt.grv)',
                            'Flexography (Prnt.flx)',
                            'Screen Printing (Prnt.scr)',
                            'Héliogravure (Prnt.hel)'
                        ]
                    }
                ]
            },
            {
                id: 'PrintVariants',
                label: 'Printing Process Variants & Effects',
                description: 'Special printing effects and variants',
                children: [
                    {
                        id: 'PrintVariant',
                        label: 'Printing Process Variant',
                        description: 'Special printing effects or variants',
                        type: 'select',
                        options: [
                            'Embossed (Prnt.em)',
                            'Perkins Bacon Method (Prnt.pb)',
                            'Hybrid Printing (Prnt.hyb)'
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'WmkChar',
        label: 'Watermark Characteristics',
        description: 'Deliberate, semi-translucent patterns embedded in paper',
        children: [
            {
                id: 'WatermarkPresence',
                label: 'Watermark Presence',
                description: 'Does the stamp have a watermark?',
                type: 'select',
                options: [
                    'Yes - Watermark Present',
                    'No - No Watermark',
                    'Unknown/Uncertain'
                ],
                defaultValue: 'Unknown/Uncertain'
            },
            {
                id: 'WatermarkDetails',
                label: 'Watermark Details',
                description: 'Watermark characteristics and types',
                showWhen: {
                    field: 'WatermarkPresence',
                    value: 'Yes - Watermark Present'
                },
                children: [
                    {
                        id: 'GeneralTypes',
                        label: 'General Types',
                        description: 'General watermark classifications',
                        children: [
                            {
                                id: 'WmkType',
        label: 'Watermark Type',
                                description: 'General watermark classification',
        type: 'select',
                                options: [
                                    'Single Watermark (Wmk.sgl)',
                                    'Multiple Watermark (Wmk.mlt)',
                                    'All-over Watermark (Wmk.all)',
                                    'Papermaker\'s Watermark (Wmk.pm)'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'WmkOrientation',
                        label: 'Watermark Orientation',
                        description: 'Orientation of the watermark',
                        children: [
                            {
                                id: 'Orientation',
                                label: 'Orientation',
                                description: 'Watermark orientation',
        type: 'select',
                                options: [
                                    'Normal',
                                    'Reversed (Wmk.rev)',
                                    'Inverted (Wmk.inv)',
                                    'Sideways (Wmk.sid)'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'SpecificTypes',
                        label: 'Specific Watermark Design',
                        description: 'Specific watermark designs',
                        children: [
                            {
                                id: 'WmkSpecific',
                                label: 'Specific Watermark',
                                description: 'Specific watermark design',
        type: 'select',
                                options: [
                                    'Large Star (Wmk.ls)',
                                    'Crown Over CC (Wmk.C.ovrCC)',
                                    'NZ and Star 6mm (W7)',
                                    'Double Line "USPS"',
                                    '"SANDS & McDOUGALL MELBOURNE" (W2 a)',
                                    'Other/Custom'
                                ]
                            },
                            {
                                id: 'CustomWatermark',
                                label: 'Custom Watermark Description',
                                description: 'Describe the watermark if not listed above',
                                type: 'text',
                                showWhen: {
                                    field: 'WmkSpecific',
                                    value: 'Other/Custom'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'WmkErrors',
                label: 'Watermark Errors',
                description: 'Watermark error types (if any)',
                showWhen: {
                    field: 'WatermarkPresence',
                    value: 'Yes - Watermark Present'
                },
                children: [
                    {
                        id: 'WmkError',
                        label: 'Watermark Error',
                        description: 'Type of watermark error',
        type: 'select',
                        options: [
                            'No Error',
                            'Watermark Omitted (Wmk.om)',
                            'Misplaced Watermark (Wmk.mis)',
                            'Partial Watermark (Wmk.par)',
                            'Substituted Crown (Wmk.sub)'
                        ],
                        defaultValue: 'No Error'
                    }
                ]
            }
        ]
    },
    {
        id: 'PerfSep',
        label: 'Perforation and Separation',
        description: 'Methods by which individual stamps are detached from a larger sheet',
        children: [
            {
                id: 'PerfTypes',
                label: 'Perforation/Separation Types',
                description: 'Main perforation and separation methods',
                children: [
                    {
                        id: 'PerfType',
                        label: 'Perforation Type',
                        description: 'Type of perforation or separation',
        type: 'select',
                        options: [
                            'Line Perforation (Per.l)',
                            'Comb Perforation (Per.cmb)',
                            'Harrow Perforation (Per.h)',
                            'Rouletting (Per.rlt)',
                            'Elliptical Perforation (Per,el.)',
                            'Part-Perforated (Per.rlt,srp.)',
                            'Syncopated Perforation (Per.rlt,syn.)',
                            'Imperforate (Per.imp)',
                            'Self-Adhesive Die-Cut (Per.di.ct)'
                        ]
                    }
                ]
            },
            {
                id: 'RouletteTypes',
                label: 'Rouletting Types',
                description: 'Specific rouletting methods',
                children: [
                    {
                        id: 'RouletteType',
                        label: 'Rouletting Type',
                        description: 'Specific type of rouletting',
        type: 'select',
                        options: [
                            'Pin Roulette (Per.rlt.pp.10)',
                            'H roulette (Per.rlt,h.16)',
                            'Y Roulette (Per.rlt,y.18)',
                            'Rouletted in line (Per.rlt,7)',
                            'Rouletted in sawtooth (Per.rlt,s.16)',
                            'Serpentine Roulette (Per.rlt,srp.)'
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'Overprints',
        label: 'Overprints',
        description: 'Printed visual expressions stamped onto the front face of a stamp after its original production',
        children: [
            {
                id: 'OverprintPresence',
                label: 'Overprint Presence',
                description: 'Does this stamp have any overprints?',
        type: 'select',
                options: [
                    'No Overprints',
                    'Yes - Has Overprints',
                    'Uncertain'
                ],
                defaultValue: 'No Overprints'
            },
            {
                id: 'OverprintDetails',
                label: 'Overprint Details',
                description: 'Details about the overprints',
                showWhen: {
                    field: 'OverprintPresence',
                    value: 'Yes - Has Overprints'
                },
                children: [
                    {
                        id: 'OverprintType',
                        label: 'Overprint Type',
                        description: 'Classification of overprint',
                        type: 'select',
                        options: [
                            'Official Overprints (OvrPrnt.off)',
                            'War and Military (OvrPrnt.off.Wtx)',
                            'Provisional (OvrPrnt.prov)',
                            'Commemorative (OvrPrnt.com)',
                            'Currency Adjustment (OvrPrnt.cur)',
                            'Security (OvrPrnt.sec)',
                            'Philatelic (OvrPrnt.phi)',
                            'Constitutional/Political (OvrPrnt.pol)',
                            'Local (OvrPrnt.loc)',
                            'Revenue (OvrPrnt.rev)',
                            'Military/Telegraph (OvrPrnt.mil)',
                            'Cross Country (OvrPrnt.Cnty)'
                        ]
                    },
                    {
                        id: 'OverprintText',
                        label: 'Overprint Text',
                        description: 'Text or marking of the overprint',
                        type: 'text'
                    },
                    {
                        id: 'OverprintColor',
                        label: 'Overprint Color',
                        description: 'Color of the overprint',
                        type: 'select',
                        options: [
                            'Black',
                            'Red',
                            'Blue',
                            'Green',
                            'Purple',
                            'Brown',
                            'Other'
                        ]
                    },
                    {
                        id: 'OverprintPosition',
                        label: 'Overprint Position',
                        description: 'Position of overprint on stamp',
                        type: 'select',
                        options: [
                            'Center',
                            'Top',
                            'Bottom',
                            'Left',
                            'Right',
                            'Diagonal',
                            'Multiple Positions'
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'ErrorsVar',
        label: 'Errors and Varieties',
        description: 'Deviations from the intended design or production process',
        children: [
            {
                id: 'ErrorPresence',
                label: 'Error Presence',
                description: 'Does this stamp have any errors or varieties?',
                type: 'select',
                options: [
                    'No Errors - Normal Stamp',
                    'Yes - Has Errors/Varieties',
                    'Uncertain/Needs Expert Review'
                ],
                defaultValue: 'No Errors - Normal Stamp'
            },
            {
                id: 'ErrorCategories',
                label: 'Error Categories',
                description: 'Types of errors present',
                showWhen: {
                    field: 'ErrorPresence',
                    value: 'Yes - Has Errors/Varieties'
                },
                children: [
                    {
                        id: 'PrintingErrors',
                        label: 'Printing Errors',
                        description: 'Errors related to the printing process',
                        children: [
                            {
                                id: 'MissingColour',
                                label: 'Missing Colour',
                                description: 'Color omission errors',
                                children: [
                                    {
                                        id: 'MissingColourType',
                                        label: 'Missing Colour Type',
                                        description: 'Which color is missing',
                                        type: 'select',
                                        options: [
                                            'Red (E.C.om.r)',
                                            'Blue (E.C.om.blu)',
                                            'Yellow (E.C.om.yel)',
                                            'Black (E.C.om.blk)',
                                            'Multiple Colours (E.Pr.C.om.mul)'
                                        ]
                                    }
                                ]
                            },
                            {
                                id: 'ColourShift',
                                label: 'Colour Shift',
                                description: 'Color registration errors',
                                children: [
                                    {
                                        id: 'ShiftDirection',
                                        label: 'Shift Direction',
                                        description: 'Direction of color shift',
                                        type: 'select',
                                        options: [
                                            'Up (E.Pr.C.shf.C.up)',
                                            'Down (E.Pr.C.shf.C.dn)',
                                            'Left (E.Pr C.shf.C.lft)',
                                            'Right (E.Pr C.shf.C.rht)'
                                        ]
                                    },
                                    {
                                        id: 'ShiftSeverity',
                                        label: 'Shift Severity',
                                        description: 'How severe is the shift',
                                        type: 'select',
                                        options: [
                                            'Slight Shift',
                                            'Moderate Shift',
                                            'Major Shift',
                                            'Extreme Shift'
                                        ]
                                    }
                                ]
                            },
                            {
                                id: 'OtherPrintErrors',
                                label: 'Other Printing Errors',
                                description: 'Various printing defects',
                                children: [
                                    {
                                        id: 'PrintErrorType',
                                        label: 'Print Error Type',
                                        description: 'Type of printing error',
                                        type: 'select',
                                        options: [
                                            'Doctor Blades (E.Pr.DB)',
                                            'Ink Blobs (E.Pr.IB.C)',
                                            'White Spots (E.Pr.ws)',
                                            'Offsets (E.Pr.os)',
                                            'Double Print (E.Pr.dbl)',
                                            'Inverted Centre (E.Pr.cntr.inv)',
                                            'Tête-Bêche (E.Pr.tbch)',
                                            'Albino Print (E.Pr.al)',
                                            'Dry Print (E.Pr.dry)',
                                            'Printed on Gummed Side (E.Pr.gmsd)'
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'PerforationErrors',
                        label: 'Perforation Errors',
                        description: 'Errors in perforation process',
                        children: [
                            {
                                id: 'PerfErrorType',
                                label: 'Perforation Error Type',
                                description: 'Type of perforation error',
                                type: 'select',
                                options: [
                                    'Imperforate (E.Per.imp)',
                                    'Part-Perforated (E.Per.prt)',
                                    'Misplaced Perforations (E.Per.mis)',
                                    'Double Perforation (E.Per.dbl)',
                                    'Treble Perforation (E.Per.tbl)',
                                    'Perforation Shift (E.Per.shft)'
                                ]
                            },
                            {
                                id: 'ImperforateSides',
                                label: 'Imperforate Sides',
                                description: 'Which sides are imperforate',
                                type: 'select',
                                options: [
                                    'Top (E.Per.imp.tp)',
                                    'Right (E.Per.imp.rgt)',
                                    'Bottom (E.Per.imp.btm)',
                                    'Left (E.Per.imp.lft)',
                                    'Two Sides (E.Per.imp.sd.2)',
                                    'Three Sides (E.Per.imp.sd.3)',
                                    'All Sides (E.Per.imp.all)'
                                ],
                                showWhen: {
                                    field: 'PerfErrorType',
                                    value: 'Part-Perforated (E.Per.prt)'
                                }
                            }
                        ]
                    },
                    {
                        id: 'WatermarkErrors',
                        label: 'Watermark Errors',
                        description: 'Errors in watermark application',
                        children: [
                            {
                                id: 'WmkErrorType',
                                label: 'Watermark Error Type',
                                description: 'Type of watermark error',
                                type: 'select',
                                options: [
                                    'Missing Watermark (E.Wmk.mss)',
                                    'Inverted Watermark (E.Wmk.inv)',
                                    'Reversed Watermark (E.Wmk.rev)',
                                    'Sideways Watermark (E.Wmk.swy)',
                                    'Inverted and Reversed (E.Wmk.inv.rev)'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'OverprintErrors',
                        label: 'Overprint Errors',
                        description: 'Errors in overprint application',
                        children: [
                            {
                                id: 'OverprintErrorType',
                                label: 'Overprint Error Type',
                                description: 'Type of overprint error',
                                type: 'select',
                                options: [
                                    'Overprint Omitted (E.Pr.Ovpr.om)',
                                    'Overprint Inverted (E.Pr.Ovpr.inv)',
                                    'Double Overprint (E.Pr.Ovpr.dbl)',
                                    'Wrong Colour Overprint (E.Pr.Ovpr.C.E)'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'PaperErrors',
                        label: 'Paper Errors',
                        description: 'Errors in paper quality or type',
                        children: [
                            {
                                id: 'PaperErrorType',
                                label: 'Paper Error Type',
                                description: 'Type of paper error',
                                type: 'select',
                                options: [
                                    'Wrong Paper Type (E.Pa.wrg)',
                                    'Thin/Thick Paper (E.Pa.thk)',
                                    'Paper Inclusions (P.In)',
                                    'Missing Gum (E.Pa.gm.mss)',
                                    'Paper Fold/Crease (E.Pa.fld)'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'DesignErrors',
                        label: 'Design Errors',
                        description: 'Errors in stamp design',
                        children: [
                            {
                                id: 'DesignErrorType',
                                label: 'Design Error Type',
                                description: 'Type of design error',
                                type: 'select',
                                options: [
                                    'Spelling Mistakes (E.Desn.splg)',
                                    'Wrong Portraits (E.Desn.wng)',
                                    'Date Errors (E.Desn.dat)',
                                    'Wrong Colors in Design (E.Desn.clr)',
                                    'Missing Design Elements (E.Desn.mss)'
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'ErrorDescription',
                label: 'Detailed Error Description',
                description: 'Detailed description of the error(s)',
                type: 'textarea',
                showWhen: {
                    field: 'ErrorPresence',
                    value: 'Yes - Has Errors/Varieties'
                }
            },
            {
                id: 'ErrorSignificance',
                label: 'Error Significance',
                description: 'How significant is this error?',
                type: 'select',
                options: [
                    'Minor Variety',
                    'Notable Error',
                    'Major Error',
                    'Extremely Rare Error'
                ],
                showWhen: {
                    field: 'ErrorPresence',
                    value: 'Yes - Has Errors/Varieties'
                }
            }
        ]
    },
    {
        id: 'Underprints',
        label: 'Underprints (On-Back)',
        description: 'Security features or distinguishing marks applied beneath the stamp\'s main design',
        children: [
            {
                id: 'UnderprintType',
                label: 'Underprint Type',
                description: 'Classification of underprint',
                type: 'select',
                options: [
                    'Commercial/Private (Pr.Un.avrt)',
                    'Government/Official (Pr.Un.govt)',
                    'Security (Pr.Un.sec)',
                    'Control (Pr.Un.ctrl)',
                    'Revenue/Fiscal (Pr.Un.rev)',
                    'Experimental/Special (Pr.Un.exp)'
                ]
            },
            {
                id: 'UnderprintDescription',
                label: 'Underprint Description',
                description: 'Description of the underprint',
                type: 'text'
            }
        ]
    },
    {
        id: 'PlateNum',
        label: 'Plate Numbers and Characteristics',
        description: 'Numerical or alphanumerical markings found on stamp sheets',
        children: [
            {
                id: 'PlateNumChar',
                label: 'Plate Number Characteristics',
                description: 'Type and characteristics of plate numbers',
                children: [
                    {
                        id: 'PlateNumType',
                        label: 'Plate Number Type',
                        description: 'Type of plate number marking',
                        type: 'select',
                        options: [
                            'Visible Plate Numbers',
                            'Marginal Plate Numbers',
                            'Embossed Plate Numbers',
                            'Watermarked Plate Numbers',
                            'Overprinted Plate Numbers',
                            'Multi-Plate Numbers'
                        ]
                    }
                ]
            },
            {
                id: 'PlatingDetails',
                label: 'Plating Details',
                description: 'Specific plating information',
                children: [
                    {
                        id: 'PlateNumber',
                        label: 'Plate Number',
                        description: 'Specific plate number',
                        type: 'text'
                    },
                    {
                        id: 'SheetPosition',
                        label: 'Sheet Position',
                        description: 'Position on the printing sheet (Row x Column)',
                        type: 'text'
                    },
                    {
                        id: 'PlateFlawDescription',
                        label: 'Plate Flaw Description',
                        description: 'Description of repetitive flaw',
        type: 'textarea'
                    }
                ]
            }
        ]
    },
    {
        id: 'MultStamp',
        label: 'Multiple Stamp Combinations',
        description: 'Instances where more than one stamp is joined together',
        children: [
            {
                id: 'CommonMultiples',
                label: 'Common Multiple Stamp Formats',
                description: 'Standard multiple stamp configurations',
                children: [
                    {
                        id: 'MultFormat',
                        label: 'Multiple Format',
                        description: 'Configuration of multiple stamps',
        type: 'select',
                        options: [
                            'Horizontal pairs (Pr.hor)',
                            'Vertical pairs (Pr.ver)',
                            'Blocks of four (Bl.4)',
                            'Blocks of six (Bl.6)',
                            'Sheets (Bl.sht)',
                            'Se-Tenant Pairs',
                            'Gutter Pairs (Prs.gut)',
                            'Tête-Bêche Pairs',
                            'Booklet Panes (Pns.blt)'
                        ]
                    }
                ]
            },
            {
                id: 'BlockTypes',
                label: 'Block Types & Shapes',
                description: 'Specific block configurations',
                children: [
                    {
                        id: 'BlockConfig',
                        label: 'Block Configuration',
                        description: 'Specific block arrangement (e.g., 2x3)',
                        type: 'text'
                    }
                ]
            }
        ]
    },
    {
        id: 'Attachments',
        label: 'Attachments to Stamps',
        description: 'Elements that are part of the larger sheet or additional features',
        children: [
            {
                id: 'BordersSelvedge',
                label: 'Stamp Borders & Selvedge',
                description: 'Border and margin elements',
                children: [
                    {
                        id: 'BorderType',
                        label: 'Border/Selvedge Type',
                        description: 'Type of border or selvedge element',
                        type: 'select',
                        options: [
                            'Selvedge (sel)',
                            'Decorative Borders (bdr.dec)',
                            'Marginal Markings (mar.mks)'
                        ]
                    }
                ]
            },
            {
                id: 'TabsLabels',
                label: 'Tabs and Labels',
                description: 'Attached tabs and labels',
                children: [
                    {
                        id: 'TabType',
                        label: 'Tab/Label Type',
                        description: 'Type of attached tab or label',
                        type: 'select',
                        options: [
                            'Attached Tabs (Tabs)',
                            'Advertisement Labels (Lbl.adver)',
                            'Informational Tabs (Tabs.info)'
                        ]
                    }
                ]
            },
            {
                id: 'AttachmentDescription',
                label: 'Attachment Description',
                description: 'Description of the attachment',
                type: 'text'
            }
        ]
    },
    {
        id: 'Postmarks',
        label: 'Postmarks and Cancellations',
        description: 'Markings applied by postal authorities to invalidate stamps',
        children: [
            {
                id: 'PostmarkTypes',
                label: 'Types of Postmarks',
                description: 'Different postmark classifications',
                children: [
                    {
                        id: 'PostmarkType',
                        label: 'Postmark Type',
                        description: 'Type of postmark or cancellation',
                        type: 'select',
                        options: [
                            'Circular Date Stamps (Cn.cds)',
                            'Duplex Postmarks (Cn.dupl)',
                            'Machine Cancels (Cn.mch)',
                            'Precancelled (Cn.pre)',
                            'First Day Issue (Cn.fdi)',
                            'Military Postmarks (Cn.mil)'
                        ]
                    }
                ]
            },
            {
                id: 'SpecificCancellations',
                label: 'Specific Cancellation Types',
                description: 'Specific cancellation classifications',
                children: [
                    {
                        id: 'CancellationType',
                        label: 'Cancellation Type',
                        description: 'Specific cancellation type',
                        type: 'select',
                        options: [
                            'H Class',
                            'F Class',
                            'Manuscript (M)',
                            'Pictorial/Commemorative (P)'
                        ]
                    }
                ]
            },
            {
                id: 'PostmarkQuality',
                label: 'Postmark Quality',
                description: 'Quality and clarity assessment',
                children: [
                    {
                        id: 'Quality',
                        label: 'Quality',
                        description: 'Quality and clarity of the postmark',
                        type: 'select',
                        options: [
                            'Clear and Complete',
                            'Partial but Readable',
                            'Unclear/Incomplete',
                            'Bullseye Cancel',
                            'Corner Cancel'
                        ]
                    }
                ]
            },
            {
                id: 'PostmarkDate',
                label: 'Postmark Date',
                description: 'Date visible on postmark',
                type: 'date'
            }
        ]
    },
    {
        id: 'CollectorGroup',
        label: 'Stamp Collector Groups',
        description: 'Specialized areas of philatelic interest',
        children: [
            {
                id: 'DirectCollectorGroups',
                label: 'Direct Collector Groups',
                description: 'Primary collector interest areas',
                children: [
                    {
                        id: 'CollectorCategory',
                        label: 'Collector Category',
                        description: 'Primary collector interest area',
                        type: 'select',
                        options: [
                            'Forgeries (For)',
                            'Proofs (Prf)',
                            'Errors (E)',
                            'Plating (Plt)',
                            'Cinderellas (Cind)',
                            'Postal History (PH)'
                        ]
                    }
                ]
            },
            {
                id: 'PostalProducts',
                label: 'Virtual Collection Sectional Code',
                description: 'Postal product classifications',
                children: [
                    {
                        id: 'PostalProductType',
                        label: 'Postal Product Type',
                        description: 'Type of postal product',
                        type: 'select',
                        options: [
                            'Alternative Carriers (AC)',
                            'Aerophilately (AR)',
                            'Express Mail (EX)',
                            'Postmarks (PK)',
                            'Revenues (RV)',
                            'Postage Stamps (St)'
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'Rarity',
        label: 'Rarity Rating',
        description: 'A standardized measure of an item\'s scarcity',
        children: [
            {
                id: 'RarityScale',
                label: 'Rarity Scale',
                description: 'Rarity rating from 1-10 (10 being most rare)',
                type: 'select',
                options: [
                    '1 - Least rare (500,001 – 1,000,000)',
                    '2 - (100,001 – 500,000)',
                    '3 - (25,001 – 100,000)',
                    '4 - (5001 – 25,000)',
                    '5 - (1001 – 5000)',
                    '6 - (151 – 1000)',
                    '7 - (51 – 150)',
                    '8 - (6 – 50)',
                    '9 - (1 – 5)',
                    '10 - Extremely Rare'
                ]
            },
            {
                id: 'StampPrintCount',
                label: 'Stamp Print Count',
                description: 'Count of stamps of this variety printed',
                type: 'text'
            },
            {
                id: 'ErrorVisualAppeal',
                label: 'Error Visual Appeal Rating',
                description: 'Visual appeal rating for errors (1-10, 1 being most appealing)',
                type: 'select',
                options: [
                    '1 - Most visually appealing',
                    '2 - Very appealing',
                    '3 - Appealing',
                    '4 - Moderately appealing',
                    '5 - Average appeal',
                    '6 - Below average',
                    '7 - Poor appeal',
                    '8 - Very poor appeal',
                    '9 - Minimal appeal',
                    '10 - Least appealing'
                ]
            }
        ]
    },
    {
        id: 'Grading',
        label: 'Grading',
        description: 'A systematic assessment of a stamp\'s condition and quality',
        children: [
            {
                id: 'Condition',
                label: 'Overall Condition',
                description: 'General condition assessment',
                type: 'select',
                options: [
                    'Mint Never Hinged',
                    'Mint Lightly Hinged',
                    'Mint Hinged',
                    'Used',
                    'Used with Faults',
                    'Damaged'
                ]
            },
            {
                id: 'GeneralGrade',
                label: 'General Grade',
                description: 'Silver Approval Grade (1-8, 8 being best)',
                type: 'select',
                options: [
                    '1 - Poor',
                    '2 - Fair',
                    '3 - Good',
                    '4 - Good+',
                    '5 - Fine',
                    '6 - Very Fine',
                    '7 - Extremely Fine',
                    '8 - Superb'
                ]
            },
            {
                id: 'DetailedGrading',
                label: 'Detailed Grading',
                description: 'Detailed quality assessment',
                children: [
                    {
                        id: 'Borders',
                        label: 'Borders',
                        description: 'Border quality assessment',
                        children: [
                            {
                                id: 'Centering',
                                label: 'Centering',
                                description: 'Quality of stamp centering within borders',
                                type: 'select',
                                options: [
                                    '1 - Superb',
                                    '2 - Extremely Fine',
                                    '3 - Very Fine',
                                    '4 - Fine',
                                    '5 - Good',
                                    '6 - Fair',
                                    '7 - Poor',
                                    '8 - Very Poor'
                                ]
                            },
                            {
                                id: 'BorderThickness',
                                label: 'Border Thickness',
                                description: 'Quality of border thickness',
                                type: 'select',
                                options: [
                                    '1 - Superb',
                                    '2 - Extremely Fine',
                                    '3 - Very Fine',
                                    '4 - Fine',
                                    '5 - Good',
                                    '6 - Fair',
                                    '7 - Poor',
                                    '8 - Very Poor'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'EyeAppealMint',
                        label: 'Eye Appeal (Mint)',
                        description: 'Visual appeal for mint stamps',
                        showWhen: {
                            field: 'Condition',
                            value: 'Mint Never Hinged'
                        },
                        children: [
                            {
                                id: 'ImageFreshness',
                                label: 'Image Freshness',
                                description: 'Freshness of front stamp image',
                                type: 'select',
                                options: [
                                    '1 - Pristine',
                                    '2 - Excellent',
                                    '3 - Very Good',
                                    '4 - Good',
                                    '5 - Fair',
                                    '6 - Poor',
                                    '7 - Very Poor',
                                    '8 - Washed out'
                                ]
                            },
                            {
                                id: 'ColorVibrancy',
                                label: 'Color Vibrancy',
                                description: 'Vibrancy of color',
                                type: 'select',
                                options: [
                                    '1 - Vibrant',
                                    '2 - Excellent',
                                    '3 - Very Good',
                                    '4 - Good',
                                    '5 - Fair',
                                    '6 - Poor',
                                    '7 - Very Poor',
                                    '8 - Dull'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'EyeAppealUsed',
                        label: 'Eye Appeal (Used)',
                        description: 'Visual appeal for used stamps',
                        showWhen: {
                            field: 'Condition',
                            value: 'Used'
                        },
                        children: [
                            {
                                id: 'CancellationCrispness',
                                label: 'Cancellation Quality',
                                description: 'Quality of cancellation enhancing stamp',
                                type: 'select',
                                options: [
                                    '1 - Small clear mark in corner',
                                    '2 - Light, clear cancellation',
                                    '3 - Moderate cancellation',
                                    '4 - Heavy but clear',
                                    '5 - Covers significant area',
                                    '6 - Obscures some design',
                                    '7 - Covers most design',
                                    '8 - Unclear, covers >75%'
                                ]
                            }
                        ]
                    },
                    {
                        id: 'PaperCondition',
                        label: 'Paper Condition',
                        description: 'Overall paper condition',
                        children: [
                            {
                                id: 'PaperQuality',
                                label: 'Paper Quality',
                                description: 'Paper image quality',
                                type: 'select',
                                options: [
                                    '1 - Perfect',
                                    '2 - Excellent',
                                    '3 - Very Good',
                                    '4 - Good',
                                    '5 - Fair',
                                    '6 - Poor',
                                    '7 - Very Poor',
                                    '8 - Damaged'
                                ]
                            },
                            {
                                id: 'GumCondition',
                                label: 'Gum Condition',
                                description: 'Condition of gum (for mint stamps)',
                                type: 'select',
                                options: [
                                    '1 - Original, pristine, no fingerprints',
                                    '2 - Original, very light hinge',
                                    '3 - Original, light hinge',
                                    '4 - Original, heavy hinge',
                                    '5 - Disturbed gum',
                                    '6 - Partial gum',
                                    '7 - Minimal gum',
                                    '8 - No gum'
                                ],
                                showWhen: {
                                    field: 'Condition',
                                    value: 'Mint Never Hinged'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'AdditionalInfo',
        label: 'Additional Information',
        description: 'Additional details and notes',
        children: [
            {
                id: 'Country',
                label: 'Country of Origin',
                description: 'Country that issued the stamp',
                type: 'select',
                options: ['New Zealand', 'Australia', 'Great Britain', 'United States', 'Canada', 'Other'],
                defaultValue: 'New Zealand'
            },
            {
                id: 'IssueDate',
                label: 'Date of Issue',
                description: 'When the stamp was issued',
                type: 'date',
                defaultValue: new Date().toISOString().split('T')[0]
            },
            {
                id: 'Denomination',
                label: 'Denomination',
                description: 'Face value of the stamp',
                type: 'text'
            },
            {
                id: 'Designer',
                label: 'Designer',
                description: 'Designer of the stamp',
                type: 'text'
            },
            {
                id: 'Printer',
                label: 'Printer',
                description: 'Printing company',
                type: 'text'
            },
            {
                id: 'CatalogueNumber',
                label: 'Catalogue Number',
                description: 'Standard catalogue reference number',
                type: 'text'
            },
            {
                id: 'PurchasePrice',
                label: 'Purchase Price',
                description: 'Purchase price and currency',
                type: 'text'
            },
            {
                id: 'PurchaseDate',
        label: 'Purchase Date',
        description: 'When the stamp was purchased',
        type: 'date'
    },
    {
                id: 'Notes',
                label: 'Additional Notes',
                description: 'Any additional observations or notes',
                type: 'textarea'
            }
        ]
    }
];

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
        if (!watermark || watermark.toLowerCase() === 'none' || watermark.trim() === '') {
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
            ittyp2: 'Stamp'
        }
    };

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
        formData.rarity = {
            rarityscale: rarityRating,
            stampprintcount: apiData.printingQuantity?.toString() || ''
        };
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

    // Additional Information - only add fields that have actual data
    const country = apiData.country ? mapCountry(apiData.country) : null;
    const additionalInfo: any = {};
    
    if (country) additionalInfo.country = country;
    if (apiData.issueDate) additionalInfo.issuedate = new Date(apiData.issueDate).toISOString().split('T')[0];
    if (apiData.denominationValue || apiData.denominationSymbol) {
        additionalInfo.denomination = `${apiData.denominationValue || ''}${apiData.denominationSymbol || ''}`;
    }
    if (apiData.artist) additionalInfo.designer = apiData.artist;
    if (apiData.engraver) additionalInfo.printer = apiData.engraver;
    if (apiData.catalogNumber) additionalInfo.cataloguenumber = apiData.catalogNumber;
    
    // Combine notes only if they exist
    const notes = [
        apiData.specialNotes,
        apiData.historicalContext,
        apiData.description
    ].filter(Boolean);
    if (notes.length > 0) {
        additionalInfo.notes = notes.join(' | ');
    }
    
    // Only add additionalinfo if we have any data
    if (Object.keys(additionalInfo).length > 0) {
        formData.additionalinfo = additionalInfo;
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

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = (newValue: string) => {
        onUpdate(path, newValue);
        setIsEditing(false);
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
                            value={String(value)}
                            onChange={(e) => handleSave(e.target.value)}
                            placeholder={field.description}
                            autoFocus
                        />
                    ) : (
                        <Input
                            type={field.type === 'date' ? 'date' : 'text'}
                            value={String(value)}
                            onChange={(e) => handleSave(e.target.value)}
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
    onCancel
}: StampObservationManagerProps) {
    const [navigationPath, setNavigationPath] = useState<NavigationPathItem[]>([]);
    
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
            await saveStampToAPI(
                formData, 
                allCategories, 
                selectedStamp,
                selectedStamp.scannedImage
            );
            
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

    // Handle form field changes
    const handleFieldChange = (path: NavigationPathItem[], value: string) => {
        // Create a nested object based on the navigation path
        let newFormData = { ...formData };
        let current = newFormData;

        // For each level in the path except the last one, ensure the nested object exists
        for (let i = 0; i < path.length - 1; i++) {
            const categoryId = path[i].id.toLowerCase();
            if (!current[categoryId]) {
                current[categoryId] = {};
            }
            current = current[categoryId];
        }

        // Set the value at the final level
        const finalId = path[path.length - 1].id.toLowerCase();
        current[finalId] = value;

        setFormData(newFormData);
    };

    // Update shouldShow to handle nested data structure
    const shouldShow = (item: Category): boolean => {
        if (!item.showWhen) return true;
        const { field, value } = item.showWhen;

        // Handle nested field paths by traversing the navigation path and form data
        let currentValue: any = formData;

        // First, navigate to the current category level based on navigation path
        for (let i = 0; i < navigationPath.length; i++) {
            const categoryId = navigationPath[i].id.toLowerCase();
            if (currentValue && typeof currentValue === 'object') {
                currentValue = currentValue[categoryId];
            } else {
                return false;
            }
        }

        // Then navigate to the specific field
        const fieldPath = field.toLowerCase().split('.');
        for (const key of fieldPath) {
            if (!currentValue || typeof currentValue !== 'object') {
                return false;
            }
            currentValue = currentValue[key];
        }

        // Compare the final value with the expected value
        return String(currentValue) === value;
    };

    // Helper function to get nested form value
    const getNestedFormValue = (path: NavigationPathItem[], fieldId: string): string => {
        let current = formData;
        // Navigate through the path except the last item
        for (let i = 0; i < path.length - 1; i++) {
            const categoryId = path[i].id.toLowerCase();
            current = current[categoryId] || {};
        }
        return current[fieldId.toLowerCase()] || '';
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

    // Update renderField to use the new value getter
    const renderField = (field: Category) => {
        const currentValue = getNestedFormValue(navigationPath, field.id);

        switch (field.type) {
            case 'select':
                return (
                    <Select
                        value={currentValue}
                        onValueChange={(value) => handleFieldChange(navigationPath, value)}
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
                        onChange={(e) => handleFieldChange(navigationPath, e.target.value)}
                        placeholder={field.description}
                    />
                );
            case 'date':
                return (
                    <Input
                        type="date"
                        value={currentValue}
                        onChange={(e) => handleFieldChange(navigationPath, e.target.value)}
                    />
                );
            default:
                return (
                    <Input
                        type="text"
                        value={currentValue}
                        onChange={(e) => handleFieldChange(navigationPath, e.target.value)}
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

        console.log(formData);

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 h-[104px]">
                        <div className="flex flex-col items-center justify-center">
                            <PlusCircle className="h-5 w-5 mb-2" />
                            <span>Add New</span>
                        </div>
                    </Button>
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

            // Transform form data to API format
            const stampDetails = transformFormDataToApiFormat(formData, categories);
            
            // Get stamp catalog ID from selected stamp API data
            const stampCatalogId = selectedStamp?.apiData?.id || selectedStamp?.id || '';
            
            if (!stampCatalogId) {
                throw new Error('No stamp catalog ID found.');
            }

            // Create FormData for multipart/form-data
            const apiFormData = new FormData();
            
            // Add required fields
            apiFormData.append('UserId', userId);
            apiFormData.append('StampCatalogId', stampCatalogId);
            apiFormData.append('StampDetails', JSON.stringify(stampDetails));
            
            // Add description and title from form data
            const description = formData?.additionalinfo?.notes || 
                              selectedStamp?.apiData?.description || 
                              'Stamp observation details';
            const title = selectedStamp?.apiData?.name || 
                         formData?.additionalinfo?.cataloguenumber || 
                         'Stamp Observation';
            
            apiFormData.append('Description', description);
            apiFormData.append('Title', title);
            
            // Add scanned image file if available
            if (scannedImageDataUrl) {
                try {
                    // Convert data URL to blob
                    const response = await fetch(scannedImageDataUrl);
                    const blob = await response.blob();
                    apiFormData.append('File', blob, 'scanned-stamp.jpg');
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
                    </div>
                </div>

                <Tabs defaultValue="preview">
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
                        <Card className="p-3 sm:p-6 mb-6">
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
            </div>
        </div>
    );
} 