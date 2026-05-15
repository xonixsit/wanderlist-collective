import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { trips } from "@/lib/trips";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";

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

type RoleRow = { user_id: string; role: "admin" | "user"; created_at: string };

function Admin() {
  const { loading, user, isAdmin, roles } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<
    { id: string; display_name: string | null; created_at: string; roles: string[] }[]
  >([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    if (!isAdmin && roles.length > 0) {
      navigate({ to: "/" });
    }
  }, [loading, user, isAdmin, roles, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    (async () => {
      const [{ data: profiles }, { data: roleRows }] = await Promise.all([
        supabase.from("profiles").select("id, display_name, created_at"),
        supabase.from("user_roles").select("user_id, role, created_at"),
      ]);
      const byUser = new Map<string, string[]>();
      (roleRows as RoleRow[] | null)?.forEach((r) => {
        const arr = byUser.get(r.user_id) ?? [];
        arr.push(r.role);
        byUser.set(r.user_id, arr);
      });
      setUsers(
        (profiles ?? []).map((p) => ({
          id: p.id,
          display_name: p.display_name,
          created_at: p.created_at,
          roles: byUser.get(p.id) ?? [],
        })),
      );
      setLoadingUsers(false);
    })();
  }, [isAdmin]);

  const toggleAdmin = async (userId: string, isCurrentlyAdmin: boolean) => {
    if (isCurrentlyAdmin) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    }
    setUsers((u) =>
      u.map((x) =>
        x.id === userId
          ? {
              ...x,
              roles: isCurrentlyAdmin
                ? x.roles.filter((r) => r !== "admin")
                : [...x.roles, "admin"],
            }
          : x,
      ),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user || (!isAdmin && roles.length > 0)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-serif text-3xl">Restricted</h1>
        <p className="text-sm text-muted-foreground">
          The operations dashboard is for admins only.
        </p>
        <Link to="/" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
          Back home
        </Link>
      </div>
    );
  }

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

        <section className="mt-12">
          <h2 className="mb-4 font-serif text-2xl">Users & roles</h2>
          <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-border">
            <table className="w-full text-sm">
              <thead className="bg-surface-elevated text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Joined</th>
                  <th className="px-6 py-3 text-left">Roles</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingUsers ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Loading…</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No users yet</td></tr>
                ) : (
                  users.map((u, i) => {
                    const adminRow = u.roles.includes("admin");
                    return (
                      <tr key={u.id} className={i !== 0 ? "border-t border-border" : ""}>
                        <td className="px-6 py-4 font-medium">
                          {u.display_name ?? u.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex gap-1">
                            {u.roles.map((r) => (
                              <span key={r} className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ring-border">
                                {r}
                              </span>
                            ))}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => toggleAdmin(u.id, adminRow)}
                            disabled={u.id === user.id && adminRow}
                            className="text-xs font-semibold text-accent hover:underline disabled:opacity-40 disabled:no-underline"
                          >
                            {adminRow ? "Revoke admin" : "Make admin"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
