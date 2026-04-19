import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart3, Users, DollarSign, FolderKanban, FileSpreadsheet, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Reporting · Phase 6',
  description: 'Preview desain halaman Laporan & Export',
}

const reportCategories = [
  {
    nama: 'Executive Dashboard',
    icon: BarChart3,
    laporan: [
      { nama: 'Konsolidasi Holding', deskripsi: 'Metric + chart semua entity', format: 'PDF / Excel' },
      { nama: 'Toggle per Entity', deskripsi: 'Bandingkan antar PT', format: 'Interactive' },
    ]
  },
  {
    nama: 'HR Reports',
    icon: Users,
    laporan: [
      { nama: 'Headcount Trend', deskripsi: 'Pertumbuhan karyawan per bulan', format: 'PDF / Excel' },
      { nama: 'Turnover Rate', deskripsi: 'Rasio keluar-masuk karyawan', format: 'PDF' },
      { nama: 'Biaya SDM', deskripsi: 'Total gaji, tunjangan, BPJS per entity', format: 'Excel' },
      { nama: 'Training Completion', deskripsi: 'Status training per departemen', format: 'PDF / Excel' },
    ]
  },
  {
    nama: 'Sales Reports',
    icon: DollarSign,
    laporan: [
      { nama: 'Revenue vs Target', deskripsi: 'Pencapaian penjualan per periode', format: 'PDF / Excel' },
      { nama: 'Pipeline Overview', deskripsi: 'Distribusi pipeline per stage', format: 'Interactive' },
      { nama: 'Konversi Lead', deskripsi: 'Win rate per sumber & sales rep', format: 'PDF' },
    ]
  },
  {
    nama: 'Project Reports',
    icon: FolderKanban,
    laporan: [
      { nama: 'On-Time Delivery', deskripsi: 'Persentase project tepat waktu', format: 'PDF / Excel' },
      { nama: 'Utilization Rate', deskripsi: 'Pemanfaatan resource per bulan', format: 'Excel' },
      { nama: 'Manpower Score Summary', deskripsi: 'Skor rata-rata per project', format: 'PDF' },
    ]
  },
]

const scheduledExports = [
  { nama: 'Laporan Gaji Bulanan', target: 'finance@wsystem.id', jadwal: 'Setiap tgl 1', format: 'Excel', terakhir: '1 Apr 2025' },
  { nama: 'Executive Summary', target: 'direksi@wsystem.id', jadwal: 'Setiap Senin', format: 'PDF', terakhir: '14 Apr 2025' },
  { nama: 'Pipeline Report', target: 'sales@wsystem.id', jadwal: 'Setiap Jumat', format: 'PDF', terakhir: '11 Apr 2025' },
]

export default function ReportingPage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 6 — Reporting & Notifikasi" />
      <div className="grid gap-6">
        {reportCategories.map((cat, ci) => (
          <Card key={ci}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <cat.icon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">{cat.nama}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cat.laporan.map((r, ri) => (
                  <div key={ri} className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3 hover:bg-zinc-50">
                    <div>
                      <p className="font-medium text-zinc-700">{r.nama}</p>
                      <p className="text-xs text-zinc-500">{r.deskripsi}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{r.format}</Badge>
                      <Button size="sm" variant="outline"><Download className="mr-1 h-3 w-3" />Export</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">Scheduled Export</CardTitle><CardDescription>Email otomatis berdasarkan jadwal</CardDescription></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">Laporan</th><th className="pb-2 font-medium">Email Tujuan</th><th className="pb-2 font-medium">Jadwal</th><th className="pb-2 font-medium">Format</th><th className="pb-2 font-medium">Terakhir Kirim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {scheduledExports.map((s, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="py-2 font-medium text-zinc-700">{s.nama}</td>
                    <td className="py-2 text-zinc-500">{s.target}</td>
                    <td className="py-2"><Badge variant="secondary">{s.jadwal}</Badge></td>
                    <td className="py-2 text-zinc-500">{s.format}</td>
                    <td className="py-2 text-zinc-500">{s.terakhir}</td>
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
