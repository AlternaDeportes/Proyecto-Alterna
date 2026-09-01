import Image from "next/image";
import { IMAGE_QUALITY } from "@/config/media";
import { cn } from "@/lib/utils";
import { PhotoFrame, type PhotoFrameProps } from "@/components/ui/photo-frame";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";

type FrameTone = NonNullable<PhotoFrameProps["tone"]>;
type FrameRatio = NonNullable<PhotoFrameProps["ratio"]>;

export interface MediaImageProps {
  src: string | null | undefined;
  alt: string;
  accentColor?: string;
  tone?: FrameTone;
  ratio?: FrameRatio;
  className?: string;
  frameClassName?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  placeholderLabel?: string;
}

/**
 * Media con marco de marca. Si no hay src, muestra placeholder art-directed.
 */
export function MediaImage({
  src,
  alt,
  accentColor,
  tone = "ink",
  ratio = "video",
  className,
  frameClassName,
  imageClassName,
  priority,
  sizes = "(max-width: 768px) 100vw, 40vw",
  placeholderLabel,
}: MediaImageProps) {
  return (
    <PhotoFrame
      tone={tone}
      ratio={ratio}
      accentColor={accentColor}
      className={cn("bg-brand-ink", frameClassName, className)}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          quality={IMAGE_QUALITY}
          className={cn("object-cover ds-media-zoom", imageClassName)}
        />
      ) : (
        <MediaPlaceholder
          label={placeholderLabel ?? alt}
          accentColor={accentColor}
          className="absolute inset-0 min-h-0"
        />
      )}
    </PhotoFrame>
  );
}
