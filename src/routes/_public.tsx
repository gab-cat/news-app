import { createFileRoute, Outlet } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const Route = createFileRoute("/_public")({
  loader: async (opts) => {
    await opts.context.queryClient.ensureQueryData(
      convexQuery(api.categories.list, {})
    );
  },
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
