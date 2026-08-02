import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export type BrandLogoVariant = "blanco" | "azul";
export type BrandLogoSize = "sm" | "md" | "lg";

const SIZE_MAP: Record<BrandLogoSize, { width: number; height: number; className: string }> = {
  sm: { width: 112, height: 36, className: "h-7 w-auto sm:h-8" },
  md: { width: 140, height: 44, className: "h-8 w-auto sm:h-9" },
  lg: { width: 200, height: 64, className: "h-10 w-auto sm:h-12" },
};

const SRC: Record<BrandLogoVariant, string> = {
  blanco: "/brand/logo-blanco-transparent.png",
  azul: "/brand/logo-azul-transparent.png",
};

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  href?: string | null;
  className?: string;
  priority?: boolean;
}

/**
 * Wordmark oficial ALTERNA (manual de identidad).
 * Minúsculas, inclinación y “a” característica — no sustituir por texto tipográfico.
 */
export function BrandLogo({
  variant = "blanco",
  size = "md",
  href = "/",
  className,
  priority = false,
}: BrandLogoProps) {
  const dim = SIZE_MAP[size];
  const image = (
    <Image
      src={SRC[variant]}
      alt={siteConfig.name}
      width={dim.width}
      height={dim.height}
      priority={priority}
      className={cn(dim.className, "select-none object-contain object-left", className)}
    />
  );

  if (href === null) {
    return (
      <span className="inline-flex items-center" aria-label={siteConfig.name}>
        {image}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center focus-ring rounded-sm"
      aria-label={`${siteConfig.name} — inicio`}
    >
      {image}
    </Link>
  );
}
