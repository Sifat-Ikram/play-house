import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="w-11/12 max-w-[1400px] mx-auto py-10">
      <Skeleton className="h-32 mb-8 rounded-[24px]" />
      <div className="grid grid-cols-3 xl:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-52" />
        ))}
      </div>
    </div>
  );
}
