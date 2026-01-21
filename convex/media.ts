import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// ============ QUERIES ============

export const list = query({
  args: {},
  handler: async (ctx) => {
    const mediaItems = await ctx.db.query("media").order("desc").collect();

    // Generate URLs for each media item
    return await Promise.all(
      mediaItems.map(async (item) => ({
        ...item,
        url: await ctx.storage.getUrl(item.storageId),
      }))
    );
  },
});

export const getById = query({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    if (!media) return null;

    return {
      ...media,
      url: await ctx.storage.getUrl(media.storageId),
    };
  },
});

export const getByIds = query({
  args: { ids: v.array(v.id("media")) },
  handler: async (ctx, args) => {
    const results = await Promise.all(
      args.ids.map(async (id) => {
        const media = await ctx.db.get(id);
        if (!media) return null;
        return {
          ...media,
          url: await ctx.storage.getUrl(media.storageId),
        };
      })
    );
    return results.filter(Boolean);
  },
});

// ============ MUTATIONS ============

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const saveMedia = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    alt: v.optional(v.string()),
    uploadedBy: v.optional(v.id("authors")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("media", {
      storageId: args.storageId,
      filename: args.filename,
      mimeType: args.mimeType,
      size: args.size,
      alt: args.alt,
      uploadedBy: args.uploadedBy,
      uploadedAt: Date.now(),
    });
  },
});

export const updateAlt = mutation({
  args: {
    id: v.id("media"),
    alt: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.id, { alt: args.alt });
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const media = await ctx.db.get(args.id);
    if (!media) return;

    // Delete from storage
    await ctx.storage.delete(media.storageId);

    // Remove any article associations
    const associations = await ctx.db
      .query("articleMedia")
      .withIndex("by_media", (q) => q.eq("mediaId", args.id))
      .collect();

    for (const assoc of associations) {
      await ctx.db.delete(assoc._id);
    }

    // Delete the media record
    await ctx.db.delete(args.id);
    return args.id;
  },
});
