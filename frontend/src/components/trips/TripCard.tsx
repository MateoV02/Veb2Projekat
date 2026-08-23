import { Link } from "react-router-dom";
import type { TripPlan } from "../../models/Trip";
import { formatDate, formatMoney } from "../../utils/format";

interface TripCardProps {
  trip: TripPlan;
  onDelete: (id: string) => void;
}

export function TripCard({ trip, onDelete }: TripCardProps) {
  return (
    <div className="card card--interactive" style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ marginBottom: 6 }}>
            <Link to={`/trips/${trip.id}`}>{trip.name}</Link>
          </h3>
          {trip.description && (
            <p style={{ margin: "0 0 8px", fontSize: 14 }}>{trip.description}</p>
          )}
          <div style={{ display: "flex", gap: 14, fontSize: 13.5, color: "var(--color-text-muted)" }}>
            <span>
              📅 {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </span>
            <span>💰 {formatMoney(trip.budget)}</span>
          </div>
        </div>

        <div className="actions-row" style={{ flexShrink: 0 }}>
          <Link to={`/trips/${trip.id}/edit`} className="btn btn-secondary btn-sm">
            Izmeni
          </Link>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(trip.id)}>
            Obriši
          </button>
        </div>
      </div>
    </div>
  );
}
