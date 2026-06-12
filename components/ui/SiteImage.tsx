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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      srcSet={`${image.srcSm} 640w, ${image.src} ${image.width}w`}
      sizes={sizes}
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
