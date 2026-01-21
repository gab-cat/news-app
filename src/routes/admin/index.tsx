import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import {
  News01Icon,
  Edit02Icon,
  PlusSignIcon,
  FolderLibraryIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { EditorialEmptyState } from "@/components/ui/editorial-empty-state";

export const Route = createFileRoute("/admin/")({
  loader: async (opts) => {
    await Promise.all([
      opts.context.queryClient.ensureQueryData(convexQuery(api.articles.list, {})),
      opts.context.queryClient.ensureQueryData(convexQuery(api.categories.list, {})),
      opts.context.queryClient.ensureQueryData(convexQuery(api.newsletters.count, {})),
    ]);
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: articles, isPending: articlesPending } = useQuery(
    convexQuery(api.articles.list, {})
  );
  const { data: categories, isPending: categoriesPending } = useQuery(
    convexQuery(api.categories.list, {})
  );
  const { data: newsletterCount, isPending: newsletterPending } = useQuery(
    convexQuery(api.newsletters.count, {})
  );

  const isLoading = articlesPending || categoriesPending || newsletterPending;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const publishedCount =
    articles?.filter((a) => a.status === "published").length ?? 0;
  const draftCount = articles?.filter((a) => a.status === "draft").length ?? 0;

  const stats = [
    {
      label: "Published Articles",
      value: publishedCount,
      icon: News01Icon,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Drafts",
      value: draftCount,
      icon: Edit02Icon,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Categories",
      value: categories?.length ?? 0,
      icon: FolderLibraryIcon,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Subscribers",
      value: newsletterCount ?? 0,
      icon: UserMultipleIcon,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const recentArticles = articles?.slice(0, 5) ?? [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back. Here's an overview of your publication.
          </p>
        </div>
        <Link to="/admin/articles/new">
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} size={18} className="mr-2" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <HugeiconsIcon
                    icon={stat.icon}
                    size={24}
                    className={stat.color}
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Articles</CardTitle>
          <Link
            to="/admin/articles"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentArticles.length === 0 ? (
            <EditorialEmptyState
              title="No Articles Yet"
              description="Create your first article to get started."
              icon={News01Icon}
              action={{
                label: "Create Article",
                href: "/admin/articles/new",
              }}
            />
          ) : (
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <Link
                  key={article._id}
                  to="/admin/articles/$id"
                  params={{ id: article._id }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {article.category?.name ?? "Uncategorized"} ·{" "}
                      {article.status === "published" ? (
                        <span className="text-emerald-500">Published</span>
                      ) : (
                        <span className="text-amber-500">Draft</span>
                      )}
                    </p>
                  </div>
                  <HugeiconsIcon
                    icon={Edit02Icon}
                    size={18}
                    className="text-muted-foreground"
                  />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
