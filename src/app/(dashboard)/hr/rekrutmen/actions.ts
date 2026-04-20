'use server'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/app/(dashboard)/hr/lib/get-current-user'
import { revalidatePath } from 'next/cache'

// ── Types ──
export type RecruitmentStatus = 'draft' | 'buka' | 'tutup' | 'batal'
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance'
export type ApplicantStage = 'melamar' | 'screening' | 'interview' | 'assessment' | 'offering' | 'dihiring' | 'ditolak'
export type ApplicantSource = 'website' | 'linkedin' | 'referral' | 'job_board' | 'walk_in' | 'other'

export interface RecruitmentRow {
  id: string
  tenant_id: string
  branch_id: string | null
  department_id: string | null
  position_id: string | null
  title: string
  description: string | null
  requirements: string | null
  employment_type: string
  salary_min: number | null
  salary_max: number | null
  location: string
  is_remote: boolean
  status: string
  opened_at: string | null
  closed_at: string | null
  vacancies: number
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  _count?: { applicants: number }
}

export interface ApplicantRow {
  id: string
  tenant_id: string
  recruitment_id: string
  full_name: string
  email: string | null
  phone: string | null
  current_company: string | null
  current_position: string | null
  source: string
  resume_url: string | null
  stage: string
  applied_at: string
  notes: string | null
  rating: number | null
  is_talent_pool: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  deleted_at: string | null
  recruitment: { id: string; title: string } | null
}

// ── Get Recruitments ──
export async function getRecruitments(filters?: {
  status?: RecruitmentStatus
  search?: string
}): Promise<RecruitmentRow[]> {
  const supabase = await createClient()
  const user = await requireUser()

  let query = supabase
    .from('hr_recruitments')
    .select('*')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)

  const { data, error } = await query

  if (error) {
    console.error('getRecruitments error:', error)
    return []
  }

  // Get applicant counts per recruitment
  const recruitments = (data as unknown as RecruitmentRow[]) ?? []
  if (recruitments.length > 0) {
    const ids = recruitments.map(r => r.id)
    const { data: counts } = await supabase
      .from('hr_applicants')
      .select('recruitment_id')
      .in('recruitment_id', ids)
      .is('deleted_at', null)

    if (counts) {
      const countMap: Record<string, number> = {}
      counts.forEach((c: { recruitment_id: string }) => {
        countMap[c.recruitment_id] = (countMap[c.recruitment_id] || 0) + 1
      })
      recruitments.forEach(r => {
        r._count = { applicants: countMap[r.id] || 0 }
      })
    }
  }

  if (filters?.search) {
    const s = filters.search.toLowerCase()
    return recruitments.filter(r =>
      r.title.toLowerCase().includes(s) ||
      r.location.toLowerCase().includes(s)
    )
  }

  return recruitments
}

// ── Create Recruitment ──
export async function createRecruitment(data: {
  title: string
  department_id?: string | null
  position_id?: string | null
  description?: string
  requirements?: string
  employment_type: EmploymentType
  salary_min?: number | null
  salary_max?: number | null
  location?: string
  is_remote?: boolean
  vacancies?: number
  status?: RecruitmentStatus
}) {
  const supabase = await createClient()
  const user = await requireUser()

  if (!data.title) return { error: 'Judul lowongan wajib diisi' }

  const payload = {
    tenant_id: user.tenantId,
    title: data.title,
    department_id: data.department_id ?? null,
    position_id: data.position_id ?? null,
    description: data.description ?? null,
    requirements: data.requirements ?? null,
    employment_type: data.employment_type,
    salary_min: data.salary_min ?? null,
    salary_max: data.salary_max ?? null,
    location: data.location || 'Jakarta',
    is_remote: data.is_remote ?? false,
    vacancies: data.vacancies || 1,
    status: data.status || 'draft',
    opened_at: data.status === 'buka' ? new Date().toISOString().split('T')[0] : null,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }

  const { error } = await supabase.from('hr_recruitments').insert(payload)
  if (error) {
    console.error('createRecruitment error:', error)
    return { error: 'Gagal membuat lowongan' }
  }

  revalidatePath('/hr/rekrutmen')
  return { success: true }
}

// ── Update Recruitment ──
export async function updateRecruitment(
  id: string,
  data: {
    title?: string
    description?: string | null
    requirements?: string | null
    employment_type?: string
    salary_min?: number | null
    salary_max?: number | null
    location?: string
    is_remote?: boolean
    status?: RecruitmentStatus
    vacancies?: number
  }
) {
  const supabase = await createClient()
  const user = await requireUser()

  const payload: Record<string, unknown> = {
    updated_by: user.userId,
    updated_at: new Date().toISOString(),
  }

  if (data.title !== undefined) payload.title = data.title
  if (data.description !== undefined) payload.description = data.description
  if (data.requirements !== undefined) payload.requirements = data.requirements
  if (data.employment_type !== undefined) payload.employment_type = data.employment_type
  if (data.salary_min !== undefined) payload.salary_min = data.salary_min
  if (data.salary_max !== undefined) payload.salary_max = data.salary_max
  if (data.location !== undefined) payload.location = data.location
  if (data.is_remote !== undefined) payload.is_remote = data.is_remote
  if (data.vacancies !== undefined) payload.vacancies = data.vacancies
  if (data.status !== undefined) {
    payload.status = data.status
    if (data.status === 'buka') payload.opened_at = new Date().toISOString().split('T')[0]
    if (data.status === 'tutup') payload.closed_at = new Date().toISOString().split('T')[0]
  }

  const { error } = await supabase
    .from('hr_recruitments')
    .update(payload)
    .eq('id', id)

  if (error) {
    console.error('updateRecruitment error:', error)
    return { error: 'Gagal memperbarui lowongan' }
  }

  revalidatePath('/hr/rekrutmen')
  return { success: true }
}

