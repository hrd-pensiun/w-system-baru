import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Banknote, ArrowDownCircle, ArrowUpCircle, Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Kas & Bank · Phase 4',
  description: 'Preview desain halaman Kas & Bank',
}

const mutasiKas = [
  { tgl: '30 Apr 2025', keterangan: 'Pembayaran gaji April 2025', masuk: '-', keluar: 'Rp156.500.000', saldo: 'Rp423.500.000' },
  { tgl: '28 Apr 2025', keterangan: 'Penerimaan INV/WSI/2025/04/0003', masuk: 'Rp165.000.000', keluar: '-', saldo: 'Rp580.000.000' },
  { tgl: '25 Apr 2025', keterangan: 'Pembayaran vendor hosting', masuk: '-', keluar: 'Rp12.000.000', saldo: 'Rp415.000.000' },
  { tgl: '20 Apr 2025', keterangan: 'Pembelian ATK', masuk: '-', keluar: 'Rp2.500.000', saldo: 'Rp427.000.000' },
  { tgl: '15 Apr 2025', keterangan: 'Penerimaan DP PRJ-001', masuk: 'Rp99.000.000', keluar: '-', saldo: 'Rp429.500.000' },
  { tgl: '5 Apr 2025', keterangan: 'Pembayaran BPJS & PPh21', masuk: '-', keluar: 'Rp28.500.000', saldo: 'Rp330.500.000' },
]

const bankAccounts = [
  { bank: 'BCA', noRek: '123-456-7890', pemilik: 'PT W.System Indonesia', saldo: 'Rp450.000.000', lastSync: '1 jam lalu' },
  { bank: 'Mandiri', noRek: '098-765-4321', pemilik: 'PT W.System Indonesia', saldo: 'Rp180.000.000', lastSync: '3 jam lalu' },
]

export default function KasBankPage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 4 — Finance" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Banknote className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Saldo</p><p className="text-xl font-semibold text-zinc-900">Rp655.000.000</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><ArrowDownCircle className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Masuk Bulan Ini</p><p className="text-xl font-semibold text-emerald-600">Rp264.000.000</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600"><ArrowUpCircle className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Keluar Bulan Ini</p><p className="text-xl font-semibold text-red-600">Rp199.500.000</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Building2 className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Rekening Bank</p><p className="text-xl font-semibold text-zinc-900">2</p></div>
        </div></CardContent></Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rekening Bank</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {bankAccounts.map((b, i) => (
              <div key={i} className="rounded-lg border border-zinc-200 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-800">{b.bank}</span>
                  <Badge variant="outline" className="text-xs">Sync: {b.lastSync}</Badge>
                </div>
                <p className="text-sm text-zinc-500">{b.noRek} · {b.pemilik}</p>
                <p className="text-lg font-semibold text-zinc-900">{b.saldo}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mutasi Kas — BCA</CardTitle>
          <CardDescription>Rekonsiliasi dengan bank statement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">Tanggal</th>
                  <th className="pb-2 font-medium">Keterangan</th>
                  <th className="pb-2 font-medium text-right">Masuk</th>
                  <th className="pb-2 font-medium text-right">Keluar</th>
                  <th className="pb-2 font-medium text-right">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {mutasiKas.map((m, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="py-2 text-zinc-500">{m.tgl}</td>
                    <td className="py-2 text-zinc-700">{m.keterangan}</td>
                    <td className="py-2 text-right text-emerald-600 font-medium">{m.masuk}</td>
                    <td className="py-2 text-right text-red-500 font-medium">{m.keluar}</td>
                    <td className="py-2 text-right font-semibold">{m.saldo}</td>
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
