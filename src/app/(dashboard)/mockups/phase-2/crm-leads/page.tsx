import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Users,
  UserPlus,
  CheckCircle2,
  TrendingUp,
  Search,
  Plus,
  GripVertical,
  ArrowRight,
  Eye,
  Pencil,
  Building2,
  Phone,
  Mail,
  DollarSign,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — CRM Leads · Phase 2',
  description: 'Preview desain halaman CRM Leads & Pipeline',
}

// ── Mock Data: Pipeline Columns ──
const pipelineColumns = [
  {
    id: 'baru',
    label: 'Baru',
    color: 'bg-zinc-100',
    accent: 'bg-zinc-400',
    leads: [
      { perusahaan: 'PT Sentosa Abadi', kontak: 'Budi Hartono', nilai: 'Rp120.000.000', hari: 2 },
      { perusahaan: 'CV Maju Jaya', kontak: 'Siti Aminah', nilai: 'Rp85.000.000', hari: 1 },
    ],
  },
  {
    id: 'kontak',
    label: 'Kontak',
    color: 'bg-sky-50',
    accent: 'bg-sky-400',
    leads: [
      { perusahaan: 'PT Nusantara Digital', kontak: 'Andi Pratama', nilai: 'Rp250.000.000', hari: 5 },
      { perusahaan: 'PT Karya Mandiri', kontak: 'Dewi Lestari', nilai: 'Rp175.000.000', hari: 3 },
      { perusahaan: 'CV Prima Solusi', kontak: 'Rudi Hermawan', nilai: 'Rp95.000.000', hari: 7 },
    ],
  },
  {
    id: 'proposal',
    label: 'Proposal',
    color: 'bg-violet-50',
    accent: 'bg-violet-400',
    leads: [
      { perusahaan: 'PT Global Teknologi', kontak: 'Hendra Wijaya', nilai: 'Rp340.000.000', hari: 12 },
      { perusahaan: 'PT Indah Permata', kontak: 'Rina Sari', nilai: 'Rp200.000.000', hari: 8 },
    ],
  },
  {
    id: 'negosiasi',
    label: 'Negosiasi',
    color: 'bg-amber-50',
    accent: 'bg-amber-400',
    leads: [
      { perusahaan: 'PT Cipta Bersama', kontak: 'Agus Setiawan', nilai: 'Rp420.000.000', hari: 18 },
      { perusahaan: 'CV Harmoni Utama', kontak: 'Lina Purnama', nilai: 'Rp310.000.000', hari: 14 },
    ],
  },
  {
    id: 'menang',
    label: 'Menang',
    color: 'bg-emerald-50',
    accent: 'bg-emerald-500',
    leads: [
      { perusahaan: 'PT Pilar Nusantara', kontak: 'Dian Permana', nilai: 'Rp560.000.000', hari: 25 },
      { perusahaan: 'PT Surya Mandala', kontak: 'Fajar Sidqi', nilai: 'Rp180.000.000', hari: 22 },
      { perusahaan: 'CV Tekno Sains', kontak: 'Mega Putri', nilai: 'Rp290.000.000', hari: 30 },
    ],
  },
  {
    id: 'kalah',
    label: 'Kalah',
    color: 'bg-red-50',
    accent: 'bg-red-400',
    leads: [
      { perusahaan: 'PT Bintang Timur', kontak: 'Rizky Ananda', nilai: 'Rp150.000.000', hari: 45 },
      { perusahaan: 'CV Data Permata', kontak: 'Yuni Astuti', nilai: 'Rp95.000.000', hari: 38 },
    ],
  },
]

// ── Mock Data: Tabel Leads ──
const leadsTable = [
  { no: 1, perusahaan: 'PT Sentosa Abadi', kontak: 'Budi Hartono', email: 'budi@sentosa.co.id', telepon: '021-55667788', nilai: 'Rp120.000.000', status: 'Baru' },
  { no: 2, perusahaan: 'CV Maju Jaya', kontak: 'Siti Aminah', email: 'siti@majujaya.com', telepon: '031-77889900', nilai: 'Rp85.000.000', status: 'Baru' },
  { no: 3, perusahaan: 'PT Nusantara Digital', kontak: 'Andi Pratama', email: 'andi@nusadigital.id', telepon: '021-33445566', nilai: 'Rp250.000.000', status: 'Kontak' },
  { no: 4, perusahaan: 'PT Karya Mandiri', kontak: 'Dewi Lestari', email: 'dewi@karyamandiri.co.id', telepon: '024-11223344', nilai: 'Rp175.000.000', status: 'Kontak' },
  { no: 5, perusahaan: 'PT Global Teknologi', kontak: 'Hendra Wijaya', email: 'hendra@globalteknologi.com', telepon: '021-99887766', nilai: 'Rp340.000.000', status: 'Proposal' },
  { no: 6, perusahaan: 'PT Cipta Bersama', kontak: 'Agus Setiawan', email: 'agus@ciptabersama.id', telepon: '031-44556677', nilai: 'Rp420.000.000', status: 'Negosiasi' },
  { no: 7, perusahaan: 'PT Pilar Nusantara', kontak: 'Dian Permana', email: 'dian@pilarnusantara.co.id', telepon: '021-66778899', nilai: 'Rp560.000.000', status: 'Menang' },
  { no: 8, perusahaan: 'PT Bintang Timur', kontak: 'Rizky Ananda', email: 'rizky@bintangtimur.com', telepon: '031-22334455', nilai: 'Rp150.000.000', status: 'Kalah' },
]

