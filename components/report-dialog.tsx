"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Flag } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ReportDialogProps {
  contentType: "listing" | "topic" | "comment" | "profile" | "stamp"
  contentId: string | number
  contentTitle: string
  trigger?: React.ReactNode
  className?: string
}

export function ReportDialog({ contentType, contentId, contentTitle, trigger, className }: ReportDialogProps) {
  const [reason, setReason] = useState<string>("")
  const [details, setDetails] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setOpen(false)

      // Reset form
      setReason("")
      setDetails("")

      // Show success toast
      toast({
        title: "Report submitted",
        description: "Thank you for your report. Our team will review it shortly.",
      })
    }, 1000)
  }

  const getReportReasons = () => {
    const commonReasons = [
      { id: "inappropriate", label: "Inappropriate content" },
      { id: "spam", label: "Spam or advertising" },
      { id: "harassment", label: "Harassment or bullying" },
      { id: "other", label: "Other" },
    ]

    const specificReasons = {
      listing: [
        { id: "counterfeit", label: "Counterfeit item" },
        { id: "misleading", label: "Misleading description" },
        { id: "duplicate", label: "Duplicate listing" },
      ],
      topic: [{ id: "off-topic", label: "Off-topic content" }],
      comment: [{ id: "offensive", label: "Offensive language" }],
      profile: [{ id: "impersonation", label: "Impersonation" }],
      stamp: [{ id: "incorrect-info", label: "Incorrect information" }],
    }

    return [...specificReasons[contentType], ...commonReasons]
  }

  const getContentTypeLabel = () => {
    const labels = {
      listing: "listing",
      topic: "topic",
      comment: "comment",
      profile: "profile",
      stamp: "stamp catalog entry",
    }
    return labels[contentType]
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className={`gap-1 text-muted-foreground ${className}`}>
            <Flag className="h-4 w-4" /> Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report {getContentTypeLabel()}</DialogTitle>
          <DialogDescription>
            Please let us know why you're reporting this {getContentTypeLabel()}. Our team will review your report and
            take appropriate action.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="content-title" className="text-muted-foreground">
                Content being reported:
              </Label>
              <div id="content-title" className="text-sm font-medium">
                {contentTitle}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for reporting</Label>
              <RadioGroup id="reason" value={reason} onValueChange={setReason} className="gap-3">
                {getReportReasons().map((reportReason) => (
                  <div key={reportReason.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={reportReason.id} id={reportReason.id} />
                    <Label htmlFor={reportReason.id}>{reportReason.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="details">Additional details (optional)</Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please provide any additional information that might help us understand the issue."
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!reason || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
