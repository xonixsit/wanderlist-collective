import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { TripCard } from "@/components/trip-card";
import { trips, categories } from "@/lib/trips";

export const Route = createFileRoute("/trips/")({
  component: TripsPage,
  head: () => ({
    meta: [
      { title: "Expeditions — Vaga" },
      { name: "description", content: "Browse curated small-group expeditions across alpine, coastal, arid, and celestial terrains." },
    ],
  }),
});

function TripsPage() {
  const [active, setActive] = useState<string>("All");
  const filtered = active === "All" ? trips : trips.filter((t) => t.category === active);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <header className="mb-12 max-w-3xl space-y-4 animate-[reveal_0.6s_ease-out_both]">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">All expeditions</div>
          <h1 className="font-serif text-5xl md:text-6xl">Find your next chapter.</h1>
          <p className="text-muted-foreground">
            Every Vaga expedition is led by a resident host and capped at small group sizes for genuine connection.
          </p>
        </header>

        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium ring-1 ring-border transition-all ${
                active === c
                  ? "bg-accent text-accent-foreground ring-accent"
                  : "bg-surface/40 text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TripCard key={t.slug} trip={t} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
