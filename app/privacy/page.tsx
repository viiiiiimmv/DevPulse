import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  Trash2,
  Mail,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Scale,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export const metadata = {
  title: "Privacy Policy | DevPulse - DPDP Act 2023 Compliant",
  description: "DevPulse Privacy Policy formulated in strict compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000 of India.",
};

export default function PrivacyPolicyPage() {
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
            DPDP Act, 2023 Compliant (India)
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>

          <p className="max-w-3xl text-base text-muted-foreground leading-relaxed sm:text-lg">
            This Privacy Policy sets out how DevPulse collects, uses, protects, and handles your digital personal data in strict compliance with the <strong>Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;)</strong> and the <strong>Information Technology Act, 2000 (&ldquo;IT Act&rdquo;)</strong> of India.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Effective Date: {lastUpdated}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              Jurisdiction: Republic of India
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Detailed Policy Sections */}
          <div className="space-y-10">

            {/* Notice Section */}
            <section className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 text-sm text-foreground space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-500 dark:text-indigo-400">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>Notice to Data Principals (Under Section 5 of DPDP Act, 2023)</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                By signing in with GitHub OAuth, you explicitly provide informed consent for DevPulse to access your basic GitHub profile and repository metadata solely to compute developer analytics. DevPulse operates as a <strong>Data Fiduciary</strong> under Indian Law. We never sell your data, and we do not store, view, or alter your source code files.
              </p>
            </section>

            {/* 1. Data Fiduciary Identity */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">01.</span> Identity of the Data Fiduciary
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>DevPulse</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) functions as a developer intelligence platform operational in India. Under the Digital Personal Data Protection Act, 2023, DevPulse is the <strong>Data Fiduciary</strong> that determines the purpose and means of processing personal data.
              </p>
              <div className="rounded-lg border border-border/60 bg-secondary/30 p-4 text-xs font-mono space-y-1 text-muted-foreground">
                <p><span className="text-foreground font-semibold">Entity Name:</span> DevPulse Technologies</p>
                <p><span className="text-foreground font-semibold">Regulatory Framework:</span> Digital Personal Data Protection Act, 2023 &amp; IT Act, 2000 (India)</p>
                <p><span className="text-foreground font-semibold">Contact:</span> privacy@devpulse.io</p>
              </div>
            </section>

            {/* 2. Personal Data We Collect */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">02.</span> Categories of Personal Data Collected
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We strictly adhere to the principle of <strong>Data Minimisation</strong>. We only process the minimal personal data necessary to deliver repository telemetry:
              </p>

              <div className="space-y-3 pt-2">
                <div className="rounded-lg border border-border/70 bg-secondary/20 p-4">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <FaGithub className="w-4 h-4 text-primary" />
                    Authentication &amp; GitHub Profile Data
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    GitHub User ID, GitHub Username (login handle), Display Name, Avatar URL, and primary email address provided via GitHub OAuth authorization.
                  </p>
                </div>

                <div className="rounded-lg border border-border/70 bg-secondary/20 p-4">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Repository &amp; Contribution Metadata
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Public and authorized repository names, commit counts, commit SHAs, author timestamps, commit messages, and programming language byte counts retrieved via GitHub APIs.
                  </p>
                </div>

                <div className="rounded-lg border border-border/70 bg-secondary/20 p-4">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Technical &amp; Telemetry Logs
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    IP addresses, browser client fingerprints, session cookies, synchronization status, and audit timestamps (`USER_SIGNED_IN`, `USER_SIGNED_OUT`, `GITHUB_SYNC_COMPLETED`).
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-xs text-muted-foreground">
                <strong className="text-foreground flex items-center gap-1.5 mb-1 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  What We DO NOT Collect:
                </strong>
                We <strong>NEVER</strong> store, clone, or parse your actual source code files, repository trees, secrets, or environment keys. We only collect metadata necessary to aggregate statistical signals.
              </div>
            </section>

            {/* 3. Purpose of Processing & Lawful Basis */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">03.</span> Purpose of Processing &amp; Lawful Basis
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Under Section 4 and Section 6 of the DPDP Act, 2023, processing is carried out only for specific, lawful purposes based on your explicit consent:
              </p>

              <ul className="grid gap-2.5 text-xs text-muted-foreground sm:grid-cols-2 pt-1">
                {[
                  "Computing commit rhythm and weekly contribution charts",
                  "Aggregating repository language footprints & tech stack breakdown",
                  "Orchestrating asynchronous background sync jobs via BullMQ",
                  "Providing authenticated session security and preventing fraud",
                  "Maintaining audit logs as required by Indian cyber security norms",
                  "Delivering real-time synchronization updates via Server-Sent Events",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 rounded-md border border-border/50 bg-secondary/20 p-3">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. Rights of Data Principals */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">04.</span> Your Rights as a Data Principal (DPDP Act, 2023)
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                As a Data Principal residing in India or utilizing our platform, the Digital Personal Data Protection Act, 2023 empowers you with the following statutory rights:
              </p>

              <div className="space-y-3 pt-2">
                <div className="border-l-2 border-primary pl-4 py-1">
                  <h3 className="font-bold text-sm text-foreground">Right to Access Information (Section 11)</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    You have the right to obtain a summary of personal data being processed, details of processing activities, and identities of all entities with whom data has been shared.
                  </p>
                </div>

                <div className="border-l-2 border-primary pl-4 py-1">
                  <h3 className="font-bold text-sm text-foreground">Right to Correction and Erasure (Section 12)</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    You have the right to correct incomplete, inaccurate, or outdated personal data, and to request the immediate erasure of your data when the purpose for processing is fulfilled.
                  </p>
                </div>

                <div className="border-l-2 border-primary pl-4 py-1">
                  <h3 className="font-bold text-sm text-foreground">Right of Grievance Redressal (Section 13)</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    You have the right to register grievances with our appointed Grievance Officer regarding any act or omission related to the performance of our obligations under the DPDP Act.
                  </p>
                </div>

                <div className="border-l-2 border-primary pl-4 py-1">
                  <h3 className="font-bold text-sm text-foreground">Right to Nominate (Section 14)</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    You have the right to nominate any other individual who, in the event of death or incapacity, shall exercise your rights as a Data Principal.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Data Retention & Erasure */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">05.</span> Retention and Complete Erasure of Data
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In compliance with Section 8(7) of the DPDP Act, we retain personal data only for as long as your account remains active or as required to fulfill the stated analytics purposes.
              </p>
              <div className="rounded-lg border border-border/70 bg-secondary/20 p-4 space-y-2 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-500" />
                  How to Trigger Data Erasure:
                </p>
                <p>
                  1. You can revoke DevPulse OAuth access at any time via your <strong>GitHub Settings &gt; Applications &gt; Authorized OAuth Apps</strong>.
                </p>
                <p>
                  2. You can request complete deletion of all synced repositories, commit records, and user profile data from our PostgreSQL databases by writing to <code className="text-primary font-mono">privacy@devpulse.io</code>. We purge all records within <strong>30 days</strong> of receiving the request.
                </p>
              </div>
            </section>

            {/* 6. Reasonable Security Safeguards */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">06.</span> Security Safeguards &amp; IT Rules, 2011
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In adherence to Section 43A of the Information Technology Act, 2000 and Rule 8 of the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, we implement robust technical safeguards:
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Encryption in Transit:</strong> All HTTP interactions are secured via TLS 1.3 cryptographic protocols.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Cryptographic Cookie Security:</strong> Sessions use `HttpOnly`, `SameSite=Lax`, and `Secure` attributes with HMAC-SHA256 token verification.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Role-Based Database Isolation:</strong> PostgreSQL access is strictly confined within protected network parameters with automated backups and encrypted secrets.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Incident Reporting:</strong> Any security breaches are mandatorily reported to CERT-In (Indian Computer Emergency Response Team) within statutory timelines.</span>
                </li>
              </ul>
            </section>

            {/* 7. Mandatory Grievance Redressal */}
            <section className="rounded-xl border-2 border-primary/30 bg-card p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase font-bold tracking-wider">
                <UserCheck className="w-4 h-4" />
                Statutory Redressal Mechanism
              </div>
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground">
                07. Grievance Redressal Officer (Mandatory under Indian Law)
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In compliance with Rule 5(9) of the IT Rules, 2011 and Section 13(2) of the Digital Personal Data Protection Act, 2023, the details of our Grievance Officer are set out below:
              </p>

              <div className="rounded-xl border border-border bg-secondary/30 p-5 space-y-3 text-xs font-mono">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground">Designation:</span>
                    <p className="text-foreground font-bold">Grievance Redressal Officer</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Organization:</span>
                    <p className="text-foreground font-bold">DevPulse India</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Official Email:</span>
                    <p className="text-primary font-bold">grievance@devpulse.io</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Secondary Contact:</span>
                    <p className="text-foreground font-bold">privacy@devpulse.io</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground">Registered Office:</span>
                    <p className="text-foreground font-bold">Koramangala, Bengaluru, Karnataka 560034, India</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                  <span className="text-foreground font-bold">Statutory SLA:</span> All grievances will be acknowledged within <strong>48 hours</strong> and resolved within <strong>30 days</strong> from the date of receipt.
                </div>
              </div>
            </section>

            {/* 8. Cross Border Transfers & Jurisdiction */}
            <section className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <span className="text-primary text-sm">08.</span> Governing Law &amp; Jurisdiction
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This Privacy Policy is governed by and construed in accordance with the laws of the <strong>Republic of India</strong>. In the event of any disputes, you agree to submit to the exclusive jurisdiction of the competent courts situated in <strong>Bengaluru, Karnataka, India</strong>.
              </p>
            </section>

          </div>

          {/* Quick Summary / Legal Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 sticky top-24">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Compliance Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="rounded-md border border-border/60 bg-secondary/20 p-3">
                  <span className="font-bold text-foreground block">DPDP Act, 2023</span>
                  <span className="text-muted-foreground">Full compliance with consent, notice, and Data Principal rights.</span>
                </div>
                <div className="rounded-md border border-border/60 bg-secondary/20 p-3">
                  <span className="font-bold text-foreground block">IT Act, 2000 &amp; Rules 2011</span>
                  <span className="text-muted-foreground">Reasonable security practices and grievance redressal mechanism.</span>
                </div>
                <div className="rounded-md border border-border/60 bg-secondary/20 p-3">
                  <span className="font-bold text-foreground block">Zero Code Retention</span>
                  <span className="text-muted-foreground">Only metadata and commit telemetry; no source code is ever cloned.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 space-y-3">
                <p className="text-[11px] text-muted-foreground">
                  Have a question about your personal data or wish to exercise your rights?
                </p>
                <a
                  href="mailto:privacy@devpulse.io"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs font-mono font-bold uppercase text-foreground hover:bg-secondary/80 transition-colors border border-border"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Privacy Team
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
