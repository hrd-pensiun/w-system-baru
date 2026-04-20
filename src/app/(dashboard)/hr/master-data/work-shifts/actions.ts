"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// ── Types ──
export interface WorkShift {
  id: string
  tenant_id: string
  entity_id: string | null
  name: string
  code: string
  start_time: string
  end_time: string
  is_overnight: boolean
  break_minutes: number
  grace_period_minutes: number
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface WorkShiftFormData {
  name: string
  code: string
  start_time: string
  end_time: string
  is_overnight?: boolean
  break_minutes?: number
  grace_period_minutes?: number
  is_active?: boolean
}

// ── Get All ──
export async function getWorkShifts(): Promise<WorkShift[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hr_work_shifts")
    .select("*")
    .is("deleted_at", null)
    .order("code", { ascending: true })

  if (error) {
    console.error("getWorkShifts error:", error)
    return []
  }
  return data ?? []
}

// ── Get By ID ──
export async function getWorkShift(id: string): Promise<WorkShift | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hr_work_shifts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getWorkShift error:", error)
    return null
  }
  return data
}

// ── Create ──
export async function createWorkShift(formData: FormData) {
  const supabase = await createClient()

  // Get current user's tenant_id
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("tenant_id, entity_id")
    .eq("auth_user_id", user.id)
    .single()

  if (!profile) return { error: "Profil user tidak ditemukan" }

  const payload = {
    tenant_id: profile.tenant_id,
    entity_id: profile.entity_id,
    name: String(formData.get("name") ?? ""),
    code: String(formData.get("code") ?? ""),
    start_time: String(formData.get("start_time") ?? "08:00"),
    end_time: String(formData.get("end_time") ?? "17:00"),
    is_overnight: formData.get("is_overnight") === "on",
    break_minutes: Number(formData.get("break_minutes") ?? 60),
    grace_period_minutes: Number(formData.get("grace_period_minutes") ?? 15),
    is_active: true,
  }

  if (!payload.name || !payload.code) {
    return { error: "Nama dan kode shift wajib diisi" }
  }

  const { error } = await supabase.from("hr_work_shifts").insert(payload)

  if (error) {
    console.error("createWorkShift error:", error)
    if (error.code === "23505") {
      return { error: "Kode shift sudah digunakan" }
    }
    return { error: "Gagal menyimpan data shift" }
  }

  revalidatePath("/hr/master-data")
  return { success: true }
}

// ── Update ──
export async function updateWorkShift(id: string, formData: FormData) {
  const supabase = await createClient()

  const payload = {
    name: String(formData.get("name") ?? ""),
    code: String(formData.get("code") ?? ""),
    start_time: String(formData.get("start_time") ?? "08:00"),
    end_time: String(formData.get("end_time") ?? "17:00"),
    is_overnight: formData.get("is_overnight") === "on",
    break_minutes: Number(formData.get("break_minutes") ?? 60),
    grace_period_minutes: Number(formData.get("grace_period_minutes") ?? 15),
    is_active: formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  }

  if (!payload.name || !payload.code) {
    return { error: "Nama dan kode shift wajib diisi" }
  }

  const { error } = await supabase
    .from("hr_work_shifts")
    .update(payload)
    .eq("id", id)

  if (error) {
    console.error("updateWorkShift error:", error)
    if (error.code === "23505") {
      return { error: "Kode shift sudah digunakan" }
    }
    return { error: "Gagal memperbarui data shift" }
  }

  revalidatePath("/hr/master-data")
  return { success: true }
}

// ── Soft Delete ──
export async function deleteWorkShift(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("hr_work_shifts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("deleteWorkShift error:", error)
    return { error: "Gagal menghapus data shift" }
  }

  revalidatePath("/hr/master-data")
  return { success: true }
}
