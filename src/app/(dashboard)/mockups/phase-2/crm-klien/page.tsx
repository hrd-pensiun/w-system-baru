import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Building2,
  CheckCircle2,
  UserPlus,
  UserMinus,
  Search,
  Eye,
  Globe,
  Phone,
  Mail,
  MapPin,
  FileText,
  Link2,
  ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — CRM Klien · Phase 2',
  description: 'Preview desain halaman CRM Klien 360°',
}

// ── Mock Data: Daftar Klien ──
const klienData = [
  { id: 1, nama: 'PT Teknologi Maju', industri: 'IT', kontak: 'Andi Wijaya', email: 'andi@tekno-maju.id', telepon: '021-5551001', totalDeal: 850, status: 'Aktif' },
  { id: 2, nama: 'CV Makmur Jaya', industri: 'Manufaktur', kontak: 'Siti Rahmawati', email: 'siti@makmur-jaya.com', telepon: '031-7762002', totalDeal: 1240, status: 'Aktif' },
  { id: 3, nama: 'PT Global Sentosa', industri: 'Logistik', kontak: 'Budi Prasetyo', email: 'budi@global-sentosa.co.id', telepon: '024-8893003', totalDeal: 560, status: 'Aktif' },
  { id: 4, nama: 'PT Karya Digital Nusantara', industri: 'IT', kontak: 'Dewi Anggraini', email: 'dewi@karyadigital.id', telepon: '021-3344004', totalDeal: 310, status: 'Prospektif' },
  { id: 5, nama: 'PT Sentosa Abadi', industri: 'Konstruksi', kontak: 'Hendra Gunawan', email: 'hendra@sentosa-abadi.com', telepon: '021-2215005', totalDeal: 0, status: 'Prospektif' },
  { id: 6, nama: 'CV Berkah Mandiri', industri: 'Retail', kontak: 'Rina Wulandari', email: 'rina@berkah-mandiri.id', telepon: '031-6676006', totalDeal: 420, status: 'Tidak Aktif' },
  { id: 7, nama: 'PT Nusa Konstruksi', industri: 'Konstruksi', kontak: 'Agus Santoso', email: 'agus@nusa-konstruksi.co.id', telepon: '024-4487007', totalDeal: 2100, status: 'Aktif' },
  { id: 8, nama: 'PT Prima Lestari', industri: 'Keuangan', kontak: 'Lina Hastuti', email: 'lina@prima-lestari.com', telepon: '021-9928008', totalDeal: 0, status: 'Tidak Aktif' },
]

const statusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive'; className: string }> = {
  'Aktif': { label: 'Aktif', variant: 'default', className: 'bg-emerald-600 hover:bg-emerald-700' },
  'Prospektif': { label: 'Prospektif', variant: 'outline', className: 'text-amber-700 border-amber-300 bg-amber-50' },
  'Tidak Aktif': { label: 'Tidak Aktif', variant: 'destructive', className: '' },
}

// ── Mock Data: Detail Klien 360° — PT Teknologi Maju ──
const detailPerusahaan = {
  nama: 'PT Teknologi Maju',
  industri: 'IT',
  sejak: 'Jan 2024',
  alamat: 'Jl. Sudirman No. 45, Lt. 12, Jakarta Pusat 10210',
  npwp: '01.234.567.8-901.000',
  website: 'https://www.tekno-maju.id',
  catatan: 'Klien strategis dengan potensi upselling. Prioritas untuk Q2 2025.',
}

const kontakPersonData = [
  { nama: 'Andi Wijaya', jabatan: 'Direktur Utama', email: 'andi@tekno-maju.id', telepon: '0812-1001-2345', isPrimary: true },
  { nama: 'Rina Saputra', jabatan: 'Finance Manager', email: 'rina.s@tekno-maju.id', telepon: '0813-2002-3456', isPrimary: false },
  { nama: 'Faisal Rahman', jabatan: 'IT Manager', email: 'faisal@tekno-maju.id', telepon: '0878-3003-4567', isPrimary: false },
]

const riwayatTransaksiData = [
  { no: 'QT-2024-001', tipe: 'Quotation', tanggal: '15 Jan 2024', nilai: 250, status: 'Diterima' },
  { no: 'SO-2024-015', tipe: 'Sales Order', tanggal: '22 Feb 2024', nilai: 250, status: 'Selesai' },
  { no: 'QT-2024-048', tipe: 'Quotation', tanggal: '10 Jun 2024', nilai: 350, status: 'Diterima' },
  { no: 'SO-2024-072', tipe: 'Sales Order', tanggal: '01 Jul 2024', nilai: 350, status: 'Dalam Proses' },
]

