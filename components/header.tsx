import Link from "next/link"
import { Stamp } from "lucide-react"
import { HeaderActions } from "./header-actions"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Stamp className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block text-primary">Stamps of Approval</span>
        </Link>
        <HeaderActions />
      </div>
    </header>
  )
}
