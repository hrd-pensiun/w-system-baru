"use server"

import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/app/(dashboard)/hr/lib/get-current-user"
import { revalidatePath } from "next/cache"

// ── Types ──
export interface TerBracket {
  id: string
  tenant_id: string
  effective_year: number
  ptkp_status: string
  income_min: number
  income_max: number | null
  rate: number
  created_at: string
}

// ── Get All (grouped by year + status) ──
export async function getTerBrackets(year?: number): Promise<TerBracket[]> {
  const supabase = await createClient()
  let query = supabase
    .from("hr_ter_brackets")
    .select("*")
    .order("ptkp_status", { ascending: true })
    .order("income_min", { ascending: true })

  if (year) {
    query = query.eq("effective_year", year)
  }

  const { data, error } = await query

  if (error) {
    console.error("getTerBrackets error:", error)
    return []
  }
  return data ?? []
}

// ── Get available years ──
export async function getTerYears(): Promise<number[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hr_ter_brackets")
    .select("effective_year")
    .order("effective_year", { ascending: false })

  if (error || !data) return []

  // Deduplicate
  const years = [...new Set(data.map((d: { effective_year: number }) => d.effective_year))]
  return years
}

// ── Get PTKP statuses for a year ──
export async function getTerStatuses(year: number): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hr_ter_brackets")
    .select("ptkp_status")
    .eq("effective_year", year)
    .order("ptkp_status", { ascending: true })

  if (error || !data) return []

  const statuses = [...new Set(data.map((d: { ptkp_status: string }) => d.ptkp_status))]
  return statuses
}

// ── Create single bracket ──
export async function createTerBracket(formData: FormData) {
  const supabase = await createClient()
  const user = await requireUser()

  const payload = {
    tenant_id: user.tenantId,
    effective_year: Number(formData.get("effective_year") ?? new Date().getFullYear()),
    ptkp_status: String(formData.get("ptkp_status") ?? "TK/0"),
    income_min: Number(formData.get("income_min") ?? 0),
    income_max: formData.get("income_max") ? Number(formData.get("income_max")) : null,
    rate: Number(formData.get("rate") ?? 0),
  }

  if (!payload.ptkp_status || payload.income_min < 0) {
    return { error: "Status PTKP dan penghasilan minimal wajib diisi" }
  }

  const { error } = await supabase.from("hr_ter_brackets").insert(payload)
  if (error) {
    console.error("createTerBracket error:", error)
    if (error.code === "23505") return { error: "Bracket TER untuk kombinasi ini sudah ada" }
    return { error: "Gagal menyimpan bracket TER" }
  }

  revalidatePath("/hr/payroll-config")
  return { success: true }
}

// ── Update single bracket ──
export async function updateTerBracket(id: string, formData: FormData) {
  const supabase = await createClient()

  const payload = {
    effective_year: Number(formData.get("effective_year") ?? new Date().getFullYear()),
    ptkp_status: String(formData.get("ptkp_status") ?? "TK/0"),
    income_min: Number(formData.get("income_min") ?? 0),
    income_max: formData.get("income_max") ? Number(formData.get("income_max")) : null,
    rate: Number(formData.get("rate") ?? 0),
  }

  const { error } = await supabase
    .from("hr_ter_brackets")
    .update(payload)
    .eq("id", id)

  if (error) {
    console.error("updateTerBracket error:", error)
    return { error: "Gagal memperbarui bracket TER" }
  }

  revalidatePath("/hr/payroll-config")
  return { success: true }
}

// ── Delete single bracket ──
export async function deleteTerBracket(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("hr_ter_brackets").delete().eq("id", id)
  if (error) {
    console.error("deleteTerBracket error:", error)
    return { error: "Gagal menghapus bracket TER" }
  }
  revalidatePath("/hr/payroll-config")
  return { success: true }
}

// ── Bulk import brackets (for seeding TER data) ──
export async function bulkImportTerBrackets(year: number, brackets: Omit<TerBracket, "id" | "tenant_id" | "created_at">[]) {
  const supabase = await createClient()
  const user = await requireUser()

  const rows = brackets.map((b) => ({
    tenant_id: user.tenantId,
    effective_year: year,
    ptkp_status: b.ptkp_status,
    income_min: b.income_min,
    income_max: b.income_max,
    rate: b.rate,
  }))

  // Delete existing brackets for that year first (full replace)
  const { error: delError } = await supabase
    .from("hr_ter_brackets")
    .delete()
    .eq("effective_year", year)

  if (delError) {
    console.error("bulkImport delete error:", delError)
    return { error: "Gagal menghapus data TER lama" }
  }

  const { error: insError } = await supabase.from("hr_ter_brackets").insert(rows)
  if (insError) {
    console.error("bulkImport insert error:", insError)
    return { error: "Gagal menyimpan data TER" }
  }

  revalidatePath("/hr/payroll-config")
  return { success: true, count: rows.length }
}
