import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Home, ChevronDown, X, Edit, Eye, PlusCircle } from "lucide-react";
import Image from "next/image";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SubSubCategory {
    id: string;
    label: string;
    type?: "text" | "textarea" | "select" | "date";
    description?: string;
    options?: string[];
    showWhen?: {
        field: string;
        value: string;
    };
    subcategories?: SubSubCategory[];
    isCustom?: boolean;
}

interface SubCategory {
    id: string;
    label: string;
    type?: "text" | "textarea" | "select" | "date";
    description?: string;
    options?: string[];
    showWhen?: {
        field: string;
        value: string;
    };
    subcategories?: SubSubCategory[];
    isCustom?: boolean;
}

interface Category {
    id: string;
    label: string;
    description: string;
    subcategories: SubCategory[];
    isCustom?: boolean;
}

interface CustomCategory extends Category {
    isCustom?: boolean;
}

interface CustomSubCategory extends SubCategory {
    isCustom?: boolean;
}

// Define the category structure
const categories: Category[] = [
    {
        id: 'ItTyp',
        label: 'Item Type',
        description: 'Type of collectible item',
        subcategories: [
            {
                id: 'ItTyp_main',
                label: 'Main Type',
                type: 'select',
                description: 'Select the main type of collectible item',
                options: [
                    'Stamp',
                    'Baseball Card',
                    'Pottery',
                    'Coin',
                    'Banknote',
                    'Comic Book',
                    'Trading Card',
                    'Other'
                ]
            },
            {
                id: 'ItTyp_other',
                label: 'Other Type',
                type: 'text',
                description: 'Specify if type is not in the list above',
                showWhen: {
                    field: 'ItTyp_main',
                    value: 'Other'
                }
            },
            {
                id: 'ItTyp_stamp_format',
                label: 'Stamp Format',
                description: 'How the stamp is presented',
                showWhen: {
                    field: 'ItTyp_main',
                    value: 'Stamp'
                },
                subcategories: [
                    {
                        id: 'ItTyp_stamp_format_type',
                        label: 'Format Type',
                        type: 'select',
                        description: 'Select how the stamp is presented',
                        options: [
                            'On Piece',
                            'On Card',
                            'On Envelope',
                            'On Newspaper',
                            'Loose',
                            'In Album',
                            'Other'
                        ]
                    },
                    {
                        id: 'ItTyp_stamp_format_other',
                        label: 'Other Format',
                        type: 'text',
                        description: 'Specify if format is not in the list above',
                        showWhen: {
                            field: 'ItTyp_stamp_format_type',
                            value: 'Other'
                        }
                    }
                ]
            }
        ]
    },
    {
        id: 'C',
        label: 'Colour',
        description: 'Color properties and classification',
        subcategories: [
            {
                id: 'C_type',
                label: 'Color Type',
                type: 'select',
                description: 'Select the color classification type',
                options: [
                    'Single Color',
                    'Multiple Colors',
                    'Pictorial'
                ]
            },
            {
                id: 'C_single',
                label: 'Single Color Selection',
                description: 'Select the main color group and specific shade',
                showWhen: {
                    field: 'C_type',
                    value: 'Single Color'
                },
                subcategories: [
                    {
                        id: 'C_group',
                        label: 'Color Group',
                        type: 'select',
                        description: 'Select the main color group',
                        options: [
                            'Purple (Pur)',
                            'Brown (Br)',
                            'Red (R)',
                            'Blue (Blu)',
                            'Green (Gr)',
                            'Black (Blk)',
                            'Grey (Gry)',
                            'Yellow (Yel)'
                        ]
                    },
                    {
                        id: 'C_purple_shade',
                        label: 'Purple Shades',
                        type: 'select',
                        description: 'Select the specific purple shade',
                        showWhen: {
                            field: 'C_group',
                            value: 'Purple (Pur)'
                        },
                        options: [
                            'Reddish Purple (Pur.r) - #822E81',
                            'Slate Purple (Pur.slt) - #5B507A',
                            'Lilac (Pur.li) - #C8A2C8',
                            'Brown Lilac (Pur.li.br) - #836953',
                            'Deep Lilac (Pur.li.dp) - #9678B6',
                            'Reddish Lilac (Pur.li.r) - #AE5D9D',
                            'Pale Lilac (Pur.li.pal) - #DCD0FF',
                            'Mauve Lilac (Pur.li.mve) - #915F6D',
                            'Blueish Lilac (Pur.li.blu) - #8673A1',
                            'Slate Lilac (Pur.li.slt) - #6B5876',
                            'Violet (Pur.vi) - #8F00FF',
                            'Reddish Violet (Pur.vi.r) - #C71585',
                            'Slate Violet (Pur.vi.slt) - #5F4B8B',
                            'Bright Violet (Pur.vi.bht) - #7D26CD',
                            'Dull Violet (Pur.vi.dul) - #704170',
                            'Mauve (Pur.mve) - #E0B0FF',
                            'Pale Mauve (Pur.mve.pal) - #F4D8FF',
                            'Deep Mauve (Pur.mve.dp) - #D473D4',
                            'Reddish Mauve (Pur.mve.r) - #B784A7'
                        ]
                    },
                    {
                        id: 'C_brown_shade',
                        label: 'Brown Shades',
                        type: 'select',
                        description: 'Select the specific brown shade',
                        showWhen: {
                            field: 'C_group',
                            value: 'Brown (Br)'
                        },
                        options: [
                            'Purple Brown (Br.pur) - #5D3B3A',
                            'Sepia Brown (Br.sep) - #704214',
                            'Pale Brown (Br.pal) - #987654',
                            'Bistre Brown (Br.bis) - #3D2B1F',
                            'Tan Brown (Br.tan) - #D2B48C',
                            'Red Brown (Br.r) - #A52A2A',
                            'Deep Red Brown (Br.r.dp) - #8B4513',
                            'Chestnut (Br.ch) - #954535',
                            'Deep Brown (Br.dp) - #5C4033',
                            'Chocolate Brown (Br.cho) - #7B3F00',
                            'Deep Chocolate Brown (Br.cho.dp) - #4F2F2F',
                            'Blackish Brown (Br.blk) - #3D2B1F',
                            'Deep Slate Brown (Br.slt.dp) - #5A4E45',
                            'Greyish Brown (Br.gry) - #A49A79',
                            'Black Brown (Br.blk) - #3B2F2F'
                        ]
                    },
                    {
                        id: 'C_red_shade',
                        label: 'Red Shades',
                        type: 'select',
                        description: 'Select the specific red shade',
                        showWhen: {
                            field: 'C_group',
                            value: 'Red (R)'
                        },
                        options: [
                            'Deep Red (R.dp) - #8B0000',
                            'Bright Red (R.bgt) - #FF0000',
                            'Dull Red (R.dul) - #B22222',
                            'Brown Red (R.br) - #A52A2A',
                            'Orange (R.or) - #FFA500',
                            'Pale Orange (R.or.pal) - #FFDAB9',
                            'Orange Red (R.or.r) - #FF4500',
                            'Orange Vermillion (R.or.ver) - #E34234',
                            'Rose (R.rs) - #FF007F',
                            'Rose Red (R.rs.r) - #C21E56',
                            'Pale Rose Red (R.rs.r.pal) - #FFB6C1',
                            'Rosine (Bright Rose) (R.rs.bgt) - #FF66CC',
                            'Deep Rose Red (R.rs.r.dp) - #C71585',
                            'Dull Rose (R.rs.dul) - #BC8F8F',
                            'Salmon (R.sal) - #FA8072',
                            'Scarlet (R.scar) - #FF2400',
                            'Vermillion (R.ver) - #E34234',
                            'Carmine (R.car) - #960018',
                            'Carmine Vermillion (R.car.ver) - #D70040',
                            'Pink (R.pnk) - #FFC0CB',
                            'Claret (R.clt) - #7F1734',
                            'Maroon (R.mar) - #800000'
                        ]
                    },
                    {
                        id: 'C_blue_shade',
                        label: 'Blue Shades',
                        type: 'select',
                        description: 'Select the specific blue shade',
                        showWhen: {
                            field: 'C_group',
                            value: 'Blue (Blu)'
                        },
                        options: [
                            'Indigo (Blu.in) - #4B0082',
                            'Greenish Blue (Blu.gr) - #0D98BA',
                            'Royal Blue (Blu.roy) - #4169E1',
                            'Slate Blue (Blu.slt) - #6A5ACD',
                            'Steel Blue (Blu.stl) - #4682B4',
                            'Pale Blue (Blu.pal) - #AFEEEE',
                            'Bright Blue (Blu.bgt) - #0096FF',
                            'Chalky Blue (Blu.clk) - #B0E0E6',
                            'Milky Blue (Blu.mlk) - #CAE1FF',
                            'Light Blue (Blu.lgt) - #ADD8E6',
                            'Ultramarine (Blu.ult) - #120A8F',
                            'Deep Turquoise (Blu.tur.dp) - #00CED1',
                            'Pale Turquoise (Blu.tur.pal) - #AFEEEE',
                            'Intense Blue (Blu.int) - #0033CC',
                            'Dull Violet Blue (Blu.vi.dul) - #6F00FF'
                        ]
                    },
                    {
                        id: 'C_green_shade',
                        label: 'Green Shades',
                        type: 'select',
                        description: 'Select the specific green shade',
                        showWhen: {
                            field: 'C_group',
                            value: 'Green (Gr)'
                        },
                        options: [
                            'Sage (Gr.sag) - #BCB88A',
                            'Emerald (Gr.em) - #50C878',
                            'Slate Green (Gr.slt) - #5A6953',
                            'Yellow Green (Gr.yel) - #9ACD32',
                            'Deep Yellow Green (Gr.yel.dp) - #556B2F',
                            'Bluish Green (Gr.blu) - #0D98BA',
                            'Deep Bluish Green (Gr.blu.dp) - #01796F',
                            'Myrtle (Gr.myt) - #21421E',
                            'Olive (Gr.ol) - #808000',
                            'Light Olive (Gr.ol.lgt) - #B5B35C',
                            'Dark Olive (Gr.ol.drk) - #556B2F',
                            'Deep Green (Gr.dp) - #006400',
                            'Sap Green (Gr.sap) - #507D2A'
                        ]
                    },
                    {
                        id: 'C_black_shade',
                        label: 'Black Shades',
                        type: 'select',
                        description: 'Select the specific black shade',
                        showWhen: {
                            field: 'C_group',
                            value: 'Black (Blk)'
                        },
                        options: [
                            'Grey Black (Blk.gry) - #2F2F2F',
                            'Slate (Blk.slt) - #708090',
                            'Brownish Black (Blk.br) - #2C1608'
                        ]
                    },
                    {
                        id: 'C_grey_shade',
                        label: 'Grey Shades',
                        type: 'select',
                        description: 'Select the specific grey shade',
                        showWhen: {
                            field: 'C_group',
                            value: 'Grey (Gry)'
                        },
                        options: [
                            'Brownish Grey (Gry.br) - #756D5D',
                            'Violet Grey (Gry.vi) - #7D7098',
                            'Slate Grey (Gry.slt) - #708090'
                        ]
                    },
                    {
                        id: 'C_yellow_shade',
                        label: 'Yellow Shades',
                        type: 'select',
                        description: 'Select the specific yellow shade',
                        showWhen: {
                            field: 'C_group',
                            value: 'Yellow (Yel)'
                        },
                        options: [
                            'Pale Yellow (Yel.pal) - #FFFFE0',
                            'Bright Yellow (Yel.bgt) - #FFFF00',
                            'Ochre Yellow (Yel.och) - #CC7722',
                            'Orange Yellow (Yel.or) - #FFAE42',
                            'Deep Orange Yellow (Yel.or.dp) - #E67700',
                            'Mustard Yellow (Yel.mus) - #FFDB58',
                            'Olive Yellow (Yel.ol) - #BAB86C'
                        ]
                    }
                ]
            },
            {
                id: 'C_multiple',
                label: 'Multiple Colors',
                description: 'For stamps with multiple colors',
                showWhen: {
                    field: 'C_type',
                    value: 'Multiple Colors'
                },
                subcategories: [
                    {
                        id: 'C_multiple_primary',
                        label: 'Primary/Most Prevalent Color',
                        type: 'select',
                        description: 'Select the main color of the stamp',
                        options: [
                            'Purple (Pur)',
                            'Brown (Br)',
                            'Red (R)',
                            'Blue (Blu)',
                            'Green (Gr)',
                            'Black (Blk)',
                            'Grey (Gry)',
                            'Yellow (Yel)'
                        ]
                    },
                    {
                        id: 'C_multiple_secondary',
                        label: 'Secondary Colors',
                        type: 'text',
                        description: 'List additional colors in order of prevalence'
                    }
                ]
            },
            {
                id: 'C_pictorial',
                label: 'Pictorial Description',
                description: 'For pictorial stamps',
                showWhen: {
                    field: 'C_type',
                    value: 'Pictorial'
                },
                subcategories: [
                    {
                        id: 'C_pictorial_desc',
                        label: 'Picture Description',
                        type: 'textarea',
                        description: 'Describe the picture and its main colors'
                    }
                ]
            }
        ]
    },
    {
        id: 'Ctry',
        label: 'Country',
        description: 'Country of origin',
        subcategories: [
            {
                id: 'Ctry_name',
                label: 'Country Name',
                type: 'select',
                description: 'Select the country of origin',
                options: ['New Zealand', 'Australia', 'Great Britain', 'United States', 'Canada', 'Other']
            },
            {
                id: 'Ctry_region',
                label: 'Region/Territory',
                type: 'text',
                description: 'Specify the region or territory if applicable'
            }
        ]
    },
    {
        id: 'WdsOSt',
        label: 'Words/Symbols on Stamp',
        description: 'Text and symbols present on the stamp',
        subcategories: [
            {
                id: 'WdsOSt_basic',
                label: 'Basic Stamp Text',
                description: 'Original text and markings on the stamp',
                subcategories: [
                    {
                        id: 'WdsOSt_basic_denomination',
                        label: 'Denomination',
                        type: 'text',
                        description: 'Value shown on the stamp'
                    },
                    {
                        id: 'WdsOSt_basic_country',
                        label: 'Country Name Text',
                        type: 'text',
                        description: 'Country name as it appears on the stamp'
                    },
                    {
                        id: 'WdsOSt_basic_text',
                        label: 'Main Text',
                        type: 'textarea',
                        description: 'Primary text content on the stamp'
                    },
                    {
                        id: 'WdsOSt_basic_symbols',
                        label: 'Symbols/Marks',
                        type: 'textarea',
                        description: 'Any symbols, marks, or special characters'
                    }
                ]
            },
            {
                id: 'WdsOSt_overprint',
                label: 'Overprint',
                description: 'Text or markings added after original printing',
                subcategories: [
                    {
                        id: 'WdsOSt_overprint_present',
                        label: 'Has Overprint',
                        type: 'select',
                        description: 'Indicate if the stamp has an overprint',
                        options: ['Yes', 'No']
                    },
                    {
                        id: 'WdsOSt_overprint_text',
                        label: 'Overprint Text',
                        type: 'textarea',
                        description: 'Text content of the overprint',
                        showWhen: {
                            field: 'WdsOSt_overprint_present',
                            value: 'Yes'
                        }
                    },
                    {
                        id: 'WdsOSt_overprint_color',
                        label: 'Overprint Color',
                        type: 'text',
                        description: 'Color of the overprint text/markings',
                        showWhen: {
                            field: 'WdsOSt_overprint_present',
                            value: 'Yes'
                        }
                    },
                    {
                        id: 'WdsOSt_overprint_position',
                        label: 'Overprint Position',
                        type: 'select',
                        description: 'Select the position of the overprint on the stamp',
                        options: [
                            'Top',
                            'Bottom',
                            'Center',
                            'Left',
                            'Right',
                            'Diagonal',
                            'Multiple Positions',
                            'Other'
                        ],
                        showWhen: {
                            field: 'WdsOSt_overprint_present',
                            value: 'Yes'
                        }
                    },
                    {
                        id: 'WdsOSt_overprint_error',
                        label: 'Overprint Error Check',
                        type: 'select',
                        options: ['Normal', 'Error Present'],
                        description: 'Select if there are any errors in the overprint',
                        showWhen: {
                            field: 'WdsOSt_overprint_present',
                            value: 'Yes'
                        }
                    }
                ]
            }
        ]
    },
    {
        id: 'ImDescOSt',
        label: 'Image Description',
        description: 'Detailed description of stamp imagery',
        subcategories: [
            {
                id: 'ImDescOSt_primary',
                label: 'Primary Image',
                description: 'Main or central image on the stamp',
                subcategories: [
                    {
                        id: 'ImDescOSt_primary_type',
                        label: 'Image Type',
                        type: 'select',
                        description: 'Select the type of primary image',
                        options: [
                            'Portrait',
                            'Landscape',
                            'Building',
                            'Symbol',
                            'Text Only',
                            'Animal',
                            'Plant',
                            'Ship',
                            'Aircraft',
                            'Other'
                        ]
                    },
                    {
                        id: 'ImDescOSt_primary_details',
                        label: 'Details',
                        type: 'textarea',
                        description: 'Describe the primary image in detail'
                    }
                ]
            }
        ]
    },
    {
        id: 'DtOIss',
        label: 'Date of Issue',
        description: 'When and where the stamp was issued',
        subcategories: [
            {
                id: 'DtOIss_date',
                label: 'Issue Date',
                type: 'date',
                description: 'Select the date of issue'
            },
            {
                id: 'DtOIss_country',
                label: 'Country of Issue',
                type: 'select',
                description: 'The country that issued the stamp',
                options: [
                    'New Zealand',
                    'Australia',
                    'Great Britain',
                    'United States',
                    'Canada',
                    'India',
                    'South Africa',
                    'Other'
                ]
            }
        ]
    },
    {
        id: 'Pa',
        label: 'Paper Type',
        description: 'Type and characteristics of the paper',
        subcategories: [
            {
                id: 'Pa_type',
                label: 'Paper Type',
                type: 'select',
                description: 'Select the type of paper used',
                options: ['Wove', 'Laid', 'Chalky', 'Coated', 'Security']
            },
            {
                id: 'Pa_thickness',
                label: 'Thickness',
                type: 'select',
                description: 'Select the paper thickness',
                options: ['Thin', 'Medium', 'Thick']
            }
        ]
    },
    {
        id: 'P',
        label: 'Perforation Type',
        description: 'Perforation details',
        subcategories: [
            {
                id: 'P_measurement',
                label: 'Perforation Measurement',
                type: 'text',
                description: 'Enter the perforation measurement'
            },
            {
                id: 'P_type',
                label: 'Type',
                type: 'select',
                description: 'Select the perforation type',
                options: ['Comb', 'Line', 'Syncopated', 'Imperforate']
            }
        ]
    },
    {
        id: 'W',
        label: 'Watermark Type',
        description: 'Watermark characteristics',
        subcategories: [
            {
                id: 'W_type',
                label: 'Watermark Type',
                type: 'select',
                description: 'Select the type of watermark',
                options: ['Multiple NZ and Star', 'Multiple Crown CA', 'Multiple Script CA', 'None']
            }
        ]
    },
    {
        id: 'E',
        label: 'Error',
        description: 'Any errors or varieties',
        subcategories: [
            {
                id: 'E_type',
                label: 'Error Type',
                type: 'select',
                description: 'Select the type of error if present',
                options: ['Color Error', 'Perforation Error', 'Printing Error', 'None']
            },
            {
                id: 'E_description',
                label: 'Error Description',
                type: 'textarea',
                description: 'Describe the error in detail'
            }
        ]
    },
    {
        id: 'Grd',
        label: 'Grade',
        description: 'Condition grade',
        subcategories: [
            {
                id: 'Grd_condition',
                label: 'Condition Grade',
                type: 'select',
                description: 'Select the overall condition grade',
                options: ['Superb', 'Very Fine', 'Fine', 'Good', 'Fair', 'Poor']
            },
            {
                id: 'Grd_notes',
                label: 'Grading Notes',
                type: 'textarea',
                description: 'Additional notes about condition'
            }
        ]
    },
    {
        id: 'ColGp',
        label: 'Collector Group',
        description: 'Collector group classification',
        subcategories: [
            {
                id: 'ColGp_type',
                label: 'Group Type',
                type: 'select',
                description: 'Select the collector group classification',
                options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            }
        ]
    },
    {
        id: 'Can',
        label: 'Cancellation',
        description: 'Cancellation details',
        subcategories: [
            {
                id: 'Can_type',
                label: 'Cancellation Type',
                type: 'select',
                description: 'Select the type of cancellation mark',
                options: ['Circular Date Stamp', 'Barred Numeral', 'First Day', 'Machine Cancel']
            },
            {
                id: 'Can_condition',
                label: 'Condition',
                type: 'select',
                description: 'Select the condition of the cancellation',
                options: ['Light', 'Medium', 'Heavy']
            }
        ]
    },
    {
        id: 'Pl',
        label: 'Plating',
        description: 'Plating information',
        subcategories: [
            {
                id: 'Pl_position',
                label: 'Position',
                type: 'text',
                description: 'Enter the plating position'
            },
            {
                id: 'Pl_notes',
                label: 'Plating Notes',
                type: 'textarea',
                description: 'Additional notes about plating'
            }
        ]
    },
    {
        id: 'Rty',
        label: 'Rarity',
        description: 'Rarity assessment',
        subcategories: [
            {
                id: 'Rty_scale',
                label: 'Rarity Scale',
                type: 'select',
                description: 'Select the rarity level',
                options: ['Common', 'Scarce', 'Rare', 'Very Rare', 'Extremely Rare']
            }
        ]
    },
    {
        id: 'NtOStIm',
        label: 'Notes on Stamp Image',
        description: 'Additional notes about the stamp image',
        subcategories: [
            {
                id: 'NtOStIm_notes',
                label: 'Image Notes',
                type: 'textarea',
                description: 'Additional notes about the stamp image'
            }
        ]
    },
    {
        id: 'PuchPrc',
        label: 'Purchase Price',
        description: 'Purchase price information',
        subcategories: [
            {
                id: 'PuchPrc_amount',
                label: 'Amount',
                type: 'text',
                description: 'Enter the purchase amount'
            },
            {
                id: 'PuchPrc_currency',
                label: 'Currency',
                type: 'select',
                description: 'Select the currency of purchase',
                options: ['USD', 'GBP', 'EUR', 'NZD', 'AUD']
            }
        ]
    },
    {
        id: 'PuchDt',
        label: 'Purchase Date',
        description: 'When the stamp was purchased',
        subcategories: [
            {
                id: 'PuchDt_date',
                label: 'Date',
                type: 'date',
                description: 'Enter the purchase date'
            }
        ]
    },
    {
        id: 'Prtr',
        label: 'Printer',
        description: 'Printing company information',
        subcategories: [
            {
                id: 'Prtr_name',
                label: 'Printer Name',
                type: 'text',
                description: 'Enter the name of the printing company'
            },
            {
                id: 'Prtr_location',
                label: 'Print Location',
                type: 'text',
                description: 'Enter where the stamp was printed'
            }
        ]
    }
];

