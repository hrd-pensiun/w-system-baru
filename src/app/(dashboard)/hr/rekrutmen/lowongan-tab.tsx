"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DataTable } from "@/components/shared/data-table"
import { type ColumnDef } from "@tanstack/react-table"
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Briefcase,
  Users,
  MessageSquare,
  UserCheck,
  Loader2,
  Search,
} from "lucide-react"
import {
  type RecruitmentRow,
  type RecruitmentStatus,
  type EmploymentType,
  createRecruitment,
  updateRecruitment,
  deleteRecruitment,
  getRecruitments,
} from "./actions"

const statusLabels: Record<string, string> = {
  buka: "Buka",
  draft: "Draft",
  tutup: "Tutup",
  batal: "Batal",
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  buka: "default",
  draft: "outline",
  tutup: "secondary",
  batal: "destructive",
}

const employmentLabels: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Kontrak",
  internship: "Internship",
  freelance: "Freelance",
}

const columns: ColumnDef<RecruitmentRow>[] = [
  {
    accessorKey: "title",
    header: "Judul Lowongan",
    cell: ({ row }) => (
      <span className="font-medium text-zinc-900">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Lokasi",
    cell: ({ row }) => {
      const r = row.original
      return (
        <span className="text-zinc-500 text-xs">
          {r.location}{r.is_remote ? " (Remote)" : ""}
        </span>
      )
    },
  },
  {
    accessorKey: "employment_type",
    header: "Tipe",
    cell: ({ row }) => {
      const t = row.getValue("employment_type") as string
      return <Badge variant="outline">{employmentLabels[t] ?? t}</Badge>
    },
  },
  {
    id: "salary_range",
    header: "Rentang Gaji",
    cell: ({ row }) => {
      const r = row.original
      if (!r.salary_min && !r.salary_max) return <span className="text-zinc-400">—</span>
      const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n)
      return <span className="text-xs text-zinc-600">{fmt(r.salary_min ?? 0)} – {fmt(r.salary_max ?? 0)}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.getValue("status") as string
      return <Badge variant={statusVariants[s] ?? "secondary"}>{statusLabels[s] ?? s}</Badge>
    },
  },
  {
    id: "applicant_count",
    header: "Pelamar",
    cell: ({ row }) => {
      const count = row.original._count?.applicants ?? 0
      return <span className="font-medium">{count}</span>
    },
  },
  {
    accessorKey: "opened_at",
    header: "Tanggal Buka",
    cell: ({ row }) => {
      const d = row.getValue("opened_at") as string | null
      return <span className="text-zinc-500 text-xs">{d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span>
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const rec = row.original
      const meta = table.options.meta as { onEdit: (r: RecruitmentRow) => void; onDelete: (r: RecruitmentRow) => void } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onEdit(rec)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => meta?.onDelete(rec)}>
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const emptyForm = {
  title: "",
  department_id: "",
  employment_type: "full_time" as EmploymentType,
  salary_min: "",
  salary_max: "",
  location: "",
  is_remote: false,
  vacancies: "1",
  description: "",
  requirements: "",
  status: "draft" as RecruitmentStatus,
}

interface LowonganTabContentProps {
  initialRecruitments: RecruitmentRow[]
}

export function LowonganTabContent({ initialRecruitments }: LowonganTabContentProps) {
  const router = useRouter()
  const [recruitments, setRecruitments] = useState<RecruitmentRow[]>(initialRecruitments)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<RecruitmentRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<RecruitmentRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("semua")

  const aktifCount = recruitments.filter((r) => r.status === "buka").length
  const totalPelamar = recruitments.reduce((sum, r) => sum + (r._count?.applicants ?? 0), 0)

  const filtered = recruitments.filter((r) => {
    if (statusFilter !== "semua" && r.status !== statusFilter) return false
    if (search) {
      const s = search.toLowerCase()
      return r.title.toLowerCase().includes(s) || r.location.toLowerCase().includes(s)
    }
    return true
  })

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(rec: RecruitmentRow) {
    setEditing(rec)
    setForm({
      title: rec.title,
      department_id: rec.department_id ?? "",
      employment_type: rec.employment_type as EmploymentType,
      salary_min: rec.salary_min?.toString() ?? "",
      salary_max: rec.salary_max?.toString() ?? "",
      location: rec.location,
      is_remote: rec.is_remote,
      vacancies: rec.vacancies?.toString() ?? "1",
      description: rec.description ?? "",
      requirements: rec.requirements ?? "",
      status: rec.status as RecruitmentStatus,
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    setError(null)
    if (!form.title) {
      setError("Judul lowongan wajib diisi")
      return
    }

    const payload = {
      title: form.title,
      department_id: form.department_id || null,
      employment_type: form.employment_type,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      location: form.location || "Jakarta",
      is_remote: form.is_remote,
      vacancies: Number(form.vacancies) || 1,
      description: form.description || undefined,
      requirements: form.requirements || undefined,
      status: form.status,
    }

    const result = editing
      ? await updateRecruitment(editing.id, payload)
      : await createRecruitment(payload)

    if (result?.error) {
      setError(result.error)
      return
    }

    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    const fresh = await getRecruitments()
    setRecruitments(fresh)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteRecruitment(deleteTarget.id)
    setDeleteTarget(null)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getRecruitments()
      setRecruitments(fresh)
    }
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Briefcase className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{aktifCount}</p>
              <p className="text-xs text-zinc-500">Lowongan Aktif</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{totalPelamar}</p>
              <p className="text-xs text-zinc-500">Total Pelamar</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <MessageSquare className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">0</p>
              <p className="text-xs text-zinc-500">Sedang Interview</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <UserCheck className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">0</p>
              <p className="text-xs text-zinc-500">Dihiring</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Daftar Lowongan</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Buat Lowongan
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari lowongan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {[
                { value: "semua", label: "Semua" },
                { value: "buka", label: "Buka" },
                { value: "draft", label: "Draft" },
                { value: "tutup", label: "Tutup" },
              ].map((f) => (
                <Button
                  key={f.value}
                  variant={statusFilter === f.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filtered}
            searchPlaceholder="Cari lowongan..."
            emptyTitle="Belum ada lowongan"
            emptyDescription="Buat lowongan pertama untuk memulai rekrutmen."
            meta={{ onEdit: openEdit, onDelete: (r: RecruitmentRow) => setDeleteTarget(r) }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Lowongan" : "Buat Lowongan"}</DialogTitle>
            <DialogDescription>
              {editing ? "Perbarui data lowongan kerja" : "Tambahkan lowongan kerja baru"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Lowongan *</Label>
              <Input id="title" placeholder="Contoh: Frontend Developer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipe Pekerjaan *</Label>
                <Select value={form.employment_type} onValueChange={(v) => v && setForm({ ...form, employment_type: v as EmploymentType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full-time</SelectItem>
                    <SelectItem value="part_time">Part-time</SelectItem>
                    <SelectItem value="contract">Kontrak</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => v && setForm({ ...form, status: v as RecruitmentStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="buka">Buka</SelectItem>
                    <SelectItem value="tutup">Tutup</SelectItem>
                    <SelectItem value="batal">Batal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary_min">Gaji Minimum</Label>
                <Input id="salary_min" type="number" placeholder="0" value={form.salary_min} onChange={(e) => setForm({ ...form, salary_min: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_max">Gaji Maksimum</Label>
                <Input id="salary_max" type="number" placeholder="0" value={form.salary_max} onChange={(e) => setForm({ ...form, salary_max: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input id="location" placeholder="Jakarta" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vacancies">Jumlah Lowongan</Label>
                <Input id="vacancies" type="number" min={1} value={form.vacancies} onChange={(e) => setForm({ ...form, vacancies: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_remote} onCheckedChange={(checked) => setForm({ ...form, is_remote: checked })} />
              <Label>Remote / WFA</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" placeholder="Deskripsi pekerjaan..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">Persyaratan</Label>
              <Textarea id="requirements" placeholder="Persyaratan kandidat..." value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending} onClick={handleSubmit}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Simpan" : "Buat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lowongan?</AlertDialogTitle>
            <AlertDialogDescription>
              Lowongan &quot;{deleteTarget?.title}&quot; akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}