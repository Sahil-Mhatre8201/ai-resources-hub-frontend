import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpenIcon, FileTextIcon, GithubIcon, GraduationCapIcon, NewspaperIcon, UsersIcon } from "lucide-react"

const KnowledgeHubContainer = () => {
  const categories = [
    {
      id: "tutorials",
      name: "Handbooks",
      description: "Handbooks and notes with step-by-step guides to learn AI concepts and techniques",
      icon: <BookOpenIcon className="h-12 w-12 mb-4" />,
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-600 dark:text-blue-300",
      href: "/knowledge-base/handbooks",
    },
    {
      id: "research-papers",
      name: "Research Papers",
      description: "Academic publications on the latest AI advancements",
      icon: <FileTextIcon className="h-12 w-12 mb-4" />,
      color: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-600 dark:text-purple-300",
      href: "/knowledge-base/research-papers",
    },
    {
      id: "github-repositories",
      name: "GitHub Repositories",
      description: "Open-source code and projects for AI implementation",
      icon: <GithubIcon className="h-12 w-12 mb-4" />,
      color: "bg-gray-100 dark:bg-gray-800",
      textColor: "text-gray-600 dark:text-gray-300",
      href: "/knowledge-base/github",
    },
    {
      id: "courses",
      name: "Courses",
      description: "Comprehensive learning paths for AI education",
      icon: <GraduationCapIcon className="h-12 w-12 mb-4" />,
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-600 dark:text-green-300",
      href: "/knowledge-base/courses",
    },
    {
      id: "blogs",
      name: "Blogs",
      description: "Articles and insights from AI experts and practitioners",
      icon: <NewspaperIcon className="h-12 w-12 mb-4" />,
      color: "bg-orange-100 dark:bg-orange-900",
      textColor: "text-orange-600 dark:text-orange-300",
      href: "/knowledge-base/blogs",
    },
    {
      id: "by-the-community",
      name: "By the Community",
      description: "Valuable resources contributed by our community members",
      icon: <UsersIcon className="h-12 w-12 mb-4" />,
      color: "bg-pink-100 dark:bg-pink-900",
      textColor: "text-pink-600 dark:text-pink-300",
      href: "/knowledge-base/by-the-community",
    },
  ]

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">AI Knowledge Hub</h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Explore our curated collection of AI learning materials</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {categories.map((category) => (
          <Link href={category.href} key={category.id} className="block">
            <Card
              className={`h-full transition-transform duration-300 hover:scale-105 hover:shadow-lg ${category.color}`}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center h-full">
                <div className={category.textColor}>{category.icon}</div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{category.name}</h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default KnowledgeHubContainer

