import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Briefcase,
  Users,
  UserCheck,
  ClipboardList,
  Search,
  Plus,
  MapPin,
  Building2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Rekrutmen & Talent Pool · Phase 1',
  description: 'Preview desain halaman Rekrutmen & Talent Pool',
}

// ── Mock Data: Lowongan Kerja ──
const lowonganData = [
  { title: 'Frontend Developer', posisi: 'Developer', lokasi: 'Jakarta', tipe: 'Full-time', gaji: 'Rp8jt–15jt', status: 'buka', tanggalBuka: '2025-03-01' },
  { title: 'Backend Developer', posisi: 'Developer', lokasi: 'Jakarta', tipe: 'Full-time', gaji: 'Rp10jt–18jt', status: 'buka', tanggalBuka: '2025-02-15' },
  { title: 'UI/UX Designer', posisi: 'Designer', lokasi: 'Remote', tipe: 'Full-time', gaji: 'Rp7jt–12jt', status: 'draft', tanggalBuka: '—' },
  { title: 'Project Manager', posisi: 'Manager', lokasi: 'Jakarta', tipe: 'Full-time', gaji: 'Rp15jt–25jt', status: 'tutup', tanggalBuka: '2025-01-10' },
  { title: 'Data Analyst Intern', posisi: 'Analyst', lokasi: 'Jakarta', tipe: 'Part-time', gaji: 'Rp3jt–5jt', status: 'buka', tanggalBuka: '2025-04-01' },
]

const lowonganStatusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive' }> = {
  buka: { label: 'Buka', variant: 'default' },
  draft: { label: 'Draft', variant: 'outline' },
  tutup: { label: 'Tutup', variant: 'secondary' },
  batal: { label: 'Batal', variant: 'destructive' },
}

// ── Mock Data: Talent Pool ──
const talentData = [
  { nama: 'Rizky Pratama', posisiSaatIni: 'Senior Frontend Dev', perusahaan: 'PT Tokopedia', sumber: 'LinkedIn', status: 'aktif' },
  { nama: 'Ayu Lestari', posisiSaatIni: 'UX Researcher', perusahaan: 'PT Gojek', sumber: 'Referral', status: 'diinterview' },
  { nama: 'Fajar Nugroho', posisiSaatIni: 'Backend Engineer', perusahaan: 'PT Bukalapak', sumber: 'Website', status: 'diinterview' },
  { nama: 'Dian Safitri', posisiSaatIni: 'Data Scientist', perusahaan: 'PT Traveloka', sumber: 'LinkedIn', status: 'ditolak' },
]

const talentStatusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive' }> = {
  aktif: { label: 'Aktif', variant: 'default' },
  diinterview: { label: 'Diinterview', variant: 'outline' },
  ditolak: { label: 'Ditolak', variant: 'destructive' },
}

// ── Mock Data: Tahap Rekrutmen (Kanban) ──
const pipelineData: Record<string, { nama: string; posisi: string }[]> = {
  'Melamar': [
    { nama: 'Budi Santoso', posisi: 'Frontend Developer' },
    { nama: 'Sari Dewi', posisi: 'Data Analyst Intern' },
  ],
  'Screening': [
    { nama: 'Andi Wijaya', posisi: 'Backend Developer' },
    { nama: 'Putri Rahayu', posisi: 'Frontend Developer' },
  ],
  'Interview': [
    { nama: 'Rizky Pratama', posisi: 'Frontend Developer' },
    { nama: 'Ayu Lestari', posisi: 'UI/UX Designer' },
    { nama: 'Fajar Nugroho', posisi: 'Backend Developer' },
  ],
  'Assessment': [
    { nama: 'Hendra Kusuma', posisi: 'Project Manager' },
    { nama: 'Lisa Permata', posisi: 'Backend Developer' },
  ],
  'Offering': [
    { nama: 'Dian Safitri', posisi: 'Data Analyst Intern' },
  ],
  'Dihiring': [
    { nama: 'Ahmad Rizal', posisi: 'Frontend Developer' },
    { nama: 'Nina Sari', posisi: 'UI/UX Designer' },
  ],
}

const pipelineColumns = ['Melamar', 'Screening', 'Interview', 'Assessment', 'Offering', 'Dihiring']

