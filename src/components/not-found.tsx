import { Link } from "@tanstack/react-router";
import { ArrowRight02Icon, News01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/10">
      {/* Slim Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center group">
              <span className="font-serif text-2xl font-black tracking-tighter group-hover:italic transition-all duration-500">
                CHRONICLE
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-20 overflow-hidden relative">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-serif font-black text-muted/5 select-none -z-10 leading-none">
          404
        </div>

        <div className="max-w-2xl mx-auto px-4 text-center space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 text-primary">
              <span className="h-px w-8 bg-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                System Error
              </span>
              <span className="h-px w-8 bg-primary" />
            </div>
            
            <h1 className="font-serif text-6xl md:text-8xl font-black tracking-tighter leading-none">
              Lost In The Archive.
            </h1>
            
            <p className="text-xl text-muted-foreground font-serif italic max-w-lg mx-auto leading-relaxed">
              The narrative you seek has either moved to another dimension or was never written into our archives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/">
              <Button size="lg" className="h-12 px-8 uppercase tracking-widest text-[10px] font-black">
                Return To Intelligence Base
                <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
              </Button>
            </Link>
          </div>

          <div className="pt-12 border-t border-border/40">
            <div className="flex items-center justify-center gap-3 text-muted-foreground/60">
              <HugeiconsIcon icon={News01Icon} size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Chronicle Editorial Group // Security Protocol 404
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <p>© {new Date().getFullYear()} Chronicle Publishing Group. All rights reserved.</p>
          <div className="flex items-center gap-8 text-foreground/40">
            <Link to="/" className="hover:text-primary transition-colors">Manifesto</Link>
            <Link to="/" className="hover:text-primary transition-colors">Archive</Link>
            <Link to="/" className="hover:text-primary transition-colors">Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
