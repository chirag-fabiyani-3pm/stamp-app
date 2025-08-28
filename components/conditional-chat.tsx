"use client"

import { PhilaGuideChat } from "@/components/philaguide-chat"
import { isUserLoggedIn } from "@/lib/client/auth-utils"

export function ConditionalChat() {
  // Only render the chat if the user is logged in
  if (!isUserLoggedIn()) {
    return null
  }

  return <PhilaGuideChat />
}



