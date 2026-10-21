"use client";

import { useState } from "react";
import {
  Activity,
  GitBranch,
  Layers,
  Cpu,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  Code2,
  Zap,
} from "lucide-react";

export function PlatformPreview() {
  const [activeTab, setActiveTab] = useState<"velocity" | "repos" | "languages" | "pipeline">("velocity");
  const [timeframe, setTimeframe] = useState<"7d" | "30d">("7d");

  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-indigo-500/5">
      {/* Console Window Titlebar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          <span className="font-mono text-xs font-bold text-muted-foreground tracking-wide">
            devpulse-engine // telemetry-console
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline text-emerald-500 font-semibold">Live Telemetry</span>
          <span className="hidden sm:inline text-border">|</span>
          <span className="text-[11px]">v2.4.0</span>
        </div>
      </div>

      {/* Segmented Tab Controls (Responsive grid, zero overflow, no scrollbars) */}
      <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl border border-border/60 bg-secondary/35">
        {[
          { id: "velocity", label: "Cadence & Rhythm", icon: Activity },
          { id: "repos", label: "Repositories", icon: GitBranch },
          { id: "languages", label: "Tech Stack", icon: Code2 },
          { id: "pipeline", label: "Queue Engine", icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
                active
                  ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Panel */}
      <div className="mt-6">
        {activeTab === "velocity" && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Header Metrics */}
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-border/60 bg-secondary/25 p-3.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Cadence Index</span>
                <p className="mt-1 text-2xl font-mono font-extrabold text-foreground">94.8%</p>
                <span className="text-[11px] text-emerald-500 flex items-center gap-1 font-mono mt-0.5">
                  <TrendingUp className="w-3 h-3" /> +12.4% vs baseline
                </span>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/25 p-3.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Sync Frequency</span>
                <p className="mt-1 text-2xl font-mono font-extrabold text-foreground">Real-Time</p>
                <span className="text-[11px] text-muted-foreground font-mono mt-0.5">BullMQ Worker Active</span>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/25 p-3.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Privacy Protection</span>
                <p className="mt-1 text-2xl font-mono font-extrabold text-foreground">100%</p>
                <span className="text-[11px] text-emerald-500 font-mono mt-0.5">Zero Code Retention</span>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/25 p-3.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Telemetry Latency</span>
                <p className="mt-1 text-2xl font-mono font-extrabold text-foreground">&lt; 40ms</p>
                <span className="text-[11px] text-muted-foreground font-mono mt-0.5">In-Memory Cache</span>
              </div>
            </div>

            {/* Interactive Graph Box */}
            <div className="rounded-xl border border-border/60 bg-secondary/20 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-sm font-bold font-mono text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Continuous Contribution Rhythm &amp; Cadence Wave
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Live velocity spectrum across all registered repositories and branches
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-card rounded-md border border-border/60 p-0.5 text-[11px] font-mono">
                  <button
                    onClick={() => setTimeframe("7d")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${timeframe === "7d" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground"}`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => setTimeframe("30d")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${timeframe === "30d" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground"}`}
                  >
                    Last 30 Days
                  </button>
                </div>
              </div>

              {/* Graphical Bars */}
              <div className="h-44 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-border/40">
                {(timeframe === "7d"
                  ? [
                      { day: "Mon", val: 68, active: true },
                      { day: "Tue", val: 88, active: true },
                      { day: "Wed", val: 94, active: true },
                      { day: "Thu", val: 76, active: true },
                      { day: "Fri", val: 92, active: true },
                      { day: "Sat", val: 45, active: false },
                      { day: "Sun", val: 55, active: false },
                    ]
                  : [
                      { day: "W1", val: 60, active: true },
                      { day: "W2", val: 78, active: true },
                      { day: "W3", val: 95, active: true },
                      { day: "W4", val: 84, active: true },
                      { day: "W5", val: 70, active: true },
                      { day: "W6", val: 88, active: true },
                      { day: "W7", val: 92, active: true },
                      { day: "W8", val: 98, active: true },
                    ]
                ).map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.val}%
                    </span>
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        bar.active
                          ? "bg-gradient-to-t from-primary/80 via-indigo-500 to-violet-400 group-hover:brightness-125"
                          : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
                      }`}
                      style={{ height: `${bar.val}%` }}
                    />
                    <span className="text-[10px] font-mono text-muted-foreground mt-1 font-semibold">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "repos" && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div className="rounded-xl border border-border/60 bg-secondary/20 p-5 space-y-3">
              <h4 className="text-sm font-bold font-mono text-foreground flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-primary" />
                Synchronized Repository Topography
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Aggregates public and private repositories under OAuth scopes without storing raw source code.
              </p>

              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                {[
                  { name: "core-platform-api", branches: 8, commits: "Real-time sync", status: "Synced", tag: "TypeScript" },
                  { name: "telemetry-engine", branches: 4, commits: "Real-time sync", status: "Synced", tag: "Rust / Go" },
                  { name: "analytics-web-console", branches: 12, commits: "Real-time sync", status: "Synced", tag: "Next.js" },
                ].map((repo, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-card p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                        {repo.tag}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-500">
                        <CheckCircle2 className="w-3 h-3" /> {repo.status}
                      </span>
                    </div>
                    <p className="font-mono text-xs font-bold text-foreground truncate">{repo.name}</p>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono pt-1 border-t border-border/40">
                      <span>{repo.branches} active branches</span>
                      <span className="text-primary font-semibold">{repo.commits}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "languages" && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div className="rounded-xl border border-border/60 bg-secondary/20 p-5 space-y-4">
              <h4 className="text-sm font-bold font-mono text-foreground flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                Automated Byte-Level Language Telemetry
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Calculates syntax composition directly from GitHub language byte maps, tracking codebase evolution over time.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { name: "TypeScript", share: 44, color: "bg-indigo-500" },
                  { name: "Rust", share: 26, color: "bg-orange-500" },
                  { name: "Go", share: 18, color: "bg-cyan-500" },
                  { name: "Python / SQL", share: 12, color: "bg-violet-500" },
                ].map((lang) => (
                  <div key={lang.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono font-medium">
                      <span className="text-foreground">{lang.name}</span>
                      <span className="text-muted-foreground">{lang.share}% of total codebase</span>
                    </div>
                    <div className="h-2 rounded-full bg-card overflow-hidden">
                      <div className={`h-full rounded-full ${lang.color}`} style={{ width: `${lang.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "pipeline" && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div className="rounded-xl border border-border/60 bg-secondary/20 p-5 space-y-4">
              <h4 className="text-sm font-bold font-mono text-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                Asynchronous BullMQ Sync Engine
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Redis-backed background workers ingest repository events without blocking client rendering.
              </p>

              <div className="grid gap-3 sm:grid-cols-3 pt-1">
                <div className="rounded-lg border border-border bg-card p-3.5 space-y-1.5 font-mono text-xs">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold">Queue Dispatcher</span>
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> devpulse-sync-queue
                  </p>
                  <p className="text-[11px] text-muted-foreground">Concurrency: 5 jobs</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3.5 space-y-1.5 font-mono text-xs">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold">Worker Engine</span>
                  <p className="font-bold text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> BullMQ Worker Active
                  </p>
                  <p className="text-[11px] text-muted-foreground">Rate limit aware / Octokit</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3.5 space-y-1.5 font-mono text-xs">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold">Client Stream</span>
                  <p className="font-bold text-primary flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Server-Sent Events
                  </p>
                  <p className="text-[11px] text-muted-foreground">Endpoint: /api/sync/events</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-primary" />
          Zero Source Code Storage &bull; Metadata Only
        </span>
        <span className="flex items-center gap-1.5 text-foreground font-semibold">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Real-Time Background Sync
        </span>
      </div>
    </div>
  );
}
