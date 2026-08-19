interface ServiceStatusCardProps {
  name: string;
  loading: boolean;
  online: boolean | null;
}

export function ServiceStatusCard({ name, loading, online }: ServiceStatusCardProps) {
  const label = loading ? "provera..." : online ? "dostupan" : "nedostupan";
  const color = loading ? "#999" : online ? "#2e7d32" : "#c62828";

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: "1rem", minWidth: 180 }}>
      <strong>{name}</strong>
      <div style={{ color, marginTop: 4 }}>{label}</div>
    </div>
  );
}
