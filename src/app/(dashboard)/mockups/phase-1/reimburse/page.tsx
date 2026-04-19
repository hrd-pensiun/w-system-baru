import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Receipt,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  XCircle,
  Plane,
  AlertTriangle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Reimburse & Perdin · Phase 1',
  description: 'Preview desain halaman Reimburse & Perjalanan Dinas',
}

// ── Mock Data: Pengajuan Reimburse ──
const reimburseData = [
  { no: 1, karyawan: 'Ahmad Rizal', kategori: 'Medis', deskripsi: 'Pemeriksaan dokter gigi & obat', tanggal: '10 Apr 2025', jumlah: 850000, status: 'Pending', approver: 'Andi W. (HR)' },
  { no: 2, karyawan: 'Nina Sari', kategori: 'Transport', deskripsi: 'Taxi bandara Soekarno-Hatta PP', tanggal: '8 Apr 2025', jumlah: 450000, status: 'Pending', approver: 'Andi W. (HR)' },
  { no: 3, karyawan: 'Budi Santoso', kategori: 'Makan', deskripsi: 'Makan siang meeting klien PT Maju', tanggal: '5 Apr 2025', jumlah: 275000, status: 'Approved', approver: 'Andi W. (HR)' },
  { no: 4, karyawan: 'Putri Rahayu', kategori: 'Medis', deskripsi: 'Rawat jalan RS Bunda — lab & konsultasi', tanggal: '3 Apr 2025', jumlah: 1500000, status: 'Approved', approver: 'Andi W. (HR)' },
  { no: 5, karyawan: 'Fajar Nugroho', kategori: 'Transport', deskripsi: 'Sewa kendaraan dinas ke Surabaya', tanggal: '28 Mar 2025', jumlah: 2200000, status: 'Rejected', approver: 'Andi W. (HR)' },
  { no: 6, karyawan: 'Rudi Hartono', kategori: 'Lainnya', deskripsi: 'Pulsa & internet kerja remote 1 bulan', tanggal: '25 Mar 2025', jumlah: 350000, status: 'Paid', approver: 'Sari D. (Finance)' },
  { no: 7, karyawan: 'Sita Permata', kategori: 'Makan', deskripsi: 'Catering workshop tim internal', tanggal: '20 Mar 2025', jumlah: 1800000, status: 'Paid', approver: 'Sari D. (Finance)' },
  { no: 8, karyawan: 'Agus Pratama', kategori: 'Transport', deskripsi: 'Parkir & tol perjalanan klien Jakarta', tanggal: '15 Mar 2025', jumlah: 420000, status: 'Approved', approver: 'Andi W. (HR)' },
]

const reimburseStatusMap: Record<string, { variant: 'default' | 'outline' | 'secondary' | 'destructive'; dotColor: string }> = {
  Pending: { variant: 'outline', dotColor: 'bg-amber-500' },
  Approved: { variant: 'default', dotColor: 'bg-emerald-500' },
  Rejected: { variant: 'destructive', dotColor: 'bg-red-500' },
  Paid: { variant: 'secondary', dotColor: 'bg-blue-500' },
}

const kategoriColor: Record<string, string> = {
  Medis: 'bg-rose-50 text-rose-700 border-rose-200',
  Transport: 'bg-blue-50 text-blue-700 border-blue-200',
  Makan: 'bg-amber-50 text-amber-700 border-amber-200',
  Lainnya: 'bg-zinc-100 text-zinc-700 border-zinc-300',
}

// ── Mock Data: Perjalanan Dinas ──
const perdinData = [
  { no: 1, karyawan: 'Ahmad Rizal', tujuan: 'Surabaya', tglBerangkat: '14 Apr 2025', tglKembali: '16 Apr 2025', budget: 5000000, realisasi: 4800000, status: 'Approved' },
  { no: 2, karyawan: 'Nina Sari', tujuan: 'Bandung', tglBerangkat: '21 Apr 2025', tglKembali: '22 Apr 2025', budget: 2500000, realisasi: 0, status: 'Draft' },
  { no: 3, karyawan: 'Budi Santoso', tujuan: 'Semarang', tglBerangkat: '7 Apr 2025', tglKembali: '9 Apr 2025', budget: 4500000, realisasi: 4200000, status: 'Selesai' },
  { no: 4, karyawan: 'Fajar Nugroho', tujuan: 'Yogyakarta', tglBerangkat: '1 Apr 2025', tglKembali: '3 Apr 2025', budget: 3500000, realisasi: 4100000, status: 'Selesai' },
  { no: 5, karyawan: 'Rudi Hartono', tujuan: 'Bali', tglBerangkat: '25 Mar 2025', tglKembali: '28 Mar 2025', budget: 7000000, realisasi: 0, status: 'Dibatalkan' },
  { no: 6, karyawan: 'Putri Rahayu', tujuan: 'Medan', tglBerangkat: '10 Mar 2025', tglKembali: '13 Mar 2025', budget: 8000000, realisasi: 7700000, status: 'Selesai' },
]

