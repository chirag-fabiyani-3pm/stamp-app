"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Edit, X, Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserData } from "@/lib/api/auth"
// Import categories from JSON file
import categoriesData from "@/categories.json"

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

// Use imported categories data and normalize the structure
const categories: Category[] = categoriesData.map(category => ({
    ...category,
    id: category.id.toLowerCase(), // Normalize to lowercase for consistency
    children: category.children ? normalizeCategories(category.children) : undefined
}))

// Helper function to normalize nested categories
function normalizeCategories(cats: any[]): Category[] {
    return cats.map(cat => ({
        ...cat,
        id: cat.id.toLowerCase(),
        children: cat.children ? normalizeCategories(cat.children) : undefined
    }))
}

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
            // For direct field categories, just set empty values
            acc[category.id.toLowerCase()] = ''
        } else if (category.children && category.children.length > 0) {
            // For category containers, recursively initialize children
            const childData = initializeFormDataFromCategories(category.children)
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
        for (const cookie of cookies) {
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
    const getFieldType = (categoryId: string, _fieldId: string): string => {
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
    const processFormData = (data: any, parentKey: string = '', _level: number = 0): void => {
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
    const [_navigationPath, _setNavigationPath] = useState<NavigationPathItem[]>([])
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
        
        // First, populate from root-level fields in the stamp object
        const result = { ...defaultData }
        
        // Helper function to set value at a nested path
        const setNestedValue = (obj: any, path: string[], value: any) => {
            let current = obj
            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i].toLowerCase()
                if (!current[key] || typeof current[key] !== 'object') {
                    current[key] = {}
                }
                current = current[key]
            }
            const finalKey = path[path.length - 1].toLowerCase()
            current[finalKey] = value
        }
        
        // Map root-level stamp fields to form structure dynamically
        const rootFieldMappings = [
            { source: 'country', path: ['primarydetails', 'country'] },
            { source: 'issueDate', path: ['primarydetails', 'issuedate'] },
            { source: 'denominationValue', path: ['primarydetails', 'denomination', 'denominationvalue'] },
            { source: 'denominationCurrency', path: ['primarydetails', 'denomination', 'denominationcurrency'] },
            { source: 'denominationSymbol', path: ['primarydetails', 'denomination', 'denominationsymbol'] },
            { source: 'color', path: ['colors', 'colortype'] },
            { source: 'paperType', path: ['paperchar', 'papertypes', 'papertype'] }
        ]
        
        rootFieldMappings.forEach(mapping => {
            const value = stamp[mapping.source as keyof typeof stamp]
            if (value !== null && value !== undefined && value.toString().trim() !== '') {
                setNestedValue(result, mapping.path, value.toString())
            }
        })
        
        // Parse existing stampDetails JSON if available and merge dynamically
        if (stamp.stampDetailsJson) {
            try {
                const existingDetails = JSON.parse(stamp.stampDetailsJson)
                
                // Function to recursively parse API structure and set values dynamically
                const parseApiDataDynamically = (apiData: any[], currentPath: string[] = []) => {
                    apiData.forEach(item => {
                        const itemPath = [...currentPath, item.key]
                        
                        if (item.type === 'Category' && item.children && Array.isArray(item.children)) {
                            // This is a category with children, recursively parse children
                            parseApiDataDynamically(item.children, itemPath)
                        } else if (item.value && item.value.trim() !== '') {
                            // This is a field with a non-empty value, set it at the correct path
                            setNestedValue(result, itemPath, item.value)
                        }
                        // Skip fields with empty values - they'll remain as initialized
                    })
                }
                
                // Parse the API data starting from root level
                parseApiDataDynamically(existingDetails)
                
            } catch (error) {
                console.error('Error parsing stamp details:', error)
                // If parsing fails, we still have the root-level data populated
            }
        }
        
        return result
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

    const _resetImagePan = () => {
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
        const newFormData = { ...formData }
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
            const apiResponse = await fetch(`https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/Stamp/${stamp.id}`, {
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