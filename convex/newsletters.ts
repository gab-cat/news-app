import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Check if already subscribed
    const existing = await ctx.db
      .query("newsletters")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      return existing._id; // Already subscribed
    }

    return await ctx.db.insert("newsletters", {
      email: args.email,
      subscribedAt: Date.now(),
    });
  },
});

export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("newsletters")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (subscriber) {
      await ctx.db.delete(subscriber._id);
    }

    return true;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("newsletters").order("desc").collect();
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const subscribers = await ctx.db.query("newsletters").collect();
    return subscribers.length;
  },
});
