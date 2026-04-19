import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Mockup Index — W System',
  description: 'Daftar semua mockup per phase',
}

const phases = [
  {
    id: 'phase-1',
    name: 'Phase 1 — HR Core',
    description: 'Master Data, Rekrutmen, Payroll, Presensi, Cuti & Lembur, Kontrak, Reimburse, KPI, Appraisal, Training',
    status: 'in-progress' as const,
    modules: [
      { slug: 'master-data', name: 'US-HR-000 · Master Data HR' },
      { slug: 'rekrutmen', name: 'US-HR-REC · Rekrutmen' },
      { slug: 'payroll', name: 'US-HR-001 · Payroll + THR' },
      { slug: 'presensi', name: 'US-HR-002 · Presensi GPS' },
      { slug: 'cuti-lembur', name: 'US-HR-003 · Cuti + Lembur' },
      { slug: 'kontrak', name: 'US-HR-004 · Kontrak + Alert' },
      { slug: 'reimburse', name: 'US-HR-005 · Reimburse + Perdin' },
      { slug: 'kpi', name: 'US-HR-006 · KPI' },
      { slug: 'appraisal', name: 'US-HR-007 · Performance Appraisal' },
      { slug: 'training', name: 'US-HR-008 · Training + E-Learning' },
    ],
  },
  {
    id: 'phase-2',
    name: 'Phase 2 — CRM & Sales',
    description: 'CRM, Pipeline, Quotation, Sales Order',
    status: 'pending' as const,
    modules: [],
  },
  {
    id: 'phase-3',
    name: 'Phase 3 — Project Management',
    description: 'Project, Milestone, Task, Timesheet',
    status: 'pending' as const,
    modules: [],
  },
  {
    id: 'phase-4',
    name: 'Phase 4 — Finance',
    description: 'Invoice, AP/AR, GL, Journal',
    status: 'pending' as const,
    modules: [],
  },
  {
    id: 'phase-5',
    name: 'Phase 5 — KPI & Performance',
    description: 'OKR, Scorecard, Dashboard Eksekutif',
    status: 'pending' as const,
    modules: [],
  },
  {
    id: 'phase-6',
    name: 'Phase 6 — Asset + Product Library',
    description: 'Asset Management, Inventory, Product Catalog',
    status: 'pending' as const,
    modules: [],
  },
  {
    id: 'phase-7',
    name: 'Phase 7 — Reporting + Notif',
    description: 'Report Builder, Email/Push Notification',
    status: 'pending' as const,
    modules: [],
  },
  {
    id: 'phase-8',
    name: 'Phase 8 — Gamifikasi',
    description: 'Poin, Level, Badge, Reward Redemption',
    status: 'pending' as const,
    modules: [],
  },
]

const statusMap = {
  'in-progress': { label: 'Dikerjakan', variant: 'default' as const },
  'pending': { label: 'Belum Mulai', variant: 'secondary' as const },
  'done': { label: 'Selesai', variant: 'default' as const },
}

export default function MockupIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Mockup Index</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Daftar semua mockup halaman per phase. Klik untuk melihat preview desain.
        </p>
      </div>

      <div className="grid gap-4">
        {phases.map((phase) => (
          <Card key={phase.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{phase.name}</CardTitle>
                <Badge variant={statusMap[phase.status].variant}>
                  {statusMap[phase.status].label}
                </Badge>
              </div>
              <CardDescription>{phase.description}</CardDescription>
            </CardHeader>
            {phase.modules.length > 0 && (
              <CardContent>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {phase.modules.map((mod) => (
                    <Link
                      key={mod.slug}
                      href={`/mockups/${phase.id}/${mod.slug}`}
                      className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                    >
                      {mod.name}
                    </Link>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}