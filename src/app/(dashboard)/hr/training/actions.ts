'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/app/(dashboard)/hr/lib/get-current-user'
import { revalidatePath } from 'next/cache'

// ── Types ──
export type TrainingType = 'offline' | 'online' | 'hybrid'
export type TrainingStatus = 'akan_datang' | 'berjalan' | 'selesai' | 'dibatalkan'
export type ParticipantStatus = 'terdaftar' | 'sedang' | 'lulus' | 'tidak_lulus'
export type CourseCategory = 'teknis' | 'soft_skill' | 'compliance' | 'leadership'
export type EnrollmentStatus = 'baru' | 'sedang' | 'selesai'

export interface EmployeeOption {
  id: string
  nik: string
  name: string
}

export interface TrainingProgramRow {
  id: string
  tenant_id: string
  branch_id: string | null
  title: string
  description: string | null
  type: string
  instructor: string | null
  start_date: string
  end_date: string | null
  quota: number
  status: string
  location: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  _count?: { participants: number }
}

export interface TrainingParticipantRow {
  id: string
  tenant_id: string
  program_id: string
  employee_id: string
  status: string
  score: number | null
  certificate_url: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  employee: { id: string; nik: string; name: string } | null
  program: { id: string; title: string } | null
}

export interface ELearningCourseRow {
  id: string
  tenant_id: string
  title: string
  description: string | null
  category: string
  duration_hours: number
  module_count: number
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  _count?: { enrollments: number }
}

export interface ELearningEnrollmentRow {
  id: string
  tenant_id: string
  course_id: string
  employee_id: string
  completion_pct: number
  status: string
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  employee: { id: string; nik: string; name: string } | null
  course: { id: string; title: string; category: string } | null
}

// ── Get Employees ──
export async function getEmployees(): Promise<EmployeeOption[]> {
  const supabase = await createClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from('employees')
    .select('id, nik, name')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (error) {
    console.error('getEmployees error:', error)
    return []
  }
  return (data as unknown as EmployeeOption[]) ?? []
}

// ── Get Training Programs ──
export async function getTrainingPrograms(filters?: {
  status?: TrainingStatus
}): Promise<TrainingProgramRow[]> {
  const supabase = await createClient()
  const user = await requireUser()

  let query = supabase
    .from('training_programs')
    .select('*')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)

  const { data, error } = await query

  if (error) {
    console.error('getTrainingPrograms error:', error)
    return []
  }

  const programs = (data as unknown as TrainingProgramRow[]) ?? []

  // Count participants per program
  if (programs.length > 0) {
    const ids = programs.map(p => p.id)
    const { data: counts } = await supabase
      .from('training_participants')
      .select('program_id')
      .in('program_id', ids)
      .is('deleted_at', null)

    if (counts) {
      const countMap: Record<string, number> = {}
      counts.forEach((c: { program_id: string }) => {
        countMap[c.program_id] = (countMap[c.program_id] || 0) + 1
      })
      programs.forEach(p => {
        p._count = { participants: countMap[p.id] || 0 }
      })
    }
  }

  return programs
}

// ── Get Training Participants ──
export async function getTrainingParticipants(filters?: {
  program_id?: string
  status?: ParticipantStatus
}): Promise<TrainingParticipantRow[]> {
  const supabase = await createClient()
  const user = await requireUser()

  let query = supabase
    .from('training_participants')
    .select('*, employee:employees(id,nik,name), program:training_programs(id,title)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (filters?.program_id) query = query.eq('program_id', filters.program_id)
  if (filters?.status) query = query.eq('status', filters.status)

  const { data, error } = await query

  if (error) {
    console.error('getTrainingParticipants error:', error)
    return []
  }
  return (data as unknown as TrainingParticipantRow[]) ?? []
}

// ── Get E-Learning Courses ──
export async function getELearningCourses(): Promise<ELearningCourseRow[]> {
  const supabase = await createClient()
  const user = await requireUser()

  const { data, error } = await supabase
    .from('e_learning_courses')
    .select('*')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getELearningCourses error:', error)
    return []
  }

  const courses = (data as unknown as ELearningCourseRow[]) ?? []

  // Count enrollments per course
  if (courses.length > 0) {
    const ids = courses.map(c => c.id)
    const { data: counts } = await supabase
      .from('e_learning_enrollments')
      .select('course_id')
      .in('course_id', ids)
      .is('deleted_at', null)

    if (counts) {
      const countMap: Record<string, number> = {}
      counts.forEach((c: { course_id: string }) => {
        countMap[c.course_id] = (countMap[c.course_id] || 0) + 1
      })
      courses.forEach(c => {
        c._count = { enrollments: countMap[c.id] || 0 }
      })
    }
  }

  return courses
}

