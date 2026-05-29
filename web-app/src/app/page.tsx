import Image from "next/image";
import { ModuleCard } from "@/components/module-card";
import { TopNavbar } from "@/components/top-navbar";
import { HeroModuleSlider } from "@/components/hero-module-slider";
import { MODULES } from "@/lib/modules";
import { Users, Zap, Clock, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col pb-16">
      <TopNavbar />

      {/* ── Hero Section ── */}
      <section className="relative mx-3 overflow-hidden rounded-3xl sm:mx-5 lg:mx-8">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=85"
            alt="HR team collaborating"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/35 via-slate-900/20 to-slate-900/25" />
        </div>

        {/* Decorative blobs */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div className="w-fit max-w-3xl rounded-2xl bg-black/45 px-5 py-5 backdrop-blur-[3px] sm:px-6 sm:py-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300">
                <Zap className="h-3.5 w-3.5" />
                AI-Powered HR Suite
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-5xl">
                Every Tool Your <br />
                <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                  Recruiter Needs
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-base text-blue-100/80">
                10 AI tools purpose-built for HR professionals and recruiters — from screening
                resumes to bulk banner generation. Save hours every single day.
              </p>

              {/* Stats row */}
              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { icon: Users, label: "Built for Recruiters" },
                  { icon: Clock, label: "Save 3+ Hours Daily" },
                  { icon: TrendingUp, label: "Instant AI Output" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-cyan-100">
                    <Icon className="h-4 w-4 text-cyan-400" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel — module count + categories */}
            <HeroModuleSlider />
          </div>
        </div>
      </section>

      {/* ── Module Grid ── */}
      <section id="modules" className="mt-10 px-3 sm:px-5 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">HR & Recruiter AI Tools</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Click any module to run live AI output instantly
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Assessment", "Sourcing", "Communication", "Analytics", "Onboarding"].map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="mt-12 px-3 sm:px-5 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_10px_40px_rgba(10,25,54,0.1)]">
          {/* Section header with subtle background */}
          <div className="relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-violet-500/5" />
            <div className="relative">
              <h3 className="font-display text-2xl font-bold">How To Use Any Module</h3>
              <p className="mt-1 text-sm text-muted-foreground">Three steps from brief to output</p>
            </div>
          </div>

          <div className="grid gap-px bg-border md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choose a Module",
                desc: "Pick the HR tool you need — resume screening, JD writing, interview prep, or any other.",
                color: "from-violet-500 to-purple-600",
              },
              {
                step: "02",
                title: "Use a Template or Type",
                desc: "Select a pre-built demo template or describe your own scenario in plain language.",
                color: "from-sky-500 to-cyan-600",
              },
              {
                step: "03",
                title: "Copy and Use",
                desc: "Generate the AI output, refine if needed, and copy to your ATS, email, or doc in one click.",
                color: "from-emerald-500 to-teal-600",
              },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="bg-surface p-6">
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-sm font-bold text-white`}
                >
                  {step}
                </div>
                <h4 className="mt-3 font-display text-base font-semibold">{title}</h4>
                <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
