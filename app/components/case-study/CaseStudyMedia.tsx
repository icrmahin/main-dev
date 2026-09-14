import Image from "next/image";
import type { ProjectMedia } from "../../lib/projects";

interface CaseStudyMediaProps {
  readonly media: ProjectMedia;
  readonly sizes?: string;
}

export function CaseStudyMedia({ media, sizes }: CaseStudyMediaProps) {
  return (
    <figure className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background-subtle)]">
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes ?? "(min-width: 1280px) 50vw, 100vw"}
          className="object-cover"
        />
      </div>
      {media.caption && (
        <figcaption className="border-t border-[var(--color-border-subtle)] px-5 py-3.5 text-[12px] leading-[1.5] text-[var(--color-ink-tertiary)]">
          {media.caption}
        </figcaption>
      )}
    </figure>
  );
}