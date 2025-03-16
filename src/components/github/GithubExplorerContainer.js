"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { GithubIcon, SearchIcon, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import RepositoryCard from "../search-results-section/RepositoryCard"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const DEFAULT_QUERY = "artificial intelligence"
const RESULTS_PER_PAGE = 10

const GitHubExplorerContainer = () => {
  const [searchQuery, setSearchQuery] = useState(DEFAULT_QUERY)
  const [inputValue, setInputValue] = useState(DEFAULT_QUERY)
  const [repositories, setRepositories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch repositories based on search query and page
  const fetchRepositories = async (query, page = 1) => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${API_URL}/search-ai-repos?q=${encodeURIComponent(query)}&max_results=${RESULTS_PER_PAGE}&page=${page}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch repositories")
      }

      const data = await response.json()
      setRepositories(data.repos)

      // Calculate total pages (assuming GitHub API provides total_count)
      // If not provided, we'll just enable/disable next button based on results length
      if (data.total_count) {
        setTotalPages(Math.ceil(data.total_count / RESULTS_PER_PAGE))
      } else {
        // If we got fewer results than the max, we're on the last page
        setTotalPages(data.repos.length < RESULTS_PER_PAGE ? page : page + 1)
      }

      setCurrentPage(page)
    } catch (error) {
      console.error("Error fetching repositories:", error)
      setError(error.message)
      toast.error("Failed to load repositories")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(inputValue)
    setCurrentPage(1) // Reset to first page on new search
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchRepositories(searchQuery, page)
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Initial fetch on component mount and when search query changes
  useEffect(() => {
    fetchRepositories(searchQuery, currentPage)
  }, [searchQuery]) // Only re-run when searchQuery changes, not on every page render

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <GithubIcon className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-3xl">GitHub Explorer</CardTitle>
              <CardDescription>Discover AI repositories on GitHub</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search AI repositories..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isLoading || !inputValue.trim()}>
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search results section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Results for "{searchQuery}"</h2>

        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading repositories: {error}
              <Button
                variant="outline"
                size="sm"
                className="ml-4"
                onClick={() => fetchRepositories(searchQuery, currentPage)}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          // Loading skeletons
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : repositories.length === 0 ? (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <GithubIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No repositories found</h3>
              <p className="text-muted-foreground mb-6">Try a different search term or check your connection</p>
            </CardContent>
          </Card>
        ) : (
          // Repository list
          <div className="space-y-4">
            {repositories.map((repo) => (
              <RepositoryCard repo={repo} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && repositories.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className="text-sm font-medium px-4">Page {currentPage}</span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={repositories.length < RESULTS_PER_PAGE}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GitHubExplorerContainer

