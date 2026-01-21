import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import {
  PlusSignIcon,
  Delete01Icon,
  Edit02Icon,
  News01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import { EditorialEmptyState } from "@/components/ui/editorial-empty-state";

export const Route = createFileRoute("/admin/articles/")({
  loader: async (opts) => {
    await opts.context.queryClient.ensureQueryData(
      convexQuery(api.articles.list, {})
    );
  },
  component: ArticlesPage,
});

function ArticlesPage() {
  const { data: articles, isPending } = useQuery(
    convexQuery(api.articles.list, {})
  );
  const { mutate: removeArticle } = useMutation({
    mutationFn: useConvexMutation(api.articles.remove),
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      removeArticle({ id: id as any });
    }
  };

  const statusColors: Record<string, string> = {
    published: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    draft: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    archived: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your publication's stories and drafts.
          </p>
        </div>
        <Link to="/admin/articles/new">
          <Button className="shadow-lg shadow-primary/25 rounded-xl">
            <HugeiconsIcon icon={PlusSignIcon} size={18} className="mr-2" />
            New Article
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
        {isPending ? (
          <div className="p-6 space-y-4">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        ) : !articles || articles.length === 0 ? (
          <div className="p-12">
            <EditorialEmptyState
              title="No Articles Yet"
              description="Get started by writing your first story. Great journalism starts here."
              icon={News01Icon}
              action={{
                label: "Create new article",
                href: "/admin/articles/new",
              }}
            />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Title</th>
                <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Updated</th>
                <th className="text-right px-6 py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((article) => (
                <tr
                  key={article._id}
                  className="hover:bg-accent/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div>
                      <Link
                        to="/admin/articles/$id"
                        params={{ id: article._id }}
                        className="font-medium font-serif text-lg hover:text-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                      {article.isFeatured && (
                        <Badge variant="secondary" className="ml-2 text-[10px] tracking-wider uppercase font-bold bg-primary/10 text-primary">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: article.category?.color || "#6366f1" }}
                      />
                      <span className="text-sm font-medium">{article.category?.name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={`uppercase tracking-wider text-[10px] font-bold ${statusColors[article.status] || ""}`}
                    >
                      {article.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to="/admin/articles/$id" params={{ id: article._id }}>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                          <HugeiconsIcon icon={Edit02Icon} size={16} />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(article._id)}
                      >
                        <HugeiconsIcon icon={Delete01Icon} size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
