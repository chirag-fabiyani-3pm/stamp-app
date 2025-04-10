"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, PlusCircle, Upload, Filter, ChevronLeft, ChevronRight } from "lucide-react"

// Sample catalog data
const sampleCatalogItems = [
  {
    id: 1,
    name: "Silver Jubilee",
    country: "New Zealand",
    year: 1935,
    denomination: "1d",
    color: "Red",
    condition: "Excellent",
    rarity: "Uncommon",
    category: "Commemorative",
    image: "/placeholder.svg?height=200&width=200&text=NZ+1935",
    addedDate: "Mar 15, 2023",
    addedBy: "AdminUser",
    status: "published",
  },
  {
    id: 2,
    name: "Coronation Series",
    country: "United Kingdom",
    year: 1953,
    denomination: "3d",
    color: "Deep Lilac",
    condition: "Good",
    rarity: "Common",
    category: "Commemorative",
    image: "/placeholder.svg?height=200&width=200&text=UK+1953",
    addedDate: "Apr 2, 2023",
    addedBy: "AdminUser",
    status: "published",
  },
  {
    id: 3,
    name: "Independence Issue",
    country: "India",
    year: 1947,
    denomination: "1 Anna",
    color: "Deep Green",
    condition: "Fair",
    rarity: "Uncommon",
    category: "Historical",
    image: "/placeholder.svg?height=200&width=200&text=India+1947",
    addedDate: "May 10, 2023",
    addedBy: "StampExpert",
    status: "published",
  },
  {
    id: 4,
    name: "Bicentennial",
    country: "United States",
    year: 1976,
    denomination: "13c",
    color: "Multicolor",
    condition: "Mint",
    rarity: "Common",
    category: "Commemorative",
    image: "/placeholder.svg?height=200&width=200&text=US+1976",
    addedDate: "Jun 22, 2023",
    addedBy: "AdminUser",
    status: "published",
  },
  {
    id: 5,
    name: "Olympic Games",
    country: "Australia",
    year: 2000,
    denomination: "45c",
    color: "Multicolor",
    condition: "Very Good",
    rarity: "Common",
    category: "Sports",
    image: "/placeholder.svg?height=200&width=200&text=AUS+2000",
    addedDate: "Jul 5, 2023",
    addedBy: "StampExpert",
    status: "draft",
  },
  {
    id: 6,
    name: "Flora Series",
    country: "South Africa",
    year: 1961,
    denomination: "12c",
    color: "Green",
    condition: "Good",
    rarity: "Uncommon",
    category: "Nature",
    image: "/placeholder.svg?height=200&width=200&text=SA+1961",
    addedDate: "Aug 12, 2023",
    addedBy: "AdminUser",
    status: "published",
  },
]

