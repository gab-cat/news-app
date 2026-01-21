import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { ArrowRight02Icon, News01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { HeroSkeleton, ArticleGridSkeleton } from "@/components/ui/skeleton";
import { EditorialEmptyState } from "@/components/ui/editorial-empty-state";
import { NewsCard } from "@/components/news-card";

export const Route = createFileRoute("/_public/")({
  loader: async (opts) => {
    await Promise.all([
      opts.context.queryClient.ensureQueryData(convexQuery(api.articles.getFeatured, { limit: 1 })),
      opts.context.queryClient.ensureQueryData(convexQuery(api.articles.getLatestPublished, { limit: 8 })),
      opts.context.queryClient.ensureQueryData(convexQuery(api.categories.list, {})),
    ]);
  },
  component: HomePage,
});

function HomePage() {
  const { data: featuredArticles, isPending: featuredPending } = useQuery(convexQuery(api.articles.getFeatured, { limit: 1 }));
  const { data: latestArticles, isPending: latestPending } = useQuery(convexQuery(api.articles.getLatestPublished, { limit: 8 }));

  const heroArticle = featuredArticles?.[0];
  const gridArticles = latestArticles?.slice(0, 6) ?? [];

  return (
    <main>
      {/* Featured Story Section */}
      <section className="border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24">
          {featuredPending ? (
            <HeroSkeleton />
          ) : heroArticle ? (
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
              {/* Content - Left side for editorial focus */}
              <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-primary" />
                  <span className="text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                    Cover Story
                  </span>
                </div>
                
                <h1 className="font-serif text-5xl lg:text-5xl font-bold leading-[0.95] tracking-tight text-balance">
                  {heroArticle.title}
                </h1>

                {heroArticle.excerpt && (
                  <p className="text-base text-muted-foreground/90 leading-relaxed font-light">
                    {heroArticle.excerpt}
                  </p>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-border/60">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-serif italic text-lg border border-border">
                      {heroArticle.author?.name?.charAt(0)}
                    </div>
                    <div className="text-[13px]">
                      <p className="font-bold">{heroArticle.author?.name}</p>
                      <p className="text-muted-foreground">{heroArticle.readingTimeMinutes} min read</p>
                    </div>
                  </div>
                  
                  <Link
                    to="/article/$slug"
                    params={{ slug: heroArticle.slug }}
                    className="group flex items-center gap-3 text-xs font-semibold uppercase tracking-normal"
                  >
                    Read Full Narrative
                    <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                      <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Hero Image - Right side */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <Link 
                  to="/article/$slug" 
                  params={{ slug: heroArticle.slug }}
                  className="block relative aspect-4/3 lg:aspect-16/11 overflow-hidden group"
                >
                  {heroArticle.featuredImage?.url ? (
                    <img
                      src={heroArticle.featuredImage.url}
                      alt={heroArticle.title}
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-muted to-background" />
                  )}
                  {/* Category Label Overlay */}
                  <div className="absolute bottom-10 left-0">
                    <div 
                      className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white backdrop-blur-md"
                      style={{ backgroundColor: `${heroArticle.category?.color || "#000"}CC` }}
                    >
                      {heroArticle.category?.name}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Latest Stories Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-border/60 pb-8">
            <div className="space-y-2">
              <p className="text-primary text-[11px] font-bold uppercase tracking-[0.2em]">Latest Chronicles</p>
              <h2 className="font-serif text-5xl font-bold tracking-tighter leading-none">Fresh Perspectives.</h2>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm italic font-serif">
              Unveiling the most compelling narratives from our global newsroom.
            </p>
          </div>

          {latestPending ? (
            <ArticleGridSkeleton count={6} />
          ) : gridArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12">
              {gridArticles.map((article) => (
                <NewsCard key={article._id} article={article as any} />
              ))}
            </div>
          ) : (
            <EditorialEmptyState
              title="Silence in the Archive"
              description="Our editors are currently curating the next wave of stories."
              icon={News01Icon}
              variant="gradient"
            />
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 border-y border-border/40 overflow-hidden relative">
        <div className="absolute -right-20 -top-20 text-[200px] font-serif font-black text-muted/20 select-none">
          NEWS
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-1 border border-border rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
            Subscription
          </div>
          <h2 className="font-serif text-5xl md:text-6xl font-black mb-6 tracking-tighter">
            The Daily Intelligence.
          </h2>
          <p className="text-xl text-muted-foreground mb-12 font-serif italic max-w-xl mx-auto">
            Refined perspectives on global shifts, whispered directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto border border-foreground/10 p-1 rounded-sm bg-background/50 backdrop-blur-sm">
            <input
              type="email"
              placeholder="Secure your access by email"
              className="flex-1 px-6 py-4 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-foreground text-background text-xs font-bold uppercase tracking-widest hover:bg-foreground/90 transition-all active:scale-[0.98]"
            >
              Join Now
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}