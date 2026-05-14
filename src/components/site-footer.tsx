import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <Link to="/" className="font-serif text-2xl italic text-accent">
          Vaga.
        </Link>
        <div className="flex gap-8 text-xs text-muted-foreground">
          <Link to="/trips" className="hover:text-foreground">Expeditions</Link>
          <Link to="/planner" className="hover:text-foreground">Planner</Link>
          <Link to="/rewards" className="hover:text-foreground">Rewards</Link>
          <Link to="/admin" className="hover:text-foreground">Admin</Link>
        </div>
        <p className="text-xs text-muted-foreground/60">© 2026 Vaga Collective.</p>
      </div>
    </footer>
  );
}
