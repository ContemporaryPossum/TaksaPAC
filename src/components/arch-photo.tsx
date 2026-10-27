import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  /** What the photo will show, used as a placeholder caption and later as alt text. */
  caption: string;
  placeholderLabel: string;
  src?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * An arch-shaped photo window. Until the centre supplies consented photos it
 * draws a sunrise and a clearly labelled caption instead of an image.
 */
export function ArchPhoto({ caption, placeholderLabel, src, className, sizes = "(min-width: 768px) 40vw, 100vw", priority }: Props) {
  return (
    <figure
      data-reveal="arch"
      className={cn(
        "relative isolate m-0 aspect-[4/4.6] w-full max-w-full overflow-hidden rounded-t-full rounded-b-[1.25rem]",
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={caption} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_108%,var(--gold)_0_24%,var(--apricot)_24.5%_58%,var(--lilac)_58.5%)]"
          />
          <figcaption className="absolute inset-x-4 bottom-4 flex justify-center">
            <span className="max-w-[92%] rounded-lg bg-paper/95 px-3 py-1.5 text-center text-sm leading-snug text-ink">
              <span className="font-semibold">{placeholderLabel}:</span> {caption}
            </span>
          </figcaption>
        </>
      )}
    </figure>
  );
}
