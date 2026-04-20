'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/app/(dashboard)/hr/lib/get-current-user'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/database.types'

// ── Types ──
export type EmployeeRow = Database['public']['Tables']['employees']['Row']

export type EmployeeWithRelations = EmployeeRow & {
  entity: { id: string; name: string } | null
  branch: { id: string; name: string } | null
  department: { id: string; name: string } | null
  position: { id: string; name: string } | null
  grade: { id: string; name: string } | null
  work_shift: { id: string; name: string } | null
}

// ── Get All Employees ──
export async function getEmployees(): Promise<EmployeeWithRelations[]> {
  const supabase = await createClient()
  const ctx = await requireUser()

  const { data, error } = await supabase
    .from('employees')
    .select(
      `*, entity:entities(id,name), branch:branches(id,name), department:hr_departments(id,name), position:hr_positions(id,name), grade:hr_job_grades(id,name), work_shift:hr_work_shifts(id,name)`
    )
    .eq('tenant_id', ctx.tenantId)
    .is('deleted_at', null)
    .order('name')

  if (error) {
    console.error('getEmployees error:', error)
    return []
  }
  return (data as unknown as EmployeeWithRelations[]) ?? []
}

// ── Get Employee By Id ──
export async function getEmployeeById(id: string): Promise<EmployeeWithRelations | null> {
  const supabase = await createClient()
  const ctx = await requireUser()

  const { data, error } = await supabase
    .from('employees')
    .select(
      `*, entity:entities(id,name), branch:branches(id,name), department:hr_departments(id,name), position:hr_positions(id,name), grade:hr_job_grades(id,name), work_shift:hr_work_shifts(id,name)`
    )
    .eq('tenant_id', ctx.tenantId)
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) {
    console.error('getEmployeeById error:', error)
    return null
  }
  return (data as unknown as EmployeeWithRelations) ?? null
}

// ── Create Employee ──
export async function createEmployee(data: {
  nik: string
  name: string
  entity_id?: string | null
  branch_id?: string | null
  department_id?: string | null
  position_id?: string | null
  grade_id?: string | null
  work_shift_id?: string | null
  email?: string | null
  phone?: string | null
  birth_date?: string | null
  gender?: string | null
  religion?: string | null
  marital_status?: string | null
  education_level?: string | null
  npwp?: string | null
  address?: string | null
  bank_name?: string | null
  bank_account?: string | null
  bank_account_name?: string | null
  hire_date: string
  employment_status?: string
  ptkp_status?: string
  base_salary?: number
}) {
  const supabase = await createClient()
  const ctx = await requireUser()

  if (!data.nik || !data.name || !data.hire_date) {
    return { error: 'NIK, nama, dan tanggal masuk wajib diisi' }
  }

  const validEmploymentStatuses = ['aktif', 'resign', 'phk', 'pensiun', 'cuti_panjang']
  if (data.employment_status && !validEmploymentStatuses.includes(data.employment_status)) {
    return { error: 'Status kepegawaian tidak valid' }
  }

  const validGenders = ['Laki-laki', 'Perempuan']
  if (data.gender && !validGenders.includes(data.gender)) {
    return { error: 'Jenis kelamin tidak valid' }
  }

  const validMaritalStatuses = ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati']
  if (data.marital_status && !validMaritalStatuses.includes(data.marital_status)) {
    return { error: 'Status pernikahan tidak valid' }
  }

  const validPtkpStatuses = ['TK/0', 'K/0', 'K/1', 'K/2', 'K/3']
  if (data.ptkp_status && !validPtkpStatuses.includes(data.ptkp_status)) {
    return { error: 'Status PTKP tidak valid' }
  }

  const payload = {
    tenant_id: ctx.tenantId,
    nik: data.nik,
    name: data.name,
    entity_id: data.entity_id ?? null,
    branch_id: data.branch_id ?? null,
    department_id: data.department_id ?? null,
    position_id: data.position_id ?? null,
    grade_id: data.grade_id ?? null,
    work_shift_id: data.work_shift_id ?? null,
    email: data.email ?? null,
    phone: data.phone ?? null,
    birth_date: data.birth_date ?? null,
    gender: data.gender ?? null,
    religion: data.religion ?? null,
    marital_status: data.marital_status ?? null,
    education_level: data.education_level ?? null,
    npwp: data.npwp ?? null,
    address: data.address ?? null,
    bank_name: data.bank_name ?? null,
    bank_account: data.bank_account ?? null,
    bank_account_name: data.bank_account_name ?? null,
    hire_date: data.hire_date,
    employment_status: data.employment_status ?? 'aktif',
    ptkp_status: data.ptkp_status ?? 'TK/0',
    base_salary: data.base_salary ?? 0,
    is_active: true,
    created_by: ctx.userId,
    updated_by: ctx.userId,
  }

  const { error } = await supabase.from('employees').insert(payload)
  if (error) {
    console.error('createEmployee error:', error)
    if (error.code === '23505') return { error: 'NIK sudah digunakan' }
    return { error: 'Gagal menyimpan data karyawan' }
  }

  revalidatePath('/hr/employees')
  return { success: true }
}

