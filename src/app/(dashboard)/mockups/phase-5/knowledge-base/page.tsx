import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, FileText, Megaphone, Search, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Knowledge Base · Phase 5',
  description: 'Preview desain halaman Knowledge Base, SOP & Pengumuman',
}

const kbArticles = [
  { id: 'KB-001', judul: 'SOP Onboarding Karyawan Baru', kategori: 'HR', penulis: 'Andi Wibowo', tgl: '10 Jan 2025', dibaca: 45, versi: 'v2.1' },
  { id: 'KB-002', judul: 'Panduan Penggunaan ERP W.System', kategori: 'Teknis', penulis: 'Budi Santoso', tgl: '15 Feb 2025', dibaca: 78, versi: 'v1.5' },
  { id: 'KB-003', judul: 'Standar Coding & Code Review', kategori: 'Engineering', penulis: 'Ahmad Rizal', tgl: '1 Mar 2025', dibaca: 32, versi: 'v3.0' },
  { id: 'KB-004', judul: 'Prosedur CUTI & Lembur', kategori: 'HR', penulis: 'HR Dept', tgl: '5 Jan 2025', dibaca: 56, versi: 'v1.2' },
  { id: 'KB-005', judul: 'Disaster Recovery Plan Server', kategori: 'IT', penulis: 'IT Team', tgl: '20 Jan 2025', dibaca: 12, versi: 'v1.0' },
  { id: 'KB-006', judul: 'Template Quotation & Invoice', kategori: 'Sales', penulis: 'Sari Dewi', tgl: '10 Feb 2025', dibaca: 28, versi: 'v2.0' },
]

const pengumuman = [
  { judul: 'Jadwal Libur Lebaran 2025', target: 'Semua Entity', tgl: '15 Apr 2025', dibaca: '8/8', prioritas: 'Normal' },
  { judul: 'Update Kebijakan Cuti Tahunan', target: 'PT W.System Indonesia', tgl: '1 Apr 2025', dibaca: '6/8', prioritas: 'Penting' },
  { judul: 'Maintenance Server Minggu Depan', target: 'IT Dept', tgl: '10 Apr 2025', dibaca: '3/4', prioritas: 'Urgent' },
  { judul: 'Training Wajih Cyber Security', target: 'Semua Entity', tgl: '5 Apr 2025', dibaca: '5/8', prioritas: 'Normal' },
]

const kategoriColor: Record<string, string> = {
  HR: 'bg-blue-50 text-blue-700',
  Teknis: 'bg-violet-50 text-violet-700',
  Engineering: 'bg-emerald-50 text-emerald-700',
  IT: 'bg-amber-50 text-amber-700',
  Sales: 'bg-rose-50 text-rose-700',
}

const prioritasColor: Record<string, { variant: 'default' | 'secondary' | 'destructive' }> = {
  Normal: { variant: 'secondary' },
  Penting: { variant: 'default' },
  Urgent: { variant: 'destructive' },
}

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 5 — Asset & Product Library" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><BookOpen className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Artikel</p><p className="text-xl font-semibold text-zinc-900">6</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><FileText className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Dibaca</p><p className="text-xl font-semibold text-zinc-900">251</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Megaphone className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Pengumuman Aktif</p><p className="text-xl font-semibold text-zinc-900">4</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Search className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Kategori</p><p className="text-xl font-semibold text-zinc-900">5</p></div>
        </div></CardContent></Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle className="text-lg">Knowledge Base & SOP</CardTitle><CardDescription>Tiptap editor, search fulltext, versioning</CardDescription></div>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" />Artikel Baru</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {kbArticles.map((a, i) => (
              <div key={i} className="rounded-lg border border-zinc-200 p-4 hover:bg-zinc-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">{a.id}</span>
                    <span className="font-medium text-zinc-800">{a.judul}</span>
                  </div>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${kategoriColor[a.kategori] || 'bg-zinc-100 text-zinc-600'}`}>{a.kategori}</span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                  <span>{a.penulis}</span><span>·</span><span>{a.tgl}</span><span>·</span><span>{a.dibaca}x dibaca</span><span>·</span><span>{a.versi}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle className="text-lg">Pengumuman</CardTitle><CardDescription>Target per entity/branch, read tracking</CardDescription></div>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" />Buat Pengumuman</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pengumuman.map((p, i) => {
              const pc = prioritasColor[p.prioritas]
              return (
                <div key={i} className="rounded-lg border border-zinc-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-800">{p.judul}</span>
                    <Badge variant={pc.variant}>{p.prioritas}</Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                    <span>Target: {p.target}</span><span>·</span><span>{p.tgl}</span><span>·</span><span>Dibaca: {p.dibaca}</span>
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
