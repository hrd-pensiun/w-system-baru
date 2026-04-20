"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { formatRupiah } from "@/lib/utils/currency"
import { getCityUmrList, createCityUmr, updateCityUmr, deleteCityUmr, type CityUmr } from "./actions"

const columns: ColumnDef<CityUmr>[] = [
  {
    accessorKey: "city_name",
    header: "Kota/Kabupaten",
    cell: ({ row }) => (
      <span className="font-medium text-zinc-900">{row.getValue("city_name")}</span>
    ),
  },
  {
    accessorKey: "province",
    header: "Provinsi",
    cell: ({ row }) => (
      <span className="text-zinc-600">{row.getValue("province") ?? "—"}</span>
    ),
  },
  {
    accessorKey: "year",
    header: "Tahun",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("year")}</span>
    ),
  },
  {
    accessorKey: "umr_amount",
    header: "Nilai UMR/UMK",
    cell: ({ row }) => {
      const amount = row.getValue("umr_amount") as number
      return <span className="font-medium text-emerald-700">{formatRupiah(amount)}</span>
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const umr = row.original
      const meta = table.options.meta as { onEdit: (u: CityUmr) => void; onDelete: (u: CityUmr) => void } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onEdit(umr)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => meta?.onDelete(umr)}>
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const currentYear = new Date().getFullYear()
const emptyForm = {
  city_name: "",
  province: "",
  year: currentYear,
  umr_amount: 0,
}

export function UmrTabContent() {
  const router = useRouter()
  const [umrList, setUmrList] = useState<CityUmr[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUmr, setEditingUmr] = useState<CityUmr | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CityUmr | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  async function loadData() {
    const data = await getCityUmrList()
    setUmrList(data)
    setLoading(false)
  }

  if (loading && umrList.length === 0) {
    loadData()
  }

  function openCreate() {
    setEditingUmr(null)
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(umr: CityUmr) {
    setEditingUmr(umr)
    setForm({
      city_name: umr.city_name,
      province: umr.province ?? "",
      year: umr.year,
      umr_amount: umr.umr_amount,
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    const action = editingUmr ? updateCityUmr.bind(null, editingUmr.id) : createCityUmr
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
    const result = await deleteCityUmr(deleteTarget.id)
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
          <CardTitle className="text-lg">UMR / UMK per Kota</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah UMR
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={umrList}
            isLoading={loading}
            searchPlaceholder="Cari kota atau provinsi..."
            emptyTitle="Belum ada data UMR"
            emptyDescription="Tambahkan data UMR/UMK per kota untuk memulai."
            meta={{ onEdit: openEdit, onDelete: (u: CityUmr) => setDeleteTarget(u) }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUmr ? "Edit UMR" : "Tambah UMR"}</DialogTitle>
            <DialogDescription>
              {editingUmr ? "Perbarui data UMR/UMK kota" : "Tambahkan data UMR/UMK kota baru"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city_name">Kota / Kabupaten</Label>
              <Input id="city_name" name="city_name" placeholder="Contoh: Jakarta" defaultValue={form.city_name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Provinsi</Label>
              <Input id="province" name="province" placeholder="Contoh: DKI Jakarta" defaultValue={form.province} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Tahun</Label>
                <Input id="year" name="year" type="number" defaultValue={form.year} min={2020} max={2030} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="umr_amount">Nilai UMR (Rp)</Label>
                <Input id="umr_amount" name="umr_amount" type="number" defaultValue={form.umr_amount} min={0} required />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingUmr ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus UMR?</AlertDialogTitle>
            <AlertDialogDescription>
              Data UMR untuk &quot;{deleteTarget?.city_name}&quot; tahun {deleteTarget?.year} akan dihapus.
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
