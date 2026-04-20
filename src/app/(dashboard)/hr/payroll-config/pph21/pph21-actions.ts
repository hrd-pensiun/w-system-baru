"use server"

import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/app/(dashboard)/hr/lib/get-current-user"
import { revalidatePath } from "next/cache"

// ── Types ──
export interface Pph21Config {
  id: string
  tenant_id: string
  effective_year: number
  ptkp_tk0: number
  ptkp_k0: number
  ptkp_k1: number
  ptkp_k2: number
  ptkp_k3: number
  jabatan_rate: number
  jabatan_max_annual: number
  non_npwp_surcharge: number
  progressive_brackets: { min: number; max: number | null; rate: number }[]
  created_at: string
  updated_at: string
}

// ── Get All ──
export async function getPph21Configs(): Promise<Pph21Config[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hr_pph21_configs")
    .select("*")
    .order("effective_year", { ascending: false })

  if (error) {
    console.error("getPph21Configs error:", error)
    return []
  }
  return data ?? []
}

// ── Create ──
export async function createPph21Config(formData: FormData) {
  const supabase = await createClient()
  const user = await requireUser()

  // Parse progressive brackets from form
  const bracketsStr = String(formData.get("progressive_brackets") ?? "[]")
  let progressive_brackets = [
    { min: 0, max: 60000000, rate: 0.05 },
    { min: 60000000, max: 250000000, rate: 0.15 },
    { min: 250000000, max: 500000000, rate: 0.25 },
    { min: 500000000, max: 5000000000, rate: 0.30 },
    { min: 5000000000, max: null, rate: 0.35 },
  ]
  try {
    progressive_brackets = JSON.parse(bracketsStr)
  } catch { /* use default */ }

  const payload = {
    tenant_id: user.tenantId,
    effective_year: Number(formData.get("effective_year") ?? new Date().getFullYear()),
    ptkp_tk0: Number(formData.get("ptkp_tk0") ?? 54000000),
    ptkp_k0: Number(formData.get("ptkp_k0") ?? 58500000),
    ptkp_k1: Number(formData.get("ptkp_k1") ?? 63000000),
    ptkp_k2: Number(formData.get("ptkp_k2") ?? 67500000),
    ptkp_k3: Number(formData.get("ptkp_k3") ?? 72000000),
    jabatan_rate: Number(formData.get("jabatan_rate") ?? 0.05),
    jabatan_max_annual: Number(formData.get("jabatan_max_annual") ?? 6000000),
    non_npwp_surcharge: Number(formData.get("non_npwp_surcharge") ?? 0.20),
    progressive_brackets,
  }

  const { error } = await supabase.from("hr_pph21_configs").insert(payload)
  if (error) {
    console.error("createPph21Config error:", error)
    if (error.code === "23505") return { error: "Konfigurasi PPh21 untuk tahun ini sudah ada" }
    return { error: "Gagal menyimpan konfigurasi PPh21" }
  }

  revalidatePath("/hr/payroll-config")
  return { success: true }
}

// ── Update ──
export async function updatePph21Config(id: string, formData: FormData) {
  const supabase = await createClient()

  const bracketsStr = String(formData.get("progressive_brackets") ?? "[]")
  let progressive_brackets: { min: number; max: number | null; rate: number }[] = []
  try {
    progressive_brackets = JSON.parse(bracketsStr)
  } catch { /* keep empty */ }

  const payload = {
    effective_year: Number(formData.get("effective_year") ?? new Date().getFullYear()),
    ptkp_tk0: Number(formData.get("ptkp_tk0") ?? 0),
    ptkp_k0: Number(formData.get("ptkp_k0") ?? 0),
    ptkp_k1: Number(formData.get("ptkp_k1") ?? 0),
    ptkp_k2: Number(formData.get("ptkp_k2") ?? 0),
    ptkp_k3: Number(formData.get("ptkp_k3") ?? 0),
    jabatan_rate: Number(formData.get("jabatan_rate") ?? 0),
    jabatan_max_annual: Number(formData.get("jabatan_max_annual") ?? 0),
    non_npwp_surcharge: Number(formData.get("non_npwp_surcharge") ?? 0),
    progressive_brackets,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("hr_pph21_configs").update(payload).eq("id", id)
  if (error) {
    console.error("updatePph21Config error:", error)
    return { error: "Gagal memperbarui konfigurasi PPh21" }
  }

  revalidatePath("/hr/payroll-config")
  return { success: true }
}

// ── Delete ──
export async function deletePph21Config(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("hr_pph21_configs").delete().eq("id", id)
  if (error) {
    console.error("deletePph21Config error:", error)
    return { error: "Gagal menghapus konfigurasi PPh21" }
  }
  revalidatePath("/hr/payroll-config")
  return { success: true }
}
