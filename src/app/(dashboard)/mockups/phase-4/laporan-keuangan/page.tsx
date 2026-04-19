import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Scale, FileSpreadsheet } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Laporan Keuangan · Phase 4',
  description: 'Preview desain halaman Laporan Keuangan',
}

const neracaData = [
  { akun: 'ASET', level: 0, saldo: '' },
  { akun: 'Kas & Bank', level: 1, saldo: 'Rp655.000.000' },
  { akun: 'Piutang Usaha', level: 1, saldo: 'Rp362.000.000' },
  { akun: 'Aset Lainnya', level: 1, saldo: 'Rp150.000.000' },
  { akun: 'Total Aset', level: -1, saldo: 'Rp1.167.000.000' },
  { akun: 'KEWAJIBAN', level: 0, saldo: '' },
  { akun: 'Utang Usaha', level: 1, saldo: 'Rp23.000.000' },
  { akun: 'Utang Gaji', level: 1, saldo: 'Rp156.500.000' },
  { akun: 'Total Kewajiban', level: -1, saldo: 'Rp179.500.000' },
  { akun: 'EKUITAS', level: 0, saldo: '' },
  { akun: 'Modal', level: 1, saldo: 'Rp500.000.000' },
  { akun: 'Laba Ditahan', level: 1, saldo: 'Rp487.500.000' },
  { akun: 'Total Ekuitas', level: -1, saldo: 'Rp987.500.000' },
]

const plData = [
  { akun: 'PENDAPATAN', level: 0, saldo: '' },
  { akun: 'Pendapatan Jasa', level: 1, saldo: 'Rp780.000.000' },
  { akun: 'Pendapatan Lainnya', level: 1, saldo: 'Rp20.000.000' },
  { akun: 'Total Pendapatan', level: -1, saldo: 'Rp800.000.000' },
  { akun: 'BEBAN', level: 0, saldo: '' },
  { akun: 'Beban Gaji & Tunjangan', level: 1, saldo: 'Rp520.000.000' },
  { akun: 'Beban Operasional', level: 1, saldo: 'Rp95.000.000' },
  { akun: 'Beban BPJS & PPh', level: 1, saldo: 'Rp45.000.000' },
  { akun: 'Beban Depresiasi', level: 1, saldo: 'Rp12.500.000' },
  { akun: 'Total Beban', level: -1, saldo: 'Rp672.500.000' },
  { akun: 'LABA BERSIH', level: -2, saldo: 'Rp127.500.000' },
]

const intercoData = [
  { entitas: 'PT W.System Indonesia', rekening: 'BCA', debet: 'Rp450.000.000', kredit: 'Rp280.000.000' },
  { entitas: 'PT W.System Digital', rekening: 'Mandiri', debet: 'Rp120.000.000', kredit: 'Rp350.000.000' },
]

export default function LaporanKeuanganPage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 4 — Finance" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Scale className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Aset</p><p className="text-xl font-semibold text-zinc-900">Rp1.167.000.000</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><TrendingUp className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Laba Bersih</p><p className="text-xl font-semibold text-emerald-600">Rp127.500.000</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><BarChart3 className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Margin</p><p className="text-xl font-semibold text-zinc-900">16%</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><FileSpreadsheet className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Periode</p><p className="text-lg font-semibold text-zinc-900">Q1 2025</p></div>
        </div></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Neraca (Balance Sheet)</CardTitle><CardDescription>Per 31 Maret 2025</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {neracaData.map((n, i) => {
                const isHeader = n.level === 0
                const isTotal = n.level === -1
                const isGrandTotal = n.level === -2
                return (
                  <div key={i} className={`flex justify-between py-1 ${isHeader ? 'font-bold text-zinc-800 mt-2' : isGrandTotal ? 'font-bold text-blue-700 border-t pt-2' : isTotal ? 'font-semibold text-zinc-700 border-t pt-1' : ''}`} style={!isHeader && !isTotal && !isGrandTotal ? { paddingLeft: '1rem' } : {}}>
                    <span>{n.akun}</span>
                    <span>{n.saldo || ''}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Laba Rugi (P&L)</CardTitle><CardDescription>Januari — Maret 2025</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {plData.map((p, i) => {
                const isHeader = p.level === 0
                const isTotal = p.level === -1
                const isNet = p.level === -2
                return (
                  <div key={i} className={`flex justify-between py-1 ${isHeader ? 'font-bold text-zinc-800 mt-2' : isNet ? 'font-bold text-emerald-700 border-t-2 pt-2 text-base' : isTotal ? 'font-semibold text-zinc-700 border-t pt-1' : ''}`} style={!isHeader && !isTotal && !isNet ? { paddingLeft: '1rem' } : {}}>
                    <span>{p.akun}</span>
                    <span>{p.saldo || ''}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">Intercompany</CardTitle><CardDescription>Transaksi antar PT & eliminasi konsolidasi</CardDescription></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">Entitas</th>
                  <th className="pb-2 font-medium">Rekening</th>
                  <th className="pb-2 font-medium text-right">Debet</th>
                  <th className="pb-2 font-medium text-right">Kredit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {intercoData.map((ic, i) => (
                  <tr key={i}>
                    <td className="py-2 font-medium text-zinc-700">{ic.entitas}</td>
                    <td className="py-2 text-zinc-500">{ic.rekening}</td>
                    <td className="py-2 text-right">{ic.debet}</td>
                    <td className="py-2 text-right">{ic.kredit}</td>
                  </tr>
                ))}
                <tr className="border-t font-semibold">
                  <td colSpan={2}>Eliminasi</td>
                  <td className="py-2 text-right">(Rp280.000.000)</td>
                  <td className="py-2 text-right">(Rp280.000.000)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
