import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, FileCheck, Clock, DollarSign, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Sales Order · Phase 2',
  description: 'Preview desain halaman Sales Order & Kontrak',
}

// ── Mock Data: Sales Orders ──
const salesOrders = [
  { no: 'SO/WSI/2025/04/0001', klien: 'PT Teknologi Maju', penawaran: 'QUO/WSI/2025/04/0003', tanggal: '15 Apr 2025', items: 4, total: 'Rp330.000.000', status: 'Aktif', milestone: '2/4' },
  { no: 'SO/WSI/2025/03/0005', klien: 'CV Data Prima', penawaran: 'QUO/WSI/2025/03/0008', tanggal: '20 Mar 2025', items: 2, total: 'Rp180.000.000', status: 'Aktif', milestone: '1/2' },
  { no: 'SO/WSI/2025/03/0004', klien: 'PT Solusi Digital', penawaran: 'QUO/WSI/2025/03/0006', tanggal: '12 Mar 2025', items: 3, total: 'Rp250.000.000', status: 'Selesai', milestone: '3/3' },
  { no: 'SO/WSI/2025/02/0003', klien: 'Klinik Sehat Sentosa', penawaran: 'QUO/WSI/2025/02/0004', tanggal: '28 Feb 2025', items: 1, total: 'Rp75.000.000', status: 'Selesai', milestone: '1/1' },
  { no: 'SO/WSI/2025/02/0002', klien: 'PT Sumber Makmur', penawaran: 'QUO/WSI/2025/02/0002', tanggal: '10 Feb 2025', items: 2, total: 'Rp120.000.000', status: 'Dibatalkan', milestone: '0/2' },
  { no: 'SO/WSI/2025/01/0001', klien: 'Bank National', penawaran: 'QUO/WSI/2025/01/0001', tanggal: '5 Jan 2025', items: 5, total: 'Rp500.000.000', status: 'Aktif', milestone: '3/5' },
]

const soStatusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive'; dot: string }> = {
  Aktif: { variant: 'default', dot: 'bg-emerald-500' },
  Selesai: { variant: 'secondary', dot: 'bg-blue-500' },
  Dibatalkan: { variant: 'destructive', dot: 'bg-red-500' },
}

// ── Mock Data: Kontrak ──
const contracts = [
  { no: 'CTR/WSI/2025/001', klien: 'PT Teknologi Maju', so: 'SO/WSI/2025/04/0001', tglMulai: '1 Apr 2025', tglSelesai: '31 Mar 2026', nilai: 'Rp330.000.000', milestoneBayar: '50% / 50%', status: 'Aktif' },
  { no: 'CTR/WSI/2025/002', klien: 'CV Data Prima', so: 'SO/WSI/2025/03/0005', tglMulai: '1 Mar 2025', tglSelesai: '28 Feb 2026', nilai: 'Rp180.000.000', milestoneBayar: '40% / 30% / 30%', status: 'Aktif' },
  { no: 'CTR/WSI/2024/008', klien: 'Bank National', so: 'SO/WSI/2025/01/0001', tglMulai: '1 Jan 2025', tglSelesai: '31 Des 2025', nilai: 'Rp500.000.000', milestoneBayar: '30% / 30% / 40%', status: 'Aktif' },
  { no: 'CTR/WSI/2024/005', klien: 'PT Solusi Digital', so: 'SO/WSI/2025/03/0004', tglMulai: '1 Mar 2025', tglSelesai: '31 Mei 2025', nilai: 'Rp250.000.000', milestoneBayar: '50% / 50%', status: 'Selesai' },
  { no: 'CTR/WSI/2024/003', klien: 'PT Sumber Makmur', so: 'SO/WSI/2025/02/0002', tglMulai: '10 Feb 2025', tglSelesai: '—', nilai: 'Rp120.000.000', milestoneBayar: '—', status: 'Dibatalkan' },
]

// ── Mock Data: Milestone Detail ──
const milestoneDetail = [
  { milestone: 'Down Payment', persen: '30%', nominal: 'Rp99.000.000', status: 'Paid', tglBayar: '5 Apr 2025' },
  { milestone: 'UAT Sign-off', persen: '30%', nominal: 'Rp99.000.000', status: 'Invoiced', tglBayar: '—' },
  { milestone: 'Go Live', persen: '20%', nominal: 'Rp66.000.000', status: 'Pending', tglBayar: '—' },
  { milestone: 'Maintenance 6 Bulan', persen: '20%', nominal: 'Rp66.000.000', status: 'Pending', tglBayar: '—' },
]

const mlStatusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
  Paid: { variant: 'default', label: 'Dibayar' },
  Invoiced: { variant: 'secondary', label: 'Ditagih' },
  Pending: { variant: 'destructive', label: 'Belum' },
}

export default function SalesOrderPage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 2 — CRM & Sales" />

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><ShoppingCart className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Sales Order</p><p className="text-xl font-semibold text-zinc-900">6</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><FileCheck className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">SO Aktif</p><p className="text-xl font-semibold text-zinc-900">3</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Clock className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Milestone Pending</p><p className="text-xl font-semibold text-zinc-900">7</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><DollarSign className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Nilai SO Aktif</p><p className="text-xl font-semibold text-zinc-900">Rp1.010.000.000</p></div>
        </div></CardContent></Card>
      </div>

      {/* ── Daftar Sales Order ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Sales Order</CardTitle>
              <CardDescription>Konversi penawaran menjadi sales order</CardDescription>
            </div>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" />Buat SO</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">No SO</th>
                  <th className="pb-2 font-medium">Klien</th>
                  <th className="pb-2 font-medium">Penawaran</th>
                  <th className="pb-2 font-medium">Tanggal</th>
                  <th className="pb-2 font-medium text-center">Milestone</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {salesOrders.map((so, i) => {
                  const s = soStatusMap[so.status]
                  return (
                    <tr key={i} className="hover:bg-zinc-50">
                      <td className="py-2 font-medium text-blue-600">{so.no}</td>
                      <td className="py-2 text-zinc-700">{so.klien}</td>
                      <td className="py-2 text-zinc-500">{so.penawaran}</td>
                      <td className="py-2 text-zinc-500">{so.tanggal}</td>
                      <td className="py-2 text-center">{so.milestone}</td>
                      <td className="py-2 text-right font-medium">{so.total}</td>
                      <td className="py-2"><Badge variant={s.variant} className="gap-1"><span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{so.status}</Badge></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Kontrak ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kontrak</CardTitle>
          <CardDescription>Upload kontrak dan tracking milestone pembayaran</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">No Kontrak</th>
                  <th className="pb-2 font-medium">Klien</th>
                  <th className="pb-2 font-medium">Sales Order</th>
                  <th className="pb-2 font-medium">Periode</th>
                  <th className="pb-2 font-medium text-right">Nilai</th>
                  <th className="pb-2 font-medium">Milestone Bayar</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {contracts.map((c, i) => {
                  const cs = soStatusMap[c.status]
                  return (
                    <tr key={i} className="hover:bg-zinc-50">
                      <td className="py-2 font-medium text-blue-600">{c.no}</td>
                      <td className="py-2 text-zinc-700">{c.klien}</td>
                      <td className="py-2 text-zinc-500">{c.so}</td>
                      <td className="py-2 text-zinc-500">{c.tglMulai} — {c.tglSelesai}</td>
                      <td className="py-2 text-right font-medium">{c.nilai}</td>
                      <td className="py-2 text-zinc-500">{c.milestoneBayar}</td>
                      <td className="py-2"><Badge variant={cs.variant} className="gap-1"><span className={`h-1.5 w-1.5 rounded-full ${cs.dot}`} />{c.status}</Badge></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Milestone Detail ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detail Milestone — CTR/WSI/2025/001</CardTitle>
          <CardDescription>PT Teknologi Maju · SO/WSI/2025/04/0001</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">Milestone</th>
                  <th className="pb-2 font-medium text-center">%</th>
                  <th className="pb-2 font-medium text-right">Nominal</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Tgl Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {milestoneDetail.map((m, i) => {
                  const ms = mlStatusMap[m.status]
                  return (
                    <tr key={i}>
                      <td className="py-2 font-medium text-zinc-700">{m.milestone}</td>
                      <td className="py-2 text-center">{m.persen}</td>
                      <td className="py-2 text-right font-medium">{m.nominal}</td>
                      <td className="py-2"><Badge variant={ms.variant}>{ms.label}</Badge></td>
                      <td className="py-2 text-zinc-500">{m.tglBayar}</td>
                    </tr>
                  )
                })}
                <tr className="border-t border-zinc-200 font-semibold">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-center">100%</td>
                  <td className="py-2 text-right">Rp330.000.000</td>
                  <td colSpan={2} />
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
