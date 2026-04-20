"use server"

import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/app/(dashboard)/hr/lib/get-current-user"
import { revalidatePath } from "next/cache"

// ── Types ──
export interface OvertimeRule {
  id: string
  tenant_id: string
  entity_id: string | null
  day_type: "weekday" | "weekend" | "national_holiday"
  hour_from: number
  hour_to: number | null
  multiplier: number
  created_at: string
  updated_at: string
}

// ── Get All ──
export async function getOvertimeRules(): Promise<OvertimeRule[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hr_overtime_rules")
    .select("*")
    .order("day_type", { ascending: true })
    .order("hour_from", { ascending: true })

  if (error) {
    console.error("getOvertimeRules error:", error)
    return []
  }
  return data ?? []
}

// ── Create ──
export async function createOvertimeRule(formData: FormData) {
  const supabase = await createClient()
  const user = await requireUser()

  const dayType = String(formData.get("day_type") ?? "weekday")
  if (!["weekday", "weekend", "national_holiday"].includes(dayType)) {
    return { error: "Tipe hari tidak valid" }
  }

  const payload = {
    tenant_id: user.tenantId,
    entity_id: user.entityId,
    day_type: dayType as OvertimeRule["day_type"],
    hour_from: Number(formData.get("hour_from") ?? 0),
    hour_to: formData.get("hour_to") ? Number(formData.get("hour_to")) : null,
    multiplier: Number(formData.get("multiplier") ?? 1),
  }

  if (!payload.multiplier || payload.multiplier <= 0) {
    return { error: "Multiplier wajib diisi dan harus lebih dari 0" }
  }

  const { error } = await supabase.from("hr_overtime_rules").insert(payload)
  if (error) {
    console.error("createOvertimeRule error:", error)
    return { error: "Gagal menyimpan aturan lembur" }
  }

  revalidatePath("/hr/salary-config")
  return { success: true }
}

// ── Update ──
export async function updateOvertimeRule(id: string, formData: FormData) {
  const supabase = await createClient()

  const dayType = String(formData.get("day_type") ?? "weekday")
  if (!["weekday", "weekend", "national_holiday"].includes(dayType)) {
    return { error: "Tipe hari tidak valid" }
  }

  const payload = {
    day_type: dayType as OvertimeRule["day_type"],
    hour_from: Number(formData.get("hour_from") ?? 0),
    hour_to: formData.get("hour_to") ? Number(formData.get("hour_to")) : null,
    multiplier: Number(formData.get("multiplier") ?? 1),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("hr_overtime_rules").update(payload).eq("id", id)
  if (error) {
    console.error("updateOvertimeRule error:", error)
    return { error: "Gagal memperbarui aturan lembur" }
  }

  revalidatePath("/hr/salary-config")
  return { success: true }
}

// ── Delete ──
export async function deleteOvertimeRule(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("hr_overtime_rules").delete().eq("id", id)
  if (error) {
    console.error("deleteOvertimeRule error:", error)
    return { error: "Gagal menghapus aturan lembur" }
  }

  revalidatePath("/hr/salary-config")
  return { success: true }
}
