"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Tag, ArrowUpRight, Database, Upload, Clock, BookOpen } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Sample data for demonstration
const recentIngestions = [
  {
    id: "ing-001",
    source: "Stanley Gibbons 2023 - Commonwealth",
    status: "completed",
    items: 2450,
    date: "2 days ago",
  },
  {
    id: "ing-002",
    source: "Scott 2023 Volume 3 (G-I)",
    status: "processing",
    items: 1820,
    date: "In progress",
    progress: 68,
  },
]

// Sample catalog code examples
const catalogCodeExamples = [
  { number: 1, code: "NZ-55-1D-Imp", description: "1855 1d Red Imperforate (Chalon Head)" },
  { number: 2, code: "NZ-55-2D-Wmk", description: "1855 2d Blue with Watermark" },
  { number: 10, code: "NZ-57-6D-Imp", description: "1857 6d Brown Imperforate (Chalon Head)" },
  { number: 14, code: "NZ-59-2D-Oprt", description: "1859 2d Blue Overprint" },
]

function AdminDashboardContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button size="sm" asChild>
            <Link href="/">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              View Site
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Catalog Records</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Stamp catalog entries</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">User Accounts</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stamp Varieties</CardTitle>
            <Tag className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,842</div>
            <p className="text-xs text-muted-foreground mt-1">Unique varieties tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button className="h-auto py-4 flex flex-col items-center justify-center gap-2" asChild>
              <Link href="/admin/catalog-management">
                <Upload className="h-6 w-6 mb-1" />
                <div className="text-sm font-medium">Ingest Catalog Data</div>
                <div className="text-xs text-muted-foreground">Upload and process catalog pages</div>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" asChild>
              <Link href="/admin/users">
                <Users className="h-6 w-6 mb-1" />
                <div className="text-sm font-medium">Manage Users</div>
                <div className="text-xs text-muted-foreground">View and edit user accounts</div>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" asChild>
              <Link href="/admin/catalog">
                <BookOpen className="h-6 w-6 mb-1" />
                <div className="text-sm font-medium">Browse Catalog</div>
                <div className="text-xs text-muted-foreground">View and edit catalog entries</div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Ingestion Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Catalog Ingestion</CardTitle>
            <CardDescription>Latest catalog data processing jobs</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/catalog-management">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIngestions.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{job.source}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" /> {job.date}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={job.status === "completed" ? "default" : "outline"} className="self-end">
                    {job.status === "completed" ? "Completed" : "Processing"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Quick guide for administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <h3 className="font-medium">1. Upload Catalog Data</h3>
              <p className="text-sm text-muted-foreground">
                Start by ingesting stamp catalog data using the AI-powered ingestion tool. You can upload scanned pages from 
                standard catalogs like Stanley Gibbons, Scott, or Michel.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <h3 className="font-medium">2. Review Extracted Data</h3>
              <p className="text-sm text-muted-foreground">
                After processing, review the extracted data for accuracy. The system will automatically assign SOA 
                (Stamps of Approval) universal codes to each entry.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <h3 className="font-medium">3. Manage User Accounts</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage user accounts for staff members who need access to the administrative functions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminDashboard() {
  return <AdminDashboardContent />
}
