import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { HeartIcon } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const BlogCard = ({ blog }) => {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Get auth token from cookies or localStorage
  const getAuthToken = () => {
      return Cookies.get("auth_token") || localStorage.getItem("auth_token") || Cookies.get("user_id") || localStorage.getItem("user_id")
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
          const bookmark = bookmarks.find((b) => b.url === blog.url && b.resource_type === "blog")

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
  }, [])


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
            toast.success("Resource has been removed from your bookmarks")
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
              url: blog.url,
              title: blog.title,
              description: blog.description || "No description available",
              resource_type: "blog",
            }),
            credentials: "include",
          })
  
          if (response.ok) {
            const data = await response.json()
            setIsBookmarked(true)
            setBookmarkId(data.id)
            toast.success("Resource has been added to your bookmarks")
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

  const truncateSummary = (summary, maxLength = 400) => {
    if (summary.length <= maxLength) return summary
    return summary.slice(0, maxLength).trim() + "..."
  }

  return (
    <Card className="mb-3 sm:mb-4 relative">
      <CardHeader className="pb-2 sm:pb-3">
        <div>
          <Badge className="mb-2 bg-green-500 text-white text-xs sm:text-sm">Blog</Badge>
          <CardTitle className="text-base sm:text-lg">
            <a href={blog.url} target="_blank" rel="noopener noreferrer" className="hover:underline break-words">
              {blog.title}
            </a>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">{truncateSummary(blog.description)}</p>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {blog.categories &&
            blog.categories.slice(0, 4).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs sm:text-sm">
                {category}
              </Badge>
            ))}
        </div>

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

export default BlogCard

