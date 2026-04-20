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
  Pencil,
  Trash2,
  Loader2,
  Clock,
} from "lucide-react"
import {
  getOvertimeRules,
  createOvertimeRule,
  updateOvertimeRule,
  deleteOvertimeRule,
  type OvertimeRule,
} from "./overtime-actions"

const dayTypeLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  weekday: { label: "Hari Kerja", variant: "default" },
  weekend: { label: "Weekend", variant: "secondary" },
  national_holiday: { label: "Hari Libur Nasional", variant: "destructive" },
}

const columns: ColumnDef<OvertimeRule>[] = [
  {
    accessorKey: "day_type",
    header: "Tipe Hari",
    cell: ({ row }) => {
      const dt = row.getValue("day_type") as string
      const info = dayTypeLabels[dt] ?? { label: dt, variant: "secondary" as const }
      return <Badge variant={info.variant}>{info.label}</Badge>
    },
  },
  {
    accessorKey: "hour_from",
    header: "Jam Mulai",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-zinc-400" />
        <span className="font-mono text-sm">Jam {row.getValue("hour_from")}</span>
      </div>
    ),
  },
  {
    accessorKey: "hour_to",
    header: "Jam Selesai",
    cell: ({ row }) => {
      const ht = row.getValue("hour_to") as number | null
      return (
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-zinc-400" />
          <span className="font-mono text-sm">{ht != null ? `Jam ${ht}` : "∞"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "multiplier",
    header: "Multiplier",
    cell: ({ row }) => (
      <span className="font-semibold text-amber-700">{row.getValue("multiplier")}x</span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const rule = row.original
      const meta = table.options.meta as { onEdit: (r: OvertimeRule) => void; onDelete: (r: OvertimeRule) => void } | undefined
      return (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => meta?.onEdit(rule)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => meta?.onDelete(rule)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    },
  },
]

const emptyForm = {
  day_type: "weekday" as "weekday" | "weekend" | "national_holiday",
  hour_from: 1,
  hour_to: "" as string | number,
  multiplier: 1.5,
}

export function OvertimeTabContent() {
  const router = useRouter()
  const [rules, setRules] = useState<OvertimeRule[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<OvertimeRule | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<OvertimeRule | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  async function loadData() {
    const data = await getOvertimeRules()
    setRules(data)
    setLoading(false)
  }

  if (loading && rules.length === 0) loadData()

  function openCreate() {
    setEditingRule(null)
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(rule: OvertimeRule) {
    setEditingRule(rule)
    setForm({
      day_type: rule.day_type,
      hour_from: rule.hour_from,
      hour_to: rule.hour_to ?? "",
      multiplier: rule.multiplier,
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    if (form.hour_to === "" || form.hour_to === 0) {
      formData.delete("hour_to")
    } else {
      formData.set("hour_to", String(form.hour_to))
    }
    const action = editingRule ? updateOvertimeRule.bind(null, editingRule.id) : createOvertimeRule
    const result = await action(formData)
    if (result?.error) { setError(result.error); return }
    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    await loadData()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteOvertimeRule(deleteTarget.id)
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
          <CardTitle className="text-lg">Aturan Lembur</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Aturan
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={rules}
            isLoading={loading}
            searchPlaceholder="Cari aturan lembur..."
            emptyTitle="Belum ada aturan lembur"
            emptyDescription="Tambahkan aturan lembur (multiplier per jam)."
            meta={{ onEdit: openEdit, onDelete: (r: OvertimeRule) => setDeleteTarget(r) }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRule ? "Edit Aturan Lembur" : "Tambah Aturan Lembur"}</DialogTitle>
            <DialogDescription>
              {editingRule ? "Perbarui aturan perhitungan lembur" : "Tambahkan aturan perhitungan lembur baru"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="day_type">Tipe Hari</Label>
              <Select name="day_type" defaultValue={form.day_type}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekday">Hari Kerja</SelectItem>
                  <SelectItem value="weekend">Weekend</SelectItem>
                  <SelectItem value="national_holiday">Hari Libur Nasional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hour_from">Jam Ke- (dari)</Label>
                <Input id="hour_from" name="hour_from" type="number" defaultValue={form.hour_from} min={1} max={24} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hour_to">Jam Ke- (sampai) <span className="text-xs text-zinc-400">kosong = ∞</span></Label>
                <Input id="hour_to" name="hour_to" type="number" defaultValue={form.hour_to || ""} min={1} max={24} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="multiplier">Multiplier (contoh: 1.5 untuk 1.5x)</Label>
              <Input id="multiplier" name="multiplier" type="number" step="0.25" defaultValue={form.multiplier} min={0.25} required />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingRule ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Aturan Lembur?</AlertDialogTitle>
            <AlertDialogDescription>
              Aturan lembur ini akan dihapus secara permanen.
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
