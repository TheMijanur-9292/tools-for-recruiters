"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutGrid, Sparkles } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

const NAV_ITEMS = [
  { label: "Home", href: "/", startsWith: "/" },
  { label: "Modules", href: "/#modules", startsWith: "/modules" },
  { label: "Workspace", href: "/#workspace", startsWith: "/modules" },
];

export function TopNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full px-3 py-3 sm:px-5 lg:px-8">
      <div className="hero-gradient relative overflow-hidden rounded-2xl border border-white/25 px-4 py-3 text-white shadow-[0_14px_40px_rgba(5,20,60,0.35)] backdrop-blur">
        <div className="absolute -left-10 -top-12 h-28 w-28 rounded-full bg-cyan-300/25 blur-2xl" />
        <div className="absolute -bottom-14 right-0 h-28 w-28 rounded-full bg-blue-200/25 blur-2xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-2 backdrop-blur">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                2Coms Consulting Pvt Ltd
              </p>
              <p className="font-display text-base font-semibold sm:text-lg">
                AI Challenge Suite
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 rounded-xl bg-white/10 p-1 backdrop-blur">
            {NAV_ITEMS.map((item) => {
              const active =
                item.startsWith === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.startsWith);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={[
                    "rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition sm:text-sm",
                    active ? "bg-white text-[#0b2a6a]" : "text-blue-100 hover:bg-white/15",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-blue-100 md:flex">
              <LayoutGrid className="h-4 w-4" /> 9 Modules
            </div>
            <div className="hidden items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-blue-100 md:flex">
              <Sparkles className="h-4 w-4" /> AI Powered
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
