import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Navigation,
  Search,
  Eye,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Presensi GPS · Phase 1',
  description: 'Preview desain halaman Presensi GPS',
}

// ── Mock Data: Rekap Harian ──
const rekapHarianData = [
  { nik: 'WS-2022-001', nama: 'Ahmad Rizal', shift: '08:00–17:00', clockIn: '07:58 WIB', clockOut: '17:05 WIB', jamKerja: '9j 7m', terlambat: '—', status: 'Hadir' },
  { nik: 'WS-2022-002', nama: 'Nina Sari', shift: '08:00–17:00', clockIn: '08:12 WIB', clockOut: '17:10 WIB', jamKerja: '8j 58m', terlambat: '12 mnt', status: 'Terlambat' },
  { nik: 'WS-2022-003', nama: 'Budi Santoso', shift: '08:00–17:00', clockIn: '07:55 WIB', clockOut: '17:00 WIB', jamKerja: '9j 5m', terlambat: '—', status: 'Hadir' },
  { nik: 'WS-2022-004', nama: 'Putri Rahayu', shift: '08:00–17:00', clockIn: '—', clockOut: '—', jamKerja: '—', terlambat: '—', status: 'Izin' },
  { nik: 'WS-2022-005', nama: 'Fajar Nugroho', shift: '08:00–17:00', clockIn: '07:50 WIB', clockOut: '17:02 WIB', jamKerja: '9j 12m', terlambat: '—', status: 'Hadir' },
  { nik: 'WS-2022-006', nama: 'Dewi Lestari', shift: '08:00–17:00', clockIn: '—', clockOut: '—', jamKerja: '—', terlambat: '—', status: 'Cuti' },
  { nik: 'WS-2023-007', nama: 'Rudi Hartono', shift: '08:00–17:00', clockIn: '08:01 WIB', clockOut: '17:08 WIB', jamKerja: '9j 7m', terlambat: '—', status: 'Hadir' },
  { nik: 'WS-2023-008', nama: 'Sita Permata', shift: '08:00–17:00', clockIn: '—', clockOut: '—', jamKerja: '—', terlambat: '—', status: 'Alpha' },
]

const presensiStatusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive'; dotColor: string }> = {
  Hadir: { label: 'Hadir', variant: 'default', dotColor: 'bg-emerald-500' },
  Terlambat: { label: 'Terlambat', variant: 'outline', dotColor: 'bg-amber-500' },
  Izin: { label: 'Izin', variant: 'secondary', dotColor: 'bg-blue-500' },
  Cuti: { label: 'Cuti', variant: 'secondary', dotColor: 'bg-blue-500' },
  Alpha: { label: 'Alpha', variant: 'destructive', dotColor: 'bg-red-500' },
}

// ── Mock Data: Kehadiran Karyawan (Mini Calendar) ──
const kehadiranKaryawanData = [
  { nama: 'Ahmad Rizal', nik: 'WS-2022-001', hari: ['Hadir','Hadir','Hadir','Terlambat','Hadir','Hadir','Libur'] },
  { nama: 'Nina Sari', nik: 'WS-2022-002', hari: ['Hadir','Hadir','Izin','Hadir','Hadir','Terlambat','Libur'] },
  { nama: 'Budi Santoso', nik: 'WS-2022-003', hari: ['Hadir','Hadir','Hadir','Hadir','Hadir','Hadir','Libur'] },
  { nama: 'Putri Rahayu', nik: 'WS-2022-004', hari: ['Hadir','Cuti','Cuti','Cuti','Hadir','Hadir','Libur'] },
]

const calendarDotColor: Record<string, string> = {
  Hadir: 'bg-emerald-500',
  Terlambat: 'bg-amber-500',
  Alpha: 'bg-red-500',
  Cuti: 'bg-blue-500',
  Izin: 'bg-blue-500',
  Libur: 'bg-zinc-300',
}

