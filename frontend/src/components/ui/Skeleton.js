const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-xl bg-[var(--ph-border)] ${className}`}
  />
);

export default Skeleton;
