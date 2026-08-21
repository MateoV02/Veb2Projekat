import { Link } from "react-router-dom";
import type { TripPlan } from "../../models/Trip";
import { formatDate, formatMoney } from "../../utils/format";

interface TripCardProps {
  trip: TripPlan;
  onDelete: (id: string) => void;
}

export function TripCard({ trip, onDelete }: TripCardProps) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: "1rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <h3 style={{ margin: 0 }}>
            <Link to={`/trips/${trip.id}`}>{trip.name}</Link>
          </h3>
          <p style={{ margin: "0.25rem 0", color: "#555" }}>{trip.description}</p>
          <p style={{ margin: "0.25rem 0" }}>
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </p>
          <p style={{ margin: "0.25rem 0" }}>Budžet: {formatMoney(trip.budget)}</p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link to={`/trips/${trip.id}/edit`}>Izmeni</Link>
          <button onClick={() => onDelete(trip.id)}>Obriši</button>
        </div>
      </div>
    </div>
  );
}
