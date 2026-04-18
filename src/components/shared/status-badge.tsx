interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'default'
}

const statusMap: Record<string, { label: string; classes: string }> = {
  active: { label: 'Aktif', classes: 'bg-green-50 text-green-700 border-green-200' },
  aktif: { label: 'Aktif', classes: 'bg-green-50 text-green-700 border-green-200' },
  approved: { label: 'Disetujui', classes: 'bg-green-50 text-green-700 border-green-200' },
  paid: { label: 'Dibayar', classes: 'bg-green-50 text-green-700 border-green-200' },
  present: { label: 'Hadir', classes: 'bg-green-50 text-green-700 border-green-200' },
  draft: { label: 'Draft', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  pending: { label: 'Menunggu', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  processing: { label: 'Diproses', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  late: { label: 'Terlambat', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  rejected: { label: 'Ditolak', classes: 'bg-red-50 text-red-700 border-red-200' },
  tolak: { label: 'Ditolak', classes: 'bg-red-50 text-red-700 border-red-200' },
  dibatalkan: { label: 'Dibatalkan', classes: 'bg-red-50 text-red-700 border-red-200' },
  cancelled: { label: 'Dibatalkan', classes: 'bg-red-50 text-red-700 border-red-200' },
  absent: { label: 'Alpha', classes: 'bg-red-50 text-red-700 border-red-200' },
  inactive: { label: 'Nonaktif', classes: 'bg-zinc-100 text-zinc-600' },
  nonaktif: { label: 'Nonaktif', classes: 'bg-zinc-100 text-zinc-600' },
  expired: { label: 'Kedaluwarsa', classes: 'bg-zinc-100 text-zinc-600' },
}

export function StatusBadge({ status, size = 'default' }: StatusBadgeProps) {
  const mapped = statusMap[status.toLowerCase()] ?? {
    label: status,
    classes: 'bg-zinc-100 text-zinc-600',
  }

  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${mapped.classes} ${sizeClasses}`}
    >
      {mapped.label}
    </span>
  )
}