export default function CatalogManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [newCatalogItem, setNewCatalogItem] = useState({
    name: "",
    country: "",
    year: "",
    denomination: "",
    color: "",
    condition: "Excellent",
    rarity: "Common",
    category: "Commemorative",
    description: "",
    status: "draft",
  })

  const itemsPerPage = 5

  // Filter catalog items based on search and filters
  const filteredItems = sampleCatalogItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.year.toString().includes(searchTerm) ||
      item.denomination.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCountry = countryFilter === "all" || item.country === countryFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesCountry && matchesCategory && matchesStatus
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

  // Get unique countries and categories for filters
  const countries = ["all", ...Array.from(new Set(sampleCatalogItems.map((item) => item.country)))]
  const categories = ["all", ...Array.from(new Set(sampleCatalogItems.map((item) => item.category)))]

  // Handle editing a catalog item
  const handleEditItem = (item: any) => {
    setSelectedItem(item)
    setIsEditDialogOpen(true)
  }

  // Get badge color based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default"
      case "draft":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Catalog Management</h1>
          <p className="text-muted-foreground">Manage the stamp catalog database</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add Catalog Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Catalog Item</DialogTitle>
              <DialogDescription>Add a new stamp to the catalog database</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Stamp Name</Label>
                  <Input
                    id="name"
                    value={newCatalogItem.name}
                    onChange={(e) => setNewCatalogItem({ ...newCatalogItem, name: e.target.value })}
                    placeholder="e.g., Silver Jubilee"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={newCatalogItem.country}
                    onChange={(e) => setNewCatalogItem({ ...newCatalogItem, country: e.target.value })}
                    placeholder="e.g., New Zealand"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newCatalogItem.year}
                      onChange={(e) => setNewCatalogItem({ ...newCatalogItem, year: e.target.value })}
                      placeholder="e.g., 1935"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="denomination">Denomination</Label>
                    <Input
                      id="denomination"
                      value={newCatalogItem.denomination}
                      onChange={(e) => setNewCatalogItem({ ...newCatalogItem, denomination: e.target.value })}
                      placeholder="e.g., 1d"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={newCatalogItem.color}
                    onChange={(e) => setNewCatalogItem({ ...newCatalogItem, color: e.target.value })}
                    placeholder="e.g., Red"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={newCatalogItem.condition}
                      onValueChange={(value) => setNewCatalogItem({ ...newCatalogItem, condition: value })}
                    >
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mint">Mint</SelectItem>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Very Good">Very Good</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rarity">Rarity</Label>
                    <Select
                      value={newCatalogItem.rarity}
                      onValueChange={(value) => setNewCatalogItem({ ...newCatalogItem, rarity: value })}
                    >
                      <SelectTrigger id="rarity">
                        <SelectValue placeholder="Select rarity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Common">Common</SelectItem>
                        <SelectItem value="Uncommon">Uncommon</SelectItem>
                        <SelectItem value="Rare">Rare</SelectItem>
                        <SelectItem value="Very Rare">Very Rare</SelectItem>
                        <SelectItem value="Extremely Rare">Extremely Rare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newCatalogItem.category}
                    onValueChange={(value) => setNewCatalogItem({ ...newCatalogItem, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Commemorative">Commemorative</SelectItem>
                      <SelectItem value="Definitive">Definitive</SelectItem>
                      <SelectItem value="Historical">Historical</SelectItem>
                      <SelectItem value="Nature">Nature</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Art">Art</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCatalogItem.description}
                    onChange={(e) => setNewCatalogItem({ ...newCatalogItem, description: e.target.value })}
                    placeholder="Provide details about the stamp's history, design, and significance..."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Upload Image</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" /> Upload Image
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Upload a clear, high-resolution image of the stamp (front view)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Publication Status</Label>
                  <Select
                    value={newCatalogItem.status}
                    onValueChange={(value) => setNewCatalogItem({ ...newCatalogItem, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Draft items are only visible to admins, published items are visible to all users
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add to Catalog</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stamp Catalog</CardTitle>
          <CardDescription>Manage and organize the stamp catalog database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search catalog..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country === "all" ? "All Countries" : country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stamp</TableHead>
                  <TableHead>Country/Year</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rarity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.denomination}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{item.country}</div>
                      <div className="text-xs text-muted-foreground">{item.year}</div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.rarity}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{item.addedBy}</div>
                      <div className="text-xs text-muted-foreground">{item.addedDate}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditItem(item)}>Edit details</DropdownMenuItem>
                          <DropdownMenuItem>View in catalog</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {item.status === "draft" ? (
                            <DropdownMenuItem>Publish</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>Unpublish</DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-3xl">
              {selectedItem && (
                <>
                  <DialogHeader>
                    <DialogTitle>Edit Catalog Item</DialogTitle>
                    <DialogDescription>Update details for {selectedItem.name}</DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Stamp Name</Label>
                        <Input id="edit-name" defaultValue={selectedItem.name} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-country">Country</Label>
                        <Input id="edit-country" defaultValue={selectedItem.country} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-year">Year</Label>
                          <Input id="edit-year" type="number" defaultValue={selectedItem.year} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-denomination">Denomination</Label>
                          <Input id="edit-denomination" defaultValue={selectedItem.denomination} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-color">Color</Label>
                        <Input id="edit-color" defaultValue={selectedItem.color} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-condition">Condition</Label>
                          <Select defaultValue={selectedItem.condition}>
                            <SelectTrigger id="edit-condition">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mint">Mint</SelectItem>
                              <SelectItem value="Excellent">Excellent</SelectItem>
                              <SelectItem value="Very Good">Very Good</SelectItem>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Fair">Fair</SelectItem>
                              <SelectItem value="Poor">Poor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-rarity">Rarity</Label>
                          <Select defaultValue={selectedItem.rarity}>
                            <SelectTrigger id="edit-rarity">
                              <SelectValue placeholder="Select rarity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Common">Common</SelectItem>
                              <SelectItem value="Uncommon">Uncommon</SelectItem>
                              <SelectItem value="Rare">Rare</SelectItem>
                              <SelectItem value="Very Rare">Very Rare</SelectItem>
                              <SelectItem value="Extremely Rare">Extremely Rare</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select defaultValue={selectedItem.category}>
                          <SelectTrigger id="edit-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Commemorative">Commemorative</SelectItem>
                            <SelectItem value="Definitive">Definitive</SelectItem>
                            <SelectItem value="Historical">Historical</SelectItem>
                            <SelectItem value="Nature">Nature</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                            <SelectItem value="Transportation">Transportation</SelectItem>
                            <SelectItem value="Art">Art</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          defaultValue={selectedItem.description || ""}
                          placeholder="Provide details about the stamp's history, design, and significance..."
                          rows={5}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Current Image</Label>
                        <div className="border rounded-lg p-4 flex justify-center">
                          <img
                            src={selectedItem.image || "/placeholder.svg"}
                            alt={selectedItem.name}
                            className="h-32 object-contain"
                          />
                        </div>
                        <Button variant="outline" className="w-full mt-2 gap-2">
                          <Upload className="h-4 w-4" /> Replace Image
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-status">Publication Status</Label>
                        <Select defaultValue={selectedItem.status}>
                          <SelectTrigger id="edit-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
