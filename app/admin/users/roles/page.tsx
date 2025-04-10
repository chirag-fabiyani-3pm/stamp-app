"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Pencil, ShieldAlert, Users, MessageSquare, Settings, Eye } from "lucide-react"
import { useState } from "react"

// Sample roles data
const initialRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to all system features",
    usersCount: 2,
    permissions: {
      users: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },
      content: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        moderate: true,
      },
      settings: {
        view: true,
        edit: true,
      },
      catalog: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },
    },
  },
  {
    id: 3,
    name: "User",
    description: "Standard user with basic permissions",
    usersCount: 2846,
    permissions: {
      users: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      content: {
        view: true,
        create: true,
        edit: false,
        delete: false,
        moderate: false,
      },
      settings: {
        view: false,
        edit: false,
      },
      catalog: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
    },
  },
]

export default function RolesPage() {
  const [roles, setRoles] = useState(initialRoles)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: {
      users: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      content: {
        view: true,
        create: true,
        edit: false,
        delete: false,
        moderate: false,
      },
      settings: {
        view: false,
        edit: false,
      },
    },
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewUsersDialogOpen, setIsViewUsersDialogOpen] = useState(false)
  const [selectedRoleForUsers, setSelectedRoleForUsers] = useState<any>(null)

  // Sample users for the selected role
  const sampleUsers = [
    {
      id: 1,
      name: "AdminUser",
      email: "admin@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=AU",
    },
    {
      id: 3,
      name: "StampExpert",
      email: "expert@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
    },
  ]

  // Handle adding a new role
  const handleAddRole = () => {
    const id = Math.max(...roles.map((r) => r.id)) + 1
    setRoles([...roles, { ...newRole, id, usersCount: 0 }])
    setNewRole({
      name: "",
      description: "",
      permissions: {
        users: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        content: {
          view: true,
          create: true,
          edit: false,
          delete: false,
          moderate: false,
        },
        settings: {
          view: false,
          edit: false,
        },
      },
    })
    setIsAddDialogOpen(false)
  }

  // Handle editing a role
  const handleEditRole = () => {
    setRoles(roles.map((r) => (r.id === editingRole.id ? editingRole : r)))
    setIsEditDialogOpen(false)
  }

  // Handle viewing users with a specific role
  const handleViewUsers = (role: any) => {
    setSelectedRoleForUsers(role)
    setIsViewUsersDialogOpen(true)
  }

  // Render permission checkboxes
  const renderPermissionCheckboxes = (role: any, setRole: any, section: string) => {
    const permissions = role.permissions[section]

    return (
      <div className="space-y-2">
        {Object.keys(permissions).map((perm) => (
          <div key={`${section}-${perm}`} className="flex items-center space-x-2">
            <Checkbox
              id={`${section}-${perm}`}
              checked={permissions[perm]}
              onCheckedChange={(checked) => {
                setRole({
                  ...role,
                  permissions: {
                    ...role.permissions,
                    [section]: {
                      ...role.permissions[section],
                      [perm]: checked,
                    },
                  },
                })
              }}
            />
            <label
              htmlFor={`${section}-${perm}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {perm.charAt(0).toUpperCase() + perm.slice(1)}
            </label>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user roles and their permissions</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>Create a new role with specific permissions</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({
                      ...newRole,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Editor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({
                      ...newRole,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the role"
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Permissions</h4>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4" />
                      <h5 className="text-sm font-medium">User Management</h5>
                    </div>
                    {renderPermissionCheckboxes(newRole, setNewRole, "users")}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4" />
                      <h5 className="text-sm font-medium">Content Management</h5>
                    </div>
                    {renderPermissionCheckboxes(newRole, setNewRole, "content")}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="h-4 w-4" />
                      <h5 className="text-sm font-medium">System Settings</h5>
                    </div>
                    {renderPermissionCheckboxes(newRole, setNewRole, "settings")}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRole} disabled={!newRole.name}>
                Add Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
          <CardDescription>Define roles and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-primary" />
                        <span className="font-medium">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto" onClick={() => handleViewUsers(role)}>
                        {role.usersCount} users
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => setEditingRole(role)}
                              disabled={role.name === "User"} // Prevent editing the default User role
                            >
                              <Pencil className="h-4 w-4" /> Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            {editingRole && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>Edit Role</DialogTitle>
                                  <DialogDescription>Modify role details and permissions</DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-name">Role Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={editingRole.name}
                                      onChange={(e) =>
                                        setEditingRole({
                                          ...editingRole,
                                          name: e.target.value,
                                        })
                                      }
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Input
                                      id="edit-description"
                                      value={editingRole.description}
                                      onChange={(e) =>
                                        setEditingRole({
                                          ...editingRole,
                                          description: e.target.value,
                                        })
                                      }
                                    />
                                  </div>

                                  <div className="space-y-4">
                                    <h4 className="text-sm font-medium">Permissions</h4>

                                    <div className="space-y-4">
                                      <div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <Users className="h-4 w-4" />
                                          <h5 className="text-sm font-medium">User Management</h5>
                                        </div>
                                        {renderPermissionCheckboxes(editingRole, setEditingRole, "users")}
                                      </div>

                                      <div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <MessageSquare className="h-4 w-4" />
                                          <h5 className="text-sm font-medium">Content Management</h5>
                                        </div>
                                        {renderPermissionCheckboxes(editingRole, setEditingRole, "content")}
                                      </div>

                                      <div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <Settings className="h-4 w-4" />
                                          <h5 className="text-sm font-medium">System Settings</h5>
                                        </div>
                                        {renderPermissionCheckboxes(editingRole, setEditingRole, "settings")}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleEditRole}>Save Changes</Button>
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm" className="gap-1" onClick={() => handleViewUsers(role)}>
                          <Eye className="h-4 w-4" /> View Users
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* View Users Dialog */}
          <Dialog open={isViewUsersDialogOpen} onOpenChange={setIsViewUsersDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Users with {selectedRoleForUsers?.name} Role</DialogTitle>
                <DialogDescription>{selectedRoleForUsers?.usersCount} users have this role assigned</DialogDescription>
              </DialogHeader>

              <div className="py-4">
                {selectedRoleForUsers?.name === "Admin" && (
                  <div className="space-y-4">
                    {sampleUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Change Role
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedRoleForUsers?.name !== "Admin" && (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      User list would be displayed here for the {selectedRoleForUsers?.name} role.
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button onClick={() => setIsViewUsersDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <p className="text-sm text-muted-foreground mt-4">
            Note: The "User" role is the default role and cannot be edited or deleted.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
