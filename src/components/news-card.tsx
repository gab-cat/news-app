import { Link } from "@tanstack/react-router";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface NewsCardProps {
  article: {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    readingTimeMinutes?: number;
    publishedAt?: number;
    author?: {
      name: string;
    };
    category?: {
      name: string;
      slug: string;
      color?: string;
    };
    featuredImage?: {
      url: string;
    };
  };
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="group">
      <Link to="/article/$slug" params={{ slug: article.slug }} className="block">
        <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-muted mb-6 shadow-sm group-hover:shadow-xl group-hover:shadow-black/5 transition-all duration-500">
          {article.featuredImage?.url ? (
            <img
              src={article.featuredImage.url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary/5 to-muted/20 flex items-center justify-center">
              <span className="font-serif italic text-muted-foreground/40">Chronicle Media</span>
            </div>
          )}
          {article.category && (
            <div className="absolute top-4 left-4">
              <span 
                className="text-[9px] font-black uppercase tracking-widest py-1 px-3 backdrop-blur-md text-white shadow-sm"
                style={{ backgroundColor: `${article.category.color || "#000"}CC` }}
              >
                {article.category.name}
              </span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            <span>{article.readingTimeMinutes} min read</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>By {article.author?.name}</span>
          </div>
          
          <h2 className="font-serif text-xl font-semibold leading-tight group-hover:text-primary transition-all duration-300 decoration-primary/0 group-hover:decoration-primary/30 underline underline-offset-4 decoration-1">
            {article.title}
          </h2>
          
          {article.excerpt && (
            <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 font-light">
              {article.excerpt}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
