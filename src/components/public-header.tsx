import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function PublicHeader() {
  const { data: categories } = useQuery(convexQuery(api.categories.list, {}));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        to: "/search",
        search: { q: searchQuery.trim() },
      });
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Bar Label */}
      <div className="bg-foreground text-background py-2 text-[10px] uppercase tracking-[0.2em] text-center font-medium">
        The Global Editorial • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>

      {/* Header */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <span className="font-serif text-3xl font-black tracking-tighter group-hover:italic transition-all duration-500">
                CHRONICLE
              </span>
            </Link>

            {/* Categories Nav */}
            <nav className={`hidden lg:flex items-center gap-8 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              {categories?.slice(0, 6).map((cat) => (
                <Link
                  key={cat._id}
                  to="/category/$slug"
                  params={{ slug: cat.slug }}
                  className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
                  activeProps={{ className: "text-foreground" }}
                >
                  {cat.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions & Search */}
            <div className="flex items-center gap-6">
              <div className="relative flex items-center">
                <form 
                  onSubmit={handleSearchSubmit}
                  className={`flex items-center overflow-hidden transition-all duration-500 ease-out border-b border-foreground/20 focus-within:border-foreground ${
                    isSearchOpen ? "w-64 md:w-80 opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search the archives..."
                    className="bg-transparent border-none focus:ring-0 text-sm py-2 w-full placeholder:text-muted-foreground/50 tracking-wide outline-none font-serif italic"
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  />
                </form>
                
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 hover:bg-muted rounded-full transition-colors duration-300 group"
                  aria-label="Toggle search"
                >
                  <HugeiconsIcon 
                    icon={isSearchOpen ? Cancel01Icon : Search01Icon} 
                    size={20} 
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>
    </>
  );
}
