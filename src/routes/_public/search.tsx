import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { Search01Icon, News01Icon } from "@hugeicons/core-free-icons";
import { ArticleGridSkeleton } from "@/components/ui/skeleton";
import { EditorialEmptyState } from "@/components/ui/editorial-empty-state";
import { NewsCard } from "@/components/news-card";

type SearchParams = {
  q?: string;
};

export const Route = createFileRoute("/_public/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      q: (search.q as string) || undefined,
    };
  },
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q }, context }) => {
    if (q) {
      await context.queryClient.ensureQueryData(
        convexQuery(api.articles.search, { query: q })
      );
    }
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data: results, isPending } = useQuery(
    convexQuery(api.articles.search, { query: q || "" })
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Search Header */}
      <section className="border-b border-border/40 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                Archives Search
              </span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl font-bold tracking-tighter leading-none">
              {q ? (
                <>
                  Results for <span className="italic font-light text-muted-foreground">"{q}"</span>
                </>
              ) : (
                "Explore the Archives."
              )}
            </h1>
            {results && results.length > 0 && (
              <p className="text-muted-foreground font-serif italic text-lg">
                We found {results.length} compelling narratives matching your investigation.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {isPending ? (
            <ArticleGridSkeleton count={6} />
          ) : results && results.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12">
              {results.map((article) => (
                <NewsCard key={article._id} article={article as any} />
              ))}
            </div>
          ) : q ? (
            <EditorialEmptyState
              title="No Narratives Found"
              description={`The archives are silent on "${q}". Perhaps try a broader term?`}
              icon={Search01Icon}
              variant="gradient"
            />
          ) : (
            <EditorialEmptyState
              title="Enter a query"
              description="Type above to search through our global newsroom's archives."
              icon={News01Icon}
              variant="gradient"
            />
          )}
        </div>
      </section>
    </main>
  );
}
