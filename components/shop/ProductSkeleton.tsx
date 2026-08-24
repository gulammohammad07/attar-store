export default function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="shimmer-bg h-72 w-full" />
      <div className="space-y-3 p-5">
        <div className="shimmer-bg h-3 w-1/3 rounded-full" />
        <div className="shimmer-bg h-5 w-2/3 rounded-full" />
        <div className="shimmer-bg h-4 w-1/4 rounded-full" />
        <div className="shimmer-bg h-11 w-full rounded-full" />
      </div>
    </div>
  );
}
