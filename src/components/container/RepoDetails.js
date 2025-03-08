"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  StarIcon,
  GitForkIcon,
  EyeIcon,
  FolderOpenIcon as IssueOpenedIcon,
  ExternalLinkIcon
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { marked } from "marked"; // Markdown parser
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Button } from "@/components/ui/button"

const RepoDetails = () => {
  const router = useRouter();
  const { owner, repo } = router.query;

  const [repoDetails, setRepoDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (owner && repo) {
      axios
        .get(`http://127.0.0.1:8000/repo-details?owner=${owner}&repo=${repo}`)
        .then((res) => {
          setRepoDetails(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching repo details:", err);
          setLoading(false);
        });
    }
  }, [owner, repo]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  if (!repoDetails)
    return (
      <div className="flex justify-center items-center h-screen">
        No repository details found.
      </div>
    );

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {repoDetails.repo.name}
              </CardTitle>
              <p className="text-muted-foreground">
                {repoDetails.repo.full_name}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {repoDetails.repo.language}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{repoDetails.repo.description}</p>
          <Button variant="secondary" onClick={() => window.open(repoDetails.repo.html_url, "_blank")} className="mb-4 bg-black text-white hover:bg-gray-900">
            <ExternalLinkIcon className="w-4 h-4 mr-2" />
            View on GitHub
          </Button>
          <div className="flex space-x-4 mb-4">
            <div className="flex items-center">
              <StarIcon className="w-5 h-5 mr-1 text-yellow-400" />
              <span>{repoDetails.repo.stargazers_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <GitForkIcon className="w-5 h-5 mr-1" />
              <span>{repoDetails.repo.forks_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <EyeIcon className="w-5 h-5 mr-1" />
              <span>{repoDetails.repo.watchers_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <IssueOpenedIcon className="w-5 h-5 mr-1" />
              <span>{repoDetails.repo.open_issues_count.toLocaleString()}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {repoDetails.languages.map((lang) => (
                    <Badge key={lang}>{lang}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {repoDetails.contributors.slice(0, 5).map((c) => (
                    <div key={c.login} className="flex flex-col items-center">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={c.avatar_url} alt={c.login} />
                        <AvatarFallback>
                          {c.login.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm mt-1">{c.login}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.contributions}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">README</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]} // Allows raw HTML rendering
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold mt-4 mb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold mt-3 mb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-semibold mt-2 mb-1" {...props} />
                ),
                a: ({ href, children, ...props }) => {
                  const youtubeMatch =
                    href.match(
                      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/
                    ) ||
                    href.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([\w-]+)/);
                  if (youtubeMatch) {
                    return (
                      <div
                        className="relative w-full"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
                          title="YouTube video"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                        />
                      </div>
                    );
                  }
                  return (
                    <a
                      className="underline text-blue-500"
                      href={href}
                      {...props}
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {atob(repoDetails?.readme)}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepoDetails;
