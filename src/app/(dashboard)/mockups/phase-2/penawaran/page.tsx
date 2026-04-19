import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  FileText,
  Edit3,
  Send,
  CheckCircle2,
  Plus,
  Eye,
  Printer,
  Copy,
  History,
  XCircle,
  Clock,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Penawaran · Phase 2',
  description: 'Preview desain halaman Penawaran/Quotation',
}

// ── Helper ──
function fmtRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID')
}

// ── Mock Data: Daftar Penawaran ──
const penawaranData = [
  { noQuo: 'QUO/WSI/2025/04/0001', klien: 'PT Maju Jaya', tanggal: '2 Apr 2025', lineItems: 3, subtotal: 85_000_000, is_pkp: true, status: 'Terkirim' },
  { noQuo: 'QUO/WSI/2025/04/0002', klien: 'CV Berkah Sentosa', tanggal: '3 Apr 2025', lineItems: 2, subtotal: 45_000_000, is_pkp: true, status: 'Diterima' },
  { noQuo: 'QUO/WSI/2025/04/0003', klien: 'PT Teknologi Maju', tanggal: '5 Apr 2025', lineItems: 4, subtotal: 202_000_000, is_pkp: true, status: 'Terkirim' },
  { noQuo: 'QUO/WSI/2025/04/0004', klien: 'PT Global Inovasi', tanggal: '7 Apr 2025', lineItems: 1, subtotal: 25_000_000, is_pkp: true, status: 'Draft' },
  { noQuo: 'QUO/WSI/2025/04/0005', klien: 'CV Mandiri Teknik', tanggal: '8 Apr 2025', lineItems: 3, subtotal: 120_000_000, is_pkp: true, status: 'Ditolak' },
  { noQuo: 'QUO/WSI/2025/04/0006', klien: 'PT Sentosa Abadi', tanggal: '10 Apr 2025', lineItems: 2, subtotal: 60_000_000, is_pkp: true, status: 'Diterima' },
  { noQuo: 'QUO/WSI/2025/04/0007', klien: 'PT Cipta Karya', tanggal: '12 Apr 2025', lineItems: 5, subtotal: 350_000_000, is_pkp: true, status: 'Kadaluarsa' },
  { noQuo: 'QUO/WSI/2025/04/0008', klien: 'CV Prima Sejahtera', tanggal: '14 Apr 2025', lineItems: 1, subtotal: 15_000_000, is_pkp: true, status: 'Draft' },
]

const statusStyle: Record<string, { variant: 'default' | 'outline' | 'secondary' | 'destructive'; dotColor: string }> = {
  Draft: { variant: 'outline', dotColor: 'bg-amber-500' },
  Terkirim: { variant: 'outline', dotColor: 'bg-blue-500' },
  Diterima: { variant: 'default', dotColor: 'bg-emerald-500' },
  Ditolak: { variant: 'destructive', dotColor: 'bg-red-500' },
  Kadaluarsa: { variant: 'secondary', dotColor: 'bg-zinc-400' },
}

// ── Mock Data: Detail Penawaran (QUO/WSI/2025/04/0003) ──
const detailPenawaran = {
  noQuo: 'QUO/WSI/2025/04/0003',
  klien: 'PT Teknologi Maju',
  tanggal: '5 Apr 2025',
  is_pkp: true,
  lineItems: [
    { item: 'Pengembangan Web App', deskripsi: 'Pembuatan aplikasi web berbasis Next.js dengan fitur dashboard & manajemen data', qty: 1, satuan: 'Paket', hargaSatuan: 150_000_000, diskon: 0, total: 150_000_000 },
    { item: 'Maintenance 1 Tahun', deskripsi: 'Pemeliharaan sistem, bug fixing, dan update keamanan selama 12 bulan', qty: 1, satuan: 'Tahun', hargaSatuan: 30_000_000, diskon: 3_000_000, total: 27_000_000 },
    { item: 'Training', deskripsi: 'Pelatihan penggunaan sistem untuk 10 orang tim operasional', qty: 3, satuan: 'Sesi', hargaSatuan: 5_000_000, diskon: 0, total: 15_000_000 },
    { item: 'Konsultasi', deskripsi: 'Konsultasi arsitektur teknis dan roadmap digital transformation', qty: 5, satuan: 'Hari', hargaSatuan: 2_000_000, diskon: 0, total: 10_000_000 },
  ],
  subtotal: 202_000_000,
  versi: [
    { ver: 'v1', tanggal: '5 Apr 2025', status: 'Draft', keterangan: 'Penawaran awal' },
    { ver: 'v2', tanggal: '8 Apr 2025', status: 'Revised', keterangan: 'Revisi harga maintenance' },
    { ver: 'v3', tanggal: '10 Apr 2025', status: 'Terkirim', keterangan: 'Penawaran final dikirim ke klien' },
  ],
}

