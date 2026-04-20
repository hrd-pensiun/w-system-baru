'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/app/(dashboard)/hr/lib/get-current-user'
import { revalidatePath } from 'next/cache'

export type ReimburseCategory = 'medis' | 'transport' | 'makan' | 'perdin' | 'lainnya'
export type ReimburseStatus = 'pending' | 'approved' | 'rejected' | 'paid'
export type PerdinStatus = 'draft' | 'approved' | 'selesai' | 'dibatalkan'

export interface EmployeeOption {
  id: string
  nik: string
  name: string
}

export interface ReimburseRow {
  id: string
  tenant_id: string
  employee_id: string
  category: string
  description: string | null
  amount: number
  receipt_url: string | null
  status: string
  approved_by: string | null
  approved_at: string | null
  paid_at: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  employee: { id: string; nik: string; name: string } | null
  approver: { id: string; name: string } | null
}

export interface PerdinRow {
  id: string
  tenant_id: string
  employee_id: string
  destination: string
  purpose: string | null
  departure_date: string
  return_date: string
  budget: number
  actual_cost: number | null
  status: string
  approved_by: string | null
  approved_at: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  employee: { id: string; nik: string; name: string } | null
  approver: { id: string; name: string } | null
}

export async function getEmployees(): Promise<EmployeeOption[]> {
  const supabase = await createClient()
  const user = await requireUser()
  const { data, error } = await supabase
    .from('employees')
    .select('id, nik, name')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('name')
  if (error) { console.error('getEmployees error:', error); return [] }
  return (data as EmployeeOption[]) ?? []
}

// ── Reimbursements ──
export async function getReimbursements(filters?: { status?: ReimburseStatus }): Promise<ReimburseRow[]> {
  const supabase = await createClient()
  const user = await requireUser()
  let query = supabase
    .from('employee_reimbursements')
    .select('*, employee:employees(id,nik,name), approver:user_profiles!approved_by(id,name)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (filters?.status) query = query.eq('status', filters.status)
  const { data, error } = await query
  if (error) { console.error('getReimbursements error:', error); return [] }
  return (data as unknown as ReimburseRow[]) ?? []
}

export async function createReimbursement(data: {
  employee_id: string
  category: ReimburseCategory
  description?: string
  amount: number
  receipt_url?: string
  notes?: string
}) {
  const supabase = await createClient()
  const user = await requireUser()
  if (!data.employee_id || !data.amount) return { error: 'Karyawan dan jumlah wajib diisi' }
  const payload = {
    tenant_id: user.tenantId,
    employee_id: data.employee_id,
    category: data.category,
    description: data.description ?? null,
    amount: data.amount,
    receipt_url: data.receipt_url ?? null,
    notes: data.notes ?? null,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }
  const { error } = await supabase.from('employee_reimbursements').insert(payload)
  if (error) { console.error('createReimbursement error:', error); return { error: 'Gagal mengajukan reimburse' } }
  revalidatePath('/hr/reimburse')
  return { success: true }
}

export async function approveReimbursement(id: string) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('employee_reimbursements')
    .update({ status: 'approved', approved_by: user.userId, approved_at: new Date().toISOString(), updated_by: user.userId, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) { console.error('approveReimbursement error:', error); return { error: 'Gagal menyetujui reimburse' } }
  revalidatePath('/hr/reimburse')
  return { success: true }
}

export async function rejectReimbursement(id: string) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('employee_reimbursements')
    .update({ status: 'rejected', approved_by: user.userId, updated_by: user.userId, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) { console.error('rejectReimbursement error:', error); return { error: 'Gagal menolak reimburse' } }
  revalidatePath('/hr/reimburse')
  return { success: true }
}

export async function markReimbursePaid(id: string) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('employee_reimbursements')
    .update({ status: 'paid', paid_at: new Date().toISOString(), updated_by: user.userId, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) { console.error('markReimbursePaid error:', error); return { error: 'Gagal menandai reimbursed' } }
  revalidatePath('/hr/reimburse')
  return { success: true }
}

export async function deleteReimbursement(id: string) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('employee_reimbursements')
    .update({ deleted_at: new Date().toISOString(), updated_by: user.userId })
    .eq('id', id)
  if (error) { console.error('deleteReimbursement error:', error); return { error: 'Gagal menghapus reimburse' } }
  revalidatePath('/hr/reimburse')
  return { success: true }
}

// ── Business Trips ──
export async function getBusinessTrips(filters?: { status?: PerdinStatus }): Promise<PerdinRow[]> {
  const supabase = await createClient()
  const user = await requireUser()
  let query = supabase
    .from('business_trips')
    .select('*, employee:employees(id,nik,name), approver:user_profiles!approved_by(id,name)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('departure_date', { ascending: false })
  if (filters?.status) query = query.eq('status', filters.status)
  const { data, error } = await query
  if (error) { console.error('getBusinessTrips error:', error); return [] }
  return (data as unknown as PerdinRow[]) ?? []
}

export async function createBusinessTrip(data: {
  employee_id: string
  destination: string
  purpose?: string
  departure_date: string
  return_date: string
  budget: number
  notes?: string
}) {
  const supabase = await createClient()
  const user = await requireUser()
  if (!data.employee_id || !data.destination || !data.departure_date) return { error: 'Karyawan, tujuan, dan tanggal wajib diisi' }
  const payload = {
    tenant_id: user.tenantId,
    employee_id: data.employee_id,
    destination: data.destination,
    purpose: data.purpose ?? null,
    departure_date: data.departure_date,
    return_date: data.return_date,
    budget: data.budget,
    notes: data.notes ?? null,
    status: 'draft',
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }
  const { error } = await supabase.from('business_trips').insert(payload)
  if (error) { console.error('createBusinessTrip error:', error); return { error: 'Gagal mengajukan perjalanan dinas' } }
  revalidatePath('/hr/reimburse')
  return { success: true }
}

export async function approveBusinessTrip(id: string) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('business_trips')
    .update({ status: 'approved', approved_by: user.userId, approved_at: new Date().toISOString(), updated_by: user.userId, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) { console.error('approveBusinessTrip error:', error); return { error: 'Gagal menyetujui perdin' } }
  revalidatePath('/hr/reimburse')
  return { success: true }
}

export async function completeBusinessTrip(id: string, actualCost?: number) {
  const supabase = await createClient()
  const user = await requireUser()
  const payload: Record<string, unknown> = { status: 'selesai', updated_by: user.userId, updated_at: new Date().toISOString() }
  if (actualCost !== undefined) payload.actual_cost = actualCost
  const { error } = await supabase.from('business_trips').update(payload).eq('id', id)
  if (error) { console.error('completeBusinessTrip error:', error); return { error: 'Gagal menyelesaikan perdin' } }
  revalidatePath('/hr/reimburse')
  return { success: true }
}

export async function cancelBusinessTrip(id: string) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('business_trips')
    .update({ status: 'dibatalkan', updated_by: user.userId, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) { console.error('cancelBusinessTrip error:', error); return { error: 'Gagal membatalkan perdin' } }
  revalidatePath('/hr/reimburse')
  return { success: true }
}

export async function deleteBusinessTrip(id: string) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('business_trips')
    .update({ deleted_at: new Date().toISOString(), updated_by: user.userId })
    .eq('id', id)
  if (error) { console.error('deleteBusinessTrip error:', error); return { error: 'Gagal menghapus perdin' } }
  revalidatePath('/hr/reimburse')
  return { success: true }
}