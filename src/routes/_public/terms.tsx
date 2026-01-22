import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/terms")({
  head: () => ({
    meta: [
      {
        title: "Terms of Service — Chronicle",
      },
      {
        name: "description",
        content: "Chronicle's terms of service and legal agreement for using our platform.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-20 lg:py-32">
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <header className="space-y-4 border-b border-border/40 pb-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">
              Legal
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-black tracking-tighter">
            Terms of Service.
          </h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
            Effective Date: January 21, 2026
          </p>
        </header>

        <section className="prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-li:text-muted-foreground/90">
          <p className="font-serif italic text-xl mb-12">
            Welcome to Chronicle. By accessing our platform, you agree to be bound by these terms. Please read them with the same attention we give to our reports.
          </p>

          <div className="space-y-16 mt-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif border-b border-border/20 pb-4">1. Acceptance of Terms</h2>
              <p>
                By using Chronicle (the "Service"), you agree to the following terms and conditions. If you do not agree to these terms, please refrain from using our platform. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of those changes.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif border-b border-border/20 pb-4">2. Intellectual Property</h2>
              <p>
                All content published on Chronicle, including articles, photography, illustrations, and design elements, is the exclusive property of Chronicle Publishing Group and its contributors. Unauthorized reproduction, distribution, or commercial use of our content without express written consent is strictly prohibited.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif border-b border-border/20 pb-4">3. User Conduct</h2>
              <p>
                We value a respectful and intellectual discourse. When interacting with our community features, you agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Engage in harassment or hate speech.</li>
                <li>Post defamatory or libelous content.</li>
                <li>Attempt to scrape or harvest data from our systems.</li>
                <li>Impersonate Chronicle staff or other members.</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif border-b border-border/20 pb-4">4. Limitation of Liability</h2>
              <p>
                While we strive for absolute accuracy in our journalism, Chronicle provides its services "as is" without warranties of any kind. We are not liable for any damages resulting from your use of the platform or reliance on its content.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif border-b border-border/20 pb-4">5. Governing Law</h2>
              <p>
                These terms are governed by and construed in accordance with the laws of the jurisdiction in which Chronicle Publishing Group is headquartered, without regard to its conflict of law principles.
              </p>
            </div>
          </div>
        </section>

        <footer className="pt-20 border-t border-border/40 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
            In Pursuit of Truth.
          </p>
        </footer>
      </div>
    </div>
  );
}
