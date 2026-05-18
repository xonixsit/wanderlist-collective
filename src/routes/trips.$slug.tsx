import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { fetchTripBySlug, fetchTrips, bookTrip, type Trip } from "@/lib/trips";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/trips/$slug")({
  component: TripDetail,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Vaga` },
    ],
  }),
});

function TripDetail() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [related, setRelated] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTripBySlug(slug), fetchTrips()])
      .then(([t, all]) => {
        setTrip(t);
        setRelated(all.filter((x) => x.slug !== slug).slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleBook = async () => {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    if (!trip) return;
    setBooking(true);
    try {
      await bookTrip(trip.id, 1);
      toast.success("Spot reserved! Credits added to your wallet.");
      const fresh = await fetchTripBySlug(slug);
      setTrip(fresh);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <SiteNav />
        <div className="mx-auto max-w-3xl px-6 py-32 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen">
        <SiteNav />
        <div className="mx-auto max-w-3xl px-6 py-32 text-center">
          <h1 className="font-serif text-4xl">Trip not found</h1>
          <Link to="/trips" className="mt-6 inline-block text-accent">← All expeditions</Link>
        </div>
      </div>
    );
  }

  const sold = trip.spotsLeft === 0;

  return (
    <div className="min-h-screen">
      <SiteNav />

      <div className="relative">
        <img
          src={trip.image}
          alt={`${trip.title} cover`}
          width={1920}
          height={1080}
          className="aspect-[21/10] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-12">
          <Link to="/trips" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
            ← Expeditions
          </Link>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{trip.category}</span>
            <span className="text-xs text-muted-foreground">{trip.dates}, 2026</span>
          </div>
          <h1 className="mt-2 max-w-3xl font-serif text-5xl md:text-7xl">{trip.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{trip.location}, {trip.country}</p>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_360px]">
        <div className="space-y-16">
          <section>
            <p className="text-pretty text-lg leading-relaxed text-foreground/90">{trip.description}</p>
          </section>

          <section>
            <h2 className="mb-6 font-serif text-3xl">Highlights</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {trip.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 rounded-xl bg-surface/40 p-4 ring-1 ring-border">
                  <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-sm">{h}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-6 font-serif text-3xl">Itinerary</h2>
            <ol className="relative space-y-6 border-l border-border pl-8">
              {trip.itinerary.map((day) => (
                <li key={day.day} className="relative">
                  <span className="absolute -left-[37px] grid size-6 place-items-center rounded-full bg-accent font-mono text-[10px] font-bold text-accent-foreground">
                    {day.day}
                  </span>
                  <h3 className="font-serif text-xl">{day.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{day.detail}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-2xl bg-surface p-6 ring-1 ring-border">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-3xl font-semibold tabular-nums text-accent">
                ${trip.price.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">per person</span>
            </div>

            <div className="space-y-2 border-y border-border py-4 text-sm">
              <Row k="Duration" v={trip.duration} />
              <Row k="Dates" v={trip.dates} />
              <Row k="Group size" v={`${trip.totalSpots} explorers`} />
              <Row k="Spots left" v={`${trip.spotsLeft} of ${trip.totalSpots}`} />
              <Row k="Earn" v={`+${Math.round((trip.price / 10)).toLocaleString()} CR`} />
            </div>

            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(5, trip.totalSpots - trip.spotsLeft) }).map((_, i) => (
                <div
                  key={i}
                  className="size-8 rounded-full border-2 border-surface bg-surface-elevated"
                  style={{ filter: `hue-rotate(${i * 40}deg)` }}
                />
              ))}
              {trip.totalSpots - trip.spotsLeft > 5 && (
                <div className="grid size-8 place-items-center rounded-full border-2 border-surface bg-surface-elevated text-[10px] font-bold">
                  +{trip.totalSpots - trip.spotsLeft - 5}
                </div>
              )}
            </div>

            <button
              onClick={handleBook}
              disabled={sold || booking}
              className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-surface-elevated disabled:text-muted-foreground"
            >
              {sold ? "Sold out" : booking ? "Reserving…" : user ? "Reserve your spot" : "Sign in to reserve"}
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              Secure payment · Free cancellation up to 30 days
            </p>
          </div>
        </aside>
      </main>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="mb-8 font-serif text-3xl">More expeditions</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {related.map((t) => (
            <Link
              key={t.slug}
              to="/trips/$slug"
              params={{ slug: t.slug }}
              className="group block overflow-hidden rounded-2xl ring-1 ring-border"
            >
              <img
                src={t.image}
                alt={t.title}
                loading="lazy"
                width={800}
                height={600}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="bg-surface p-4">
                <h3 className="font-serif text-xl">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.location}, {t.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
