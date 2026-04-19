import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRightLeft, Wrench, Clock, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Aset Mutasi · Phase 5',
  description: 'Preview desain halaman Mutasi & Perbaikan Aset',
}

const mutasiData = [
  { id: 'MUT-005', aset: 'AST-001 MacBook Pro', dari: 'Ahmad Rizal', ke: 'Nina Sari', tgl: '15 Apr 2025', alasan: 'Rotasi project', status: 'Selesai' },
  { id: 'MUT-004', aset: 'AST-004 Standing Desk', dari: 'Lt. 3 — Area Dev', ke: 'Lt. 2 — Ruang Baru', tgl: '1 Apr 2025', alasan: 'Perpindahan area', status: 'Selesai' },
  { id: 'MUT-006', aset: 'AST-002 Dell Monitor', dari: 'Nina Sari', ke: 'Fajar Nugroho', tgl: '20 Apr 2025', alasan: 'Kebutuhan project', status: 'Pending' },
]

const perbaikanData = [
  { id: 'SRV-003', aset: 'AST-007 PC Desktop i7', pelapor: 'Putri Rahayu', masalah: 'Blue screen saat booting, kemungkinan RAM rusak', vendor: 'PT Komputer Jaya', estimasi: 'Rp1.500.000', tgl: '18 Apr 2025', status: 'Dikerjakan' },
  { id: 'SRV-002', aset: 'AST-003 Epson Printer', pelapor: 'Umum', masalah: 'Paper jam terus menerus', vendor: 'CV Print Solution', estimasi: 'Rp500.000', tgl: '10 Apr 2025', status: 'Selesai' },
  { id: 'SRV-001', aset: 'AST-006 AC Daikin', pelapor: 'HR', masalah: 'Tidak dingin, bocor freon', vendor: 'PT Cool Air', estimasi: 'Rp800.000', tgl: '5 Mar 2025', status: 'Selesai' },
  { id: 'SRV-004', aset: 'AST-008 Projector Epson', pelapor: 'Training', masalah: 'Lampu mati, perlu ganti', vendor: '-', estimasi: 'Rp2.500.000', tgl: '20 Apr 2025', status: 'Menunggu Vendor' },
]

const srvStatusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' }> = {
  Selesai: { variant: 'default' },
  Dikerjakan: { variant: 'secondary' },
  'Menunggu Vendor': { variant: 'destructive' },
}

export default function AsetMutasiPage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 5 — Asset & Product Library" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><ArrowRightLeft className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Mutasi</p><p className="text-xl font-semibold text-zinc-900">3</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Wrench className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Servis Aktif</p><p className="text-xl font-semibold text-amber-600">2</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Clock className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Biaya Servis Bulan Ini</p><p className="text-xl font-semibold text-zinc-900">Rp4.800.000</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600"><AlertCircle className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Menunggu Vendor</p><p className="text-xl font-semibold text-red-600">1</p></div>
        </div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">Mutasi Aset</CardTitle><CardDescription>Pindah user/ruangan, serah terima digital</CardDescription></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">ID</th><th className="pb-2 font-medium">Aset</th><th className="pb-2 font-medium">Dari</th><th className="pb-2 font-medium">Ke</th><th className="pb-2 font-medium">Tanggal</th><th className="pb-2 font-medium">Alasan</th><th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {mutasiData.map((m, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="py-2 font-medium text-blue-600">{m.id}</td>
                    <td className="py-2 text-zinc-700">{m.aset}</td>
                    <td className="py-2 text-zinc-500">{m.dari}</td>
                    <td className="py-2 text-zinc-700 font-medium">{m.ke}</td>
                    <td className="py-2 text-zinc-500">{m.tgl}</td>
                    <td className="py-2 text-zinc-500">{m.alasan}</td>
                    <td className="py-2"><Badge variant={m.status === 'Selesai' ? 'default' : 'secondary'}>{m.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-lg">Perbaikan Aset</CardTitle><CardDescription>Lapor kerusakan, assign vendor, tracking biaya</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {perbaikanData.map((p, i) => {
              const s = srvStatusMap[p.status]
              return (
                <div key={i} className="rounded-lg border border-zinc-200 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-600">{p.id}</span>
                      <span className="font-semibold text-zinc-800">{p.aset}</span>
                    </div>
                    <Badge variant={s.variant}>{p.status}</Badge>
                  </div>
                  <p className="text-sm text-zinc-600">{p.masalah}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>Pelapor: {p.pelapor}</span>
                    <span>·</span>
                    <span>Vendor: {p.vendor || '—'}</span>
                    <span>·</span>
                    <span>Estimasi: {p.estimasi}</span>
                    <span>·</span>
                    <span>{p.tgl}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
