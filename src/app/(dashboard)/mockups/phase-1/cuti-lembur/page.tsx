import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  Plus,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Cuti & Lembur · Phase 1',
  description: 'Preview desain halaman Cuti & Lembur',
}

// ── Mock Data: Pengajuan Cuti ──
const pengajuanCutiData = [
  { nik: 'WS-2022-001', nama: 'Ahmad Rizal', jenisCuti: 'Tahunan', tglMulai: '21 Apr 2025', tglSelesai: '23 Apr 2025', hari: 3, alasan: 'Liburan keluarga ke Bandung', status: 'Pending', approver: 'Andi W. (HR)' },
  { nik: 'WS-2022-003', nama: 'Budi Santoso', jenisCuti: 'Sakit', tglMulai: '18 Apr 2025', tglSelesai: '18 Apr 2025', hari: 1, alasan: 'Demam tinggi, butuh istirahat', status: 'Pending', approver: 'Andi W. (HR)' },
  { nik: 'WS-2022-002', nama: 'Nina Sari', jenisCuti: 'Melahirkan', tglMulai: '1 Mar 2025', tglSelesai: '29 May 2025', hari: 90, alasan: 'Cuti melahirkan anak pertama', status: 'Approved', approver: 'Andi W. (HR)' },
  { nik: 'WS-2022-005', nama: 'Fajar Nugroho', jenisCuti: 'Tahunan', tglMulai: '7 Apr 2025', tglSelesai: '9 Apr 2025', hari: 3, alasan: 'Acara keluarga di Semarang', status: 'Approved', approver: 'Andi W. (HR)' },
  { nik: 'WS-2023-007', nama: 'Rudi Hartono', jenisCuti: 'Nikah', tglMulai: '14 Mar 2025', tglSelesai: '16 Mar 2025', hari: 3, alasan: 'Pernikahan adat Jawa', status: 'Rejected', approver: 'Andi W. (HR)' },
  { nik: 'WS-2023-008', nama: 'Sita Permata', jenisCuti: 'Duka', tglMulai: '3 Mar 2025', tglSelesai: '5 Mar 2025', hari: 3, alasan: 'Meninggal anggota keluarga', status: 'Cancelled', approver: '—' },
]

const cutiStatusMap: Record<string, { variant: 'default' | 'outline' | 'secondary' | 'destructive'; dotColor: string }> = {
  Pending: { variant: 'outline', dotColor: 'bg-amber-500' },
  Approved: { variant: 'default', dotColor: 'bg-emerald-500' },
  Rejected: { variant: 'destructive', dotColor: 'bg-red-500' },
  Cancelled: { variant: 'secondary', dotColor: 'bg-zinc-400' },
}

const jenisCutiColor: Record<string, string> = {
  Tahunan: 'bg-blue-50 text-blue-700 border-blue-200',
  Sakit: 'bg-rose-50 text-rose-700 border-rose-200',
  Melahirkan: 'bg-purple-50 text-purple-700 border-purple-200',
  Nikah: 'bg-amber-50 text-amber-700 border-amber-200',
  Duka: 'bg-zinc-100 text-zinc-700 border-zinc-300',
  Unpaid: 'bg-orange-50 text-orange-700 border-orange-200',
}

// ── Mock Data: Saldo Cuti ──
const saldoCutiData = [
  { karyawan: 'Ahmad Rizal', nik: 'WS-2022-001', cutiTahunanQuota: 12, cutiTahunanUsed: 9, cutiSakitQuota: '∞', cutiSakitUsed: 2, carryOver: 3 },
  { karyawan: 'Nina Sari', nik: 'WS-2022-002', cutiTahunanQuota: 12, cutiTahunanUsed: 12, cutiSakitQuota: '∞', cutiSakitUsed: 0, carryOver: 0 },
  { karyawan: 'Budi Santoso', nik: 'WS-2022-003', cutiTahunanQuota: 12, cutiTahunanUsed: 10, cutiSakitQuota: '∞', cutiSakitUsed: 5, carryOver: 2 },
  { karyawan: 'Putri Rahayu', nik: 'WS-2022-004', cutiTahunanQuota: 12, cutiTahunanUsed: 7, cutiSakitQuota: '∞', cutiSakitUsed: 1, carryOver: 4 },
  { karyawan: 'Fajar Nugroho', nik: 'WS-2022-005', cutiTahunanQuota: 12, cutiTahunanUsed: 11, cutiSakitQuota: '∞', cutiSakitUsed: 3, carryOver: 1 },
]

