import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/rewards")({
  component: Rewards,
  head: () => ({
    meta: [
      { title: "Rewards — Vaga" },
      { name: "description", content: "Earn Vaga credits for every expedition. Redeem for upgrades, lounge access, and limited-edition gear." },
    ],
  }),
});

const tiers = [
  { name: "Pathfinder", credits: "0 — 2,500", perks: ["Member rates", "Community access", "Early itinerary previews"] },
  { name: "Nomad", credits: "2,500 — 10,000", perks: ["10% off all trips", "Priority booking", "Lounge access partner"], current: true },
  { name: "Voyager", credits: "10,000+", perks: ["20% off all trips", "Free upgrades", "Atelier gear drops", "Annual gift trip"] },
];

const history = [
  { trip: "Sahara Soul Ritual", date: "Mar 2026", credits: "+2,400" },
  { trip: "Cycladic Stillness", date: "Sep 2025", credits: "+1,800" },
  { trip: "Referral · Ana M.", date: "Aug 2025", credits: "+500" },
  { trip: "Welcome bonus", date: "Jun 2025", credits: "+250" },
];

function Rewards() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Balance hero */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-surface-elevated via-surface to-background p-10 ring-1 ring-border">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Your balance</div>
              <div className="font-mono text-7xl font-semibold tabular-nums text-accent">4,950</div>
              <div className="text-sm text-muted-foreground">Vaga credits · Tier: <span className="text-foreground">Nomad</span></div>
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Progress to Voyager</div>
              <div className="h-3 overflow-hidden rounded-full bg-surface ring-1 ring-border">
                <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-accent to-accent/60" />
              </div>
              <div className="text-[11px] text-muted-foreground">5,050 credits to next tier</div>
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="mt-16">
          <h2 className="mb-8 font-serif text-3xl">Membership tiers</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`rounded-2xl p-6 ring-1 transition-all ${
                  t.current ? "bg-accent/10 ring-accent" : "bg-surface ring-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl">{t.name}</h3>
                  {t.current && <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">Current</span>}
                </div>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{t.credits} CR</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {t.perks.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-accent">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* History */}
        <section className="mt-16">
          <h2 className="mb-8 font-serif text-3xl">Credit history</h2>
          <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-border">
            {history.map((h, i) => (
              <div
                key={h.trip}
                className={`flex items-center justify-between px-6 py-4 ${i !== 0 ? "border-t border-border" : ""}`}
              >
                <div>
                  <div className="text-sm font-medium">{h.trip}</div>
                  <div className="text-xs text-muted-foreground">{h.date}</div>
                </div>
                <div className="font-mono text-sm font-semibold text-accent">{h.credits}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
