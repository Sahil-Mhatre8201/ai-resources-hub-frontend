import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UsersIcon } from "lucide-react"

const ArxivPaperCard = ({ paper }) => {
  const truncateSummary = (summary, maxLength = 350) => {
    if (summary.length <= maxLength) return summary
    return summary.slice(0, maxLength).trim() + "..."
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
      </CardContent>
    </Card>
  )
}

export default ArxivPaperCard

