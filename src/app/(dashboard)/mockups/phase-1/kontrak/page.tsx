import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FileText,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Plus,
  Bell,
  RefreshCcw,
  Send,
  Eye,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Kontrak & Alert · Phase 1',
  description: 'Preview desain halaman Kontrak & Alert',
}

// ── Mock Data: Daftar Kontrak Karyawan ──
const kontrakData = [
  { nik: 'WS-2022-001', nama: 'Ahmad Rizal', tipeKontrak: 'PKWTT', tglMulai: '1 Jan 2024', tglBerakhir: '31 Des 2026', sisaHari: 618, status: 'Aktif' },
  { nik: 'WS-2022-002', nama: 'Nina Sari', tipeKontrak: 'PKWTT', tglMulai: '15 Mar 2023', tglBerakhir: '14 Mar 2028', sisaHari: 703, status: 'Aktif' },
  { nik: 'WS-2022-003', nama: 'Budi Santoso', tipeKontrak: 'Kontrak', tglMulai: '1 Jun 2025', tglBerakhir: '30 Nov 2025', sisaHari: 15, status: 'Hampir Berakhir' },
  { nik: 'WS-2022-004', nama: 'Putri Rahayu', tipeKontrak: 'Kontrak', tglMulai: '1 Oct 2024', tglBerakhir: '20 May 2025', sisaHari: 5, status: 'Hampir Berakhir' },
  { nik: 'WS-2022-005', nama: 'Fajar Nugroho', tipeKontrak: 'PKWT', tglMulai: '1 Apr 2024', tglBerakhir: '31 Mar 2025', sisaHari: -19, status: 'Berakhir' },
  { nik: 'WS-2023-006', nama: 'Dewi Lestari', tipeKontrak: 'PKWTT', tglMulai: '1 Jul 2023', tglBerakhir: '30 Jun 2028', sisaHari: 1162, status: 'Aktif' },
  { nik: 'WS-2023-007', nama: 'Rudi Hartono', tipeKontrak: 'Kontrak', tglMulai: '1 Jan 2025', tglBerakhir: '31 Dec 2025', sisaHari: 246, status: 'Aktif' },
  { nik: 'WS-2023-008', nama: 'Sita Permata', tipeKontrak: 'PKWT', tglMulai: '1 Sep 2024', tglBerakhir: '28 Feb 2025', sisaHari: -50, status: 'Berakhir' },
]

const kontrakStatusMap: Record<string, { variant: 'default' | 'outline' | 'secondary' | 'destructive'; dotColor: string }> = {
  'Aktif': { variant: 'default', dotColor: 'bg-emerald-500' },
  'Hampir Berakhir': { variant: 'outline', dotColor: 'bg-amber-500' },
  'Berakhir': { variant: 'destructive', dotColor: 'bg-red-500' },
}

const tipeKontrakBadge: Record<string, string> = {
  PKWTT: 'bg-blue-50 text-blue-700 border-blue-200',
  PKWT: 'bg-purple-50 text-purple-700 border-purple-200',
  Kontrak: 'bg-amber-50 text-amber-700 border-amber-200',
}

function sisaHariColor(sisa: number): string {
  if (sisa < 0) return 'text-red-600 font-semibold'
  if (sisa < 7) return 'text-red-600 font-semibold'
  if (sisa <= 30) return 'text-amber-600 font-semibold'
  return 'text-emerald-600 font-medium'
}

function sisaHariBg(sisa: number): string {
  if (sisa < 0) return 'bg-red-50'
  if (sisa < 7) return 'bg-red-50'
  if (sisa <= 30) return 'bg-amber-50'
  return ''
}

function formatSisaHari(sisa: number): string {
  if (sisa < 0) return `${Math.abs(sisa)} hari lalu`
  return `${sisa} hari`
}

