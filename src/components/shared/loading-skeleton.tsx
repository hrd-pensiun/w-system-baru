export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 flex-1 animate-pulse rounded bg-zinc-100" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-8 flex-1 animate-pulse rounded bg-zinc-100" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
          <div className="mt-3 h-8 w-32 animate-pulse rounded bg-zinc-100" />
          <div className="mt-2 h-3 w-20 animate-pulse rounded bg-zinc-100" />
        </div>
      ))}
    </>
  )
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
          <div className="h-9 w-full animate-pulse rounded bg-zinc-100" />
        </div>
      ))}
    </div>
  )
}