function balanceColor(balance: number): string {
  if (balance === 0) return 'text-red-600 font-semibold'
  if (balance <= 2) return 'text-amber-600 font-semibold'
  return 'text-emerald-600 font-medium'
}

function balanceBg(balance: number): string {
  if (balance === 0) return 'bg-red-50'
  if (balance <= 2) return 'bg-amber-50'
  return ''
}

// ── Mock Data: Pengajuan Lembur ──
// hourly rate = 1/173 × gaji pokok
const lemburData = [
  { nik: 'WS-2022-001', nama: 'Ahmad Rizal', tanggal: '18 Apr 2025', tipeHari: 'Weekday', jamMulai: '18:00', jamSelesai: '21:00', totalJam: 3, gajiPokok: 5200000, status: 'Pending' },
  { nik: 'WS-2022-003', nama: 'Budi Santoso', tanggal: '19 Apr 2025', tipeHari: 'Weekend', jamMulai: '09:00', jamSelesai: '14:00', totalJam: 5, gajiPokok: 4800000, status: 'Pending' },
  { nik: 'WS-2022-005', nama: 'Fajar Nugroho', tanggal: '15 Apr 2025', tipeHari: 'Weekday', jamMulai: '17:30', jamSelesai: '20:30', totalJam: 3.5, gajiPokok: 5500000, status: 'Approved' },
  { nik: 'WS-2022-002', nama: 'Nina Sari', tanggal: '12 Apr 2025', tipeHari: 'Weekday', jamMulai: '18:00', jamSelesai: '22:00', totalJam: 4, gajiPokok: 5200000, status: 'Paid' },
]

const lemburStatusMap: Record<string, { variant: 'default' | 'outline' | 'secondary' | 'destructive'; dotColor: string }> = {
  Pending: { variant: 'outline', dotColor: 'bg-amber-500' },
  Approved: { variant: 'default', dotColor: 'bg-emerald-500' },
  Paid: { variant: 'secondary', dotColor: 'bg-blue-500' },
}

const tipeHariBadge: Record<string, { label: string; cls: string; rate: string }> = {
  Weekday: { label: 'Weekday', cls: 'bg-blue-50 text-blue-700 border-blue-200', rate: '1.5×' },
  Weekend: { label: 'Weekend', cls: 'bg-purple-50 text-purple-700 border-purple-200', rate: '2.0×' },
  Libur: { label: 'Libur', cls: 'bg-red-50 text-red-700 border-red-200', rate: '2.0×' },
}

function computeOvertime(gajiPokok: number, totalJam: number, tipeHari: string): { hourlyRate: number; multiplier: number; upahPerJam: number; totalUpah: number } {
  const baseHourlyRate = gajiPokok / 173
  const multiplier = tipeHari === 'Weekday' ? 1.5 : 2.0
  const upahPerJam = baseHourlyRate * multiplier
  const totalUpah = upahPerJam * totalJam
  return { hourlyRate: baseHourlyRate, multiplier, upahPerJam, totalUpah }
}

