'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { ClipboardCheck, Clock, CheckCircle2, Star, Search, Plus } from 'lucide-react'
import {
  createAppraisalCycle,
  createReview,
  updateReview,
  getAppraisalDimensions,
  type AppraisalCycleRow,
  type AppraisalReviewRow,
  type EmployeeOption,
  type ReviewerOption,
  type AppraisalDimensionRow,
  type PeriodType,
} from './actions'

// ── Helpers ──
function scoreColor(val: number | null): string {
  if (val === null) return 'text-zinc-400'
  if (val < 70) return 'text-red-600 font-semibold'
  if (val < 85) return 'text-amber-600 font-medium'
  return 'text-emerald-600 font-semibold'
}

const reviewStatusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive'; className?: string }> = {
  selesai: { label: 'Selesai', variant: 'default', className: 'bg-emerald-600 hover:bg-emerald-700' },
  menunggu_review: { label: 'Menunggu Review', variant: 'outline', className: 'text-amber-700 border-amber-300 bg-amber-50' },
  draft: { label: 'Draft', variant: 'secondary', className: 'text-blue-700 border-blue-300 bg-blue-50' },
  belum_dinilai: { label: 'Belum Dinilai', variant: 'outline', className: 'text-zinc-500 border-zinc-300 bg-zinc-50' },
}

// ══════════════════════════════════════════
// Main component — tab driven
// ══════════════════════════════════════════
export function AppraisalTabContent({
  tab,
  initialCycles,
  initialReviews,
  employees,
  reviewers,
}: {
  tab: 'daftar' | 'detail' | 'ringkasan'
  initialCycles: AppraisalCycleRow[]
  initialReviews: AppraisalReviewRow[]
  employees: EmployeeOption[]
  reviewers: ReviewerOption[]
}) {
  if (tab === 'daftar') return <DaftarTab reviews={initialReviews} cycles={initialCycles} employees={employees} reviewers={reviewers} />
  if (tab === 'detail') return <DetailTab reviews={initialReviews} employees={employees} />
  return <RingkasanTab reviews={initialReviews} employees={employees} />
}

