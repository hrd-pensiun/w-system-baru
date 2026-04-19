import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, PenLine, ArrowRightLeft, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — COA & Jurnal · Phase 4',
  description: 'Preview desain halaman Chart of Accounts & Jurnal',
}

const coaItems = [
  { kode: '1-0000', nama: 'ASET', level: 0, tipe: 'Header', saldo: '' },
  { kode: '1-1000', nama: 'Kas & Bank', level: 1, tipe: 'Header', saldo: '' },
  { kode: '1-1100', nama: 'Kas Kecil', level: 2, tipe: 'Debit', saldo: 'Rp25.000.000' },
  { kode: '1-1200', nama: 'Bank BCA', level: 2, tipe: 'Debit', saldo: 'Rp450.000.000' },
  { kode: '1-1300', nama: 'Bank Mandiri', level: 2, tipe: 'Debit', saldo: 'Rp180.000.000' },
  { kode: '1-2000', nama: 'Piutang Usaha', level: 1, tipe: 'Header', saldo: '' },
  { kode: '1-2100', nama: 'Piutang Klien', level: 2, tipe: 'Debit', saldo: 'Rp320.000.000' },
  { kode: '2-0000', nama: 'KEWAJIBAN', level: 0, tipe: 'Header', saldo: '' },
  { kode: '2-1000', nama: 'Utang Usaha', level: 1, tipe: 'Header', saldo: '' },
  { kode: '2-1100', nama: 'Utang Vendor', level: 2, tipe: 'Kredit', saldo: 'Rp85.000.000' },
  { kode: '2-2000', nama: 'Utang Gaji', level: 1, tipe: 'Header', saldo: '' },
  { kode: '2-2100', nama: 'Gaji Belum Dibayar', level: 2, tipe: 'Kredit', saldo: 'Rp156.500.000' },
  { kode: '3-0000', nama: 'EKUITAS', level: 0, tipe: 'Header', saldo: '' },
  { kode: '3-1000', nama: 'Modal Disetor', level: 2, tipe: 'Kredit', saldo: 'Rp500.000.000' },
  { kode: '4-0000', nama: 'PENDAPATAN', level: 0, tipe: 'Header', saldo: '' },
  { kode: '4-1000', nama: 'Pendapatan Jasa', level: 2, tipe: 'Kredit', saldo: 'Rp780.000.000' },
  { kode: '5-0000', nama: 'BEBAN', level: 0, tipe: 'Header', saldo: '' },
  { kode: '5-1000', nama: 'Beban Gaji', level: 2, tipe: 'Debit', saldo: 'Rp520.000.000' },
  { kode: '5-2000', nama: 'Beban Operasional', level: 2, tipe: 'Debit', saldo: 'Rp95.000.000' },
]

const jurnalEntries = [
  { no: 'JR/2025/04/0001', tgl: '30 Apr 2025', deskripsi: 'Pencatatan gaji April 2025', debet: 'Rp156.500.000', kredit: 'Rp156.500.000', tipe: 'Auto', sumber: 'Payroll' },
  { no: 'JR/2025/04/0002', tgl: '28 Apr 2025', deskripsi: 'Penerimaan invoice INV/WSI/2025/04/0003', debet: 'Rp165.000.000', kredit: 'Rp165.000.000', tipe: 'Auto', sumber: 'Invoice' },
  { no: 'JR/2025/04/0003', tgl: '25 Apr 2025', deskripsi: 'Pembayaran vendor hosting', debet: 'Rp12.000.000', kredit: 'Rp12.000.000', tipe: 'Manual', sumber: '-' },
  { no: 'JR/2025/04/0004', tgl: '20 Apr 2025', deskripsi: 'Pembelian ATK', debet: 'Rp2.500.000', kredit: 'Rp2.500.000', tipe: 'Manual', sumber: '-' },
  { no: 'JR/2025/03/0012', tgl: '31 Mar 2025', deskripsi: 'Pencatatan gaji Maret 2025', debet: 'Rp156.500.000', kredit: 'Rp156.500.000', tipe: 'Auto', sumber: 'Payroll' },
]

const jurnalDetail = [
  { akun: '5-1000 Beban Gaji', debet: 'Rp156.500.000', kredit: '-' },
  { akun: '2-2100 Utang Gaji', debet: '-', kredit: 'Rp156.500.000' },
]

export default function COAJurnalPage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 4 — Finance" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><BookOpen className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Akun COA</p><p className="text-xl font-semibold text-zinc-900">19</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><PenLine className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Jurnal Bulan Ini</p><p className="text-xl font-semibold text-zinc-900">4</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><ArrowRightLeft className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Auto-Journal</p><p className="text-xl font-semibold text-zinc-900">2</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><BookOpen className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Entity</p><p className="text-lg font-semibold text-zinc-900">PT W.System Indonesia</p></div>
        </div></CardContent></Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle className="text-lg">Chart of Accounts</CardTitle><CardDescription>Hierarki akun per entity</CardDescription></div>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" />Akun Baru</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">Kode</th>
                  <th className="pb-2 font-medium">Nama Akun</th>
                  <th className="pb-2 font-medium">Tipe</th>
                  <th className="pb-2 font-medium text-right">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {coaItems.map((a, i) => (
                  <tr key={i} className={a.level === 0 ? 'bg-zinc-50 font-semibold' : a.level === 1 ? 'bg-zinc-25' : ''}>
                    <td className="py-1.5" style={{ paddingLeft: `${a.level * 20}px` }}>{a.kode}</td>
                    <td className="py-1.5">{a.nama}</td>
                    <td className="py-1.5"><Badge variant={a.tipe === 'Header' ? 'secondary' : a.tipe === 'Debit' ? 'outline' : 'default'} className="text-xs">{a.tipe}</Badge></td>
                    <td className="py-1.5 text-right">{a.saldo || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle className="text-lg">Jurnal Umum</CardTitle><CardDescription>Pencatatan transaksi keuangan</CardDescription></div>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" />Jurnal Manual</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">No Jurnal</th>
                  <th className="pb-2 font-medium">Tanggal</th>
                  <th className="pb-2 font-medium">Deskripsi</th>
                  <th className="pb-2 font-medium">Tipe</th>
                  <th className="pb-2 font-medium">Sumber</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {jurnalEntries.map((j, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="py-2 font-medium text-blue-600">{j.no}</td>
                    <td className="py-2 text-zinc-500">{j.tgl}</td>
                    <td className="py-2 text-zinc-700">{j.deskripsi}</td>
                    <td className="py-2"><Badge variant={j.tipe === 'Auto' ? 'default' : 'secondary'}>{j.tipe}</Badge></td>
                    <td className="py-2 text-zinc-500">{j.sumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detail Jurnal — JR/2025/04/0001</CardTitle>
          <CardDescription>Pencatatan gaji April 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">Akun</th>
                  <th className="pb-2 font-medium text-right">Debet</th>
                  <th className="pb-2 font-medium text-right">Kredit</th>
                </tr>
              </thead>
              <tbody>
                {jurnalDetail.map((d, i) => (
                  <tr key={i}>
                    <td className="py-2 font-medium text-zinc-700">{d.akun}</td>
                    <td className="py-2 text-right">{d.debet}</td>
                    <td className="py-2 text-right">{d.kredit}</td>
                  </tr>
                ))}
                <tr className="border-t border-zinc-200 font-semibold">
                  <td className="py-2">TOTAL</td>
                  <td className="py-2 text-right">Rp156.500.000</td>
                  <td className="py-2 text-right">Rp156.500.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
