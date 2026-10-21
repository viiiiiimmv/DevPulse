import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import {
  Activity,
  GitBranch,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BarChart3,
  Cpu,
  Layers,
  Zap,
  Lock,
  CheckCircle2,
  Code2,
  RefreshCw,
  Terminal,
  KeyRound,
  FileCheck,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { PlatformPreview } from "@/components/platform-preview";

export const metadata = {
  title: "DevPulse - GitHub Telemetry & Developer Cadence Engine",
  description: "Transform GitHub commits and multi-repository activity into real-time engineering intelligence without storing source code.",
};

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Ambient Blur Backgrounds */}
      <div className="pointer-events-none absolute left-1/2 top-[-100px] h-[550px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-transparent blur-[140px] dark:from-indigo-500/10 dark:via-violet-500/5" />
      <div className="pointer-events-none absolute right-[-150px] top-[40%] h-[450px] w-[500px] rounded-full bg-violet-600/10 blur-[130px] dark:bg-violet-600/5" />
      <div className="pointer-events-none absolute left-[-150px] top-[70%] h-[400px] w-[450px] rounded-full bg-indigo-600/10 blur-[130px] dark:bg-indigo-600/5" />

      <main className="relative z-10">
        {/* ================= HERO SECTION ================= */}
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-16 text-center sm:px-6 lg:px-8 lg:pt-24">
          
          {/* Top Pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.1em] text-primary shadow-sm shadow-primary/10 transition-transform hover:scale-105">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
            <span>Developer Telemetry &amp; Cadence Engine</span>
          </div>

          {/* Main Headline */}
          <h1 className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl font-sans leading-[1.1]">
            Turn GitHub Activity into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              Deep Engineering Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Synchronize commit velocity, analyze multi-repository language shifts, and inspect contribution cadence with real-time BullMQ queues—<strong>without ever storing your source code</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mx-auto">
            <Link
              href="/login"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-sm font-mono font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98]"
            >
              <FaGithub className="h-4 w-4" />
              <span>Connect with GitHub</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#capabilities"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border/80 bg-secondary/50 px-6 py-3.5 text-sm font-mono font-semibold text-foreground hover:bg-secondary transition-all hover:-translate-y-0.5"
            >
              <span>Explore Signals</span>
            </a>
          </div>

          {/* Trust Guarantees Bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-muted-foreground pt-4 border-t border-border/40 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Zero Source Code Retention</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <span>End-to-End Encrypted Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-violet-500" />
              <span>BullMQ Asynchronous Queues</span>
            </div>
          </div>

          {/* Interactive Console Preview Showcase */}
          <div className="mt-14">
            <PlatformPreview />
          </div>
        </section>

        {/* ================= CAPABILITIES BENTO GRID ================= */}
        <section id="capabilities" className="border-t border-border/60 bg-card/30 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-14 max-w-3xl text-center space-y-3">
              <span className="inline-block font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">
                Engineering Capabilities
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Telemetry Designed for Modern Engineering Cadence
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                DevPulse isolates the metadata that matters—velocity, syntax volume, and cross-repo dependencies—while keeping source code strictly private.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid gap-5 md:grid-cols-3">
              {/* Card 1: Velocity & Rhythm */}
              <div className="md:col-span-2 rounded-2xl border border-border bg-card/80 backdrop-blur-md p-6 sm:p-8 space-y-4 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <Activity className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 px-2.5 py-1 rounded-md">
                    Rhythm Engine
                  </span>
                </div>
                <h3 className="text-xl font-bold font-mono text-foreground">
                  Continuous Commit Pulse &amp; Cadence
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Analyze your development momentum without subjective vanity metrics. DevPulse generates an objective contribution cadence by correlating commit frequency, active days, and cross-branch velocity.
                </p>

                <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-4 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Cadence Calculation Signals</span>
                    <span className="text-emerald-500 font-bold">Live Stream</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="p-2.5 rounded-lg bg-card border border-border/60">
                      <span className="text-[10px] text-muted-foreground block">Active Days</span>
                      <span className="text-base font-bold text-foreground">Multi-Branch</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-card border border-border/60">
                      <span className="text-[10px] text-muted-foreground block">Commit Churn</span>
                      <span className="text-base font-bold text-foreground">Metadata Only</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-card border border-border/60">
                      <span className="text-[10px] text-muted-foreground block">Streak Telemetry</span>
                      <span className="text-base font-bold text-foreground">Automated</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Asynchronous BullMQ Queue */}
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-6 sm:p-8 space-y-4 hover:border-primary/40 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-mono text-foreground">
                  BullMQ Queue Pipeline
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Background synchronization runs on Redis-backed workers, shielding your rate limits while delivering instant Server-Sent Events (SSE) updates to your console.
                </p>
                <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-xs font-mono text-muted-foreground space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span>Redis Queue</span>
                    <span className="text-emerald-500 font-bold">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rate-Limit Safety</span>
                    <span className="text-primary font-bold">Automated Backoff</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Multi-Repo Orchestration */}
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-6 sm:p-8 space-y-4 hover:border-primary/40 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
                  <GitBranch className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-mono text-foreground">
                  Multi-Repo View
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track microservices, organization projects, and open-source contributions in one centralized dashboard. Compare activity across repositories seamlessly.
                </p>
              </div>

              {/* Card 4: Syntax & Language Footprint */}
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-6 sm:p-8 space-y-4 hover:border-primary/40 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-mono text-foreground">
                  Language Footprint
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Understand your language shifts over time with byte-accurate GitHub API telemetry. Spot technology migrations and evolving dependencies across repositories.
                </p>
              </div>

              {/* Card 5: Zero-Trust Security & Privacy */}
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-6 sm:p-8 space-y-4 hover:border-primary/40 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-mono text-foreground">
                  Zero Code Retention
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We process repository metadata without cloning or viewing raw source files. Least-privileged OAuth scope guarantees your IP stays untouched.
                </p>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:underline pt-1"
                >
                  <span>Learn more in Privacy Policy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ARCHITECTURE & WORKFLOW ================= */}
        <section id="architecture" className="py-24 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center space-y-3">
            <span className="inline-block font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Three-Step Architecture
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Zero Code Exposure. Instant Engineering Visibility.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "1-Click GitHub OAuth",
                desc: "Authorize DevPulse using official GitHub OAuth with least-privileged scopes. No tokens are written to disk, and no code files are cloned.",
                badge: "OAuth 2.0 Classic",
              },
              {
                step: "02",
                title: "Asynchronous Queue Ingestion",
                desc: "BullMQ and Redis process commit metadata, author SHAs, and language byte maps asynchronously with rate-limit backoff.",
                badge: "BullMQ & Redis",
              },
              {
                step: "03",
                title: "Real-Time Pulse Analytics",
                desc: "Explore commit rhythms, language composition trends, and multi-repo velocity through a clean, unified telemetry console.",
                badge: "Server-Sent Events",
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-border bg-card/60 p-6 sm:p-8 space-y-3">
                <span className="font-mono text-3xl font-black text-primary/30">
                  {item.step}
                </span>
                <div className="inline-block ml-3 font-mono text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {item.badge}
                </div>
                <h3 className="text-lg font-bold font-mono text-foreground pt-1">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= PRIVACY & SECURITY HIGHLIGHT ================= */}
        <section className="border-t border-border/60 bg-gradient-to-b from-card/40 to-background py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-card/90 p-8 sm:p-12 shadow-xl shadow-primary/5">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-primary">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Security &amp; Data Safeguards
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
                    Engineered with Privacy and Security First
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    DevPulse is engineered strictly around data minimization. We only analyze high-level commit metadata and language byte distributions. Your raw repository code files, secrets, and environment configurations are never requested, accessed, or persisted.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href="/privacy"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Read Privacy Policy</span>
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-foreground hover:bg-secondary transition-colors"
                    >
                      <FaGithub className="w-3.5 h-3.5" />
                      <span>Connect Securely</span>
                    </Link>
                  </div>
                </div>

                <div className="rounded-xl border border-border/80 bg-secondary/30 p-5 space-y-3 font-mono text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 font-bold text-foreground pb-2 border-b border-border/50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Security Baseline
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center justify-between">
                      <span>Source Code Cloned:</span>
                      <strong className="text-emerald-500">None (0 Files)</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Data Collected:</span>
                      <strong className="text-foreground">Commit &amp; Language Metadata</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Encryption:</span>
                      <strong className="text-foreground">TLS 1.3 in Transit</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Revocation:</span>
                      <strong className="text-foreground">1-Click from GitHub</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="py-20 text-center mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Instant Setup // Zero Overhead
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-sans">
              Ready to Understand Your Code Cadence?
            </h2>
            <p className="max-w-xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
              Connect your GitHub account in seconds to begin aggregating commit telemetry across your projects.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-sm font-mono font-bold uppercase tracking-wider text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              >
                <FaGithub className="h-4 w-4" />
                <span>Launch Console with GitHub</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ================= COMPREHENSIVE FOOTER ================= */}
      <footer className="border-t border-border/60 bg-card/60 backdrop-blur-md py-14 text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="space-y-3 sm:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-mono text-lg font-bold text-foreground">
                  DevPulse
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm text-muted-foreground">
                Engineering rhythm, repository telemetry, and developer cadence analytics without code retention.
              </p>
            </div>

            {/* Platform Links */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                Platform
              </h4>
              <ul className="space-y-2 text-xs font-mono">
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

            {/* Legal & Security */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                Legal &amp; Privacy
              </h4>
              <ul className="space-y-2 text-xs font-mono">
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
                    Data Minimisation Charter
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

          <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <p>
              &copy; {new Date().getFullYear()} DevPulse Technologies. All rights reserved.
            </p>
            <p className="text-muted-foreground text-[11px]">
              Privacy-First Developer Telemetry
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
