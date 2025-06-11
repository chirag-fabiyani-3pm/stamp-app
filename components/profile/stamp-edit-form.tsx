"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, ChevronLeft, Home, Edit, Eye, X, Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserData } from "@/lib/api/auth"

// Define types locally since they're not properly exported from stamp-observation-manager
interface CategoryField {
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

interface Category extends CategoryField {
    children?: Category[];
}

interface NavigationPathItem {
    id: string;
    label: string;
    category: Category;
}

// Updated comprehensive categories structure that matches StampDetailsJson, ordered by Stamp Code formula
const categories: Category[] = [
    {
        id: 'primarydetails',
        label: 'Primary Details',
        description: 'Required core information for every stamp (Country, Issue Date, Denomination, Ownership Status, Purchase Price, Purchase Date and Notes)',
        children: [
            {
                id: 'country',
                label: 'Country',
                description: 'Country that issued the stamp (ISO-3166 code or full name).',
                type: 'select',
                options: [
                    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
                    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Bolivia',
                    'Brazil', 'Bulgaria', 'Cambodia', 'Cameroon', 'Canada', 'Chad', 'Chile', 'China', 'Colombia',
                    'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Ecuador', 'Egypt',
                    'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Germany', 'Ghana', 'Greece', 'Guatemala',
                    'Hungary', 'Iceland', 'India', 'Indonesia', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
                    'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Libya', 'Lithuania', 'Luxembourg',
                    'Malaysia', 'Malta', 'Mexico', 'Monaco', 'Mongolia', 'Morocco', 'Myanmar', 'Nepal', 'Netherlands',
                    'New Zealand', 'Nicaragua', 'Nigeria', 'Norway', 'Pakistan', 'Panama', 'Peru', 'Philippines',
                    'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Serbia', 'Singapore',
                    'Slovakia', 'Slovenia', 'South Africa', 'Spain', 'Sri Lanka', 'Sudan', 'Sweden', 'Switzerland',
                    'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
                    'Uruguay', 'Venezuela', 'Vietnam', 'Other'
                ],
                defaultValue: 'New Zealand'
            },
            {
                id: 'issuedate',
                label: 'Issue Date',
                description: 'Official date when this stamp was issued (DD/MM/YYYY).',
                type: 'date',
                defaultValue: new Date().toISOString().split('T')[0]
            },
            {
                id: 'denomination',
                label: 'Denomination',
                description: 'Face value of the stamp, split into components.',
                children: [
                    {
                        id: 'denominationcurrency',
                        label: 'Denomination Currency',
                        description: 'Currency name (e.g., Dollar, Rupee, Franc)',
                        type: 'select',
                        options: ['Dollar', 'Cent', 'Rupee', 'Paise', 'Pound', 'Shilling', 'Penny', 'Pence', 'Euro', 'Franc', 'Mark', 'Kopek', 'Yen', 'Won', 'Lira', 'Other']
                    },
                    {
                        id: 'denominationvalue',
                        label: 'Denomination Value',
                        description: 'Numerical denomination value (e.g., 1, 2.50, 10)',
                        type: 'text'
                    },
                    {
                        id: 'denominationsymbol',
                        label: 'Denomination Symbol',
                        description: 'Symbol representing the denomination (e.g., $, ₹, £, ¢, €)',
                        type: 'select',
                        options: ['$', '¢', '₹', '₨', '£', 's', 'd', 'p', '€', 'Fr', 'Kč', '₩', '¥', '₺', 'Other']
                    }
                ]
            },
            {
                id: 'ownershipstatus',
                label: 'Ownership Status',
                description: 'Is this stamp owned, on loan, or for sale?',
                type: 'select',
                options: ['Owned', 'On Loan', 'For Sale', 'Unknown']
            },
            {
                id: 'purchaseprice',
                label: 'Purchase Price',
                description: 'Purchase price and currency',
                type: 'text'
            },
            {
                id: 'purchasedate',
                label: 'Purchase Date',
                description: 'When the stamp was purchased',
                type: 'date'
            },
            {
                id: 'notes',
                label: 'Additional Notes',
                description: 'Any additional observations or notes',
                type: 'textarea'
            }
        ]
    },
    {
        id: 'colors',
        label: 'Colors',
        description: 'Pivotal attribute in philately, influencing value and identification',
        children: [
            {
                id: 'colortype',
                label: 'Color Type',
                description: 'Primary color classification',
                type: 'select',
                options: ['red', 'Red Carmine', 'Orange', 'Purple', 'Violet', 'Mauve', 'Blue', 'Black', 'Green', 'Brown', 'Yellow', 'Multiple Colours', 'Pictorial / pictures etc.'],
                defaultValue: 'red'
            },
            {
                id: 'singlecolor',
                label: 'Single Color',
                description: 'Single‐color stamps',
                children: [
                    {
                        id: 'purple',
                        label: 'Purple',
                        children: [
                            {
                                id: 'purpleshade',
                                label: 'Purple Shade',
                                description: 'Specific purple shade',
                                type: 'select',
                                options: ['Reddish Purple (R.Pur)', 'Slate Purple (Pur,slt)', 'Lilac (Pur,li)', 'Violet (Pur,vi)', 'Mauve (Pur,mve)']
                            }
                        ]
                    },
                    {
                        id: 'brown',
                        label: 'Brown',
                        children: [
                            {
                                id: 'brownshade',
                                label: 'Brown Shade',
                                description: 'Specific brown shade',
                                type: 'select',
                                options: ['Purple Brown (Br.pur)', 'Sepia Brown (Br.sep)', 'Red Brown (Br.r)', 'Chocolate Brown (Br.cho)']
                            }
                        ]
                    },
                    {
                        id: 'red',
                        label: 'Red',
                        children: [
                            {
                                id: 'redshade',
                                label: 'Red Shade',
                                description: 'Specific red shade',
                                type: 'select',
                                options: ['Deep Red (R.dp)', 'Bright Red (R.bgt)', 'Orange (R.or)', 'Rose (R.rs)', 'Carmine (R.car)']
                            }
                        ]
                    },
                    {
                        id: 'blue',
                        label: 'Blue',
                        children: [
                            {
                                id: 'blueshade',
                                label: 'Blue Shade',
                                description: 'Specific blue shade',
                                type: 'select',
                                options: ['Indigo (Blu.in)', 'Royal Blue (Blu.roy)', 'Ultramarine (Blu.ult)', 'Deep Turquoise (Blu.tur.dp)']
                            }
                        ]
                    },
                    {
                        id: 'green',
                        label: 'Green',
                        children: [
                            {
                                id: 'greenshade',
                                label: 'Green Shade',
                                description: 'Specific green shade',
                                type: 'select',
                                options: ['Sage (Gr.sag)', 'Emerald (Gr.em)', 'Olive (Gr.ol)']
                            }
                        ]
                    },
                    {
                        id: 'black',
                        label: 'Black',
                        children: [
                            {
                                id: 'blackshade',
                                label: 'Black Shade',
                                description: 'Specific black shade',
                                type: 'select',
                                options: ['Grey Black (Blk.gry)', 'Pure Black (Bla)']
                            }
                        ]
                    },
                    {
                        id: 'grey',
                        label: 'Grey',
                        children: [
                            {
                                id: 'greyshade',
                                label: 'Grey Shade',
                                description: 'Specific grey shade',
                                type: 'select',
                                options: ['Brownish Grey (Gry.br)', 'Light Grey (Gry.lt)', 'Dark Grey (Gry.dk)']
                            }
                        ]
                    },
                    {
                        id: 'yellow',
                        label: 'Yellow',
                        children: [
                            {
                                id: 'yellowshade',
                                label: 'Yellow Shade',
                                description: 'Specific yellow shade',
                                type: 'select',
                                options: ['Pale Yellow (Yel.pal)', 'Bright Yellow (Yel.bgt)', 'Golden Yellow (Yel.gld)']
                            }
                        ]
                    }
                ]
            },
            {
                id: 'multiplecolors',
                label: 'Multiple Colors',
                description: 'Multiple colors as part of the design',
                showWhen: { field: 'colortype', value: 'Multiple Colours' },
                children: [
                    {
                        id: 'primarycolor',
                        label: 'Most Prevalent Color',
                        description: 'The most dominant color in the design',
                        type: 'select',
                        options: ['Purple', 'Brown', 'Red', 'Blue', 'Green', 'Black', 'Grey', 'Yellow']
                    },
                    {
                        id: 'secondarycolors',
                        label: 'Other Colors Present',
                        description: 'Additional colors in the design (comma-separated)',
                        type: 'text'
                    },
                    {
                        id: 'colorcount',
                        label: 'Number of Colors',
                        description: 'Total number of distinct colors',
                        type: 'select',
                        options: ['2 colors', '3 colors', '4 colors', '5+ colors']
                    }
                ]
            },
            {
                id: 'pictorial',
                label: 'Pictorial',
                description: 'A photograph or picture for the design',
                showWhen: { field: 'colortype', value: 'Pictorial / pictures etc.' },
                children: [
                    {
                        id: 'pictorialtype',
                        label: 'Pictorial Type',
                        description: 'Type of pictorial design',
                        type: 'select',
                        options: ['Photograph', 'Artwork/Painting', 'Drawing/Illustration', 'Mixed Media']
                    },
                    {
                        id: 'dominantcolors',
                        label: 'Dominant Colors',
                        description: 'Main colors visible in the pictorial design',
                        type: 'text'
                    }
                ]
            }
        ]
    },
    {
        id: 'ittyp',
        label: 'Item Type',
        description: 'The fundamental classification for any philatelic object',
        children: [
            {
                id: 'ittypsel',
                label: 'Item Type Selection',
                description: 'Type of collectible item',
                type: 'select',
                options: ['Stamp', 'On Piece (OnP)', 'On Card (OnCrd)', 'On Envelope (OnEnv)', 'On Newspaper (OnNew)', 'Add Another Type'],
                defaultValue: 'Stamp'
            }
        ]
    },
    {
        id: 'paperchar',
        label: 'Paper Characteristics',
        description: 'Define the material composition, texture, and orientation of the paper',
        children: [
            {
                id: 'papertypes',
                label: 'Paper Types',
                children: [
                    {
                        id: 'papertype',
                        label: 'Paper Type',
                        description: 'Type of paper used',
                        type: 'select',
                        options: ['White Paper (P.wh)', 'Toned Paper (P.ton)', 'Chalk-Surfaced Paper (P.clk)', 'Prelure Paper (P.prel)', 'Fluorescent Paper (P.flo)', 'Self-Adhesive Paper (P.slf)', 'Phosphorised Paper (P.phs)', 'Gum Arabic Paper (P.arb.gmd)', 'PVA Gum Paper (P.alch)']
                    }
                ]
            }
        ]
    },
    {
        id: 'printchar',
        label: 'Printing Characteristics',
        description: 'Methods and processes employed to apply the design onto the stamp paper',
        children: [
            {
                id: 'printmethods',
                label: 'Printing Types/Methods',
                children: [
                    {
                        id: 'printmethod',
                        label: 'Printing Method',
                        description: 'Primary printing technique used',
                        type: 'select',
                        options: ['Recess Printing (Prnt.rec)', 'Intaglio (Prnt.rec.int)', 'Line-Engraved (Prnt.rec.len)', 'Typography/Letterpress (Prnt.typ)', 'Lithography/Offset (Prnt.lth)', 'Gravure/Photogravure (Prnt.grv)', 'Flexography (Prnt.flx)', 'Screen Printing (Prnt.scr)', 'Héliogravure (Prnt.hel)']
                    }
                ]
            }
        ]
    },
    {
        id: 'wmkchar',
        label: 'Watermark Characteristics',
        description: 'Deliberate, semi-translucent patterns embedded in paper',
        children: [
            {
                id: 'watermarkpresence',
                label: 'Watermark Presence',
                description: 'Does the stamp have a watermark?',
                type: 'select',
                options: ['Yes - Watermark Present', 'No - No Watermark', 'Unknown/Uncertain'],
                defaultValue: 'No - No Watermark'
            }
        ]
    },
    {
        id: 'perfsep',
        label: 'Perforation and Separation',
        description: 'Methods by which individual stamps are detached from a larger sheet',
        children: [
            {
                id: 'perftypes',
                label: 'Perforation/Separation Types',
                children: [
                    {
                        id: 'perftype',
                        label: 'Perforation Type',
                        description: 'Type of perforation or separation',
                        type: 'select',
                        options: ['Line Perforation (Per.l)', 'Comb Perforation (Per.cmb)', 'Harrow Perforation (Per.h)', 'Rouletting (Per.rlt)', 'Elliptical Perforation (Per,el.)', 'Part-Perforated (Per.rlt,srp.)', 'Syncopated Perforation (Per.rlt,syn.)', 'Imperforate (Per.imp)', 'Self-Adhesive Die-Cut (Per.di.ct)']
                    }
                ]
            }
        ]
    },
    {
        id: 'overprints',
        label: 'Overprints',
        description: 'Printed visual expressions stamped onto the front face of a stamp after its original production',
        children: [
            {
                id: 'overprintpresence',
                label: 'Overprint Presence',
                description: 'Does this stamp have any overprints?',
                type: 'select',
                options: ['No Overprints', 'Yes - Has Overprints', 'Uncertain'],
                defaultValue: 'No Overprints'
            }
        ]
    },
    {
        id: 'errorsvar',
        label: 'Errors and Varieties',
        description: 'Deviations from the intended design or production process',
        children: [
            {
                id: 'errorpresence',
                label: 'Error Presence',
                description: 'Does this stamp have any errors or varieties?',
                type: 'select',
                options: ['No Errors - Normal Stamp', 'Yes - Has Errors/Varieties', 'Uncertain/Needs Expert Review'],
                defaultValue: 'No Errors - Normal Stamp'
            }
        ]
    },
    {
        id: 'knownrarity',
        label: 'Known Rarity Ratings',
        description: 'Select a known rarity rating (as per standard philatelic scales)',
        children: [
            {
                id: 'rarityrating',
                label: 'Rarity Rating',
                description: 'Known rarity rating for this item',
                type: 'select',
                options: ['Superb', 'Very Fine', 'Fine', 'Good', 'Average', 'Poor']
            }
        ]
    }
];

export interface StampEditFormProps {
    stamp: {
        id: string
        stampCode: string
        status: number
        userId: string
        stampCatalogId: string | null
        name: string
        publisher: string
        country: string
        stampImageUrl: string
        catalogName: string | null
        catalogNumber: string
        seriesName: string
        issueDate: string
        issueYear: number | null
        denominationValue: number
        denominationCurrency: string
        denominationSymbol: string
        color: string
        paperType: string | null
        stampDetailsJson: string
        estimatedMarketValue: number | null
        actualPrice: number | null
    }
    onClose: () => void
    onSave: (updatedStamp: any) => void
}


// Helper functions (same as StampObservationManager)
function formatFieldId(id: string): string {
    const camelCaseSplit = id.replace(/([A-Z])/g, ' $1')
    const words = camelCaseSplit.split(/[\s_-]+/)
    return words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim()
}

function findCategoryInTree(id: string, categories: Category[]): Category | null {
    for (const category of categories) {
        if (category.id.toLowerCase() === id.toLowerCase()) {
            return category
        }
        if (category.children && category.children.length > 0) {
            const foundInChildren = findCategoryInTree(id, category.children)
            if (foundInChildren) {
                return foundInChildren
            }
        }
    }
    return null
}

function findCategoryLabel(id: string, categories: Category[]): string {
    const foundCategory = findCategoryInTree(id, categories)
    if (foundCategory?.label) return foundCategory?.label
    return formatFieldId(id)
}

function initializeFormDataFromCategories(categories: Category[]): Record<string, any> {
    return categories.reduce((acc, category) => {
        if (category.type) {
            acc[category.id.toLowerCase()] = category.defaultValue || ''
        } else {
            const childData = category.children ? initializeFormDataFromCategories(category.children) : {}
            if (Object.keys(childData).length > 0) {
                acc[category.id.toLowerCase()] = childData
            }
        }
        return acc
    }, {} as Record<string, any>)
}

// Helper function to get JWT token (same as StampObservationManager)
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

// Helper function to get user ID (same as StampObservationManager)
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

// Function to transform form data to API format (same as StampObservationManager)
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

// Preview components
function EditablePreviewItem({ 
    label, 
    value, 
    path, 
    onUpdate,
    categories,
    field
}: { 
    label: string
    value: any
    path: string[]
    onUpdate: (path: string[], value: string) => void
    categories: Category[]
    field?: Category
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [currentValue, setCurrentValue] = useState(String(value))

    const handleEdit = () => {
        setIsEditing(true)
        setCurrentValue(String(value))
    }

    const handleSave = (newValue: string) => {
        onUpdate(path, newValue)
        setIsEditing(false)
    }

    const handleBlur = () => {
        handleSave(currentValue)
    }

    if (!field?.type) return null

    return (
        <div className="group p-2 sm:p-3 hover:bg-muted/50 rounded-lg border transition-colors relative">
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={handleEdit}
                >
                    <Edit className="h-3 w-3" />
                </Button>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                {findCategoryLabel(label, categories)}
            </div>
            {isEditing ? (
                <div className="pt-1">
                    {field.type === 'select' ? (
                        <Select
                            value={currentValue}
                            onValueChange={handleSave}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option: string) => (
                                    <SelectItem key={option} value={option} className="text-xs">
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : field.type === 'textarea' ? (
                        <textarea
                            className="w-full min-h-[60px] p-2 border rounded text-xs"
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            onBlur={handleBlur}
                            placeholder={field.description}
                            autoFocus
                        />
                    ) : (
                        <Input
                            type={field.type === 'date' ? 'date' : 'text'}
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            onBlur={handleBlur}
                            placeholder={field.description}
                            className="h-8 text-xs"
                            autoFocus
                        />
                    )}
                </div>
            ) : (
                <div className="text-xs font-medium">{value || 'Click to edit'}</div>
            )}
        </div>
    )
}

function PreviewItem({ 
    label, 
    value, 
    level = 0, 
    categories,
    path = [],
    onUpdate
}: { 
    label: string
    value: any
    level?: number
    categories: Category[]
    path?: string[]
    onUpdate?: (path: string[], value: string) => void
}) {
    const currentField = findCategoryInTree(label, categories)

    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const entries = Object.entries(value)
        if (entries.length === 0) return null

        const nonPreviewItems: Array<{ key: string; value: any }> = []
        const previewItems: Array<{ key: string; value: any }> = []

        for(const [key, val] of entries) {
            if(val && typeof val === 'object' && !Array.isArray(val)) {
                previewItems.push({ key, value: val })
            } else {
                nonPreviewItems.push({ key, value: val })
            }
        }

        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold">{findCategoryLabel(label, categories)}</h4>
                    <div className="h-px flex-1 bg-border"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" style={{ marginLeft: `${level > 0 ? (level + 1) * 8 : 0}px` }}>
                    {nonPreviewItems.map(({ key, value }) => (
                        <div key={key} className="space-y-1">
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
                                <div className="group p-2 sm:p-3 hover:bg-muted/50 rounded-lg border transition-colors">
                                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                                        {findCategoryLabel(key, categories)}
                                    </div>
                                    <div className="text-xs font-medium">{String(value)}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-2" style={{ marginLeft: `${level > 0 ? (level + 1) * 8 : 0}px` }}>
                    {previewItems.map(({ key, value }) => (
                        <div key={key} className="space-y-1">
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
        )
    }

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
        <div className="group p-2 sm:p-3 hover:bg-muted/50 rounded-lg border transition-colors">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                {findCategoryLabel(label, categories)}
            </div>
            <div className="text-xs font-medium">{String(value)}</div>
        </div>
    )
}

function FormPreview({ data, categories, onUpdate }: { 
    data: Record<string, any>
    categories: Category[]
    onUpdate?: (path: NavigationPathItem[], value: string) => void
}) {
    if (Object.keys(data).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
                <div className="rounded-full bg-muted p-3 mb-3">
                    <Edit className="h-6 w-6" />
                </div>
                <div className="text-base font-medium mb-1">No details added yet</div>
                <div className="text-xs">Fill in the form to see the preview here</div>
            </div>
        )
    }

    const categoryDetails = categories.reduce((acc, cat) => {
        acc[cat.id.toLowerCase()] = {
            label: cat.label,
            order: categories.findIndex(c => c.id === cat.id)
        }
        return acc
    }, {} as Record<string, { label: string; order: number }>)

    const sortedEntries = Object.entries(data).sort(([keyA], [keyB]) => {
        const orderA = categoryDetails[keyA.toLowerCase()]?.order ?? Infinity
        const orderB = categoryDetails[keyB.toLowerCase()]?.order ?? Infinity
        return orderA - orderB
    })

    const handleUpdate = onUpdate ? (path: string[], value: string) => {
        const navigationPath: NavigationPathItem[] = path.map(id => {
            const category = findCategoryInTree(id, categories)
            return {
                id,
                label: category?.label || formatFieldId(id),
                category: category || { id, label: formatFieldId(id) }
            }
        })
        onUpdate(navigationPath, value)
    } : undefined

    return (
        <div className="space-y-4">
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
    )
}

export default function StampEditForm({ stamp, onClose, onSave }: StampEditFormProps) {
    const [navigationPath, setNavigationPath] = useState<NavigationPathItem[]>([])
    const [isSaving, setIsSaving] = useState(false)
    
    // Image zoom and pan state
    const [imageZoom, setImageZoom] = useState(1)
    const [imagePan, setImagePan] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [dragStartPan, setDragStartPan] = useState({ x: 0, y: 0 })
    
    // Ref for image container
    const imageContainerRef = useRef<HTMLDivElement>(null)
    
    // Parse existing stamp details and initialize form data
    const [formData, setFormData] = useState<Record<string, any>>(() => {
        const defaultData = initializeFormDataFromCategories(categories)
        
        // Parse existing stampDetails JSON if available
        if (stamp.stampDetailsJson) {
            try {
                const existingDetails = JSON.parse(stamp.stampDetailsJson)
                // Convert the existing API format back to form structure
                // This is a simplified conversion - you might need to enhance this
                const parsedData = { ...defaultData }
                
                const extractValueFromDetails = (details: any, targetKey: string): string => {
                    if (Array.isArray(details)) {
                        for (const item of details) {
                            const result = extractValueFromDetails(item, targetKey)
                            if (result) return result
                        }
                    } else if (typeof details === 'object' && details !== null) {
                        if (details.key === targetKey && details.value) {
                            return details.value
                        }
                        if (details.children) {
                            const result = extractValueFromDetails(details.children, targetKey)
                            if (result) return result
                        }
                        for (const value of Object.values(details)) {
                            const result = extractValueFromDetails(value, targetKey)
                            if (result) return result
                        }
                    }
                    return ""
                }

                // Extract common fields
                if (parsedData.primarydetails) {
                    parsedData.primarydetails.country = extractValueFromDetails(existingDetails, "country") || parsedData.primarydetails.country
                    parsedData.primarydetails.issuedate = extractValueFromDetails(existingDetails, "issuedate") || parsedData.primarydetails.issuedate
                    parsedData.primarydetails.denomination.denominationvalue = extractValueFromDetails(existingDetails, "denominationvalue") || parsedData.primarydetails.denomination.denominationvalue
                    parsedData.primarydetails.denomination.denominationsymbol = extractValueFromDetails(existingDetails, "denominationsymbol") || parsedData.primarydetails.denomination.denominationsymbol
                    parsedData.primarydetails.ownershipstatus = extractValueFromDetails(existingDetails, "ownershipstatus") || parsedData.primarydetails.ownershipstatus
                    parsedData.primarydetails.purchaseprice = extractValueFromDetails(existingDetails, "purchaseprice") || parsedData.primarydetails.purchaseprice
                    parsedData.primarydetails.purchasedate = extractValueFromDetails(existingDetails, "purchasedate") || parsedData.primarydetails.purchasedate
                    parsedData.primarydetails.notes = extractValueFromDetails(existingDetails, "notes") || parsedData.primarydetails.notes
                }

                return parsedData
            } catch (error) {
                console.error('Error parsing stamp details:', error)
                return defaultData
            }
        }
        
        return defaultData
    })

    // Zoom handlers
    const handleZoomIn = () => {
        setImageZoom(prev => Math.min(prev + 0.25, 3))
    }

    const handleZoomOut = () => {
        setImageZoom(prev => {
            const newZoom = Math.max(prev - 0.25, 0.5)
            // Reset pan when zooming out to 1x or less
            if (newZoom <= 1) {
                setImagePan({ x: 0, y: 0 })
            }
            return newZoom
        })
    }

    const resetImagePan = () => {
        setImagePan({ x: 0, y: 0 })
    }

    const resetImageView = () => {
        setImageZoom(1)
        setImagePan({ x: 0, y: 0 })
    }

    // Function to constrain pan values to current zoom bounds
    const constrainPan = (pan: { x: number; y: number }, zoom: number) => {
        if (zoom <= 1) return { x: 0, y: 0 }
        
        const maxPan = calculatePanBounds(zoom)
        return {
            x: Math.max(-maxPan, Math.min(maxPan, pan.x)),
            y: Math.max(-maxPan, Math.min(maxPan, pan.y))
        }
    }

    const calculatePanBounds = (zoom: number) => {
        if (!imageContainerRef.current) return 100
        
        const containerRect = imageContainerRef.current.getBoundingClientRect()
        const imageSize = Math.min(containerRect.width, containerRect.height)
        const scaledSize = imageSize * zoom
        const overflow = (scaledSize - imageSize) / 2
        
        return Math.max(0, overflow)
    }

    // Mouse and touch event handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (imageZoom <= 1) return
        
        setIsDragging(true)
        setDragStart({ x: e.clientX, y: e.clientY })
        setDragStartPan({ ...imagePan })
        e.preventDefault()
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        if (imageZoom <= 1 || e.touches.length !== 1) return
        
        const touch = e.touches[0]
        setIsDragging(true)
        setDragStart({ x: touch.clientX, y: touch.clientY })
        setDragStartPan({ ...imagePan })
        e.preventDefault()
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || imageZoom <= 1) return

        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y
        
        const newPan = {
            x: dragStartPan.x + deltaX,
            y: dragStartPan.y + deltaY
        }
        
        setImagePan(constrainPan(newPan, imageZoom))
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || imageZoom <= 1 || e.touches.length !== 1) return

        const touch = e.touches[0]
        const deltaX = touch.clientX - dragStart.x
        const deltaY = touch.clientY - dragStart.y
        
        const newPan = {
            x: dragStartPan.x + deltaX,
            y: dragStartPan.y + deltaY
        }
        
        setImagePan(constrainPan(newPan, imageZoom))
        e.preventDefault()
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleTouchEnd = () => {
        setIsDragging(false)
    }

    // Global event listeners for mouse/touch events
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging || imageZoom <= 1) return

            const deltaX = e.clientX - dragStart.x
            const deltaY = e.clientY - dragStart.y
            
            const newPan = {
                x: dragStartPan.x + deltaX,
                y: dragStartPan.y + deltaY
            }
            
            setImagePan(constrainPan(newPan, imageZoom))
        }

        const handleGlobalTouchMove = (e: TouchEvent) => {
            if (!isDragging || imageZoom <= 1 || e.touches.length !== 1) return

            const touch = e.touches[0]
            const deltaX = touch.clientX - dragStart.x
            const deltaY = touch.clientY - dragStart.y
            
            const newPan = {
                x: dragStartPan.x + deltaX,
                y: dragStartPan.y + deltaY
            }
            
            setImagePan(constrainPan(newPan, imageZoom))
            e.preventDefault()
        }

        const handleGlobalMouseUp = () => {
            setIsDragging(false)
        }

        const handleGlobalTouchEnd = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove)
            document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
            document.addEventListener('mouseup', handleGlobalMouseUp)
            document.addEventListener('touchend', handleGlobalTouchEnd)
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove)
            document.removeEventListener('touchmove', handleGlobalTouchMove)
            document.removeEventListener('mouseup', handleGlobalMouseUp)
            document.removeEventListener('touchend', handleGlobalTouchEnd)
        }
    }, [isDragging, dragStart, dragStartPan, imageZoom])

    // Handle form field changes
    const handleFieldChange = (path: NavigationPathItem[], value: string) => {
        let newFormData = { ...formData }
        let current = newFormData

        for (let i = 0; i < path.length - 1; i++) {
            const categoryId = path[i].id.toLowerCase()
            if (!current[categoryId]) {
                current[categoryId] = {}
            }
            current = current[categoryId]
        }

        const finalId = path[path.length - 1].id.toLowerCase()
        current[finalId] = value

        setFormData(newFormData)
    }

    // Handle save
    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Get required data (same as saveStampToAPI)
            const jwt = getJWT();
            const userId = getUserId();
            
            if (!jwt) {
                throw new Error('No JWT token found. Please login first.');
            }
            
            if (!userId) {
                throw new Error('No user ID found. Please login first.');
            }

            // Transform form data to API format (same as saveStampToAPI)
            const stampDetailsJson = transformFormDataToApiFormat(formData, categories);
            
            // Create FormData for multipart/form-data (same as saveStampToAPI)
            const apiFormData = new FormData();
            
            // Add all required fields according to new API specification
            apiFormData.append('UserId', userId);
            apiFormData.append('StampCatalogId', stamp.stampCatalogId || '');
            apiFormData.append('StampCode', stamp.stampCode || '');
            apiFormData.append('Name', stamp.name || '');
            apiFormData.append('Publisher', stamp.publisher || '');
            apiFormData.append('Country', stamp.country || '');
            apiFormData.append('CatalogName', stamp.catalogName || '');
            apiFormData.append('CatalogNumber', stamp.catalogNumber || '');
            apiFormData.append('SeriesName', stamp.seriesName || '');
            apiFormData.append('IssueDate', stamp.issueDate || '');
            apiFormData.append('IssueYear', stamp.issueYear?.toString() || '');
            apiFormData.append('DenominationValue', stamp.denominationValue?.toString() || '');
            apiFormData.append('DenominationCurrency', stamp.denominationCurrency || '');
            apiFormData.append('DenominationSymbol', stamp.denominationSymbol || '');
            apiFormData.append('Color', stamp.color || '');
            apiFormData.append('PaperType', stamp.paperType || '');
            apiFormData.append('StampDetailsJson', JSON.stringify(stampDetailsJson));
            apiFormData.append('EstimatedMarketValue', stamp.estimatedMarketValue?.toString() || '');
            apiFormData.append('ActualPrice', stamp.actualPrice?.toString() || '');
            
            // Add title
            const title = stamp.name || 
                         formData?.primarydetails?.denomination.denominationvalue || 
                         'Stamp Observation';
            apiFormData.append('Title', title);

            // Add StampFileAttachment - convert image URL to binary format
            try {
                if (stamp.stampImageUrl && stamp.stampImageUrl !== "/placeholder.svg") {
                    const imageResponse = await fetch(stamp.stampImageUrl);
                    if (imageResponse.ok) {
                        const imageBlob = await imageResponse.blob();
                        // Extract filename from URL or use a default name
                        const urlParts = stamp.stampImageUrl.split('/');
                        const filename = urlParts[urlParts.length - 1] || 'stamp-image.jpg';
                        apiFormData.append('StampFileAttachment', imageBlob, filename);
                    } else {
                        console.warn('Could not fetch stamp image for attachment:', stamp.stampImageUrl);
                        // Create an empty blob as fallback
                        const emptyBlob = new Blob([''], { type: 'image/jpeg' });
                        apiFormData.append('StampFileAttachment', emptyBlob, 'stamp-image.jpg');
                    }
                } else {
                    // Create an empty blob if no image URL is available
                    const emptyBlob = new Blob([''], { type: 'image/jpeg' });
                    apiFormData.append('StampFileAttachment', emptyBlob, 'stamp-image.jpg');
                }
            } catch (imageError) {
                console.error('Error processing stamp image:', imageError);
                // Create an empty blob as fallback
                const emptyBlob = new Blob([''], { type: 'image/jpeg' });
                apiFormData.append('StampFileAttachment', emptyBlob, 'stamp-image.jpg');
            }

            // Make API call with PUT method for editing (only difference from saveStampToAPI)
            const apiResponse = await fetch(`https://3pm-stampapp-prod.azurewebsites.net/api/v1/Stamp/${stamp.id}`, {
                method: 'PUT', // Changed from POST to PUT for editing
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
            console.log('Stamp updated successfully:', result);
            
            // Create the updated stamp object for local state using new structure
            const updatedStamp = {
                ...stamp,
                stampDetailsJson: JSON.stringify(stampDetailsJson),
                name: title,
                // Include any other fields that might be returned from the API
                ...result
            };
            
            // Call the onSave callback with the updated stamp
            onSave(updatedStamp);
            
        } catch (error) {
            console.error('Error saving stamp:', error);
            // You could add a toast notification or error state here
            alert(`Error saving stamp: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="w-full h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-6 border-b border-border/50 flex items-center justify-between flex-shrink-0">
                <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground/90">Edit Stamp Details</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground/80 line-clamp-1">{stamp.name}</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors duration-200"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 h-full">
                    {/* Image Section */}
                    <div className="space-y-4">
                        {/* Image Controls */}
                        <div className="bg-gradient-to-br from-background to-muted/20 p-3 sm:p-4 rounded-xl border border-border/50 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    Stamp Image
                                </h4>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={handleZoomOut}
                                        disabled={imageZoom <= 0.5}
                                    >
                                        <ZoomOut className="h-4 w-4" />
                                    </Button>
                                    <span className="text-xs font-mono min-w-[3rem] text-center px-2 py-1 bg-muted rounded-md">
                                        {Math.round(imageZoom * 100)}%
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={handleZoomIn}
                                        disabled={imageZoom >= 3}
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={resetImageView}
                                        disabled={imageZoom === 1 && imagePan.x === 0 && imagePan.y === 0}
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Image Container */}
                            <div 
                                ref={imageContainerRef}
                                className="h-48 sm:h-64 lg:h-80 overflow-hidden bg-gradient-to-br from-muted/50 to-muted/80 rounded-lg relative cursor-move border border-border/30"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <div className="w-full h-full flex items-center justify-center p-4">
                                    <img
                                        src={stamp.stampImageUrl || "/placeholder.svg"}
                                        alt={stamp.name}
                                        className="max-w-full max-h-full object-contain transition-transform duration-150 select-none rounded-md shadow-md"
                                        style={{
                                            transform: `scale(${imageZoom}) translate(${imagePan.x / imageZoom}px, ${imagePan.y / imageZoom}px)`,
                                            cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                                        }}
                                        draggable={false}
                                    />
                                </div>
                                
                                {/* Zoom instruction overlay */}
                                {imageZoom === 1 && (
                                    <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm text-foreground/80 text-xs px-3 py-1.5 rounded-md border border-border/50">
                                        Use zoom controls to magnify
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Info Cards - Only show on larger screens to save space */}
                        <div className="hidden sm:grid grid-cols-2 gap-3">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 p-3 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                                <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Country</div>
                                <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 truncate">
                                    {stamp.country || 'Unknown'}
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 p-3 rounded-lg border border-green-200/50 dark:border-green-800/50">
                                <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Denomination</div>
                                <div className="text-sm font-semibold text-green-900 dark:text-green-100">
                                    {stamp.denominationValue ? `${stamp.denominationValue}${stamp.denominationSymbol}` : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="flex flex-col h-full min-h-0">
                        <div className="bg-gradient-to-br from-background to-muted/20 rounded-xl border border-border/50 shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="p-3 sm:p-4 border-b border-border/30 bg-muted/20 flex-shrink-0">
                                <h4 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                    Stamp Details
                                </h4>
                                <p className="text-xs text-muted-foreground/80 mt-1">
                                    Click on any field to edit its value
                                </p>
                            </div>
                            <div className="p-3 sm:p-4 flex-1 overflow-y-auto min-h-0">
                                <FormPreview 
                                    data={formData} 
                                    categories={categories}
                                    onUpdate={handleFieldChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 bg-gradient-to-r from-muted/20 to-muted/10 p-3 sm:p-4 lg:p-6 flex flex-col sm:flex-row justify-end gap-3 flex-shrink-0">
                <Button 
                    variant="outline" 
                    onClick={onClose} 
                    disabled={isSaving} 
                    className="order-2 sm:order-1 px-4 sm:px-6 py-2 hover:bg-muted/80 transition-colors duration-200"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    className="order-1 sm:order-2 px-4 sm:px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
                >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    )
} 