function formatRupiah(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// ── Config: Jenis Cuti ──
const jenisCutiConfig = [
  { nama: 'Tahunan', quota: '12 hari', paid: true, carryOver: 'max 6', gender: null },
  { nama: 'Sakit', quota: 'Unlimited', paid: true, carryOver: null, gender: null },
  { nama: 'Melahirkan', quota: '90 hari', paid: true, carryOver: null, gender: 'P' },
  { nama: 'Hamil', quota: '45 hari', paid: true, carryOver: null, gender: 'P' },
  { nama: 'Nikah', quota: '3 hari', paid: true, carryOver: null, gender: null },
  { nama: 'Duka', quota: '3 hari', paid: true, carryOver: null, gender: null },
  { nama: 'Ibadah', quota: 'Unlimited', paid: true, carryOver: null, gender: null },
  { nama: 'Unpaid', quota: 'Unlimited', paid: false, carryOver: null, gender: null },
]

export default function CutiLemburMockup() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 1 — HR Core · US-HR-003" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Cuti &amp; Lembur</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola pengajuan cuti, saldo cuti karyawan, dan pengajuan lembur
          </p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-700">
          <Plus className="mr-1.5 h-4 w-4" />
          Ajukan Cuti
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Cuti Pending', value: '3', icon: Hourglass, sub: 'menunggu persetujuan', accent: 'text-amber-600' },
          { label: 'Cuti Approved Bulan Ini', value: '8', icon: CheckCircle2, sub: 'pengajuan disetujui', accent: 'text-emerald-600' },
          { label: 'Lembur Pending', value: '2', icon: Clock, sub: 'menunggu persetujuan', accent: 'text-blue-600' },
          { label: 'Total Jam Lembur Bulan Ini', value: '24.5', icon: CalendarDays, sub: 'jam dari semua karyawan', accent: 'text-purple-600' },
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

      {/* ── Tab-style Card ── */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center gap-1 border-b border-zinc-200">
            {['Pengajuan Cuti', 'Saldo Cuti', 'Pengajuan Lembur', 'Konfigurasi'].map((tab, i) => (
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
              Section 1: Pengajuan Cuti
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-zinc-900">Pengajuan Cuti</h3>
                <div className="relative">
                  <Input placeholder="Cari karyawan..." className="w-48 pl-3" />
                </div>
              </div>
              <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Ajukan Cuti Baru
              </Button>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">NIK</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Jenis Cuti</th>
                    <th className="px-4 py-3">Tanggal Mulai</th>
                    <th className="px-4 py-3">Tanggal Selesai</th>
                    <th className="px-4 py-3">Hari</th>
                    <th className="px-4 py-3">Alasan</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Approver</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {pengajuanCutiData.map((row) => {
                    const sInfo = cutiStatusMap[row.status]
                    return (
                      <tr key={`${row.nik}-${row.tglMulai}`} className={`hover:bg-zinc-50 transition-colors`}>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.nik}</td>
                        <td className="px-4 py-3 font-medium text-zinc-900">{row.nama}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${jenisCutiColor[row.jenisCuti] || 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                            {row.jenisCuti}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">{row.tglMulai}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.tglSelesai}</td>
                        <td className="px-4 py-3 text-zinc-900 font-medium">{row.hari}</td>
                        <td className="px-4 py-3 text-zinc-500 max-w-[200px] truncate">{row.alasan}</td>
                        <td className="px-4 py-3">
                          <Badge variant={sInfo?.variant || 'secondary'}>
                            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${sInfo?.dotColor}`} />
                            {row.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">{row.approver}</td>
                        <td className="px-4 py-3 text-right">
                          {row.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="outline" size="sm" className="h-7 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50">
                                <XCircle className="mr-1 h-3 w-3" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-400">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>Menampilkan 1–6 dari 6 pengajuan</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
                <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Section 2: Saldo Cuti
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-zinc-900">Saldo Cuti</h3>
                <div className="relative">
                  <Input placeholder="Cari karyawan..." className="w-48 pl-3" />
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" /> Sisa &gt; 2</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" /> Sisa ≤ 2</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" /> Sisa = 0</span>
              </div>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3" rowSpan={2}>Karyawan</th>
                    <th className="px-4 py-3 text-center" colSpan={3}>Cuti Tahunan</th>
                    <th className="px-4 py-3 text-center" colSpan={3}>Cuti Sakit</th>
                    <th className="px-4 py-3 text-center" rowSpan={2}>Carry Over</th>
                  </tr>
                  <tr className="border-b bg-zinc-50 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <th className="px-4 py-2 text-center">Quota</th>
                    <th className="px-4 py-2 text-center">Used</th>
                    <th className="px-4 py-2 text-center">Balance</th>
                    <th className="px-4 py-2 text-center">Quota</th>
                    <th className="px-4 py-2 text-center">Used</th>
                    <th className="px-4 py-2 text-center">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {saldoCutiData.map((row) => {
                    const tahunanBalance = row.cutiTahunanQuota - row.cutiTahunanUsed
                    const sakitBalance = row.cutiSakitQuota === '∞' ? Infinity : (Number(row.cutiSakitQuota) - row.cutiSakitUsed)
                    return (
                      <tr key={row.nik} className={`hover:bg-zinc-50 transition-colors ${balanceBg(tahunanBalance)}`}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-zinc-900">{row.karyawan}</p>
                          <p className="font-mono text-xs text-zinc-400">{row.nik}</p>
                        </td>
                        <td className="px-4 py-3 text-center text-zinc-600">{row.cutiTahunanQuota}</td>
                        <td className="px-4 py-3 text-center text-zinc-600">{row.cutiTahunanUsed}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={balanceColor(tahunanBalance)}>{tahunanBalance}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-zinc-600">∞</td>
                        <td className="px-4 py-3 text-center text-zinc-600">{row.cutiSakitUsed}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-emerald-600 font-medium">∞</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={balanceColor(row.carryOver)}>{row.carryOver}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>Menampilkan 1–5 dari 5 karyawan</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
                <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Section 3: Pengajuan Lembur
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-zinc-900">Pengajuan Lembur</h3>
                <div className="relative">
                  <Input placeholder="Cari karyawan..." className="w-48 pl-3" />
                </div>
              </div>
              <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Ajukan Lembur
              </Button>
            </div>

            {/* Computation hint */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
              <strong>Rumus Upah Lembur:</strong> Upah/Jam = <span className="font-mono">1/173 × Gaji Pokok</span> × Multiplier.
              {' '}Weekday jam ke-1: <Badge className="ml-0.5 text-[10px] h-4 bg-blue-100 text-blue-700 border-blue-200" variant="outline">1.5×</Badge>,
              {' '}jam ke-2+: <Badge className="ml-0.5 text-[10px] h-4 bg-indigo-100 text-indigo-700 border-indigo-200" variant="outline">2.0×</Badge>,
              {' '}Weekend/Libur: <Badge className="ml-0.5 text-[10px] h-4 bg-purple-100 text-purple-700 border-purple-200" variant="outline">2.0×</Badge>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">NIK</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Tipe Hari</th>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Total Jam</th>
                    <th className="px-4 py-3">Upah/Jam</th>
                    <th className="px-4 py-3">Total Upah</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {lemburData.map((row) => {
                    const { upahPerJam, totalUpah, multiplier } = computeOvertime(row.gajiPokok, row.totalJam, row.tipeHari)
                    const sInfo = lemburStatusMap[row.status]
                    const tHari = tipeHariBadge[row.tipeHari]
                    return (
                      <tr key={`${row.nik}-${row.tanggal}`} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.nik}</td>
                        <td className="px-4 py-3 font-medium text-zinc-900">{row.nama}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.tanggal}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${tHari?.cls}`}>
                            {tHari?.label}
                            <span className="font-mono text-[10px] opacity-70">{tHari?.rate}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-600">
                          {row.jamMulai}–{row.jamSelesai}
                        </td>
                        <td className="px-4 py-3 text-zinc-900 font-medium">{row.totalJam}</td>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-600">
                          <span className="block text-[10px] text-zinc-400">1/173 × {formatRupiah(row.gajiPokok).replace('Rp ', '')} × {multiplier}×</span>
                          {formatRupiah(Math.round(upahPerJam))}
                        </td>
                        <td className="px-4 py-3 font-semibold text-zinc-900">{formatRupiah(Math.round(totalUpah))}</td>
                        <td className="px-4 py-3">
                          <Badge variant={sInfo?.variant || 'secondary'}>
                            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${sInfo?.dotColor}`} />
                            {row.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {row.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="outline" size="sm" className="h-7 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50">
                                <XCircle className="mr-1 h-3 w-3" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-400">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>Menampilkan 1–4 dari 4 pengajuan</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
                <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Section 4: Konfigurasi (read-only)
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Konfigurasi</h3>
              <Badge variant="outline" className="text-xs text-zinc-500">Read-only Preview</Badge>
            </div>

            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-base">Jenis Cuti</CardTitle>
                <CardDescription>Daftar jenis cuti yang tersedia dalam sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {jenisCutiConfig.map((jenis) => (
                    <div
                      key={jenis.nama}
                      className="rounded-lg border border-zinc-200 bg-white p-4 space-y-2 hover:border-zinc-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-zinc-900">{jenis.nama}</h4>
                        {jenis.paid ? (
                          <Badge className="text-[10px] h-4 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" variant="outline">Berbayar</Badge>
                        ) : (
                          <Badge className="text-[10px] h-4 bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50" variant="outline">Unpaid</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge className="text-[10px] h-4 bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-100" variant="outline">
                          {jenis.quota}
                        </Badge>
                        {jenis.carryOver && (
                          <Badge className="text-[10px] h-4 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50" variant="outline">
                            Carry over {jenis.carryOver}
                          </Badge>
                        )}
                        {jenis.gender && (
                          <Badge className="text-[10px] h-4 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50" variant="outline">
                            {jenis.gender === 'P' ? 'Perempuan' : 'Laki-laki'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}