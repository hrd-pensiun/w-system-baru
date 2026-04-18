import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If authenticated, redirect to dashboard
  // If not, redirect to login (proxy handles this too, but this is a fallback)
  if (user) {
    redirect("/dashboard")
  }

  redirect("/login")
}