// ── Mock Data: Alert Kontrak Berakhir ──
const alertData = [
  { nama: 'Budi Santoso', nik: 'WS-2022-003', tipeKontrak: 'Kontrak', tglBerakhir: '30 Nov 2025', sisaHari: 15, urgency: 'warning' },
  { nama: 'Putri Rahayu', nik: 'WS-2022-004', tipeKontrak: 'Kontrak', tglBerakhir: '20 May 2025', sisaHari: 5, urgency: 'critical' },
  { nama: 'Fajar Nugroho', nik: 'WS-2022-005', tipeKontrak: 'PKWT', tglBerakhir: '31 Mar 2025', sisaHari: -19, urgency: 'expired' },
  { nama: 'Sita Permata', nik: 'WS-2023-008', tipeKontrak: 'PKWT', tglBerakhir: '28 Feb 2025', sisaHari: -50, urgency: 'expired' },
]

const urgencyStyle: Record<string, { bg: string; border: string; icon: typeof AlertTriangle }> = {
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle },
  critical: { bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle },
  expired: { bg: 'bg-red-50', border: 'border-red-300', icon: XCircle },
}

// ── Mock Data: Riwayat Perpanjangan ──
const riwayatData = [
  { nama: 'Ahmad Rizal', nik: 'WS-2022-001', kontrakAsal: 'PKWT', tglBerakhirLama: '31 Des 2023', kontrakBaru: 'PKWTT', tglMulaiBaru: '1 Jan 2024', disetujuiOleh: 'Andi W. (HR)', tanggal: '20 Dec 2023' },
  { nama: 'Nina Sari', nik: 'WS-2022-002', kontrakAsal: 'PKWT', tglBerakhirLama: '14 Mar 2025', kontrakBaru: 'PKWTT', tglMulaiBaru: '15 Mar 2023', disetujuiOleh: 'Andi W. (HR)', tanggal: '1 Mar 2023' },
  { nama: 'Budi Santoso', nik: 'WS-2022-003', kontrakAsal: 'Kontrak', tglBerakhirLama: '31 May 2025', kontrakBaru: 'Kontrak', tglMulaiBaru: '1 Jun 2025', disetujuiOleh: 'Rina S. (HRD)', tanggal: '20 May 2025' },
  { nama: 'Dewi Lestari', nik: 'WS-2023-006', kontrakAsal: 'PKWT', tglBerakhirLama: '30 Jun 2025', kontrakBaru: 'PKWTT', tglMulaiBaru: '1 Jul 2023', disetujuiOleh: 'Andi W. (HR)', tanggal: '15 Jun 2023' },
]

