"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  AlertCircle,
  FileTextIcon,
  GithubIcon,
  BookOpenIcon,
  GraduationCapIcon,
  NewspaperIcon,
  ExternalLinkIcon,
  BookIcon,
  RefreshCwIcon,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const CommunityResourcesList = () => {
  const [resources, setResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch approved resources
  const fetchApprovedResources = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/uploads/approved`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch community resources")
      }

      const data = await response.json()
      setResources(data)
    } catch (error) {
      console.error("Error fetching community resources:", error)
      setError(error.message)
      toast.error("Failed to load community resources")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchApprovedResources()
  }, [])

  // Get icon based on resource type
  const getResourceIcon = (type) => {
    switch (type.toLowerCase()) {
      case "github repo":
      case "github repository":
        return <GithubIcon className="h-5 w-5" />
      case "research paper":
        return <FileTextIcon className="h-5 w-5" />
      case "tutorial":
        return <BookOpenIcon className="h-5 w-5" />
      case "course":
        return <GraduationCapIcon className="h-5 w-5" />
      case "blog":
        return <NewspaperIcon className="h-5 w-5" />
      case "handbook":
        return <BookIcon className="h-5 w-5" />
      default:
        return <FileTextIcon className="h-5 w-5" />
    }
  }

  // Get color based on resource type
  const getResourceColor = (type) => {
    switch (type.toLowerCase()) {
      case "github repo":
      case "github repository":
        return "bg-gray-800 text-white"
      case "research paper":
        return "bg-purple-600 text-white"
      case "tutorial":
        return "bg-blue-600 text-white"
      case "course":
        return "bg-green-600 text-white"
      case "blog":
        return "bg-orange-500 text-white"
      case "handbook":
        return "bg-teal-600 text-white"
      default:
        return "bg-slate-600 text-white"
    }
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading community resources: {error}
          <Button variant="outline" size="sm" className="ml-4" onClick={fetchApprovedResources}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="w-full">
      {isLoading ? (
        // Loading skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : resources.length === 0 ? (
        // Empty state
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpenIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No community resources yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to contribute a resource to our community collection!
            </p>
            <Button asChild>
              <Link href="/upload-resource">Submit a Resource</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Resources grid
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                getResourceIcon={getResourceIcon}
                getResourceColor={getResourceColor}
              />
            ))}
          </div>

          {/* Refresh button */}
          <div className="flex justify-center mt-10">
            <Button variant="outline" onClick={fetchApprovedResources} className="gap-2">
              <RefreshCwIcon className="h-4 w-4" />
              Refresh Resources
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

// Resource Card Component
const ResourceCard = ({ resource, getResourceIcon, getResourceColor }) => {
  // Check if the resource has a URL
  const hasUrl = resource.url && (resource.url.startsWith("http://") || resource.url.startsWith("https://"))

  // Handle card click to open URL in new window
  const handleCardClick = () => {
    if (hasUrl) {
      window.open(resource.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Card
      className={`overflow-hidden h-full flex flex-col transition-shadow ${hasUrl ? "hover:shadow-md cursor-pointer" : ""}`}
      onClick={hasUrl ? handleCardClick : undefined}
    >
      <CardHeader className="pb-2">
        <Badge className={`w-max mb-2 ${getResourceColor(resource.resource_type)}`}>
          <span className="flex items-center">
            {getResourceIcon(resource.resource_type)}
            <span className="ml-1">{resource.resource_type}</span>
          </span>
        </Badge>
        <CardTitle className="text-lg">
          {hasUrl ? (
            <Link
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-start gap-1 group"
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking the link
            >
              {resource.title}
              <ExternalLinkIcon className="h-4 w-4 inline opacity-70 group-hover:opacity-100" />
            </Link>
          ) : (
            resource.title
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {resource.description ? (
          <p className="text-muted-foreground text-sm">{resource.description}</p>
        ) : (
          <p className="text-muted-foreground text-sm italic">No description provided</p>
        )}
      </CardContent>
      <div className="px-6 pb-4 mt-auto flex justify-between items-center">
        <div className="text-xs text-muted-foreground">Contributed by user #{resource.user_id}</div>
        {hasUrl && <div className="text-xs text-primary">Click to open</div>}
      </div>
    </Card>
  )
}

export default CommunityResourcesList

