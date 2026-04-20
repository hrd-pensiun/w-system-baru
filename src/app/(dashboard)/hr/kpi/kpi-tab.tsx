'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Target, TrendingUp, ArrowDown, Calendar, Search, Eye, Plus } from 'lucide-react'
import {
  createKpiIndicator,
  updateKpiIndicator,
  deleteKpiIndicator,
  type KpiIndicatorRow,
  type KpiPeriodRow,
  type EmployeeOption,
} from './actions'

// ── Helpers ──
function scoreColor(val: number | null): string {
  if (val === null) return 'text-zinc-400'
  if (val > 100) return 'text-emerald-600 font-semibold'
  if (val >= 90) return 'text-blue-600 font-medium'
  return 'text-red-600 font-medium'
}

const statusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive'; className?: string }> = {
  approved: { label: 'Approved', variant: 'default', className: 'bg-emerald-600 hover:bg-emerald-700' },
  submitted: { label: 'Submitted', variant: 'outline', className: 'text-blue-700 border-blue-300 bg-blue-50' },
  draft: { label: 'Draft', variant: 'secondary' },
  revision: { label: 'Revision', variant: 'outline', className: 'text-amber-700 border-amber-300 bg-amber-50' },
}

// ══════════════════════════════════════════
// Tab 1: Daftar KPI
// ══════════════════════════════════════════
export function KpiTabContent({
  initialData,
  periods,
  employees,
}: {
  initialData: KpiIndicatorRow[]
  periods: KpiPeriodRow[]
  employees: EmployeeOption[]
}) {
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  const [filterPeriod, setFilterPeriod] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  // Metrics
  const totalActive = data.length
  const withScore = data.filter((d) => d.score !== null)
  const avgScore = withScore.length > 0 ? withScore.reduce((s, d) => s + (d.score ?? 0), 0) / withScore.length : 0
  const belowTarget = data.filter((d) => d.score !== null && d.score < 90).length
  const activePeriod = periods.find((p) => p.status === 'active')

  // Filter
  const filtered = data.filter((d) => {
    const matchSearch = !search ||
      d.employee?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.employee?.nik?.toLowerCase().includes(search.toLowerCase()) ||
      d.indicator_name.toLowerCase().includes(search.toLowerCase())
    const matchPeriod = filterPeriod === 'all' || d.period_id === filterPeriod
    const matchStatus = filterStatus === 'all' || d.status === filterStatus
    return matchSearch && matchPeriod && matchStatus
  })

  // Create handler
  const [form, setForm] = useState({ period_id: '', employee_id: '', indicator_name: '', weight: '', target_value: '', notes: '' })
  const handleCreate = () => {
    startTransition(async () => {
      const res = await createKpiIndicator({
        period_id: form.period_id,
        employee_id: form.employee_id,
        indicator_name: form.indicator_name,
        weight: Number(form.weight),
        target_value: form.target_value,
        notes: form.notes || undefined,
      })
      if (res?.error) { alert(res.error); return }
      setDialogOpen(false)
      setForm({ period_id: '', employee_id: '', indicator_name: '', weight: '', target_value: '', notes: '' })
      window.location.reload()
    })
  }

  const handleApprove = (id: string) => {
    startTransition(async () => {
      await updateKpiIndicator(id, { status: 'approved' })
      window.location.reload()
    })
  }

  const handleRevision = (id: string) => {
    startTransition(async () => {
      await updateKpiIndicator(id, { status: 'revision' })
      window.location.reload()
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Hapus indikator KPI ini?')) return
    startTransition(async () => {
      await deleteKpiIndicator(id)
      window.location.reload()
    })
  }

  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total KPI Aktif', value: String(totalActive), icon: Target, sub: activePeriod?.name ?? '—', accent: 'text-zinc-600' },
          { label: 'Rata-rata Pencapaian', value: avgScore.toFixed(1) + '%', icon: TrendingUp, sub: 'dari seluruh karyawan', accent: 'text-blue-600' },
          { label: 'Di Bawah Target', value: String(belowTarget), icon: ArrowDown, sub: totalActive > 0 ? ((belowTarget / totalActive) * 100).toFixed(0) + '% dari total' : '0%', accent: 'text-red-600' },
          { label: 'Periode Aktif', value: activePeriod?.name ?? '—', icon: Calendar, sub: activePeriod ? `${activePeriod.start_date} – ${activePeriod.end_date}` : 'Tidak ada', accent: 'text-zinc-600' },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{m.label}</p>
                <m.icon className={`h-4 w-4 ${m.accent}`} />
              </div>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{m.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input placeholder="Cari karyawan / indikator..." className="w-56 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterPeriod} onValueChange={(v) => v && setFilterPeriod(v)}>
            <SelectTrigger className="w-36 text-xs"><SelectValue placeholder="Periode" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Periode</SelectItem>
              {periods.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => v && setFilterStatus(v)}>
            <SelectTrigger className="w-32 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="revision">Revision</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Buat KPI Baru
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <th className="px-4 py-3">NIK</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Indikator</th>
              <th className="px-4 py-3 text-center">Bobot</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Realisasi</th>
              <th className="px-4 py-3 text-center">Skor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((row) => {
              const st = statusMap[row.status] ?? statusMap.draft
              return (
                <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.employee?.nik ?? '—'}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{row.employee?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-700">{row.indicator_name}</td>
                  <td className="px-4 py-3 text-center text-zinc-600">{row.weight}%</td>
                  <td className="px-4 py-3 text-zinc-600">{row.target_value}</td>
                  <td className="px-4 py-3 text-zinc-600">{row.actual_value ?? '—'}</td>
                  <td className={`px-4 py-3 text-center ${scoreColor(row.score)}`}>{row.score ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={st.variant} className={st.className}>{st.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {row.status === 'submitted' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-xs text-emerald-600" onClick={() => handleApprove(row.id)} disabled={pending}>Approve</Button>
                          <Button variant="ghost" size="sm" className="text-xs text-amber-600" onClick={() => handleRevision(row.id)} disabled={pending}>Revisi</Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm" className="text-xs text-red-500" onClick={() => handleDelete(row.id)} disabled={pending}>Hapus</Button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-zinc-400">Tidak ada data KPI</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>Menampilkan {filtered.length} dari {data.length} indikator</span>
      </div>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat KPI Baru</DialogTitle>
            <DialogDescription>Tambahkan indikator KPI untuk karyawan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Periode</Label>
              <Select value={form.period_id} onValueChange={(v) => v && setForm({ ...form, period_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih periode" /></SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Karyawan</Label>
              <Select value={form.employee_id} onValueChange={(v) => v && setForm({ ...form, employee_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name} ({e.nik})</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nama Indikator</Label>
              <Input value={form.indicator_name} onChange={(e) => setForm({ ...form, indicator_name: e.target.value })} placeholder="e.g. Produktivitas Kode" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Bobot (%)</Label>
                <Input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="25" />
              </div>
              <div>
                <Label>Target</Label>
                <Input value={form.target_value} onChange={(e) => setForm({ ...form, target_value: e.target.value })} placeholder="e.g. 100 line/day" />
              </div>
            </div>
            <div>
              <Label>Catatan</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Opsional..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={handleCreate} disabled={pending}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ══════════════════════════════════════════
// Tab 2: Detail Karyawan
// ══════════════════════════════════════════
export function DetailTabContent({
  initialData,
  employees,
}: {
  initialData: KpiIndicatorRow[]
  employees: EmployeeOption[]
}) {
  const [selectedEmp, setSelectedEmp] = useState<string>(employees[0]?.id ?? '')

  const empIndicators = initialData.filter((d) => d.employee_id === selectedEmp)
  const emp = employees.find((e) => e.id === selectedEmp)

  // Weighted total score
  const totalWeight = empIndicators.reduce((s, d) => s + d.weight, 0)
  const weightedScore = totalWeight > 0
    ? empIndicators.reduce((s, d) => s + ((d.score ?? 0) * d.weight / 100), 0) / (totalWeight / 100)
    : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={selectedEmp} onValueChange={(v) => v && setSelectedEmp(v)}>
          <SelectTrigger className="w-64"><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
          <SelectContent>
            {employees.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name} ({e.nik})</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {emp && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white text-sm font-semibold">
                {emp.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-base text-zinc-900">{emp.name}</CardTitle>
                <CardDescription className="text-sm text-zinc-500">NIK: {emp.nik}</CardDescription>
              </div>
              {weightedScore > 0 && (
                <Badge className={`ml-auto ${weightedScore >= 100 ? 'bg-emerald-600' : weightedScore >= 90 ? 'bg-blue-600' : 'bg-red-600'}`}>
                  {weightedScore >= 100 ? 'Di Atas Target' : weightedScore >= 90 ? 'Sesuai Target' : 'Di Bawah Target'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Indikator</th>
                    <th className="px-4 py-3 text-center">Bobot (%)</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">Realisasi</th>
                    <th className="px-4 py-3 text-center">Skor</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {empIndicators.map((item) => {
                    const st = statusMap[item.status] ?? statusMap.draft
                    return (
                      <tr key={item.id} className="hover:bg-zinc-50">
                        <td className="px-4 py-3 font-medium text-zinc-900">{item.indicator_name}</td>
                        <td className="px-4 py-3 text-center text-zinc-600">{item.weight}</td>
                        <td className="px-4 py-3 text-zinc-600">{item.target_value}</td>
                        <td className="px-4 py-3 text-zinc-600">{item.actual_value ?? '—'}</td>
                        <td className={`px-4 py-3 text-center ${scoreColor(item.score)}`}>{item.score ?? '—'}</td>
                        <td className="px-4 py-3"><Badge variant={st.variant} className={st.className}>{st.label}</Badge></td>
                      </tr>
                    )
                  })}
                  {empIndicators.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-6 text-center text-zinc-400">Belum ada indikator KPI</td></tr>
                  )}
                </tbody>
                {empIndicators.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-zinc-300 bg-zinc-50">
                      <td className="px-4 py-3 font-semibold text-zinc-900" colSpan={4}>Total Skor</td>
                      <td className="px-4 py-3 text-center font-bold text-lg text-zinc-900">{weightedScore.toFixed(1)}</td>
                      <td className="px-4 py-3">
                        <Badge className={weightedScore >= 100 ? 'bg-emerald-600 hover:bg-emerald-700' : weightedScore >= 90 ? 'bg-blue-600' : 'bg-red-600'}>
                          {weightedScore >= 100 ? 'Di Atas Target' : weightedScore >= 90 ? 'Sesuai Target' : 'Di Bawah Target'}
                        </Badge>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Progress bar */}
            {empIndicators.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Pencapaian Keseluruhan</span>
                  <span className={`font-medium ${weightedScore >= 100 ? 'text-emerald-700' : weightedScore >= 90 ? 'text-blue-700' : 'text-red-700'}`}>
                    {weightedScore.toFixed(1)} / 100
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${weightedScore >= 100 ? 'bg-emerald-500' : weightedScore >= 90 ? 'bg-blue-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(weightedScore, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ══════════════════════════════════════════
// Tab 3: Ringkasan
// ══════════════════════════════════════════
export function RingkasanTabContent({
  initialData,
  employees,
}: {
  initialData: KpiIndicatorRow[]
  employees: EmployeeOption[]
}) {
  // Group by employee, then calculate per-department stats
  // Since we need department info, we'll use department_id from employees
  const empMap = new Map(employees.map((e) => [e.id, e]))

  // Group indicators by department
  const deptMap = new Map<string, { name: string; total: number; avgScore: number; belowTarget: number }>()
  initialData.forEach((ind) => {
    const emp = empMap.get(ind.employee_id)
    const deptId = emp?.department_id ?? 'unknown'
    const deptName = deptId === 'unknown' ? 'Lainnya' : deptId
    if (!deptMap.has(deptId)) deptMap.set(deptId, { name: deptName, total: 0, avgScore: 0, belowTarget: 0 })
    const d = deptMap.get(deptId)!
    d.total++
    if (ind.score !== null) {
      d.avgScore += ind.score
      if (ind.score < 90) d.belowTarget++
    }
  })

  const deptSummary = Array.from(deptMap.values()).map((d) => ({
    ...d,
    avgScore: d.total > 0 ? d.avgScore / d.total : 0,
    pctAbove: d.total > 0 ? Math.round(((d.total - d.belowTarget) / d.total) * 100) : 0,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-zinc-900">Ringkasan Per Departemen</h3>
      </div>
      <div className="overflow-auto rounded-lg border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <th className="px-4 py-3">Departemen</th>
              <th className="px-4 py-3 text-center">Jumlah KPI</th>
              <th className="px-4 py-3 text-center">Rata-rata Skor</th>
              <th className="px-4 py-3 text-center">% Di Atas Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {deptSummary.map((dept) => (
              <tr key={dept.name} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium text-zinc-900">{dept.name}</td>
                <td className="px-4 py-3 text-center text-zinc-600">{dept.total}</td>
                <td className={`px-4 py-3 text-center ${scoreColor(dept.avgScore)}`}>{dept.avgScore.toFixed(1)}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${dept.pctAbove >= 30 ? 'bg-emerald-500' : dept.pctAbove >= 20 ? 'bg-blue-500' : 'bg-red-500'}`}
                        style={{ width: `${dept.pctAbove}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{dept.pctAbove}%</span>
                  </div>
                </td>
              </tr>
            ))}
            {deptSummary.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-zinc-400">Belum ada data ringkasan</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}