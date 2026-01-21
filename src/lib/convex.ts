import { ConvexReactClient } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  // Use a fallback or throw error depending on environment
  // For dev, if not set, it might be set by convex dev automatically in .env.local
}

export const convexClient = new ConvexReactClient(convexUrl ?? "http://localhost:3210");
export const convexQueryClient = new ConvexQueryClient(convexClient);