// ── Soft Delete Recruitment ──
export async function deleteRecruitment(id: string) {
  const supabase = await createClient()
  const user = await requireUser()

  const { error } = await supabase
    .from('hr_recruitments')
    .update({
      deleted_at: new Date().toISOString(),
      updated_by: user.userId,
    })
    .eq('id', id)

  if (error) {
    console.error('deleteRecruitment error:', error)
    return { error: 'Gagal menghapus lowongan' }
  }

  revalidatePath('/hr/rekrutmen')
  return { success: true }
}

// ── Get Applicants ──
export async function getApplicants(filters?: {
  recruitmentId?: string
  stage?: ApplicantStage
  talentPool?: boolean
}): Promise<ApplicantRow[]> {
  const supabase = await createClient()
  const user = await requireUser()

  let query = supabase
    .from('hr_applicants')
    .select('*, recruitment:hr_recruitments(id,title)')
    .eq('tenant_id', user.tenantId)
    .is('deleted_at', null)
    .order('applied_at', { ascending: false })

  if (filters?.recruitmentId) query = query.eq('recruitment_id', filters.recruitmentId)
  if (filters?.stage) query = query.eq('stage', filters.stage)
  if (filters?.talentPool) query = query.eq('is_talent_pool', true)

  const { data, error } = await query

  if (error) {
    console.error('getApplicants error:', error)
    return []
  }
  return (data as unknown as ApplicantRow[]) ?? []
}

// ── Create Applicant ──
export async function createApplicant(data: {
  recruitment_id: string
  full_name: string
  email?: string
  phone?: string
  current_company?: string
  current_position?: string
  source?: ApplicantSource
  is_talent_pool?: boolean
  notes?: string
}) {
  const supabase = await createClient()
  const user = await requireUser()

  if (!data.recruitment_id || !data.full_name) {
    return { error: 'Lowongan dan nama pelamar wajib diisi' }
  }

  const payload = {
    tenant_id: user.tenantId,
    recruitment_id: data.recruitment_id,
    full_name: data.full_name,
    email: data.email ?? null,
    phone: data.phone ?? null,
    current_company: data.current_company ?? null,
    current_position: data.current_position ?? null,
    source: data.source || 'website',
    stage: 'melamar' as const,
    is_talent_pool: data.is_talent_pool ?? false,
    notes: data.notes ?? null,
    is_active: true,
    created_by: user.userId,
    updated_by: user.userId,
  }

  const { error } = await supabase.from('hr_applicants').insert(payload)
  if (error) {
    console.error('createApplicant error:', error)
    return { error: 'Gagal menambahkan pelamar' }
  }

  revalidatePath('/hr/rekrutmen')
  return { success: true }
}

// ── Update Applicant Stage ──
export async function updateApplicantStage(
  id: string,
  stage: ApplicantStage,
  notes?: string
) {
  const supabase = await createClient()
  const user = await requireUser()

  const payload: Record<string, unknown> = {
    stage,
    updated_by: user.userId,
    updated_at: new Date().toISOString(),
  }
  if (notes !== undefined) payload.notes = notes

  const { error } = await supabase
    .from('hr_applicants')
    .update(payload)
    .eq('id', id)

  if (error) {
    console.error('updateApplicantStage error:', error)
    return { error: 'Gagal memperbarui tahap pelamar' }
  }

  revalidatePath('/hr/rekrutmen')
  return { success: true }
}

// ── Update Applicant ──
export async function updateApplicant(
  id: string,
  data: {
    full_name?: string
    email?: string | null
    phone?: string | null
    current_company?: string | null
    current_position?: string | null
    source?: string
    notes?: string | null
    rating?: number | null
    is_talent_pool?: boolean
  }
) {
  const supabase = await createClient()
  const user = await requireUser()

  const payload: Record<string, unknown> = {
    updated_by: user.userId,
    updated_at: new Date().toISOString(),
  }

  if (data.full_name !== undefined) payload.full_name = data.full_name
  if (data.email !== undefined) payload.email = data.email
  if (data.phone !== undefined) payload.phone = data.phone
  if (data.current_company !== undefined) payload.current_company = data.current_company
  if (data.current_position !== undefined) payload.current_position = data.current_position
  if (data.source !== undefined) payload.source = data.source
  if (data.notes !== undefined) payload.notes = data.notes
  if (data.rating !== undefined) payload.rating = data.rating
  if (data.is_talent_pool !== undefined) payload.is_talent_pool = data.is_talent_pool

  const { error } = await supabase
    .from('hr_applicants')
    .update(payload)
    .eq('id', id)

  if (error) {
    console.error('updateApplicant error:', error)
    return { error: 'Gagal memperbarui data pelamar' }
  }

  revalidatePath('/hr/rekrutmen')
  return { success: true }
}

// ── Soft Delete Applicant ──
export async function deleteApplicant(id: string) {
  const supabase = await createClient()
  const user = await requireUser()

  const { error } = await supabase
    .from('hr_applicants')
    .update({
      deleted_at: new Date().toISOString(),
      updated_by: user.userId,
    })
    .eq('id', id)

  if (error) {
    console.error('deleteApplicant error:', error)
    return { error: 'Gagal menghapus data pelamar' }
  }

  revalidatePath('/hr/rekrutmen')
  return { success: true }
}