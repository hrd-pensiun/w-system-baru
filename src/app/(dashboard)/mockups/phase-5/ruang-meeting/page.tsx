import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DoorOpen, Clock, Users, CalendarDays, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Ruang Meeting · Phase 5',
  description: 'Preview desain halaman Booking Ruang Meeting',
}

const ruangList = [
  { id: 'RM-001', nama: 'Ruang Garuda', lantai: 'Lt. 2', kapasitas: 12, fasilitas: ['Projector', 'Whiteboard', 'Video Call'], status: 'Tersedia' },
  { id: 'RM-002', nama: 'Ruang Cendana', lantai: 'Lt. 2', kapasitas: 6, fasilitas: ['Monitor', 'Whiteboard'], status: 'Tersedia' },
  { id: 'RM-003', nama: 'Ruang Merapi', lantai: 'Lt. 3', kapasitas: 20, fasilitas: ['Projector', 'Sound System', 'Video Call', 'Whiteboard'], status: 'Digunakan' },
  { id: 'RM-004', nama: 'Ruang Bromo', lantai: 'Lt. 3', kapasitas: 4, fasilitas: ['Monitor'], status: 'Tersedia' },
]

const bookingHariIni = [
  { ruang: 'Ruang Merapi', pesan: 'Andi Wibowo', subjek: 'Sprint Review Q1', mulai: '09:00', selesai: '11:00', peserta: 8, status: 'Confirmed' },
  { ruang: 'Ruang Garuda', pesan: 'Sari Dewi', subjek: 'Client Meeting - Bank National', mulai: '13:00', selesai: '14:30', peserta: 6, status: 'Confirmed' },
  { ruang: 'Ruang Cendana', pesan: 'Budi Santoso', subjek: 'Tech Sync', mulai: '14:00', selesai: '15:00', peserta: 4, status: 'Confirmed' },
  { ruang: 'Ruang Merapi', pesan: 'HR Dept', subjek: 'Town Hall', mulai: '15:00', selesai: '16:30', peserta: 15, status: 'Pending' },
]

const bookingWeek = [
  { hari: 'Senin', booking: 2 },
  { hari: 'Selasa', booking: 3 },
  { hari: 'Rabu', booking: 4 },
  { hari: 'Kamis', booking: 3 },
  { hari: 'Jumat', booking: 1 },
]

export default function RuangMeetingPage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 5 — Asset & Product Library" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><DoorOpen className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Ruang</p><p className="text-xl font-semibold text-zinc-900">4</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Users className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Tersedia Sekarang</p><p className="text-xl font-semibold text-emerald-600">3</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><CalendarDays className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Booking Hari Ini</p><p className="text-xl font-semibold text-zinc-900">4</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Clock className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Booking Minggu Ini</p><p className="text-xl font-semibold text-zinc-900">13</p></div>
        </div></CardContent></Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle className="text-lg">Daftar Ruang Meeting</CardTitle><CardDescription>Conflict detection otomatis saat booking</CardDescription></div>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" />Booking Baru</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {ruangList.map((r, i) => (
              <div key={i} className="rounded-lg border border-zinc-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div><span className="text-xs text-zinc-400">{r.id}</span><h3 className="font-semibold text-zinc-800">{r.nama}</h3></div>
                  <Badge variant={r.status === 'Tersedia' ? 'default' : 'secondary'}>{r.status}</Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <span>{r.lantai}</span><span>·</span><span><Users className="inline h-3 w-3 mr-1" />{r.kapasitas} orang</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {r.fasilitas.map((f, fi) => (
                    <span key={fi} className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-lg">Booking Hari Ini</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">Ruang</th><th className="pb-2 font-medium">Subjek</th><th className="pb-2 font-medium">Pemesan</th><th className="pb-2 font-medium">Waktu</th><th className="pb-2 font-medium text-center">Peserta</th><th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {bookingHariIni.map((b, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="py-2 font-medium text-zinc-700">{b.ruang}</td>
                    <td className="py-2 text-zinc-700">{b.subjek}</td>
                    <td className="py-2 text-zinc-500">{b.pesan}</td>
                    <td className="py-2 text-zinc-500">{b.mulai} — {b.selesai}</td>
                    <td className="py-2 text-center">{b.peserta}</td>
                    <td className="py-2"><Badge variant={b.status === 'Confirmed' ? 'default' : 'secondary'}>{b.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-lg">Utilization Minggu Ini</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookingWeek.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium text-zinc-700">{d.hari}</span>
                <div className="flex-1 h-6 rounded-full bg-zinc-100">
                  <div className="h-6 rounded-full bg-blue-500 flex items-center justify-end pr-2" style={{ width: `${(d.booking / 5) * 100}%` }}>
                    <span className="text-[10px] font-medium text-white">{d.booking}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
