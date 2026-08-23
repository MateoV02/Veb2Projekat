import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 32px",
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <nav style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              fontWeight: 800,
              fontSize: 17,
              textDecoration: "none",
              color: "var(--color-text)",
              letterSpacing: "-0.02em",
            }}
          >
            ✈ Trip Planner
          </Link>
          <NavLink
            to="/trips"
            style={({ isActive }) => ({
              fontSize: 14,
              fontWeight: 600,
              color: isActive ? "var(--color-primary-text)" : "var(--color-text-muted)",
              textDecoration: "none",
            })}
          >
            Moji planovi putovanja
          </NavLink>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 13.5, color: "var(--color-text-muted)" }}>
            <strong style={{ color: "var(--color-text)" }}>{user?.name}</strong>{" "}
            <Badge role={user?.role} />
          </span>
          <button className="btn btn-secondary btn-sm" onClick={logout}>
            Odjavi se
          </button>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <div className="fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Badge({ role }: { role?: string }) {
  if (!role) return null;
  return <span className="badge badge-primary">{role}</span>;
}
