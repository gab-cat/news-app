import { HugeiconsIcon } from "@hugeicons/react";
import { File02Icon } from "@hugeicons/core-free-icons";
import { Button } from "./button";
import { Link } from "@tanstack/react-router";

interface EditorialEmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  icon?: any;
  variant?: "default" | "gradient";
}

export function EditorialEmptyState({
  title,
  description,
  action,
  secondaryAction,
  icon = File02Icon,
  variant = "default",
}: EditorialEmptyStateProps) {
  const bgClass = variant === "gradient" 
    ? "bg-gradient-to-br from-muted/50 via-background to-muted/30" 
    : "bg-card/30";

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center border rounded-xl border-dashed border-border ${bgClass}`}>
      <div className="bg-muted p-4 rounded-full mb-6 animate-pulse">
        <HugeiconsIcon icon={icon} size={32} className="text-muted-foreground" />
      </div>
      <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-3">
        {action && (
          action.href ? (
            <Link to={action.href}>
              <Button>{action.label}</Button>
            </Link>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )
        )}
        {secondaryAction && (
          secondaryAction.href ? (
            <Link to={secondaryAction.href}>
              <Button variant="outline">{secondaryAction.label}</Button>
            </Link>
          ) : (
            <Button variant="outline" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
          )
        )}
      </div>
    </div>
  );
}
