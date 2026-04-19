import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  GraduationCap,
  PlayCircle,
  Users,
  BarChart3,
  Search,
  Plus,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  Eye,
  Monitor,
  MapPin,
  Video,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Training & E-Learning · Phase 1',
  description: 'Preview desain halaman Training & E-Learning',
}

// ── Mock Data: Program Training ──
const trainingData = [
  { nama: 'Onboarding Karyawan Baru', tipe: 'Offline', instruktur: 'Hendra Kusuma', tanggal: '2025-04-01', kuota: 20, peserta: 18, status: 'akan_datang' },
  { nama: 'Leadership Essentials', tipe: 'Hybrid', instruktur: 'Dewi Anggraini', tanggal: '2025-03-15', kuota: 15, peserta: 15, status: 'berjalan' },
  { nama: 'Python for Data Analysis', tipe: 'Online', instruktur: 'Fajar Nugroho', tanggal: '2025-03-10', kuota: 30, peserta: 22, status: 'berjalan' },
  { nama: 'K3 & Keselamatan Kerja', tipe: 'Offline', instruktur: 'Budi Santoso', tanggal: '2025-02-20', kuota: 25, peserta: 25, status: 'selesai' },
  { nama: 'Effective Communication', tipe: 'Hybrid', instruktur: 'Ayu Lestari', tanggal: '2025-02-10', kuota: 20, peserta: 12, status: 'selesai' },
  { nama: 'Cloud Architecture Fundamentals', tipe: 'Online', instruktur: 'Rizky Pratama', tanggal: '2025-05-12', kuota: 40, peserta: 8, status: 'akan_datang' },
  { nama: 'Project Management Professional', tipe: 'Offline', instruktur: 'Sari Dewi', tanggal: '2025-03-05', kuota: 10, peserta: 10, status: 'dibatalkan' },
  { nama: 'Agile Scrum Workshop', tipe: 'Online', instruktur: 'Andi Wijaya', tanggal: '2025-01-25', kuota: 20, peserta: 17, status: 'selesai' },
]

const tipeMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' }> = {
  Offline: { label: 'Offline', variant: 'secondary' },
  Online: { label: 'Online', variant: 'outline' },
  Hybrid: { label: 'Hybrid', variant: 'default' },
}

const statusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive' }> = {
  akan_datang: { label: 'Akan Datang', variant: 'outline' },
  berjalan: { label: 'Berjalan', variant: 'default' },
  selesai: { label: 'Selesai', variant: 'secondary' },
  dibatalkan: { label: 'Dibatalkan', variant: 'destructive' },
}

// ── Mock Data: E-Learning Courses ──
const eLearningData = [
  { judul: 'Dasar-Dasar Cybersecurity', kategori: 'Teknis', durasi: '8 jam', modul: 12, completion: 75, status: 'sedang' },
  { judul: 'Public Speaking Mastery', kategori: 'Soft Skill', durasi: '4 jam', modul: 6, completion: 33, status: 'sedang' },
  { judul: 'Anti-Bribery & Corruption', kategori: 'Compliance', durasi: '2 jam', modul: 4, completion: 100, status: 'selesai' },
  { judul: 'Strategic Leadership Program', kategori: 'Leadership', durasi: '12 jam', modul: 18, completion: 0, status: 'baru' },
  { judul: 'React Advanced Patterns', kategori: 'Teknis', durasi: '10 jam', modul: 15, completion: 50, status: 'sedang' },
  { judul: 'Data Privacy & GDPR', kategori: 'Compliance', durasi: '3 jam', modul: 5, completion: 100, status: 'selesai' },
]

const kategoriMap: Record<string, { label: string; color: string }> = {
  Teknis: { label: 'Teknis', color: 'bg-blue-100 text-blue-700' },
  'Soft Skill': { label: 'Soft Skill', color: 'bg-purple-100 text-purple-700' },
  Compliance: { label: 'Compliance', color: 'bg-amber-100 text-amber-700' },
  Leadership: { label: 'Leadership', color: 'bg-emerald-100 text-emerald-700' },
}

const courseStatusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' }> = {
  baru: { label: 'Baru', variant: 'outline' },
  sedang: { label: 'Sedang Dipelajari', variant: 'default' },
  selesai: { label: 'Selesai', variant: 'secondary' },
}

// ── Mock Data: Riwayat Training Karyawan ──
const riwayatData = [
  { nik: 'EMP-001', nama: 'Ahmad Rizal', program: 'K3 & Keselamatan Kerja', tanggal: '2025-02-20', status: 'lulus', score: '92' },
  { nik: 'EMP-002', nama: 'Nina Sari', program: 'Effective Communication', tanggal: '2025-02-10', status: 'lulus', score: '88' },
  { nik: 'EMP-003', nama: 'Budi Santoso', program: 'Project Management Professional', tanggal: '2025-03-05', status: 'tidak_lulus', score: '55' },
  { nik: 'EMP-004', nama: 'Putri Rahayu', program: 'Agile Scrum Workshop', tanggal: '2025-01-25', status: 'lulus', score: '95' },
  { nik: 'EMP-005', nama: 'Dian Safitri', program: 'Python for Data Analysis', tanggal: '2025-03-10', status: 'sedang', score: '—' },
  { nik: 'EMP-006', nama: 'Fajar Nugroho', program: 'Leadership Essentials', tanggal: '2025-03-15', status: 'lulus', score: '81' },
]

const riwayatStatusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  lulus: { label: 'Lulus', variant: 'default' },
  tidak_lulus: { label: 'Tidak Lulus', variant: 'destructive' },
  sedang: { label: 'Sedang', variant: 'secondary' },
}

