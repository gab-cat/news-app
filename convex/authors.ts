import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// ============ QUERIES ============

export const list = query({
  args: {},
  handler: async (ctx) => {
    const authors = await ctx.db.query("authors").collect();

    return await Promise.all(
      authors.map(async (author) => {
        let avatar = null;
        if (author.avatarId) {
          const media = await ctx.db.get(author.avatarId);
          if (media) {
            avatar = {
              ...media,
              url: await ctx.storage.getUrl(media.storageId),
            };
          }
        }
        return { ...author, avatar };
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("authors") },
  handler: async (ctx, args) => {
    const author = await ctx.db.get(args.id);
    if (!author) return null;

    let avatar = null;
    if (author.avatarId) {
      const media = await ctx.db.get(author.avatarId);
      if (media) {
        avatar = {
          ...media,
          url: await ctx.storage.getUrl(media.storageId),
        };
      }
    }

    return { ...author, avatar };
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("authors")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("authors")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

// ============ MUTATIONS ============

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    avatarId: v.optional(v.id("media")),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("writer")),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    // Check for duplicate email
    const existing = await ctx.db
      .query("authors")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      throw new Error(`Author with email "${args.email}" already exists`);
    }

    return await ctx.db.insert("authors", {
      name: args.name,
      email: args.email,
      bio: args.bio,
      avatarId: args.avatarId,
      role: args.role,
      userId: args.userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("authors"),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarId: v.optional(v.id("media")),
    role: v.optional(
      v.union(v.literal("admin"), v.literal("editor"), v.literal("writer"))
    ),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const { id, ...updates } = args;

    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(id, cleanUpdates);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("authors") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    // Check if author has articles
    const articles = await ctx.db
      .query("articles")
      .filter((q) => q.eq(q.field("authorId"), args.id))
      .first();

    if (articles) {
      throw new Error("Cannot delete author with existing articles");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});
