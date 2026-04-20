"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// ── Types ──
export interface WorkCalendar {
  id: string
  tenant_id: string
  entity_id: string | null
  date: string
  day_type: "workday" | "weekend" | "national_holiday" | "company_holiday"
  name: string | null
  created_at: string
}

export interface WorkCalendarFormData {
  date: string
  day_type: "workday" | "weekend" | "national_holiday" | "company_holiday"
  name?: string
}

// ── Get All ──
export async function getWorkCalendars(year?: number): Promise<WorkCalendar[]> {
  const supabase = await createClient()
  let query = supabase
    .from("hr_work_calendars")
    .select("*")
    .order("date", { ascending: true })

  if (year) {
    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`
    query = query.gte("date", startDate).lte("date", endDate)
  }

  const { data, error } = await query

  if (error) {
    console.error("getWorkCalendars error:", error)
    return []
  }
  return data ?? []
}

// ── Get By ID ──
export async function getWorkCalendar(id: string): Promise<WorkCalendar | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hr_work_calendars")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getWorkCalendar error:", error)
    return null
  }
  return data
}

// ── Create ──
export async function createWorkCalendar(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("tenant_id, entity_id")
    .eq("auth_user_id", user.id)
    .single()

  if (!profile) return { error: "Profil user tidak ditemukan" }

  const dayType = String(formData.get("day_type") ?? "workday") as WorkCalendar["day_type"]
  const validDayTypes = ["workday", "weekend", "national_holiday", "company_holiday"]

  if (!validDayTypes.includes(dayType)) {
    return { error: "Tipe hari tidak valid" }
  }

  const payload = {
    tenant_id: profile.tenant_id,
    entity_id: profile.entity_id,
    date: String(formData.get("date") ?? ""),
    day_type: dayType,
    name: String(formData.get("name") ?? "") || null,
  }

  if (!payload.date) {
    return { error: "Tanggal wajib diisi" }
  }

  const { error } = await supabase.from("hr_work_calendars").insert(payload)

  if (error) {
    console.error("createWorkCalendar error:", error)
    if (error.code === "23505") {
      return { error: "Kalender untuk tanggal ini sudah ada" }
    }
    return { error: "Gagal menyimpan data kalender" }
  }

  revalidatePath("/hr/master-data")
  return { success: true }
}

// ── Update ──
export async function updateWorkCalendar(id: string, formData: FormData) {
  const supabase = await createClient()

  const dayType = String(formData.get("day_type") ?? "workday") as WorkCalendar["day_type"]

  const payload = {
    date: String(formData.get("date") ?? ""),
    day_type: dayType,
    name: String(formData.get("name") ?? "") || null,
  }

  if (!payload.date) {
    return { error: "Tanggal wajib diisi" }
  }

  const { error } = await supabase
    .from("hr_work_calendars")
    .update(payload)
    .eq("id", id)

  if (error) {
    console.error("updateWorkCalendar error:", error)
    return { error: "Gagal memperbarui data kalender" }
  }

  revalidatePath("/hr/master-data")
  return { success: true }
}

// ── Delete ──
export async function deleteWorkCalendar(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("hr_work_calendars")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("deleteWorkCalendar error:", error)
    return { error: "Gagal menghapus data kalender" }
  }

  revalidatePath("/hr/master-data")
  return { success: true }
}
