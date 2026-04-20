'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/app/(dashboard)/hr/lib/get-current-user'
import { revalidatePath } from 'next/cache'

// ── Types ──
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export interface LeaveRow {
  id: string
  tenant_id: string
  employee_id: string
  leave_type_id: string
  start_date: string
  end_date: string
  total_days: number
  reason: string | null
  attachment_url: string | null
  status: LeaveStatus
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
  leave_type: { id: string; code: string; name: string } | null
}

// ── Get Leaves ──
export async function getLeaves(filters?: { status?: LeaveStatus }): Promise<LeaveRow[]> {
  const supabase = await createClient()
  const user = await requireUser()

  let query = supabase
    .from('employee_leaves')
    .select('*, employee:employees(id,nik,name), leave_type:hr_leave_types(id,code,name)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('getLeaves error:', error)
    return []
  }
  return (data as unknown as LeaveRow[]) ?? []
}

// ── Create Leave ──
export async function createLeave(data: {
  employee_id: string
  leave_type_id: string
  start_date: string
  end_date: string
  total_days: number
  reason?: string
  attachment_url?: string
}) {
  const supabase = await createClient()
  const user = await requireUser()

  if (!data.employee_id || !data.leave_type_id || !data.start_date || !data.end_date || !data.total_days) {
    return { error: 'Karyawan, tipe cuti, tanggal mulai, tanggal selesai, dan jumlah hari wajib diisi' }
  }

  const payload = {
    tenant_id: user.tenantId,
    employee_id: data.employee_id,
    leave_type_id: data.leave_type_id,
    start_date: data.start_date,
    end_date: data.end_date,
    total_days: data.total_days,
    reason: data.reason ?? null,
    attachment_url: data.attachment_url ?? null,
    status: 'pending' as LeaveStatus,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }

  const { error } = await supabase.from('employee_leaves').insert(payload)
  if (error) {
    console.error('createLeave error:', error)
    return { error: 'Gagal menyimpan pengajuan cuti' }
  }

  revalidatePath('/hr/leave-overtime')
  return { success: true }
}

// ── Update Leave Status ──
export async function updateLeaveStatus(
  id: string,
  status: LeaveStatus,
  approved_by?: string,
  rejection_reason?: string
) {
  const supabase = await createClient()
  const user = await requireUser()

  if (!['approved', 'rejected', 'cancelled'].includes(status)) {
    return { error: 'Status tidak valid' }
  }

  const payload: Record<string, unknown> = {
    status,
    updated_by: user.userId,
    updated_at: new Date().toISOString(),
  }

  if (status === 'approved') {
    payload.approved_by = approved_by ?? user.userId
    payload.approved_at = new Date().toISOString()
    payload.rejection_reason = null
  }

  if (status === 'rejected') {
    payload.approved_by = approved_by ?? user.userId
    payload.approved_at = new Date().toISOString()
    payload.rejection_reason = rejection_reason ?? null
  }

  if (status === 'cancelled') {
    payload.approved_by = null
    payload.approved_at = null
    payload.rejection_reason = null
  }

  const { error } = await supabase.from('employee_leaves').update(payload).eq('id', id)
  if (error) {
    console.error('updateLeaveStatus error:', error)
    return { error: 'Gagal memperbarui status cuti' }
  }

  revalidatePath('/hr/leave-overtime')
  return { success: true }
}

// ── Soft Delete Leave ──
export async function deleteLeave(id: string) {
  const supabase = await createClient()
  const user = await requireUser()

  const { error } = await supabase
    .from('employee_leaves')
    .update({
      deleted_at: new Date().toISOString(),
      updated_by: user.userId,
    })
    .eq('id', id)

  if (error) {
    console.error('deleteLeave error:', error)
    return { error: 'Gagal menghapus pengajuan cuti' }
  }

  revalidatePath('/hr/leave-overtime')
  return { success: true }
}