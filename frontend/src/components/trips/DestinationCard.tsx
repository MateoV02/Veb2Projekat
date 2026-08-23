import { Link } from "react-router-dom";
import type { Destination } from "../../models/Destination";
import { formatDate } from "../../utils/format";

interface DestinationCardProps {
  tripId: string;
  destination: Destination;
  onDelete: (id: string) => void;
}

export function DestinationCard({ tripId, destination, onDelete }: DestinationCardProps) {
  return (
    <div className="list-item">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5 }}>
            {destination.name} <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>— {destination.location}</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 4 }}>
            📅 {formatDate(destination.arrivalDate)} — {formatDate(destination.departureDate)}
          </div>
          {destination.notes && (
            <p style={{ margin: "6px 0 0", fontSize: 13.5 }}>{destination.notes}</p>
          )}
        </div>

        <div className="actions-row" style={{ flexShrink: 0 }}>
          <Link to={`/trips/${tripId}/destinations/${destination.id}/edit`} className="btn btn-secondary btn-sm">
            Izmeni
          </Link>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(destination.id)}>
            Obriši
          </button>
        </div>
      </div>
    </div>
  );
}
