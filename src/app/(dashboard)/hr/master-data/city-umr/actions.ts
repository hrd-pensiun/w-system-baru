"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// ── Types ──
export interface CityUmr {
  id: string
  tenant_id: string
  city_name: string
  province: string | null
  year: number
  umr_amount: number
  created_at: string
}

export interface CityUmrFormData {
  city_name: string
  province?: string
  year: number
  umr_amount: number
}

// ── Get All ──
export async function getCityUmrList(year?: number): Promise<CityUmr[]> {
  const supabase = await createClient()
  let query = supabase
    .from("hr_city_umr")
    .select("*")
    .order("province", { ascending: true })
    .order("city_name", { ascending: true })

  if (year) {
    query = query.eq("year", year)
  }

  const { data, error } = await query

  if (error) {
    console.error("getCityUmrList error:", error)
    return []
  }
  return data ?? []
}

// ── Get By ID ──
export async function getCityUmr(id: string): Promise<CityUmr | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hr_city_umr")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getCityUmr error:", error)
    return null
  }
  return data
}

// ── Create ──
export async function createCityUmr(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("tenant_id")
    .eq("auth_user_id", user.id)
    .single()

  if (!profile) return { error: "Profil user tidak ditemukan" }

  const payload = {
    tenant_id: profile.tenant_id,
    city_name: String(formData.get("city_name") ?? ""),
    province: String(formData.get("province") ?? "") || null,
    year: Number(formData.get("year") ?? new Date().getFullYear()),
    umr_amount: Number(formData.get("umr_amount") ?? 0),
  }

  if (!payload.city_name || !payload.umr_amount) {
    return { error: "Nama kota dan nilai UMR wajib diisi" }
  }

  const { error } = await supabase.from("hr_city_umr").insert(payload)

  if (error) {
    console.error("createCityUmr error:", error)
    if (error.code === "23505") {
      return { error: "Data UMR untuk kota dan tahun ini sudah ada" }
    }
    return { error: "Gagal menyimpan data UMR" }
  }

  revalidatePath("/hr/master-data")
  return { success: true }
}

// ── Update ──
export async function updateCityUmr(id: string, formData: FormData) {
  const supabase = await createClient()

  const payload = {
    city_name: String(formData.get("city_name") ?? ""),
    province: String(formData.get("province") ?? "") || null,
    year: Number(formData.get("year") ?? new Date().getFullYear()),
    umr_amount: Number(formData.get("umr_amount") ?? 0),
  }

  if (!payload.city_name || !payload.umr_amount) {
    return { error: "Nama kota dan nilai UMR wajib diisi" }
  }

  const { error } = await supabase
    .from("hr_city_umr")
    .update(payload)
    .eq("id", id)

  if (error) {
    console.error("updateCityUmr error:", error)
    return { error: "Gagal memperbarui data UMR" }
  }

  revalidatePath("/hr/master-data")
  return { success: true }
}

// ── Delete ──
export async function deleteCityUmr(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("hr_city_umr")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("deleteCityUmr error:", error)
    return { error: "Gagal menghapus data UMR" }
  }

  revalidatePath("/hr/master-data")
  return { success: true }
}
