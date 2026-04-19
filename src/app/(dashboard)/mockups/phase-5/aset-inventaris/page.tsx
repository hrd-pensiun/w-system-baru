import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, QrCode, TrendingDown, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Aset Inventaris · Phase 5',
  description: 'Preview desain halaman Aset Inventaris & QR',
}

const asetItems = [
  { id: 'AST-001', nama: 'MacBook Pro M3 14"', kategori: 'Laptop', lokasi: 'Lt. 3 — Area Dev', pemilik: 'Ahmad Rizal', tglPerolehan: '15 Jan 2025', nilaiPerolehan: 'Rp35.000.000', penyusutan: 'Rp5.833.000', nilaiBuku: 'Rp29.167.000', umur: '5 thn', status: 'Aktif' },
  { id: 'AST-002', nama: 'Dell Monitor 27"', kategori: 'Monitor', lokasi: 'Lt. 3 — Area Dev', pemilik: 'Nina Sari', tglPerolehan: '15 Jan 2025', nilaiPerolehan: 'Rp5.500.000', penyusutan: 'Rp917.000', nilaiBuku: 'Rp4.583.000', umur: '5 thn', status: 'Aktif' },
  { id: 'AST-003', nama: 'Epson Printer L3250', kategori: 'Printer', lokasi: 'Lt. 2 — Administrasi', pemilik: 'Umum', tglPerolehan: '1 Mar 2024', nilaiPerolehan: 'Rp3.200.000', penyusutan: 'Rp768.000', nilaiBuku: 'Rp2.432.000', umur: '5 thn', status: 'Aktif' },
  { id: 'AST-004', nama: 'Meja Kerja Standing Desk', kategori: 'Furniture', lokasi: 'Lt. 3 — Area Dev', pemilik: 'Budi Santoso', tglPerolehan: '1 Jun 2024', nilaiPerolehan: 'Rp4.500.000', penyusutan: 'Rp750.000', nilaiBuku: 'Rp3.750.000', umur: '5 thn', status: 'Aktif' },
  { id: 'AST-005', nama: 'Cisco Router ISR 1100', kategori: 'Network', lokasi: 'Lt. 1 — Server Room', pemilik: 'IT', tglPerolehan: '1 Sep 2023', nilaiPerolehan: 'Rp12.000.000', penyusutan: 'Rp3.600.000', nilaiBuku: 'Rp8.400.000', umur: '5 thn', status: 'Aktif' },
  { id: 'AST-006', nama: 'AC Daikin 2 PK', kategori: 'AC', lokasi: 'Lt. 2 — Ruang Meeting', pemilik: 'Umum', tglPerolehan: '1 Jan 2023', nilaiPerolehan: 'Rp8.000.000', penyusutan: 'Rp3.200.000', nilaiBuku: 'Rp4.800.000', umur: '5 thn', status: 'Aktif' },
  { id: 'AST-007', nama: 'PC Desktop i7-13700', kategori: 'Desktop', lokasi: 'Lt. 2 — Administrasi', pemilik: 'Putri Rahayu', tglPerolehan: '1 Apr 2023', nilaiPerolehan: 'Rp15.000.000', penyusutan: 'Rp6.000.000', nilaiBuku: 'Rp9.000.000', umur: '5 thn', status: 'Perlu Servis' },
  { id: 'AST-008', nama: 'Projector Epson EB-X51', kategori: 'AV', lokasi: 'Lt. 2 — Ruang Training', pemilik: 'Umum', tglPerolehan: '1 Jul 2022', nilaiPerolehan: 'Rp7.500.000', penyusutan: 'Rp5.250.000', nilaiBuku: 'Rp2.250.000', umur: '5 thn', status: 'Disposal' },
]

const asetStatusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' }> = {
  Aktif: { variant: 'default' },
  'Perlu Servis': { variant: 'secondary' },
  Disposal: { variant: 'destructive' },
}

const kategoriSummary = [
  { kategori: 'Laptop', jumlah: 1, total: 'Rp35.000.000' },
  { kategori: 'Monitor', jumlah: 1, total: 'Rp5.500.000' },
  { kategori: 'Printer', jumlah: 1, total: 'Rp3.200.000' },
  { kategori: 'Furniture', jumlah: 1, total: 'Rp4.500.000' },
  { kategori: 'Network', jumlah: 1, total: 'Rp12.000.000' },
  { kategori: 'Desktop', jumlah: 1, total: 'Rp15.000.000' },
  { kategori: 'AV', jumlah: 1, total: 'Rp7.500.000' },
]

export default function AsetInventarisPage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 5 — Asset & Product Library" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Package className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Aset</p><p className="text-xl font-semibold text-zinc-900">8</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><QrCode className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Nilai Perolehan</p><p className="text-xl font-semibold text-zinc-900">Rp90.700.000</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><TrendingDown className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Penyusutan</p><p className="text-xl font-semibold text-zinc-900">Rp25.318.000</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Package className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Nilai Buku</p><p className="text-xl font-semibold text-emerald-600">Rp65.382.000</p></div>
        </div></CardContent></Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle className="text-lg">Daftar Aset</CardTitle><CardDescription>CRUD aset, penyusutan straight-line, QR code per aset</CardDescription></div>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" />Tambah Aset</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Nama</th>
                  <th className="pb-2 font-medium">Kategori</th>
                  <th className="pb-2 font-medium">Lokasi</th>
                  <th className="pb-2 font-medium">Pemilik</th>
                  <th className="pb-2 font-medium text-right">Nilai Buku</th>
                  <th className="pb-2 font-medium">Umur</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">QR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {asetItems.map((a, i) => {
                  const s = asetStatusMap[a.status]
                  return (
                    <tr key={i} className="hover:bg-zinc-50">
                      <td className="py-2 font-medium text-blue-600">{a.id}</td>
                      <td className="py-2 text-zinc-700">{a.nama}</td>
                      <td className="py-2"><Badge variant="outline">{a.kategori}</Badge></td>
                      <td className="py-2 text-zinc-500 text-xs">{a.lokasi}</td>
                      <td className="py-2 text-zinc-500">{a.pemilik}</td>
                      <td className="py-2 text-right font-medium">{a.nilaiBuku}</td>
                      <td className="py-2 text-zinc-500">{a.umur}</td>
                      <td className="py-2"><Badge variant={s.variant}>{a.status}</Badge></td>
                      <td className="py-2"><QrCode className="h-4 w-4 text-zinc-400" /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
