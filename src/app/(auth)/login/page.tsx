"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginUser } from "./actions"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Kata sandi wajib diisi")
    .min(6, "Kata sandi minimal 6 karakter"),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    setIsSubmitting(true)

    const formData = new FormData()
    formData.set("email", data.email)
    formData.set("password", data.password)

    const result = await loginUser(formData)

    if (result.error) {
      setServerError(result.error)
      setIsSubmitting(false)
      return
    }

    if (result.success && result.user) {
      login(result.user)
      router.push("/")
      router.refresh()
    }
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Selamat Datang
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Masuk ke akun Anda untuk melanjutkan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {serverError && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@perusahaan.com"
              autoComplete="email"
              disabled={isSubmitting}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan kata sandi"
              autoComplete="current-password"
              disabled={isSubmitting}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function LoginSkeleton() {
  return (
    <div className="w-full max-w-md space-y-8 px-4">
      <div className="space-y-2 text-center">
        <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mx-auto h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="h-8 w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="h-9 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-900 text-white p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
            <span className="text-lg font-bold text-zinc-900">W</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">
            W System
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Kelola bisnis Anda
            <br />
            dengan lebih mudah.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Platform manajemen bisnis terpadu untuk mengelola entitas,
            cabang, dan seluruh operasional perusahaan Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span>&copy; {new Date().getFullYear()} W System</span>
        </div>
      </div>

      {/* Right side — login form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12">
        {/* Mobile branding */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900">
            <span className="text-lg font-bold text-white">W</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">
            W System
          </span>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}