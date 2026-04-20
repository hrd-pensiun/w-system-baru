import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppraisalTabContent } from './appraisal-tab'
import {
  getAppraisalCycles,
  getAppraisalReviews,
  getEmployees,
  getReviewers,
  type AppraisalCycleRow,
} from './actions'

export const metadata: Metadata = {
  title: 'Performance Appraisal · W System',
  description: 'Kelola siklus penilaian kinerja karyawan dan pantau hasil appraisal',
}

export default async function AppraisalPage() {
  const [cycles, reviews, employees, reviewers] = await Promise.all([
    getAppraisalCycles(),
    getAppraisalReviews(),
    getEmployees(),
    getReviewers(),
  ])

  const activeCycle = cycles.find((c) => c.status === 'active') ?? null

  // Count participants for the active cycle
  const activeCycleReviewCount = activeCycle
    ? reviews.filter((r) => r.cycle_id === activeCycle.id).length
    : 0

  // Compute completion percentage for the active cycle
  const activeCycleCompletedCount = activeCycle
    ? reviews.filter((r) => r.cycle_id === activeCycle.id && r.status === 'selesai').length
    : 0
  const activeCycleProgress = activeCycleReviewCount > 0
    ? Math.round((activeCycleCompletedCount / activeCycleReviewCount) * 100)
    : 0

  // Format date helper
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })

  const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    active: 'default',
    draft: 'outline',
    closed: 'secondary',
  }

  const periodLabel: Record<string, string> = {
    quarterly: 'Kuartal',
    semester: 'Semester',
    annual: 'Tahunan',
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Appraisal"
        description="Kelola siklus penilaian kinerja karyawan dan pantau hasil appraisal"
      />

      {/* Active Cycle Card */}
      {activeCycle && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-zinc-900">{activeCycle.name}</h2>
                  <Badge variant={statusVariant[activeCycle.status] ?? 'secondary'}>
                    {activeCycle.status === 'active' ? 'Aktif' : activeCycle.status}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-500">
                  {periodLabel[activeCycle.period_type] ?? activeCycle.period_type} ·{' '}
                  {fmt(activeCycle.start_date)} — {fmt(activeCycle.end_date)}
                  {activeCycle.deadline_date && (
                    <> · Deadline: {fmt(activeCycle.deadline_date)}</>
                  )}
                </p>
                <p className="text-sm text-zinc-500">
                  {activeCycleReviewCount} peserta
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-semibold text-zinc-900">{activeCycleProgress}%</p>
                  <p className="text-xs text-zinc-500">Selesai dinilai</p>
                </div>
                <div className="h-10 w-32">
                  <div className="h-3 w-full rounded-full bg-zinc-100">
                    <div
                      className="h-3 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${activeCycleProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="daftar" className="w-full">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="daftar">Daftar Penilaian</TabsTrigger>
          <TabsTrigger value="detail">Detail Penilaian</TabsTrigger>
          <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
        </TabsList>

        <TabsContent value="daftar" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data penilaian...</CardContent></Card>}>
            <AppraisalTabContent
              tab="daftar"
              initialCycles={cycles}
              initialReviews={reviews}
              employees={employees}
              reviewers={reviewers}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="detail" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat detail penilaian...</CardContent></Card>}>
            <AppraisalTabContent
              tab="detail"
              initialCycles={cycles}
              initialReviews={reviews}
              employees={employees}
              reviewers={reviewers}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="ringkasan" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat ringkasan...</CardContent></Card>}>
            <AppraisalTabContent
              tab="ringkasan"
              initialCycles={cycles}
              initialReviews={reviews}
              employees={employees}
              reviewers={reviewers}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}