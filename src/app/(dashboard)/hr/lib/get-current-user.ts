'use server'

import { createClient } from '@/lib/supabase/server'

export interface UserContext {
  tenantId: string
  entityId: string | null
  branchId: string | null
  userId: string
  name: string
  email: string
  gradeId: string | null
  departmentId: string | null
  positionId: string | null
}

export async function getCurrentUser(): Promise<UserContext | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('id, tenant_id, entity_id, branch_id, name, email, grade_id, department_id, position_id')
    .eq('auth_user_id', user.id)
    .is('deleted_at', null)
    .single()

  if (error || !profile) return null

  return {
    tenantId: profile.tenant_id,
    entityId: profile.entity_id,
    branchId: profile.branch_id,
    userId: profile.id,
    name: profile.name,
    email: profile.email,
    gradeId: profile.grade_id,
    departmentId: profile.department_id,
    positionId: profile.position_id,
  }
}

export async function requireUser(): Promise<UserContext> {
  const ctx = await getCurrentUser()
  if (!ctx) throw new Error('Unauthorized: user not found')
  return ctx
}
