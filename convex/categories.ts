import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ QUERIES ============

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getById = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ============ MUTATIONS ============

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for duplicate slug
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new Error(`Category with slug "${args.slug}" already exists`);
    }

    return await ctx.db.insert("categories", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      color: args.color,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // If updating slug, check for duplicates
    if (updates.slug) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", updates.slug!))
        .unique();

      if (existing && existing._id !== id) {
        throw new Error(`Category with slug "${updates.slug}" already exists`);
      }
    }

    // Filter undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(id, cleanUpdates);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    // Check if any articles use this category
    const articlesWithCategory = await ctx.db
      .query("articles")
      .withIndex("by_category", (q) => q.eq("categoryId", args.id))
      .first();

    if (articlesWithCategory) {
      throw new Error(
        "Cannot delete category with existing articles. Reassign articles first."
      );
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});
