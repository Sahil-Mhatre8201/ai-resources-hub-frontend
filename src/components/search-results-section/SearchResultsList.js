import RepositoryCard from "./RepositoryCard"
import ArxivPaperCard from "./ArxivPaperCard"
import BlogCard from "./BlogCard"
import CourseCard from "./CourseCard"

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
      default:
        return <div key={result.id || result.full_name}>Unsupported resource type</div>
    }
  }

  return (
    <div className="search-results-list">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>
      {(results || [])?.map(renderResultCard)}
    </div>
  )
}

export default SearchResultsList

