import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import {
  Activity,
  GitBranch,
  ShieldCheck,
  ArrowRight,
  Cpu,
  Lock,
  CheckCircle2,
  Code2,
  Terminal,
  FileCheck,
  Server,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { WelcomeHeroConsole, InteractiveSampleExplorer } from "@/components/welcome-console";

export const metadata = {
  title: "DevPulse - GitHub Telemetry & Developer Cadence Console",
  description:
    "Analyze commit velocity, repository cadence, and syntax distribution across GitHub projects without storing source code.",
};

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <main className="w-full">
        {/* ================= 1. HERO SECTION: ASYMMETRIC COMMAND DECK ================= */}
        <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 sm:pt-12 sm:pb-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Telemetry Thesis & Actions (5 cols) */}
            <div className="space-y-6 lg:col-span-5 lg:pt-2">
              {/* Telemetry Status Pill */}
              <div className="inline-flex items-center gap-2 rounded-sm border border-border bg-surface-raised px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>DevPulse // Telemetry Console v2.4</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.15]">
                Git telemetry and cadence engine for developers.
              </h1>

              {/* Subtitle / Objective Explanation */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Measure commit velocity, active cadence, and syntax distribution across your GitHub repositories.
                Synchronized via asynchronous background workers with strict data minimization—<strong>zero raw source code stored or inspected</strong>.
              </p>

              {/* Primary & Secondary Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <FaGithub className="h-4 w-4" />
                  <span>Continue with GitHub</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <a
                  href="#specs"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface-raised px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span>Inspect Archetype Explorer</span>
                </a>
              </div>

              {/* Technical Scope Guarantees */}
              <div className="pt-4 border-t border-border/60">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  Ingestion Constraints &amp; Baseline Guarantees
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
                  <div className="flex items-center gap-2 rounded-sm border border-border/60 bg-surface-subtle p-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>0 code files cloned</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-sm border border-border/60 bg-surface-subtle p-2">
                    <Lock className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>repo metadata only</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-sm border border-border/60 bg-surface-subtle p-2">
                    <Cpu className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>Async queue jobs</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-sm border border-border/60 bg-surface-subtle p-2">
                    <Server className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>SSE real-time stream</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Real Product Fragment (7 cols) */}
            <div className="lg:col-span-7">
              <WelcomeHeroConsole />
            </div>
          </div>
        </section>

        {/* ================= 2. TELEMETRY MATRIX (WHAT IT MEASURES) ================= */}
        <section id="telemetry" className="border-t border-border bg-surface-subtle/60 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                  Engineering Telemetry Specification
                </span>
                <h2 className="mt-1 font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Telemetry vectors calculated across repositories
                </h2>
              </div>
              <p className="text-xs font-mono text-muted-foreground max-w-md">
                Direct GitHub API telemetry indexed without storing source trees, pull request bodies, or developer credentials.
              </p>
            </div>

            {/* 4-Column Technical Specification Grid */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {/* Vector 1 */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                    Vector // 01
                  </span>
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-mono text-base font-bold text-foreground">
                  Cadence &amp; Velocity Index
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Calculates objective developer momentum by correlating commit frequency, streak continuity, and active working days over a 30-day sliding window.
                </p>
                <div className="rounded-md border border-border bg-surface-subtle p-2.5 font-mono text-[11px] text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Active Days Ratio:</span>
                    <strong className="text-foreground">Active Days / 30</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Streak Tracking:</span>
                    <strong className="text-amber-400">Backwards Traversal</strong>
                  </div>
                </div>
              </div>

              {/* Vector 2 */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                    Vector // 02
                  </span>
                  <Code2 className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-mono text-base font-bold text-foreground">
                  Byte-Level Syntax Distribution
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Aggregates language allocations directly from GitHub language byte maps across all registered projects to monitor stack composition.
                </p>
                <div className="rounded-md border border-border bg-surface-subtle p-2.5 font-mono text-[11px] text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Precision:</span>
                    <strong className="text-foreground">Byte-Accurate</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Aggregation:</span>
                    <strong className="text-foreground">Sum Bytes / Total</strong>
                  </div>
                </div>
              </div>

              {/* Vector 3 */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                    Vector // 03
                  </span>
                  <GitBranch className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-mono text-base font-bold text-foreground">
                  Multi-Repository Topography
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Centralizes telemetry across public and private personal repositories. Compares velocity and repository engagement in one console view.
                </p>
                <div className="rounded-md border border-border bg-surface-subtle p-2.5 font-mono text-[11px] text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Scope:</span>
                    <strong className="text-foreground">Public &amp; Private</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Signals:</span>
                    <strong className="text-foreground">Stars, Forks, Recency</strong>
                  </div>
                </div>
              </div>

              {/* Vector 4 */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                    Vector // 04
                  </span>
                  <Cpu className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-mono text-base font-bold text-foreground">
                  Rate-Limit Aware Queues
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Asynchronous background workers ingest repository events with automated exponential backoff to preserve GitHub API rate limits.
                </p>
                <div className="rounded-md border border-border bg-surface-subtle p-2.5 font-mono text-[11px] text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Dispatch Engine:</span>
                    <strong className="text-foreground">BullMQ &amp; Async Queue</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Client Updates:</span>
                    <strong className="text-emerald-400">Server-Sent Events</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. INTERACTIVE SAMPLE EXPLORER ================= */}
        <section id="specs" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                  Interactive Sandbox
                </span>
                <h2 className="mt-1 font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Inspect archetype telemetry before connecting
                </h2>
              </div>
              <p className="text-xs font-mono text-muted-foreground max-w-md">
                Select an engineering stack archetype below to see how the metrics engine computes cadence ratings, streaks, and language byte percentages.
              </p>
            </div>

            <InteractiveSampleExplorer />
          </div>
        </section>

        {/* ================= 4. DATA MINIMIZATION & SECURITY LEDGER ================= */}
        <section id="security" className="border-t border-border bg-surface-subtle/60 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-sm border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  DPDP Act 2023 Compliant // Data Minimization Charter
                </div>
                <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Security and telemetry ingestion ledger
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs font-medium text-foreground hover:bg-surface-raised transition-colors"
                >
                  <FileCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Read Privacy Policy</span>
                </Link>
                <Link
                  href="/data-minimisation"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs font-medium text-foreground hover:bg-surface-raised transition-colors"
                >
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  <span>Charter</span>
                </Link>
              </div>
            </div>

            {/* Structured Technical Comparison Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-border bg-surface-subtle text-muted-foreground uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4 font-bold">Telemetry Vector</th>
                      <th className="py-3 px-4 font-bold">Ingestion Status</th>
                      <th className="py-3 px-4 font-bold">Storage Scope</th>
                      <th className="py-3 px-4 font-bold">Engine Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr className="hover:bg-surface-raised/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">Source Code Files &amp; Trees</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="h-3 w-3" /> Never Read / 0 Bytes
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">None (No disk clone, no database row)</td>
                      <td className="py-3.5 px-4 text-muted-foreground">Code privacy &amp; IP protection</td>
                    </tr>
                    <tr className="hover:bg-surface-raised/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">Commit Metadata (SHA, Timestamp, Author)</td>
                      <td className="py-3.5 px-4 text-foreground">Read via GitHub API</td>
                      <td className="py-3.5 px-4 text-foreground">Indexed in PostgreSQL</td>
                      <td className="py-3.5 px-4 text-muted-foreground">Cadence index &amp; streak calculation</td>
                    </tr>
                    <tr className="hover:bg-surface-raised/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">Language Byte Maps</td>
                      <td className="py-3.5 px-4 text-foreground">Read via GitHub API</td>
                      <td className="py-3.5 px-4 text-foreground">Byte counts per repo</td>
                      <td className="py-3.5 px-4 text-muted-foreground">Stack composition analytics</td>
                    </tr>
                    <tr className="hover:bg-surface-raised/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">Repository Secrets &amp; Environment Files</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="h-3 w-3" /> Strictly Discarded
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">None</td>
                      <td className="py-3.5 px-4 text-muted-foreground">Zero credential exposure</td>
                    </tr>
                    <tr className="hover:bg-surface-raised/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">GitHub OAuth Permissions</td>
                      <td className="py-3.5 px-4 text-foreground">OAuth Classic Scope (`repo`, `read:user`)</td>
                      <td className="py-3.5 px-4 text-muted-foreground">Session-bound JWT cookie only</td>
                      <td className="py-3.5 px-4 text-muted-foreground">Read-only metadata API queries</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 5. DIRECT TERMINAL INGESTION ACTION ================= */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                    devpulse://auth/connect
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400">
                  ready for ingestion
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Connect GitHub to begin telemetry ingestion.
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  DevPulse creates your telemetry profile using official GitHub OAuth. Ingestion starts in the background and streams live updates directly to your dashboard.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <FaGithub className="h-4 w-4" />
                  <span>Continue with GitHub</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface-raised px-4 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground hover:bg-surface transition-colors"
                >
                  <span>Review OAuth Permissions</span>
                </Link>
              </div>

              <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Read-only metadata access
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  1-click revocation from GitHub
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= 6. UNIFIED ENGINEERING FOOTER ================= */}
      <footer className="border-t border-border bg-surface-subtle py-12 text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
            {/* Brand Column */}
            <div className="space-y-3 sm:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-base font-bold text-foreground">
                  DevPulse
                </span>
              </div>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                Developer cadence and multi-repository telemetry console. Processing commit metadata with background queues without code retention.
              </p>
            </div>

            {/* Platform Links */}
            <div className="space-y-2.5">
              <span className="font-bold uppercase tracking-wider text-foreground">
                Telemetry Console
              </span>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/repos" className="hover:text-foreground transition-colors">
                    Repositories
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="hover:text-foreground transition-colors">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    GitHub Connect
                  </Link>
                </li>
              </ul>
            </div>

            {/* Security & Regulatory Links */}
            <div className="space-y-2.5">
              <span className="font-bold uppercase tracking-wider text-foreground">
                Security &amp; Legal
              </span>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/data-minimisation" className="hover:text-foreground transition-colors">
                    Data Minimisation
                  </Link>
                </li>
                <li>
                  <a href="mailto:privacy@devpulse.io" className="hover:text-foreground transition-colors">
                    Security Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <p>&copy; {new Date().getFullYear()} DevPulse Technologies. All rights reserved.</p>
            <p className="text-muted-foreground">
              DPDP Act 2023 Compliant Developer Telemetry
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
