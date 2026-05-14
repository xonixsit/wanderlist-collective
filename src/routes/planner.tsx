import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/planner")({
  component: Planner,
  head: () => ({
    meta: [
      { title: "AI Planner — Vaga" },
      { name: "description", content: "Generate a personalized expedition itinerary with the Vaga AI route engine." },
    ],
  }),
});

const samples = [
  "Quiet ceramics studio retreat in Kyoto for 7 days",
  "Rugged cliffside hike in Madeira, mid-budget",
  "Northern lights chasing in Lofoten, premium",
  "10-day desert immersion with photography focus",
];

type Plan = { title: string; days: { day: number; title: string; detail: string }[] };

function fakeGenerate(prompt: string): Plan {
  const seed = prompt.trim() || "A mindful 5-day journey";
  return {
    title: `Itinerary for: ${seed.slice(0, 60)}${seed.length > 60 ? "…" : ""}`,
    days: [
      { day: 1, title: "Arrival & grounding", detail: "Settle into a boutique stay, light walking tour, welcome dinner curated by your local host." },
      { day: 2, title: "Cultural immersion", detail: "Morning workshop with a local artisan; afternoon at a hidden gallery; evening rooftop cocktails." },
      { day: 3, title: "Outdoor expedition", detail: "Guided trail or coastal route with packed picnic, returning for sunset." },
      { day: 4, title: "Wellness & reflection", detail: "Spa or onsen morning, gentle walk, journaling session, communal dinner." },
      { day: 5, title: "Closing ritual", detail: "Final breakfast, optional excursion, transfer to onward travel." },
    ],
  };
}

function Planner() {
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = (text: string) => {
    setLoading(true);
    setTimeout(() => {
      setPlan(fakeGenerate(text));
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-6 py-20">
        <div className="space-y-6 text-center animate-[reveal_0.6s_ease-out_both]">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            AI route engine · beta
          </div>
          <h1 className="font-serif text-5xl md:text-6xl">Where should your next story begin?</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Describe a mood, a landscape, a feeling — Vaga's AI drafts a complete itinerary, ready for you to refine or share with the collective.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            generate(prompt);
          }}
          className="mt-12"
        >
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A 7-day slow-travel route through northern Portugal with great food and quiet beaches…"
              rows={3}
              className="w-full resize-none rounded-2xl bg-surface p-5 pr-32 text-sm ring-1 ring-border placeholder:text-muted-foreground/60 focus:outline-none focus:ring-accent/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute bottom-4 right-4 rounded-full bg-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground disabled:opacity-50"
            >
              {loading ? "Drafting…" : "Generate"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {samples.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setPrompt(s);
                  generate(s);
                }}
                className="rounded-full bg-surface/40 px-3 py-1.5 text-[11px] text-muted-foreground ring-1 ring-border hover:bg-surface-elevated hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </form>

        {plan && (
          <section className="mt-16 animate-[reveal_0.5s_ease-out_both] space-y-6 rounded-2xl bg-surface p-8 ring-1 ring-border">
            <header>
              <div className="text-xs font-medium uppercase tracking-widest text-accent">Generated itinerary</div>
              <h2 className="mt-2 font-serif text-3xl">{plan.title}</h2>
            </header>
            <ol className="relative space-y-6 border-l border-border pl-8">
              {plan.days.map((d) => (
                <li key={d.day} className="relative">
                  <span className="absolute -left-[37px] grid size-6 place-items-center rounded-full bg-accent font-mono text-[10px] font-bold text-accent-foreground">
                    {d.day}
                  </span>
                  <h3 className="font-serif text-xl">{d.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d.detail}</p>
                </li>
              ))}
            </ol>
            <div className="flex gap-3 border-t border-border pt-6">
              <button className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground">
                Save itinerary
              </button>
              <button className="rounded-full bg-surface-elevated px-5 py-2 text-sm font-medium ring-1 ring-border">
                Share with collective
              </button>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
