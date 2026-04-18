import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/page-header'
import { Card } from '@/components/ui/card'
import { Users, FolderKanban, TrendingUp, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — W System',
  description: 'Dashboard ringkasan bisnis',
}

const metrics = [
  { label: 'Karyawan Aktif', value: '0', icon: Users, color: 'text-blue-600' },
  { label: 'Project Aktif', value: '0', icon: FolderKanban, color: 'text-green-600' },
  { label: 'Leads Bulan Ini', value: '0', icon: TrendingUp, color: 'text-amber-600' },
  { label: 'Approval Pending', value: '0', icon: Clock, color: 'text-red-600' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Ringkasan bisnis Anda hari ini"
      />

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="rounded-xl border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{m.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-50">
                <m.icon className={`h-5 w-5 ${m.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-xl border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-900">Grafik Absensi</h3>
          <p className="mt-2 text-sm text-muted-foreground">Data absensi 30 hari terakhir akan muncul di sini.</p>
        </Card>
        <Card className="rounded-xl border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-900">Pengumuman</h3>
          <p className="mt-2 text-sm text-muted-foreground">Belum ada pengumuman.</p>
        </Card>
      </div>
    </div>
  )
}