function fillRateColor(peserta: number, kuota: number) {
  const ratio = peserta / kuota
  if (ratio >= 1) return 'text-red-600'
  if (ratio >= 0.7) return 'text-amber-600'
  return 'text-emerald-600'
}

export default function TrainingMockup() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 1 — HR Core · US-HR-008" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Training &amp; E-Learning</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola program training, e-learning, dan riwayat pelatihan karyawan
          </p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-700">
          <Plus className="mr-1.5 h-4 w-4" />
          Buat Program
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Training', value: '8', icon: GraduationCap, sub: '4 program selesai', iconColor: 'text-zinc-400' },
          { label: 'Sedang Berjalan', value: '2', icon: PlayCircle, sub: '+1 bulan ini', iconColor: 'text-blue-500' },
          { label: 'Peserta Aktif', value: '47', icon: Users, sub: 'dari 130 kuota' },
          { label: 'Completion Rate', value: '78%', icon: BarChart3, sub: '+5% vs kuartal lalu', iconColor: 'text-emerald-500' },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{m.label}</p>
                <m.icon className={`h-4 w-4 ${m.iconColor ?? 'text-zinc-400'}`} />
              </div>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{m.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Daftar Program Training ── */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Program Training</CardTitle>
          <CardDescription>Semua program pelatihan yang tersedia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search & filter bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input placeholder="Cari program training..." className="w-64 pl-9" />
            </div>
            <div className="flex gap-2 text-sm">
              <Button variant="outline" size="sm" className="text-xs">Semua (8)</Button>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-500">Akan Datang (2)</Button>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-500">Berjalan (2)</Button>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-500">Selesai (3)</Button>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-500">Dibatalkan (1)</Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Nama Program</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Instruktur</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Kuota</th>
                  <th className="px-4 py-3">Peserta</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {trainingData.map((t, i) => (
                  <tr key={t.nama} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{t.nama}</td>
                    <td className="px-4 py-3">
                      <Badge variant={tipeMap[t.tipe]?.variant || 'secondary'}>
                        {tipeMap[t.tipe]?.label || t.tipe}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{t.instruktur}</td>
                    <td className="px-4 py-3 text-zinc-500">{t.tanggal}</td>
                    <td className="px-4 py-3 text-zinc-600">{t.kuota}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${fillRateColor(t.peserta, t.kuota)}`}>
                        {t.peserta}/{t.kuota}
                      </span>
                      <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusMap[t.status]?.variant || 'secondary'}>
                        {statusMap[t.status]?.label || t.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="text-xs">Detail</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-zinc-500">
            <span>Menampilkan 1–8 dari 8 program</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
              <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── E-Learning Courses ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>E-Learning Courses</CardTitle>
              <CardDescription>Modul pembelajaran daring yang tersedia untuk karyawan</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              <BookOpen className="mr-1 h-3 w-3" />
              Lihat Semua
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eLearningData.map((c) => (
              <Card key={c.judul} className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${kategoriMap[c.kategori]?.color || 'bg-zinc-100 text-zinc-700'}`}>
                      {kategoriMap[c.kategori]?.label || c.kategori}
                    </span>
                    <Badge variant={courseStatusMap[c.status]?.variant || 'secondary'}>
                      {courseStatusMap[c.status]?.label || c.status}
                    </Badge>
                  </div>
                  <h4 className="mt-3 font-medium text-zinc-900">{c.judul}</h4>
                  <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {c.durasi}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Monitor className="h-3 w-3" />
                      {c.modul} modul
                    </span>
                  </div>
                  {/* Completion bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Progres</span>
                      <span className={`font-medium ${c.completion === 100 ? 'text-emerald-600' : c.completion === 0 ? 'text-zinc-400' : 'text-blue-600'}`}>
                        {c.completion}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          c.completion === 100 ? 'bg-emerald-500' : c.completion === 0 ? 'bg-zinc-200' : 'bg-blue-500'
                        }`}
                        style={{ width: `${c.completion}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      {c.status === 'baru' ? 'Mulai Belajar' : c.status === 'selesai' ? 'Review Materi' : 'Lanjutkan'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Riwayat Training Karyawan ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Riwayat Training Karyawan</CardTitle>
              <CardDescription>Catatan keikutsertaan dan hasil pelatihan karyawan</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              <Award className="mr-1 h-3 w-3" />
              Export Laporan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input placeholder="Cari NIK atau nama karyawan..." className="w-64 pl-9" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-3">NIK</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Program</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Score / Sertifikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {riwayatData.map((r) => (
                  <tr key={r.nik + r.program} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 text-zinc-500">{r.nik}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{r.nama}</td>
                    <td className="px-4 py-3 text-zinc-600">{r.program}</td>
                    <td className="px-4 py-3 text-zinc-500">{r.tanggal}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1">
                        {r.status === 'lulus' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                        {r.status === 'tidak_lulus' && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                        <Badge variant={riwayatStatusMap[r.status]?.variant || 'secondary'}>
                          {riwayatStatusMap[r.status]?.label || r.status}
                        </Badge>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.status === 'lulus' ? (
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                          <Award className="h-3.5 w-3.5" />
                          {r.score}
                        </span>
                      ) : r.status === 'tidak_lulus' ? (
                        <span className="font-medium text-red-600">{r.score}</span>
                      ) : (
                        <span className="text-zinc-400">{r.score}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-zinc-500">
            <span>Menampilkan 1–6 dari 6 catatan</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
              <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}