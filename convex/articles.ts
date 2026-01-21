import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper to calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}

// ============ QUERIES ============

export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))
    ),
    categoryId: v.optional(v.id("categories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let articles;

    if (args.status) {
      articles = await ctx.db
        .query("articles")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else {
      articles = await ctx.db.query("articles").order("desc").collect();
    }

    if (args.categoryId) {
      articles = articles.filter((a) => a.categoryId === args.categoryId);
    }

    if (args.limit) {
      articles = articles.slice(0, args.limit);
    }

    return await Promise.all(
      articles.map(async (article) => {
        const category = await ctx.db.get(article.categoryId);
        const author = await ctx.db.get(article.authorId);
        let featuredImage = null;
        if (article.featuredImageId) {
          const media = await ctx.db.get(article.featuredImageId);
          if (media) {
            featuredImage = {
              ...media,
              url: await ctx.storage.getUrl(media.storageId),
            };
          }
        }
        return { ...article, category, author, featuredImage };
      })
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!article) return null;

    const category = await ctx.db.get(article.categoryId);
    const author = await ctx.db.get(article.authorId);
    let featuredImage = null;
    if (article.featuredImageId) {
      const media = await ctx.db.get(article.featuredImageId);
      if (media) {
        featuredImage = {
          ...media,
          url: await ctx.storage.getUrl(media.storageId),
        };
      }
    }

    const mediaAttachments = await ctx.db
      .query("articleMedia")
      .withIndex("by_article", (q) => q.eq("articleId", article._id))
      .collect();

    const attachedMedia = await Promise.all(
      mediaAttachments.map(async (att) => {
        const media = await ctx.db.get(att.mediaId);
        if (!media) return null;
        return {
          ...media,
          url: await ctx.storage.getUrl(media.storageId),
          order: att.order,
        };
      })
    );

    return {
      ...article,
      category,
      author,
      featuredImage,
      attachedMedia: attachedMedia.filter(Boolean),
    };
  },
});

export const getById = query({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const article = await ctx.db.get(args.id);
    if (!article) return null;

    const category = await ctx.db.get(article.categoryId);
    const author = await ctx.db.get(article.authorId);
    let featuredImage = null;
    if (article.featuredImageId) {
      const media = await ctx.db.get(article.featuredImageId);
      if (media) {
        featuredImage = {
          ...media,
          url: await ctx.storage.getUrl(media.storageId),
        };
      }
    }

    return { ...article, category, author, featuredImage };
  },
});

export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const featured = await ctx.db
      .query("articles")
      .withIndex("by_featured", (q) =>
        q.eq("isFeatured", true).eq("status", "published")
      )
      .order("desc")
      .take(args.limit ?? 5);

    return await Promise.all(
      featured.map(async (article) => {
        const category = await ctx.db.get(article.categoryId);
        const author = await ctx.db.get(article.authorId);
        let featuredImage = null;
        if (article.featuredImageId) {
          const media = await ctx.db.get(article.featuredImageId);
          if (media) {
            featuredImage = {
              ...media,
              url: await ctx.storage.getUrl(media.storageId),
            };
          }
        }
        return { ...article, category, author, featuredImage };
      })
    );
  },
});

export const getByCategory = query({
  args: {
    categorySlug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.categorySlug))
      .unique();

    if (!category) return [];

    let articles = await ctx.db
      .query("articles")
      .withIndex("by_category", (q) => q.eq("categoryId", category._id))
      .order("desc")
      .collect();

    articles = articles.filter((a) => a.status === "published");

    if (args.limit) {
      articles = articles.slice(0, args.limit);
    }

    return await Promise.all(
      articles.map(async (article) => {
        const author = await ctx.db.get(article.authorId);
        let featuredImage = null;
        if (article.featuredImageId) {
          const media = await ctx.db.get(article.featuredImageId);
          if (media) {
            featuredImage = {
              ...media,
              url: await ctx.storage.getUrl(media.storageId),
            };
          }
        }
        return { ...article, category, author, featuredImage };
      })
    );
  },
});