// ── Mock Data: Area Kerja ──
const areaKerjaData = [
  { nama: 'Kantor Pusat Jakarta', alamat: 'Jl. Sudirman Kav. 52-53, Jakarta Selatan', lat: '-6.2088', lng: '106.8456', radius: 200, requirePhoto: true, requireGPS: true, aktif: true },
  { nama: 'Co-Working Space BSD', alamat: 'Q Big BSD City, Jl. Serpong, Tangerang Selatan', lat: '-6.3015', lng: '106.6569', radius: 150, requirePhoto: true, requireGPS: false, aktif: true },
  { nama: 'Client Site Surabaya', alamat: 'Jl. Basuki Rahmat No. 90, Surabaya', lat: '-7.2575', lng: '112.7521', radius: 300, requirePhoto: false, requireGPS: true, aktif: true },
]

// ── Mock Data: Koreksi Presensi ──
const koreksiData = [
  { karyawan: 'Nina Sari', tanggal: '18 Maret 2025', clockInAsli: '08:12 WIB', clockInKoreksi: '08:00 WIB', alasan: 'Keterlambatan karena banjir – konfirmasi HRD', status: 'Approved', diapproveOleh: 'Andi W. (HR)' },
  { karyawan: 'Ahmad Rizal', tanggal: '15 Maret 2025', clockInAsli: '—', clockInKoreksi: '08:00 WIB', alasan: 'Lupa tap-in, sudah berada di kantor sebelum 08:00', status: 'Draft', diapproveOleh: '—' },
  { karyawan: 'Rudi Hartono', tanggal: '12 Maret 2025', clockInAsli: '08:45 WIB', clockInKoreksi: '08:00 WIB', alasan: 'Dinas luar, GPS tidak terbaca saat di client site', status: 'Rejected', diapproveOleh: 'Andi W. (HR)' },
]

const koreksiStatusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive' }> = {
  Draft: { label: 'Draft', variant: 'outline' },
  Approved: { label: 'Approved', variant: 'default' },
  Rejected: { label: 'Rejected', variant: 'destructive' },
}

// ── Days for mini calendar ──
const calDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