const statusVariantMap: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Baru: 'outline',
  Kontak: 'secondary',
  Proposal: 'secondary',
  Negosiasi: 'outline',
  Menang: 'default',
  Kalah: 'destructive',
}

export default function CrmLeadsMockup() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 2 — CRM & Sales" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">CRM Leads &amp; Pipeline</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola prospek klien, pipeline penjualan, dan konversi leads
          </p>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Leads', value: '47', icon: Users, sub: 'semua pipeline', color: 'text-zinc-500' },
          { label: 'Baru Bulan Ini', value: '12', icon: UserPlus, sub: '+3 dari bulan lalu', color: 'text-emerald-500' },
          { label: 'Converted to Klien', value: '8', icon: CheckCircle2, sub: 'semester ini', color: 'text-blue-500' },
          { label: 'Win Rate', value: '32%', icon: TrendingUp, sub: 'akhir 12 bulan', color: 'text-violet-500' },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{m.label}</p>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{m.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ═══════════════════════════════════════════
          Section 1: Quick Add Lead
          ═══════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Add Lead</CardTitle>
          <CardDescription>Tambahkan prospek baru ke pipeline dengan cepat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Nama Perusahaan</label>
              <Input placeholder="cth: PT Contoh Indonesia" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Kontak Person</label>
              <Input placeholder="cth: Ahmad Rizal" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Email</label>
              <Input placeholder="cth: ahmad@contoh.co.id" type="email" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Telepon</label>
              <Input placeholder="cth: 021-12345678" type="tel" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-600">Nilai Estimasi</label>
              <Input placeholder="cth: Rp150.000.000" />
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-700 sm:w-auto">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Tambah Lead
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════
          Section 2: Kanban Pipeline
          ═══════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pipeline Kanban</CardTitle>
              <CardDescription>Visualisasi alur penjualan dari leads hingga konversi</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input placeholder="Cari lead..." className="w-48 pl-9" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {pipelineColumns.map((col) => (
              <div key={col.id} className="min-w-[260px] flex-shrink-0">
                {/* Column header */}
                <div className={`mb-3 flex items-center gap-2 rounded-lg px-3 py-2 ${col.color}`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${col.accent}`} />
                  <span className="text-sm font-semibold text-zinc-700">{col.label}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {col.leads.length}
                  </Badge>
                </div>

                {/* Lead cards */}
                <div className="space-y-3">
                  {col.leads.map((lead, idx) => (
                    <div
                      key={`${col.id}-${idx}`}
                      className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-3.5 w-3.5 text-zinc-300" />
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-100 text-xs font-semibold text-zinc-600">
                            {lead.perusahaan.slice(3, 5).toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-zinc-900 leading-tight">{lead.perusahaan}</p>
                      <p className="mt-1 text-xs text-zinc-500">{lead.kontak}</p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-zinc-400">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium text-zinc-600">{lead.nilai}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-2">
                        <span className="text-[11px] text-zinc-400">{lead.hari} hari di stage</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Eye className="h-3 w-3 text-zinc-400" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Pencil className="h-3 w-3 text-zinc-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add lead to column button */}
                  <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-300 py-2 text-xs text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-600">
                    <Plus className="h-3 w-3" />
                    Tambah
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline summary */}
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-zinc-50 px-4 py-3">
            <DollarSign className="h-4 w-4 text-zinc-400" />
            <span className="text-sm text-zinc-500">Total Nilai Pipeline:</span>
            <span className="text-sm font-semibold text-zinc-900">Rp3.080.000.000</span>
            <ArrowRight className="h-3.5 w-3.5 text-zinc-300" />
            <span className="text-sm text-zinc-500">Weighted:</span>
            <span className="text-sm font-semibold text-zinc-700">Rp985.600.000</span>
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════
          Section 3: Tabel Leads
          ═══════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Leads</CardTitle>
              <CardDescription>Semua prospek dalam tampilan tabel</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input placeholder="Cari perusahaan..." className="w-56 pl-9" />
              </div>
              <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Lead Baru
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Perusahaan</th>
                  <th className="px-4 py-3">Kontak</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Telepon</th>
                  <th className="px-4 py-3 text-right">Nilai Estimasi</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {leadsTable.map((row) => (
                  <tr key={row.no} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 text-zinc-400">{row.no}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-100 text-[10px] font-semibold text-zinc-500">
                          <Building2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium text-zinc-900">{row.perusahaan}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{row.kontak}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-zinc-600">
                        <Mail className="h-3 w-3 text-zinc-400" />
                        {row.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-zinc-600">
                        <Phone className="h-3 w-3 text-zinc-400" />
                        {row.telepon}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-700">{row.nilai}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariantMap[row.status] || 'secondary'}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <Eye className="mr-1 h-3 w-3" />
                          Lihat
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <Pencil className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer / pagination hint */}
          <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
            <span>Menampilkan 8 dari 47 leads</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 text-xs">Sebelumnya</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">Selanjutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}