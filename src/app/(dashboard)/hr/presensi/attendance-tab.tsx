"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Plus, MoreHorizontal, Pencil, Trash2, UserCheck, Clock, AlertTriangle, UserX, Loader2 } from "lucide-react"
import {
  getAttendances,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  type AttendanceRow,
  type AttendanceStatus,
} from "./actions"
import { type EmployeeWithRelations } from "../employees/employee-actions"

const statusLabels: Record<string, string> = {
  hadir: "Hadir",
  terlambat: "Terlambat",
  izin: "Izin",
  sakit: "Sakit",
  cuti: "Cuti",
  alpha: "Alpha",
  dinas_luar: "Dinas Luar",
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  hadir: "default",
  terlambat: "outline",
  izin: "secondary",
  sakit: "secondary",
  cuti: "secondary",
  alpha: "destructive",
  dinas_luar: "outline",
}

// ── Column definitions ──
const columns: ColumnDef<AttendanceRow>[] = [
  {
    id: "employee",
    header: "Karyawan",
    cell: ({ row }) => {
      const emp = row.original.employee
      return (
        <div>
          <span className="font-medium text-zinc-900">{emp?.name ?? "-"}</span>
          <span className="ml-2 font-mono text-xs text-zinc-400">{emp?.nik ?? ""}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      const d = row.getValue("date") as string
      return <span className="text-zinc-500 text-xs">{d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</span>
    },
  },
  {
    id: "clock_range",
    header: "Jam",
    cell: ({ row }) => {
      const a = row.original
      if (!a.clock_in && !a.clock_out) return <span className="text-zinc-400">—</span>
      return (
        <span className="text-zinc-600 text-xs">
          {a.clock_in?.slice(0, 5) ?? "—"} – {a.clock_out?.slice(0, 5) ?? "—"}
        </span>
      )
    },
  },
  {
    accessorKey: "work_hours",
    header: "Jam Kerja",
    cell: ({ row }) => {
      const h = row.getValue("work_hours") as number
      return <span className="font-medium">{h > 0 ? `${h} jam` : "—"}</span>
    },
  },
  {
    accessorKey: "late_minutes",
    header: "Terlambat",
    cell: ({ row }) => {
      const m = row.getValue("late_minutes") as number
      if (m === 0) return <span className="text-zinc-400">—</span>
      return <span className="text-amber-600 font-medium">{m} mnt</span>
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
    accessorKey: "notes",
    header: "Catatan",
    cell: ({ row }) => {
      const n = row.getValue("notes") as string | null
      return <span className="text-zinc-500 text-xs max-w-[150px] truncate block">{n ?? "—"}</span>
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const att = row.original
      const meta = table.options.meta as { onEdit: (a: AttendanceRow) => void; onDelete: (a: AttendanceRow) => void } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onEdit(att)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => meta?.onDelete(att)}>
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const emptyForm = {
  employee_id: "",
  date: new Date().toISOString().slice(0, 10),
  clock_in: "08:00",
  clock_out: "17:00",
  status: "hadir" as AttendanceStatus,
  late_minutes: 0,
  work_hours: 9,
  notes: "",
}

interface AttendanceTabContentProps {
  initialAttendances: AttendanceRow[]
  employees: EmployeeWithRelations[]
}

export function AttendanceTabContent({ initialAttendances, employees }: AttendanceTabContentProps) {
  const router = useRouter()
  const [attendances, setAttendances] = useState<AttendanceRow[]>(initialAttendances)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AttendanceRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AttendanceRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // Stats
  const hadirCount = attendances.filter((a) => a.status === "hadir").length
  const terlambatCount = attendances.filter((a) => a.status === "terlambat").length
  const izinSakitCount = attendances.filter((a) => ["izin", "sakit", "cuti"].includes(a.status)).length
  const alphaCount = attendances.filter((a) => a.status === "alpha").length

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(att: AttendanceRow) {
    setEditing(att)
    setForm({
      employee_id: att.employee_id,
      date: att.date,
      clock_in: att.clock_in ?? "08:00",
      clock_out: att.clock_out ?? "17:00",
      status: att.status as AttendanceStatus,
      late_minutes: att.late_minutes,
      work_hours: att.work_hours,
      notes: att.notes ?? "",
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    setError(null)

    if (!form.employee_id || !form.date || !form.status) {
      setError("Karyawan, tanggal, dan status wajib diisi")
      return
    }

    // If status is not hadir/terlambat, clear clock times
    const isAbsentStatus = ["izin", "sakit", "cuti", "alpha"].includes(form.status)

    const payload = {
      employee_id: form.employee_id,
      date: form.date,
      clock_in: isAbsentStatus ? null : form.clock_in || null,
      clock_out: isAbsentStatus ? null : form.clock_out || null,
      status: form.status,
      late_minutes: form.late_minutes,
      work_hours: isAbsentStatus ? 0 : form.work_hours,
      notes: form.notes || undefined,
    }

    const result = editing
      ? await updateAttendance(editing.id, payload)
      : await createAttendance(payload)

    if (result?.error) {
      setError(result.error)
      return
    }

    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    const fresh = await getAttendances()
    setAttendances(fresh)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteAttendance(deleteTarget.id)
    setDeleteTarget(null)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getAttendances()
      setAttendances(fresh)
    }
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{hadirCount}</p>
              <p className="text-xs text-zinc-500">Hadir</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{terlambatCount}</p>
              <p className="text-xs text-zinc-500">Terlambat</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
              <AlertTriangle className="h-5 w-5 text-zinc-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{izinSakitCount}</p>
              <p className="text-xs text-zinc-500">Izin/Sakit/Cuti</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <UserX className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{alphaCount}</p>
              <p className="text-xs text-zinc-500">Alpha</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Riwayat Presensi</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Presensi
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={attendances}
            searchPlaceholder="Cari presensi..."
            emptyTitle="Belum ada data presensi"
            emptyDescription="Tambahkan data presensi pertama."
            meta={{ onEdit: openEdit, onDelete: (a: AttendanceRow) => setDeleteTarget(a) }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Presensi" : "Tambah Presensi"}</DialogTitle>
            <DialogDescription>
              {editing ? "Perbarui data presensi karyawan" : "Tambahkan data presensi karyawan"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Karyawan *</Label>
              <Select value={form.employee_id} onValueChange={(v) => v && setForm({ ...form, employee_id: v })} disabled={!!editing}>
                <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.nik} — {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal *</Label>
                <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} disabled={!!editing} />
              </div>
              <div className="space-y-2">
                <Label>Status *</Label>
                <Select value={form.status} onValueChange={(v) => v && setForm({ ...form, status: v as AttendanceStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hadir">Hadir</SelectItem>
                    <SelectItem value="terlambat">Terlambat</SelectItem>
                    <SelectItem value="izin">Izin</SelectItem>
                    <SelectItem value="sakit">Sakit</SelectItem>
                    <SelectItem value="cuti">Cuti</SelectItem>
                    <SelectItem value="alpha">Alpha</SelectItem>
                    <SelectItem value="dinas_luar">Dinas Luar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {["hadir", "terlambat", "dinas_luar"].includes(form.status) && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clock_in">Jam Masuk</Label>
                  <Input id="clock_in" type="time" value={form.clock_in} onChange={(e) => setForm({ ...form, clock_in: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clock_out">Jam Keluar</Label>
                  <Input id="clock_out" type="time" value={form.clock_out} onChange={(e) => setForm({ ...form, clock_out: e.target.value })} />
                </div>
              </div>
            )}

            {form.status === "terlambat" && (
              <div className="space-y-2">
                <Label htmlFor="late_minutes">Terlambat (menit)</Label>
                <Input id="late_minutes" type="number" min={0} value={form.late_minutes} onChange={(e) => setForm({ ...form, late_minutes: Number(e.target.value) })} />
              </div>
            )}

            {["hadir", "terlambat", "dinas_luar"].includes(form.status) && (
              <div className="space-y-2">
                <Label htmlFor="work_hours">Jam Kerja</Label>
                <Input id="work_hours" type="number" min={0} step={0.5} value={form.work_hours} onChange={(e) => setForm({ ...form, work_hours: Number(e.target.value) })} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Input id="notes" placeholder="Catatan opsional" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending} onClick={handleSubmit}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Simpan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Presensi?</AlertDialogTitle>
            <AlertDialogDescription>
              Data presensi tanggal {deleteTarget?.date} untuk {deleteTarget?.employee?.name} akan dihapus.
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