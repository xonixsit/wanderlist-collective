import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { TripCard } from "@/components/trip-card";
import { fetchTrips, categories, type Trip } from "@/lib/trips";
import heroImg from "@/assets/hero-iceland.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Vaga — A travel community for the modern explorer" },
      { name: "description", content: "Curated small-group expeditions, AI-planned itineraries, and a rewards program for the modern explorer." },
    ],
  }),
});

function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  useEffect(() => {
    fetchTrips().then(setTrips).catch(console.error);
  }, []);

  const trending = trips.find((t) => t.trending) ?? trips[0];
  const featured = trips.slice(0, 6);

  return (
    <div className="min-h-screen">
      <SiteNav />

      <main className="space-y-28 pb-12">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pt-10">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-border">
            <img
              src={heroImg}
              alt="Misty Icelandic highlands at dusk"
              width={1920}
              height={1080}
              className="aspect-[21/10] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
              <div className="max-w-2xl space-y-5 animate-[reveal_0.8s_cubic-bezier(0.16,1,0.3,1)_both]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                    Trending now
                  </span>
                  {trending && (
                    <span className="text-xs font-medium text-muted-foreground">{trending.dates}, 2026</span>
                  )}
                </div>
                <h1 className="text-balance font-serif text-5xl leading-[1.05] md:text-7xl">
                  Travel is <em className="text-accent">better</em> together.
                </h1>
                <p className="max-w-[48ch] text-pretty text-base text-muted-foreground md:text-lg">
                  A members-led community designing curated small-group expeditions, AI-personalized routes, and rewards for every mile traveled.
                </p>
                <div className="flex flex-wrap gap-3 pt-3">
                  {trending && (
                    <Link
                      to="/trips/$slug"
                      params={{ slug: trending.slug }}
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02] animate-[pulse-glow_3s_ease-in-out_infinite]"
                    >
                      Reserve your spot
                    </Link>
                  )}
                  <Link
                    to="/planner"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:bg-surface-elevated"
                  >
                    Plan with AI →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories + AI entry */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                Browse expeditions
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((c, i) => (
                  <button
                    key={c}
                    className={`rounded-full px-4 py-2 text-sm font-medium ring-1 ring-border transition-colors ${
                      i === 0 ? "bg-surface-elevated text-foreground" : "bg-surface/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/planner"
              className="glass group w-full max-w-md rounded-2xl p-4 ring-1 ring-border transition-colors hover:ring-accent/40"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-xs font-bold tracking-tighter text-accent">
                  AI
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Personalized route engine</div>
                  <div className="pt-0.5 text-sm font-medium text-muted-foreground/80 group-hover:text-foreground">
                    Where do you want to wander?
                  </div>
                </div>
                <span className="text-muted-foreground group-hover:text-accent">→</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Trip grid */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-serif text-4xl">The Collective</h2>
            <Link to="/trips" className="text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((t) => (
              <TripCard key={t.slug} trip={t} />
            ))}
          </div>
        </section>

        {/* Rewards strip */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="glass flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl p-8 ring-1 ring-border md:flex-row md:p-10">
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Vaga Rewards</div>
              <h3 className="text-balance font-serif text-3xl">Earn credits for every mile traveled.</h3>
              <p className="max-w-[56ch] text-sm text-muted-foreground">
                Redeem credits for future expeditions, exclusive lounge access, or limited-edition gear from our atelier partners.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-6">
              <div className="text-center">
                <div className="font-mono text-3xl font-semibold tabular-nums text-accent">10%</div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  back per trip
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <Link
                to="/rewards"
                className="rounded-lg bg-surface-elevated px-5 py-3 text-sm font-medium ring-1 ring-border transition-colors hover:bg-surface"
              >
                View benefits
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
