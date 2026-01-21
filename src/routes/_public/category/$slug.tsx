import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { FolderLibraryIcon } from "@hugeicons/core-free-icons";
import { CategoryPageSkeleton } from "@/components/ui/skeleton";
import { EditorialEmptyState } from "@/components/ui/editorial-empty-state";
import { NewsCard } from "@/components/news-card";

export const Route = createFileRoute("/_public/category/$slug")({
  loader: async (opts) => {
    const { slug } = opts.params;
    await Promise.all([
      opts.context.queryClient.ensureQueryData(convexQuery(api.categories.list, {})),
      opts.context.queryClient.ensureQueryData(convexQuery(api.articles.getByCategory, { categorySlug: slug })),
    ]);
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: categories, isPending: categoriesPending } = useQuery(
    convexQuery(api.categories.list, {})
  );
  const { data: articles, isPending: articlesPending } = useQuery(
    convexQuery(api.articles.getByCategory, { categorySlug: slug })
  );

  const category = categories?.find((c) => c.slug === slug);
  const isLoading = categoriesPending || articlesPending;

  if (isLoading) {
    return (
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <CategoryPageSkeleton />
        </div>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="py-20">
        <EditorialEmptyState
          title="Category Not Found"
          description="This category doesn't exist or has been removed."
          icon={FolderLibraryIcon}
          variant="gradient"
          action={{
            label: "Back to Homepage",
            href: "/",
          }}
        />
      </main>
    );
  }

  return (
    <main className="py-12">
      {/* Category Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="max-w-2xl">
          <div
            className="w-12 h-1 rounded-full mb-4"
            style={{ backgroundColor: category.color || "#6366f1" }}
          />
          <h1 className="font-serif text-4xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-muted-foreground">{category.description}</p>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {articles && articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <NewsCard key={article._id} article={article as any} />
            ))}
          </div>
        ) : (
          <EditorialEmptyState
            title="No Articles Yet"
            description={`There are no published articles in ${category.name} yet.`}
            variant="gradient"
            action={{
              label: "Back to Homepage",
              href: "/",
            }}
          />
        )}
      </div>
    </main>
  );
}
