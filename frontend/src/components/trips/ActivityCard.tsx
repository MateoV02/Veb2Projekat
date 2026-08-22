import { Link } from "react-router-dom";
import type { Activity } from "../../models/Activity";
import { ACTIVITY_STATUS_LABELS } from "../../models/Activity";
import { formatMoney } from "../../utils/format";

const STATUS_COLORS: Record<Activity["status"], string> = {
  Planned: "#616161",
  Reserved: "#e0a800",
  Completed: "#2e7d32",
  Cancelled: "#c62828",
};

interface ActivityCardProps {
  tripId: string;
  activity: Activity;
  onDelete: (id: string) => void;
}

export function ActivityCard({ tripId, activity, onDelete }: ActivityCardProps) {
  const time = activity.dateTime.slice(11, 16);

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 6, padding: "0.75rem", marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <strong>{time}</strong> — {activity.name}
          {activity.location && <span style={{ color: "#555" }}> ({activity.location})</span>}
          <p style={{ margin: "0.25rem 0" }}>
            <span style={{ color: STATUS_COLORS[activity.status], fontWeight: "bold" }}>
              {ACTIVITY_STATUS_LABELS[activity.status]}
            </span>
            {" · "}
            {formatMoney(activity.estimatedCost)}
          </p>
          {activity.description && <p style={{ margin: "0.25rem 0", color: "#555" }}>{activity.description}</p>}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link to={`/trips/${tripId}/activities/${activity.id}/edit`}>Izmeni</Link>
          <button onClick={() => onDelete(activity.id)}>Obriši</button>
        </div>
      </div>
    </div>
  );
}
