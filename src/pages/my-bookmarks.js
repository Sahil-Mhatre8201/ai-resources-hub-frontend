import BookmarksList from "@/components/search-results-section/BookmarksList"
import { withAuth } from "@/utils/auth"

function BookmarksPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Bookmarks</h1>
      <BookmarksList />
    </div>
  )
}

// Protect this page with authentication
export default withAuth(BookmarksPage)

