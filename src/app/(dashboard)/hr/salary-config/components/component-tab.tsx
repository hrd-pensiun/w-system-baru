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
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getSalaryComponents,
  createSalaryComponent,
  updateSalaryComponent,
  deleteSalaryComponent,
  type SalaryComponent,
} from "./component-actions"

const categories = [
  "Gaji Pokok",
  "Tunjangan Tetap",
  "Tunjangan Tidak Tetap",
  "Insentif",
  "Potongan",
  "Potongan BPJS",
  "Potongan PPh21",
  "Lain-lain",
]

const columns: ColumnDef<SalaryComponent>[] = [
  {
    accessorKey: "code",
    header: "Kode",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama Komponen",
    cell: ({ row }) => (
      <span className="font-medium text-zinc-900">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "component_type",
    header: "Tipe",
    cell: ({ row }) => (
      <Badge variant={row.getValue("component_type") === "earning" ? "default" : "destructive"}>
        {row.getValue("component_type") === "earning" ? "Pendapatan" : "Potongan"}
      </Badge>
    ),
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => (
      <span className="text-zinc-600">{row.getValue("category")}</span>
    ),
  },
  {
    id: "flags",
    header: "Flag",
    cell: ({ row }) => {
      const comp = row.original
      return (
        <div className="flex gap-1.5">
          {comp.is_taxable && <Badge variant="outline" className="text-[10px]">Kena Pajak</Badge>}
          {comp.is_bpjs_base && <Badge variant="outline" className="text-[10px]">Dasar BPJS</Badge>}
        </div>
      )
    },
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
      const comp = row.original
      const meta = table.options.meta as { onEdit: (c: SalaryComponent) => void; onDelete: (c: SalaryComponent) => void } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onEdit(comp)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => meta?.onDelete(comp)}>
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const emptyForm = {
  code: "",
  name: "",
  component_type: "earning" as "earning" | "deduction",
  category: "Gaji Pokok",
  is_taxable: true,
  is_bpjs_base: false,
}

export function ComponentTabContent() {
  const router = useRouter()
  const [components, setComponents] = useState<SalaryComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingComp, setEditingComp] = useState<SalaryComponent | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SalaryComponent | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  async function loadData() {
    const data = await getSalaryComponents()
    setComponents(data)
    setLoading(false)
  }

  if (loading && components.length === 0) loadData()

  function openCreate() {
    setEditingComp(null)
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(comp: SalaryComponent) {
    setEditingComp(comp)
    setForm({
      code: comp.code,
      name: comp.name,
      component_type: comp.component_type,
      category: comp.category,
      is_taxable: comp.is_taxable,
      is_bpjs_base: comp.is_bpjs_base,
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    const action = editingComp ? updateSalaryComponent.bind(null, editingComp.id) : createSalaryComponent
    const result = await action(formData)
    if (result?.error) { setError(result.error); return }
    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    await loadData()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteSalaryComponent(deleteTarget.id)
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
          <CardTitle className="text-lg">Komponen Gaji</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Komponen
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={components}
            isLoading={loading}
            searchPlaceholder="Cari komponen gaji..."
            emptyTitle="Belum ada komponen gaji"
            emptyDescription="Tambahkan komponen gaji untuk memulai."
            meta={{ onEdit: openEdit, onDelete: (c: SalaryComponent) => setDeleteTarget(c) }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingComp ? "Edit Komponen" : "Tambah Komponen"}</DialogTitle>
            <DialogDescription>
              {editingComp ? "Perbarui data komponen gaji" : "Tambahkan komponen gaji baru"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Kode</Label>
                <Input id="code" name="code" placeholder="GP" defaultValue={form.code} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama Komponen</Label>
                <Input id="name" name="name" placeholder="Gaji Pokok" defaultValue={form.name} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="component_type">Tipe</Label>
                <Select name="component_type" defaultValue={form.component_type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="earning">Pendapatan</SelectItem>
                    <SelectItem value="deduction">Potongan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select name="category" defaultValue={form.category}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="is_taxable" name="is_taxable" defaultChecked={form.is_taxable} />
                <Label htmlFor="is_taxable" className="text-sm">Dikenakan Pajak (Kena Pajak)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="is_bpjs_base" name="is_bpjs_base" defaultChecked={form.is_bpjs_base} />
                <Label htmlFor="is_bpjs_base" className="text-sm">Dasar Perhitungan BPJS</Label>
              </div>
              {editingComp && (
                <div className="flex items-center space-x-2">
                  <Checkbox id="is_active" name="is_active" defaultChecked={editingComp.is_active} />
                  <Label htmlFor="is_active" className="text-sm">Aktif</Label>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingComp ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Komponen?</AlertDialogTitle>
            <AlertDialogDescription>
              Komponen &quot;{deleteTarget?.name}&quot; akan dihapus. Tindakan ini tidak dapat dibatalkan.
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
