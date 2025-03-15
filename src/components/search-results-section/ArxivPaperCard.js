import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, HeartIcon, UsersIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const ArxivPaperCard = ({ paper }) => {
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
            const bookmark = bookmarks.find((b) => b.url === paper.link && b.resource_type === "research paper")
  
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

  const truncateSummary = (summary, maxLength = 350) => {
    if (summary.length <= maxLength) return summary
    return summary.slice(0, maxLength).trim() + "..."
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
            url: paper.link,
            title: paper.title,
            description: paper.summary || "No description available",
            resource_type: "research paper",
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


  return (
    <Card className="mb-4 relative">
      <CardHeader className="pb-2">
        <div>
          <Badge className="mb-2 bg-green-500 text-white">Research Paper</Badge>
          <CardTitle className="text-lg">
            <a href={paper.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {paper.title}
            </a>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-2">
          <div className="flex items-center">
            <UsersIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">{paper.authors.join(", ")}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">{new Date(paper.published_date).toLocaleDateString()}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{truncateSummary(paper.summary)}</p>
        <div className="flex flex-wrap gap-2">
          {paper.categories &&
            paper.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
        </div>
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

export default ArxivPaperCard

