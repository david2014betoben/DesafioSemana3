// TODO [D]: misma forma que CardProducto pero con <Skeleton />

import { Skeleton } from "./Skeleton";

export function SkeletonCardProducto() {
  return (
    <article
      aria-label="Cargando producto"
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
    >
      <Skeleton className="h-40 w-full rounded-none" />

      <div className="space-y-4 p-4">
        <Skeleton className="h-3 w-24" />

        <div className="flex justify-between gap-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-16" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>

        <Skeleton className="h-3 w-20" />
      </div>
    </article>
  );
}