const detailSubtotal = detailPenawaran.lineItems.reduce((s, i) => s + i.total, 0)
const detailPPN = detailPenawaran.is_pkp ? Math.round(detailSubtotal * 0.12) : 0
const detailGrandTotal = detailSubtotal + detailPPN

// ── Metric values derived from data ──
const totalPenawaran = penawaranData.length
const draftCount = penawaranData.filter((p) => p.status === 'Draft').length
const terkirimCount = penawaranData.filter((p) => p.status === 'Terkirim').length
const diterimaCount = penawaranData.filter((p) => p.status === 'Diterima').length

export default function PenawaranMockup() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 2 — CRM & Sales" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Penawaran</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola quotation & penawaran harga untuk klien
          </p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-700">
          <Plus className="mr-1.5 h-4 w-4" />
          Buat Penawaran
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Penawaran', value: String(totalPenawaran), icon: FileText, sub: 'bulan ini', accent: 'text-zinc-600' },
          { label: 'Draft', value: String(draftCount), icon: Edit3, sub: 'belum dikirim', accent: 'text-amber-600' },
          { label: 'Terkirim', value: String(terkirimCount), icon: Send, sub: 'menunggu respons', accent: 'text-blue-600' },
          { label: 'Diterima', value: String(diterimaCount), icon: CheckCircle2, sub: 'disetujui klien', accent: 'text-emerald-600' },
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

      {/* ═══════════════════════════════════════════
          Section 1: Daftar Penawaran
          ═══════════════════════════════════════════ */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-zinc-900">Daftar Penawaran</CardTitle>
            <Input placeholder="Cari penawaran..." className="w-56 pl-3" />
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="overflow-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-3">No Quo</th>
                  <th className="px-4 py-3">Klien</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-center">Line Items</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  <th className="px-4 py-3 text-right">PPN 12%</th>
                  <th className="px-4 py-3 text-right">Grand Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {penawaranData.map((row) => {
                  const ppn = row.is_pkp ? Math.round(row.subtotal * 0.12) : 0
                  const grandTotal = row.subtotal + ppn
                  const sInfo = statusStyle[row.status]
                  return (
                    <tr key={row.noQuo} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-zinc-600">{row.noQuo}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{row.klien}</td>
                      <td className="px-4 py-3 text-zinc-600">{row.tanggal}</td>
                      <td className="px-4 py-3 text-center text-zinc-600">{row.lineItems}</td>
                      <td className="px-4 py-3 text-right text-zinc-700 font-mono text-xs">{fmtRp(row.subtotal)}</td>
                      <td className="px-4 py-3 text-right text-zinc-500 font-mono text-xs">{row.is_pkp ? fmtRp(ppn) : '—'}</td>
                      <td className="px-4 py-3 text-right font-semibold text-zinc-900 font-mono text-xs">{fmtRp(grandTotal)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={sInfo?.variant || 'secondary'}>
                          <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${sInfo?.dotColor}`} />
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            <Eye className="mr-1 h-3 w-3" />
                            Detail
                          </Button>
                          {row.status === 'Draft' && (
                            <Button variant="outline" size="sm" className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                              <Send className="mr-1 h-3 w-3" />
                              Kirim
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-zinc-500">
            <span>Menampilkan 1–8 dari 8 penawaran</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
              <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════
          Section 2: Detail Penawaran
          ═══════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium text-zinc-900">
                Detail Penawaran
              </CardTitle>
              <CardDescription className="mt-1">
                {detailPenawaran.noQuo} — {detailPenawaran.klien}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Printer className="mr-1 h-3 w-3" />
                Cetak
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Copy className="mr-1 h-3 w-3" />
                Duplikat
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ── Info Ringkas ── */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <span className="text-zinc-400">No Penawaran</span>
              <p className="font-mono text-xs font-medium text-zinc-800">{detailPenawaran.noQuo}</p>
            </div>
            <div>
              <span className="text-zinc-400">Klien</span>
              <p className="font-medium text-zinc-800">{detailPenawaran.klien}</p>
            </div>
            <div>
              <span className="text-zinc-400">Tanggal</span>
              <p className="text-zinc-800">{detailPenawaran.tanggal}</p>
            </div>
            <div>
              <span className="text-zinc-400">Status PKP</span>
              <p className="text-zinc-800">{detailPenawaran.is_pkp ? '✓ PKP — PPN 12%' : 'Non-PKP'}</p>
            </div>
          </div>

          {/* ── Line Items Table ── */}
          <div className="overflow-auto rounded-lg border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Deskripsi</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3">Satuan</th>
                  <th className="px-4 py-3 text-right">Harga Satuan</th>
                  <th className="px-4 py-3 text-right">Diskon</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {detailPenawaran.lineItems.map((li, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-900">{li.item}</td>
                    <td className="px-4 py-3 text-zinc-500 max-w-xs">{li.deskripsi}</td>
                    <td className="px-4 py-3 text-center text-zinc-700">{li.qty}</td>
                    <td className="px-4 py-3 text-zinc-600">{li.satuan}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-zinc-700">{fmtRp(li.hargaSatuan)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-red-500">
                      {li.diskon > 0 ? `- ${fmtRp(li.diskon)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-zinc-900">{fmtRp(li.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Summary ── */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-mono text-xs text-zinc-800">{fmtRp(detailSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">PPN 12%</span>
                <span className="font-mono text-xs text-zinc-800">{fmtRp(detailPPN)}</span>
              </div>
              <div className="border-t border-zinc-200 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-900">Grand Total</span>
                  <span className="font-mono text-sm font-bold text-zinc-900">{fmtRp(detailGrandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Version History ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-zinc-400" />
              <h4 className="text-sm font-medium text-zinc-700">Riwayat Versi</h4>
            </div>
            <div className="flex flex-col gap-2">
              {detailPenawaran.versi.map((v) => (
                <div
                  key={v.ver}
                  className="flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm"
                >
                  <span className="inline-flex h-6 w-10 items-center justify-center rounded bg-zinc-200 text-xs font-bold text-zinc-700">
                    {v.ver}
                  </span>
                  <span className="text-zinc-600">{v.tanggal}</span>
                  <Badge
                    variant={v.status === 'Terkirim' ? 'outline' : 'secondary'}
                    className={
                      v.status === 'Terkirim'
                        ? 'border-blue-200 text-blue-700 bg-blue-50'
                        : v.status === 'Revised'
                          ? 'border-amber-200 text-amber-700 bg-amber-50'
                          : ''
                    }
                  >
                    {v.status}
                  </Badge>
                  <span className="text-zinc-400">—</span>
                  <span className="text-zinc-500">{v.keterangan}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════
          Section 3: Buat Penawaran Baru
          ═══════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-zinc-900">Buat Penawaran Baru</CardTitle>
          <CardDescription>Isi informasi dasar untuk membuat penawaran baru</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Klien */}
            <div className="space-y-1.5">
              <Label htmlFor="klien">Klien</Label>
              <select
                id="klien"
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Pilih klien...</option>
                <option value="pt-maju-jaya">PT Maju Jaya</option>
                <option value="cv-berkah">CV Berkah Sentosa</option>
                <option value="pt-teknologi-maju">PT Teknologi Maju</option>
                <option value="pt-global-inovasi">PT Global Inovasi</option>
                <option value="cv-mandiri">CV Mandiri Teknik</option>
                <option value="pt-sentosa">PT Sentosa Abadi</option>
                <option value="pt-cipta-karya">PT Cipta Karya</option>
                <option value="cv-prima">CV Prima Sejahtera</option>
              </select>
            </div>

            {/* Tanggal */}
            <div className="space-y-1.5">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input id="tanggal" type="date" defaultValue="2025-04-19" />
            </div>

            {/* Catatan */}
            <div className="space-y-1.5">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea id="catatan" placeholder="Catatan tambahan untuk penawaran..." className="min-h-[38px] text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-zinc-200 pt-4">
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700">
              <Plus className="mr-1.5 h-4 w-4" />
              Buat Penawaran
            </Button>
            <Button variant="outline">Batal</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}