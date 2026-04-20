"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Loader2, Save } from "lucide-react"
import {
  getAttendanceSettings,
  updateAttendanceSettings,
  type AttendanceSettingsRow,
} from "./actions"

interface SettingsTabContentProps {
  initialSettings: AttendanceSettingsRow[]
}

export function SettingsTabContent({ initialSettings }: SettingsTabContentProps) {
  const router = useRouter()
  const [settings] = useState<AttendanceSettingsRow[]>(initialSettings)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Use first setting (default tenant-level)
  const setting = settings[0]

  const [form, setForm] = useState({
    late_tolerance_minutes: setting?.late_tolerance_minutes ?? 15,
    early_leave_tolerance_minutes: setting?.early_leave_tolerance_minutes ?? 0,
    geofence_radius_meters: setting?.geofence_radius_meters ?? 100,
    require_photo: setting?.require_photo ?? false,
    require_location: setting?.require_location ?? true,
    auto_clock_out: setting?.auto_clock_out ?? false,
  })

  async function handleSave() {
    setError(null)
    setSuccess(null)

    if (!setting) {
      setError("Pengaturan presensi belum tersedia")
      return
    }

    const result = await updateAttendanceSettings(setting.id, form)

    if (result?.error) {
      setError(result.error)
      return
    }

    startTransition(() => { router.refresh() })
    setSuccess("Pengaturan berhasil disimpan")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Pengaturan Presensi</CardTitle>
        <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending} onClick={handleSave}>
          {pending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
          Simpan
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>
        )}

        <div className="space-y-6">
          {/* Toleransi */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-3">Toleransi Waktu</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="late_tolerance">Toleransi Keterlambatan (menit)</Label>
                <Input
                  id="late_tolerance"
                  type="number"
                  min={0}
                  value={form.late_tolerance_minutes}
                  onChange={(e) => setForm({ ...form, late_tolerance_minutes: Number(e.target.value) })}
                />
                <p className="text-xs text-zinc-400">Karyawan dianggap terlambat jika melebihi batas ini</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="early_leave_tolerance">Toleransi Pulang Awal (menit)</Label>
                <Input
                  id="early_leave_tolerance"
                  type="number"
                  min={0}
                  value={form.early_leave_tolerance_minutes}
                  onChange={(e) => setForm({ ...form, early_leave_tolerance_minutes: Number(e.target.value) })}
                />
                <p className="text-xs text-zinc-400">Batas toleransi pulang sebelum jam kerja berakhir</p>
              </div>
            </div>
          </div>

          {/* Geofence */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-3">Lokasi & Geofence</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="geofence_radius">Radius Geofence (meter)</Label>
                <Input
                  id="geofence_radius"
                  type="number"
                  min={10}
                  value={form.geofence_radius_meters}
                  onChange={(e) => setForm({ ...form, geofence_radius_meters: Number(e.target.value) })}
                />
                <p className="text-xs text-zinc-400">Radius lokasi yang diperbolehkan untuk absensi</p>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-3">Pengaturan Lainnya</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-sm">Wajib Foto</p>
                  <p className="text-xs text-zinc-400">Karyawan harus mengambil foto saat absensi</p>
                </div>
                <Switch
                  checked={form.require_photo}
                  onCheckedChange={(checked) => setForm({ ...form, require_photo: checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-sm">Wajib Lokasi GPS</p>
                  <p className="text-xs text-zinc-400">Karyawan harus mengirim lokasi GPS saat absensi</p>
                </div>
                <Switch
                  checked={form.require_location}
                  onCheckedChange={(checked) => setForm({ ...form, require_location: checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-sm">Auto Clock-out</p>
                  <p className="text-xs text-zinc-400">Otomatis clock-out jika karyawan lupa keluar</p>
                </div>
                <Switch
                  checked={form.auto_clock_out}
                  onCheckedChange={(checked) => setForm({ ...form, auto_clock_out: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}