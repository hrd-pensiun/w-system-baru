'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/app/(dashboard)/hr/lib/get-current-user'
import { revalidatePath } from 'next/cache'

// ── Types ──
export type PayrollPeriodStatus = 'draft' | 'processing' | 'approved' | 'paid' | 'cancelled'
export type SlipStatus = 'draft' | 'approved' | 'paid'
export type TaxMethod = 'gross' | 'gross_up' | 'ter'

export interface PayrollPeriodRow {
  id: string
  tenant_id: string
  period_month: number
  period_year: number
  title: string
  entity_name: string | null
  status: string
  total_bruto: number
  total_netto: number
  employee_count: number
  pay_date: string | null
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
}

export interface PayrollSlipRow {
  id: string
  tenant_id: string
  period_id: string
  employee_id: string
  employee_nik: string | null
  employee_name: string | null
  job_grade: string | null
  department: string | null
  position: string | null
  gaji_pokok: number
  tunjangan_jabatan: number
  tunjangan_transport: number
  tunjangan_makan: number
  tunjangan_lainnya: number
  lembur_amount: number
  reimburse_amount: number
  total_pendapatan: number
  jht_karyawan: number
  jp_karyawan: number
  bpjs_kes_karyawan: number
  pph21: number
  potongan_lainnya: number
  total_potongan: number
  thp: number
  tax_method: string
  ptkp_status: string | null
  status: string
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  deleted_at: string | null
  employee: { id: string; nik: string; name: string } | null
}

export interface EmployeeBasic {
  id: string
  nik: string
  name: string
  department: string | null
  position: string | null
  job_grade: string | null
}

// ── Payroll Periods ──

export async function getPayrollPeriods(): Promise<PayrollPeriodRow[]> {
  const supabase = await createClient()
  const user = await requireUser()
  const { data, error } = await supabase
    .from('payroll_periods')
    .select('*')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('period_year', { ascending: false })
    .order('period_month', { ascending: false })
  if (error) { console.error('getPayrollPeriods error:', error); return [] }
  return (data as PayrollPeriodRow[]) ?? []
}

export async function createPayrollPeriod(data: {
  period_month: number
  period_year: number
  title: string
  entity_name?: string
  notes?: string
}) {
  const supabase = await createClient()
  const user = await requireUser()
  if (!data.period_month || !data.period_year) return { error: 'Bulan dan tahun wajib diisi' }

  const payload = {
    tenant_id: user.tenantId,
    period_month: data.period_month,
    period_year: data.period_year,
    title: data.title,
    entity_name: data.entity_name ?? null,
    notes: data.notes ?? null,
    status: 'draft' as const,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }
  const { error } = await supabase.from('payroll_periods').insert(payload)
  if (error) { console.error('createPayrollPeriod error:', error); return { error: 'Gagal membuat periode payroll: ' + error.message } }
  revalidatePath('/hr/payroll')
  return { success: true }
}

export async function approvePayrollPeriod(id: string) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('payroll_periods')
    .update({
      status: 'approved',
      approved_by: user.userId,
      approved_at: new Date().toISOString(),
      updated_by: user.userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) { console.error('approvePayrollPeriod error:', error); return { error: 'Gagal menyetujui payroll' } }
  // Also approve all slips in this period
  await supabase
    .from('payroll_slips')
    .update({ status: 'approved', updated_by: user.userId, updated_at: new Date().toISOString() })
    .eq('period_id', id)
    .eq('status', 'draft')
  revalidatePath('/hr/payroll')
  return { success: true }
}

export async function markPayrollPaid(id: string) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('payroll_periods')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      updated_by: user.userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) { console.error('markPayrollPaid error:', error); return { error: 'Gagal menandai payroll sebagai dibayar' } }
  // Also mark all slips as paid
  await supabase
    .from('payroll_slips')
    .update({ status: 'paid', updated_by: user.userId, updated_at: new Date().toISOString() })
    .eq('period_id', id)
    .eq('status', 'approved')
  revalidatePath('/hr/payroll')
  return { success: true }
}

export async function cancelPayrollPeriod(id: string) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('payroll_periods')
    .update({
      status: 'cancelled',
      updated_by: user.userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) { console.error('cancelPayrollPeriod error:', error); return { error: 'Gagal membatalkan payroll' } }
  revalidatePath('/hr/payroll')
  return { success: true }
}

