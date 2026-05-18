import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";

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
  { name: "Pathfinder", min: 0, max: 2500, credits: "0 — 2,500", perks: ["Member rates", "Community access", "Early itinerary previews"] },
  { name: "Nomad", min: 2500, max: 10000, credits: "2,500 — 10,000", perks: ["10% off all trips", "Priority booking", "Lounge access partner"] },
  { name: "Voyager", min: 10000, max: Infinity, credits: "10,000+", perks: ["20% off all trips", "Free upgrades", "Atelier gear drops", "Annual gift trip"] },
];

type Entry = { id: string; amount: number; reason: string; created_at: string };

function Rewards() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("credits_ledger")
        .select("id, amount, reason, created_at")
        .order("created_at", { ascending: false });
      const list = (data ?? []) as Entry[];
      setEntries(list);
      setBalance(list.reduce((s, r) => s + r.amount, 0));
    })();
  }, [user]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  const currentTier = tiers.find((t) => balance >= t.min && balance < t.max) ?? tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const progress = nextTier ? Math.min(100, ((balance - currentTier.min) / (nextTier.min - currentTier.min)) * 100) : 100;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-surface-elevated via-surface to-background p-10 ring-1 ring-border">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Your balance</div>
              <div className="font-mono text-7xl font-semibold tabular-nums text-accent">{balance.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Vaga credits · Tier: <span className="text-foreground">{currentTier.name}</span></div>
            </div>
            {nextTier ? (
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Progress to {nextTier.name}</div>
                <div className="h-3 overflow-hidden rounded-full bg-surface ring-1 ring-border">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent/60" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-[11px] text-muted-foreground">{(nextTier.min - balance).toLocaleString()} credits to next tier</div>
              </div>
            ) : (
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Top tier reached ✨</div>
            )}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="mb-8 font-serif text-3xl">Membership tiers</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((t) => {
              const isCurrent = t.name === currentTier.name;
              return (
                <div
                  key={t.name}
                  className={`rounded-2xl p-6 ring-1 transition-all ${
                    isCurrent ? "bg-accent/10 ring-accent" : "bg-surface ring-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl">{t.name}</h3>
                    {isCurrent && <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">Current</span>}
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
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="mb-8 font-serif text-3xl">Credit history</h2>
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No credits yet. <Link to="/trips" className="text-accent">Book your first expedition →</Link>
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-border">
              {entries.map((h, i) => (
                <div
                  key={h.id}
                  className={`flex items-center justify-between px-6 py-4 ${i !== 0 ? "border-t border-border" : ""}`}
                >
                  <div>
                    <div className="text-sm font-medium">{h.reason}</div>
                    <div className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className={`font-mono text-sm font-semibold ${h.amount >= 0 ? "text-accent" : "text-muted-foreground"}`}>
                    {h.amount >= 0 ? "+" : ""}{h.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
