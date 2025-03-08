import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";
import { useRouter } from "next/router";

const RepositoryCard = ({ repo }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/github/repo-details?owner=${repo.owner}&repo=${repo.name}`);
    };

  return (
    <Card onClick={handleClick} className="mb-4 relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className="mb-2 bg-green-500 text-white">GitHub</Badge>
            <CardTitle className="text-lg">
              <a href={repo.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {repo.full_name}
              </a>
            </CardTitle>
          </div>
          <Badge variant="secondary" className="w-max">
            {repo.language}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {repo.description
            ? repo.description.length > 350
              ? `${repo.description.slice(0, 350)}...`
              : repo.description
            : "No description available"}
        </p>
        <div className="flex items-center space-x-2 mb-4">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <span>{repo.stars.toLocaleString()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {repo.contributors.slice(0, 5).map((contributor) => (
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
      </CardContent>
    </Card>
  );
};

export default RepositoryCard;
