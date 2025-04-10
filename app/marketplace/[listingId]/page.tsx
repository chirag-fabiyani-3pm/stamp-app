import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TradeOfferForm from "@/components/trade-offer-form"
import BidForm from "@/components/bid-form"
import { ReportDialog } from "@/components/report-dialog"
import { AuthenticationStatusBadge } from "@/components/authentication/authentication-status"
import { ReviewerBadge } from "@/components/authentication/reviewer-badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2, Eye, ShieldCheck, Users } from "lucide-react"

// This would typically come from a database
const getListingData = (listingId: string) => {
  // Skip processing if the ID is "create" to prevent conflict with the create route
  if (listingId === "create") {
    return null
  }

  // Sample data for demonstration
  const id = listingId

  const listings = {
    "1": {
      id: 1,
      title: "Silver Jubilee 1935 - New Zealand",
      type: "Trade",
      price: null,
      condition: "Excellent",
      description:
        "I'm offering this beautiful Silver Jubilee stamp from New Zealand in excellent condition. Looking to trade for stamps from Australia or United Kingdom from the same era.",
      tradePreferences: "Interested in Australian stamps from 1930-1940 or UK Coronation series.",
      seller: {
        name: "StampCollector123",
        avatar: "/placeholder.svg?height=40&width=40&text=SC",
        rating: 4.8,
        memberSince: "March 2023",
        completedTrades: 27,
      },
      image: "/silver-jubilee.jpg",
      stampDetails: {
        country: "New Zealand",
        year: 1935,
        denomination: "1d",
        color: "Red",
        catalogReference: "SG 573, Scott 185",
      },
      listedDate: "2025-03-01",
      views: 142,
    },
    "2": {
      id: 2,
      title: "Coronation Series 1953 - UK",
      type: "Sale",
      price: 45.0,
      condition: "Good",
      description:
        "For sale: UK Coronation Series stamp from 1953 in good condition. Minor wear on edges but overall a fine example of this historic stamp.",
      minimumBid: 45.0,
      currentBid: 52.5,
      numberOfBids: 3,
      auctionEnds: "2025-04-15T23:59:59",
      seller: {
        name: "VintageStamps",
        avatar: "/placeholder.svg?height=40&width=40&text=VS",
        rating: 4.9,
        memberSince: "January 2022",
        completedTrades: 86,
      },
      image: "/coronation-series.jpg",
      stampDetails: {
        country: "United Kingdom",
        year: 1953,
        denomination: "3d",
        color: "Deep Lilac",
        catalogReference: "SG 532, Scott 313",
      },
      listedDate: "2025-03-10",
      views: 98,
    },
    "3": {
      id: 3,
      title: "Independence Issue 1947 - India",
      type: "Trade",
      price: null,
      condition: "Fair",
      description:
        "Looking to trade this historical Independence Issue stamp from India. It's in fair condition with some aging but still a valuable piece for collectors interested in Indian postal history.",
      tradePreferences: "Interested in stamps from other newly independent nations from the 1940s-1950s period.",
      seller: {
        name: "StampExpert",
        avatar: "/placeholder.svg?height=40&width=40&text=SE",
        rating: 4.7,
        memberSince: "August 2023",
        completedTrades: 15,
      },
      image: "/independence-issue.jpg",
      stampDetails: {
        country: "India",
        year: 1947,
        denomination: "1 Anna",
        color: "Deep Green",
        catalogReference: "SG 301, Scott 200",
      },
      listedDate: "2025-02-25",
      views: 76,
    },
  }

  return listings[id as keyof typeof listings] || null
}

