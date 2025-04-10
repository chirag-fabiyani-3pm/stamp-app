"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AuthenticationSettingsPage() {
  const [settings, setSettings] = useState({
    // Apprentice settings
    apprenticeMinReviews: "10",
    apprenticeSuccessRate: "80",
    apprenticeEndorsements: "5",

    // Certified settings
    certifiedMinReviews: "30",
    certifiedSuccessRate: "90",
    certifiedEndorsements: "20",

    // Master settings
    masterMinReviews: "100",
    masterSuccessRate: "95",
    masterEndorsements: "50",
  })

  const handleChange = (field: string, value: string | boolean) => {
    setSettings({
      ...settings,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Authentication Settings</h1>
          <p className="text-muted-foreground">Configure reviewer level requirements</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Apprentice Authenticator</CardTitle>
            <CardDescription>Requirements for Apprentice Authenticators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="apprentice-min-reviews">Minimum Reviews</Label>
                <Input
                  id="apprentice-min-reviews"
                  type="number"
                  value={settings.apprenticeMinReviews}
                  onChange={(e) => handleChange("apprenticeMinReviews", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Minimum number of reviews required</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apprentice-success-rate">Success Rate (%)</Label>
                <Input
                  id="apprentice-success-rate"
                  type="number"
                  value={settings.apprenticeSuccessRate}
                  onChange={(e) => handleChange("apprenticeSuccessRate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Minimum success rate required</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apprentice-endorsements">Required Endorsements</Label>
                <Input
                  id="apprentice-endorsements"
                  type="number"
                  value={settings.apprenticeEndorsements}
                  onChange={(e) => handleChange("apprenticeEndorsements", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Minimum endorsements required</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certified Authenticator</CardTitle>
            <CardDescription>Requirements for Certified Authenticators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="certified-min-reviews">Minimum Reviews</Label>
                <Input
                  id="certified-min-reviews"
                  type="number"
                  value={settings.certifiedMinReviews}
                  onChange={(e) => handleChange("certifiedMinReviews", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Minimum number of reviews required</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certified-success-rate">Success Rate (%)</Label>
                <Input
                  id="certified-success-rate"
                  type="number"
                  value={settings.certifiedSuccessRate}
                  onChange={(e) => handleChange("certifiedSuccessRate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Minimum success rate required</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certified-endorsements">Required Endorsements</Label>
                <Input
                  id="certified-endorsements"
                  type="number"
                  value={settings.certifiedEndorsements}
                  onChange={(e) => handleChange("certifiedEndorsements", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Minimum endorsements required</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Master Philatelist</CardTitle>
            <CardDescription>Requirements for Master Philatelists</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="master-min-reviews">Minimum Reviews</Label>
                <Input
                  id="master-min-reviews"
                  type="number"
                  value={settings.masterMinReviews}
                  onChange={(e) => handleChange("masterMinReviews", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Minimum number of reviews required</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="master-success-rate">Success Rate (%)</Label>
                <Input
                  id="master-success-rate"
                  type="number"
                  value={settings.masterSuccessRate}
                  onChange={(e) => handleChange("masterSuccessRate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Minimum success rate required</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="master-endorsements">Required Endorsements</Label>
                <Input
                  id="master-endorsements"
                  type="number"
                  value={settings.masterEndorsements}
                  onChange={(e) => handleChange("masterEndorsements", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Minimum endorsements required</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
