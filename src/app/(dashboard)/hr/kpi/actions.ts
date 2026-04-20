'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/app/(dashboard)/hr/lib/get-current-user'
import { revalidatePath } from 'next/cache'

// ── Types ──
export type KpiPeriodStatus = 'draft' | 'active' | 'closed'
export type KpiIndicatorStatus = 'draft' | 'submitted' | 'approved' | 'revision'

export interface EmployeeOption {
  id: string
  nik: string
  name: string
  department_id: string | null
}

export interface KpiPeriodRow {
  id: string
  tenant_id: string
  name: string
  start_date: string
  end_date: string
  status: string
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
}

export interface KpiIndicatorRow {
  id: string
  tenant_id: string
  period_id: string
  employee_id: string
  indicator_name: string
  weight: number
  target_value: string
  actual_value: string | null
  score: number | null
  status: string
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  employee: { id: string; nik: string; name: string; department_id: string | null } | null
  period: { id: string; name: string } | null
}

// ── Employees ──
export async function getEmployees(): Promise<EmployeeOption[]> {
  const supabase = await createClient()
  const user = await requireUser()
  const { data, error } = await supabase
    .from('employees')
    .select('id, nik, name, department_id')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('name')
  if (error) { console.error('getEmployees error:', error); return [] }
  return (data as EmployeeOption[]) ?? []
}

// ── KPI Periods ──
export async function getKpiPeriods(): Promise<KpiPeriodRow[]> {
  const supabase = await createClient()
  const user = await requireUser()
  const { data, error } = await supabase
    .from('kpi_periods')
    .select('*')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('start_date', { ascending: false })
  if (error) { console.error('getKpiPeriods error:', error); return [] }
  return (data as KpiPeriodRow[]) ?? []
}

export async function createKpiPeriod(data: {
  name: string
  start_date: string
  end_date: string
}) {
  const supabase = await createClient()
  const user = await requireUser()
  if (!data.name || !data.start_date || !data.end_date) return { error: 'Nama, tanggal mulai, dan tanggal selesai wajib diisi' }
  const payload = {
    tenant_id: user.tenantId,
    name: data.name,
    start_date: data.start_date,
    end_date: data.end_date,
    status: 'draft' as KpiPeriodStatus,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }
  const { error } = await supabase.from('kpi_periods').insert(payload)
  if (error) { console.error('createKpiPeriod error:', error); return { error: 'Gagal membuat periode KPI' } }
  revalidatePath('/hr/kpi')
  return { success: true }
}

export async function updateKpiPeriodStatus(id: string, status: KpiPeriodStatus) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('kpi_periods')
    .update({ status, is_active: status === 'active', updated_by: user.userId, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) { console.error('updateKpiPeriodStatus error:', error); return { error: 'Gagal mengubah status periode' } }
  revalidatePath('/hr/kpi')
  return { success: true }
}

// ── KPI Indicators ──
export async function getKpiIndicators(filters?: {
  period_id?: string
  employee_id?: string
  status?: KpiIndicatorStatus
}): Promise<KpiIndicatorRow[]> {
  const supabase = await createClient()
  const user = await requireUser()
  let query = supabase
    .from('kpi_indicators')
    .select('*, employee:employees(id,nik,name,department_id), period:kpi_periods(id,name)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (filters?.period_id) query = query.eq('period_id', filters.period_id)
  if (filters?.employee_id) query = query.eq('employee_id', filters.employee_id)
  if (filters?.status) query = query.eq('status', filters.status)
  const { data, error } = await query
  if (error) { console.error('getKpiIndicators error:', error); return [] }
  return (data as unknown as KpiIndicatorRow[]) ?? []
}

export async function createKpiIndicator(data: {
  period_id: string
  employee_id: string
  indicator_name: string
  weight: number
  target_value: string
  notes?: string
}) {
  const supabase = await createClient()
  const user = await requireUser()
  if (!data.period_id || !data.employee_id || !data.indicator_name || !data.weight) {
    return { error: 'Periode, karyawan, nama indikator, dan bobot wajib diisi' }
  }
  const payload = {
    tenant_id: user.tenantId,
    period_id: data.period_id,
    employee_id: data.employee_id,
    indicator_name: data.indicator_name,
    weight: data.weight,
    target_value: data.target_value,
    notes: data.notes ?? null,
    status: 'draft' as KpiIndicatorStatus,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }
  const { error } = await supabase.from('kpi_indicators').insert(payload)
  if (error) { console.error('createKpiIndicator error:', error); return { error: 'Gagal membuat indikator KPI' } }
  revalidatePath('/hr/kpi')
  return { success: true }
}

export async function updateKpiIndicator(
  id: string,
  data: {
    actual_value?: string
    score?: number
    status?: KpiIndicatorStatus
    notes?: string
  }
) {
  const supabase = await createClient()
  const user = await requireUser()
  const payload: Record<string, unknown> = {
    updated_by: user.userId,
    updated_at: new Date().toISOString(),
  }
  if (data.actual_value !== undefined) payload.actual_value = data.actual_value
  if (data.score !== undefined) payload.score = data.score
  if (data.status !== undefined) payload.status = data.status
  if (data.notes !== undefined) payload.notes = data.notes
  const { error } = await supabase
    .from('kpi_indicators')
    .update(payload)
    .eq('id', id)
  if (error) { console.error('updateKpiIndicator error:', error); return { error: 'Gagal memperbarui indikator KPI' } }
  revalidatePath('/hr/kpi')
  return { success: true }
}

export async function deleteKpiIndicator(id: string) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('kpi_indicators')
    .update({ deleted_at: new Date().toISOString(), updated_by: user.userId })
    .eq('id', id)
  if (error) { console.error('deleteKpiIndicator error:', error); return { error: 'Gagal menghapus indikator KPI' } }
  revalidatePath('/hr/kpi')
  return { success: true }
}

// ── Department summary (for Ringkasan tab) ──
export async function getDepartmentSummary(): Promise<{
  department_id: string | null
  department_name: string
  employee_count: number
  avg_score: number
  below_target_count: number
}[]> {
  const supabase = await createClient()
  const user = await requireUser()
  // Get indicators with employee + department info
  const { data, error } = await supabase
    .from('kpi_indicators')
    .select('score, employee:employees(department_id, department:hr_departments(id, name))')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .not('score', 'is', null)
  if (error) { console.error('getDepartmentSummary error:', error); return [] }

  const deptMap = new Map<string, { name: string; scores: number[]; belowTarget: number }>()
  for (const row of (data as any[]) ?? []) {
    const dept = row.employee?.department
    const deptId = dept?.id ?? 'unassigned'
    const deptName = dept?.name ?? 'Tanpa Departemen'
    const score = Number(row.score) || 0
    if (!deptMap.has(deptId)) {
      deptMap.set(deptId, { name: deptName, scores: [], belowTarget: 0 })
    }
    const entry = deptMap.get(deptId)!
    entry.scores.push(score)
    if (score < 90) entry.belowTarget++
  }

  return Array.from(deptMap.entries()).map(([id, v]) => ({
    department_id: id === 'unassigned' ? null : id,
    department_name: v.name,
    employee_count: v.scores.length,
    avg_score: v.scores.length ? Math.round((v.scores.reduce((a, b) => a + b, 0) / v.scores.length) * 10) / 10 : 0,
    below_target_count: v.belowTarget,
  }))
}