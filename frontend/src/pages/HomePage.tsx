import { useEffect, useState } from "react";
import { ServiceStatusCard } from "../components/health/ServiceStatusCard";
import { checkIdentityHealth } from "../services/identityService";
import { checkTripHealth } from "../services/tripService";
import { checkExpenseHealth } from "../services/expenseService";
import { checkSharingHealth } from "../services/sharingService";
import { useAuth } from "../context/AuthContext";

type ServiceKey = "identity" | "trip" | "expense" | "sharing";

const SERVICE_LABELS: Record<ServiceKey, string> = {
  identity: "IdentityService",
  trip: "TripService",
  expense: "ExpenseService",
  sharing: "SharingService",
};

export function HomePage() {
  const { user, logout } = useAuth();
  const [status, setStatus] = useState<Record<ServiceKey, boolean | null>>({
    identity: null,
    trip: null,
    expense: null,
    sharing: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checks: Array<[ServiceKey, () => Promise<unknown>]> = [
      ["identity", checkIdentityHealth],
      ["trip", checkTripHealth],
      ["expense", checkExpenseHealth],
      ["sharing", checkSharingHealth],
    ];

    Promise.allSettled(checks.map(([, check]) => check())).then((results) => {
      const next: Record<ServiceKey, boolean | null> = {
        identity: null,
        trip: null,
        expense: null,
        sharing: null,
      };
      results.forEach((result, index) => {
        const [key] = checks[index];
        next[key] = result.status === "fulfilled";
      });
      setStatus(next);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Trip Planner</h1>
        <div>
          <span style={{ marginRight: "1rem" }}>
            Dobrodošao/la, <strong>{user?.name}</strong> ({user?.role})
          </span>
          <button onClick={logout}>Odjavi se</button>
        </div>
      </div>
      <p>Status backend mikroservisa (Service Fabric):</p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {(Object.keys(SERVICE_LABELS) as ServiceKey[]).map((key) => (
          <ServiceStatusCard
            key={key}
            name={SERVICE_LABELS[key]}
            loading={loading}
            online={status[key]}
          />
        ))}
      </div>
    </div>
  );
}
