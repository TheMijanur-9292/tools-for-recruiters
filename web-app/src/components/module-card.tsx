import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FeatureIcon } from "@/components/feature-icon";
import { ModuleDefinition } from "@/lib/modules";

type Props = {
  module: ModuleDefinition;
};

const BADGE_COLORS: Record<string, string> = {
  Assessment: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Sourcing: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  Communication: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  Analytics: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  Onboarding: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export function ModuleCard({ module }: Props) {
  const badgeClass = BADGE_COLORS[module.badge] ?? "bg-gray-100 text-gray-700";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_4px_20px_rgba(10,25,54,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(10,25,54,0.18)]">
      {/* Image Banner */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={`https://images.unsplash.com/${module.unsplashId}?auto=format&fit=crop&w=600&q=80`}
          alt={module.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        {/* Icon overlay */}
        <div className="absolute bottom-3 left-4 rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
          <FeatureIcon icon={module.icon} className="h-5 w-5 text-white" />
        </div>
        {/* Badge */}
        <div className="absolute right-3 top-3">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
            {module.badge}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-tight">{module.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{module.shortDescription}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {module.audience.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>

        <Link
          href={`/modules/${module.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3 hover:text-primary-strong"
        >
          Open Module <ArrowRight className="h-4 w-4 transition-all" />
        </Link>
      </div>
    </article>
  );
}
