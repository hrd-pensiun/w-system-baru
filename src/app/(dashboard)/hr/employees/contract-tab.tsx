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
import { Plus, MoreHorizontal, Pencil, Trash2, FileText, Loader2 } from "lucide-react"
import {
  getContracts,
  createContract,
  updateContract,
  deleteContract,
} from "./contract-actions"
import { type EmployeeWithRelations } from "./employee-actions"

type ContractWithEmployee = Awaited<ReturnType<typeof getContracts>>[number]

const contractTypeLabels: Record<string, string> = {
  pkwt: "PKWT",
  pkwtt: "PKWTT",
}

const contractStatusLabels: Record<string, string> = {
  aktif: "Aktif",
  berakhir: "Berakhir",
  diperpanjang: "Diperpanjang",
  terminated: "Terminated",
}

const contractStatusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  aktif: "default",
  berakhir: "secondary",
  diperpanjang: "outline",
  terminated: "destructive",
}

// ── Column definitions ──
const columns: ColumnDef<ContractWithEmployee>[] = [
  {
    id: "employee",
    header: "Karyawan",
    cell: ({ row }) => {
      const emp = row.original.employee as { id: string; nik: string; name: string } | null
      return (
        <div>
          <span className="font-medium text-zinc-900">{emp?.name ?? "-"}</span>
          <span className="ml-2 font-mono text-xs text-zinc-400">{emp?.nik ?? ""}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "contract_type",
    header: "Tipe",
    cell: ({ row }) => (
      <Badge variant="outline">{contractTypeLabels[row.getValue("contract_type") as string] ?? row.getValue("contract_type")}</Badge>
    ),
  },
  {
    accessorKey: "contract_no",
    header: "No. Kontrak",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("contract_no") ?? "-"}</span>
    ),
  },
  {
    accessorKey: "start_date",
    header: "Mulai",
    cell: ({ row }) => {
      const d = row.getValue("start_date") as string
      return <span className="text-zinc-500 text-xs">{d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</span>
    },
  },
  {
    accessorKey: "end_date",
    header: "Selesai",
    cell: ({ row }) => {
      const d = row.getValue("end_date") as string | null
      return <span className="text-zinc-500 text-xs">{d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "Indefinite"}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.getValue("status") as string
      return <Badge variant={contractStatusVariants[s] ?? "secondary"}>{contractStatusLabels[s] ?? s}</Badge>
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const c = row.original
      const meta = table.options.meta as { onEdit: (c: ContractWithEmployee) => void; onDelete: (c: ContractWithEmployee) => void } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onEdit(c)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => meta?.onDelete(c)}>
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
  contract_type: "pkwt",
  contract_no: "",
  start_date: "",
  end_date: "",
  status: "aktif",
  notes: "",
}

interface ContractTabContentProps {
  initialContracts: ContractWithEmployee[]
  employees: EmployeeWithRelations[]
}

export function ContractTabContent({ initialContracts, employees }: ContractTabContentProps) {
  const router = useRouter()
  const [contracts, setContracts] = useState<ContractWithEmployee[]>(initialContracts)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ContractWithEmployee | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContractWithEmployee | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const activeContracts = contracts.filter((c) => c.status === "aktif").length

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(c: ContractWithEmployee) {
    setEditing(c)
    setForm({
      employee_id: c.employee_id,
      contract_type: c.contract_type,
      contract_no: c.contract_no ?? "",
      start_date: c.start_date,
      end_date: c.end_date ?? "",
      status: c.status,
      notes: c.notes ?? "",
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    setError(null)

    if (!form.employee_id || !form.start_date) {
      setError("Karyawan dan tanggal mulai wajib diisi")
      return
    }

    const payload = {
      employee_id: form.employee_id,
      contract_type: form.contract_type,
      contract_no: form.contract_no || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      status: form.status ?? undefined,
      notes: form.notes || null,
    }

    const result = editing
      ? await updateContract(editing.id, payload)
      : await createContract(payload)

    if (result?.error) {
      setError(result.error)
      return
    }

    setDialogOpen(false)
    startTransition(() => {
      router.refresh()
    })
    const fresh = await getContracts()
    setContracts(fresh)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteContract(deleteTarget.id)
    setDeleteTarget(null)
    if (!result?.error) {
      startTransition(() => {
        router.refresh()
      })
      const fresh = await getContracts()
      setContracts(fresh)
    }
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
              <FileText className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{contracts.length}</p>
              <p className="text-xs text-zinc-500">Total Kontrak</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{activeContracts}</p>
              <p className="text-xs text-zinc-500">Kontrak Aktif</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Kontrak Karyawan</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Kontrak
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={contracts}
            searchPlaceholder="Cari kontrak..."
            emptyTitle="Belum ada kontrak"
            emptyDescription="Tambahkan kontrak karyawan pertama."
            meta={{ onEdit: openEdit, onDelete: (c: ContractWithEmployee) => setDeleteTarget(c) }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Kontrak" : "Tambah Kontrak"}</DialogTitle>
            <DialogDescription>
              {editing ? "Perbarui data kontrak karyawan" : "Tambahkan kontrak karyawan baru"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-4">
            {/* Employee select */}
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

            {/* Contract type & No */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipe Kontrak *</Label>
                <Select value={form.contract_type} onValueChange={(v) => v && setForm({ ...form, contract_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pkwt">PKWT</SelectItem>
                    <SelectItem value="pkwtt">PKWTT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract_no">No. Kontrak</Label>
                <Input id="contract_no" placeholder="CTR-2026-001" value={form.contract_no} onChange={(e) => setForm({ ...form, contract_no: e.target.value })} />
              </div>
            </div>

            {/* Dates */}
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

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => v && setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="berakhir">Berakhir</SelectItem>
                  <SelectItem value="diperpanjang">Diperpanjang</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
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
            <AlertDialogTitle>Hapus Kontrak?</AlertDialogTitle>
            <AlertDialogDescription>
              Kontrak ini akan dihapus. Tindakan ini tidak dapat dibatalkan.
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