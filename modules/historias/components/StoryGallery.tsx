import { MediaImage } from "@/components/ui/media-image";

interface StoryGalleryProps {
  items: { id: string; src: string; alt: string; label: string }[];
  accentColor: string;
  titulo: string;
}

/** Galería editorial con marcos de marca */
export function StoryGallery({ items, accentColor, titulo }: StoryGalleryProps) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="galeria-historia" className="mt-12">
      <h2
        id="galeria-historia"
        className="font-display text-xl font-bold uppercase text-white"
      >
        Galería
      </h2>
      <p className="mt-1 text-sm text-white/55">
        Retratos y escenas del universo {titulo}.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <figure key={item.id} className="relative">
            <MediaImage
              src={item.src}
              alt={item.alt}
              accentColor={accentColor}
              tone="ink"
              ratio="video"
              sizes="(max-width: 640px) 100vw, 50vw"
              placeholderLabel={item.label}
            />
            <figcaption className="mt-2 flex items-baseline justify-between gap-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                {item.label}
              </span>
              <span className="text-xs text-white/45">{item.alt}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