const perdinStatusMap: Record<string, { variant: 'default' | 'outline' | 'secondary' | 'destructive'; dotColor: string }> = {
  Draft: { variant: 'outline', dotColor: 'bg-zinc-400' },
  Approved: { variant: 'default', dotColor: 'bg-emerald-500' },
  Selesai: { variant: 'secondary', dotColor: 'bg-blue-500' },
  Dibatalkan: { variant: 'destructive', dotColor: 'bg-red-500' },
}

// ── Mock Data: Ringkasan Budget Perdin ──
const budgetSummaryData = [
  { karyawan: 'Ahmad Rizal', dept: 'Engineering', budget: 5000000, realisasi: 4800000 },
  { karyawan: 'Budi Santoso', dept: 'Marketing', budget: 4500000, realisasi: 4200000 },
  { karyawan: 'Fajar Nugroho', dept: 'Sales', budget: 3500000, realisasi: 4100000 },
  { karyawan: 'Putri Rahayu', dept: 'HR', budget: 8000000, realisasi: 7700000 },
  { karyawan: 'Rudi Hartono', dept: 'Finance', budget: 7000000, realisasi: 0 },
]

function formatRupiah(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function overBudgetColor(budget: number, realisasi: number): string {
  if (realisasi === 0) return 'text-zinc-400'
  if (realisasi > budget) return 'text-red-600 font-semibold'
  return 'text-emerald-600 font-medium'
}

export default function ReimbursePerdinMockup() {
  // Compute metrics
  const totalPengajuan = reimburseData.length + perdinData.length
  const menungguApproval = reimburseData.filter(r => r.status === 'Pending').length + perdinData.filter(p => p.status === 'Draft' || p.status === 'Approved').length
  const disetujuiBulanIni = reimburseData.filter(r => r.status === 'Approved' || r.status === 'Paid').length
  const totalReimburse = reimburseData.filter(r => r.status === 'Approved' || r.status === 'Paid').reduce((s, r) => s + r.jumlah, 0)

  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 1 — HR Core · US-HR-005" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Reimburse &amp; Perjalanan Dinas</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola klaim reimbursement dan perjalanan dinas karyawan
          </p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-700">
          <Plus className="mr-1.5 h-4 w-4" />
          Ajukan Reimburse
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Pengajuan', value: String(totalPengajuan), icon: Receipt, sub: 'reimburse & perdin', accent: 'text-zinc-600' },
          { label: 'Menunggu Approval', value: String(menungguApproval), icon: Clock, sub: 'menunggu persetujuan', accent: 'text-amber-600' },
          { label: 'Disetujui Bulan Ini', value: String(disetujuiBulanIni), icon: CheckCircle2, sub: 'pengajuan disetujui', accent: 'text-emerald-600' },
          { label: 'Total Reimburse Bulan Ini', value: formatRupiah(totalReimburse), icon: DollarSign, sub: 'nilai yang disetujui', accent: 'text-blue-600' },
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

      {/* ── Section 1: Pengajuan Reimburse ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pengajuan Reimburse</CardTitle>
          <CardDescription>Daftar klaim reimbursement karyawan</CardDescription>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4">
            <div className="relative">
              <Input placeholder="Cari karyawan..." className="w-56 pl-3" />
            </div>
            <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Ajukan Reimburse Baru
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Karyawan</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Deskripsi</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Jumlah</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Approver</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {reimburseData.map((row) => {
                  const sInfo = reimburseStatusMap[row.status]
                  return (
                    <tr key={row.no} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 text-zinc-500">{row.no}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{row.karyawan}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${kategoriColor[row.kategori] || 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                          {row.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 max-w-[220px] truncate">{row.deskripsi}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.tanggal}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-zinc-900">{formatRupiah(row.jumlah)}</td>
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

          <div className="flex items-center justify-between text-sm text-zinc-500 mt-4">
            <span>Menampilkan 1–8 dari 8 pengajuan</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
              <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 2: Perjalanan Dinas ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Perjalanan Dinas</CardTitle>
          <CardDescription>Daftar perjalanan dinas karyawan</CardDescription>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Input placeholder="Cari karyawan..." className="w-56 pl-3" />
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" /> Over Budget
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" /> Dalam Budget
                </span>
              </div>
            </div>
            <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700">
              <Plane className="mr-1.5 h-3.5 w-3.5" />
              Ajukan Perdin Baru
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Karyawan</th>
                  <th className="px-4 py-3">Tujuan</th>
                  <th className="px-4 py-3">Tgl Berangkat</th>
                  <th className="px-4 py-3">Tgl Kembali</th>
                  <th className="px-4 py-3 text-right">Budget</th>
                  <th className="px-4 py-3 text-right">Realisasi</th>
                  <th className="px-4 py-3">Selisih</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {perdinData.map((row) => {
                  const sInfo = perdinStatusMap[row.status]
                  const selisih = row.realisasi - row.budget
                  const isOver = row.realisasi > 0 && row.realisasi > row.budget
                  return (
                    <tr key={row.no} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 text-zinc-500">{row.no}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{row.karyawan}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.tujuan}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.tglBerangkat}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.tglKembali}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-zinc-900">{formatRupiah(row.budget)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-zinc-900">
                        {row.realisasi === 0 ? '—' : formatRupiah(row.realisasi)}
                      </td>
                      <td className="px-4 py-3">
                        {row.realisasi === 0 ? (
                          <span className="text-xs text-zinc-400">—</span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                            {isOver && <AlertTriangle className="h-3 w-3" />}
                            {isOver ? '+' : ''}{formatRupiah(Math.abs(selisih))}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={sInfo?.variant || 'secondary'}>
                          <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${sInfo?.dotColor}`} />
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-zinc-500 mt-4">
            <span>Menampilkan 1–6 dari 6 perjalanan dinas</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
              <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 3: Ringkasan Budget Perdin ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ringkasan Budget Perdin</CardTitle>
          <CardDescription>Perbandingan budget vs realisasi per karyawan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {budgetSummaryData.map((row) => {
              const isOver = row.realisasi > row.budget
              const budgetPct = 100
              const realisasiPct = row.realisasi === 0 ? 0 : Math.min(Math.round((row.realisasi / row.budget) * 100), 100)
              const overflowPct = row.realisasi > row.budget ? Math.round(((row.realisasi - row.budget) / row.budget) * 100) : 0

              return (
                <div key={row.karyawan} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-zinc-900">{row.karyawan}</span>
                      <span className="ml-2 text-xs text-zinc-400">{row.dept}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-zinc-500">
                        Realisasi: <span className={overBudgetColor(row.budget, row.realisasi)}>{row.realisasi === 0 ? '—' : formatRupiah(row.realisasi)}</span>
                      </span>
                      <span className="text-zinc-400">|</span>
                      <span className="text-zinc-500">Budget: <span className="font-medium text-zinc-700">{formatRupiah(row.budget)}</span></span>
                      {isOver && (
                        <Badge variant="destructive" className="text-[10px] h-4">
                          <AlertTriangle className="mr-0.5 h-2.5 w-2.5" />
                          +{overflowPct}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="relative h-5 w-full rounded-full bg-zinc-100 overflow-hidden">
                    {/* Budget bar (full width) */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-zinc-200"
                      style={{ width: `${budgetPct}%` }}
                    />
                    {/* Realisasi bar */}
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all ${isOver ? 'bg-red-400' : row.realisasi === 0 ? 'bg-zinc-300' : 'bg-emerald-400'}`}
                      style={{ width: `${realisasiPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex items-center gap-6 text-xs text-zinc-500 border-t border-zinc-100 pt-4">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-6 rounded-full bg-zinc-200" /> Budget
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-6 rounded-full bg-emerald-400" /> Realisasi (dalam budget)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-6 rounded-full bg-red-400" /> Realisasi (over budget)
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}