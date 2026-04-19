import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, Award, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Manpower Score · Phase 3',
  description: 'Preview desain halaman Manpower Score',
}

const scoreColor = (s: number) => s >= 4 ? 'text-emerald-600' : s >= 3 ? 'text-blue-600' : s >= 2 ? 'text-amber-600' : 'text-red-600'

const manpowerData = [
  { nama: 'Ahmad Rizal', project: 'ERP W.System', komunikasi: 4, kualitas: 5, waktu: 4, rata2: 4.3 },
  { nama: 'Nina Sari', project: 'Mobile Banking App', komunikasi: 5, kualitas: 4, waktu: 3, rata2: 4.0 },
  { nama: 'Budi Santoso', project: 'CRM Integration', komunikasi: 3, kualitas: 4, waktu: 5, rata2: 4.0 },
  { nama: 'Putri Rahayu', project: 'ERP W.System', komunikasi: 4, kualitas: 3, waktu: 3, rata2: 3.3 },
  { nama: 'Fajar Nugroho', project: 'Point of Sale', komunikasi: 2, kualitas: 3, waktu: 2, rata2: 2.3 },
  { nama: 'Rudi Hartono', project: 'Data Warehouse', komunikasi: 4, kualitas: 4, waktu: 4, rata2: 4.0 },
  { nama: 'Sita Permata', project: 'Website Redesign', komunikasi: 5, kualitas: 5, waktu: 5, rata2: 5.0 },
  { nama: 'Dewi Lestari', project: 'Mobile Banking App', komunikasi: 3, kualitas: 2, waktu: 3, rata2: 2.7 },
]

const projectAvg = [
  { project: 'ERP W.System', anggota: 2, komunikasi: 4.0, kualitas: 4.0, waktu: 3.5, rata2: 3.8 },
  { project: 'Mobile Banking App', anggota: 2, komunikasi: 4.0, kualitas: 3.0, waktu: 3.0, rata2: 3.3 },
  { project: 'CRM Integration', anggota: 1, komunikasi: 3.0, kualitas: 4.0, waktu: 5.0, rata2: 4.0 },
  { project: 'Point of Sale', anggota: 1, komunikasi: 2.0, kualitas: 3.0, waktu: 2.0, rata2: 2.3 },
  { project: 'Data Warehouse', anggota: 1, komunikasi: 4.0, kualitas: 4.0, waktu: 4.0, rata2: 4.0 },
  { project: 'Website Redesign', anggota: 1, komunikasi: 5.0, kualitas: 5.0, waktu: 5.0, rata2: 5.0 },
]

const starRow = (val: number) => '★'.repeat(val) + '☆'.repeat(5 - val)

export default function ManpowerScorePage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 3 — Project Management" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Users className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Karyawan</p><p className="text-xl font-semibold text-zinc-900">8</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><TrendingUp className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Rata-rata Skor</p><p className="text-xl font-semibold text-emerald-600">3.6 / 5</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Award className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Top Performer</p><p className="text-lg font-semibold text-zinc-900">Sita Permata</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600"><BarChart3 className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Perlu Perhatian</p><p className="text-xl font-semibold text-red-600">2</p></div>
        </div></CardContent></Card>
      </div>

      {/* ── Skor per Karyawan ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Manpower Score per Karyawan</CardTitle>
          <CardDescription>Skala 1–5 per dimensi, visible ke HR untuk bahan appraisal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">Nama</th>
                  <th className="pb-2 font-medium">Project</th>
                  <th className="pb-2 font-medium text-center">Komunikasi</th>
                  <th className="pb-2 font-medium text-center">Kualitas</th>
                  <th className="pb-2 font-medium text-center">Waktu</th>
                  <th className="pb-2 font-medium text-center">Rata-rata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {manpowerData.map((m, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="py-2 font-medium text-zinc-700">{m.nama}</td>
                    <td className="py-2 text-zinc-500">{m.project}</td>
                    <td className="py-2 text-center"><span className={`font-semibold ${scoreColor(m.komunikasi)}`}>{m.komunikasi}</span></td>
                    <td className="py-2 text-center"><span className={`font-semibold ${scoreColor(m.kualitas)}`}>{m.kualitas}</span></td>
                    <td className="py-2 text-center"><span className={`font-semibold ${scoreColor(m.waktu)}`}>{m.waktu}</span></td>
                    <td className="py-2 text-center">
                      <Badge variant={m.rata2 >= 4 ? 'default' : m.rata2 >= 3 ? 'secondary' : 'destructive'}>
                        {m.rata2.toFixed(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Skor per Project ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rata-rata per Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectAvg.map((p, i) => (
              <div key={i} className="rounded-lg border border-zinc-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-zinc-700">{p.project}</span>
                  <Badge variant={p.rata2 >= 4 ? 'default' : p.rata2 >= 3 ? 'secondary' : 'destructive'}>
                    {p.rata2.toFixed(1)} / 5
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-400 text-xs">Komunikasi</p>
                    <p className={`font-medium ${scoreColor(p.komunikasi)}`}>{starRow(p.komunikasi)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs">Kualitas</p>
                    <p className={`font-medium ${scoreColor(p.kualitas)}`}>{starRow(p.kualitas)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs">Waktu</p>
                    <p className={`font-medium ${scoreColor(p.waktu)}`}>{starRow(p.waktu)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
