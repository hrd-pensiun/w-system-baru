"use server"

import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/app/(dashboard)/hr/lib/get-current-user"
import { revalidatePath } from "next/cache"

// ── Types ──
export interface SalaryMatrix {
  id: string
  tenant_id: string
  entity_id: string | null
  grade_id: string
  step: number
  amount: number
  effective_date: string
  end_date: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface SalaryMatrixWithGrade extends SalaryMatrix {
  grade_code?: string
  grade_name?: string
}

// ── Get All (with grade info) ──
export async function getSalaryMatrix(): Promise<SalaryMatrixWithGrade[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("hr_salary_matrix")
    .select("*, grade:hr_job_grades(code, name)")
    .order("effective_date", { ascending: false })

  if (error) {
    console.error("getSalaryMatrix error:", error)
    return []
  }

  return (data ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    grade_code: (row.grade as Record<string, string>)?.code ?? "-",
    grade_name: (row.grade as Record<string, string>)?.name ?? "-",
  })) as SalaryMatrixWithGrade[]
}

// ── Create ──
export async function createSalaryMatrix(formData: FormData) {
  const supabase = await createClient()
  const user = await requireUser()

  const payload = {
    tenant_id: user.tenantId,
    entity_id: user.entityId,
    grade_id: String(formData.get("grade_id") ?? ""),
    step: Number(formData.get("step") ?? 1),
    amount: Number(formData.get("amount") ?? 0),
    effective_date: String(formData.get("effective_date") ?? ""),
    end_date: formData.get("end_date") ? String(formData.get("end_date")) : null,
    created_by: user.userId,
  }

  if (!payload.grade_id || !payload.effective_date || !payload.amount) {
    return { error: "Grade, tanggal efektif, dan nominal wajib diisi" }
  }

  const { error } = await supabase.from("hr_salary_matrix").insert(payload)
  if (error) {
    console.error("createSalaryMatrix error:", error)
    if (error.code === "23505") return { error: "Matrix untuk grade/step/tanggal ini sudah ada" }
    return { error: "Gagal menyimpan salary matrix" }
  }

  revalidatePath("/hr/salary-config")
  return { success: true }
}

// ── Update ──
export async function updateSalaryMatrix(id: string, formData: FormData) {
  const supabase = await createClient()

  const payload = {
    grade_id: String(formData.get("grade_id") ?? ""),
    step: Number(formData.get("step") ?? 1),
    amount: Number(formData.get("amount") ?? 0),
    effective_date: String(formData.get("effective_date") ?? ""),
    end_date: formData.get("end_date") ? String(formData.get("end_date")) : null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("hr_salary_matrix").update(payload).eq("id", id)
  if (error) {
    console.error("updateSalaryMatrix error:", error)
    return { error: "Gagal memperbarui salary matrix" }
  }

  revalidatePath("/hr/salary-config")
  return { success: true }
}

// ── Delete ──
export async function deleteSalaryMatrix(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("hr_salary_matrix").delete().eq("id", id)
  if (error) {
    console.error("deleteSalaryMatrix error:", error)
    return { error: "Gagal menghapus salary matrix" }
  }

  revalidatePath("/hr/salary-config")
  return { success: true }
}

// ── Get grades for dropdown ──
export async function getGrades(): Promise<{ id: string; code: string; name: string }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hr_job_grades")
    .select("id, code, name")
    .order("sequence", { ascending: true })

  if (error || !data) return []
  return data
}
