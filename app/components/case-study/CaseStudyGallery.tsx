import Image from "next/image";
import type { ProjectMedia } from "../../lib/projects";

interface CaseStudyGalleryProps {
  readonly gallery: readonly ProjectMedia[];
}

export function CaseStudyGallery({ gallery }: CaseStudyGalleryProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {gallery.map((item, index) => (
        <figure
          key={`${item.src}-${index}`}
          className="overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-subtle)]"
        >
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
          {item.caption && (
            <figcaption className="border-t border-[var(--color-border-subtle)] px-4 py-3 text-[12px] leading-[1.5] text-[var(--color-ink-tertiary)]">
              {item.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}