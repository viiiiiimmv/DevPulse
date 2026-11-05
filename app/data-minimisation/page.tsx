import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  ArrowLeft,
  Calendar,
  Building2,
  CheckCircle2,
  XCircle,
  Database,
  Cpu,
  Trash2,
} from "lucide-react";

export const metadata = {
  title: "Data Minimisation Charter | DevPulse",
  description: "DevPulse Data Minimisation Charter detailing our architectural commitments to zero code retention, ephemeral processing, and privacy by design.",
};

export default function DataMinimisationCharterPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            Engineering Privacy Charter
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Data Minimisation Charter
          </h1>

          <p className="max-w-3xl text-base text-muted-foreground leading-relaxed sm:text-lg">
            Our architectural commitment to collecting only what is strictly necessary to compute engineering signals—and nothing more. Zero source code retention, ephemeral processing, and least-privileged access.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Effective Date: {lastUpdated}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              Engineering Standard: Zero-Trust Telemetry
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Detailed Charter Sections */}
          <div className="space-y-10">

            {/* Core Principle Banner */}
            <section className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-6 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>The Core Principle: Metadata Only</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                DevPulse was engineered from the very first commit on the premise that <strong>developers should not have to surrender source code to understand engineering cadence</strong>. We process commits, timestamps, and language volume without ever downloading, parsing, or storing your repository files.
              </p>
            </section>

            {/* Five Pillars of Data Minimisation */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">01.</span> The Five Architectural Pillars
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>1. Zero Code Retention</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We never run `git clone`, never inspect source trees, and never store file blobs. We only request commit headers and language byte counts.
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Lock className="w-4 h-4 text-emerald-500" />
                    <span>2. Least-Privileged Scope</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    OAuth authorizations request strictly read-level metadata. DevPulse cannot make commits, push code, or open pull requests on your behalf.
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Cpu className="w-4 h-4 text-violet-500" />
                    <span>3. Ephemeral Ingestion</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    BullMQ and Redis process sync jobs in memory. Once aggregated commit counts and language distributions are saved, raw API response payloads are discarded.
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Database className="w-4 h-4 text-cyan-500" />
                    <span>4. Isolated Schemas</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Database tables only store normalized numerical statistics, repo identifiers, and commit timestamps, indexed strictly for velocity charts.
                  </p>
                </div>

                <div className="sm:col-span-2 rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Trash2 className="w-4 h-4 text-amber-500" />
                    <span>5. Complete 1-Click Revocation &amp; Purge</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You can revoke access instantly from your GitHub settings. Any data deletion request triggers complete cascading erasure across our PostgreSQL records within 30 days.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Classification Matrix */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">02.</span> Data Classification &amp; Retention Matrix
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The table below provides total transparency regarding how every single data element is handled:
              </p>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 bg-secondary/40 text-foreground">
                      <th className="p-3 font-bold">Data Element</th>
                      <th className="p-3 font-bold">Collected?</th>
                      <th className="p-3 font-bold">Persisted?</th>
                      <th className="p-3 font-bold">Purpose</th>
                      <th className="p-3 font-bold">Retention SLA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-muted-foreground">
                    <tr>
                      <td className="p-3 font-bold text-foreground">Source Code Files</td>
                      <td className="p-3 text-red-500 font-bold">NEVER</td>
                      <td className="p-3 text-red-500 font-bold">NO</td>
                      <td className="p-3">None</td>
                      <td className="p-3">Not applicable</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">Passwords &amp; SSH Keys</td>
                      <td className="p-3 text-red-500 font-bold">NEVER</td>
                      <td className="p-3 text-red-500 font-bold">NO</td>
                      <td className="p-3">None</td>
                      <td className="p-3">Not applicable</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">GitHub User ID &amp; Username</td>
                      <td className="p-3 text-emerald-500 font-bold">YES</td>
                      <td className="p-3 text-emerald-500 font-bold">YES</td>
                      <td className="p-3">Account identity</td>
                      <td className="p-3">Until account deletion</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">Commit SHAs &amp; Timestamps</td>
                      <td className="p-3 text-emerald-500 font-bold">YES</td>
                      <td className="p-3 text-emerald-500 font-bold">YES</td>
                      <td className="p-3">Cadence telemetry</td>
                      <td className="p-3">Until account deletion</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">Language Byte Totals</td>
                      <td className="p-3 text-emerald-500 font-bold">YES</td>
                      <td className="p-3 text-emerald-500 font-bold">YES</td>
                      <td className="p-3">Stack footprint</td>
                      <td className="p-3">Until account deletion</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">OAuth Access Token</td>
                      <td className="p-3 text-emerald-500 font-bold">YES</td>
                      <td className="p-3 text-amber-500 font-bold">SESSION ONLY</td>
                      <td className="p-3">API querying</td>
                      <td className="p-3">Cleared on sign out</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* How to Verify */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">03.</span> How Developers Can Verify This
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We believe trust is built on verifiability:
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Inspect GitHub OAuth Permissions:</strong> Check the exact scope list in your GitHub account under Authorized OAuth Apps (`read:user`, `user:email`, `repo`).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Audit Log Visibility:</strong> Every sign-in, sync job, and sign-out is recorded and visible directly in your user activity stream.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Export &amp; Erasure Requests:</strong> Request a full database dump of your records or trigger instantaneous purging by contacting our privacy team.
                  </span>
                </li>
              </ul>
            </section>

          </div>

          {/* Quick Summary / Legal Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 sticky top-24">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Charter Highlights
              </h3>

              <div className="space-y-3 text-xs">
                <div className="rounded-md border border-border/60 bg-secondary/20 p-3">
                  <span className="font-bold text-foreground block">Zero Code Stored</span>
                  <span className="text-muted-foreground">Zero files, zero trees, zero branches cloned.</span>
                </div>
                <div className="rounded-md border border-border/60 bg-secondary/20 p-3">
                  <span className="font-bold text-foreground block">Ephemeral Redis Sync</span>
                  <span className="text-muted-foreground">In-memory BullMQ queue processing.</span>
                </div>
                <div className="rounded-md border border-border/60 bg-secondary/20 p-3">
                  <span className="font-bold text-foreground block">1-Click Purge</span>
                  <span className="text-muted-foreground">Instant revocation from GitHub at any moment.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 space-y-3">
                <p className="text-[11px] text-muted-foreground">
                  Want to learn more about our data handling policies?
                </p>
                <Link
                  href="/privacy"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs font-mono font-bold uppercase text-foreground hover:bg-secondary/80 transition-colors border border-border"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  View Privacy Policy
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
