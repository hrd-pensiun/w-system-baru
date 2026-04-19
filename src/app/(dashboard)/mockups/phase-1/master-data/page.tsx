import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = {
  title: 'Mockup — Master Data HR · Phase 1',
  description: 'Preview desain halaman Master Data HR',
}

// ── Mock Data ──
const karyawanData = [
  { id: 'EMP-001', nama: 'Admin W.System', jabatan: 'Chief Technology Officer', departemen: 'Technology', grade: 'G1', status: 'aktif', joinDate: '2024-01-15' },
  { id: 'EMP-002', nama: 'Siti Rahmawati', jabatan: 'HR Manager', departemen: 'Human Resources', grade: 'G4', status: 'aktif', joinDate: '2024-03-01' },
  { id: 'EMP-003', nama: 'Budi Santoso', jabatan: 'Senior Developer', departemen: 'Technology', grade: 'G5', status: 'aktif', joinDate: '2024-05-10' },
  { id: 'EMP-004', nama: 'Dewi Lestari', jabatan: 'Finance Staff', departemen: 'Finance', grade: 'G6', status: 'aktif', joinDate: '2024-06-20' },
  { id: 'EMP-005', nama: 'Ahmad Fauzi', jabatan: 'Developer', departemen: 'Technology', grade: 'G6', status: 'probasi', joinDate: '2025-01-02' },
  { id: 'EMP-006', nama: 'Rina Wulandari', jabatan: 'QA Engineer', departemen: 'Technology', grade: 'G6', status: 'aktif', joinDate: '2024-08-15' },
  { id: 'EMP-007', nama: 'Hendra Wijaya', jabatan: 'Business Development', departemen: 'Sales', grade: 'G5', status: 'nonaktif', joinDate: '2023-11-01' },
  { id: 'EMP-008', nama: 'Maya Putri', jabatan: 'UI/UX Designer', departemen: 'Technology', grade: 'G6', status: 'aktif', joinDate: '2025-02-01' },
]

const departemenData = [
  { kode: 'TECH', nama: 'Technology', kepala: 'Admin W.System', jumlahKaryawan: 5, entity: 'PT W.System Indonesia' },
  { kode: 'HR', nama: 'Human Resources', kepala: 'Siti Rahmawati', jumlahKaryawan: 2, entity: 'PT W.System Indonesia' },
  { kode: 'FIN', nama: 'Finance & Accounting', kepala: 'Dewi Lestari', jumlahKaryawan: 2, entity: 'PT W.System Indonesia' },
  { kode: 'SALES', nama: 'Sales & Business Dev', kepala: 'Hendra Wijaya', jumlahKaryawan: 3, entity: 'PT W.System Indonesia' },
]

const jabatanData = [
  { kode: 'CTO', nama: 'Chief Technology Officer', grade: 'G1', departemen: 'Technology' },
  { kode: 'HRM', nama: 'HR Manager', grade: 'G4', departemen: 'Human Resources' },
  { kode: 'SE', nama: 'Senior Developer', grade: 'G5', departemen: 'Technology' },
  { kode: 'DEV', nama: 'Developer', grade: 'G6', departemen: 'Technology' },
  { kode: 'QA', nama: 'QA Engineer', grade: 'G6', departemen: 'Technology' },
  { kode: 'UX', nama: 'UI/UX Designer', grade: 'G6', departemen: 'Technology' },
  { kode: 'FIN', nama: 'Finance Staff', grade: 'G6', departemen: 'Finance & Accounting' },
]

const gradeData = [
  { kode: 'G1', nama: 'C-Level / Director', kpiWeight: 80, compWeight: 20 },
  { kode: 'G2', nama: 'VP / GM', kpiWeight: 75, compWeight: 25 },
  { kode: 'G3', nama: 'Senior Manager', kpiWeight: 70, compWeight: 30 },
  { kode: 'G4', nama: 'Manager', kpiWeight: 65, compWeight: 35 },
  { kode: 'G5', nama: 'Senior Staff', kpiWeight: 60, compWeight: 40 },
  { kode: 'G6', nama: 'Staff', kpiWeight: 55, compWeight: 45 },
  { kode: 'G7', nama: 'Junior Staff', kpiWeight: 50, compWeight: 50 },
  { kode: 'G8', nama: 'Support / Admin', kpiWeight: 40, compWeight: 60 },
]

const shiftData = [
  { kode: 'REG', nama: 'Reguler', jam: '08:00–17:00', istirahat: '60 mnt', toleransi: '15 mnt' },
  { kode: 'FLEX', nama: 'Fleksibel', jam: '09:00–18:00', istirahat: '60 mnt', toleransi: '0 mnt' },
  { kode: 'NIGHT', nama: 'Shift Malam', jam: '22:00–06:00', istirahat: '60 mnt', toleransi: '15 mnt' },
]

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  aktif: { label: 'Aktif', variant: 'default' },
  probasi: { label: 'Probasi', variant: 'outline' },
  nonaktif: { label: 'Nonaktif', variant: 'secondary' },
}

