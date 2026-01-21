import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  DashboardSquare01Icon,
  News01Icon,
  FolderLibraryIcon,
  Image01Icon,
  UserMultipleIcon,
  Logout01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const navItems = [
  { href: "/admin" as const, label: "Dashboard", icon: DashboardSquare01Icon },
  { href: "/admin/articles" as const, label: "Articles", icon: News01Icon },
  { href: "/admin/categories" as const, label: "Categories", icon: FolderLibraryIcon },
  { href: "/admin/media" as const, label: "Media", icon: Image01Icon },
  { href: "/admin/authors" as const, label: "Authors", icon: UserMultipleIcon },
];

function AdminLayout() {
  const { signOut } = useAuthActions();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full bg-sidebar">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-border/50">
            <Logo />
            <span className="ml-auto text-[0.6rem] uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">Admin</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent hover:pl-5"
                    }`}
                >
                  <HugeiconsIcon icon={item.icon} size={22} className={isActive ? "" : "text-muted-foreground group-hover:text-primary transition-colors"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-6 border-t border-border/50">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium
                text-muted-foreground hover:text-destructive hover:bg-destructive/10
                transition-all duration-200"
            >
              <HugeiconsIcon icon={Logout01Icon} size={22} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-background/80 backdrop-blur-md sticky top-0 z-30 border-b border-border/50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors -ml-2"
          >
            <HugeiconsIcon icon={Menu01Icon} size={24} />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              View Live Site →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
