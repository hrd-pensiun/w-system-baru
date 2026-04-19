import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  Star,
  Search,
  Eye,
  BarChart3,
  ChevronRight,
  Calendar,
  Users,
  MessageSquare,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Performance Appraisal · Phase 1',
  description: 'Preview desain halaman Performance Appraisal (Penilaian Kinerja Karyawan)',
}

// ── Helpers ──
function scoreColor(val: number | null): string {
  if (val === null) return 'text-zinc-400'
  if (val < 70) return 'text-red-600 font-semibold'
  if (val < 85) return 'text-amber-600 font-medium'
  return 'text-emerald-600 font-semibold'
}

// ── Mock Data: Daftar Penilaian Karyawan ──
const appraisalData = [
  { nik: 'WS-2022-001', nama: 'Ahmad Rizal', jabatan: 'Software Engineer', reviewer: 'Andi Wibowo', selfScore: 88, reviewerScore: 87, finalScore: 87.1, status: 'Selesai' },
  { nik: 'WS-2022-002', nama: 'Nina Sari', jabatan: 'UI Designer', reviewer: 'Sari Dewi', selfScore: 82, reviewerScore: 78, finalScore: 79.6, status: 'Selesai' },
  { nik: 'WS-2022-003', nama: 'Budi Santoso', jabatan: 'Backend Developer', reviewer: 'Andi Wibowo', selfScore: 75, reviewerScore: null, finalScore: null, status: 'Menunggu Review' },
  { nik: 'WS-2022-004', nama: 'Putri Rahayu', jabatan: 'HR Officer', reviewer: 'Dian Kusuma', selfScore: null, reviewerScore: null, finalScore: null, status: 'Belum Dinilai' },
  { nik: 'WS-2022-005', nama: 'Fajar Nugroho', jabatan: 'QA Engineer', reviewer: 'Andi Wibowo', selfScore: 90, reviewerScore: 92, finalScore: 91.4, status: 'Selesai' },
  { nik: 'WS-2022-006', nama: 'Dewi Lestari', jabatan: 'Finance Analyst', reviewer: 'Ratna Sari', selfScore: 68, reviewerScore: 65, finalScore: 66.0, status: 'Selesai' },
  { nik: 'WS-2023-007', nama: 'Rudi Hartono', jabatan: 'Project Manager', reviewer: 'Dian Kusuma', selfScore: 91, reviewerScore: null, finalScore: null, status: 'Draft' },
  { nik: 'WS-2023-008', nama: 'Sita Permata', jabatan: 'Marketing Lead', reviewer: 'Ratna Sari', selfScore: null, reviewerScore: null, finalScore: null, status: 'Belum Dinilai' },
]

const statusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive'; className: string }> = {
  'Selesai': { label: 'Selesai', variant: 'default', className: 'bg-emerald-600 hover:bg-emerald-700' },
  'Menunggu Review': { label: 'Menunggu Review', variant: 'outline', className: 'text-amber-700 border-amber-300 bg-amber-50' },
  'Belum Dinilai': { label: 'Belum Dinilai', variant: 'outline', className: 'text-zinc-500 border-zinc-300 bg-zinc-50' },
  'Draft': { label: 'Draft', variant: 'secondary', className: 'text-blue-700 border-blue-300 bg-blue-50' },
}

// ── Mock Data: Detail Penilaian Ahmad Rizal ──
const detailDimensions = [
  { dimensi: 'Kualitas Kerja', bobot: 25, selfScore: 90, reviewerScore: 88, final: 88.5 },
  { dimensi: 'Produktivitas', bobot: 25, selfScore: 85, reviewerScore: 90, final: 88.0 },
  { dimensi: 'Kerjasama Tim', bobot: 20, selfScore: 88, reviewerScore: 92, final: 90.4 },
  { dimensi: 'Inisiatif', bobot: 15, selfScore: 80, reviewerScore: 82, final: 81.3 },
  { dimensi: 'Kepemimpinan', bobot: 15, selfScore: 85, reviewerScore: 86, final: 85.5 },
]

const detailTotal = detailDimensions.reduce((sum, d) => sum + d.final * (d.bobot / 100), 0)

const reviewerComments = [
  { reviewer: 'Andi Wibowo', role: 'HR Manager', date: '28 Mar 2025', comment: 'Ahmad menunjukkan performa yang konsisten baik di Q1. Kualitas kerja sangat memuaskan dan kerjasama tim menjadi poin terkuatnya. Perlu sedikit peningkatan di aspek inisiatif dan kepemimpinan untuk peran senior di masa depan.' },
  { reviewer: 'Dian Kusuma', role: 'HR Director', date: '2 Apr 2025', comment: 'Setuju dengan penilaian. Ahmad adalah aset berharga tim Teknologi. Saran untuk Q2: berikan lebih banyak opportunity untuk memimpin proyek kecil guna mengembangkan skill kepemimpinan.' },
]

