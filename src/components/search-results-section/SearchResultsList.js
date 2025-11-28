import RepositoryCard from "./RepositoryCard"
import ArxivPaperCard from "./ArxivPaperCard"
import BlogCard from "./BlogCard"
import CourseCard from "./CourseCard"
import HandbookCard from "./HandbookCard"

const SearchResultsList = ({ results }) => {
  const renderResultCard = (result) => {
    switch (result.resource_type) {
      case "github":
        return <RepositoryCard key={result.full_name} repo={result} />
      case "arxiv paper":
        return <ArxivPaperCard key={result.id} paper={result} />
      case "blog":
          return <BlogCard blog={result} />
      case "courses":
        return <CourseCard course={result} />
      case "handbook":
        return <HandbookCard handbook={result} />
      default:
        return <div key={result.id || result.full_name}>Unsupported resource type</div>
    }
  }

  return (
    <div className="search-results-list w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Search Results</h2>
      <div className="space-y-3 sm:space-y-4">
        {(results || [])?.map(renderResultCard)}
      </div>
    </div>
  )
}

export default SearchResultsList

