"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const errorMessages: Record<string, string> = {
      "Invalid login credentials":
        "Email atau kata sandi salah",
      "Email not confirmed":
        "Email belum diverifikasi. Silakan cek email Anda.",
      "Too many requests":
        "Terlalu banyak percobaan. Silakan coba lagi nanti.",
    }

    return {
      error: errorMessages[error.message] ?? "Terjadi kesalahan saat masuk. Silakan coba lagi.",
    }
  }

  if (data.user) {
    // Fetch user profile from user_profiles table
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("auth_user_id", data.user.id)
      .is("deleted_at", null)
      .single()

    // Set activeEntityId and activeBranchId cookies
    const cookieStore = await cookies()

    if (profile?.entity_id) {
      cookieStore.set("activeEntityId", profile.entity_id, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      })
    }

    if (profile?.branch_id) {
      cookieStore.set("activeBranchId", profile.branch_id, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      })
    }

    // Return user data for client-side Zustand store
    return {
      success: true,
      user: {
        id: profile?.id ?? data.user.id,
        name: profile?.name ?? data.user.email ?? "",
        email: data.user.email ?? "",
        role: (profile?.employment_status as string) ?? "user",
        tenantId: profile?.tenant_id ?? null,
        entityId: profile?.entity_id ?? null,
        branchId: profile?.branch_id ?? null,
      },
    }
  }

  return { error: "Terjadi kesalahan yang tidak diketahui" }
}

export async function logoutUser() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Clear auth cookies
  const cookieStore = await cookies()
  cookieStore.delete("activeEntityId")
  cookieStore.delete("activeBranchId")

  redirect("/login")
}