// ── Mock Data: Ringkasan Per Departemen ──
const departemenSummary = [
  { departemen: 'Teknologi', jumlahReview: 8, rataSkor: 85.3, persenSelesai: 75 },
  { departemen: 'Produk', jumlahReview: 4, rataSkor: 82.1, persenSelesai: 50 },
  { departemen: 'SDM', jumlahReview: 3, rataSkor: 90.2, persenSelesai: 100 },
  { departemen: 'Keuangan', jumlahReview: 2, rataSkor: 76.8, persenSelesai: 100 },
  { departemen: 'Pemasaran', jumlahReview: 1, rataSkor: 79.5, persenSelesai: 0 },
]

export default function AppraisalMockup() {
  const completedCount = appraisalData.filter((r) => r.status === 'Selesai').length
  const waitingCount = appraisalData.filter((r) => r.status === 'Menunggu Review' || r.status === 'Draft').length
  const avgScore = appraisalData.filter((r) => r.finalScore !== null).reduce((sum, r) => sum + r.finalScore!, 0) / appraisalData.filter((r) => r.finalScore !== null).length
  const completionPct = Math.round((completedCount / appraisalData.length) * 100)

  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 1 — HR Core · US-HR-007" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Performance Appraisal</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola siklus penilaian kinerja karyawan dan pantau hasil appraisal
          </p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-700">
          <ClipboardCheck className="mr-1.5 h-4 w-4" />
          Buat Siklus Baru
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Review Aktif', value: '18', icon: ClipboardCheck, sub: 'siklus Q1 2025', accent: 'text-zinc-600' },
          { label: 'Menunggu Penilaian', value: String(waitingCount + appraisalData.filter((r) => r.status === 'Belum Dinilai').length), icon: Clock, sub: 'perlu tindakan', accent: 'text-amber-600' },
          { label: 'Selesai Dinilai', value: String(completedCount), icon: CheckCircle2, sub: `dari ${appraisalData.length} karyawan`, accent: 'text-emerald-600' },
          { label: 'Rata-rata Skor', value: avgScore.toFixed(1), icon: Star, sub: 'dari yang selesai', accent: 'text-zinc-600' },
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

      {/* ── Siklus Review Aktif ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-zinc-900">Siklus Review Aktif</CardTitle>
          <CardDescription>Informasi siklus penilaian kinerja yang sedang berjalan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Periode', value: 'Q1 2025', icon: Calendar },
              { label: 'Status', value: 'Berjalan', icon: ClipboardCheck },
              { label: 'Peserta', value: '18 karyawan / 5 reviewer', icon: Users },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-lg border border-zinc-100 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-100">
                  <item.icon className="h-4 w-4 text-zinc-600" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">{item.label}</p>
                  <p className="text-sm font-medium text-zinc-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-100 p-3">
              <p className="text-xs text-zinc-400">Tanggal Mulai</p>
              <p className="text-sm font-medium text-zinc-900">1 Januari 2025</p>
            </div>
            <div className="rounded-lg border border-zinc-100 p-3">
              <p className="text-xs text-zinc-400">Tanggal Selesai</p>
              <p className="text-sm font-medium text-zinc-900">31 Maret 2025</p>
            </div>
            <div className="rounded-lg border border-zinc-100 p-3">
              <p className="text-xs text-zinc-400">Deadline Penilaian</p>
              <p className="text-sm font-medium text-zinc-900">15 April 2025</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Progres Penilaian</span>
              <span className="font-medium text-zinc-700">{completionPct}% selesai</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-zinc-900 transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Main Content Card with Tab Sections ── */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center gap-1 border-b border-zinc-200">
            {['Daftar Penilaian Karyawan', 'Detail Penilaian', 'Ringkasan Per Departemen'].map((tab, i) => (
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
        <CardContent className="pt-6 space-y-10">

          {/* ═══════════════════════════════════════════
              Section 1: Daftar Penilaian Karyawan
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-zinc-900">Daftar Penilaian Karyawan</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input placeholder="Cari karyawan..." className="w-48 pl-9" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-500">Siklus: Q1 2025</span>
              </div>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">NIK</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Jabatan</th>
                    <th className="px-4 py-3">Reviewer</th>
                    <th className="px-4 py-3 text-center">Self Assessment</th>
                    <th className="px-4 py-3 text-center">Reviewer Score</th>
                    <th className="px-4 py-3 text-center">Final Score</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {appraisalData.map((row) => {
                    const statusInfo = statusMap[row.status]
                    return (
                      <tr key={row.nik} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.nik}</td>
                        <td className="px-4 py-3 font-medium text-zinc-900">{row.nama}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.jabatan}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.reviewer}</td>
                        <td className={`px-4 py-3 text-center ${scoreColor(row.selfScore)}`}>
                          {row.selfScore !== null ? row.selfScore : '—'}
                        </td>
                        <td className={`px-4 py-3 text-center ${scoreColor(row.reviewerScore)}`}>
                          {row.reviewerScore !== null ? row.reviewerScore : '—'}
                        </td>
                        <td className={`px-4 py-3 text-center font-semibold ${scoreColor(row.finalScore)}`}>
                          {row.finalScore !== null ? row.finalScore.toFixed(1) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusInfo?.variant || 'secondary'} className={statusInfo?.className}>
                            {statusInfo?.label || row.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Eye className="mr-1 h-3 w-3" />
                            Detail
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>Menampilkan 1–8 dari 8 karyawan</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
                <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Section 2: Detail Penilaian
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Detail Penilaian</h3>
            </div>

            <Card className="border-zinc-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white text-sm font-semibold">
                    AR
                  </div>
                  <div>
                    <CardTitle className="text-base text-zinc-900">Ahmad Rizal</CardTitle>
                    <CardDescription className="text-sm text-zinc-500">Software Engineer · Teknologi · NIK: WS-2022-001</CardDescription>
                  </div>
                  <Badge className="ml-auto bg-emerald-600 hover:bg-emerald-700">Selesai</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-zinc-100 p-3">
                    <p className="text-xs text-zinc-400">Self Assessment</p>
                    <p className="text-lg font-semibold text-emerald-600">88<span className="text-sm font-normal text-zinc-400">/100</span></p>
                  </div>
                  <div className="rounded-lg border border-zinc-100 p-3">
                    <p className="text-xs text-zinc-400">Reviewer</p>
                    <p className="text-sm font-medium text-zinc-900">Andi Wibowo</p>
                    <p className="text-xs text-zinc-400">HR Manager</p>
                  </div>
                  <div className="rounded-lg border border-zinc-100 p-3">
                    <p className="text-xs text-zinc-400">Periode</p>
                    <p className="text-sm font-medium text-zinc-900">Q1 2025</p>
                    <p className="text-xs text-zinc-400">Januari – Maret</p>
                  </div>
                </div>

                {/* Dimensions Table */}
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
                      {detailDimensions.map((d) => (
                        <tr key={d.dimensi} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-zinc-900">{d.dimensi}</td>
                          <td className="px-4 py-3 text-center text-zinc-600">{d.bobot}%</td>
                          <td className={`px-4 py-3 text-center ${scoreColor(d.selfScore)}`}>{d.selfScore}</td>
                          <td className={`px-4 py-3 text-center ${scoreColor(d.reviewerScore)}`}>{d.reviewerScore}</td>
                          <td className={`px-4 py-3 text-center font-semibold ${scoreColor(d.final)}`}>{d.final.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-zinc-300 bg-zinc-50">
                        <td className="px-4 py-3 font-semibold text-zinc-900" colSpan={4}>TOTAL</td>
                        <td className="px-4 py-3 text-center font-bold text-lg text-zinc-900">{detailTotal.toFixed(1)}/100</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Score Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Skor Akhir</span>
                    <span className="font-medium text-emerald-700">{detailTotal.toFixed(1)} / 100</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${Math.min(detailTotal, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                    <MessageSquare className="h-4 w-4 text-zinc-500" />
                    <span>Komentar Reviewer</span>
                  </div>
                  {reviewerComments.map((c) => (
                    <div key={c.reviewer + c.date} className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-zinc-900">{c.reviewer}</p>
                          <p className="text-xs text-zinc-400">{c.role}</p>
                        </div>
                        <span className="text-xs text-zinc-400">{c.date}</span>
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed">{c.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ═══════════════════════════════════════════
              Section 3: Ringkasan Per Departemen
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Ringkasan Per Departemen</h3>
              <Button variant="outline" size="sm" className="text-xs">
                <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
                Ekspor Laporan
              </Button>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Departemen</th>
                    <th className="px-4 py-3 text-center">Jumlah Review</th>
                    <th className="px-4 py-3 text-center">Rata-rata Skor</th>
                    <th className="px-4 py-3 text-center">% Selesai</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {departemenSummary.map((dept) => (
                    <tr key={dept.departemen} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900">{dept.departemen}</td>
                      <td className="px-4 py-3 text-center text-zinc-600">{dept.jumlahReview}</td>
                      <td className={`px-4 py-3 text-center ${scoreColor(dept.rataSkor)}`}>
                        {dept.rataSkor.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-2 w-16 rounded-full bg-zinc-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                dept.persenSelesai >= 75
                                  ? 'bg-emerald-500'
                                  : dept.persenSelesai >= 50
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                              }`}
                              style={{ width: `${dept.persenSelesai}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-500">{dept.persenSelesai}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-xs">
                          Lihat Detail
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}