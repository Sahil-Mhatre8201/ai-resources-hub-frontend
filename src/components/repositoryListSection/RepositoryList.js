import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";
import Router, { useRouter } from "next/router";

export default function RepositoryList({ repositories }) {
  const router = useRouter();

  function truncateDescription(description, maxLength = 400) {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength).trim() + "...";
  }

  const handleClick = (repo) => {
    router.push(`/github/repo-details?owner=${repo.owner.login}&repo=${repo.name}`);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">GitHub Repositories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repositories.map((repo) => (
          <Card
            onClick={handleClick?.bind(null, repo)}
            key={repo.name}
            className="flex flex-col"
          >
            <CardHeader>
              <CardTitle className="text-lg">
                <a
                  //   href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {repo.name}
                </a>
              </CardTitle>
              <Badge className="w-max" variant="secondary">
                {repo.language}
              </Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">
                {truncateDescription(repo.description)}
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col gap-6">
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span>{repo.stars.toLocaleString()}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {repo.contributors.map((contributor) => (
                    <Avatar key={contributor.username} className="w-8 h-8">
                      <AvatarImage
                        src={contributor.avatar_url}
                        alt={contributor.username}
                      />
                      <AvatarFallback>
                        {contributor.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
