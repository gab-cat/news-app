import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";

export function PublicFooter() {
  const { data: categories } = useQuery(convexQuery(api.categories.list, {}));

  return (
    <footer className="py-20 bg-background text-foreground border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-20">
          <div className="space-y-6 max-w-sm">
            <Link to="/" className="font-serif text-3xl font-black tracking-tighter">
              CHRONICLE
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An ultra-premium publication dedicated to the pursuit of truth through exceptional storytelling and avant-garde design.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">The Pub</h4>
              <nav className="flex flex-col gap-3 text-[13px] font-medium">
                <Link to="/" className="hover:underline underline-offset-4">Manifesto</Link>
                <Link to="/" className="hover:underline underline-offset-4">Our Editors</Link>
                <Link to="/" className="hover:underline underline-offset-4">Ethical Charter</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Categories</h4>
              <nav className="flex flex-col gap-3 text-[13px] font-medium">
                 {categories?.slice(0, 4).map(cat => (
                   <Link key={cat._id} to="/category/$slug" params={{ slug: cat.slug }} className="hover:underline underline-offset-4">{cat.name}</Link>
                 ))}
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Social</h4>
              <nav className="flex flex-col gap-3 text-[13px] font-medium">
                <a href="#" className="hover:underline underline-offset-4">Entropy X</a>
                <a href="#" className="hover:underline underline-offset-4">Visual Feed</a>
                <a href="#" className="hover:underline underline-offset-4">Sonic Stream</a>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          <p>© {new Date().getFullYear()} Chronicle Publishing Group. All rights reserved.</p>
          <div className="flex items-center gap-8">
             <Link to="/">Terms</Link>
             <Link to="/">Privacy</Link>
             <Link to="/">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
