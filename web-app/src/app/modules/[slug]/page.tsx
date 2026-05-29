import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AssistantPanel } from "@/components/assistant-panel";
import { FeatureIcon } from "@/components/feature-icon";
import { ModulePreview } from "@/components/module-preview";
import { ModuleWorkspace } from "@/components/module-workspace";

const CUSTOM_WORKSPACE_IDS = [
  "resume-screener",
  "interview-kit-generator",
  "jd-writer",
  "offer-rejection-email-writer",
  "salary-benchmarking",
  "candidate-outreach-composer",
  "recruiter-todo",
  "outreach-message-generator",
  "recruiter-prompt-library",
  "bulk-banner-generator",
];
import { TopNavbar } from "@/components/top-navbar";
import { DEMO_TEMPLATES } from "@/lib/demo-templates";
import { getModuleBySlug } from "@/lib/modules";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ModulePage({ params }: Props) {
  const { slug } = await params;
  const featureModule = getModuleBySlug(slug);

  if (!featureModule) {
    notFound();
  }

  const templates = DEMO_TEMPLATES[featureModule.id] ?? [];

  return (
    <main className="flex w-full flex-1 flex-col pb-10">
      <TopNavbar />

      <div className="px-3 sm:px-5 lg:px-8">
        <Link
          href="/"
          className="mb-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-strong"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Modules
        </Link>

        {/* Hero with Unsplash image */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 text-white">
          <div className="absolute inset-0">
            <Image
              src={`https://images.unsplash.com/${featureModule.unsplashId}?auto=format&fit=crop&w=1200&q=85`}
              alt={featureModule.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </div>
          <div className="absolute -right-16 -top-14 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 left-0 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="relative px-6 py-10 sm:px-8 sm:py-12">
            <div className="w-fit max-w-4xl rounded-2xl bg-black/48 px-4 py-4 backdrop-blur-[2px] sm:px-5 sm:py-5">
              <div className="flex items-start gap-5">
                <div className="rounded-2xl border border-white/20 bg-white/15 p-3.5 backdrop-blur-sm">
                  <FeatureIcon icon={featureModule.icon} className="h-7 w-7" />
                </div>

                <div className="flex-1">
                  <div className="mb-2 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                    {featureModule.badge}
                  </div>
                  <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    {featureModule.title}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">
                    {featureModule.shortDescription}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {featureModule.audience.map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          {CUSTOM_WORKSPACE_IDS.includes(featureModule.id) ? (
            <ModuleWorkspace moduleId={featureModule.id} />
          ) : (
            <div className="grid gap-6 xl:grid-cols-[1fr_1.12fr]">
              <div className="space-y-6">
                {/* Unique visual preview per module */}
                <ModulePreview moduleId={featureModule.id} />

                <article className="rounded-2xl border border-border bg-surface p-5">
                  <h2 className="font-display text-xl font-semibold">Core Capabilities</h2>
                  <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                    {featureModule.capabilities.map((capability) => (
                      <li key={capability} className="flex items-start gap-2.5">
                        <span className="mt-1 h-4 w-4 shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-center text-[10px] font-bold leading-4 text-primary">
                          &#10003;
                        </span>
                        {capability}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-border bg-surface p-5">
                  <h2 className="font-display text-xl font-semibold">Suggested Demo Templates</h2>
                  <div className="mt-3 space-y-3">
                    {templates.map((template) => (
                      <div key={template.title} className="rounded-xl border border-border bg-muted-surface p-3.5">
                        <p className="text-sm font-semibold text-foreground">{template.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{template.note}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <AssistantPanel
                moduleId={featureModule.id}
                sampleInput={featureModule.sampleInput}
                templates={templates}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}