export const search = query({
  args: { query: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    if (!args.query) return [];

    // Search in titles
    const titleResults = await ctx.db
      .query("articles")
      .withSearchIndex("search_title", (q) =>
        q.search("title", args.query).eq("status", "published")
      )
      .take(args.limit ?? 20);

    // Search in content/body
    const bodyResults = await ctx.db
      .query("articles")
      .withSearchIndex("search_body", (q) =>
        q.search("content", args.query).eq("status", "published")
      )
      .take(args.limit ?? 20);

    // Combine and deduplicate
    const combined = [...titleResults, ...bodyResults];
    const seen = new Set();
    const unique = combined.filter((a) => {
      if (seen.has(a._id)) return false;
      seen.add(a._id);
      return true;
    });

    // Sort by publishedAt desc for consistency (since text search doesn't have a simple score-based merge easily here)
    const sorted = unique.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
    const results = args.limit ? sorted.slice(0, args.limit) : sorted;

    return await Promise.all(
      results.map(async (article) => {
        const category = await ctx.db.get(article.categoryId);
        const author = await ctx.db.get(article.authorId);
        let featuredImage = null;
        if (article.featuredImageId) {
          const media = await ctx.db.get(article.featuredImageId);
          if (media) {
            featuredImage = {
              ...media,
              url: await ctx.storage.getUrl(media.storageId),
            };
          }
        }
        return { ...article, category, author, featuredImage };
      })
    );
  },
});

export const getLatestPublished = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .take(args.limit ?? 10);

    return await Promise.all(
      articles.map(async (article) => {
        const category = await ctx.db.get(article.categoryId);
        const author = await ctx.db.get(article.authorId);
        let featuredImage = null;
        if (article.featuredImageId) {
          const media = await ctx.db.get(article.featuredImageId);
          if (media) {
            featuredImage = {
              ...media,
              url: await ctx.storage.getUrl(media.storageId),
            };
          }
        }
        return { ...article, category, author, featuredImage };
      })
    );
  },
});

// ============ MUTATIONS ============

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.string(),
    categoryId: v.id("categories"),
    authorId: v.id("authors"),
    featuredImageId: v.optional(v.id("media")),
    isFeatured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const slug = args.slug || generateSlug(args.title);

    const existing = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (existing) {
      throw new Error(`Article with slug "${slug}" already exists`);
    }

    const now = Date.now();

    return await ctx.db.insert("articles", {
      title: args.title,
      slug,
      excerpt: args.excerpt,
      content: args.content,
      categoryId: args.categoryId,
      authorId: args.authorId,
      status: "draft",
      featuredImageId: args.featuredImageId,
      isFeatured: args.isFeatured ?? false,
      readingTimeMinutes: calculateReadingTime(args.content),
      tags: args.tags,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("articles"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    featuredImageId: v.optional(v.id("media")),
    isFeatured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const { id, ...updates } = args;

    if (updates.slug) {
      const existing = await ctx.db
        .query("articles")
        .withIndex("by_slug", (q) => q.eq("slug", updates.slug!))
        .unique();

      if (existing && existing._id !== id) {
        throw new Error(`Article with slug "${updates.slug}" already exists`);
      }
    }

    let readingTimeMinutes;
    if (updates.content) {
      readingTimeMinutes = calculateReadingTime(updates.content);
    }

    const cleanUpdates = {
      ...Object.fromEntries(
        Object.entries(updates).filter(([, v]) => v !== undefined)
      ),
      ...(readingTimeMinutes ? { readingTimeMinutes } : {}),
      updatedAt: Date.now(),
    };

    await ctx.db.patch(id, cleanUpdates);
    return id;
  },
});

export const publish = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.id, {
      status: "published",
      publishedAt: Date.now(),
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

export const unpublish = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.id, {
      status: "draft",
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

export const archive = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.id, {
      status: "archived",
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const associations = await ctx.db
      .query("articleMedia")
      .withIndex("by_article", (q) => q.eq("articleId", args.id))
      .collect();

    for (const assoc of associations) {
      await ctx.db.delete(assoc._id);
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const attachMedia = mutation({
  args: {
    articleId: v.id("articles"),
    mediaIds: v.array(v.id("media")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("articleMedia")
      .withIndex("by_article", (q) => q.eq("articleId", args.articleId))
      .collect();

    let order = existing.length > 0 ? Math.max(...existing.map((e) => e.order)) + 1 : 0;

    for (const mediaId of args.mediaIds) {
      const alreadyAttached = existing.find((e) => e.mediaId === mediaId);
      if (!alreadyAttached) {
        await ctx.db.insert("articleMedia", {
          articleId: args.articleId,
          mediaId,
          order: order++,
        });
      }
    }

    return args.articleId;
  },
});

export const detachMedia = mutation({
  args: {
    articleId: v.id("articles"),
    mediaId: v.id("media"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const associations = await ctx.db
      .query("articleMedia")
      .withIndex("by_article", (q) => q.eq("articleId", args.articleId))
      .collect();

    const toDelete = associations.find((a) => a.mediaId === args.mediaId);
    if (toDelete) {
      await ctx.db.delete(toDelete._id);
    }

    return args.articleId;
  },
});
