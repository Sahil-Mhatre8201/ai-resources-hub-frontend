"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarIcon, HeartIcon } from "lucide-react"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Cookies from "js-cookie"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const RepositoryCard = ({ repo }) => {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Get auth token from cookies or localStorage
  const getAuthToken = () => {
    return Cookies.get("auth_token") || localStorage.getItem("auth_token")
  }

  // Check if the repository is already bookmarked on component mount
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        // Use the correct endpoint for getting user bookmarks
        const response = await fetch(`${API_URL}/bookmarks?limit=100`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
          credentials: "include",
        })

        if (response.ok) {
          const bookmarks = await response.json()
          // Find if this repo is bookmarked
          const bookmark = bookmarks.find((b) => b.url === repo.url && b.resource_type === "github")

          if (bookmark) {
            setIsBookmarked(true)
            setBookmarkId(bookmark.id)
          }
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error)
        // Don't show error toast here as it's just a check
      }
    }

    checkBookmarkStatus()
  }, [repo.url])

  const handleClick = () => {
    router.push(`/github/repo-details?owner=${repo.owner}&repo=${repo.name}`)
  }

  const handleBookmarkToggle = async (e) => {
    e.stopPropagation() // Prevent card click

    setIsLoading(true)

    try {
      if (isBookmarked) {
        // Unbookmark
        const response = await fetch(`${API_URL}/bookmarks/${bookmarkId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
          credentials: "include",
        })

        if (response.ok) {
          setIsBookmarked(false)
          setBookmarkId(null)
          toast.success("Repository has been removed from your bookmarks")
        } else {
          throw new Error("Failed to remove bookmark")
        }
      } else {
        // Bookmark
        const response = await fetch(`${API_URL}/bookmarks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            url: repo.url,
            title: repo.full_name,
            description: repo.description || "No description available",
            resource_type: "github",
          }),
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setIsBookmarked(true)
          setBookmarkId(data.id)
          toast.success("Repository has been added to your bookmarks")
        } else {
          throw new Error("Failed to add bookmark")
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      toast.error(error.message || "Failed to update bookmark")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card onClick={handleClick} className="mb-4 relative cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className="mb-2 bg-green-500 text-white">GitHub</Badge>
            <CardTitle className="text-lg">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking the link
              >
                {repo.full_name}
              </a>
            </CardTitle>
          </div>
          <Badge variant="secondary" className="w-max">
            {repo.language}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {repo.description
            ? repo.description.length > 350
              ? `${repo.description.slice(0, 350)}...`
              : repo.description
            : "No description available"}
        </p>
        <div className="flex items-center space-x-2 mb-4">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <span>{repo.stars.toLocaleString()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {repo.contributors.slice(0, 5).map((contributor) => (
            <Avatar key={contributor.username} className="w-8 h-8">
              <AvatarImage src={contributor.avatar_url} alt={contributor.username} />
              <AvatarFallback>{contributor.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          ))}
        </div>

        {/* Bookmark button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 rounded-full"
          onClick={handleBookmarkToggle}
          disabled={isLoading}
        >
          <HeartIcon
            className={`h-5 w-5 ${isBookmarked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`}
          />
          <span className="sr-only">{isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}</span>
        </Button>
      </CardContent>
    </Card>
  )
}

export default RepositoryCard

