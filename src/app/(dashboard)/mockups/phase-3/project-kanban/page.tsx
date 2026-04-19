import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Mockup — Project Kanban · Phase 3',
  description: 'Preview desain halaman Kanban & Task',
}

type Task = { id: string; title: string; assignee: string; priority: 'high' | 'medium' | 'low'; labels: string[]; storyPoints: number }
type Column = { name: string; color: string; tasks: Task[] }

const columns: Column[] = [
  { name: 'Backlog', color: 'border-zinc-300', tasks: [
    { id: 'T-012', title: 'Setup CI/CD pipeline', assignee: 'Budi H.', priority: 'low', labels: ['DevOps'], storyPoints: 3 },
    { id: 'T-013', title: 'Buat laporan PDF export', assignee: 'Maya P.', priority: 'medium', labels: ['Feature'], storyPoints: 5 },
  ]},
  { name: 'To Do', color: 'border-blue-400', tasks: [
    { id: 'T-010', title: 'Integrasi payment gateway', assignee: 'Sari D.', priority: 'high', labels: ['Backend', 'Urgent'], storyPoints: 8 },
    { id: 'T-011', title: 'Design dashboard mockup', assignee: 'Andi W.', priority: 'medium', labels: ['Design'], storyPoints: 3 },
  ]},
  { name: 'In Progress', color: 'border-amber-400', tasks: [
    { id: 'T-007', title: 'API endpoint payroll period', assignee: 'Budi H.', priority: 'high', labels: ['Backend'], storyPoints: 5 },
    { id: 'T-008', title: 'Frontend form cuti request', assignee: 'Maya P.', priority: 'medium', labels: ['Frontend'], storyPoints: 3 },
    { id: 'T-009', title: 'Unit test auth module', assignee: 'Sari D.', priority: 'low', labels: ['Testing'], storyPoints: 2 },
  ]},
  { name: 'Review', color: 'border-violet-400', tasks: [
    { id: 'T-005', title: 'Halaman slip gaji PDF', assignee: 'Andi W.', priority: 'high', labels: ['Feature', 'PDF'], storyPoints: 5 },
    { id: 'T-006', title: 'RLS policy payroll tables', assignee: 'Budi H.', priority: 'high', labels: ['Security'], storyPoints: 3 },
  ]},
  { name: 'Done', color: 'border-emerald-400', tasks: [
    { id: 'T-001', title: 'Setup project structure', assignee: 'Andi W.', priority: 'high', labels: ['Setup'], storyPoints: 3 },
    { id: 'T-002', title: 'Auth login page', assignee: 'Maya P.', priority: 'high', labels: ['Frontend', 'Auth'], storyPoints: 5 },
    { id: 'T-003', title: 'Sidebar & topbar layout', assignee: 'Maya P.', priority: 'medium', labels: ['Frontend'], storyPoints: 3 },
    { id: 'T-004', title: 'DB schema multi-tenant', assignee: 'Budi H.', priority: 'high', labels: ['Database'], storyPoints: 8 },
  ]},
]

const priorityConfig = {
  high: { label: 'High', variant: 'destructive' as const },
  medium: { label: 'Medium', variant: 'secondary' as const },
  low: { label: 'Low', variant: 'outline' as const },
}

export default function ProjectKanbanPage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 3 — Project Management" />

      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Project: ERP W.System</h2>
        <p className="text-sm text-zinc-500">Kanban board — drag & drop untuk memindahkan task antar kolom</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.name} className="min-w-[280px] flex-1">
            <div className={`mb-3 flex items-center justify-between rounded-t-lg border-t-4 ${col.color} bg-zinc-50 px-3 py-2`}>
              <span className="text-sm font-semibold text-zinc-700">{col.name}</span>
              <Badge variant="secondary" className="text-xs">{col.tasks.length}</Badge>
            </div>
            <div className="space-y-3">
              {col.tasks.map((task) => {
                const pc = priorityConfig[task.priority]
                return (
                  <Card key={task.id} className={`cursor-pointer border-t-2 ${col.color} transition-shadow hover:shadow-md`}>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-400">{task.id}</span>
                          <Badge variant={pc.variant} className="text-[10px] px-1.5 py-0">{pc.label}</Badge>
                        </div>
                        <p className="text-sm font-medium text-zinc-800 leading-snug">{task.title}</p>
                        <div className="flex flex-wrap gap-1">
                          {task.labels.map((l) => (
                            <span key={l} className="inline-flex rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">{l}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-zinc-400">{task.assignee}</span>
                          <span className="text-xs text-zinc-400">{task.storyPoints} SP</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
