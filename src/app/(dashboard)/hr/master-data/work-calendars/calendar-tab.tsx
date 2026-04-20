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
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react"
import { getWorkCalendars, createWorkCalendar, updateWorkCalendar, deleteWorkCalendar, type WorkCalendar } from "./actions"

const dayTypeLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  workday: { label: "Hari Kerja", variant: "default" },
  weekend: { label: "Weekend", variant: "secondary" },
  national_holiday: { label: "Hari Libur Nasional", variant: "destructive" },
  company_holiday: { label: "Libur Perusahaan", variant: "outline" },
}

const columns: ColumnDef<WorkCalendar>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      const d = row.getValue("date") as string
      return <span className="font-mono text-sm">{d}</span>
    },
  },
  {
    accessorKey: "name",
    header: "Keterangan",
    cell: ({ row }) => (
      <span className="font-medium text-zinc-900">{row.getValue("name") ?? "—"}</span>
    ),
  },
  {
    accessorKey: "day_type",
    header: "Tipe",
    cell: ({ row }) => {
      const dt = row.getValue("day_type") as string
      const info = dayTypeLabels[dt] ?? { label: dt, variant: "secondary" as const }
      return <Badge variant={info.variant}>{info.label}</Badge>
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const cal = row.original
      const meta = table.options.meta as { onEdit: (c: WorkCalendar) => void; onDelete: (c: WorkCalendar) => void } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onEdit(cal)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => meta?.onDelete(cal)}>
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const emptyForm: {
  date: string
  day_type: "workday" | "weekend" | "national_holiday" | "company_holiday"
  name: string
} = {
  date: "",
  day_type: "workday",
  name: "",
}

export function CalendarTabContent() {
  const router = useRouter()
  const [calendars, setCalendars] = useState<WorkCalendar[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCal, setEditingCal] = useState<WorkCalendar | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<WorkCalendar | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  async function loadData() {
    const data = await getWorkCalendars()
    setCalendars(data)
    setLoading(false)
  }

  if (loading && calendars.length === 0) {
    loadData()
  }

  function openCreate() {
    setEditingCal(null)
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(cal: WorkCalendar) {
    setEditingCal(cal)
    setForm({
      date: cal.date,
      day_type: cal.day_type,
      name: cal.name ?? "",
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    const action = editingCal ? updateWorkCalendar.bind(null, editingCal.id) : createWorkCalendar
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
    const result = await deleteWorkCalendar(deleteTarget.id)
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
          <CardTitle className="text-lg">Kalender Kerja</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Hari
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={calendars}
            isLoading={loading}
            searchPlaceholder="Cari tanggal atau keterangan..."
            emptyTitle="Belum ada kalender kerja"
            emptyDescription="Tambahkan hari kerja atau libur untuk memulai."
            meta={{ onEdit: openEdit, onDelete: (c: WorkCalendar) => setDeleteTarget(c) }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCal ? "Edit Kalender" : "Tambah Hari"}</DialogTitle>
            <DialogDescription>
              {editingCal ? "Perbarui data kalender kerja" : "Tambahkan hari kerja atau libur"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input id="date" name="date" type="date" defaultValue={form.date} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="day_type">Tipe Hari</Label>
              <Select name="day_type" defaultValue={form.day_type}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workday">Hari Kerja</SelectItem>
                  <SelectItem value="weekend">Weekend</SelectItem>
                  <SelectItem value="national_holiday">Hari Libur Nasional</SelectItem>
                  <SelectItem value="company_holiday">Libur Perusahaan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Keterangan</Label>
              <Input id="name" name="name" placeholder="Contoh: Hari Kemerdekaan" defaultValue={form.name} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCal ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kalender?</AlertDialogTitle>
            <AlertDialogDescription>
              Data kalender untuk tanggal &quot;{deleteTarget?.date}&quot; akan dihapus.
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
