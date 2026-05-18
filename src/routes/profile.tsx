import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { tripImage } from "@/lib/trip-images";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({
    meta: [
      { title: "Profile — Vaga" },
      { name: "description", content: "Your travel passport, trip history, and saved expeditions." },
    ],
  }),
});

type BookingRow = {
  id: string;
  spots: number;
  total_paid: number;
  status: string;
  created_at: string;
  trips: {
    slug: string;
    title: string;
    location: string;
    country: string;
    duration: string;
    dates: string;
    image_key: string;
  } | null;
};

function Profile() {
  const { loading, user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [credits, setCredits] = useState(0);
  const [countries, setCountries] = useState(0);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: bk }, { data: cr }] = await Promise.all([
        supabase
          .from("bookings")
          .select("id, spots, total_paid, status, created_at, trips(slug,title,location,country,duration,dates,image_key)")
          .order("created_at", { ascending: false }),
        supabase.from("credits_ledger").select("amount"),
      ]);
      const list = (bk ?? []) as unknown as BookingRow[];
      setBookings(list);
      const set = new Set<string>();
      list.forEach((b) => b.trips?.country && set.add(b.trips.country));
      setCountries(set.size);
      const total = (cr ?? []).reduce((s, r) => s + (r.amount ?? 0), 0);
      setCredits(total);
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  const name = user.user_metadata?.display_name || user.email?.split("@")[0] || "Explorer";
  const now = Date.now();
  const upcoming = bookings.filter((b) => new Date(b.created_at).getTime() >= now - 1000 * 60 * 60 * 24 * 30);
  const past = bookings.filter((b) => !upcoming.includes(b));

  const stats = [
    { k: "Trips", v: bookings.length.toString().padStart(2, "0") },
    { k: "Countries", v: countries.toString().padStart(2, "0") },
    { k: "Spots", v: bookings.reduce((s, b) => s + b.spots, 0).toString() },
    { k: "Credits", v: credits.toLocaleString() },
  ];

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="flex flex-col items-start gap-8 border-b border-border pb-10 md:flex-row md:items-center">
          <div className="size-28 rounded-full bg-gradient-to-br from-accent/40 via-surface-elevated to-surface ring-1 ring-border" />
          <div className="flex-1 space-y-2">
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Pathfinder · Nomad tier</div>
            <h1 className="font-serif text-5xl">{name}</h1>
            <p className="text-muted-foreground">{user.email} · Member since {new Date(user.created_at).getFullYear()}</p>
          </div>
          <Link to="/rewards" className="rounded-full bg-surface px-5 py-2.5 text-sm ring-1 ring-border hover:bg-surface-elevated">
            View rewards
          </Link>
        </section>

        <section className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.k} className="rounded-2xl bg-surface p-6 ring-1 ring-border">
              <div className="font-mono text-3xl font-semibold tabular-nums text-accent">{s.v}</div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="mb-6 font-serif text-3xl">Upcoming</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No upcoming expeditions. <Link to="/trips" className="text-accent">Browse trips →</Link>
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {upcoming.map((b) =>
                b.trips && (
                  <Link
                    key={b.id}
                    to="/trips/$slug"
                    params={{ slug: b.trips.slug }}
                    className="group flex gap-4 overflow-hidden rounded-2xl bg-surface p-3 ring-1 ring-border transition-colors hover:bg-surface-elevated"
                  >
                    <img
                      src={tripImage(b.trips.image_key)}
                      alt={b.trips.title}
                      loading="lazy"
                      width={200}
                      height={200}
                      className="size-28 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex flex-col justify-center">
                      <div className="text-[10px] uppercase tracking-widest text-accent">{b.trips.dates}</div>
                      <h3 className="font-serif text-xl">{b.trips.title}</h3>
                      <p className="text-sm text-muted-foreground">{b.trips.location}, {b.trips.country}</p>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}
        </section>

        <section className="mt-16">
          <h2 className="mb-6 font-serif text-3xl">Trip history</h2>
          {past.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your past expeditions will appear here.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-border">
              {past.map((b, i) =>
                b.trips ? (
                  <Link
                    key={b.id}
                    to="/trips/$slug"
                    params={{ slug: b.trips.slug }}
                    className={`flex items-center justify-between px-6 py-5 transition-colors hover:bg-surface-elevated ${i !== 0 ? "border-t border-border" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={tripImage(b.trips.image_key)} alt={b.trips.title} loading="lazy" width={48} height={48} className="size-12 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium">{b.trips.title}</div>
                        <div className="text-xs text-muted-foreground">{b.trips.country} · {b.trips.duration}</div>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-accent">+{Math.round(b.total_paid / 10).toLocaleString()} CR</span>
                  </Link>
                ) : null,
              )}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
