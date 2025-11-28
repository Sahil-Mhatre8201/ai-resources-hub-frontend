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
    return Cookies.get("user_id") || localStorage.getItem("user_id")
  }

  console.log("auth token", getAuthToken())

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
    <Card onClick={handleClick} className="mb-3 sm:mb-4 relative cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3">
          <div className="flex-1">
            <Badge className="mb-2 bg-green-500 text-white text-xs sm:text-sm">GitHub</Badge>
            <CardTitle className="text-base sm:text-lg">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline break-words"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking the link
              >
                {repo.full_name}
              </a>
            </CardTitle>
          </div>
          <Badge variant="secondary" className="w-max text-xs sm:text-sm flex-shrink-0">
            {repo.language}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
          {repo.description
            ? repo.description.length > 350
              ? `${repo.description.slice(0, 350)}...`
              : repo.description
            : "No description available"}
        </p>
        <div className="flex items-center space-x-2 mb-3 sm:mb-4">
          <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          <span className="text-xs sm:text-sm">{repo.stars.toLocaleString()}</span>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {repo.contributors.slice(0, 5).map((contributor) => (
            <Avatar key={contributor.username} className="w-6 h-6 sm:w-8 sm:h-8">
              <AvatarImage src={contributor.avatar_url} alt={contributor.username} />
              <AvatarFallback className="text-xs">{contributor.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          ))}
        </div>

        {/* Bookmark button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 rounded-full h-8 w-8 sm:h-9 sm:w-9"
          onClick={handleBookmarkToggle}
          disabled={isLoading}
        >
          <HeartIcon
            className={`h-4 w-4 sm:h-5 sm:w-5 ${isBookmarked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`}
          />
          <span className="sr-only">{isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}</span>
        </Button>
      </CardContent>
    </Card>
  )
}

export default RepositoryCard

