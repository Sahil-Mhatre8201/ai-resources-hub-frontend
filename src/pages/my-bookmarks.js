import BookmarksList from "@/components/search-results-section/BookmarksList"
import { withAuth } from "@/utils/auth"

function BookmarksPage() {
  return (
    <div className="w-full px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Your Bookmarks</h1>
      <BookmarksList />
    </div>
  )
}

// Protect this page with authentication
export default withAuth(BookmarksPage)

