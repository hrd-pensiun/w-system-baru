'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/app/(dashboard)/hr/lib/get-current-user'
import { revalidatePath } from 'next/cache'

// ── Types ──
export type OvertimeStatus = 'pending' | 'approved' | 'rejected' | 'paid'
export type OvertimeDayType = 'weekday' | 'weekend' | 'national_holiday'

export interface OvertimeRow {
  id: string
  tenant_id: string
  employee_id: string
  overtime_date: string
  start_time: string
  end_time: string
  total_hours: number
  day_type: OvertimeDayType
  reason: string | null
  status: OvertimeStatus
  approved_by: string | null
  approved_at: string | null
  rejection_reason: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  employee: { id: string; nik: string; name: string } | null
}

// ── Get Overtimes ──
export async function getOvertimes(filters?: { status?: OvertimeStatus }): Promise<OvertimeRow[]> {
  const supabase = await createClient()
  const user = await requireUser()

  let query = supabase
    .from('employee_overtimes')
    .select('*, employee:employees(id,nik,name)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('overtime_date', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('getOvertimes error:', error)
    return []
  }
  return (data as unknown as OvertimeRow[]) ?? []
}

// ── Create Overtime ──
export async function createOvertime(data: {
  employee_id: string
  overtime_date: string
  start_time: string
  end_time: string
  total_hours: number
  day_type: OvertimeDayType
  reason?: string
}) {
  const supabase = await createClient()
  const user = await requireUser()

  if (!data.employee_id || !data.overtime_date || !data.start_time || !data.end_time || !data.total_hours || !data.day_type) {
    return { error: 'Karyawan, tanggal, jam mulai, jam selesai, jumlah jam, dan tipe hari wajib diisi' }
  }

  if (!['weekday', 'weekend', 'national_holiday'].includes(data.day_type)) {
    return { error: 'Tipe hari tidak valid' }
  }

  const payload = {
    tenant_id: user.tenantId,
    employee_id: data.employee_id,
    overtime_date: data.overtime_date,
    start_time: data.start_time,
    end_time: data.end_time,
    total_hours: data.total_hours,
    day_type: data.day_type,
    reason: data.reason ?? null,
    status: 'pending' as OvertimeStatus,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }

  const { error } = await supabase.from('employee_overtimes').insert(payload)
  if (error) {
    console.error('createOvertime error:', error)
    return { error: 'Gagal menyimpan pengajuan lembur' }
  }

  revalidatePath('/hr/leave-overtime')
  return { success: true }
}

// ── Update Overtime Status ──
export async function updateOvertimeStatus(
  id: string,
  status: OvertimeStatus,
  approved_by?: string
) {
  const supabase = await createClient()
  const user = await requireUser()

  if (!['approved', 'rejected', 'paid'].includes(status)) {
    return { error: 'Status tidak valid' }
  }

  const payload: Record<string, unknown> = {
    status,
    updated_by: user.userId,
    updated_at: new Date().toISOString(),
  }

  if (status === 'approved' || status === 'rejected') {
    payload.approved_by = approved_by ?? user.userId
    payload.approved_at = new Date().toISOString()
  }

  if (status === 'rejected') {
    // keep rejection_reason if needed — can be extended
  }

  const { error } = await supabase.from('employee_overtimes').update(payload).eq('id', id)
  if (error) {
    console.error('updateOvertimeStatus error:', error)
    return { error: 'Gagal memperbarui status lembur' }
  }

  revalidatePath('/hr/leave-overtime')
  return { success: true }
}

// ── Soft Delete Overtime ──
export async function deleteOvertime(id: string) {
  const supabase = await createClient()
  const user = await requireUser()

  const { error } = await supabase
    .from('employee_overtimes')
    .update({
      deleted_at: new Date().toISOString(),
      updated_by: user.userId,
    })
    .eq('id', id)

  if (error) {
    console.error('deleteOvertime error:', error)
    return { error: 'Gagal menghapus pengajuan lembur' }
  }

  revalidatePath('/hr/leave-overtime')
  return { success: true }
}