// ── Get E-Learning Enrollments ──
export async function getELearningEnrollments(filters?: {
  course_id?: string
  employee_id?: string
}): Promise<ELearningEnrollmentRow[]> {
  const supabase = await createClient()
  const user = await requireUser()

  let query = supabase
    .from('e_learning_enrollments')
    .select('*, employee:employees(id,nik,name), course:e_learning_courses(id,title,category)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (filters?.course_id) query = query.eq('course_id', filters.course_id)
  if (filters?.employee_id) query = query.eq('employee_id', filters.employee_id)

  const { data, error } = await query

  if (error) {
    console.error('getELearningEnrollments error:', error)
    return []
  }
  return (data as unknown as ELearningEnrollmentRow[]) ?? []
}

// ── Create Training Program ──
export async function createTrainingProgram(data: {
  title: string
  description?: string
  type: TrainingType
  instructor?: string
  start_date: string
  end_date?: string
  quota: number
  location?: string
  notes?: string
}) {
  const supabase = await createClient()
  const user = await requireUser()

  if (!data.title) return { error: 'Judul program wajib diisi' }
  if (!data.start_date) return { error: 'Tanggal mulai wajib diisi' }

  const payload = {
    tenant_id: user.tenantId,
    branch_id: user.branchId,
    title: data.title,
    description: data.description ?? null,
    type: data.type,
    instructor: data.instructor ?? null,
    start_date: data.start_date,
    end_date: data.end_date ?? null,
    quota: data.quota || 10,
    status: 'akan_datang' as const,
    location: data.location ?? null,
    notes: data.notes ?? null,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }

  const { error } = await supabase.from('training_programs').insert(payload)
  if (error) {
    console.error('createTrainingProgram error:', error)
    return { error: 'Gagal membuat program training' }
  }

  revalidatePath('/hr/training')
  return { success: true }
}

// ── Update Program Status ──
export async function updateProgramStatus(
  id: string,
  status: TrainingStatus
) {
  const supabase = await createClient()
  const user = await requireUser()

  const { error } = await supabase
    .from('training_programs')
    .update({
      status,
      updated_by: user.userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('updateProgramStatus error:', error)
    return { error: 'Gagal memperbarui status program' }
  }

  revalidatePath('/hr/training')
  return { success: true }
}

// ── Add Participant ──
export async function addParticipant(data: {
  program_id: string
  employee_id: string
}) {
  const supabase = await createClient()
  const user = await requireUser()

  if (!data.program_id || !data.employee_id) {
    return { error: 'Program dan karyawan wajib dipilih' }
  }

  const payload = {
    tenant_id: user.tenantId,
    program_id: data.program_id,
    employee_id: data.employee_id,
    status: 'terdaftar' as const,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }

  const { error } = await supabase.from('training_participants').insert(payload)
  if (error) {
    console.error('addParticipant error:', error)
    return { error: 'Gagal menambahkan peserta' }
  }

  revalidatePath('/hr/training')
  return { success: true }
}

// ── Update Participant Status ──
export async function updateParticipantStatus(
  id: string,
  data: {
    status: ParticipantStatus
    score?: number | null
    notes?: string | null
  }
) {
  const supabase = await createClient()
  const user = await requireUser()

  const payload: Record<string, unknown> = {
    status: data.status,
    updated_by: user.userId,
    updated_at: new Date().toISOString(),
  }
  if (data.score !== undefined) payload.score = data.score
  if (data.notes !== undefined) payload.notes = data.notes

  const { error } = await supabase
    .from('training_participants')
    .update(payload)
    .eq('id', id)

  if (error) {
    console.error('updateParticipantStatus error:', error)
    return { error: 'Gagal memperbarui status peserta' }
  }

  revalidatePath('/hr/training')
  return { success: true }
}

// ── Create E-Learning Course ──
export async function createELearningCourse(data: {
  title: string
  description?: string
  category: CourseCategory
  duration_hours: number
  module_count: number
}) {
  const supabase = await createClient()
  const user = await requireUser()

  if (!data.title) return { error: 'Judul course wajib diisi' }

  const payload = {
    tenant_id: user.tenantId,
    title: data.title,
    description: data.description ?? null,
    category: data.category,
    duration_hours: data.duration_hours || 0,
    module_count: data.module_count || 0,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }

  const { error } = await supabase.from('e_learning_courses').insert(payload)
  if (error) {
    console.error('createELearningCourse error:', error)
    return { error: 'Gagal membuat course e-learning' }
  }

  revalidatePath('/hr/training')
  return { success: true }
}

// ── Enroll Employee ──
export async function enrollEmployee(data: {
  course_id: string
  employee_id: string
}) {
  const supabase = await createClient()
  const user = await requireUser()

  if (!data.course_id || !data.employee_id) {
    return { error: 'Course dan karyawan wajib dipilih' }
  }

  const payload = {
    tenant_id: user.tenantId,
    course_id: data.course_id,
    employee_id: data.employee_id,
    completion_pct: 0,
    status: 'baru' as const,
    is_active: true,
  }

  const { error } = await supabase.from('e_learning_enrollments').insert(payload)
  if (error) {
    console.error('enrollEmployee error:', error)
    return { error: 'Gagal mendaftarkan karyawan' }
  }

  revalidatePath('/hr/training')
  return { success: true }
}

// ── Update Enrollment ──
export async function updateEnrollment(
  id: string,
  data: {
    completion_pct?: number
    status?: EnrollmentStatus
  }
) {
  const supabase = await createClient()

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (data.completion_pct !== undefined) payload.completion_pct = data.completion_pct
  if (data.status !== undefined) payload.status = data.status

  const { error } = await supabase
    .from('e_learning_enrollments')
    .update(payload)
    .eq('id', id)

  if (error) {
    console.error('updateEnrollment error:', error)
    return { error: 'Gagal memperbarui enrollment' }
  }

  revalidatePath('/hr/training')
  return { success: true }
}