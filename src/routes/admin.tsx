import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { trips } from "@/lib/trips";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [
      { title: "Admin — Vaga" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const kpis = [
  { k: "Active trips", v: trips.length.toString() },
  { k: "Members", v: "1,284" },
  { k: "Bookings (mo)", v: "212" },
  { k: "Revenue (mo)", v: "$648k" },
];

function Admin() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Admin</div>
            <h1 className="font-serif text-4xl">Operations dashboard</h1>
          </div>
          <button className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
            + New expedition
          </button>
        </header>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {kpis.map((s) => (
            <div key={s.k} className="rounded-2xl bg-surface p-6 ring-1 ring-border">
              <div className="font-mono text-3xl font-semibold tabular-nums">{s.v}</div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="mb-4 font-serif text-2xl">Trips</h2>
          <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-border">
            <table className="w-full text-sm">
              <thead className="bg-surface-elevated text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left">Trip</th>
                  <th className="px-6 py-3 text-left">Dates</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Bookings</th>
                  <th className="px-6 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t, i) => {
                  const booked = t.totalSpots - t.spotsLeft;
                  return (
                    <tr key={t.slug} className={i !== 0 ? "border-t border-border" : ""}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={t.image} alt="" width={36} height={36} className="size-9 rounded-md object-cover" />
                          <div>
                            <div className="font-medium">{t.title}</div>
                            <div className="text-xs text-muted-foreground">{t.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{t.dates}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            t.status === "trending"
                              ? "bg-accent text-accent-foreground"
                              : "bg-surface-elevated text-muted-foreground ring-1 ring-border"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {booked}/{t.totalSpots}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-accent">
                        ${(booked * t.price).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
