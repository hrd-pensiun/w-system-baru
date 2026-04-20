"use server"

import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/app/(dashboard)/hr/lib/get-current-user"
import { revalidatePath } from "next/cache"

// ── Types ──
export interface SalaryComponent {
  id: string
  tenant_id: string
  code: string
  name: string
  component_type: "earning" | "deduction"
  category: string
  is_taxable: boolean
  is_bpjs_base: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// ── Get All ──
export async function getSalaryComponents(): Promise<SalaryComponent[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hr_salary_components")
    .select("*")
    .is("deleted_at", null)
    .order("component_type", { ascending: true })
    .order("code", { ascending: true })

  if (error) {
    console.error("getSalaryComponents error:", error)
    return []
  }
  return data ?? []
}

// ── Create ──
export async function createSalaryComponent(formData: FormData) {
  const supabase = await createClient()
  const user = await requireUser()

  const componentType = String(formData.get("component_type") ?? "earning")
  if (!["earning", "deduction"].includes(componentType)) {
    return { error: "Tipe komponen tidak valid" }
  }

  const payload = {
    tenant_id: user.tenantId,
    code: String(formData.get("code") ?? ""),
    name: String(formData.get("name") ?? ""),
    component_type: componentType as "earning" | "deduction",
    category: String(formData.get("category") ?? ""),
    is_taxable: formData.get("is_taxable") === "on",
    is_bpjs_base: formData.get("is_bpjs_base") === "on",
    is_active: true,
  }

  if (!payload.code || !payload.name || !payload.category) {
    return { error: "Kode, nama, dan kategori wajib diisi" }
  }

  const { error } = await supabase.from("hr_salary_components").insert(payload)
  if (error) {
    console.error("createSalaryComponent error:", error)
    if (error.code === "23505") return { error: "Kode komponen sudah digunakan" }
    return { error: "Gagal menyimpan komponen gaji" }
  }

  revalidatePath("/hr/salary-config")
  return { success: true }
}

// ── Update ──
export async function updateSalaryComponent(id: string, formData: FormData) {
  const supabase = await createClient()

  const componentType = String(formData.get("component_type") ?? "earning")
  if (!["earning", "deduction"].includes(componentType)) {
    return { error: "Tipe komponen tidak valid" }
  }

  const payload = {
    code: String(formData.get("code") ?? ""),
    name: String(formData.get("name") ?? ""),
    component_type: componentType as "earning" | "deduction",
    category: String(formData.get("category") ?? ""),
    is_taxable: formData.get("is_taxable") === "on",
    is_bpjs_base: formData.get("is_bpjs_base") === "on",
    is_active: formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("hr_salary_components").update(payload).eq("id", id)
  if (error) {
    console.error("updateSalaryComponent error:", error)
    if (error.code === "23505") return { error: "Kode komponen sudah digunakan" }
    return { error: "Gagal memperbarui komponen gaji" }
  }

  revalidatePath("/hr/salary-config")
  return { success: true }
}

// ── Soft Delete ──
export async function deleteSalaryComponent(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("hr_salary_components")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("deleteSalaryComponent error:", error)
    return { error: "Gagal menghapus komponen gaji" }
  }

  revalidatePath("/hr/salary-config")
  return { success: true }
}
