"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Upload, LinkIcon } from "lucide-react"

interface TopicReplyFormProps {
  topicId: number
}

export default function TopicReplyForm({ topicId }: TopicReplyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [content, setContent] = useState<string>("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)

      // Reset success message after a delay
      setTimeout(() => {
        setSuccess(false)
        // Clear the form
        setContent("")
      }, 3000)
    }, 1500)
  }

  // Function to apply formatting to selected text
  const applyFormatting = (formatType: "bold" | "italic" | "underline" | "link") => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let formattedText = ""
    let cursorOffset = 0

    switch (formatType) {
      case "bold":
        formattedText = `**${selectedText}**`
        cursorOffset = 2
        break
      case "italic":
        formattedText = `*${selectedText}*`
        cursorOffset = 1
        break
      case "underline":
        formattedText = `<u>${selectedText}</u>`
        cursorOffset = 3
        break
      case "link":
        const url = prompt("Enter URL:", "https://")
        if (url) {
          formattedText = `[${selectedText || "Link text"}](${url})`
          cursorOffset = 1
        } else {
          return // User cancelled
        }
        break
    }

    // Insert the formatted text
    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)

    // Set focus back to textarea and position cursor after the insertion
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = selectedText ? start + formattedText.length : start + cursorOffset
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">Your reply has been posted successfully!</div>
      )}

      <div className="border rounded-md overflow-hidden">
        <div className="bg-muted p-2 border-b flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 font-bold"
              onClick={() => applyFormatting("bold")}
            >
              B
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 italic"
              onClick={() => applyFormatting("italic")}
            >
              I
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 underline"
              onClick={() => applyFormatting("underline")}
            >
              U
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => applyFormatting("link")}
            >
              <LinkIcon className="h-4 w-4" />
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
          <input id="file-upload" type="file" accept="image/*" className="hidden" />
        </div>
        <textarea
          id="reply-content"
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 h-40 resize-none border-0 focus:outline-none"
          placeholder="Share your thoughts or knowledge on this topic..."
          required
        ></textarea>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="notifications" />
        <label htmlFor="notifications" className="text-sm">
          Notify me of further replies to this topic
        </label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting Reply
            </>
          ) : (
            "Post Reply"
          )}
        </Button>
      </div>
    </form>
  )
}
