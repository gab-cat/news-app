
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-start leading-none", className)}>
      <span className="font-serif text-2xl font-bold tracking-tighter">
        The
        <span className="text-primary italic ml-1">Daily</span>
      </span>
      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground font-sans font-semibold ml-[2px]">
        Chronicle
      </span>
    </div>
  );
}
