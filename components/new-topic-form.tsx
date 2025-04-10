"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Upload, X } from "lucide-react"

export default function NewTopicForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // In a real app, we would upload these to a server
    // For this demo, we'll just create object URLs
    const newAttachments = Array.from(files).map((file) => URL.createObjectURL(file))
    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/community?success=true")
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Topic Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a descriptive title for your topic"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={handleCategoryChange} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="identification">Stamp Identification</SelectItem>
              <SelectItem value="valuation">Valuation & Appraisal</SelectItem>
              <SelectItem value="preservation">Preservation & Storage</SelectItem>
              <SelectItem value="trading">Trading & Selling</SelectItem>
              <SelectItem value="events">Events & Exhibitions</SelectItem>
              <SelectItem value="technology">Technology & Tools</SelectItem>
              <SelectItem value="general">General Discussion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted p-2 border-b flex justify-between items-center">
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
                  B
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 px-2 italic">
                  I
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 px-2 underline">
                  U
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
                  Link
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-1" /> Attach
              </Button>
              <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full p-3 h-64 resize-none border-0 focus:outline-none"
              placeholder="Share your thoughts, questions, or knowledge with the community..."
              required
            ></textarea>
          </div>
        </div>

        {attachments.length > 0 && (
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {attachments.map((attachment, index) => (
                <div key={index} className="relative">
                  <img
                    src={attachment || "/placeholder.svg"}
                    alt={`Attachment ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox id="notifications" />
          <label htmlFor="notifications" className="text-sm">
            Notify me of replies to this topic
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/community")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Topic
            </>
          ) : (
            "Create Topic"
          )}
        </Button>
      </div>
    </form>
  )
}
