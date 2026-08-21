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
    <div style={{ border: "1px solid #eee", borderRadius: 6, padding: "0.75rem", marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <strong>{destination.name}</strong> — {destination.location}
          <p style={{ margin: "0.25rem 0" }}>
            {formatDate(destination.arrivalDate)} — {formatDate(destination.departureDate)}
          </p>
          {destination.notes && <p style={{ margin: "0.25rem 0", color: "#555" }}>{destination.notes}</p>}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link to={`/trips/${tripId}/destinations/${destination.id}/edit`}>Izmeni</Link>
          <button onClick={() => onDelete(destination.id)}>Obriši</button>
        </div>
      </div>
    </div>
  );
}
