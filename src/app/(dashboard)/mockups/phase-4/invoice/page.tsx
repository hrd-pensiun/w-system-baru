import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Clock, AlertCircle, DollarSign, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Invoice · Phase 4',
  description: 'Preview desain halaman Invoice & AP/AR',
}

const invoices = [
  { no: 'INV/WSI/2025/04/0003', klien: 'PT Teknologi Maju', tanggal: '28 Apr 2025', jatuhTempo: '28 May 2025', jumlah: 'Rp165.000.000', status: 'Belum Bayar', aging: '0' },
  { no: 'INV/WSI/2025/04/0002', klien: 'CV Data Prima', tanggal: '15 Apr 2025', jatuhTempo: '15 May 2025', jumlah: 'Rp72.000.000', status: 'Belum Bayar', aging: '0' },
  { no: 'INV/WSI/2025/03/0005', klien: 'Bank National', tanggal: '31 Mar 2025', jatuhTempo: '30 Apr 2025', jumlah: 'Rp150.000.000', status: 'Jatuh Tempo', aging: '1' },
  { no: 'INV/WSI/2025/02/0004', klien: 'PT Solusi Digital', tanggal: '28 Feb 2025', jatuhTempo: '28 Mar 2025', jumlah: 'Rp125.000.000', status: 'Jatuh Tempo', aging: '31' },
  { no: 'INV/WSI/2025/02/0003', klien: 'Klinik Sehat Sentosa', tanggal: '15 Feb 2025', jatuhTempo: '15 Mar 2025', jumlah: 'Rp75.000.000', status: 'Lunas', aging: '-' },
  { no: 'INV/WSI/2025/01/0001', klien: 'PT Sumber Makmur', tanggal: '10 Jan 2025', jatuhTempo: '10 Feb 2025', jumlah: 'Rp60.000.000', status: 'Lunas', aging: '-' },
]

const invStatusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' }> = {
  'Lunas': { variant: 'default' },
  'Belum Bayar': { variant: 'secondary' },
  'Jatuh Tempo': { variant: 'destructive' },
}

const agingSummary = [
  { range: '0–30 hari', jumlah: 2, total: 'Rp237.000.000', color: 'bg-emerald-500' },
  { range: '31–60 hari', jumlah: 1, total: 'Rp125.000.000', color: 'bg-amber-500' },
  { range: '61–90 hari', jumlah: 0, total: 'Rp0', color: 'bg-orange-500' },
  { range: '> 90 hari', jumlah: 0, total: 'Rp0', color: 'bg-red-500' },
]

const apItems = [
  { vendor: 'PT Cloud Hosting ID', deskripsi: 'Layanan Cloud Apr 2025', jumlah: 'Rp12.000.000', jatuhTempo: '10 May 2025', status: 'Belum Bayar' },
  { vendor: 'CV Maju Jaya', deskripsi: 'ATK & Printer', jumlah: 'Rp2.500.000', jatuhTempo: '5 May 2025', status: 'Belum Bayar' },
  { vendor: 'PT Asuransi Sejahtera', deskripsi: 'Premi Asuransi Q2 2025', jumlah: 'Rp8.500.000', jatuhTempo: '1 May 2025', status: 'Belum Bayar' },
]

export default function InvoicePage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 4 — Finance" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><FileText className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Invoice</p><p className="text-xl font-semibold text-zinc-900">6</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Clock className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Piutang Outstanding</p><p className="text-xl font-semibold text-amber-600">Rp362.000.000</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600"><AlertCircle className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Jatuh Tempo</p><p className="text-xl font-semibold text-red-600">2</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><DollarSign className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Lunas Bulan Ini</p><p className="text-xl font-semibold text-zinc-900">Rp135.000.000</p></div>
        </div></CardContent></Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle className="text-lg">Invoice / Piutang (AR)</CardTitle><CardDescription>Nomor otomatis: INV/[ENTITY]/[YYYY]/[MM]/[NNNN]</CardDescription></div>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" />Buat Invoice</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">No Invoice</th>
                  <th className="pb-2 font-medium">Klien</th>
                  <th className="pb-2 font-medium">Tanggal</th>
                  <th className="pb-2 font-medium">Jatuh Tempo</th>
                  <th className="pb-2 font-medium text-right">Jumlah</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {invoices.map((inv, i) => {
                  const s = invStatusMap[inv.status]
                  return (
                    <tr key={i} className="hover:bg-zinc-50">
                      <td className="py-2 font-medium text-blue-600">{inv.no}</td>
                      <td className="py-2 text-zinc-700">{inv.klien}</td>
                      <td className="py-2 text-zinc-500">{inv.tanggal}</td>
                      <td className="py-2 text-zinc-500">{inv.jatuhTempo}</td>
                      <td className="py-2 text-right font-medium">{inv.jumlah}</td>
                      <td className="py-2"><Badge variant={s.variant}>{inv.status}</Badge></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Aging Piutang</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {agingSummary.map((a, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${a.color}`} />
                  <span className="text-sm font-medium text-zinc-700">{a.range}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">{a.total}</span>
                  <span className="ml-2 text-xs text-zinc-400">({a.jumlah} inv)</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Utang / AP</CardTitle><CardDescription>Tagihan dari vendor yang belum dibayar</CardDescription></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="pb-2 font-medium">Vendor</th>
                    <th className="pb-2 font-medium">Deskripsi</th>
                    <th className="pb-2 font-medium text-right">Jumlah</th>
                    <th className="pb-2 font-medium">Jatuh Tempo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {apItems.map((a, i) => (
                    <tr key={i}>
                      <td className="py-2 font-medium text-zinc-700">{a.vendor}</td>
                      <td className="py-2 text-zinc-500">{a.deskripsi}</td>
                      <td className="py-2 text-right font-medium">{a.jumlah}</td>
                      <td className="py-2 text-zinc-500">{a.jatuhTempo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