export default function PresensiGpsMockup() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 1 — HR Core · US-HR-002" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Presensi GPS</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola kehadiran karyawan berbasis GPS, area kerja, dan koreksi presensi
          </p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-700">
          <MapPin className="mr-1.5 h-4 w-4" />
          Tambah Area Kerja
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Hadir Hari Ini', value: '6', icon: CheckCircle2, sub: 'dari 8 karyawan', accent: 'text-emerald-600' },
          { label: 'Terlambat', value: '1', icon: AlertTriangle, sub: 'hari ini', accent: 'text-amber-600' },
          { label: 'Izin / Cuti', value: '1', icon: Calendar, sub: '1 izin · 1 cuti', accent: 'text-blue-600' },
          { label: 'Alpha', value: '0', icon: XCircle, sub: 'tidak ada hari ini', accent: 'text-red-600' },
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

      {/* ── Tab-style Section ── */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center gap-1 border-b border-zinc-200">
            {['Rekap Harian', 'Kehadiran Karyawan', 'Area Kerja', 'Koreksi Presensi'].map((tab, i) => (
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
              Section 1: Rekap Harian
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-zinc-900">Rekap Harian</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input placeholder="Cari karyawan..." className="w-48 pl-9" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-500">Hari ini, 19 April 2025</span>
              </div>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">NIK</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Shift</th>
                    <th className="px-4 py-3">Clock In</th>
                    <th className="px-4 py-3">Clock Out</th>
                    <th className="px-4 py-3">Jam Kerja</th>
                    <th className="px-4 py-3">Terlambat</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {rekapHarianData.map((row) => {
                    const statusInfo = presensiStatusMap[row.status]
                    return (
                      <tr key={row.nik} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.nik}</td>
                        <td className="px-4 py-3 font-medium text-zinc-900">{row.nama}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.shift}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.clockIn}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.clockOut}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.jamKerja}</td>
                        <td className="px-4 py-3">
                          {row.terlambat !== '—' ? (
                            <span className="text-amber-600 font-medium">{row.terlambat}</span>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
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
              Section 2: Kehadiran Karyawan
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Kehadiran Karyawan</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input placeholder="Cari karyawan..." className="w-56 pl-9" />
                </div>
                <div className="relative">
                  <select className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900">
                    <option>Maret 2025</option>
                    <option>Februari 2025</option>
                    <option>Januari 2025</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" /> Hadir</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" /> Terlambat</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" /> Alpha</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" /> Cuti</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-300" /> Libur</span>
            </div>

            {/* Mini Calendar View */}
            <div className="space-y-3">
              {/* Calendar header row */}
              <div className="grid grid-cols-[180px_repeat(7,1fr)] gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2">
                <div className="text-xs font-medium text-zinc-500">Karyawan</div>
                {calDays.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-zinc-500">{d}</div>
                ))}
              </div>

              {/* Calendar rows */}
              {kehadiranKaryawanData.map((k) => (
                <div
                  key={k.nik}
                  className="grid grid-cols-[180px_repeat(7,1fr)] gap-2 rounded-lg border border-zinc-100 px-4 py-3 hover:bg-zinc-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{k.nama}</p>
                    <p className="text-xs text-zinc-400">{k.nik}</p>
                  </div>
                  {k.hari.map((status, idx) => (
                    <div key={idx} className="flex items-center justify-center">
                      <span
                        className={`inline-block h-3 w-3 rounded-full ${calendarDotColor[status] || 'bg-zinc-300'}`}
                        title={status}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Section 3: Area Kerja
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Area Kerja (GPS Work Areas)</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {areaKerjaData.map((area) => (
                <Card key={area.nama} className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
                          <MapPin className="h-4 w-4 text-zinc-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-900">{area.nama}</h4>
                      </div>
                      {area.aktif && (
                        <Badge variant="default" className="text-xs bg-emerald-600 hover:bg-emerald-700">Aktif</Badge>
                      )}
                    </div>

                    {/* Address */}
                    <p className="text-xs text-zinc-500">{area.alamat}</p>

                    {/* Coordinates */}
                    <div className="rounded-md bg-zinc-50 px-3 py-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Navigation className="h-3 w-3 text-zinc-400" />
                        <span className="text-zinc-500">Lat:</span>
                        <span className="font-mono text-zinc-700">{area.lat}</span>
                        <span className="text-zinc-400 mx-1">·</span>
                        <span className="text-zinc-500">Lng:</span>
                        <span className="font-mono text-zinc-700">{area.lng}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <MapPin className="h-3 w-3 text-zinc-400" />
                        <span className="text-zinc-500">Radius:</span>
                        <span className="font-medium text-zinc-700">{area.radius}m</span>
                      </div>
                    </div>

                    {/* Toggles (visual only) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Wajib Foto Saat Check-in</span>
                        {area.requirePhoto ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 font-medium">
                            <CheckCircle2 className="h-3 w-3" /> Ya
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-500 font-medium">
                            <XCircle className="h-3 w-3" /> Tidak
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Wajib GPS Aktif</span>
                        {area.requireGPS ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 font-medium">
                            <CheckCircle2 className="h-3 w-3" /> Ya
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-500 font-medium">
                            <XCircle className="h-3 w-3" /> Tidak
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Edit Area
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Section 4: Koreksi Presensi
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Koreksi Presensi</h3>
              <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                Ajukan Koreksi
              </Button>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Karyawan</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Clock In Asli</th>
                    <th className="px-4 py-3">Clock In Koreksi</th>
                    <th className="px-4 py-3">Alasan</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Diapprove Oleh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {koreksiData.map((row) => (
                    <tr key={`${row.karyawan}-${row.tanggal}`} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900">{row.karyawan}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.tanggal}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.clockInAsli}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{row.clockInKoreksi}</td>
                      <td className="px-4 py-3 text-zinc-500 max-w-[240px] truncate">{row.alasan}</td>
                      <td className="px-4 py-3">
                        <Badge variant={koreksiStatusMap[row.status]?.variant || 'secondary'}>
                          {koreksiStatusMap[row.status]?.label || row.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{row.diapproveOleh}</td>
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