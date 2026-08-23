interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = 16, style }: SkeletonProps) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

export function CardSkeleton() {
  return (
    <div className="list-item">
      <Skeleton width="40%" height={18} style={{ marginBottom: 10 }} />
      <Skeleton width="70%" height={13} style={{ marginBottom: 8 }} />
      <Skeleton width="30%" height={13} />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
