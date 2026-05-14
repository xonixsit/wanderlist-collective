import { Link } from "@tanstack/react-router";
import type { Trip } from "@/lib/trips";

export function TripCard({ trip }: { trip: Trip }) {
  const sold = trip.status === "sold-out" || trip.spotsLeft === 0;
  return (
    <Link
      to="/trips/$slug"
      params={{ slug: trip.slug }}
      className="group block space-y-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-border">
        <img
          src={trip.image}
          alt={`${trip.title} in ${trip.country}`}
          loading="lazy"
          width={1024}
          height={1280}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute right-4 top-4">
          {trip.status === "trending" ? (
            <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
              Trending
            </span>
          ) : sold ? (
            <span className="rounded-full bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-border backdrop-blur">
              Sold out
            </span>
          ) : (
            <span className="rounded-full bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur ring-1 ring-border">
              {trip.spotsLeft} spots left
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-accent">{trip.category}</div>
            <h3 className="font-serif text-2xl leading-tight">{trip.title}</h3>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-sm text-foreground">{trip.location}, {trip.country}</p>
          <p className="text-xs text-muted-foreground">{trip.duration} · {trip.dates}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-medium tabular-nums text-accent">
            ${trip.price.toLocaleString()}
          </p>
          <div className="mt-1 flex -space-x-1.5">
            {Array.from({ length: Math.min(3, trip.totalSpots - trip.spotsLeft) }).map((_, i) => (
              <div
                key={i}
                className="size-5 rounded-full border border-background bg-surface-elevated"
                style={{ filter: `hue-rotate(${i * 50}deg)` }}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