export default function RekrutmenMockup() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 1 — HR Core · US-HR-REC" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Rekrutmen &amp; Talent Pool</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola lowongan kerja, talent pool, dan proses rekrutmen
          </p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-700">
          <Plus className="mr-1.5 h-4 w-4" />
          Buat Lowongan
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Lowongan Aktif', value: '3', icon: Briefcase, sub: 'dari 5 total' },
          { label: 'Pelamar Bulan Ini', value: '12', icon: Users, sub: '+4 vs bulan lalu' },
          { label: 'Tahap Interview', value: '5', icon: ClipboardList, sub: '3 hari ini' },
          { label: 'Dihiring Bulan Ini', value: '2', icon: UserCheck, sub: 'target 4' },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{m.label}</p>
                <m.icon className="h-4 w-4 text-zinc-400" />
              </div>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{m.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Tab-style Section ── */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center gap-1 border-b border-zinc-200">
            {['Lowongan Kerja', 'Talent Pool', 'Tahap Rekrutmen'].map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  i === 0
                    ? 'border-b-2 border-zinc-900 text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* ── Section: Lowongan Kerja ── */}
          <div className="space-y-4">
            {/* Search & filter bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input placeholder="Cari lowongan..." className="w-64 pl-9" />
              </div>
              <div className="flex gap-2 text-sm">
                <Button variant="outline" size="sm" className="text-xs">Semua (5)</Button>
                <Button variant="ghost" size="sm" className="text-xs text-zinc-500">Buka (3)</Button>
                <Button variant="ghost" size="sm" className="text-xs text-zinc-500">Draft (1)</Button>
                <Button variant="ghost" size="sm" className="text-xs text-zinc-500">Tutup (1)</Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Posisi</th>
                    <th className="px-4 py-3">Lokasi</th>
                    <th className="px-4 py-3">Tipe</th>
                    <th className="px-4 py-3">Gaji Range</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Tanggal Buka</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {lowonganData.map((l) => (
                    <tr key={l.title} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900">{l.title}</td>
                      <td className="px-4 py-3 text-zinc-600">{l.posisi}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-zinc-600">
                          <MapPin className="h-3 w-3 text-zinc-400" />
                          {l.lokasi}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                          {l.tipe}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{l.gaji}</td>
                      <td className="px-4 py-3">
                        <Badge variant={lowonganStatusMap[l.status]?.variant || 'secondary'}>
                          {lowonganStatusMap[l.status]?.label || l.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-500">{l.tanggalBuka}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-xs">Detail</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>Menampilkan 1–5 dari 5 lowongan</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
                <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
              </div>
            </div>
          </div>

          {/* ── Section: Talent Pool ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Talent Pool</h3>
              <Button variant="outline" size="sm" className="text-xs">
                <Plus className="mr-1 h-3 w-3" />
                Tambah Talent
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {talentData.map((t) => (
                <Card key={t.nama} className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-600">
                        {t.nama.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <Badge variant={talentStatusMap[t.status]?.variant || 'secondary'}>
                        {talentStatusMap[t.status]?.label || t.status}
                      </Badge>
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="font-medium text-zinc-900">{t.nama}</p>
                      <p className="text-sm text-zinc-500">{t.posisiSaatIni}</p>
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3 w-3" />
                        <span>{t.perusahaan}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3" />
                        <span>Sumber: {t.sumber}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full text-xs">Lihat Profil</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* ── Section: Tahap Rekrutmen (Kanban) ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Tahap Rekrutmen</h3>
              <Button variant="outline" size="sm" className="text-xs">
                <ClipboardList className="mr-1 h-3 w-3" />
                Lihat Semua
              </Button>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {pipelineColumns.map((col) => (
                <div key={col} className="flex flex-col">
                  {/* Column header */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">{col}</span>
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-zinc-100 px-1.5 text-xs font-medium text-zinc-500">
                      {pipelineData[col]?.length || 0}
                    </span>
                  </div>
                  {/* Column cards */}
                  <div className="flex flex-col gap-2">
                    {(pipelineData[col] || []).map((card) => (
                      <div
                        key={card.nama}
                        className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm"
                      >
                        <p className="text-sm font-medium text-zinc-900">{card.nama}</p>
                        <p className="mt-0.5 text-xs text-zinc-400">{card.posisi}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}