interface StampObservationManagerProps {
    selectedStamp: {
        id: string;
        image: string;
    };
    onSave?: (observations: any) => void;
    onCancel?: () => void;
}

// Add this helper function after the interfaces and before the component
function formatFieldId(id: string): string {
    return id.split('_').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

// Add this component for rendering preview items
function PreviewItem({ label, value }: { label: string; value: string | number }) {
    if (!value) return null;
    return (
        <div className="group py-3 px-4 hover:bg-muted/50 rounded-lg transition-colors">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
            <div className="text-sm">{value}</div>
        </div>
    );
}

// Add this component for preview sections
function PreviewSection({ title, items }: { title: string; items: Array<{ key: string; value: any }> }) {
    const hasValues = items.some(item => item.value);
    if (!hasValues) return null;

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold">{title}</h4>
                <div className="h-px flex-1 bg-border"></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {items.map(({ key, value }) => (
                    <PreviewItem key={key} label={formatFieldId(key)} value={value} />
                ))}
            </div>
        </div>
    );
}

// Add this component for the preview panel
function FormPreview({ data }: { data: Record<string, any> }) {
    const entries = Object.entries(data);
    if (entries.length === 0) {
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

    // Group entries by category
    const groupedEntries = entries.reduce((acc, [key, value]) => {
        const category = key.split('_')[0];
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ key, value });
        return acc;
    }, {} as Record<string, Array<{ key: string; value: any }>>);

    // Get category details for better organization
    const categoryDetails = categories.reduce((acc, cat) => {
        acc[cat.id] = {
            label: cat.label,
            order: categories.findIndex(c => c.id === cat.id)
        };
        return acc;
    }, {} as Record<string, { label: string; order: number }>);

    // Sort categories based on their original order
    const sortedCategories = Object.entries(groupedEntries).sort(([catA], [catB]) => {
        return (categoryDetails[catA]?.order ?? Infinity) - (categoryDetails[catB]?.order ?? Infinity);
    });

    return (
        <div className="space-y-8">
            {sortedCategories.map(([category, items]) => (
                <PreviewSection
                    key={category}
                    title={categoryDetails[category]?.label || category}
                    items={items}
                />
            ))}
        </div>
    );
}

