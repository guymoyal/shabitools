import Link from 'next/link';

/**
 * On-page E-E-A-T byline that mirrors the author/publisher in JSON-LD.
 * Links to the About page, where the review methodology is documented.
 */
export default function EditorialByline({ dateModified }: { dateModified: string }) {
  return (
    <span>
      By{' '}
      <Link href="/about" className="font-medium text-amber-700 underline hover:text-amber-800">
        shabitools Editorial Team
      </Link>{' '}
      · Updated <time dateTime={dateModified}>{dateModified}</time>
    </span>
  );
}
