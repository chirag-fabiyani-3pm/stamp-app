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
import { Label } from "@/components/ui/label"
import { PlusCircle, Pencil, Trash2, MoveUp, MoveDown, Tag } from "lucide-react"

// Sample categories data
const initialCategories = [
  {
    id: 1,
    name: "Identification",
    slug: "identification",
    description: "Help with identifying stamps",
    count: 24,
  },
  {
    id: 2,
    name: "Valuation",
    slug: "valuation",
    description: "Discussions about stamp values and appraisals",
    count: 18,
  },
  {
    id: 3,
    name: "Preservation",
    slug: "preservation",
    description: "Tips and advice for preserving stamps",
    count: 37,
  },
  {
    id: 4,
    name: "Trading",
    slug: "trading",
    description: "Discussions about trading stamps",
    count: 42,
  },
  {
    id: 5,
    name: "Events",
    slug: "events",
    description: "Information about stamp exhibitions and events",
    count: 15,
  },
  {
    id: 6,
    name: "Technology",
    slug: "technology",
    description: "Discussions about stamp collecting technology",
    count: 29,
  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Handle adding a new category
  const handleAddCategory = () => {
    const id = Math.max(...categories.map((c) => c.id)) + 1
    setCategories([...categories, { ...newCategory, id, count: 0 }])
    setNewCategory({ name: "", slug: "", description: "" })
    setIsAddDialogOpen(false)
  }

  // Handle editing a category
  const handleEditCategory = () => {
    setCategories(categories.map((c) => (c.id === editingCategory.id ? editingCategory : c)))
    setIsEditDialogOpen(false)
  }

  // Handle deleting a category
  const handleDeleteCategory = (id: number) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      setCategories(categories.filter((c) => c.id !== id))
    }
  }

  // Handle moving a category up or down
  const handleMoveCategory = (id: number, direction: "up" | "down") => {
    const index = categories.findIndex((c) => c.id === id)
    if (direction === "up" && index > 0) {
      const newCategories = [...categories]
      const temp = newCategories[index]
      newCategories[index] = newCategories[index - 1]
      newCategories[index - 1] = temp
      setCategories(newCategories)
    } else if (direction === "down" && index < categories.length - 1) {
      const newCategories = [...categories]
      const temp = newCategories[index]
      newCategories[index] = newCategories[index + 1]
      newCategories[index + 1] = temp
      setCategories(newCategories)
    }
  }

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage community and marketplace categories</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new category for community posts or marketplace listings.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setNewCategory({
                      ...newCategory,
                      name,
                      slug: generateSlug(name),
                    })
                  }}
                  placeholder="e.g., Rare Stamps"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  placeholder="e.g., rare-stamps"
                />
                <p className="text-xs text-muted-foreground">
                  Used in URLs. Auto-generated from name, but you can customize it.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Brief description of the category"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory} disabled={!newCategory.name || !newCategory.slug}>
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage and organize content categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Content Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{category.count}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleMoveCategory(category.id, "up")}
                          disabled={category.id === categories[0].id}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleMoveCategory(category.id, "down")}
                          disabled={category.id === categories[categories.length - 1].id}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>

                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setEditingCategory(category)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                              <DialogDescription>Update category details</DialogDescription>
                            </DialogHeader>

                            {editingCategory && (
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Category Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={editingCategory.name}
                                    onChange={(e) =>
                                      setEditingCategory({
                                        ...editingCategory,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-slug">Slug</Label>
                                  <Input
                                    id="edit-slug"
                                    value={editingCategory.slug}
                                    onChange={(e) =>
                                      setEditingCategory({
                                        ...editingCategory,
                                        slug: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Input
                                    id="edit-description"
                                    value={editingCategory.description}
                                    onChange={(e) =>
                                      setEditingCategory({
                                        ...editingCategory,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}

                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditCategory}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={category.count > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {categories.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No categories found. Create your first category.</p>
              <Button className="mt-4 gap-2" onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="h-4 w-4" /> Add Category
              </Button>
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-4">
            Note: Categories with content cannot be deleted. You must first reassign or delete the content.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
