import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FolderKanban, Clock, CheckCircle2, AlertTriangle, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Project Dashboard · Phase 3',
  description: 'Preview desain halaman Project Dashboard',
}

const projects = [
  { id: 'PRJ-001', nama: 'ERP W.System', klien: 'PT Teknologi Maju', pm: 'Andi Wibowo', status: 'On Track', progress: 72, deadline: '30 Jun 2025', budget: 'Rp330.000.000', realisasi: 'Rp237.600.000' },
  { id: 'PRJ-002', nama: 'Mobile Banking App', klien: 'Bank National', pm: 'Sari Dewi', status: 'At Risk', progress: 45, deadline: '15 Jul 2025', budget: 'Rp500.000.000', realisasi: 'Rp275.000.000' },
  { id: 'PRJ-003', nama: 'CRM Integration', klien: 'CV Data Prima', pm: 'Budi Hartono', status: 'On Track', progress: 88, deadline: '30 Apr 2025', budget: 'Rp180.000.000', realisasi: 'Rp158.400.000' },
  { id: 'PRJ-004', nama: 'Point of Sale', klien: 'PT Sumber Makmur', pm: 'Maya Putri', status: 'Delayed', progress: 30, deadline: '10 May 2025', budget: 'Rp120.000.000', realisasi: 'Rp84.000.000' },
  { id: 'PRJ-005', nama: 'Website Redesign', klien: 'Klinik Sehat Sentosa', pm: 'Andi Wibowo', status: 'Completed', progress: 100, deadline: '28 Feb 2025', budget: 'Rp75.000.000', realisasi: 'Rp72.000.000' },
  { id: 'PRJ-006', nama: 'Data Warehouse', klien: 'Bank National', pm: 'Sari Dewi', status: 'On Track', progress: 15, deadline: '31 Des 2025', budget: 'Rp200.000.000', realisasi: 'Rp30.000.000' },
]

const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive'; color: string }> = {
  'On Track': { variant: 'default', color: 'bg-emerald-500' },
  'At Risk': { variant: 'secondary', color: 'bg-amber-500' },
  'Delayed': { variant: 'destructive', color: 'bg-red-500' },
  'Completed': { variant: 'default', color: 'bg-blue-500' },
}

function progressColor(pct: number) {
  if (pct >= 80) return 'bg-emerald-500'
  if (pct >= 50) return 'bg-blue-500'
  if (pct >= 30) return 'bg-amber-500'
  return 'bg-red-500'
}

export default function ProjectDashboardPage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 3 — Project Management" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><FolderKanban className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Project</p><p className="text-xl font-semibold text-zinc-900">6</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">On Track</p><p className="text-xl font-semibold text-emerald-600">3</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><AlertTriangle className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">At Risk</p><p className="text-xl font-semibold text-amber-600">2</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Clock className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Budget Utilization</p><p className="text-xl font-semibold text-zinc-900">68%</p></div>
        </div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle className="text-lg">Daftar Project</CardTitle><CardDescription>Overview semua project aktif</CardDescription></div>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" />Project Baru</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((p) => {
              const sc = statusConfig[p.status]
              return (
                <div key={p.id} className="rounded-lg border border-zinc-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-600">{p.id}</span>
                        <span className="font-semibold text-zinc-900">{p.nama}</span>
                        <Badge variant={sc.variant} className="gap-1"><span className={`h-1.5 w-1.5 rounded-full ${sc.color}`} />{p.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-500">
                        <span>{p.klien}</span>
                        <span>·</span>
                        <span>PM: {p.pm}</span>
                        <span>·</span>
                        <span>Deadline: {p.deadline}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <span className="text-zinc-500">Budget: </span><span className="font-medium">{p.budget}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Progress</span>
                      <span className="font-medium">{p.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-100">
                      <div className={`h-2 rounded-full ${progressColor(p.progress)}`} style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
