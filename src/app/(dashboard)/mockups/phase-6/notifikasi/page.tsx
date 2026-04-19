import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, Mail, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Notifikasi · Phase 6',
  description: 'Preview desain halaman In-App & Email Notifikasi',
}

const notifikasiInApp = [
  { tgl: '19 Apr 2025 09:00', judul: 'Kontrak AST-007 berakhir dalam 5 hari', tipe: 'Alert', dibaca: false, icon: 'kontrak' },
  { tgl: '18 Apr 2025 16:30', judul: 'Pengajuan cuti Ahmad Rizal butuh approval', tipe: 'Approval', dibaca: false, icon: 'cuti' },
  { tgl: '18 Apr 2025 14:00', judul: 'Slip gaji April 2025 sudah tersedia', tipe: 'Info', dibaca: true, icon: 'payroll' },
  { tgl: '17 Apr 2025 10:15', judul: 'Invoice INV/WSI/2025/03/0005 jatuh tempo', tipe: 'Alert', dibaca: true, icon: 'invoice' },
  { tgl: '15 Apr 2025 08:00', judul: 'Training Cyber Security dimulai besok', tipe: 'Reminder', dibaca: true, icon: 'training' },
  { tgl: '14 Apr 2025 17:00', judul: 'Project PRJ-002 status berubah ke At Risk', tipe: 'Alert', dibaca: true, icon: 'project' },
  { tgl: '10 Apr 2025 09:30', judul: 'Carry-over cuti 2024: 3 hari tersisa', tipe: 'Reminder', dibaca: true, icon: 'cuti' },
]

const tipeConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  Alert: { variant: 'destructive', color: 'text-red-600' },
  Approval: { variant: 'default', color: 'text-blue-600' },
  Info: { variant: 'secondary', color: 'text-zinc-600' },
  Reminder: { variant: 'outline', color: 'text-amber-600' },
}

const emailTemplates = [
  { nama: 'Slip Gaji Bulanan', trigger: 'Payroll approved', penerima: 'Karyawan', provider: 'Resend' },
  { nama: 'Approval Cuti', trigger: 'Pengajuan cuti baru', penerima: 'Atasan/HR', provider: 'Resend' },
  { nama: 'Kontrak Alert H-30', trigger: 'pg_cron harian', penerima: 'HR Admin', provider: 'Resend' },
  { nama: 'Kontrak Alert H-7', trigger: 'pg_cron harian', penerima: 'HR + Atasan', provider: 'Resend' },
  { nama: 'Invoice Jatuh Tempo', trigger: 'pg_cron harian', penerima: 'Finance', provider: 'Resend' },
  { nama: 'Carry-over Cuti', trigger: 'pg_cron 31 Des', penerima: 'HR Admin', provider: 'Resend' },
]

export default function NotifikasiPage() {
  const unread = notifikasiInApp.filter(n => !n.dibaca).length
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 6 — Reporting & Notifikasi" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Bell className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Notifikasi</p><p className="text-xl font-semibold text-zinc-900">7</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600"><AlertTriangle className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Belum Dibaca</p><p className="text-xl font-semibold text-red-600">{unread}</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Mail className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Email Template</p><p className="text-xl font-semibold text-zinc-900">6</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Clock className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Scheduled Events</p><p className="text-xl font-semibold text-zinc-900">3</p></div>
        </div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">In-App Notifikasi</CardTitle><CardDescription>Supabase Realtime, bell icon, unread count</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {notifikasiInApp.map((n, i) => {
              const tc = tipeConfig[n.tipe]
              return (
                <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${!n.dibaca ? 'border-blue-200 bg-blue-50/50' : 'border-zinc-100'}`}>
                  <div className="mt-0.5"><Bell className={`h-4 w-4 ${tc.color}`} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm ${!n.dibaca ? 'font-semibold text-zinc-900' : 'text-zinc-600'}`}>{n.judul}</p>
                      <Badge variant={tc.variant} className="text-xs shrink-0">{n.tipe}</Badge>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{n.tgl}</p>
                  </div>
                  {!n.dibaca && <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-lg">Email Notification Templates</CardTitle><CardDescription>Email via Resend, template per event</CardDescription></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 font-medium">Template</th><th className="pb-2 font-medium">Trigger</th><th className="pb-2 font-medium">Penerima</th><th className="pb-2 font-medium">Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {emailTemplates.map((e, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="py-2 font-medium text-zinc-700">{e.nama}</td>
                    <td className="py-2 text-zinc-500">{e.trigger}</td>
                    <td className="py-2 text-zinc-500">{e.penerima}</td>
                    <td className="py-2"><Badge variant="outline">{e.provider}</Badge></td>
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