export default function KontrakAlertMockup() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 1 — HR Core · US-HR-004" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Kontrak &amp; Alert</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola kontrak karyawan dan notifikasi masa berakhir kontrak
          </p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-700">
          <Plus className="mr-1.5 h-4 w-4" />
          Tambah Kontrak
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Kontrak Aktif', value: '5', icon: FileText, sub: 'kontrak masih berlaku', accent: 'text-blue-600' },
          { label: 'Akan Berakhir 30 Hari', value: '2', icon: AlertTriangle, sub: 'perlu perhatian', accent: 'text-amber-600' },
          { label: 'Akan Berakhir 7 Hari', value: '1', icon: AlertCircle, sub: 'segera tindak lanjuti', accent: 'text-red-600' },
          { label: 'Sudah Berakhir', value: '2', icon: XCircle, sub: 'kontrak tidak aktif', accent: 'text-red-700' },
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

      {/* ── Main Content Card with Tabs ── */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center gap-1 border-b border-zinc-200">
            {['Daftar Kontrak', 'Alert Berakhir', 'Riwayat Perpanjangan'].map((tab, i) => (
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
              Section 1: Daftar Kontrak Karyawan
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-zinc-900">Daftar Kontrak Karyawan</h3>
                <Input placeholder="Cari karyawan..." className="w-48 pl-3" />
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" /> Sisa &gt;30</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" /> 7–30 hari</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" /> &lt;7 / Berakhir</span>
              </div>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">NIK</th>
                    <th className="px-4 py-3">Nama Karyawan</th>
                    <th className="px-4 py-3">Tipe Kontrak</th>
                    <th className="px-4 py-3">Tgl Mulai</th>
                    <th className="px-4 py-3">Tgl Berakhir</th>
                    <th className="px-4 py-3">Sisa Hari</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {kontrakData.map((row) => {
                    const sInfo = kontrakStatusMap[row.status]
                    return (
                      <tr key={row.nik} className={`hover:bg-zinc-50 transition-colors ${sisaHariBg(row.sisaHari)}`}>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.nik}</td>
                        <td className="px-4 py-3 font-medium text-zinc-900">{row.nama}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${tipeKontrakBadge[row.tipeKontrak] || 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                            {row.tipeKontrak}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-600">{row.tglMulai}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.tglBerakhir}</td>
                        <td className="px-4 py-3">
                          <span className={sisaHariColor(row.sisaHari)}>{formatSisaHari(row.sisaHari)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={sInfo?.variant || 'secondary'}>
                            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${sInfo?.dotColor}`} />
                            {row.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              <Eye className="mr-1 h-3 w-3" />
                              Detail
                            </Button>
                            {row.status !== 'Aktif' && (
                              <Button variant="outline" size="sm" className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                                <RefreshCcw className="mr-1 h-3 w-3" />
                                Perpanjang
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>Menampilkan 1–8 dari 8 kontrak</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
                <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Section 2: Alert Kontrak Berakhir
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-zinc-900">Alert Kontrak Berakhir</h3>
                <Badge variant="outline" className="text-xs text-red-600 border-red-200 bg-red-50">
                  <Bell className="mr-1 h-3 w-3" />
                  4 alert aktif
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {alertData.map((alert) => {
                const style = urgencyStyle[alert.urgency]
                const UrgencyIcon = style.icon
                return (
                  <div
                    key={alert.nik}
                    className={`rounded-lg border ${style.border} ${style.bg} p-4 space-y-3`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <UrgencyIcon className={`h-4 w-4 shrink-0 ${alert.urgency === 'warning' ? 'text-amber-600' : 'text-red-600'}`} />
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{alert.nama}</p>
                          <p className="font-mono text-xs text-zinc-500">{alert.nik}</p>
                        </div>
                      </div>
                      {alert.urgency === 'expired' ? (
                        <Badge variant="destructive">
                          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                          Berakhir
                        </Badge>
                      ) : alert.urgency === 'critical' ? (
                        <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
                          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                          Kritis
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">
                          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Peringatan
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-600">
                      <span>Tipe: <span className="font-medium text-zinc-900">{alert.tipeKontrak}</span></span>
                      <span>Berakhir: <span className="font-medium text-zinc-900">{alert.tglBerakhir}</span></span>
                      <span>Sisa: <span className={`font-semibold ${alert.sisaHari < 0 ? 'text-red-600' : alert.sisaHari < 7 ? 'text-red-600' : 'text-amber-600'}`}>
                        {alert.sisaHari < 0 ? `${Math.abs(alert.sisaHari)} hari lalu` : `${alert.sisaHari} hari`}
                      </span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className={`h-7 text-xs ${alert.urgency === 'expired' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-600 text-white hover:bg-amber-700'}`}>
                        <Send className="mr-1 h-3 w-3" />
                        Kirim Reminder
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                        <RefreshCcw className="mr-1 h-3 w-3" />
                        Perpanjang
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Section 3: Riwayat Perpanjangan
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-zinc-900">Riwayat Perpanjangan</h3>
                <Input placeholder="Cari karyawan..." className="w-48 pl-3" />
              </div>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Kontrak Asal</th>
                    <th className="px-4 py-3">Tgl Berakhir Lama</th>
                    <th className="px-4 py-3">Kontrak Baru</th>
                    <th className="px-4 py-3">Tgl Mulai Baru</th>
                    <th className="px-4 py-3">Disetujui Oleh</th>
                    <th className="px-4 py-3">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {riwayatData.map((row) => (
                    <tr key={`${row.nik}-${row.tglMulaiBaru}`} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-900">{row.nama}</p>
                        <p className="font-mono text-xs text-zinc-400">{row.nik}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${tipeKontrakBadge[row.kontrakAsal] || 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                          {row.kontrakAsal}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{row.tglBerakhirLama}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${tipeKontrakBadge[row.kontrakBaru] || 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                          {row.kontrakBaru}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{row.tglMulaiBaru}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.disetujuiOleh}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.tanggal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>Menampilkan 1–4 dari 4 riwayat</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
                <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}