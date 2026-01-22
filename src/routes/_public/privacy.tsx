import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/privacy")({
  head: () => ({
    meta: [
      {
        title: "Privacy Policy — Chronicle",
      },
      {
        name: "description",
        content: "How Chronicle handles your digital presence and respects your privacy.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-20 lg:py-32">
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <header className="space-y-4 border-b border-border/40 pb-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">
              Transparency
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-black tracking-tighter">
            Privacy Policy.
          </h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
            Last Updated: January 21, 2026
          </p>
        </header>

        <section className="prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-li:text-muted-foreground/90">
          <p className="font-serif italic text-xl mb-12">
            Your privacy is as sacred as our journalistic integrity. This policy outlines how we handle your digital presence on our platform.
          </p>

          <div className="space-y-16 mt-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif border-b border-border/20 pb-4">1. Information Collection</h2>
              <p>
                We collect information essential to providing a refined experience. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Account details you provide during registration.</li>
                <li>Subscription and payment information.</li>
                <li>Digital identifiers and browsing patterns to improve content curation.</li>
                <li>Interactions with our newsletters and multimedia content.</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif border-b border-border/20 pb-4">2. Use of Information</h2>
              <p>
                Your data is used exclusively to:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Personalize the "CHRONICLE" experience.</li>
                <li>Send curated news bulletins and editorial alerts.</li>
                <li>Perform internal analytics to refine our storytelling.</li>
                <li>Maintain the security and integrity of our publication.</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif border-b border-border/20 pb-4">3. Data Stewardship</h2>
              <p>
                We do not sell your personal data to third parties. We only share information with trusted partners necessary for service delivery (e.g., payment processors, email providers) who adhere to strict confidentiality standards.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif border-b border-border/20 pb-4">4. Security Measures</h2>
              <p>
                Chronicle employs advanced encryption and security protocols to protect your information against unauthorized access, alteration, or disclosure. However, no digital system is entirely impenetrable, and we encourage prudent digital practices.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif border-b border-border/20 pb-4">5. Your Digital Rights</h2>
              <p>
                You retain full control over your data. You may access, correct, or request the deletion of your personal information at any time through your account settings or by contacting our editorial operations team.
              </p>
            </div>
          </div>
        </section>

        <footer className="pt-20 border-t border-border/40 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
            Journalism Built on Trust.
          </p>
        </footer>
      </div>
    </div>
  );
}
