export function Spinner({ dark = false }: { dark?: boolean }) {
  return <span className={`spinner${dark ? " spinner-dark" : ""}`} />;
}

export function LoadingRow({ label = "Učitavanje..." }: { label?: string }) {
  return (
    <div className="loading-row">
      <Spinner dark />
      <span>{label}</span>
    </div>
  );
}
