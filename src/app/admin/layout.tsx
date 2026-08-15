import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/offres", label: "Offres" },
  { href: "/admin/saison", label: "Saison & horaires" },
  { href: "/admin/reservations", label: "Réservations" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return <div className="admin-shell min-h-screen">{children}</div>;
  }

  return (
    <div className="admin-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-ink/10 bg-ink p-6 text-white md:w-64 md:border-b-0 md:border-r md:border-white/10">
          <Link href="/admin" className="font-display text-2xl tracking-wide">
            BDK<span className="text-ice">_</span>CRM
          </Link>
          <p className="mt-1 text-xs text-white/50">{session.email}</p>
          <nav className="mt-8 flex flex-row gap-3 overflow-x-auto md:flex-col md:gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 hidden md:block">
            <LogoutButton />
          </div>
          <Link
            href="/"
            className="mt-4 hidden text-xs text-white/40 hover:text-white/70 md:block"
          >
            ← Voir le site
          </Link>
        </aside>
        <div className="flex-1 p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
