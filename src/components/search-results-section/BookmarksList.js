"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  BookmarkIcon,
  GithubIcon,
  FileTextIcon,
  BookOpenIcon,
  NewspaperIcon,
  TrashIcon,
  ExternalLinkIcon,
} from "lucide-react"
import Cookies from "js-cookie"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const BookmarksList = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const itemsPerPage = 10

  // Get auth token from cookies or localStorage
  const getAuthToken = () => {
      return Cookies.get("auth_token") || localStorage.getItem("auth_token") || Cookies.get("user_id") || localStorage.getItem("user_id")
  }

  // Fetch bookmarks
  const fetchBookmarks = async (page = 1) => {
    setIsLoading(true)
    setError(null)

    try {
      const skip = (page - 1) * itemsPerPage
      const response = await fetch(`${API_URL}/bookmarks?skip=${skip}&limit=${itemsPerPage}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks")
      }

      const data = await response.json()

      // Check if there are more bookmarks to load
      setHasMore(data.length === itemsPerPage)

      if (page === 1) {
        setBookmarks(data)
      } else {
        setBookmarks((prev) => [...prev, ...data])
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
      setError(error.message)
      toast.error("Failed to load bookmarks")
    } finally {
      setIsLoading(false)
    }
  }

  // Load more bookmarks
  const loadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchBookmarks(nextPage)
  }

  // Delete bookmark
  const deleteBookmark = async (id) => {
    try {
      const response = await fetch(`${API_URL}/bookmarks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete bookmark")
      }

      // Remove the deleted bookmark from state
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id))
      toast.success("Bookmark removed successfully")
    } catch (error) {
      console.error("Error deleting bookmark:", error)
      toast.error("Failed to remove bookmark")
    }
  }

  // Group bookmarks by resource type
  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    const type = bookmark.resource_type || "other"
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(bookmark)
    return acc
  }, {})

  // Get all unique resource types
  const resourceTypes = Object.keys(groupedBookmarks)

  // Initial fetch
  useEffect(() => {
    fetchBookmarks()
  }, [])

  // Get icon based on resource type
  const getResourceIcon = (type) => {
    switch (type.toLowerCase()) {
      case "github":
      case "github_repository":
        return <GithubIcon className="h-4 w-4" />
      case "research paper":
      case "arxiv_paper":
        return <FileTextIcon className="h-4 w-4" />
      case "tutorial":
        return <BookOpenIcon className="h-4 w-4" />
      case "blog":
        return <NewspaperIcon className="h-4 w-4" />
      default:
        return <BookmarkIcon className="h-4 w-4" />
    }
  }

  // Get color based on resource type
  const getResourceColor = (type) => {
    switch (type.toLowerCase()) {
      case "github":
      case "github_repository":
        return "bg-gray-800 text-white"
      case "research paper":
      case "arxiv_paper":
        return "bg-purple-600 text-white"
      case "tutorial":
        return "bg-blue-600 text-white"
      case "blog":
        return "bg-orange-500 text-white"
      default:
        return "bg-green-600 text-white"
    }
  }

  // Truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  if (error && !bookmarks.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Bookmarks</CardTitle>
          <CardDescription>Your saved resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground text-sm sm:text-base mb-4">Failed to load bookmarks: {error}</p>
            <Button onClick={() => fetchBookmarks()} className="text-sm sm:text-base">Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg sm:text-2xl">
          <BookmarkIcon className="mr-2 h-5 w-5" />
          Bookmarks
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">Your saved resources</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && !bookmarks.length ? (
          // Loading skeletons
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-10">
            <BookmarkIcon className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm sm:text-base">You don't have any bookmarks yet</p>
          </div>
        ) : (
          // Bookmarks list with tabs
          <Tabs defaultValue={resourceTypes[0] || "all"}>
            <TabsList className="mb-4 flex-wrap grid grid-cols-2 sm:flex h-auto">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
              {resourceTypes.map((type) => (
                <TabsTrigger key={type} value={type} className="text-xs sm:text-sm">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-3 sm:space-y-4">
                {bookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={deleteBookmark}
                    getResourceIcon={getResourceIcon}
                    getResourceColor={getResourceColor}
                    truncateText={truncateText}
                  />
                ))}
              </div>
            </TabsContent>

            {resourceTypes.map((type) => (
              <TabsContent key={type} value={type}>
                <div className="space-y-3 sm:space-y-4">
                  {groupedBookmarks[type].map((bookmark) => (
                    <BookmarkCard
                      key={bookmark.id}
                      bookmark={bookmark}
                      onDelete={deleteBookmark}
                      getResourceIcon={getResourceIcon}
                      getResourceColor={getResourceColor}
                      truncateText={truncateText}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Load more button */}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={loadMore} disabled={isLoading} className="text-xs sm:text-sm">
              {isLoading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Bookmark Card Component
const BookmarkCard = ({ bookmark, onDelete, getResourceIcon, getResourceColor, truncateText }) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 p-3 sm:p-4">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${getResourceColor(bookmark.resource_type)} text-xs sm:text-sm`}>
              <span className="flex items-center gap-1">
                {getResourceIcon(bookmark.resource_type)}
                <span className="hidden sm:inline">{bookmark.resource_type}</span>
              </span>
            </Badge>
          </div>

          <h3 className="font-medium text-sm sm:text-lg mb-1 line-clamp-2">
            <Link
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              {truncateText(bookmark.title, 100)}
              <ExternalLinkIcon className="h-3 w-3 flex-shrink-0" />
            </Link>
          </h3>

          {bookmark.description && (
            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">{truncateText(bookmark.description, 200)}</p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
          onClick={() => onDelete(bookmark.id)}
          title="Remove bookmark"
        >
          <TrashIcon className="h-4 w-4" />
          <span className="sr-only">Remove bookmark</span>
        </Button>
      </div>
    </Card>
  )
}

export default BookmarksList

