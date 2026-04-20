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
  Check,
  XCircle,
  Plane,
  Trash2,
  Loader2,
  Search,
  MapPin,
  CheckCircle2,
  FileCheck2,
} from "lucide-react"
import {
  type PerdinRow,
  type PerdinStatus,
  type EmployeeOption,
  createBusinessTrip,
  approveBusinessTrip,
  completeBusinessTrip,
  cancelBusinessTrip,
  deleteBusinessTrip,
  getBusinessTrips,
} from "./actions"

const statusLabels: Record<string, string> = {
  draft: "Draft",
  approved: "Disetujui",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  approved: "default",
  selesai: "secondary",
  dibatalkan: "destructive",
}

const fmtRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n)

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })

const columns: ColumnDef<PerdinRow>[] = [
  {
    accessorKey: "employee",
    header: "Karyawan",
    cell: ({ row }) => {
      const emp = row.original.employee
      return (
        <div>
          <p className="font-medium text-zinc-900">{emp?.name ?? "—"}</p>
          <p className="text-xs text-zinc-400">{emp?.nik ?? ""}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "destination",
    header: "Tujuan",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 text-zinc-400" />
        <span className="text-zinc-900">{row.getValue("destination") as string}</span>
      </div>
    ),
  },
  {
    id: "periode",
    header: "Periode",
    cell: ({ row }) => {
      const r = row.original
      return (
        <span className="text-xs text-zinc-600">
          {fmtDate(r.departure_date)} — {fmtDate(r.return_date)}
        </span>
      )
    },
  },
  {
    accessorKey: "budget",
    header: "Anggaran",
    cell: ({ row }) => (
      <span className="font-medium text-zinc-900">{fmtRupiah(row.getValue("budget") as number)}</span>
    ),
  },
  {
    id: "actual_cost_display",
    header: "Realisasi",
    cell: ({ row }) => {
      const cost = row.original.actual_cost
      return (
        <span className={cost ? "text-zinc-700" : "text-zinc-400"}>
          {cost ? fmtRupiah(cost) : "—"}
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
        onApprove: (r: PerdinRow) => void
        onComplete: (r: PerdinRow) => void
        onCancel: (r: PerdinRow) => void
        onDelete: (r: PerdinRow) => void
      } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {rec.status === "draft" && (
              <DropdownMenuItem onClick={() => meta?.onApprove(rec)}>
                <Check className="mr-2 h-4 w-4" /> Setujui
              </DropdownMenuItem>
            )}
            {rec.status === "approved" && (
              <DropdownMenuItem onClick={() => meta?.onComplete(rec)}>
                <FileCheck2 className="mr-2 h-4 w-4" /> Tandai Selesai
              </DropdownMenuItem>
            )}
            {(rec.status === "draft" || rec.status === "approved") && (
              <DropdownMenuItem className="text-destructive" onClick={() => meta?.onCancel(rec)}>
                <XCircle className="mr-2 h-4 w-4" /> Batalkan
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive" onClick={() => meta?.onDelete(rec)}>
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
  destination: "",
  purpose: "",
  departure_date: "",
  return_date: "",
  budget: "",
  notes: "",
}

interface PerdinTabContentProps {
  initialData: PerdinRow[]
  employees: EmployeeOption[]
}

export function PerdinTabContent({ initialData, employees }: PerdinTabContentProps) {
  const router = useRouter()
  const [data, setData] = useState<PerdinRow[]>(initialData)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PerdinRow | null>(null)
  const [actionTarget, setActionTarget] = useState<PerdinRow | null>(null)
  const [actionType, setActionType] = useState<"approve" | "complete" | "cancel" | null>(null)
  const [completeCost, setCompleteCost] = useState("")
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("semua")

  // Stats
  const draftCount = data.filter((t) => t.status === "draft").length
  const approvedCount = data.filter((t) => t.status === "approved").length
  const selesaiCount = data.filter((t) => t.status === "selesai").length
  const totalBudget = data.filter((t) => t.status !== "dibatalkan").reduce((sum, t) => sum + t.budget, 0)

  const filtered = data.filter((t) => {
    if (statusFilter !== "semua" && t.status !== statusFilter) return false
    if (search) {
      const s = search.toLowerCase()
      return (
        (t.employee?.name ?? "").toLowerCase().includes(s) ||
        t.destination.toLowerCase().includes(s) ||
        (t.purpose ?? "").toLowerCase().includes(s)
      )
    }
    return true
  })

  function openCreate() {
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    setError(null)
    if (!form.employee_id || !form.destination || !form.departure_date) {
      setError("Karyawan, tujuan, dan tanggal berangkat wajib diisi")
      return
    }

    const result = await createBusinessTrip({
      employee_id: form.employee_id,
      destination: form.destination,
      purpose: form.purpose || undefined,
      departure_date: form.departure_date,
      return_date: form.return_date || form.departure_date,
      budget: Number(form.budget) || 0,
      notes: form.notes || undefined,
    })

    if (result?.error) {
      setError(result.error)
      return
    }

    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    const fresh = await getBusinessTrips()
    setData(fresh)
  }

  async function handleAction() {
    if (!actionTarget || !actionType) return
    let result: { error?: string } | undefined
    if (actionType === "approve") result = await approveBusinessTrip(actionTarget.id)
    else if (actionType === "complete") {
      const cost = completeCost ? Number(completeCost) : undefined
      result = await completeBusinessTrip(actionTarget.id, cost)
    }
    else if (actionType === "cancel") result = await cancelBusinessTrip(actionTarget.id)

    setActionTarget(null)
    setActionType(null)
    setCompleteCost("")
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getBusinessTrips()
      setData(fresh)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteBusinessTrip(deleteTarget.id)
    setDeleteTarget(null)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getBusinessTrips()
      setData(fresh)
    }
  }

  const actionLabels: Record<string, string> = {
    approve: "Setujui",
    complete: "Tandai Selesai",
    cancel: "Batalkan",
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Plane className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{draftCount}</p>
              <p className="text-xs text-zinc-500">Menunggu</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{approvedCount}</p>
              <p className="text-xs text-zinc-500">Disetujui</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <FileCheck2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{selesaiCount}</p>
              <p className="text-xs text-zinc-500">Selesai</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <MapPin className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{fmtRupiah(totalBudget)}</p>
              <p className="text-xs text-zinc-500">Total Anggaran</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Daftar Perjalanan Dinas</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Ajukan Perdin
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari perdin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {[
                { value: "semua", label: "Semua" },
                { value: "draft", label: "Draft" },
                { value: "approved", label: "Disetujui" },
                { value: "selesai", label: "Selesai" },
              ].map((f) => (
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
            searchPlaceholder="Cari perjalanan dinas..."
            emptyTitle="Belum ada perjalanan dinas"
            emptyDescription="Ajukan perjalanan dinas pertama untuk memulai."
            meta={{
              onApprove: (r: PerdinRow) => { setActionTarget(r); setActionType("approve") },
              onComplete: (r: PerdinRow) => { setActionTarget(r); setActionType("complete"); setCompleteCost("") },
              onCancel: (r: PerdinRow) => { setActionTarget(r); setActionType("cancel") },
              onDelete: (r: PerdinRow) => setDeleteTarget(r),
            }}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajukan Perjalanan Dinas</DialogTitle>
            <DialogDescription>Buat pengajuan perjalanan dinas baru</DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Karyawan *</Label>
              <Select value={form.employee_id} onValueChange={(v) => v && setForm({ ...form, employee_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.nik} — {e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Tujuan *</Label>
                <Input id="destination" placeholder="Kota tujuan" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Anggaran (Rp)</Label>
                <Input id="budget" type="number" placeholder="0" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure_date">Tanggal Berangkat *</Label>
                <Input id="departure_date" type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="return_date">Tanggal Kembali</Label>
                <Input id="return_date" type="date" value={form.return_date} onChange={(e) => setForm({ ...form, return_date: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Keperluan</Label>
              <Textarea id="purpose" placeholder="Tujuan perjalanan dinas..." value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea id="notes" placeholder="Catatan opsional..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending} onClick={handleSubmit}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ajukan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirm */}
      <AlertDialog open={!!actionTarget} onOpenChange={(open) => !open && (setActionTarget(null), setActionType(null), setCompleteCost(""))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionLabels[actionType ?? ""] ?? "Konfirmasi"}</AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve" && `Setujui perjalanan dinas ke "${actionTarget?.destination ?? ""}"?`}
              {actionType === "complete" && `Tandai perjalanan dinas ke "${actionTarget?.destination ?? ""}" sebagai selesai?`}
              {actionType === "cancel" && `Batalkan perjalanan dinas ke "${actionTarget?.destination ?? ""}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {actionType === "complete" && (
            <div className="space-y-2">
              <Label htmlFor="actual_cost">Biaya Realisasi (Rp)</Label>
              <Input
                id="actual_cost"
                type="number"
                placeholder="Opsional"
                value={completeCost}
                onChange={(e) => setCompleteCost(e.target.value)}
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={actionType === "cancel" ? "bg-destructive text-white hover:bg-destructive/90" : "bg-zinc-900 text-white hover:bg-zinc-700"}
            >
              {actionLabels[actionType ?? ""] ?? "Ya"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Perjalanan Dinas?</AlertDialogTitle>
            <AlertDialogDescription>
              Data perjalanan dinas akan dihapus. Tindakan ini tidak dapat dibatalkan.
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