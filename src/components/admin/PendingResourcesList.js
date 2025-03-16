"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  FileTextIcon,
  GithubIcon,
  BookOpenIcon,
  GraduationCapIcon,
  NewspaperIcon,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Cookies from "js-cookie"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const PendingResourcesList = () => {
  const [resources, setResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingIds, setProcessingIds] = useState([])

  // Get auth token from cookies or localStorage
  const getAuthToken = () => {
    return Cookies.get("auth_token") || localStorage.getItem("auth_token")
  }

  // Fetch pending resources
  const fetchPendingResources = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Directly call your backend API
      const response = await fetch(`${API_URL}/uploads/pending_approval`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch pending resources")
      }

      const data = await response.json()
      setResources(data)
    } catch (error) {
      console.error("Error fetching pending resources:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Update resource status
  const updateResourceStatus = async (id, status) => {
    // Add to processing state
    setProcessingIds((prev) => [...prev, id])

    try {
      // Directly call your backend API with the correct method and parameters
      // Using PUT method and passing status as a query parameter
      const response = await fetch(`${API_URL}/uploads/${id}/status?status_update=${status}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Failed to ${status} resource`)
      }

      // Remove from list
      setResources((prev) => prev.filter((resource) => resource.id !== id))

      // Show success message
      toast.success(`Resource ${status === "approved" ? "approved" : "rejected"} successfully`)
    } catch (error) {
      console.error(`Error ${status} resource:`, error)
      toast.error(error.message)
    } finally {
      // Remove from processing state
      setProcessingIds((prev) => prev.filter((itemId) => itemId !== id))
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPendingResources()
  }, [])

  // Get icon based on resource type
  const getResourceIcon = (type) => {
    switch (type.toLowerCase()) {
      case "github":
        return <GithubIcon className="h-5 w-5" />
      case "research paper":
        return <FileTextIcon className="h-5 w-5" />
      case "tutorial":
        return <BookOpenIcon className="h-5 w-5" />
      case "course":
        return <GraduationCapIcon className="h-5 w-5" />
      case "blog":
        return <NewspaperIcon className="h-5 w-5" />
      default:
        return <FileTextIcon className="h-5 w-5" />
    }
  }

  // Get color based on resource type
  const getResourceColor = (type) => {
    switch (type.toLowerCase()) {
      case "github":
        return "bg-gray-800 text-white"
      case "research paper":
        return "bg-purple-600 text-white"
      case "tutorial":
        return "bg-blue-600 text-white"
      case "course":
        return "bg-green-600 text-white"
      case "blog":
        return "bg-orange-500 text-white"
      default:
        return "bg-slate-600 text-white"
    }
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading pending resources: {error}
          <Button variant="outline" size="sm" className="ml-4" onClick={fetchPendingResources}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pending Resources</CardTitle>
        <CardDescription>Review and approve user-submitted resources</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loading skeletons
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-muted-foreground">No pending resources to review</p>
            <p className="text-sm text-muted-foreground mt-1">All caught up! Check back later for new submissions.</p>
          </div>
        ) : (
          // Resources list
          <div className="space-y-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getResourceColor(resource.resource_type)}>
                      <span className="flex items-center">
                        {getResourceIcon(resource.resource_type)}
                        <span className="ml-1">{resource.resource_type}</span>
                      </span>
                    </Badge>
                    <Badge variant="outline" className="ml-auto">
                      User ID: {resource.user_id}
                    </Badge>
                  </div>

                  <h3 className="font-medium text-lg mb-2">{resource.title}</h3>

                  {resource.description && <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>}

                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => updateResourceStatus(resource.id, "rejected")}
                      disabled={processingIds.includes(resource.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                      onClick={() => updateResourceStatus(resource.id, "approved")}
                      disabled={processingIds.includes(resource.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Refresh button */}
        {!isLoading && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={fetchPendingResources}>
              Refresh List
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PendingResourcesList

