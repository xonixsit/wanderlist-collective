import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { trips } from "@/lib/trips";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({
    meta: [
      { title: "Profile — Vaga" },
      { name: "description", content: "Your travel passport, trip history, and saved expeditions." },
    ],
  }),
});

const stats = [
  { k: "Trips", v: "08" },
  { k: "Countries", v: "14" },
  { k: "Miles", v: "42.6k" },
  { k: "Credits", v: "4,950" },
];

const past = trips.slice(0, 3);
const upcoming = trips.slice(3, 5);

function Profile() {
  const { loading, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  const name = user.user_metadata?.display_name || user.email?.split("@")[0] || "Explorer";

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Header */}
        <section className="flex flex-col items-start gap-8 border-b border-border pb-10 md:flex-row md:items-center">
          <div className="size-28 rounded-full bg-gradient-to-br from-accent/40 via-surface-elevated to-surface ring-1 ring-border" />
          <div className="flex-1 space-y-2">
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Pathfinder · Nomad tier</div>
            <h1 className="font-serif text-5xl">{name}</h1>
            <p className="text-muted-foreground">{user.email} · Member since {new Date(user.created_at).getFullYear()}</p>
          </div>
          <button className="rounded-full bg-surface px-5 py-2.5 text-sm ring-1 ring-border hover:bg-surface-elevated">
            Edit profile
          </button>
        </section>

        {/* Stats */}
        <section className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.k} className="rounded-2xl bg-surface p-6 ring-1 ring-border">
              <div className="font-mono text-3xl font-semibold tabular-nums text-accent">{s.v}</div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </section>

        {/* Upcoming */}
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-3xl">Upcoming</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {upcoming.map((t) => (
              <Link
                key={t.slug}
                to="/trips/$slug"
                params={{ slug: t.slug }}
                className="group flex gap-4 overflow-hidden rounded-2xl bg-surface p-3 ring-1 ring-border transition-colors hover:bg-surface-elevated"
              >
                <img
                  src={t.image}
                  alt={t.title}
                  loading="lazy"
                  width={200}
                  height={200}
                  className="size-28 shrink-0 rounded-xl object-cover"
                />
                <div className="flex flex-col justify-center">
                  <div className="text-[10px] uppercase tracking-widest text-accent">{t.dates}</div>
                  <h3 className="font-serif text-xl">{t.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.location}, {t.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* History */}
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-3xl">Trip history</h2>
          <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-border">
            {past.map((t, i) => (
              <Link
                key={t.slug}
                to="/trips/$slug"
                params={{ slug: t.slug }}
                className={`flex items-center justify-between px-6 py-5 transition-colors hover:bg-surface-elevated ${i !== 0 ? "border-t border-border" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.title} loading="lazy" width={48} height={48} className="size-12 rounded-lg object-cover" />
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground">{t.country} · {t.duration}</div>
                  </div>
                </div>
                <span className="font-mono text-sm text-accent">+{Math.round(t.price * 0.7).toLocaleString()} CR</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
