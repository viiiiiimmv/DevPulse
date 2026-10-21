import Link from "next/link";
import {
  FileText,
  ShieldAlert,
  Scale,
  ArrowLeft,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  GitBranch,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export const metadata = {
  title: "Terms of Service | DevPulse",
  description: "DevPulse Terms of Service governing access, GitHub OAuth integration, intellectual property, and usage policies.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "October 22, 2026";

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[130px] dark:bg-indigo-500/5" />
      <div className="pointer-events-none absolute right-10 top-96 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[100px] dark:bg-violet-500/5" />

      {/* Header Container */}
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-[0.1em] text-primary">
            <Scale className="w-3.5 h-3.5" />
            Legal Agreement
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Terms of Service
          </h1>

          <p className="max-w-3xl text-base text-muted-foreground leading-relaxed sm:text-lg">
            Please read these Terms of Service carefully before using DevPulse. By signing in with GitHub or accessing any part of our developer console, you agree to be bound by these terms.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Effective Date: {lastUpdated}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              Jurisdiction: Bengaluru, India
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Detailed Terms Sections */}
          <div className="space-y-10">

            {/* Quick Summary Alert */}
            <section className="rounded-xl border border-primary/25 bg-primary/5 p-5 text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-primary">
                <FileText className="w-5 h-5 flex-shrink-0" />
                <span>At a Glance Summary</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                DevPulse is an engineering telemetry and activity rhythm platform. We connect to your GitHub account to compute commit trends and language distribution. We <strong>never store or alter your source code</strong>, and you retain 100% ownership of your intellectual property.
              </p>
            </section>

            {/* 1. Acceptance of Terms */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">01.</span> Acceptance of Terms
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;you&rdquo;) and DevPulse Technologies (&ldquo;DevPulse&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By accessing our website, creating an account, or authenticating via GitHub OAuth, you acknowledge that you have read, understood, and agree to be bound by these Terms and our{" "}
                <Link href="/privacy" className="text-primary hover:underline font-semibold">
                  Privacy Policy
                </Link>.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you are using DevPulse on behalf of an organization or company, you represent and warrant that you have full legal authority to bind that entity to these Terms.
              </p>
            </section>

            {/* 2. Description of Service */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">02.</span> Description of Service
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DevPulse provides engineering analytics, contribution frequency metrics, and multi-repository cadence telemetry based on GitHub activity. The services include:
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Aggregated commit timestamps, frequency rhythms, and velocity scores.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Programming language byte distribution across selected repositories.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Asynchronous background sync management via BullMQ queues and Server-Sent Events (SSE).</span>
                </li>
              </ul>
            </section>

            {/* 3. GitHub OAuth & Third-Party Integration */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">03.</span> GitHub Integration &amp; API Terms
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DevPulse uses GitHub OAuth to access repository metadata on your behalf. By authorizing DevPulse, you grant us permission to query GitHub REST APIs strictly within the granted classic scope:
              </p>
              <div className="rounded-lg border border-border/70 bg-secondary/25 p-4 text-xs font-mono space-y-1.5 text-muted-foreground">
                <p><span className="text-foreground font-semibold">Authorized Scopes:</span> `read:user`, `user:email`, `repo`</p>
                <p><span className="text-foreground font-semibold">Purpose:</span> Query public and private commit activity and language bytes</p>
                <p><span className="text-foreground font-semibold">API Compliance:</span> We respect GitHub rate limits, headers, and Terms of Service</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You must comply with GitHub&apos;s Terms of Service and Acceptable Use Policies. DevPulse is not endorsed by or affiliated with GitHub, Inc.
              </p>
            </section>

            {/* 4. Intellectual Property & Code Ownership */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">04.</span> Intellectual Property &amp; Your Code
              </h2>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-muted-foreground space-y-2">
                <strong className="text-foreground flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Lock className="w-4 h-4" />
                  Your Source Code Stays 100% Yours:
                </strong>
                <p>
                  You retain all rights, title, and interest in and to your source code, repositories, commit histories, and trademarks. DevPulse does <strong>not</strong> claim any ownership or license over your code. We do not clone, store, or sell source files.
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DevPulse and its original console UI, design assets, trademarks, algorithms, and documentation remain the exclusive intellectual property of DevPulse Technologies.
              </p>
            </section>

            {/* 5. User Responsibilities & Acceptable Use */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">05.</span> Acceptable Use Policy
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Attempting to reverse engineer, decompile, or exploit our BullMQ background workers or APIs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Flooding synchronization endpoints or bypassing rate-limiting protections.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Connecting repositories containing illegal, malicious, or abusive content.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Impersonating other GitHub users or accessing accounts without authorization.</span>
                </li>
              </ul>
            </section>

            {/* 6. Disclaimers & Limitation of Liability */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">06.</span> Disclaimers &amp; Limitation of Liability
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DevPulse is provided on an <strong>&ldquo;AS IS&rdquo;</strong> and <strong>&ldquo;AS AVAILABLE&rdquo;</strong> basis without warranties of any kind, whether express or implied.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                In no event shall DevPulse Technologies, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or GitHub rate-limit downtime, arising from your use of or inability to use the service.
              </p>
            </section>

            {/* 7. Termination & Revocation */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">07.</span> Account Termination &amp; Revocation
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You may terminate your agreement with DevPulse at any time by revoking DevPulse&apos;s access in your <strong>GitHub Settings &gt; Applications &gt; Authorized OAuth Apps</strong> and signing out of your session.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in activities harmful to other users or our infrastructure.
              </p>
            </section>

            {/* 8. Governing Law & Jurisdiction */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">08.</span> Governing Law &amp; Jurisdiction
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the <strong>Republic of India</strong>. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Bengaluru, Karnataka, India</strong>.
              </p>
            </section>

          </div>

          {/* Quick Summary / Legal Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 sticky top-24">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Terms Index
              </h3>

              <div className="space-y-2 text-xs font-mono">
                <a href="#acceptance" className="block text-muted-foreground hover:text-foreground">01. Acceptance</a>
                <a href="#service" className="block text-muted-foreground hover:text-foreground">02. Service Description</a>
                <a href="#github" className="block text-muted-foreground hover:text-foreground">03. GitHub OAuth</a>
                <a href="#ip" className="block text-muted-foreground hover:text-foreground">04. Code Ownership</a>
                <a href="#use" className="block text-muted-foreground hover:text-foreground">05. Acceptable Use</a>
                <a href="#liability" className="block text-muted-foreground hover:text-foreground">06. Liability</a>
                <a href="#termination" className="block text-muted-foreground hover:text-foreground">07. Termination</a>
                <a href="#governing" className="block text-muted-foreground hover:text-foreground">08. Jurisdiction</a>
              </div>

              <div className="pt-4 border-t border-border/60 space-y-3">
                <p className="text-[11px] text-muted-foreground">
                  Questions regarding our terms or legal agreements?
                </p>
                <a
                  href="mailto:legal@devpulse.io"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs font-mono font-bold uppercase text-foreground hover:bg-secondary/80 transition-colors border border-border"
                >
                  Contact Legal Team
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
