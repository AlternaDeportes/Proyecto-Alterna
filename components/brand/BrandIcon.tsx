import Image from "next/image";
import { brandIcons, type BrandIconId } from "@/config/brand-assets";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: 40,
  md: 56,
  lg: 80,
  xl: 112,
} as const;

interface BrandIconProps {
  id: BrandIconId;
  size?: keyof typeof sizeMap;
  className?: string;
  alt?: string;
  priority?: boolean;
}

/**
 * Iconografía oficial ALTERNA (mesas de trabajo).
 * PNG con fondo transparente; pensados sobre ink / fondos oscuros.
 */
export function BrandIcon({
  id,
  size = "md",
  className,
  alt = "",
  priority = false,
}: BrandIconProps) {
  const px = sizeMap[size];
  return (
    <Image
      src={brandIcons[id]}
      alt={alt}
      width={px}
      height={px}
      priority={priority}
      className={cn("select-none object-contain", className)}
      aria-hidden={alt ? undefined : true}
    />
  );
}