// ── Update Employee ──
export async function updateEmployee(
  id: string,
  data: {
    nik?: string
    name?: string
    entity_id?: string | null
    branch_id?: string | null
    department_id?: string | null
    position_id?: string | null
    grade_id?: string | null
    work_shift_id?: string | null
    email?: string | null
    phone?: string | null
    birth_date?: string | null
    gender?: string | null
    religion?: string | null
    marital_status?: string | null
    education_level?: string | null
    npwp?: string | null
    address?: string | null
    bank_name?: string | null
    bank_account?: string | null
    bank_account_name?: string | null
    hire_date?: string
    employment_status?: string
    ptkp_status?: string
    base_salary?: number
  }
) {
  const supabase = await createClient()
  const ctx = await requireUser()

  const validEmploymentStatuses = ['aktif', 'resign', 'phk', 'pensiun', 'cuti_panjang']
  if (data.employment_status && !validEmploymentStatuses.includes(data.employment_status)) {
    return { error: 'Status kepegawaian tidak valid' }
  }

  const validGenders = ['Laki-laki', 'Perempuan']
  if (data.gender && !validGenders.includes(data.gender)) {
    return { error: 'Jenis kelamin tidak valid' }
  }

  const validMaritalStatuses = ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati']
  if (data.marital_status && !validMaritalStatuses.includes(data.marital_status)) {
    return { error: 'Status pernikahan tidak valid' }
  }

  const validPtkpStatuses = ['TK/0', 'K/0', 'K/1', 'K/2', 'K/3']
  if (data.ptkp_status && !validPtkpStatuses.includes(data.ptkp_status)) {
    return { error: 'Status PTKP tidak valid' }
  }

  const payload: Record<string, unknown> = {
    updated_by: ctx.userId,
    updated_at: new Date().toISOString(),
  }

  if (data.nik !== undefined) payload.nik = data.nik
  if (data.name !== undefined) payload.name = data.name
  if (data.entity_id !== undefined) payload.entity_id = data.entity_id
  if (data.branch_id !== undefined) payload.branch_id = data.branch_id
  if (data.department_id !== undefined) payload.department_id = data.department_id
  if (data.position_id !== undefined) payload.position_id = data.position_id
  if (data.grade_id !== undefined) payload.grade_id = data.grade_id
  if (data.work_shift_id !== undefined) payload.work_shift_id = data.work_shift_id
  if (data.email !== undefined) payload.email = data.email
  if (data.phone !== undefined) payload.phone = data.phone
  if (data.birth_date !== undefined) payload.birth_date = data.birth_date
  if (data.gender !== undefined) payload.gender = data.gender
  if (data.religion !== undefined) payload.religion = data.religion
  if (data.marital_status !== undefined) payload.marital_status = data.marital_status
  if (data.education_level !== undefined) payload.education_level = data.education_level
  if (data.npwp !== undefined) payload.npwp = data.npwp
  if (data.address !== undefined) payload.address = data.address
  if (data.bank_name !== undefined) payload.bank_name = data.bank_name
  if (data.bank_account !== undefined) payload.bank_account = data.bank_account
  if (data.bank_account_name !== undefined) payload.bank_account_name = data.bank_account_name
  if (data.hire_date !== undefined) payload.hire_date = data.hire_date
  if (data.employment_status !== undefined) payload.employment_status = data.employment_status
  if (data.ptkp_status !== undefined) payload.ptkp_status = data.ptkp_status
  if (data.base_salary !== undefined) payload.base_salary = data.base_salary

  const { error } = await supabase
    .from('employees')
    .update(payload)
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)

  if (error) {
    console.error('updateEmployee error:', error)
    if (error.code === '23505') return { error: 'NIK sudah digunakan' }
    return { error: 'Gagal memperbarui data karyawan' }
  }

  revalidatePath('/hr/employees')
  return { success: true }
}

// ── Soft Delete Employee ──
export async function deleteEmployee(id: string) {
  const supabase = await createClient()
  const ctx = await requireUser()

  const { error } = await supabase
    .from('employees')
    .update({
      is_active: false,
      deleted_at: new Date().toISOString(),
      updated_by: ctx.userId,
    })
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)

  if (error) {
    console.error('deleteEmployee error:', error)
    return { error: 'Gagal menghapus data karyawan' }
  }

  revalidatePath('/hr/employees')
  return { success: true }
}