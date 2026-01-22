import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import {
  Calendar01Icon,
  TimeHalfPassIcon,
  Link02Icon,
  News01Icon,
  ArrowLeft02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { EditorialEmptyState } from "@/components/ui/editorial-empty-state";
import { NewsCard } from "@/components/news-card";

export const Route = createFileRoute("/_public/article/$slug")({
  loader: async (opts) => {
    const { slug } = opts.params;
    const article = await opts.context.queryClient.ensureQueryData(
      convexQuery(api.articles.getBySlug, { slug })
    );
    return { article };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    if (!article) return { title: "Article Not Found — Chronicle" };

    const title = `${article.title} — Chronicle`;
    const description = article.excerpt || "Read the latest deep-dive narrative on Chronicle.";
    const imageUrl = article.featuredImage?.url;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(imageUrl ? [{ property: "og:image", content: imageUrl }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { property: "article:published_time", content: article.publishedAt ? new Date(article.publishedAt).toISOString() : "" },
        { property: "article:author", content: article.author?.name },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": article.title,
            "description": article.excerpt,
            "image": imageUrl ? [imageUrl] : [],
            "datePublished": article.publishedAt ? new Date(article.publishedAt).toISOString() : "",
            "dateModified": article.updatedAt ? new Date(article.updatedAt).toISOString() : "",
            "author": [{
              "@type": "Person",
              "name": article.author?.name,
              "url": `https://chronicle-news.app/authors/${article.author?.email}`
            }]
          }),
        },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data: article } = useSuspenseQuery(
    convexQuery(api.articles.getBySlug, { slug })
  );
  
  const { data: relatedArticles } = useQuery({
    ...convexQuery(api.articles.getByCategory, { 
      categorySlug: article?.category?.slug ?? "", 
      limit: 4 
    }),
    enabled: !!article?.category?.slug,
  });

  if (article === null) {
    return (
      <main className="py-20">
        <EditorialEmptyState
          title="Article Not Found"
          description="The story you're looking for doesn't exist or has been removed."
          icon={News01Icon}
          variant="gradient"
          action={{
            label: "Back to Homepage",
            href: "/",
          }}
          secondaryAction={{
            label: "Browse Categories",
            href: "/admin/categories",
          }}
        />
      </main>
    );
  }

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <main className="pb-32">
      {/* Article Hero */}
      <section className="pt-16 pb-12 lg:pt-24 lg:pb-20 border-b border-border/40">
         <div className="max-w-4xl mx-auto px-4 sm:px-8">
           <div className="space-y-8 text-center lg:text-left">
              <Link
                to="/category/$slug"
                params={{ slug: article.category?.slug || "" }}
                className="inline-block text-[11px] font-black uppercase tracking-[0.3em] text-primary"
              >
                {article.category?.name}
              </Link>
              
              <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-balance">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-lg text-muted-foreground/90 font-medium leading-relaxed font-sans max-w-2xl mx-auto lg:mx-0">
                  {article.excerpt}
                </p>
              )}

              <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center font-serif italic text-2xl">
                    {article.author?.name?.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg leading-tight">{article.author?.name}</p>
                    <p className="text-sm text-muted-foreground italic font-serif leading-tight mt-1">{article.author?.bio}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={Calendar01Icon} size={14} />
                    <span>{publishedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <HugeiconsIcon icon={TimeHalfPassIcon} size={14} />
                    <span className="uppercase">{article.readingTimeMinutes} MIN NARRATIVE</span>
                  </div>
                </div>
              </div>
           </div>
         </div>
      </section>

      {/* Featured Media */}
      {article.featuredImage?.url && (
         <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-8 mb-20">
           <figure className="relative group">
              <div className="aspect-21/9 overflow-hidden bg-muted shadow-2xl">
                <img
                  src={article.featuredImage.url}
                  alt={article.title}
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
              </div>
              {article.featuredImage.alt && (
                <figcaption className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground text-right border-r-2 border-primary pr-4">
                  Media Archive // {article.featuredImage.alt}
                </figcaption>
              )}
           </figure>
         </div>
      )}

      {/* Content Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <div 
          className="prose prose-base! prose-slate dark:prose-invert max-w-none 
            prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight
            prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-12! prose-h2:mb-4!
            prose-p:leading-relaxed prose-p:mt-0! prose-p:mb-6 prose-p:text-foreground/80 prose-p:font-normal
            prose-blockquote:border-l-0 prose-blockquote:border-y prose-blockquote:border-border prose-blockquote:py-10 prose-blockquote:my-14 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-2xl md:text-3xl prose-blockquote:text-primary prose-blockquote:leading-snug
            prose-img:shadow-2xl prose-img:border prose-img:border-border prose-img:my-14
            [&>p:first-of-type]:first-letter:font-serif [&>p:first-of-type]:first-letter:text-7xl [&>p:first-of-type]:first-letter:font-black [&>p:first-of-type]:first-letter:mr-4 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:leading-[0.7] [&>p:first-of-type]:first-letter:mt-2"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags Section */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-20 pt-12 border-t border-border/40">
            <div className="flex flex-wrap gap-3">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-12 flex items-center justify-between border-y border-border/40 py-8">
           <div className="flex items-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Recirculate</span>
              <button onClick={copyLink} className="flex items-center gap-2 text-[11px] font-bold uppercase hover:text-primary transition-colors">
                <HugeiconsIcon icon={Link02Icon} size={14} /> Copy Link
              </button>
           </div>
           <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest group"
           >
              Scroll To Top <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="rotate-90 group-hover:-translate-y-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* Related Narratives */}
      {relatedArticles && relatedArticles.length > 1 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-40">
          <div className="mb-12 flex items-end justify-between border-b border-border/40 pb-6">
             <div className="space-y-2">
               <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">Related Narratives</p>
               <h2 className="font-serif text-4xl font-bold tracking-tighter">Extend your reading.</h2>
             </div>
             <Link to="/" className="text-[11px] font-bold uppercase tracking-widest border-b border-foreground pb-1">Archive View</Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {relatedArticles
              .filter((a) => a._id !== article._id)
              .slice(0, 3)
              .map((related) => (
                <NewsCard key={related._id} article={related as any} />
              ))}
          </div>
        </section>
      )}
    </main>
  );
}
