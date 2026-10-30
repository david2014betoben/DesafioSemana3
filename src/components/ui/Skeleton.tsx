interface Props {
  className?: string;
}

// TODO [D]: bloque gris con animate-pulse, el tamaño viene por className
// ej: <Skeleton className="h-4 w-32" />
export function Skeleton({ className = "" }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-stone-200 ${className}`}
    />
  );
}
