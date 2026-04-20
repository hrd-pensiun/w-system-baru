'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/app/(dashboard)/hr/lib/get-current-user'
import { revalidatePath } from 'next/cache'

// ── Types ──
export type CycleStatus = 'draft' | 'active' | 'closed'
export type PeriodType = 'quarterly' | 'semester' | 'annual'
export type ReviewStatus = 'belum_dinilai' | 'draft' | 'menunggu_review' | 'selesai'

export interface AppraisalCycleRow {
  id: string
  tenant_id: string
  name: string
  period_type: string
  start_date: string
  end_date: string
  deadline_date: string | null
  status: string
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
}

export interface AppraisalReviewRow {
  id: string
  tenant_id: string
  cycle_id: string
  employee_id: string
  reviewer_id: string | null
  self_score: number | null
  reviewer_score: number | null
  final_score: number | null
  status: string
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  employee: { id: string; nik: string; name: string } | null
  reviewer: { id: string; name: string } | null
  cycle: { id: string; name: string } | null
}

export interface AppraisalDimensionRow {
  id: string
  tenant_id: string
  review_id: string
  dimension_name: string
  weight: number
  self_score: number | null
  reviewer_score: number | null
  final_score: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface EmployeeOption {
  id: string
  nik: string
  name: string
}

export interface ReviewerOption {
  id: string
  name: string
}

// ── Employees ──
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

// ── Reviewers (user_profiles) ──
export async function getReviewers(): Promise<ReviewerOption[]> {
  const supabase = await createClient()
  const user = await requireUser()
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, name')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('name')
  if (error) { console.error('getReviewers error:', error); return [] }
  return (data as ReviewerOption[]) ?? []
}

// ── Appraisal Cycles ──
export async function getAppraisalCycles(): Promise<AppraisalCycleRow[]> {
  const supabase = await createClient()
  const user = await requireUser()
  const { data, error } = await supabase
    .from('appraisal_cycles')
    .select('*')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('start_date', { ascending: false })
  if (error) { console.error('getAppraisalCycles error:', error); return [] }
  return (data as AppraisalCycleRow[]) ?? []
}

// ── Appraisal Reviews ──
export async function getAppraisalReviews(filters?: {
  cycle_id?: string
  status?: ReviewStatus
}): Promise<AppraisalReviewRow[]> {
  const supabase = await createClient()
  const user = await requireUser()
  let query = supabase
    .from('appraisal_reviews')
    .select('*, employee:employees(id,nik,name), reviewer:user_profiles!reviewer_id(id,name), cycle:appraisal_cycles(id,name)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (filters?.cycle_id) query = query.eq('cycle_id', filters.cycle_id)
  if (filters?.status) query = query.eq('status', filters.status)
  const { data, error } = await query
  if (error) { console.error('getAppraisalReviews error:', error); return [] }
  return (data as unknown as AppraisalReviewRow[]) ?? []
}

// ── Appraisal Dimensions ──
export async function getAppraisalDimensions(reviewId: string): Promise<AppraisalDimensionRow[]> {
  const supabase = await createClient()
  const user = await requireUser()
  const { data, error } = await supabase
    .from('appraisal_dimensions')
    .select('*')
    .eq('review_id', reviewId)
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
  if (error) { console.error('getAppraisalDimensions error:', error); return [] }
  return (data as AppraisalDimensionRow[]) ?? []
}

// ── Create Cycle ──
export async function createAppraisalCycle(data: {
  name: string
  period_type: PeriodType
  start_date: string
  end_date: string
  deadline_date?: string
}) {
  const supabase = await createClient()
  const user = await requireUser()
  if (!data.name || !data.period_type || !data.start_date || !data.end_date) {
    return { error: 'Nama, tipe periode, tanggal mulai, dan tanggal selesai wajib diisi' }
  }
  const payload = {
    tenant_id: user.tenantId,
    name: data.name,
    period_type: data.period_type,
    start_date: data.start_date,
    end_date: data.end_date,
    deadline_date: data.deadline_date ?? null,
    status: 'draft' as CycleStatus,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }
  const { error } = await supabase.from('appraisal_cycles').insert(payload)
  if (error) { console.error('createAppraisalCycle error:', error); return { error: 'Gagal membuat siklus appraisal' } }
  revalidatePath('/hr/appraisal')
  return { success: true }
}

// ── Update Cycle Status ──
export async function updateCycleStatus(id: string, status: CycleStatus) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('appraisal_cycles')
    .update({
      status,
      is_active: status === 'active',
      updated_by: user.userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) { console.error('updateCycleStatus error:', error); return { error: 'Gagal mengubah status siklus' } }
  revalidatePath('/hr/appraisal')
  return { success: true }
}

// ── Create Review ──
export async function createReview(data: {
  cycle_id: string
  employee_id: string
  reviewer_id?: string
}) {
  const supabase = await createClient()
  const user = await requireUser()
  if (!data.cycle_id || !data.employee_id) {
    return { error: 'Siklus dan karyawan wajib diisi' }
  }
  const payload = {
    tenant_id: user.tenantId,
    cycle_id: data.cycle_id,
    employee_id: data.employee_id,
    reviewer_id: data.reviewer_id ?? null,
    status: 'belum_dinilai' as ReviewStatus,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }
  const { error } = await supabase.from('appraisal_reviews').insert(payload)
  if (error) { console.error('createReview error:', error); return { error: 'Gagal membuat review appraisal' } }
  revalidatePath('/hr/appraisal')
  return { success: true }
}

// ── Update Review ──
export async function updateReview(
  id: string,
  data: {
    self_score?: number
    reviewer_score?: number
    final_score?: number
    status?: ReviewStatus
    notes?: string
  }
) {
  const supabase = await createClient()
  const user = await requireUser()
  const payload: Record<string, unknown> = {
    updated_by: user.userId,
    updated_at: new Date().toISOString(),
  }
  if (data.self_score !== undefined) payload.self_score = data.self_score
  if (data.reviewer_score !== undefined) payload.reviewer_score = data.reviewer_score
  if (data.final_score !== undefined) payload.final_score = data.final_score
  if (data.status !== undefined) payload.status = data.status
  if (data.notes !== undefined) payload.notes = data.notes
  const { error } = await supabase
    .from('appraisal_reviews')
    .update(payload)
    .eq('id', id)
  if (error) { console.error('updateReview error:', error); return { error: 'Gagal memperbarui review' } }
  revalidatePath('/hr/appraisal')
  return { success: true }
}

// ── Create Dimension ──
export async function createDimension(data: {
  review_id: string
  dimension_name: string
  weight: number
}) {
  const supabase = await createClient()
  const user = await requireUser()
  if (!data.review_id || !data.dimension_name || !data.weight) {
    return { error: 'Review, nama dimensi, dan bobot wajib diisi' }
  }
  const payload = {
    tenant_id: user.tenantId,
    review_id: data.review_id,
    dimension_name: data.dimension_name,
    weight: data.weight,
    is_active: true,
  }
  const { error } = await supabase.from('appraisal_dimensions').insert(payload)
  if (error) { console.error('createDimension error:', error); return { error: 'Gagal membuat dimensi' } }
  revalidatePath('/hr/appraisal')
  return { success: true }
}

// ── Update Dimension ──
export async function updateDimension(
  id: string,
  data: {
    self_score?: number
    reviewer_score?: number
    final_score?: number
  }
) {
  const supabase = await createClient()
  const user = await requireUser()
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (data.self_score !== undefined) payload.self_score = data.self_score
  if (data.reviewer_score !== undefined) payload.reviewer_score = data.reviewer_score
  if (data.final_score !== undefined) payload.final_score = data.final_score
  const { error } = await supabase
    .from('appraisal_dimensions')
    .update(payload)
    .eq('id', id)
  if (error) { console.error('updateDimension error:', error); return { error: 'Gagal memperbarui dimensi' } }
  revalidatePath('/hr/appraisal')
  return { success: true }
}