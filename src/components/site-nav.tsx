import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/trips", label: "Expeditions" },
  { to: "/planner", label: "AI Planner" },
  { to: "/rewards", label: "Rewards" },
  { to: "/profile", label: "Profile" },
] as const;

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="font-serif text-2xl italic tracking-tight text-accent">
            Vaga.
          </Link>
          <div className="hidden gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full bg-surface px-3 py-1.5 ring-1 ring-border sm:flex">
            <div className="size-1.5 animate-pulse rounded-full bg-accent shadow-[0_0_8px_currentColor]" />
            <span className="font-mono text-xs tabular-nums">
              1,240 <span className="text-muted-foreground">CR</span>
            </span>
          </div>
          <div className="flex items-center gap-3 border-l border-border pl-4">
            <div className="hidden text-right sm:block">
              <div className="text-xs font-medium leading-tight">Julian V.</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pathfinder</div>
            </div>
            <div className="size-9 rounded-full bg-gradient-to-br from-surface-elevated to-surface ring-1 ring-border" />
          </div>
        </div>
      </div>
    </nav>
  );
}
