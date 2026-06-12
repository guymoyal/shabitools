import type { SiteImageData } from '@/lib/images';

export default function SiteImage({
  image,
  className,
  sizes = '(max-width: 640px) 100vw, 640px',
  priority = false,
}: {
  image: SiteImageData | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!image) return null;
  // When the source image is narrower than 640px both variants are the same
  // width (sharp uses withoutEnlargement), so a srcSet would advertise a wrong
  // 640w descriptor. Emit no srcSet in that case — a single src is correct.
  const srcSet =
    image.smWidth < image.width
      ? `${image.srcSm} ${image.smWidth}w, ${image.src} ${image.width}w`
      : undefined;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={image.alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
    />
  );
}