// ══════════════════════════════════════════
// Tab 1: Daftar Penilaian
// ══════════════════════════════════════════
function DaftarTab({
  reviews,
  cycles,
  employees,
  reviewers,
}: {
  reviews: AppraisalReviewRow[]
  cycles: AppraisalCycleRow[]
  employees: EmployeeOption[]
  reviewers: ReviewerOption[]
}) {
  const [data, setData] = useState(reviews)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [cycleDialogOpen, setCycleDialogOpen] = useState(false)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  // Metrics
  const completed = data.filter((r) => r.status === 'selesai').length
  const waiting = data.filter((r) => r.status === 'menunggu_review' || r.status === 'draft').length
  const withScore = data.filter((r) => r.final_score !== null)
  const avgScore = withScore.length > 0 ? withScore.reduce((s, r) => s + (r.final_score ?? 0), 0) / withScore.length : 0

  // Filter
  const filtered = data.filter((r) => {
    const matchSearch = !search ||
      r.employee?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.employee?.nik?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    return matchSearch && matchStatus
  })

  // Create cycle form
  const [cycleForm, setCycleForm] = useState<{ name: string; period_type: PeriodType; start_date: string; end_date: string; deadline_date: string }>({ name: '', period_type: 'quarterly', start_date: '', end_date: '', deadline_date: '' })
  const handleCreateCycle = () => {
    startTransition(async () => {
      const res = await createAppraisalCycle(cycleForm)
      if (res?.error) { alert(res.error); return }
      setCycleDialogOpen(false)
      window.location.reload()
    })
  }

  // Create review form
  const [reviewForm, setReviewForm] = useState({ cycle_id: '', employee_id: '', reviewer_id: '' })
  const handleCreateReview = () => {
    startTransition(async () => {
      const res = await createReview({ cycle_id: reviewForm.cycle_id, employee_id: reviewForm.employee_id, reviewer_id: reviewForm.reviewer_id || undefined })
      if (res?.error) { alert(res.error); return }
      setReviewDialogOpen(false)
      window.location.reload()
    })
  }

  // Submit self assessment
  const handleSelfAssess = (id: string, score: number) => {
    startTransition(async () => {
      await updateReview(id, { self_score: score, status: 'menunggu_review' })
      window.location.reload()
    })
  }

  // Complete review
  const handleComplete = (id: string, revScore: number) => {
    startTransition(async () => {
      const review = data.find((r) => r.id === id)
      const self = review?.self_score ?? 0
      const final = Math.round((self * 0.4 + revScore * 0.6) * 10) / 10
      await updateReview(id, { reviewer_score: revScore, final_score: final, status: 'selesai' })
      window.location.reload()
    })
  }

  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Review Aktif', value: String(data.length), icon: ClipboardCheck, accent: 'text-zinc-600' },
          { label: 'Menunggu Penilaian', value: String(waiting + data.filter((r) => r.status === 'belum_dinilai').length), icon: Clock, accent: 'text-amber-600' },
          { label: 'Selesai Dinilai', value: String(completed), icon: CheckCircle2, accent: 'text-emerald-600' },
          { label: 'Rata-rata Skor', value: avgScore > 0 ? avgScore.toFixed(1) : '—', icon: Star, accent: 'text-zinc-600' },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{m.label}</p>
                <m.icon className={`h-4 w-4 ${m.accent}`} />
              </div>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input placeholder="Cari karyawan..." className="w-48 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus} onValueChange={(v) => v && setFilterStatus(v)}>
            <SelectTrigger className="w-40 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="selesai">Selesai</SelectItem>
              <SelectItem value="menunggu_review">Menunggu Review</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="belum_dinilai">Belum Dinilai</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCycleDialogOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Buat Siklus
          </Button>
          <Button className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={() => setReviewDialogOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Buat Review
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <th className="px-4 py-3">NIK</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Reviewer</th>
              <th className="px-4 py-3 text-center">Self Assessment</th>
              <th className="px-4 py-3 text-center">Reviewer Score</th>
              <th className="px-4 py-3 text-center">Final Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((row) => {
              const st = reviewStatusMap[row.status] ?? reviewStatusMap.belum_dinilai
              return (
                <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.employee?.nik ?? '—'}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{row.employee?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-600">{row.reviewer?.name ?? '—'}</td>
                  <td className={`px-4 py-3 text-center ${scoreColor(row.self_score)}`}>{row.self_score ?? '—'}</td>
                  <td className={`px-4 py-3 text-center ${scoreColor(row.reviewer_score)}`}>{row.reviewer_score ?? '—'}</td>
                  <td className={`px-4 py-3 text-center font-semibold ${scoreColor(row.final_score)}`}>{row.final_score !== null ? row.final_score.toFixed(1) : '—'}</td>
                  <td className="px-4 py-3"><Badge variant={st.variant} className={st.className}>{st.label}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    {row.status === 'belum_dinilai' && (
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => {
                        const score = prompt('Masukkan self assessment score (0-100):')
                        if (score) handleSelfAssess(row.id, Number(score))
                      }} disabled={pending}>Self Assess</Button>
                    )}
                    {row.status === 'menunggu_review' && (
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => {
                        const score = prompt('Masukkan reviewer score (0-100):')
                        if (score) handleComplete(row.id, Number(score))
                      }} disabled={pending}>Review</Button>
                    )}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-zinc-400">Tidak ada data penilaian</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Cycle Dialog */}
      <Dialog open={cycleDialogOpen} onOpenChange={setCycleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Siklus Penilaian Baru</DialogTitle>
            <DialogDescription>Buat siklus appraisal baru untuk periode tertentu</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Siklus</Label>
              <Input value={cycleForm.name} onChange={(e) => setCycleForm({ ...cycleForm, name: e.target.value })} placeholder="e.g. Penilaian Q1 2025" />
            </div>
            <div>
              <Label>Tipe Periode</Label>
              <Select value={cycleForm.period_type} onValueChange={(v) => setCycleForm({ ...cycleForm, period_type: v as PeriodType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarterly">Kuartal</SelectItem>
                  <SelectItem value="semester">Semester</SelectItem>
                  <SelectItem value="annual">Tahunan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tanggal Mulai</Label><Input type="date" value={cycleForm.start_date} onChange={(e) => setCycleForm({ ...cycleForm, start_date: e.target.value })} /></div>
              <div><Label>Tanggal Selesai</Label><Input type="date" value={cycleForm.end_date} onChange={(e) => setCycleForm({ ...cycleForm, end_date: e.target.value })} /></div>
            </div>
            <div><Label>Deadline Penilaian</Label><Input type="date" value={cycleForm.deadline_date} onChange={(e) => setCycleForm({ ...cycleForm, deadline_date: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCycleDialogOpen(false)}>Batal</Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={handleCreateCycle} disabled={pending}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Review Penilaian</DialogTitle>
            <DialogDescription>Tambahkan karyawan ke siklus penilaian</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Siklus</Label>
              <Select value={reviewForm.cycle_id} onValueChange={(v) => v && setReviewForm({ ...reviewForm, cycle_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih siklus" /></SelectTrigger>
                <SelectContent>
                  {cycles.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Karyawan</Label>
              <Select value={reviewForm.employee_id} onValueChange={(v) => v && setReviewForm({ ...reviewForm, employee_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name} ({e.nik})</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reviewer</Label>
              <Select value={reviewForm.reviewer_id} onValueChange={(v) => v && setReviewForm({ ...reviewForm, reviewer_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih reviewer" /></SelectTrigger>
                <SelectContent>
                  {reviewers.map((r) => (<SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>Batal</Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={handleCreateReview} disabled={pending}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ══════════════════════════════════════════
// Tab 2: Detail Penilaian
// ══════════════════════════════════════════
function DetailTab({
  reviews,
  employees,
}: {
  reviews: AppraisalReviewRow[]
  employees: EmployeeOption[]
}) {
  const [selectedEmp, setSelectedEmp] = useState<string>(employees[0]?.id ?? '')
  const [dimensions, setDimensions] = useState<AppraisalDimensionRow[]>([])
  const [loadingDim, setLoadingDim] = useState(false)

  const empReviews = reviews.filter((r) => r.employee_id === selectedEmp)
  const emp = employees.find((e) => e.id === selectedEmp)
  const selectedReview = empReviews[0] ?? null

  const loadDimensions = async (reviewId: string) => {
    setLoadingDim(true)
    const dims = await getAppraisalDimensions(reviewId)
    setDimensions(dims)
    setLoadingDim(false)
  }

  // Auto-load dimensions when review selected
  useState(() => {
    if (selectedReview) loadDimensions(selectedReview.id)
  })

  const totalWeight = dimensions.reduce((s, d) => s + d.weight, 0)
  const totalFinal = totalWeight > 0
    ? dimensions.reduce((s, d) => s + ((d.final_score ?? 0) * d.weight / 100), 0) / (totalWeight / 100)
    : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={selectedEmp} onValueChange={(v) => {
          if (v) setSelectedEmp(v)
          setDimensions([])
        }}>
          <SelectTrigger className="w-64"><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
          <SelectContent>
            {employees.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name} ({e.nik})</SelectItem>))}
          </SelectContent>
        </Select>
        {selectedReview && (
          <Button variant="outline" size="sm" onClick={() => loadDimensions(selectedReview.id)} disabled={loadingDim}>
            {loadingDim ? 'Memuat...' : 'Muat Dimensi'}
          </Button>
        )}
      </div>

      {emp && selectedReview && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white text-sm font-semibold">
                {emp.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-base text-zinc-900">{emp.name}</CardTitle>
                <CardDescription className="text-sm text-zinc-500">NIK: {emp.nik} · Siklus: {selectedReview.cycle?.name ?? '—'}</CardDescription>
              </div>
              <Badge className={`ml-auto ${selectedReview.status === 'selesai' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600'}`}>
                {reviewStatusMap[selectedReview.status]?.label ?? selectedReview.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-zinc-100 p-3">
                <p className="text-xs text-zinc-400">Self Assessment</p>
                <p className={`text-lg font-semibold ${scoreColor(selectedReview.self_score)}`}>
                  {selectedReview.self_score ?? '—'}<span className="text-sm font-normal text-zinc-400">/100</span>
                </p>
              </div>
              <div className="rounded-lg border border-zinc-100 p-3">
                <p className="text-xs text-zinc-400">Reviewer</p>
                <p className="text-sm font-medium text-zinc-900">{selectedReview.reviewer?.name ?? '—'}</p>
              </div>
              <div className="rounded-lg border border-zinc-100 p-3">
                <p className="text-xs text-zinc-400">Final Score</p>
                <p className={`text-lg font-semibold ${scoreColor(selectedReview.final_score)}`}>
                  {selectedReview.final_score !== null ? selectedReview.final_score.toFixed(1) : '—'}
                </p>
              </div>
            </div>

            {dimensions.length > 0 && (
              <>
                <div className="overflow-auto rounded-lg border border-zinc-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Dimensi</th>
                        <th className="px-4 py-3 text-center">Bobot</th>
                        <th className="px-4 py-3 text-center">Self Score</th>
                        <th className="px-4 py-3 text-center">Reviewer Score</th>
                        <th className="px-4 py-3 text-center">Final</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {dimensions.map((d) => (
                        <tr key={d.id} className="hover:bg-zinc-50">
                          <td className="px-4 py-3 font-medium text-zinc-900">{d.dimension_name}</td>
                          <td className="px-4 py-3 text-center text-zinc-600">{d.weight}%</td>
                          <td className={`px-4 py-3 text-center ${scoreColor(d.self_score)}`}>{d.self_score ?? '—'}</td>
                          <td className={`px-4 py-3 text-center ${scoreColor(d.reviewer_score)}`}>{d.reviewer_score ?? '—'}</td>
                          <td className={`px-4 py-3 text-center font-semibold ${scoreColor(d.final_score)}`}>{d.final_score !== null ? d.final_score.toFixed(1) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-zinc-300 bg-zinc-50">
                        <td className="px-4 py-3 font-semibold text-zinc-900" colSpan={4}>TOTAL</td>
                        <td className="px-4 py-3 text-center font-bold text-lg text-zinc-900">{totalFinal.toFixed(1)}/100</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Skor Akhir</span>
                    <span className={`font-medium ${totalFinal >= 85 ? 'text-emerald-700' : totalFinal >= 70 ? 'text-amber-700' : 'text-red-700'}`}>
                      {totalFinal.toFixed(1)} / 100
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${totalFinal >= 85 ? 'bg-emerald-500' : totalFinal >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(totalFinal, 100)}%` }}
                    />
                  </div>
                </div>
              </>
            )}

            {selectedReview.notes && (
              <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 space-y-1">
                <p className="text-sm font-medium text-zinc-900">Catatan</p>
                <p className="text-sm text-zinc-600 leading-relaxed">{selectedReview.notes}</p>
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
function RingkasanTab({
  reviews,
  employees,
}: {
  reviews: AppraisalReviewRow[]
  employees: EmployeeOption[]
}) {
  const empMap = new Map(employees.map((e) => [e.id, e]))

  // Group by score ranges for summary
  const ranges = [
    { label: 'Sangat Baik (85-100)', min: 85, max: 100, count: 0, totalScore: 0 },
    { label: 'Baik (70-84)', min: 70, max: 84, count: 0, totalScore: 0 },
    { label: 'Cukup (55-69)', min: 55, max: 69, count: 0, totalScore: 0 },
    { label: 'Kurang (<55)', min: 0, max: 54, count: 0, totalScore: 0 },
  ]

  reviews.forEach((r) => {
    if (r.status === 'selesai' && r.final_score !== null) {
      const score = r.final_score
      const range = ranges.find((rng) => score >= rng.min && score <= rng.max)
      if (range) {
        range.count++
        range.totalScore += score
      }
    }
  })

  const completed = reviews.filter((r) => r.status === 'selesai').length
  const total = reviews.length
  const pctCompleted = total > 0 ? Math.round((completed / total) * 100) : 0
  const avgScore = completed > 0
    ? reviews.filter((r) => r.final_score !== null).reduce((s, r) => s + (r.final_score ?? 0), 0) / completed
    : 0

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-zinc-900">Ringkasan Penilaian</h3>

      {/* Overall stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-zinc-500">Total Review</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-zinc-500">% Selesai</p>
            <p className={`mt-1 text-2xl font-semibold ${pctCompleted >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>{pctCompleted}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-zinc-500">Rata-rata Skor</p>
            <p className={`mt-1 text-2xl font-semibold ${avgScore >= 85 ? 'text-emerald-600' : avgScore >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
              {avgScore > 0 ? avgScore.toFixed(1) : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Score distribution */}
      <div className="overflow-auto rounded-lg border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <th className="px-4 py-3">Rentang Skor</th>
              <th className="px-4 py-3 text-center">Jumlah</th>
              <th className="px-4 py-3 text-center">Rata-rata</th>
              <th className="px-4 py-3 text-center">Distribusi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {ranges.map((rng) => {
              const avg = rng.count > 0 ? rng.totalScore / rng.count : 0
              const pct = completed > 0 ? Math.round((rng.count / completed) * 100) : 0
              return (
                <tr key={rng.label} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">{rng.label}</td>
                  <td className="px-4 py-3 text-center text-zinc-600">{rng.count}</td>
                  <td className="px-4 py-3 text-center">{avg > 0 ? avg.toFixed(1) : '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-zinc-100 overflow-hidden">
                        <div className={`h-full rounded-full ${rng.min >= 85 ? 'bg-emerald-500' : rng.min >= 70 ? 'bg-blue-500' : rng.min >= 55 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500">{pct}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}