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
import { formatRupiah } from "@/lib/utils/currency"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import {
  getSalaryMatrix,
  createSalaryMatrix,
  updateSalaryMatrix,
  deleteSalaryMatrix,
  getGrades,
  type SalaryMatrixWithGrade,
} from "./matrix-actions"

const columns: ColumnDef<SalaryMatrixWithGrade>[] = [
  {
    id: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">
        {row.original.grade_code ?? "-"}
      </Badge>
    ),
  },
  {
    accessorKey: "grade_name",
    header: "Nama Grade",
    cell: ({ row }) => (
      <span className="text-zinc-600 text-sm">{row.original.grade_name ?? "-"}</span>
    ),
  },
  {
    accessorKey: "step",
    header: "Step",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("step")}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Nominal",
    cell: ({ row }) => (
      <span className="font-medium text-emerald-700">{formatRupiah(row.getValue("amount") as number)}</span>
    ),
  },
  {
    accessorKey: "effective_date",
    header: "Efektif",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("effective_date")}</span>
    ),
  },
  {
    accessorKey: "end_date",
    header: "Berakhir",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-zinc-400">{row.getValue("end_date") ?? "—"}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const matrix = row.original
      const meta = table.options.meta as { onEdit: (m: SalaryMatrixWithGrade) => void; onDelete: (m: SalaryMatrixWithGrade) => void } | undefined
      return (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => meta?.onEdit(matrix)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => meta?.onDelete(matrix)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    },
  },
]

type GradeOption = { id: string; code: string; name: string }

export function MatrixTabContent() {
  const router = useRouter()
  const [matrixData, setMatrixData] = useState<SalaryMatrixWithGrade[]>([])
  const [grades, setGrades] = useState<GradeOption[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMatrix, setEditingMatrix] = useState<SalaryMatrixWithGrade | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SalaryMatrixWithGrade | null>(null)
  const [form, setForm] = useState({ grade_id: "", step: 1, amount: 0, effective_date: "", end_date: "" })
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  async function loadData() {
    const [data, gradeList] = await Promise.all([getSalaryMatrix(), getGrades()])
    setMatrixData(data)
    setGrades(gradeList)
    setLoading(false)
  }

  if (loading && matrixData.length === 0) loadData()

  function openCreate() {
    setEditingMatrix(null)
    setForm({ grade_id: grades[0]?.id ?? "", step: 1, amount: 0, effective_date: new Date().toISOString().slice(0, 10), end_date: "" })
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(m: SalaryMatrixWithGrade) {
    setEditingMatrix(m)
    setForm({
      grade_id: m.grade_id,
      step: m.step,
      amount: m.amount,
      effective_date: m.effective_date,
      end_date: m.end_date ?? "",
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    const action = editingMatrix ? updateSalaryMatrix.bind(null, editingMatrix.id) : createSalaryMatrix
    const result = await action(formData)
    if (result?.error) { setError(result.error); return }
    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    await loadData()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteSalaryMatrix(deleteTarget.id)
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
          <CardTitle className="text-lg">Salary Matrix</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Matrix
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={matrixData}
            isLoading={loading}
            searchPlaceholder="Cari grade atau step..."
            emptyTitle="Belum ada salary matrix"
            emptyDescription="Tambahkan data salary matrix (grade × step → nominal)."
            meta={{ onEdit: openEdit, onDelete: (m: SalaryMatrixWithGrade) => setDeleteTarget(m) }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMatrix ? "Edit Salary Matrix" : "Tambah Salary Matrix"}</DialogTitle>
            <DialogDescription>
              {editingMatrix ? "Perbarui nominal per grade dan step" : "Tambahkan nominal gaji per grade dan step"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grade_id">Grade / Golongan</Label>
              <Select name="grade_id" defaultValue={form.grade_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g.id} value={g.id}>{g.code} — {g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="step">Step</Label>
                <Input id="step" name="step" type="number" defaultValue={form.step} min={1} max={20} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Nominal (Rp)</Label>
                <Input id="amount" name="amount" type="number" step="1" defaultValue={form.amount} min={0} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effective_date">Tanggal Efektif</Label>
                <Input id="effective_date" name="effective_date" type="date" defaultValue={form.effective_date} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Tanggal Berakhir <span className="text-zinc-400 text-xs">opsional</span></Label>
                <Input id="end_date" name="end_date" type="date" defaultValue={form.end_date} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingMatrix ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Salary Matrix?</AlertDialogTitle>
            <AlertDialogDescription>
              Data salary matrix ini akan dihapus secara permanen.
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
