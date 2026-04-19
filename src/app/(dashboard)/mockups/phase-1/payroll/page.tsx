import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DollarSign,
  Users,
  Wallet,
  AlertCircle,
  ChevronDown,
  Printer,
  Download,
  CheckCircle2,
  Search,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Payroll & THR · Phase 1',
  description: 'Preview desain halaman Payroll & THR',
}

// ── Mock Data: Periode Payroll ──
const periodiData = [
  {
    bulanTahun: 'April 2025',
    entity: 'PT W.System Indonesia',
    judul: 'Gaji April 2025',
    status: 'Draft',
    tanggalBayar: '—',
    karyawan: '—',
    totalBruto: '—',
  },
  {
    bulanTahun: 'Maret 2025',
    entity: 'PT W.System Indonesia',
    judul: 'Gaji Maret 2025',
    status: 'Approved',
    tanggalBayar: '31 Mar 2025',
    karyawan: '8',
    totalBruto: 'Rp156.500.000',
  },
  {
    bulanTahun: 'Februari 2025',
    entity: 'PT W.System Indonesia',
    judul: 'Gaji Februari 2025',
    status: 'Paid',
    tanggalBayar: '28 Feb 2025',
    karyawan: '8',
    totalBruto: 'Rp152.300.000',
  },
  {
    bulanTahun: 'Januari 2025',
    entity: 'PT W.System Indonesia',
    judul: 'Gaji Januari 2025',
    status: 'Paid',
    tanggalBayar: '31 Jan 2025',
    karyawan: '7',
    totalBruto: 'Rp138.700.000',
  },
]

const payrollStatusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive' }> = {
  Draft: { label: 'Draft', variant: 'outline' },
  Processing: { label: 'Processing', variant: 'secondary' },
  Approved: { label: 'Approved', variant: 'default' },
  Paid: { label: 'Paid', variant: 'secondary' },
  Cancelled: { label: 'Cancelled', variant: 'destructive' },
}

// ── Mock Data: Konfigurasi Gaji ──
const konfigurasiData = [
  { nama: 'Ahmad Rizal', gradeStep: 'M1/3', gajiPokok: 'Rp15.000.000', metodePajak: 'Gross', ptkpStatus: 'TK/0', bpjs: 'Ya' },
  { nama: 'Nina Sari', gradeStep: 'M2/1', gajiPokok: 'Rp18.000.000', metodePajak: 'Gross Up', ptkpStatus: 'K/1', bpjs: 'Ya' },
  { nama: 'Budi Santoso', gradeStep: 'S1/4', gajiPokok: 'Rp10.000.000', metodePajak: 'TER', ptkpStatus: 'K/2', bpjs: 'Ya' },
  { nama: 'Putri Rahayu', gradeStep: 'S1/2', gajiPokok: 'Rp12.000.000', metodePajak: 'Gross', ptkpStatus: 'TK/0', bpjs: 'Ya' },
  { nama: 'Fajar Nugroho', gradeStep: 'S2/1', gajiPokok: 'Rp9.000.000', metodePajak: 'TER', ptkpStatus: 'K/3', bpjs: 'Tidak' },
]

// ── Mock Data: THR ──
const thrData = [
  { karyawan: 'Ahmad Rizal', masaKerja: '3 tahun', gajiPokok: 'Rp15.000.000', thr: 'Rp15.000.000', pph21Thr: 'Rp750.000', thrNetto: 'Rp14.250.000', status: 'Paid' },
  { karyawan: 'Nina Sari', masaKerja: '5 tahun', gajiPokok: 'Rp18.000.000', thr: 'Rp18.000.000', pph21Thr: 'Rp900.000', thrNetto: 'Rp17.100.000', status: 'Paid' },
  { karyawan: 'Budi Santoso', masaKerja: '1 tahun', gajiPokok: 'Rp10.000.000', thr: 'Rp10.000.000', pph21Thr: 'Rp50.000', thrNetto: 'Rp9.950.000', status: 'Draft' },
  { karyawan: 'Putri Rahayu', masaKerja: '2 tahun', gajiPokok: 'Rp12.000.000', thr: 'Rp12.000.000', pph21Thr: 'Rp600.000', thrNetto: 'Rp11.400.000', status: 'Draft' },
]

const thrStatusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive' }> = {
  Draft: { label: 'Draft', variant: 'outline' },
  Paid: { label: 'Paid', variant: 'secondary' },
}

export default function PayrollMockup() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 1 — HR Core · US-HR-001" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Payroll &amp; THR</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola periode payroll, slip gaji, konfigurasi gaji, dan THR
          </p>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Gaji Bulan Ini', value: 'Rp156.500.000', icon: DollarSign, sub: 'Maret 2025' },
          { label: 'Karyawan Diproses', value: '8', icon: Users, sub: 'karyawan aktif' },
          { label: 'Rata-rata THP', value: 'Rp19.562.500', icon: Wallet, sub: 'per karyawan' },
          { label: 'Payroll Belum Digenerate', value: '1', icon: AlertCircle, sub: 'April 2025' },
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
            {['Periode Payroll', 'Slip Gaji', 'Konfigurasi Gaji', 'THR'].map((tab, i) => (
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
        <CardContent className="pt-6 space-y-8">

          {/* ═══════════════════════════════════════════
              Section 1: Periode Payroll
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-zinc-900">Periode Payroll</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input placeholder="Cari periode..." className="w-48 pl-9" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700">
                  <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                  Generate Payroll
                </Button>
              </div>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Bulan/Tahun</th>
                    <th className="px-4 py-3">Entity</th>
                    <th className="px-4 py-3">Judul</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Tanggal Bayar</th>
                    <th className="px-4 py-3 text-center">Karyawan</th>
                    <th className="px-4 py-3 text-right">Total Bruto</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {periodiData.map((row) => (
                    <tr key={row.bulanTahun} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900">{row.bulanTahun}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.entity}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.judul}</td>
                      <td className="px-4 py-3">
                        <Badge variant={payrollStatusMap[row.status]?.variant || 'secondary'}>
                          {payrollStatusMap[row.status]?.label || row.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-500">{row.tanggalBayar}</td>
                      <td className="px-4 py-3 text-center text-zinc-600">{row.karyawan}</td>
                      <td className="px-4 py-3 text-right text-zinc-600">{row.totalBruto}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {row.status === 'Draft' && (
                            <Button variant="outline" size="sm" className="text-xs">
                              Generate Payroll
                            </Button>
                          )}
                          {row.status === 'Approved' && (
                            <Button variant="outline" size="sm" className="text-xs">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Approve
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-xs">
                            Lihat Detail
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Section 2: Slip Gaji
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Slip Gaji</h3>
            </div>

            {/* Expandable slip card */}
            <Card className="rounded-xl border border-zinc-200 bg-white shadow-sm">
              <CardContent className="p-0">
                {/* Slip header toggle */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-600">
                      AR
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">Ahmad Rizal</p>
                      <p className="text-xs text-zinc-400">Maret 2025 · M1/3</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Printer className="mr-1 h-3.5 w-3.5" />
                      Cetak
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Download className="mr-1 h-3.5 w-3.5" />
                      Unduh PDF
                    </Button>
                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                  </div>
                </div>

                {/* Slip body */}
                <div className="px-6 py-5 space-y-5">
                  {/* Employee info header */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
                    <div>
                      <span className="text-xs text-zinc-400">Nama Karyawan</span>
                      <p className="font-medium text-zinc-900">Ahmad Rizal</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400">NIK</span>
                      <p className="font-medium text-zinc-900">WS-2022-001</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400">Jabatan</span>
                      <p className="font-medium text-zinc-900">Frontend Developer</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400">Departemen</span>
                      <p className="font-medium text-zinc-900">Engineering</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400">Periode</span>
                      <p className="font-medium text-zinc-900">Maret 2025</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400">Metode PPh</span>
                      <Badge variant="outline" className="text-xs">Gross</Badge>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-zinc-200" />

                  {/* Two columns: Pendapatan & Potongan */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* PENDAPATAN */}
                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Pendapatan
                      </h4>
                      <div className="space-y-2">
                        {[
                          { label: 'Gaji Pokok', value: 'Rp15.000.000' },
                          { label: 'Tunjangan Jabatan', value: 'Rp2.000.000' },
                          { label: 'Tunjangan Transport', value: 'Rp500.000' },
                          { label: 'Tunjangan Makan', value: 'Rp750.000' },
                          { label: 'Lembur', value: 'Rp450.000' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between text-sm">
                            <span className="text-zinc-600">{item.label}</span>
                            <span className="font-medium text-zinc-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3 text-sm font-semibold">
                        <span className="text-zinc-700">Total Pendapatan</span>
                        <span className="text-zinc-900">Rp18.700.000</span>
                      </div>
                    </div>

                    {/* POTONGAN */}
                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Potongan
                      </h4>
                      <div className="space-y-2">
                        {[
                          { label: 'JHT Karyawan 2%', value: 'Rp300.000' },
                          { label: 'JP Karyawan 1%', value: 'Rp150.000' },
                          { label: 'BPJS Kes 1%', value: 'Rp150.000' },
                          { label: 'PPh 21', value: 'Rp1.230.000' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between text-sm">
                            <span className="text-zinc-600">{item.label}</span>
                            <span className="font-medium text-red-600">–{item.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3 text-sm font-semibold">
                        <span className="text-zinc-700">Total Potongan</span>
                        <span className="text-red-600">–Rp1.830.000</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-zinc-200" />

                  {/* THP */}
                  <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-zinc-700">THP (Take Home Pay)</p>
                      <p className="text-xs text-zinc-400">Gaji bersih setelah potongan</p>
                    </div>
                    <p className="text-2xl font-bold text-zinc-900">Rp16.870.000</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ═══════════════════════════════════════════
              Section 3: Konfigurasi Gaji
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Konfigurasi Gaji</h3>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Nama Karyawan</th>
                    <th className="px-4 py-3">Grade/Step</th>
                    <th className="px-4 py-3 text-right">Gaji Pokok</th>
                    <th className="px-4 py-3">Metode Pajak</th>
                    <th className="px-4 py-3">PTKP Status</th>
                    <th className="px-4 py-3 text-center">BPJS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {konfigurasiData.map((row) => (
                    <tr key={row.nama} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900">{row.nama}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.gradeStep}</td>
                      <td className="px-4 py-3 text-right text-zinc-600">{row.gajiPokok}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {row.metodePajak}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{row.ptkpStatus}</td>
                      <td className="px-4 py-3 text-center">
                        {row.bpjs === 'Ya' ? (
                          <CheckCircle2 className="inline-block h-4 w-4 text-emerald-500" />
                        ) : (
                          <span className="text-xs text-zinc-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Section 4: THR
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">THR (Tunjangan Hari Raya)</h3>
              <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700">
                <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                Generate THR
              </Button>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Karyawan</th>
                    <th className="px-4 py-3">Masa Kerja</th>
                    <th className="px-4 py-3 text-right">Gaji Pokok</th>
                    <th className="px-4 py-3 text-right">THR</th>
                    <th className="px-4 py-3 text-right">PPh 21 THR</th>
                    <th className="px-4 py-3 text-right">THR Netto</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {thrData.map((row) => (
                    <tr key={row.karyawan} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900">{row.karyawan}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.masaKerja}</td>
                      <td className="px-4 py-3 text-right text-zinc-600">{row.gajiPokok}</td>
                      <td className="px-4 py-3 text-right text-zinc-600">{row.thr}</td>
                      <td className="px-4 py-3 text-right text-red-600">–{row.pph21Thr}</td>
                      <td className="px-4 py-3 text-right font-medium text-zinc-900">{row.thrNetto}</td>
                      <td className="px-4 py-3">
                        <Badge variant={thrStatusMap[row.status]?.variant || 'secondary'}>
                          {thrStatusMap[row.status]?.label || row.status}
                        </Badge>
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