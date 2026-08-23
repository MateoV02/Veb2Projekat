import { Link } from "react-router-dom";
import type { Activity } from "../../models/Activity";
import { ACTIVITY_STATUS_LABELS } from "../../models/Activity";
import { formatMoney } from "../../utils/format";

const STATUS_TONES: Record<Activity["status"], "neutral" | "warning" | "success" | "danger"> = {
  Planned: "neutral",
  Reserved: "warning",
  Completed: "success",
  Cancelled: "danger",
};

interface ActivityCardProps {
  tripId: string;
  activity: Activity;
  onDelete: (id: string) => void;
}

export function ActivityCard({ tripId, activity, onDelete }: ActivityCardProps) {
  const time = activity.dateTime.slice(11, 16);

  return (
    <div className="list-item">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5 }}>
            <span style={{ color: "var(--color-primary-text)" }}>{time}</span> — {activity.name}
            {activity.location && (
              <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}> ({activity.location})</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span className={`badge badge-${STATUS_TONES[activity.status]}`}>
              {ACTIVITY_STATUS_LABELS[activity.status]}
            </span>
            <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{formatMoney(activity.estimatedCost)}</span>
          </div>
          {activity.description && (
            <p style={{ margin: "6px 0 0", fontSize: 13.5 }}>{activity.description}</p>
          )}
        </div>

        <div className="actions-row" style={{ flexShrink: 0 }}>
          <Link to={`/trips/${tripId}/activities/${activity.id}/edit`} className="btn btn-secondary btn-sm">
            Izmeni
          </Link>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(activity.id)}>
            Obriši
          </button>
        </div>
      </div>
    </div>
  );
}
