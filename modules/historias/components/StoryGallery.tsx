interface StoryGalleryProps {
  items: { id: string; alt: string; label: string }[];
  accentColor: string;
  titulo: string;
}

/** Galería placeholder hasta Cloudinary / fotos reales del documental */
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
        Imágenes del documental en producción. Pronto retratos y escenas reales.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <figure
            key={item.id}
            className="relative aspect-[4/3] overflow-hidden rounded-organic border border-white/10"
            style={{
              background: `linear-gradient(${135 + index * 40}deg, ${accentColor}55 0%, #1D1D1B 70%)`,
            }}
          >
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-ink/90 to-transparent p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                {item.label}
              </span>
              <span className="mt-1 block text-sm text-white/60">
                {titulo} — {item.alt}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
