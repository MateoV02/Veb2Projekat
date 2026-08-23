interface ServiceStatusCardProps {
  name: string;
  loading: boolean;
  online: boolean | null;
}

export function ServiceStatusCard({ name, loading, online }: ServiceStatusCardProps) {
  const tone = loading ? "neutral" : online ? "success" : "danger";
  const label = loading ? "Provera..." : online ? "Dostupan" : "Nedostupan";

  return (
    <div className="card" style={{ minWidth: 190, padding: "14px 18px" }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>{name}</div>
      <span className={`badge badge-${tone}`}>
        <span className="badge-dot" />
        {label}
      </span>
    </div>
  );
}
