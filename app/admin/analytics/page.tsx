"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Calendar, Download, Users, Tag, MessageSquare } from "lucide-react"
import AnalyticsChart from "@/components/admin/analytics-chart"
import AnalyticsMetricsGrid from "@/components/admin/analytics-metrics-grid"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Platform performance and user engagement metrics</p>
        </div>

        <div className="flex gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <AnalyticsMetricsGrid />

      {/* Charts */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <LineChart className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <Tag className="h-4 w-4" /> Content
          </TabsTrigger>
          <TabsTrigger value="engagement" className="gap-2">
            <MessageSquare className="h-4 w-4" /> Engagement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth</CardTitle>
              <CardDescription>User registrations and content creation over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <AnalyticsChart type="line" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where users are coming from</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <AnalyticsChart type="pie" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>Platform access by device type</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <AnalyticsChart type="pie" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Registrations</CardTitle>
              <CardDescription>New user sign-ups over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <AnalyticsChart type="bar" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>User distribution by region</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <AnalyticsChart type="pie" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>Monthly active user retention rates</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <AnalyticsChart type="line" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Creation</CardTitle>
              <CardDescription>New listings, topics, and comments over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <AnalyticsChart type="bar" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content by Category</CardTitle>
                <CardDescription>Distribution across categories</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <AnalyticsChart type="pie" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Engagement</CardTitle>
                <CardDescription>Views, likes, and comments per content type</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <AnalyticsChart type="bar" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>Daily active users and session duration</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <AnalyticsChart type="line" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>Most used platform features</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <AnalyticsChart type="bar" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketplace Activity</CardTitle>
                <CardDescription>Listings, bids, and completed trades</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <AnalyticsChart type="line" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Calendar Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Calendar</CardTitle>
          <CardDescription>Platform activity heatmap</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <Calendar className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground ml-4">Activity calendar heatmap would appear here</p>
        </CardContent>
      </Card>
    </div>
  )
}
