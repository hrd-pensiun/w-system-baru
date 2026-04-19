import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Target,
  TrendingUp,
  ArrowDown,
  Calendar,
  Search,
  Eye,
  BarChart3,
  ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — KPI · Phase 1',
  description: 'Preview desain halaman KPI (Key Performance Indicator)',
}

// ── Mock Data: Daftar KPI Karyawan ──
const kpiKaryawanData = [
  { nik: 'WS-2022-001', nama: 'Ahmad Rizal', jabatan: 'Software Engineer', departemen: 'Teknologi', target: 100, pencapaian: 112, status: 'Di Atas Target' },
  { nik: 'WS-2022-002', nama: 'Nina Sari', jabatan: 'UI Designer', departemen: 'Produk', target: 100, pencapaian: 95, status: 'Sesuai Target' },
  { nik: 'WS-2022-003', nama: 'Budi Santoso', jabatan: 'Backend Developer', departemen: 'Teknologi', target: 100, pencapaian: 82, status: 'Di Bawah Target' },
  { nik: 'WS-2022-004', nama: 'Putri Rahayu', jabatan: 'HR Officer', departemen: 'SDM', target: 100, pencapaian: 98, status: 'Sesuai Target' },
  { nik: 'WS-2022-005', nama: 'Fajar Nugroho', jabatan: 'QA Engineer', departemen: 'Teknologi', target: 100, pencapaian: 120, status: 'Di Atas Target' },
  { nik: 'WS-2022-006', nama: 'Dewi Lestari', jabatan: 'Finance Analyst', departemen: 'Keuangan', target: 100, pencapaian: 76, status: 'Di Bawah Target' },
  { nik: 'WS-2023-007', nama: 'Rudi Hartono', jabatan: 'Project Manager', departemen: 'Produk', target: 100, pencapaian: 104, status: 'Di Atas Target' },
  { nik: 'WS-2023-008', nama: 'Sita Permata', jabatan: 'Marketing Lead', departemen: 'Pemasaran', target: 100, pencapaian: 88, status: 'Di Bawah Target' },
]

const kpiStatusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive'; color: string }> = {
  'Di Atas Target': { label: 'Di Atas Target', variant: 'default', color: 'bg-emerald-600 hover:bg-emerald-700' },
  'Sesuai Target': { label: 'Sesuai Target', variant: 'outline', color: 'text-blue-700 border-blue-300 bg-blue-50' },
  'Di Bawah Target': { label: 'Di Bawah Target', variant: 'destructive', color: 'bg-red-600 hover:bg-red-700' },
}

function pencapaianColor(val: number): string {
  if (val > 100) return 'text-emerald-600 font-semibold'
  if (val >= 90) return 'text-blue-600 font-medium'
  return 'text-red-600 font-medium'
}

// ── Mock Data: Detail KPI Ahmad Rizal ──
const detailKpiItems = [
  { indikator: 'Produktivitas Kode', bobot: 25, target: '100 line/day', realisasi: '115 line/day', skor: 115, status: 'Di Atas Target' },
  { indikator: 'Bug Rate', bobot: 20, target: '≤2 bug/sprint', realisasi: '1 bug/sprint', skor: 110, status: 'Di Atas Target' },
  { indikator: 'Timeliness', bobot: 20, target: '100% on-time', realisasi: '95% on-time', skor: 95, status: 'Sesuai Target' },
  { indikator: 'Code Review', bobot: 15, target: '5 review/minggu', realisasi: '6 review/minggu', skor: 120, status: 'Di Atas Target' },
  { indikator: 'Knowledge Sharing', bobot: 20, target: '2 sesi/bulan', realisasi: '2 sesi/bulan', skor: 100, status: 'Sesuai Target' },
]

const detailSkorTotal = detailKpiItems.reduce((sum, item) => sum + (item.skor * item.bobot / 100), 0)

// ── Mock Data: Ringkasan Per Departemen ──
const departemenSummary = [
  { departemen: 'Teknologi', jumlahKpi: 28, rataSkor: 98.5, persenDiAtas: 39 },
  { departemen: 'Produk', jumlahKpi: 15, rataSkor: 95.2, persenDiAtas: 33 },
  { departemen: 'SDM', jumlahKpi: 8, rataSkor: 93.1, persenDiAtas: 25 },
  { departemen: 'Keuangan', jumlahKpi: 12, rataSkor: 87.4, persenDiAtas: 17 },
  { departemen: 'Pemasaran', jumlahKpi: 10, rataSkor: 90.8, persenDiAtas: 20 },
]

