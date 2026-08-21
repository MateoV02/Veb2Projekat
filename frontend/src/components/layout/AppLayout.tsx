import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link to="/" style={{ fontWeight: "bold", textDecoration: "none" }}>
            Trip Planner
          </Link>
          <Link to="/trips">Moji planovi putovanja</Link>
        </nav>

        <div>
          <span style={{ marginRight: "1rem" }}>
            {user?.name} ({user?.role})
          </span>
          <button onClick={logout}>Odjavi se</button>
        </div>
      </header>

      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
