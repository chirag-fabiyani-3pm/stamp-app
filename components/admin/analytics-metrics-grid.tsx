import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Tag, MessageSquare, ArrowUpRight, ArrowDownRight, Clock, TrendingUp, ShoppingCart } from "lucide-react"

export default function AnalyticsMetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,853</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">12%</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,247</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">8%</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Community Posts</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3,672</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">24%</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8m 42s</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">3%</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">New Users (30d)</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">342</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">18%</span> from previous period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Completed Trades</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">87</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
            <span className="text-red-500 font-medium">5%</span> from previous period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">428</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">7%</span> from previous period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3.2%</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">0.5%</span> from previous period
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
