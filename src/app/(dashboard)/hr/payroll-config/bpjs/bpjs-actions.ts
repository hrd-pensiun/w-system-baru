"use server"

import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/app/(dashboard)/hr/lib/get-current-user"
import { revalidatePath } from "next/cache"

// ── Types ──
export interface BpjsConfig {
  id: string
  tenant_id: string
  effective_year: number
  tk_jkk_rate: number
  tk_jkm_rate: number
  tk_jht_employee_rate: number
  tk_jht_company_rate: number
  tk_jp_employee_rate: number
  tk_jp_company_rate: number
  tk_jp_max_salary: number
  kes_employee_rate: number
  kes_company_rate: number
  kes_max_salary: number
  created_at: string
  updated_at: string
}

// ── Get All ──
export async function getBpjsConfigs(): Promise<BpjsConfig[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hr_bpjs_configs")
    .select("*")
    .order("effective_year", { ascending: false })

  if (error) {
    console.error("getBpjsConfigs error:", error)
    return []
  }
  return data ?? []
}

// ── Create ──
export async function createBpjsConfig(formData: FormData) {
  const supabase = await createClient()
  const user = await requireUser()

  const payload = {
    tenant_id: user.tenantId,
    effective_year: Number(formData.get("effective_year") ?? new Date().getFullYear()),
    tk_jkk_rate: Number(formData.get("tk_jkk_rate") ?? 0.0024),
    tk_jkm_rate: Number(formData.get("tk_jkm_rate") ?? 0.003),
    tk_jht_employee_rate: Number(formData.get("tk_jht_employee_rate") ?? 0.02),
    tk_jht_company_rate: Number(formData.get("tk_jht_company_rate") ?? 0.037),
    tk_jp_employee_rate: Number(formData.get("tk_jp_employee_rate") ?? 0.01),
    tk_jp_company_rate: Number(formData.get("tk_jp_company_rate") ?? 0.02),
    tk_jp_max_salary: Number(formData.get("tk_jp_max_salary") ?? 9559600),
    kes_employee_rate: Number(formData.get("kes_employee_rate") ?? 0.01),
    kes_company_rate: Number(formData.get("kes_company_rate") ?? 0.04),
    kes_max_salary: Number(formData.get("kes_max_salary") ?? 12000000),
  }

  const { error } = await supabase.from("hr_bpjs_configs").insert(payload)
  if (error) {
    console.error("createBpjsConfig error:", error)
    if (error.code === "23505") return { error: "Konfigurasi BPJS untuk tahun ini sudah ada" }
    return { error: "Gagal menyimpan konfigurasi BPJS" }
  }

  revalidatePath("/hr/payroll-config")
  return { success: true }
}

// ── Update ──
export async function updateBpjsConfig(id: string, formData: FormData) {
  const supabase = await createClient()

  const payload = {
    effective_year: Number(formData.get("effective_year") ?? new Date().getFullYear()),
    tk_jkk_rate: Number(formData.get("tk_jkk_rate") ?? 0),
    tk_jkm_rate: Number(formData.get("tk_jkm_rate") ?? 0),
    tk_jht_employee_rate: Number(formData.get("tk_jht_employee_rate") ?? 0),
    tk_jht_company_rate: Number(formData.get("tk_jht_company_rate") ?? 0),
    tk_jp_employee_rate: Number(formData.get("tk_jp_employee_rate") ?? 0),
    tk_jp_company_rate: Number(formData.get("tk_jp_company_rate") ?? 0),
    tk_jp_max_salary: Number(formData.get("tk_jp_max_salary") ?? 0),
    kes_employee_rate: Number(formData.get("kes_employee_rate") ?? 0),
    kes_company_rate: Number(formData.get("kes_company_rate") ?? 0),
    kes_max_salary: Number(formData.get("kes_max_salary") ?? 0),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("hr_bpjs_configs").update(payload).eq("id", id)
  if (error) {
    console.error("updateBpjsConfig error:", error)
    if (error.code === "23505") return { error: "Konfigurasi BPJS untuk tahun ini sudah ada" }
    return { error: "Gagal memperbarui konfigurasi BPJS" }
  }

  revalidatePath("/hr/payroll-config")
  return { success: true }
}

// ── Delete ──
export async function deleteBpjsConfig(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("hr_bpjs_configs").delete().eq("id", id)
  if (error) {
    console.error("deleteBpjsConfig error:", error)
    return { error: "Gagal menghapus konfigurasi BPJS" }
  }
  revalidatePath("/hr/payroll-config")
  return { success: true }
}