export async function deletePayrollPeriod(id: string) {
  const supabase = await createClient()
  const user = await requireUser()
  const { error } = await supabase
    .from('payroll_periods')
    .update({ deleted_at: new Date().toISOString(), updated_by: user.userId })
    .eq('id', id)
  if (error) { console.error('deletePayrollPeriod error:', error); return { error: 'Gagal menghapus periode payroll' } }
  // Also soft-delete slips
  await supabase
    .from('payroll_slips')
    .update({ deleted_at: new Date().toISOString() })
    .eq('period_id', id)
  revalidatePath('/hr/payroll')
  return { success: true }
}

// ── Payroll Slips ──

export async function getPayrollSlips(periodId: string): Promise<PayrollSlipRow[]> {
  const supabase = await createClient()
  const user = await requireUser()
  const { data, error } = await supabase
    .from('payroll_slips')
    .select('*, employee:employees(id,nik,name)')
    .eq('tenant_id', user.tenantId)
    .eq('period_id', periodId)
    .is('deleted_at', null)
    .order('employee_name')
  if (error) { console.error('getPayrollSlips error:', error); return [] }
  return (data as unknown as PayrollSlipRow[]) ?? []
}

export async function getAllPayrollSlips(): Promise<PayrollSlipRow[]> {
  const supabase = await createClient()
  const user = await requireUser()
  const { data, error } = await supabase
    .from('payroll_slips')
    .select('*, employee:employees(id,nik,name)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) { console.error('getAllPayrollSlips error:', error); return [] }
  return (data as unknown as PayrollSlipRow[]) ?? []
}

// ── Generate Payroll (core logic) ──

export async function getEmployeesBasic(): Promise<EmployeeBasic[]> {
  const supabase = await createClient()
  const user = await requireUser()
  const { data, error } = await supabase
    .from('employees')
    .select('id, nik, name, department:hr_departments(name), position:hr_positions(name), job_grade:hr_job_grades(name)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('name')
  if (error) { console.error('getEmployeesBasic error:', error); return [] }
  // Flatten the joined names
  return (data as Record<string, unknown>[]).map((e) => ({
    id: e.id as string,
    nik: e.nik as string,
    name: e.name as string,
    department: (e.department as Record<string, string>)?.name ?? null,
    position: (e.position as Record<string, string>)?.name ?? null,
    job_grade: (e.job_grade as Record<string, string>)?.name ?? null,
  })) ?? []
}

export async function generatePayroll(periodId: string) {
  const supabase = await createClient()
  const user = await requireUser()

  // Get the period
  const { data: period } = await supabase
    .from('payroll_periods')
    .select('*')
    .eq('id', periodId)
    .single()
  if (!period) return { error: 'Periode payroll tidak ditemukan' }
  if (period.status !== 'draft') return { error: 'Payroll sudah digenerate' }

  // Update period status to processing
  await supabase
    .from('payroll_periods')
    .update({ status: 'processing', updated_by: user.userId, updated_at: new Date().toISOString() })
    .eq('id', periodId)

  // Get all active employees
  const { data: employees } = await supabase
    .from('employees')
    .select('id, nik, name, department:hr_departments(name), position:hr_positions(name), job_grade:hr_job_grades(name)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .eq('is_active', true)

  if (!employees || employees.length === 0) {
    await supabase.from('payroll_periods').update({ status: 'draft', updated_by: user.userId }).eq('id', periodId)
    return { error: 'Tidak ada karyawan aktif' }
  }

  // Get salary components for this tenant
  const { data: salaryComponents } = await supabase
    .from('hr_salary_components')
    .select('*')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)

  // Get BPJS config
  const { data: bpjsConfig } = await supabase
    .from('hr_bpjs_configs')
    .select('*')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .eq('is_active', true)
    .order('year', { ascending: false })
    .limit(1)
    .single()

  // Get approved overtimes for this period
  const startDate = `${period.period_year}-${String(period.period_month).padStart(2, '0')}-01`
  const endDate = period.period_month === 12
    ? `${period.period_year + 1}-01-01`
    : `${period.period_year}-${String(period.period_month + 1).padStart(2, '0')}-01`

  const { data: overtimes } = await supabase
    .from('employee_overtimes')
    .select('employee_id, amount')
    .eq('tenant_id', user.tenantId)
    .eq('status', 'paid')
    .gte('date', startDate)
    .lt('date', endDate)
    .is('deleted_at', null)

  // Get approved reimbursements for this period
  const { data: reimburses } = await supabase
    .from('employee_reimbursements')
    .select('employee_id, amount')
    .eq('tenant_id', user.tenantId)
    .eq('status', 'approved')
    .gte('created_at', startDate)
    .lt('created_at', endDate)
    .is('deleted_at', null)

  // Build overtime & reimburse maps
  const overtimeMap = new Map<string, number>()
  overtimes?.forEach((o) => {
    const eid = o.employee_id as string
    overtimeMap.set(eid, (overtimeMap.get(eid) ?? 0) + (o.amount as number))
  })
  const reimburseMap = new Map<string, number>()
  reimburses?.forEach((r) => {
    const eid = r.employee_id as string
    reimburseMap.set(eid, (reimburseMap.get(eid) ?? 0) + (r.amount as number))
  })

  let totalBruto = 0
  let totalNetto = 0
  const slips: Record<string, unknown>[] = []

  for (const emp of employees) {
    const empId = emp.id as string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dept = (emp.department as any)?.name ?? null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pos = (emp.position as any)?.name ?? null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grade = (emp.job_grade as any)?.name ?? null

    // Build component map from salary_components
    let gajiPokok = 15000000 // default fallback
    let tunjJabatan = 2000000
    let tunjTransport = 500000
    let tunjMakan = 750000

    // If we have salary matrix, try to match
    if (salaryComponents && salaryComponents.length > 0) {
      for (const sc of salaryComponents) {
        if (sc.code === 'gp') gajiPokok = Number(sc.default_amount) || gajiPokok
        if (sc.code === 'tj') tunjJabatan = Number(sc.default_amount) || tunjJabatan
        if (sc.code === 'tt') tunjTransport = Number(sc.default_amount) || tunjTransport
        if (sc.code === 'tm') tunjMakan = Number(sc.default_amount) || tunjMakan
      }
    }

    const lemburAmt = overtimeMap.get(empId) ?? 0
    const reimburseAmt = reimburseMap.get(empId) ?? 0
    const totalPendapatan = gajiPokok + tunjJabatan + tunjTransport + tunjMakan + lemburAmt + reimburseAmt

    // BPJS calculations
    let jhtK = 0, jpK = 0, kesK = 0
    if (bpjsConfig) {
      jhtK = Math.round(gajiPokok * (Number(bpjsConfig.jht_employee_pct) / 100))
      jpK = Math.round(gajiPokok * (Number(bpjsConfig.jp_employee_pct) / 100))
      const jpMax = Number(bpjsConfig.jp_max_salary) || 9559600
      if (gajiPokok > jpMax) jpK = Math.round(jpMax * (Number(bpjsConfig.jp_employee_pct) / 100))
      kesK = Math.round(gajiPokok * (Number(bpjsConfig.kes_employee_pct) / 100))
      const kesMax = Number(bpjsConfig.kes_max_salary) || 12000000
      if (gajiPokok > kesMax) kesK = Math.round(kesMax * (Number(bpjsConfig.kes_employee_pct) / 100))
    }

    // PPh21 simplified (5% of total pendapatan as rough estimate)
    const pph21 = Math.round(totalPendapatan * 0.05)
    const totalPotongan = jhtK + jpK + kesK + pph21
    const thp = totalPendapatan - totalPotongan

    totalBruto += totalPendapatan
    totalNetto += thp

    slips.push({
      tenant_id: user.tenantId,
      period_id: periodId,
      employee_id: empId,
      employee_nik: emp.nik,
      employee_name: emp.name,
      job_grade: grade,
      department: dept,
      position: pos,
      gaji_pokok: gajiPokok,
      tunjangan_jabatan: tunjJabatan,
      tunjangan_transport: tunjTransport,
      tunjangan_makan: tunjMakan,
      tunjangan_lainnya: 0,
      lembur_amount: lemburAmt,
      reimburse_amount: reimburseAmt,
      total_pendapatan: totalPendapatan,
      jht_karyawan: jhtK,
      jp_karyawan: jpK,
      bpjs_kes_karyawan: kesK,
      pph21: pph21,
      potongan_lainnya: 0,
      total_potongan: totalPotongan,
      thp: thp,
      tax_method: 'gross',
      ptkp_status: 'TK/0',
      status: 'draft',
      is_active: true,
      created_by: user.userId,
      updated_by: user.userId,
    })
  }

  // Insert all slips
  if (slips.length > 0) {
    const { error: slipError } = await supabase.from('payroll_slips').insert(slips)
    if (slipError) {
      console.error('generatePayroll slip insert error:', slipError)
      await supabase.from('payroll_periods').update({ status: 'draft', updated_by: user.userId }).eq('id', periodId)
      return { error: 'Gagal membuat slip gaji: ' + slipError.message }
    }
  }

  // Update period totals
  await supabase
    .from('payroll_periods')
    .update({
      status: 'draft',
      total_bruto: totalBruto,
      total_netto: totalNetto,
      employee_count: slips.length,
      updated_by: user.userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', periodId)

  revalidatePath('/hr/payroll')
  return { success: true }
}