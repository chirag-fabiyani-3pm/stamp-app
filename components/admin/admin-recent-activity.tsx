import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Sample data for recent activity
const recentActivity = [
  {
    id: 1,
    user: {
      name: "StampCollector123",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
    },
    action: "created a new listing",
    target: "Silver Jubilee 1935 - New Zealand",
    time: "10 minutes ago",
    type: "listing",
  },
  {
    id: 2,
    user: {
      name: "AdminUser",
      avatar: "/placeholder.svg?height=40&width=40&text=AU",
    },
    action: "approved an authentication review",
    target: "King George V Definitive Series",
    time: "15 minutes ago",
    type: "authentication",
  },
  {
    id: 3,
    user: {
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
    },
    action: "submitted an authentication review",
    target: "1922 Peace and Commerce Issue - France",
    time: "20 minutes ago",
    type: "authentication",
  },
  {
    id: 4,
    user: {
      name: "AdminUser",
      avatar: "/placeholder.svg?height=40&width=40&text=AU",
    },
    action: "approved a listing",
    target: "Coronation Series 1953 - UK",
    time: "25 minutes ago",
    type: "moderation",
  },
  {
    id: 5,
    user: {
      name: "NewCollector",
      avatar: "/placeholder.svg?height=40&width=40&text=NC",
    },
    action: "registered a new account",
    target: "",
    time: "1 hour ago",
    type: "user",
  },
  {
    id: 6,
    user: {
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
    },
    action: "reported content",
    target: "Potentially counterfeit stamp listing",
    time: "1 hour ago",
    type: "report",
  },
  {
    id: 7,
    user: {
      name: "CollectorPro",
      avatar: "/placeholder.svg?height=40&width=40&text=CP",
    },
    action: "created a new topic",
    target: "Best storage methods for preserving stamp condition",
    time: "2 hours ago",
    type: "community",
  },
]

export default function AdminRecentActivity() {
  // Function to get badge color based on activity type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "listing":
        return "default"
      case "moderation":
        return "secondary"
      case "user":
        return "outline"
      case "report":
        return "destructive"
      case "community":
        return "default"
      case "transaction":
        return "outline"
      case "system":
        return "secondary"
      case "authentication":
        return "purple"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      {recentActivity.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{activity.user.name}</span>
              <Badge
                variant={
                  activity.type === "authentication"
                    ? "secondary"
                    : getBadgeVariant(activity.type) === "purple"
                      ? "secondary"
                      : getBadgeVariant(activity.type)
                }
                className={
                  activity.type === "authentication" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" : ""
                }
              >
                {activity.type}
              </Badge>
            </div>

            <p className="text-sm">
              {activity.action}
              {activity.target && <span className="font-medium"> {activity.target}</span>}
            </p>

            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
