'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { History, Search, CheckCircle2, XCircle, Clock } from 'lucide-react'
import type { TrainingProgramRow, TrainingParticipantRow } from './actions'

const statusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive'; className?: string }> = {
  terdaftar: { label: 'Terdaftar', variant: 'outline', className: 'text-zinc-600 border-zinc-300 bg-zinc-50' },
  sedang: { label: 'Sedang Berlangsung', variant: 'default', className: 'bg-blue-600 hover:bg-blue-700' },
  lulus: { label: 'Lulus', variant: 'default', className: 'bg-emerald-600 hover:bg-emerald-700' },
  tidak_lulus: { label: 'Tidak Lulus', variant: 'destructive', className: 'bg-red-600 hover:bg-red-700' },
}

const programTypeMap: Record<string, { label: string; color: string }> = {
  internal: { label: 'Internal', color: 'bg-zinc-100 text-zinc-700' },
  eksternal: { label: 'Eksternal', color: 'bg-blue-100 text-blue-700' },
  sertifikasi: { label: 'Sertifikasi', color: 'bg-amber-100 text-amber-700' },
}

export function RiwayatTabContent({
  initialParticipants,
  initialPrograms,
  employees,
}: {
  initialParticipants: TrainingParticipantRow[]
  initialPrograms: TrainingProgramRow[]
  employees: { id: string; name: string; nik: string; department_id?: string | null }[]
}) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const programMap = new Map(initialPrograms.map((p) => [p.id, p]))
  const empMap = new Map(employees.map((e) => [e.id, e]))

  // Enrich participants with program + employee info
  const data = initialParticipants.map((p) => ({
    ...p,
    program: programMap.get(p.program_id),
    employee: empMap.get(p.employee_id),
  }))

  // Filter
  const filtered = data.filter((r) => {
    const matchSearch = !search ||
      r.employee?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.employee?.nik?.toLowerCase().includes(search.toLowerCase()) ||
      r.program?.title?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    const matchType = filterType === 'all' || r.program?.type === filterType
    return matchSearch && matchStatus && matchType
  })

  // Stats
  const total = data.length
  const lulus = data.filter((r) => r.status === 'lulus').length
  const sedang = data.filter((r) => r.status === 'sedang').length
  const gagal = data.filter((r) => r.status === 'tidak_lulus').length
  const pctLulus = total > 0 ? Math.round((lulus / total) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Partisipasi', value: String(total), icon: History, accent: 'text-zinc-600' },
          { label: 'Sedang Berlangsung', value: String(sedang), icon: Clock, accent: 'text-blue-600' },
          { label: 'Lulus', value: String(lulus), icon: CheckCircle2, accent: 'text-emerald-600' },
          { label: 'Tidak Lulus', value: String(gagal), icon: XCircle, accent: 'text-red-600' },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{m.label}</p>
                <m.icon className={`h-4 w-4 ${m.accent}`} />
              </div>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Passing rate bar */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Tingkat Kelulusan</span>
          <span className={`font-semibold ${pctLulus >= 75 ? 'text-emerald-600' : pctLulus >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
            {pctLulus}%
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full rounded-full transition-all ${pctLulus >= 75 ? 'bg-emerald-500' : pctLulus >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${pctLulus}%` }}
          />
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input placeholder="Cari karyawan / program..." className="w-64 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={(v) => v && setFilterStatus(v)}>
          <SelectTrigger className="w-40 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="terdaftar">Terdaftar</SelectItem>
            <SelectItem value="sedang">Sedang Berlangsung</SelectItem>
            <SelectItem value="lulus">Lulus</SelectItem>
            <SelectItem value="tidak_lulus">Tidak Lulus</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(v) => v && setFilterType(v)}>
          <SelectTrigger className="w-36 text-xs"><SelectValue placeholder="Tipe" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="eksternal">Eksternal</SelectItem>
            <SelectItem value="sertifikasi">Sertifikasi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <th className="px-4 py-3">NIK</th>
              <th className="px-4 py-3">Nama Karyawan</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3 text-center">Tipe</th>
              <th className="px-4 py-3 text-center">Tanggal</th>
              <th className="px-4 py-3 text-center">Skor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sertifikat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((row) => {
              const st = statusMap[row.status] ?? statusMap.terdaftar
              const pt = programTypeMap[row.program?.type ?? 'internal'] ?? programTypeMap.internal
              return (
                <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.employee?.nik ?? '—'}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{row.employee?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-600">{row.program?.title ?? '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${pt.color}`}>
                      {pt.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-500">
                    {row.program?.end_date
                      ? new Date(row.program.end_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.score !== null ? (
                      <span className={`font-semibold ${row.score >= 75 ? 'text-emerald-600' : row.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {row.score}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3"><Badge variant={st.variant} className={st.className}>{st.label}</Badge></td>
                  <td className="px-4 py-3">
                    {row.certificate_url ? (
                      <span className="text-xs text-blue-600 font-mono truncate max-w-[120px] inline-block">{row.certificate_url}</span>
                    ) : (
                      <span className="text-xs text-zinc-400">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-zinc-400">Tidak ada riwayat training</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}