import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const { user } = useAuth();
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
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dobrodošao/la, {user?.name} 👋</h1>
          <p style={{ margin: 0 }}>Evo pregleda tvog naloga i statusa sistema.</p>
        </div>
        <Link to="/trips" className="btn btn-primary">
          Moji planovi putovanja →
        </Link>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Status backend servisa</h2>
          <span className="muted-count">Service Fabric klaster</span>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
    </div>
  );
}
