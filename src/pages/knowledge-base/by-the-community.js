import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CommunityResourcesList from "@/components/community/CommunityResourcesList"
import { UsersIcon } from "lucide-react"

export default function CommunityResourcesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UsersIcon className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-3xl">Community Resources</CardTitle>
              <CardDescription>Discover valuable resources contributed by our community members</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>
            These resources have been submitted by members of our community and approved by our team. They represent a
            diverse collection of knowledge and tools to help you on your AI journey.
          </p>
        </CardContent>
      </Card>

      <CommunityResourcesList />
    </div>
  )
}