const networkReferralData = {
  referrer: 'CV Makmur Jaya — Siti Rahmawati',
  hubungan: 'Rekan bisnis dari acara industri 2023',
  perusahaanTerkait: [
    { nama: 'CV Makmur Jaya', tipe: 'Referral Source' },
    { nama: 'PT Karya Digital Nusantara', tipe: 'Anak Perusahaan Klien' },
  ],
}

function formatRupiah(val: number): string {
  if (val === 0) return '—'
  return `Rp ${val.toLocaleString('id-ID')}jt`
}

export default function CrmKlienMockup() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 2 — CRM & Sales" />

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">CRM Klien 360°</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Kelola hubungan klien dan pantau seluruh informasi dalam satu tampilan
          </p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-700">
          <UserPlus className="mr-1.5 h-4 w-4" />
          Tambah Klien
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Klien', value: '128', icon: Building2, sub: 'seluruh terdaftar', accent: 'text-zinc-600' },
          { label: 'Klien Aktif', value: '96', icon: CheckCircle2, sub: '75% dari total', accent: 'text-emerald-600' },
          { label: 'Klien Baru Bulan Ini', value: '7', icon: UserPlus, sub: 'dibanding 5 bulan lalu', accent: 'text-blue-600' },
          { label: 'Churn Rate', value: '4.7%', icon: UserMinus, sub: '6 klien berhenti', accent: 'text-red-600' },
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

      {/* ── Daftar Klien ── */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center gap-1 border-b border-zinc-200">
            {['Daftar Klien', 'Detail Klien 360°'].map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  i === 0
                    ? 'border-b-2 border-zinc-900 text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-10">

          {/* ═══════════════════════════════════════════
              Section 1: Daftar Klien
              ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-zinc-900">Daftar Klien</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input placeholder="Cari perusahaan..." className="w-48 pl-9" />
                </div>
              </div>
            </div>

            <div className="overflow-auto rounded-lg border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Nama Perusahaan</th>
                    <th className="px-4 py-3">Industri</th>
                    <th className="px-4 py-3">Kontak Utama</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Telepon</th>
                    <th className="px-4 py-3 text-right">Total Deal</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {klienData.map((row, idx) => {
                    const s = statusMap[row.status]
                    return (
                      <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-3 text-zinc-500">{idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-zinc-900">{row.nama}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.industri}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.kontak}</td>
                        <td className="px-4 py-3 text-zinc-500 text-xs">{row.email}</td>
                        <td className="px-4 py-3 text-zinc-500 text-xs">{row.telepon}</td>
                        <td className="px-4 py-3 text-right font-medium text-zinc-900">{formatRupiah(row.totalDeal)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={s?.variant || 'secondary'} className={s?.className || ''}>
                            {s?.label || row.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Eye className="mr-1 h-3 w-3" />
                            Detail
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>Menampilkan 1–8 dari 8 klien</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
                <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              Section 2: Detail Klien 360°
              ═══════════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">Detail Klien 360°</h3>
            </div>

            <Card className="border-zinc-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white text-sm font-semibold">
                    TM
                  </div>
                  <div>
                    <CardTitle className="text-base text-zinc-900">{detailPerusahaan.nama}</CardTitle>
                    <CardDescription className="text-sm text-zinc-500">
                      Industri: {detailPerusahaan.industri} · Klien Sejak: {detailPerusahaan.sejak}
                    </CardDescription>
                  </div>
                  <Badge className="ml-auto bg-emerald-600 hover:bg-emerald-700">Aktif</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">

                {/* ── a. Informasi Perusahaan ── */}
                <div className="space-y-3">
                  <h4 className="text-base font-medium text-zinc-900 border-b border-zinc-200 pb-2">
                    Informasi Perusahaan
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                      <div>
                        <p className="text-xs font-medium text-zinc-500">Alamat</p>
                        <p className="text-sm text-zinc-900">{detailPerusahaan.alamat}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                      <div>
                        <p className="text-xs font-medium text-zinc-500">NPWP</p>
                        <p className="text-sm font-mono text-zinc-900">{detailPerusahaan.npwp}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                      <div>
                        <p className="text-xs font-medium text-zinc-500">Website</p>
                        <p className="text-sm text-blue-600 hover:underline">{detailPerusahaan.website}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                      <div>
                        <p className="text-xs font-medium text-zinc-500">Catatan</p>
                        <p className="text-sm text-zinc-700">{detailPerusahaan.catatan}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── b. Kontak Person ── */}
                <div className="space-y-3">
                  <h4 className="text-base font-medium text-zinc-900 border-b border-zinc-200 pb-2">
                    Kontak Person
                  </h4>
                  <div className="overflow-auto rounded-lg border border-zinc-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          <th className="px-4 py-3">Nama</th>
                          <th className="px-4 py-3">Jabatan</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Telepon</th>
                          <th className="px-4 py-3 text-center">Primary</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {kontakPersonData.map((k) => (
                          <tr key={k.nama} className="hover:bg-zinc-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-zinc-900">{k.nama}</td>
                            <td className="px-4 py-3 text-zinc-600">{k.jabatan}</td>
                            <td className="px-4 py-3 text-zinc-500 text-xs">{k.email}</td>
                            <td className="px-4 py-3 text-zinc-500 text-xs">{k.telepon}</td>
                            <td className="px-4 py-3 text-center">
                              {k.isPrimary ? (
                                <Badge className="bg-emerald-600 hover:bg-emerald-700">Ya</Badge>
                              ) : (
                                <span className="text-xs text-zinc-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── c. Riwayat Transaksi ── */}
                <div className="space-y-3">
                  <h4 className="text-base font-medium text-zinc-900 border-b border-zinc-200 pb-2">
                    Riwayat Transaksi
                  </h4>
                  <div className="overflow-auto rounded-lg border border-zinc-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          <th className="px-4 py-3">No</th>
                          <th className="px-4 py-3">Tipe</th>
                          <th className="px-4 py-3">Tanggal</th>
                          <th className="px-4 py-3 text-right">Nilai</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {riwayatTransaksiData.map((t) => {
                          const tStatus: Record<string, { variant: 'default' | 'outline' | 'secondary'; className: string }> = {
                            'Diterima': { variant: 'outline', className: 'text-blue-700 border-blue-300 bg-blue-50' },
                            'Selesai': { variant: 'default', className: 'bg-emerald-600 hover:bg-emerald-700' },
                            'Dalam Proses': { variant: 'outline', className: 'text-amber-700 border-amber-300 bg-amber-50' },
                          }
                          const ts = tStatus[t.status]
                          return (
                            <tr key={t.no} className="hover:bg-zinc-50 transition-colors">
                              <td className="px-4 py-3 font-mono text-xs text-zinc-500">{t.no}</td>
                              <td className="px-4 py-3 text-zinc-700">{t.tipe}</td>
                              <td className="px-4 py-3 text-zinc-600">{t.tanggal}</td>
                              <td className="px-4 py-3 text-right font-medium text-zinc-900">{formatRupiah(t.nilai)}</td>
                              <td className="px-4 py-3">
                                <Badge variant={ts?.variant || 'secondary'} className={ts?.className || ''}>
                                  {t.status}
                                </Badge>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-zinc-300 bg-zinc-50">
                          <td className="px-4 py-3 font-semibold text-zinc-900" colSpan={3}>Total Nilai Transaksi</td>
                          <td className="px-4 py-3 text-right font-bold text-lg text-zinc-900">{formatRupiah(850)}</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-emerald-600 hover:bg-emerald-700">Aktif</Badge>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* ── d. Network / Referral ── */}
                <div className="space-y-3">
                  <h4 className="text-base font-medium text-zinc-900 border-b border-zinc-200 pb-2">
                    Network / Referral
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                      <div>
                        <p className="text-xs font-medium text-zinc-500">Sumber Referral</p>
                        <p className="text-sm text-zinc-900">{networkReferralData.referrer}</p>
                        <p className="mt-1 text-xs text-zinc-400">{networkReferralData.hubungan}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-zinc-500">Perusahaan Terkait</p>
                      {networkReferralData.perusahaanTerkait.map((p) => (
                        <div key={p.nama} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-zinc-400" />
                            <span className="text-sm font-medium text-zinc-900">{p.nama}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{p.tipe}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}