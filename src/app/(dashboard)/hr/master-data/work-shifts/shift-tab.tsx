"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Plus, MoreHorizontal, Pencil, Trash2, Clock, Loader2 } from "lucide-react"
import { getWorkShifts, createWorkShift, updateWorkShift, deleteWorkShift, type WorkShift } from "./actions"

// ── Column definitions ──
const columns: ColumnDef<WorkShift>[] = [
  {
    accessorKey: "code",
    header: "Kode",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama Shift",
    cell: ({ row }) => (
      <span className="font-medium text-zinc-900">{row.getValue("name")}</span>
    ),
  },
  {
    id: "jam_kerja",
    header: "Jam Kerja",
    cell: ({ row }) => {
      const shift = row.original
      return (
        <span className="text-zinc-600">
          {shift.start_time?.slice(0, 5)} – {shift.end_time?.slice(0, 5)}
          {shift.is_overnight && " (+1)"}
        </span>
      )
    },
  },
  {
    accessorKey: "break_minutes",
    header: "Istirahat",
    cell: ({ row }) => (
      <span className="text-zinc-600">{row.getValue("break_minutes")} mnt</span>
    ),
  },
  {
    accessorKey: "grace_period_minutes",
    header: "Toleransi",
    cell: ({ row }) => (
      <span className="text-zinc-600">{row.getValue("grace_period_minutes")} mnt</span>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("is_active") ? "default" : "secondary"}>
        {row.getValue("is_active") ? "Aktif" : "Nonaktif"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const shift = row.original
      const meta = table.options.meta as { onEdit: (s: WorkShift) => void; onDelete: (s: WorkShift) => void } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onEdit(shift)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => meta?.onDelete(shift)}>
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// ── Initial state for form ──
const emptyForm = {
  name: "",
  code: "",
  start_time: "08:00",
  end_time: "17:00",
  is_overnight: false,
  break_minutes: 60,
  grace_period_minutes: 15,
}

export function ShiftTabContent() {
  const router = useRouter()
  const [shifts, setShifts] = useState<WorkShift[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<WorkShift | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // Load data
  async function loadData() {
    const data = await getWorkShifts()
    setShifts(data)
    setLoading(false)
  }

  // Load on mount
  if (loading && shifts.length === 0) {
    loadData()
  }

  function openCreate() {
    setEditingShift(null)
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(shift: WorkShift) {
    setEditingShift(shift)
    setForm({
      name: shift.name,
      code: shift.code,
      start_time: shift.start_time?.slice(0, 5) ?? "08:00",
      end_time: shift.end_time?.slice(0, 5) ?? "17:00",
      is_overnight: shift.is_overnight,
      break_minutes: shift.break_minutes,
      grace_period_minutes: shift.grace_period_minutes,
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    const action = editingShift ? updateWorkShift.bind(null, editingShift.id) : createWorkShift
    const result = await action(formData)

    if (result?.error) {
      setError(result.error)
      return
    }

    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    await loadData()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteWorkShift(deleteTarget.id)
    setDeleteTarget(null)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      await loadData()
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Shift Kerja</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Shift
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={shifts}
            isLoading={loading}
            searchPlaceholder="Cari shift..."
            emptyTitle="Belum ada shift kerja"
            emptyDescription="Tambahkan shift kerja pertama untuk memulai."
            meta={{ onEdit: openEdit, onDelete: (s: WorkShift) => setDeleteTarget(s) }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingShift ? "Edit Shift" : "Tambah Shift"}</DialogTitle>
            <DialogDescription>
              {editingShift ? "Perbarui data shift kerja" : "Tambahkan shift kerja baru"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Kode Shift</Label>
                <Input id="code" name="code" placeholder="REG" defaultValue={form.code} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama Shift</Label>
                <Input id="name" name="name" placeholder="Reguler" defaultValue={form.name} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Jam Mulai</Label>
                <Input id="start_time" name="start_time" type="time" defaultValue={form.start_time} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">Jam Selesai</Label>
                <Input id="end_time" name="end_time" type="time" defaultValue={form.end_time} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="break_minutes">Istirahat (menit)</Label>
                <Input id="break_minutes" name="break_minutes" type="number" defaultValue={form.break_minutes} min={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grace_period_minutes">Toleransi Terlambat (menit)</Label>
                <Input id="grace_period_minutes" name="grace_period_minutes" type="number" defaultValue={form.grace_period_minutes} min={0} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="is_overnight" name="is_overnight" defaultChecked={form.is_overnight} />
              <Label htmlFor="is_overnight" className="text-sm">Shift lewat tengah malam (overnight)</Label>
            </div>

            {editingShift && (
              <div className="flex items-center space-x-2">
                <Checkbox id="is_active" name="is_active" defaultChecked={editingShift.is_active} />
                <Label htmlFor="is_active" className="text-sm">Shift aktif</Label>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingShift ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Shift?</AlertDialogTitle>
            <AlertDialogDescription>
              Shift &quot;{deleteTarget?.name}&quot; akan dihapus. Tindakan ini tidak dapat dibatalkan.
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