type Props = {
  params: { listingId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listingData = getListingData(params.listingId)

  if (!listingData) {
    return {
      title: "Listing Not Found - Stamps of Approval",
      description: "The requested marketplace listing could not be found",
    }
  }

  return {
    title: `${listingData.title} - Stamps of Approval Marketplace`,
    description: `${listingData.type === "Trade" ? "Trade for" : "Purchase"} ${listingData.title} in ${listingData.condition} condition`,
  }
}

export default function ListingDetailPage({ params }: Props) {
  const listingData = getListingData(params.listingId)

  if (!listingData) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
        <p className="text-muted-foreground mb-6">The marketplace listing you're looking for could not be found.</p>
        <Link href="/marketplace">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Marketplace
          </Button>
        </Link>
      </div>
    )
  }

  // Format auction end date if it exists
  const auctionEndsDate = listingData.auctionEnds ? new Date(listingData.auctionEnds) : null

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Link href="/marketplace">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Marketplace
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
          <div className="bg-background p-6 rounded-lg shadow-md">
            <div className="aspect-square relative mb-4">
              <img
                src={listingData.image || "/placeholder.svg"}
                alt={listingData.title}
                className="object-contain w-full h-full"
              />
              <Badge
                className={`absolute top-2 right-2 ${listingData.type === "Trade" ? "bg-blue-500" : "bg-green-500"}`}
              >
                {listingData.type}
              </Badge>
            </div>
          </div>

          <div className="bg-background p-6 rounded-lg shadow-md">
            <h3 className="font-medium mb-3">Stamp Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Country</h4>
                <p>{listingData.stampDetails.country}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Year</h4>
                <p>{listingData.stampDetails.year}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Denomination</h4>
                <p>{listingData.stampDetails.denomination}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Color</h4>
                <p>{listingData.stampDetails.color}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground">Catalog Reference</h4>
                <p>{listingData.stampDetails.catalogReference}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-background p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">{listingData.title}</h1>
              <Badge>{listingData.condition}</Badge>
            </div>

            {listingData.type === "Sale" && (
              <div className="mb-4">
                {listingData.currentBid ? (
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Current Bid</span>
                    <span className="text-2xl font-bold text-primary">${listingData.currentBid.toFixed(2)}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{listingData.numberOfBids} bids</span>
                      {auctionEndsDate && <span>· Ends {formatDate(auctionEndsDate)}</span>}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="text-2xl font-bold text-primary">${listingData.price?.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p>{listingData.description}</p>
            </div>

            {listingData.type === "Trade" && listingData.tradePreferences && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Trade Preferences</h3>
                <p>{listingData.tradePreferences}</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t">
              <Avatar>
                <AvatarImage src={listingData.seller.avatar} alt={listingData.seller.name} />
                <AvatarFallback>{listingData.seller.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{listingData.seller.name}</div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-amber-500">★</span>
                  <span>{listingData.seller.rating}</span>
                  <span className="text-muted-foreground">· {listingData.seller.completedTrades} trades</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="ml-auto gap-1">
                <MessageSquare className="h-3 w-3" /> Message
              </Button>
            </div>

            <div className="flex justify-end mt-4">
              <ReportDialog contentType="listing" contentId={listingData.id} contentTitle={listingData.title} />
            </div>
          </div>

          <div className="bg-background p-6 rounded-lg shadow-md">
            <Tabs defaultValue={listingData.type === "Trade" ? "make-offer" : "place-bid"}>
              <TabsList className="grid w-full grid-cols-2">
                {listingData.type === "Trade" ? (
                  <>
                    <TabsTrigger value="make-offer">Make Trade Offer</TabsTrigger>
                    <TabsTrigger value="contact">Contact Seller</TabsTrigger>
                  </>
                ) : (
                  <>
                    <TabsTrigger value="place-bid">Place Bid/Buy</TabsTrigger>
                    <TabsTrigger value="contact">Contact Seller</TabsTrigger>
                  </>
                )}
              </TabsList>

              {listingData.type === "Trade" ? (
                <TabsContent value="make-offer" className="pt-4">
                  <TradeOfferForm listing={listingData} />
                </TabsContent>
              ) : (
                <TabsContent value="place-bid" className="pt-4">
                  <BidForm listing={listingData} />
                </TabsContent>
              )}

              <TabsContent value="contact" className="pt-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Have questions about this listing? Send a message directly to the seller.
                  </p>
                  <textarea
                    className="w-full border rounded-md p-3 h-32 resize-none"
                    placeholder="Type your message here..."
                  ></textarea>
                  <Button className="w-full">Send Message</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Authentication Status</h2>
          <Link href={`/marketplace/${params.listingId}/authenticate`}>
            <Button className="gap-2">
              <ShieldCheck className="h-4 w-4" /> Authenticate This Stamp
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Stamp Authentication</CardTitle>
                <CardDescription>Verification of this stamp's authenticity by community experts</CardDescription>
              </div>
              <AuthenticationStatusBadge status="pending" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-amber-200">
                  <AvatarImage src="/placeholder.svg?height=40&width=40&text=SE" alt="StampExpert" />
                  <AvatarFallback>SE</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">StampExpert</span>
                    <ReviewerBadge level="master" size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground">Primary authenticator</p>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Authenticated as genuine</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This stamp has been authenticated as a genuine example of the Silver Jubilee 1935 issue from New
                  Zealand. The perforations, paper quality, and printing details all match authentic specimens.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 text-sm bg-muted/30 px-3 py-1 rounded-full">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>3 authenticators</span>
                </div>
                <div className="flex items-center gap-1 text-sm bg-muted/30 px-3 py-1 rounded-full">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Authenticated on March 15, 2025</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 flex justify-between">
            <p className="text-sm text-muted-foreground">
              Authentication helps ensure the legitimacy of stamps in our marketplace
            </p>
            <Link href={`/marketplace/${params.listingId}/authenticate`}>
              <Button variant="link" size="sm" className="gap-1">
                <Eye className="h-3.5 w-3.5" /> View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
