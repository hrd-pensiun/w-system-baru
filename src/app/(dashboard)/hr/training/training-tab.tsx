"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  DropdownMenuSeparator,
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
  Play,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Users,
  TrendingUp,
  BookOpen,
  Loader2,
  Search,
  UserPlus,
} from "lucide-react"
import {
  type TrainingProgramRow,
  type TrainingParticipantRow,
  type EmployeeOption,
  type TrainingType,
  type TrainingStatus,
  createTrainingProgram,
  updateProgramStatus,
  addParticipant,
  getTrainingPrograms,
  getTrainingParticipants,
} from "./actions"

// ── Labels & Variants ──
const statusLabels: Record<string, string> = {
  akan_datang: "Akan Datang",
  berjalan: "Berjalan",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  akan_datang: "outline",
  berjalan: "default",
  selesai: "secondary",
  dibatalkan: "destructive",
}

const typeLabels: Record<string, string> = {
  offline: "Offline",
  online: "Online",
  hybrid: "Hybrid",
}

const typeVariants: Record<string, "default" | "secondary" | "outline"> = {
  offline: "secondary",
  online: "outline",
  hybrid: "default",
}

// ── Columns ──
const columns: ColumnDef<TrainingProgramRow>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row, table }) => {
      const sortedRows = table.getSortedRowModel()?.rows ?? table.getRowModel().rows
      const idx = sortedRows.findIndex(r => r.id === row.id)
      return <span className="text-zinc-500">{idx + 1}</span>
    },
  },
  {
    accessorKey: "title",
    header: "Nama Program",
    cell: ({ row }) => (
      <span className="font-medium text-zinc-900">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipe",
    cell: ({ row }) => {
      const t = row.getValue("type") as string
      return <Badge variant={typeVariants[t] ?? "outline"}>{typeLabels[t] ?? t}</Badge>
    },
  },
  {
    accessorKey: "instructor",
    header: "Instruktur",
    cell: ({ row }) => {
      const v = row.getValue("instructor") as string | null
      return <span className="text-zinc-500 text-xs">{v || "—"}</span>
    },
  },
  {
    id: "date_range",
    header: "Tanggal",
    cell: ({ row }) => {
      const r = row.original
      const start = r.start_date
        ? new Date(r.start_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
        : "—"
      const end = r.end_date
        ? new Date(r.end_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
        : ""
      return (
        <span className="text-xs text-zinc-600">
          {start}{end ? ` – ${end}` : ""}
        </span>
      )
    },
  },
  {
    accessorKey: "quota",
    header: "Kuota",
    cell: ({ row }) => (
      <span className="text-zinc-600 text-xs">{row.original.quota}</span>
    ),
  },
  {
    id: "participant_count",
    header: "Peserta",
    cell: ({ row }) => {
      const count = row.original._count?.participants ?? 0
      const quota = row.original.quota
      const pct = quota > 0 ? Math.round((count / quota) * 100) : 0
      const color = pct >= 90 ? "text-red-600" : pct >= 70 ? "text-amber-600" : "text-emerald-600"
      return (
        <span className={`text-xs font-medium ${color}`}>
          {count}/{quota}
        </span>
      )
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
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const rec = row.original
      const meta = table.options.meta as {
        onStatusUpdate: (id: string, status: TrainingStatus) => void
        onAddParticipant: (program: TrainingProgramRow) => void
      } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onAddParticipant(rec)}>
              <UserPlus className="mr-2 h-4 w-4" /> Tambah Peserta
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {rec.status === "akan_datang" && (
              <DropdownMenuItem onClick={() => meta?.onStatusUpdate(rec.id, "berjalan")}>
                <Play className="mr-2 h-4 w-4" /> Mulai
              </DropdownMenuItem>
            )}
            {rec.status === "berjalan" && (
              <DropdownMenuItem onClick={() => meta?.onStatusUpdate(rec.id, "selesai")}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Selesaikan
              </DropdownMenuItem>
            )}
            {(rec.status === "akan_datang" || rec.status === "berjalan") && (
              <DropdownMenuItem className="text-destructive" onClick={() => meta?.onStatusUpdate(rec.id, "dibatalkan")}>
                <XCircle className="mr-2 h-4 w-4" /> Batalkan
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const emptyForm = {
  title: "",
  description: "",
  type: "offline" as TrainingType,
  instructor: "",
  start_date: "",
  end_date: "",
  quota: "10",
  location: "",
  notes: "",
}

interface TrainingTabContentProps {
  initialPrograms: TrainingProgramRow[]
  initialParticipants: TrainingParticipantRow[]
  employees: EmployeeOption[]
}

export function TrainingTabContent({ initialPrograms, initialParticipants, employees }: TrainingTabContentProps) {
  const router = useRouter()
  const [programs, setPrograms] = useState<TrainingProgramRow[]>(initialPrograms)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [participantDialogOpen, setParticipantDialogOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgramRow | null>(null)
  const [confirmStatus, setConfirmStatus] = useState<{ id: string; status: TrainingStatus } | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [participantForm, setParticipantForm] = useState({ employee_id: "" })
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("semua")

  // ── Metrics ──
  const totalTraining = programs.length
  const berjalanCount = programs.filter(p => p.status === "berjalan").length
  const aktifPeserta = initialParticipants.filter(p => p.status === "sedang" || p.status === "terdaftar").length
  const completedCount = initialParticipants.filter(p => p.status === "lulus" || p.status === "tidak_lulus").length
  const totalWithResult = initialParticipants.filter(p => p.status === "lulus" || p.status === "tidak_lulus").length
  const lulusCount = initialParticipants.filter(p => p.status === "lulus").length
  const completionRate = totalWithResult > 0 ? Math.round((lulusCount / totalWithResult) * 100) : 0

  // ── Filter ──
  const filtered = programs.filter(p => {
    if (statusFilter !== "semua" && p.status !== statusFilter) return false
    if (search) {
      const s = search.toLowerCase()
      return (
        p.title.toLowerCase().includes(s) ||
        (p.instructor?.toLowerCase() ?? "").includes(s) ||
        (p.location?.toLowerCase() ?? "").includes(s)
      )
    }
    return true
  })

  // ── Create Program ──
  function openCreate() {
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    setError(null)
    if (!form.title) { setError("Judul program wajib diisi"); return }
    if (!form.start_date) { setError("Tanggal mulai wajib diisi"); return }

    const result = await createTrainingProgram({
      title: form.title,
      description: form.description || undefined,
      type: form.type,
      instructor: form.instructor || undefined,
      start_date: form.start_date,
      end_date: form.end_date || undefined,
      quota: Number(form.quota) || 10,
      location: form.location || undefined,
      notes: form.notes || undefined,
    })

    if (result?.error) { setError(result.error); return }

    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    const fresh = await getTrainingPrograms()
    setPrograms(fresh)
  }

  // ── Update Status ──
  async function handleStatusUpdate() {
    if (!confirmStatus) return
    const result = await updateProgramStatus(confirmStatus.id, confirmStatus.status)
    setConfirmStatus(null)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getTrainingPrograms()
      setPrograms(fresh)
    }
  }

  // ── Add Participant ──
  function openAddParticipant(program: TrainingProgramRow) {
    setSelectedProgram(program)
    setParticipantForm({ employee_id: "" })
    setError(null)
    setParticipantDialogOpen(true)
  }

  async function handleAddParticipant() {
    if (!selectedProgram || !participantForm.employee_id) {
      setError("Pilih karyawan terlebih dahulu")
      return
    }

    const result = await addParticipant({
      program_id: selectedProgram.id,
      employee_id: participantForm.employee_id,
    })

    if (result?.error) { setError(result.error); return }

    setParticipantDialogOpen(false)
    startTransition(() => { router.refresh() })
    const fresh = await getTrainingPrograms()
    setPrograms(fresh)
  }

  const statusFilterOptions = [
    { value: "semua", label: "Semua" },
    { value: "akan_datang", label: "Akan Datang" },
    { value: "berjalan", label: "Berjalan" },
    { value: "selesai", label: "Selesai" },
    { value: "dibatalkan", label: "Dibatalkan" },
  ]

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
              <GraduationCap className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{totalTraining}</p>
              <p className="text-xs text-zinc-500">Total Training</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{berjalanCount}</p>
              <p className="text-xs text-zinc-500">Sedang Berjalan</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{aktifPeserta}</p>
              <p className="text-xs text-zinc-500">Peserta Aktif</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{completionRate}%</p>
              <p className="text-xs text-zinc-500">Completion Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Daftar Program Training</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Buat Program
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari program training..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {statusFilterOptions.map((f) => (
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
            searchPlaceholder="Cari program..."
            emptyTitle="Belum ada program training"
            emptyDescription="Buat program training pertama untuk memulai."
            meta={{
              onStatusUpdate: (id: string, status: TrainingStatus) => setConfirmStatus({ id, status }),
              onAddParticipant: openAddParticipant,
            }}
          />
        </CardContent>
      </Card>

      {/* Create Program Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Buat Program Training</DialogTitle>
            <DialogDescription>Tambahkan program training baru untuk karyawan</DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Program *</Label>
              <Input id="title" placeholder="Contoh: Leadership Training 2025" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipe *</Label>
                <Select value={form.type} onValueChange={(v) => v && setForm({ ...form, type: v as TrainingType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quota">Kuota *</Label>
                <Input id="quota" type="number" min={1} value={form.quota} onChange={(e) => setForm({ ...form, quota: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Tanggal Mulai *</Label>
                <Input id="start_date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Tanggal Selesai</Label>
                <Input id="end_date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor">Instruktur</Label>
                <Input id="instructor" placeholder="Nama instruktur" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input id="location" placeholder="Lokasi training" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" placeholder="Deskripsi program training..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea id="notes" placeholder="Catatan tambahan..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending} onClick={handleSubmit}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buat Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Participant Dialog */}
      <Dialog open={participantDialogOpen} onOpenChange={setParticipantDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Peserta</DialogTitle>
            <DialogDescription>
              Tambahkan peserta ke program &quot;{selectedProgram?.title}&quot;
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Pilih Karyawan *</Label>
              <Select value={participantForm.employee_id} onValueChange={(v) => v && setParticipantForm({ employee_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih karyawan..." /></SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.nik} — {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setParticipantDialogOpen(false)}>Batal</Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending} onClick={handleAddParticipant}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tambah Peserta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Confirm Dialog */}
      <AlertDialog open={!!confirmStatus} onOpenChange={(open) => !open && setConfirmStatus(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmStatus?.status === "berjalan" && "Mulai Program Training?"}
              {confirmStatus?.status === "selesai" && "Selesaikan Program Training?"}
              {confirmStatus?.status === "dibatalkan" && "Batalkan Program Training?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmStatus?.status === "berjalan" && "Program akan diubah statusnya menjadi berjalan."}
              {confirmStatus?.status === "selesai" && "Program akan ditandai sebagai selesai."}
              {confirmStatus?.status === "dibatalkan" && "Program akan dibatalkan. Tindakan ini tidak dapat dibatalkan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusUpdate}
              className={
                confirmStatus?.status === "dibatalkan"
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : "bg-zinc-900 text-white hover:bg-zinc-700"
              }
            >
              Konfirmasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}