import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UsersIcon } from "lucide-react"

const BlogCard = ({ blog }) => {
  const truncateSummary = (summary, maxLength = 400) => {
    if (summary.length <= maxLength) return summary
    return summary.slice(0, maxLength).trim() + "..."
  }

  return (
    <Card className="mb-4 relative">
      <CardHeader className="pb-2">
        <div>
          <Badge className="mb-2 bg-green-500 text-white">Blog</Badge>
          <CardTitle className="text-lg">
            <a href={blog.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {blog.title}
            </a>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        
        <p className="text-sm text-muted-foreground mb-4">{truncateSummary(blog.description)}</p>
        <div className="flex flex-wrap gap-2">
          {blog.categories &&
            blog.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default BlogCard

