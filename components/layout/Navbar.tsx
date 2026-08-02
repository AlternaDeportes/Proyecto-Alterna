"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/modules/autenticacion/components/UserMenu";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-header transition-all duration-base ease-brand",
        scrolled
          ? "border-b border-white/10 bg-brand-ink/95 shadow-lift backdrop-blur-md"
          : "bg-gradient-to-b from-brand-ink/80 to-transparent"
      )}
    >
      <div className="ds-container flex h-16 items-center justify-between gap-4">
        <BrandLogo variant="blanco" size="sm" priority />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {siteConfig.navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors duration-fast",
                  "focus-ring",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/75 hover:bg-white/5 hover:text-white"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <UserMenu className="ml-2" compact />
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white focus-ring lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menú</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      <div
        id="menu-mobile"
        className={cn(
          "border-t border-white/10 bg-brand-ink/98 lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="ds-container flex flex-col gap-1 py-4" aria-label="Móvil">
          {siteConfig.navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-soft px-4 py-3 text-base font-medium focus-ring",
                  active ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/5"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <UserMenu className="mt-2 w-full justify-between" />
        </nav>
      </div>
    </header>
  );
}
