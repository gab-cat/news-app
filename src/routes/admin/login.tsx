import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate({ to: "/admin" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSignIn = async () => {
    try {
      await signIn("google", { redirectTo: "/admin" });
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Logo />
          <div className="h-4 w-32 bg-accent rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <Card className="border-border/50 shadow-2xl shadow-primary/5 backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
              <span className="text-xl font-bold text-primary italic">A</span>
            </div>
            <CardTitle className="text-2xl font-serif font-bold tracking-tight">Admin Portal</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Sign in to manage your publication and content.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Button
              onClick={handleSignIn}
              size="lg"
              className="w-full h-14 text-base font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              <GoogleIcon className="mr-3 w-5 h-5" />
              Continue with Google
            </Button>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Chronicle Editorial Management System
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