export default function KpiMockup() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 1 — HR Core · US-HR-006" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">KPI Karyawan</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola Key Performance Indicator dan pantau pencapaian karyawan
          </p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-700">
          <Target className="mr-1.5 h-4 w-4" />
          Buat KPI Baru
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total KPI Aktif', value: '73', icon: Target, sub: 'periode Q1 2025', accent: 'text-zinc-600' },
          { label: 'Rata-rata Pencapaian', value: '94.2%', icon: TrendingUp, sub: 'dari seluruh karyawan', accent: 'text-blue-600' },
          { label: 'Di Bawah Target', value: '14', icon: ArrowDown, sub: '19.2% dari total', accent: 'text-red-600' },
          { label: 'Periode Aktif', value: 'Q1 2025', icon: Calendar, sub: 'Jan – Mar 2025', accent: 'text-zinc-600' },
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

      {/* ── Daftar KPI Karyawan ── */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center gap-1 border-b border-zinc-200">
            {['Daftar KPI Karyawan', 'Detail KPI Per Karyawan', 'Ringkasan Per Departemen'].map((tab, i) => (
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
              Section 1: Daftar KPI Karyawan
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-zinc-900">Daftar KPI Karyawan</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input placeholder="Cari karyawan..." className="w-48 pl-9" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-500">Periode: Q1 2025</span>
              </div>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">NIK</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Jabatan</th>
                    <th className="px-4 py-3">Departemen</th>
                    <th className="px-4 py-3 text-center">Target (%)</th>
                    <th className="px-4 py-3 text-center">Pencapaian (%)</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {kpiKaryawanData.map((row) => {
                    const statusInfo = kpiStatusMap[row.status]
                    return (
                      <tr key={row.nik} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.nik}</td>
                        <td className="px-4 py-3 font-medium text-zinc-900">{row.nama}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.jabatan}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.departemen}</td>
                        <td className="px-4 py-3 text-center text-zinc-600">{row.target}</td>
                        <td className={`px-4 py-3 text-center ${pencapaianColor(row.pencapaian)}`}>
                          {row.pencapaian}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusInfo?.variant || 'secondary'}>
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
              Section 2: Detail KPI Per Karyawan
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Detail KPI Per Karyawan</h3>
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
                  <Badge className="ml-auto bg-emerald-600 hover:bg-emerald-700">Di Atas Target</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Calendar className="h-4 w-4" />
                  <span>Periode: Q1 2025 (Januari – Maret)</span>
                </div>

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
                      {detailKpiItems.map((item) => (
                        <tr key={item.indikator} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-zinc-900">{item.indikator}</td>
                          <td className="px-4 py-3 text-center text-zinc-600">{item.bobot}</td>
                          <td className="px-4 py-3 text-zinc-600">{item.target}</td>
                          <td className="px-4 py-3 text-zinc-600">{item.realisasi}</td>
                          <td className={`px-4 py-3 text-center ${pencapaianColor(item.skor)}`}>
                            {item.skor}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={kpiStatusMap[item.status]?.variant || 'secondary'}>
                              {kpiStatusMap[item.status]?.label || item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-zinc-300 bg-zinc-50">
                        <td className="px-4 py-3 font-semibold text-zinc-900" colSpan={4}>Total Skor</td>
                        <td className="px-4 py-3 text-center font-bold text-lg text-zinc-900">{detailSkorTotal.toFixed(1)}</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-emerald-600 hover:bg-emerald-700">Di Atas Target</Badge>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Skor Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Pencapaian Keseluruhan</span>
                    <span className="font-medium text-emerald-700">{detailSkorTotal.toFixed(1)} / 100</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${Math.min(detailSkorTotal, 100)}%` }}
                    />
                  </div>
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
                    <th className="px-4 py-3 text-center">Jumlah KPI</th>
                    <th className="px-4 py-3 text-center">Rata-rata Skor</th>
                    <th className="px-4 py-3 text-center">% Di Atas Target</th>
                    <th className="px-4 py-3 text-right">Tren</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {departemenSummary.map((dept) => (
                    <tr key={dept.departemen} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900">{dept.departemen}</td>
                      <td className="px-4 py-3 text-center text-zinc-600">{dept.jumlahKpi}</td>
                      <td className={`px-4 py-3 text-center ${pencapaianColor(dept.rataSkor)}`}>
                        {dept.rataSkor}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-2 w-16 rounded-full bg-zinc-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${dept.persenDiAtas >= 30 ? 'bg-emerald-500' : dept.persenDiAtas >= 20 ? 'bg-blue-500' : 'bg-red-500'}`}
                              style={{ width: `${dept.persenDiAtas}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-500">{dept.persenDiAtas}%</span>
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