export default function MasterDataMockup() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 1 — HR Core · US-HR-000" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Master Data HR</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola data karyawan, departemen, jabatan, grade, dan shift kerja
          </p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-700">
          + Tambah Karyawan
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Karyawan Aktif', value: '6', sub: 'dari 8 total' },
          { label: 'Departemen', value: '4', sub: 'PT W.System Indonesia' },
          { label: 'Jabatan', value: '7', sub: '7 posisi terdefinisi' },
          { label: 'Grade/Golongan', value: '8', sub: 'G1 sampai G8' },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-6">
              <p className="text-sm text-zinc-500">{m.label}</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{m.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Tab: Daftar Karyawan ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Daftar Karyawan</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search & filter bar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <Input placeholder="Cari nama, NIK, atau email..." className="w-64" />
              <Button variant="outline" size="sm">Filter</Button>
            </div>
            <div className="flex gap-2 text-sm">
              <Button variant="outline" size="sm" className="text-xs">Semua (8)</Button>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-500">Aktif (6)</Button>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-500">Probasi (1)</Button>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-500">Nonaktif (1)</Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-3">NIK</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Jabatan</th>
                  <th className="px-4 py-3">Departemen</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Tanggal Masuk</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {karyawanData.map((k) => (
                  <tr key={k.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{k.id}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{k.nama}</td>
                    <td className="px-4 py-3 text-zinc-600">{k.jabatan}</td>
                    <td className="px-4 py-3 text-zinc-600">{k.departemen}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                        {k.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{k.joinDate}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusMap[k.status]?.variant || 'secondary'}>
                        {statusMap[k.status]?.label || k.status}
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

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
            <span>Menampilkan 1–8 dari 8 karyawan</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
              <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Tab: Departemen ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Departemen</CardTitle>
            <Button variant="outline" size="sm">+ Tambah Departemen</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Nama Departemen</th>
                  <th className="px-4 py-3">Kepala</th>
                  <th className="px-4 py-3">Jumlah Karyawan</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {departemenData.map((d) => (
                  <tr key={d.kode} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{d.kode}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{d.nama}</td>
                    <td className="px-4 py-3 text-zinc-600">{d.kepala}</td>
                    <td className="px-4 py-3 text-zinc-600">{d.jumlahKaryawan}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{d.entity}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Two columns: Jabatan + Grade ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Jabatan */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Jabatan</CardTitle>
              <Button variant="outline" size="sm">+ Tambah</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-3 py-2">Kode</th>
                    <th className="px-3 py-2">Nama</th>
                    <th className="px-3 py-2">Grade</th>
                    <th className="px-3 py-2">Dept</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {jabatanData.map((j) => (
                    <tr key={j.kode} className="hover:bg-zinc-50">
                      <td className="px-3 py-2 font-mono text-xs">{j.kode}</td>
                      <td className="px-3 py-2 font-medium text-zinc-900">{j.nama}</td>
                      <td className="px-3 py-2"><span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">{j.grade}</span></td>
                      <td className="px-3 py-2 text-zinc-500 text-xs">{j.departemen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Grade/Golongan */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Grade / Golongan</CardTitle>
              <Button variant="outline" size="sm">+ Tambah</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-3 py-2">Kode</th>
                    <th className="px-3 py-2">Nama</th>
                    <th className="px-3 py-2">Bobot KPI</th>
                    <th className="px-3 py-2">Bobot Kompetensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {gradeData.map((g) => (
                    <tr key={g.kode} className="hover:bg-zinc-50">
                      <td className="px-3 py-2 font-mono text-xs">{g.kode}</td>
                      <td className="px-3 py-2 font-medium text-zinc-900">{g.nama}</td>
                      <td className="px-3 py-2 text-zinc-600">{g.kpiWeight}%</td>
                      <td className="px-3 py-2 text-zinc-600">{g.compWeight}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Shift Kerja ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Shift Kerja</CardTitle>
            <Button variant="outline" size="sm">+ Tambah Shift</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Nama Shift</th>
                  <th className="px-4 py-3">Jam Kerja</th>
                  <th className="px-4 py-3">Istirahat</th>
                  <th className="px-4 py-3">Toleransi Terlambat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {shiftData.map((s) => (
                  <tr key={s.kode} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{s.kode}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{s.nama}</td>
                    <td className="px-4 py-3 text-zinc-600">{s.jam}</td>
                    <td className="px-4 py-3 text-zinc-600">{s.istirahat}</td>
                    <td className="px-4 py-3 text-zinc-600">{s.toleransi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}