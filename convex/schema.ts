import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // Categories for organizing articles
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()), // Hex color for UI accent
  }).index("by_slug", ["slug"]),

  // Authors/editors who can write articles
  authors: defineTable({
    userId: v.optional(v.id("users")), // Link to auth user
    name: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    avatarId: v.optional(v.id("media")),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("writer")),
  })
    .index("by_email", ["email"])
    .index("by_userId", ["userId"]),

  // Media files (images, videos)
  media: defineTable({
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(), // bytes
    alt: v.optional(v.string()),
    uploadedBy: v.optional(v.id("authors")),
    uploadedAt: v.number(),
  }),

  // Articles/news content
  articles: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.optional(v.string()),
    content: v.string(), // Lexical editor JSON stringified
    categoryId: v.id("categories"),
    authorId: v.id("authors"),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived")
    ),
    featuredImageId: v.optional(v.id("media")),
    isFeatured: v.boolean(),
    readingTimeMinutes: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["categoryId"])
    .index("by_status", ["status"])
    .index("by_featured", ["isFeatured", "status"])
    .index("by_publishedAt", ["publishedAt"])
    .searchIndex("search_body", {
      searchField: "content",
      filterFields: ["status"],
    })
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["status"],
    }),

  // Article media attachments (many-to-many)
  articleMedia: defineTable({
    articleId: v.id("articles"),
    mediaId: v.id("media"),
    order: v.number(), // For ordering within article
  })
    .index("by_article", ["articleId"])
    .index("by_media", ["mediaId"]),

  // Newsletter subscribers
  newsletters: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
  }).index("by_email", ["email"]),
});
