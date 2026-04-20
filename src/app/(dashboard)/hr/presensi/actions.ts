'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/app/(dashboard)/hr/lib/get-current-user'
import { revalidatePath } from 'next/cache'

// ── Types ──
export type AttendanceStatus = 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'cuti' | 'alpha' | 'dinas_luar'

export interface AttendanceRow {
  id: string
  tenant_id: string
  employee_id: string
  branch_id: string | null
  date: string
  clock_in: string | null
  clock_out: string | null
  clock_in_lat: number | null
  clock_in_lng: number | null
  clock_out_lat: number | null
  clock_out_lng: number | null
  status: string
  late_minutes: number
  early_leave_minutes: number
  work_hours: number
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  employee: { id: string; nik: string; name: string } | null
}

// ── Get Attendances ──
export async function getAttendances(filters?: {
  dateFrom?: string
  dateTo?: string
  status?: AttendanceStatus
  employeeId?: string
}): Promise<AttendanceRow[]> {
  const supabase = await createClient()
  const user = await requireUser()

  let query = supabase
    .from('employee_attendances')
    .select('*, employee:employees(id,nik,name)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('date', { ascending: false })

  if (filters?.dateFrom) query = query.gte('date', filters.dateFrom)
  if (filters?.dateTo) query = query.lte('date', filters.dateTo)
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.employeeId) query = query.eq('employee_id', filters.employeeId)

  const { data, error } = await query

  if (error) {
    console.error('getAttendances error:', error)
    return []
  }
  return (data as unknown as AttendanceRow[]) ?? []
}

// ── Create Attendance ──
export async function createAttendance(data: {
  employee_id: string
  date: string
  clock_in?: string | null
  clock_out?: string | null
  status: AttendanceStatus
  late_minutes?: number
  early_leave_minutes?: number
  work_hours?: number
  notes?: string
}) {
  const supabase = await createClient()
  const user = await requireUser()

  if (!data.employee_id || !data.date || !data.status) {
    return { error: 'Karyawan, tanggal, dan status wajib diisi' }
  }

  const validStatuses: AttendanceStatus[] = ['hadir', 'terlambat', 'izin', 'sakit', 'cuti', 'alpha', 'dinas_luar']
  if (!validStatuses.includes(data.status)) {
    return { error: 'Status tidak valid' }
  }

  const payload = {
    tenant_id: user.tenantId,
    employee_id: data.employee_id,
    date: data.date,
    clock_in: data.clock_in ?? null,
    clock_out: data.clock_out ?? null,
    status: data.status,
    late_minutes: data.late_minutes ?? 0,
    early_leave_minutes: data.early_leave_minutes ?? 0,
    work_hours: data.work_hours ?? 0,
    notes: data.notes ?? null,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }

  const { error } = await supabase.from('employee_attendances').insert(payload)
  if (error) {
    console.error('createAttendance error:', error)
    if (error.code === '23505') return { error: 'Data presensi karyawan ini sudah ada untuk tanggal tersebut' }
    return { error: 'Gagal menyimpan data presensi' }
  }

  revalidatePath('/hr/presensi')
  return { success: true }
}

// ── Update Attendance ──
export async function updateAttendance(
  id: string,
  data: {
    clock_in?: string | null
    clock_out?: string | null
    status?: string
    late_minutes?: number
    early_leave_minutes?: number
    work_hours?: number
    notes?: string | null
  }
) {
  const supabase = await createClient()
  const user = await requireUser()

  const payload: Record<string, unknown> = {
    updated_by: user.userId,
    updated_at: new Date().toISOString(),
  }

  if (data.clock_in !== undefined) payload.clock_in = data.clock_in
  if (data.clock_out !== undefined) payload.clock_out = data.clock_out
  if (data.status !== undefined) payload.status = data.status
  if (data.late_minutes !== undefined) payload.late_minutes = data.late_minutes
  if (data.early_leave_minutes !== undefined) payload.early_leave_minutes = data.early_leave_minutes
  if (data.work_hours !== undefined) payload.work_hours = data.work_hours
  if (data.notes !== undefined) payload.notes = data.notes

  const { error } = await supabase
    .from('employee_attendances')
    .update(payload)
    .eq('id', id)

  if (error) {
    console.error('updateAttendance error:', error)
    return { error: 'Gagal memperbarui data presensi' }
  }

  revalidatePath('/hr/presensi')
  return { success: true }
}

// ── Soft Delete Attendance ──
export async function deleteAttendance(id: string) {
  const supabase = await createClient()
  const user = await requireUser()

  const { error } = await supabase
    .from('employee_attendances')
    .update({
      deleted_at: new Date().toISOString(),
      updated_by: user.userId,
    })
    .eq('id', id)

  if (error) {
    console.error('deleteAttendance error:', error)
    return { error: 'Gagal menghapus data presensi' }
  }

  revalidatePath('/hr/presensi')
  return { success: true }
}

// ── Get Attendance Settings ──
export interface AttendanceSettingsRow {
  id: string
  tenant_id: string
  branch_id: string | null
  work_shift_id: string | null
  work_calendar_id: string | null
  late_tolerance_minutes: number
  early_leave_tolerance_minutes: number
  geofence_radius_meters: number
  require_photo: boolean
  require_location: boolean
  auto_clock_out: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
}

export async function getAttendanceSettings(): Promise<AttendanceSettingsRow[]> {
  const supabase = await createClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from('attendance_settings')
    .select('*')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)

  if (error) {
    console.error('getAttendanceSettings error:', error)
    return []
  }
  return (data as AttendanceSettingsRow[]) ?? []
}

// ── Update Attendance Settings ──
export async function updateAttendanceSettings(
  id: string,
  data: {
    late_tolerance_minutes?: number
    early_leave_tolerance_minutes?: number
    geofence_radius_meters?: number
    require_photo?: boolean
    require_location?: boolean
    auto_clock_out?: boolean
  }
) {
  const supabase = await createClient()
  const user = await requireUser()

  const payload: Record<string, unknown> = {
    updated_by: user.userId,
    updated_at: new Date().toISOString(),
  }

  if (data.late_tolerance_minutes !== undefined) payload.late_tolerance_minutes = data.late_tolerance_minutes
  if (data.early_leave_tolerance_minutes !== undefined) payload.early_leave_tolerance_minutes = data.early_leave_tolerance_minutes
  if (data.geofence_radius_meters !== undefined) payload.geofence_radius_meters = data.geofence_radius_meters
  if (data.require_photo !== undefined) payload.require_photo = data.require_photo
  if (data.require_location !== undefined) payload.require_location = data.require_location
  if (data.auto_clock_out !== undefined) payload.auto_clock_out = data.auto_clock_out

  const { error } = await supabase
    .from('attendance_settings')
    .update(payload)
    .eq('id', id)

  if (error) {
    console.error('updateAttendanceSettings error:', error)
    return { error: 'Gagal memperbarui pengaturan presensi' }
  }

  revalidatePath('/hr/presensi')
  return { success: true }
}