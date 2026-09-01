import Image from "next/image";
import { IMAGE_QUALITY } from "@/config/media";

interface SportCoverMediaProps {
  image?: string | null;
  colorPrimario: string;
  priority?: boolean;
}

/** Foto de tapa del bloque de deporte. */
export function SportCoverMedia({
  image,
  colorPrimario,
  priority,
}: SportCoverMediaProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt=""
        fill
        priority={priority}
        quality={IMAGE_QUALITY}
        sizes="(max-width: 768px) 100vw, 33vw"
        className="ds-media-zoom object-cover"
      />
    );
  }

  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(160deg, ${colorPrimario}, var(--color-brand-ink))`,
      }}
    />
  );
}
