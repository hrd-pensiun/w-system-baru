"use server"

import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/app/(dashboard)/hr/lib/get-current-user"
import { revalidatePath } from "next/cache"
import type { Database } from "@/types/database.types"

// ── Types ──
export type ContractRow = Database["public"]["Tables"]["employee_contracts"]["Row"]

// ── Get Contracts ──
export async function getContracts(employeeId?: string) {
  const supabase = await createClient()
  const ctx = await requireUser()

  let query = supabase
    .from("employee_contracts")
    .select(`*, employee:employees(id,nik,name)`)
    .eq("tenant_id", ctx.tenantId)
    .is("deleted_at", null)
    .order("start_date", { ascending: false })

  if (employeeId) {
    query = query.eq("employee_id", employeeId)
  }

  const { data, error } = await query

  if (error) {
    console.error("getContracts error:", error)
    return []
  }
  return data ?? []
}

// ── Create Contract ──
export async function createContract(data: {
  employee_id: string
  contract_type: string
  contract_no?: string | null
  start_date: string
  end_date?: string | null
  status?: string
  notes?: string | null
}) {
  const supabase = await createClient()
  const ctx = await requireUser()

  if (!["pkwt", "pkwtt"].includes(data.contract_type)) {
    return { error: "Tipe kontrak tidak valid (pkwt/pkwtt)" }
  }

  const status = data.status ?? "aktif"
  if (!["aktif", "berakhir", "diperpanjang", "terminated"].includes(status)) {
    return { error: "Status kontrak tidak valid" }
  }

  const payload = {
    tenant_id: ctx.tenantId,
    employee_id: data.employee_id,
    contract_type: data.contract_type,
    contract_no: data.contract_no ?? null,
    start_date: data.start_date,
    end_date: data.end_date ?? null,
    status,
    notes: data.notes ?? null,
    created_by: ctx.userId,
    updated_by: ctx.userId,
  }

  const { error } = await supabase.from("employee_contracts").insert(payload)
  if (error) {
    console.error("createContract error:", error)
    return { error: "Gagal menyimpan kontrak karyawan" }
  }

  revalidatePath("/hr/employees")
  return { success: true }
}

// ── Update Contract ──
export async function updateContract(
  id: string,
  data: {
    contract_type?: string
    contract_no?: string | null
    start_date?: string
    end_date?: string | null
    status?: string
    notes?: string | null
  }
) {
  const supabase = await createClient()
  const ctx = await requireUser()

  const payload: Record<string, unknown> = {
    updated_by: ctx.userId,
    updated_at: new Date().toISOString(),
  }

  if (data.contract_type !== undefined) {
    if (!["pkwt", "pkwtt"].includes(data.contract_type)) {
      return { error: "Tipe kontrak tidak valid (pkwt/pkwtt)" }
    }
    payload.contract_type = data.contract_type
  }

  if (data.contract_no !== undefined) payload.contract_no = data.contract_no
  if (data.start_date !== undefined) payload.start_date = data.start_date
  if (data.end_date !== undefined) payload.end_date = data.end_date

  if (data.status !== undefined) {
    if (!["aktif", "berakhir", "diperpanjang", "terminated"].includes(data.status)) {
      return { error: "Status kontrak tidak valid" }
    }
    payload.status = data.status
  }

  if (data.notes !== undefined) payload.notes = data.notes

  const { error } = await supabase
    .from("employee_contracts")
    .update(payload)
    .eq("id", id)

  if (error) {
    console.error("updateContract error:", error)
    return { error: "Gagal memperbarui kontrak karyawan" }
  }

  revalidatePath("/hr/employees")
  return { success: true }
}

// ── Soft Delete ──
export async function deleteContract(id: string) {
  const supabase = await createClient()
  const ctx = await requireUser()

  const { error } = await supabase
    .from("employee_contracts")
    .update({
      deleted_at: new Date().toISOString(),
      is_active: false,
      updated_by: ctx.userId,
    })
    .eq("id", id)

  if (error) {
    console.error("deleteContract error:", error)
    return { error: "Gagal menghapus kontrak karyawan" }
  }

  revalidatePath("/hr/employees")
  return { success: true }
}