"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
import { formatRupiah } from "@/lib/utils/currency"
import { Plus, Pencil, Trash2, MoreHorizontal, Loader2 } from "lucide-react"
import { getTerBrackets, createTerBracket, updateTerBracket, deleteTerBracket, type TerBracket } from "./ter-actions"

const ptkpOptions = [
  "TK/0", "TK/1", "TK/2", "TK/3",
  "K/0", "K/1", "K/2", "K/3",
  "K/I/0", "K/I/1", "K/I/2", "K/I/3",
]

const columns: ColumnDef<TerBracket>[] = [
  {
    accessorKey: "ptkp_status",
    header: "Status PTKP",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">{row.getValue("ptkp_status")}</Badge>
    ),
  },
  {
    accessorKey: "income_min",
    header: "Penghasilan Min",
    cell: ({ row }) => <span className="font-mono text-sm">{formatRupiah(row.getValue("income_min") as number)}</span>,
  },
  {
    accessorKey: "income_max",
    header: "Penghasilan Max",
    cell: ({ row }) => {
      const max = row.getValue("income_max") as number | null
      return <span className="font-mono text-sm">{max ? formatRupiah(max) : "∞"}</span>
    },
  },
  {
    accessorKey: "rate",
    header: "Tarif",
    cell: ({ row }) => {
      const rate = row.getValue("rate") as number
      return <span className="font-medium">{(rate * 100).toFixed(2)}%</span>
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const bracket = row.original
      const meta = table.options.meta as { onEdit: (b: TerBracket) => void; onDelete: (b: TerBracket) => void } | undefined
      return (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => meta?.onEdit(bracket)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => meta?.onDelete(bracket)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    },
  },
]

const emptyForm = {
  effective_year: new Date().getFullYear(),
  ptkp_status: "TK/0",
  income_min: 0,
  income_max: "" as string | number,
  rate: 0,
}

export function TerTabContent() {
  const router = useRouter()
  const [brackets, setBrackets] = useState<TerBracket[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBracket, setEditingBracket] = useState<TerBracket | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TerBracket | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear())
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  async function loadData(year?: number) {
    const data = await getTerBrackets(year || filterYear)
    setBrackets(data)
    setLoading(false)
  }

  if (loading && brackets.length === 0) loadData()

  function openCreate() {
    setEditingBracket(null)
    setForm({ ...emptyForm, effective_year: filterYear })
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(bracket: TerBracket) {
    setEditingBracket(bracket)
    setForm({
      effective_year: bracket.effective_year,
      ptkp_status: bracket.ptkp_status,
      income_min: bracket.income_min,
      income_max: bracket.income_max ?? "",
      rate: bracket.rate,
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    setError(null)

    if (form.income_max === "" || form.income_max === 0) {
      formData.delete("income_max")
    } else {
      formData.set("income_max", String(form.income_max))
    }

    const action = editingBracket ? updateTerBracket.bind(null, editingBracket.id) : createTerBracket
    const result = await action(formData)
    if (result?.error) { setError(result.error); return }
    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    await loadData()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteTerBracket(deleteTarget.id)
    setDeleteTarget(null)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      await loadData()
    }
  }

  // Available years from data
  const years = [...new Set(brackets.map((b) => b.effective_year))].sort((a, b) => b - a)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">Tarif Efektif Rata-rata (TER)</CardTitle>
            <Select value={String(filterYear)} onValueChange={(v) => { setFilterYear(Number(v)); loadData(Number(v)) }}>
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2025, 2024, 2023].map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Bracket
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={brackets}
            isLoading={loading}
            searchPlaceholder="Cari status PTKP..."
            emptyTitle="Belum ada data TER"
            emptyDescription="Tambahkan bracket TER untuk tarif PPh21."
            meta={{ onEdit: openEdit, onDelete: (b: TerBracket) => setDeleteTarget(b) }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBracket ? "Edit Bracket TER" : "Tambah Bracket TER"}</DialogTitle>
            <DialogDescription>
              {editingBracket ? "Perbarui bracket tarif efektif rata-rata" : "Tambahkan bracket tarif efektif rata-rata baru"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effective_year">Tahun</Label>
                <Input id="effective_year" name="effective_year" type="number" defaultValue={form.effective_year} min={2020} max={2100} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ptkp_status">Status PTKP</Label>
                <Select name="ptkp_status" defaultValue={form.ptkp_status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ptkpOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="income_min">Penghasilan Min (Rp)</Label>
                <Input id="income_min" name="income_min" type="number" step="1" defaultValue={form.income_min} min={0} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="income_max">Penghasilan Max (Rp) <span className="text-zinc-400 text-xs">kosongkan = ∞</span></Label>
                <Input id="income_max" name="income_max" type="number" step="1" defaultValue={form.income_max || ""} min={0} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Tarif (%) — contoh: 0.5 untuk 0.5%</Label>
              <Input id="rate" name="rate" type="number" step="0.005" defaultValue={form.rate} min={0} max={1} required />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingBracket ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Bracket TER?</AlertDialogTitle>
            <AlertDialogDescription>
              Bracket TER &quot;{deleteTarget?.ptkp_status}&quot; dengan penghasilan min {deleteTarget ? formatRupiah(deleteTarget.income_min) : ""} akan dihapus.
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
