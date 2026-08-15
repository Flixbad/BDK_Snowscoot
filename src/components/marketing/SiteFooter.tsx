import Link from "next/link";

export function SiteFooter({
  email,
  phone,
}: {
  email?: string;
  phone?: string;
}) {
  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-display text-4xl">
            BDK<span className="text-ice">_</span>SNOWCOOT
          </p>
          <p className="mt-3 max-w-sm text-white/55">
            Snowscoot freestyle à Crans-Montana. Glisse, style, montagne.
          </p>
        </div>
        <div className="space-y-2 text-sm text-white/65">
          {email && (
            <a href={`mailto:${email}`} className="block hover:text-ice">
              {email}
            </a>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="block hover:text-ice">
              {phone}
            </a>
          )}
          <Link href="/admin" className="block text-white/35 hover:text-white/60">
            Espace pro
          </Link>
        </div>
      </div>
    </footer>
  );
}