export default function StampObservationManager({
    selectedStamp,
    onSave,
    onCancel
}: StampObservationManagerProps) {
    // Navigation state
    const [navigationPath, setNavigationPath] = useState<{
        category?: Category;
        subcategory?: SubCategory;
        subSubcategory?: SubSubCategory;
    }>({});

    // Form state
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [showPreview, setShowPreview] = useState(false);
    const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
    const [customFields, setCustomFields] = useState<Record<string, CustomSubCategory[]>>({});

    // Function to render form fields
    const renderField = (field: SubCategory | SubSubCategory) => {
        switch (field.type) {
            case 'select':
                return (
                    <Select
                        value={formData[field.id] || ''}
                        onValueChange={(value) => handleFieldChange(field.id, value)}
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
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.description}
                    />
                );
            case 'date':
                return (
                    <Input
                        type="date"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    />
                );
            default:
                return (
                    <Input
                        type="text"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.description}
                    />
                );
        }
    };

    // Navigation handlers
    const handleCategoryClick = (category: Category) => {
        setNavigationPath({ category });
    };

    const handleSubcategoryClick = (subcategory: SubCategory) => {
        setNavigationPath({ ...navigationPath, subcategory });
    };

    const handleSubSubcategoryClick = (subSubcategory: SubSubCategory) => {
        setNavigationPath({ ...navigationPath, subSubcategory });
    };

    const handleBack = () => {
        if (navigationPath.subSubcategory) {
            setNavigationPath({
                category: navigationPath.category,
                subcategory: navigationPath.subcategory
            });
        } else if (navigationPath.subcategory) {
            setNavigationPath({
                category: navigationPath.category
            });
        } else {
            setNavigationPath({});
        }
    };

    const handleHome = () => {
        setNavigationPath({});
    };

    // Check if a subcategory/subsubcategory should be shown based on showWhen condition
    const shouldShow = (item: SubCategory | SubSubCategory): boolean => {
        if (!item.showWhen) return true;

        const { field, value } = item.showWhen;
        return formData[field] === value;
    };

    // Handle form field changes
    const handleFieldChange = (id: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Function to add a new custom category
    const handleAddCategory = (newCategory: CustomCategory) => {
        if (navigationPath.category) {
            // Adding a subcategory to an existing category
            const updatedCategories = allCategories.map(cat => {
                if (cat.id === navigationPath.category!.id) {
                    return {
                        ...cat,
                        subcategories: [
                            ...cat.subcategories,
                            {
                                ...newCategory,
                                isCustom: true,
                                // Ensure subcategories array exists for new subcategory
                                subcategories: []
                            }
                        ]
                    };
                }
                return cat;
            });
            
            // If the current category is a custom category, update customCategories
            if (navigationPath.category.isCustom) {
                setCustomCategories(updatedCategories.filter(cat => cat.isCustom));
            } else {
                // If it's a built-in category, add the new subcategory to customFields
                const newSubcategory = {
                    ...newCategory,
                    isCustom: true,
                    subcategories: []
                };
                setCustomFields(prev => ({
                    ...prev,
                    [navigationPath.category!.id]: [
                        ...(prev[navigationPath.category!.id] || []),
                        newSubcategory
                    ]
                }));
            }
        } else {
            // Adding a root level category
            setCustomCategories(prev => [
                ...prev,
                {
                    ...newCategory,
                    isCustom: true,
                    subcategories: []
                }
            ]);
        }
    };

    // Function to add a new custom field to a category
    const handleAddField = (categoryId: string, newField: CustomSubCategory) => {
        if (navigationPath.subcategory) {
            // Adding a field to a subcategory
            const updatedCategories = allCategories.map(cat => {
                if (cat.id === navigationPath.category!.id) {
                    return {
                        ...cat,
                        subcategories: cat.subcategories.map(subcat => {
                            if (subcat.id === navigationPath.subcategory!.id) {
                                return {
                                    ...subcat,
                                    subcategories: [...(subcat.subcategories || []), { ...newField, isCustom: true }]
                                };
                            }
                            return subcat;
                        })
                    };
                }
                return cat;
            });
            setCustomCategories(updatedCategories.filter(cat => cat.isCustom));
        } else {
            // Adding a field directly to a category
            setCustomFields(prev => ({
                ...prev,
                [categoryId]: [...(prev[categoryId] || []), { ...newField, isCustom: true }]
            }));
        }
    };

    // Combine built-in and custom categories
    const allCategories = [...categories, ...customCategories];

    // Function to get all fields for a category
    const getCategoryFields = (categoryId: string) => {
        const category = allCategories.find(c => c.id === categoryId);
        const builtInFields = category?.subcategories || [];
        const customFieldsForCategory = customFields[categoryId] || [];
        return [...builtInFields, ...customFieldsForCategory];
    };

    // Render breadcrumb navigation
    const renderBreadcrumbs = () => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8"
                onClick={handleHome}
            >
                <Home className="h-4 w-4" />
            </Button>
            {navigationPath.category && (
                <>
                    <ChevronRight className="h-4 w-4" />
                    <span>{navigationPath.category.label}</span>
                </>
            )}
            {navigationPath.subcategory && (
                <>
                    <ChevronRight className="h-4 w-4" />
                    <span>{navigationPath.subcategory.label}</span>
                </>
            )}
            {navigationPath.subSubcategory && (
                <>
                    <ChevronRight className="h-4 w-4" />
                    <span>{navigationPath.subSubcategory.label}</span>
                </>
            )}
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
            subcategories: [] as SubCategory[]
        });

        const handleSubmit = () => {
            if (newItem.label && newItem.id) {
                if (type === 'category') {
                    // When adding a category/subcategory, don't include the type field
                    const { type: _, ...categoryData } = newItem;
                    handleAddCategory({
                        ...categoryData,
                        isCustom: true,
                        subcategories: []
                    });
                } else {
                    // When adding a field, include the type field
                    handleAddField(categoryId!, {
                        ...newItem,
                        isCustom: true
                    });
                }
            }
        };

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
                                className="flex gap-4"
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

    // Modify the renderContent function
    const renderContent = () => {
        if (!navigationPath.category) {
            return (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allCategories.map((category) => (
                        <Button
                            key={category.id}
                            variant="outline"
                            className="h-auto w-full py-4 px-6 text-left flex flex-col items-start overflow-hidden"
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

        if (navigationPath.category && !navigationPath.subcategory) {
            const fields = getCategoryFields(navigationPath.category.id);
            const visibleFields = fields.filter(shouldShow);

            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {visibleFields.map((subcat) => (
                            <Button
                                key={subcat.id}
                                variant="outline"
                                className="h-auto w-full py-4 px-6 text-left flex flex-col items-start overflow-hidden"
                                onClick={() => handleSubcategoryClick(subcat)}
                            >
                                <span className="font-medium truncate w-full">{subcat.label}</span>
                                {subcat.description && (
                                    <span className="text-sm text-muted-foreground mt-1 line-clamp-2 w-full">
                                        {subcat.description}
                                    </span>
                                )}
                            </Button>
                        ))}
                        <AddDialog categoryId={navigationPath.category.id} />
                    </div>
                </div>
            );
        }

        if (navigationPath.subcategory) {
            // Handle both custom and built-in subcategories
            if (navigationPath.subcategory.type) {
                // If it's a field type subcategory, render the field input
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">{navigationPath.subcategory.label}</h3>
                        <p className="text-sm text-muted-foreground">{navigationPath.subcategory.description}</p>
                        {renderField(navigationPath.subcategory)}
                    </div>
                );
            }

            // Get subcategories and fields for the current subcategory
            const subcategoryFields = navigationPath.subcategory.subcategories || [];
            const customSubcategoryFields = customFields[navigationPath.subcategory.id] || [];
            const allSubcategoryFields = [...subcategoryFields, ...customSubcategoryFields];
            const visibleFields = allSubcategoryFields.filter(shouldShow);

            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {visibleFields.map((field) => (
                            <Button
                                key={field.id}
                                variant="outline"
                                className="h-auto w-full py-4 px-6 text-left flex flex-col items-start overflow-hidden"
                                onClick={() => handleSubSubcategoryClick(field)}
                            >
                                <span className="font-medium truncate w-full">{field.label}</span>
                                {field.description && (
                                    <span className="text-sm text-muted-foreground mt-1 line-clamp-2 w-full">
                                        {field.description}
                                    </span>
                                )}
                            </Button>
                        ))}
                        <AddDialog categoryId={navigationPath.subcategory.id} />
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex flex-col min-h-screen max-w-[1200px] mx-auto">
            <div className="px-4 py-6">
                {/* Header with Save/Cancel */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Stamp Details</h2>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button onClick={() => onSave?.(formData)}>
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Stamp Images Section */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Left Side - Cropped Stamp */}
                    <div className="border rounded-lg p-4">
                        <div className="text-sm font-medium mb-2">Image ID Number</div>
                        <div className="aspect-square relative border rounded-lg overflow-hidden bg-gray-50 mb-4">
                            <Image
                                src={selectedStamp.image}
                                alt="Cropped stamp"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Zoom In</Button>
                            <Button variant="outline" size="sm">Zoom Out</Button>
                        </div>
                    </div>

                    {/* Right Side - Exhibition Page */}
                    <div className="border rounded-lg p-4">
                        <div className="text-sm font-medium mb-2">Exhibition Page</div>
                        <div className="aspect-square relative border rounded-lg overflow-hidden bg-gray-50 mb-4">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                Scan/photo Exhibition Page
                                (Ideal Album Page)
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Zoom In</Button>
                            <Button variant="outline" size="sm">Zoom Out</Button>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="details">
                    <TabsList className="w-full">
                        <TabsTrigger value="details" className="flex items-center gap-2 w-1/2">
                            <Edit className="h-4 w-4" />
                            Edit
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex items-center gap-2 w-1/2">
                            <Eye className="h-4 w-4" />
                            Preview
                        </TabsTrigger>
                    </TabsList>

                    {/* Navigation Header with Tabs */}
                    <TabsContent value="details">
                        <div className="flex items-center justify-between py-4 bg-white border-b mb-6">
                            <div className="flex items-center gap-2">
                                {renderBreadcrumbs()}
                            </div>

                            {/* Back button - only show when we're in a category */}
                            {navigationPath.category && (
                                <Button 
                                    variant="outline" 
                                    onClick={handleBack}
                                    className="gap-2"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Back to {navigationPath.subcategory ? navigationPath.category.label : 'Categories'}
                                </Button>
                            )}
                        </div>

                        {/* Form Content */}
                        <Card className="p-6 mb-6">
                            {renderContent()}
                        </Card>
                    </TabsContent>

                    <TabsContent value="preview">
                        <Card className="border-2 mt-4">
                            <div className="p-4 border-b bg-muted/50">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">Details Preview</h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <FormPreview data={formData} />
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
} 