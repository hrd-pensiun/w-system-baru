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
  X,
  Banknote,
  Trash2,
  Receipt,
  Loader2,
  Search,
  Wallet,
  Clock,
  CheckCircle2,
} from "lucide-react"
import {
  type ReimburseRow,
  type ReimburseCategory,
  type ReimburseStatus,
  type EmployeeOption,
  createReimbursement,
  approveReimbursement,
  rejectReimbursement,
  markReimbursePaid,
  deleteReimbursement,
  getReimbursements,
} from "./actions"

const categoryLabels: Record<string, string> = {
  medis: "Medis",
  transport: "Transport",
  makan: "Makan",
  perdin: "Perdin",
  lainnya: "Lainnya",
}

const categoryVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  medis: "default",
  transport: "outline",
  makan: "secondary",
  perdin: "outline",
  lainnya: "secondary",
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Disetujui",
  rejected: "Ditolak",
  paid: "Dibayar",
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
  paid: "secondary",
}

const fmtRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n)

const columns: ColumnDef<ReimburseRow>[] = [
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
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => {
      const c = row.getValue("category") as string
      return <Badge variant={categoryVariants[c] ?? "secondary"}>{categoryLabels[c] ?? c}</Badge>
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => {
      const d = row.getValue("description") as string | null
      return <span className="text-sm text-zinc-600 line-clamp-1">{d ?? "—"}</span>
    },
  },
  {
    accessorKey: "amount",
    header: "Jumlah",
    cell: ({ row }) => (
      <span className="font-medium text-zinc-900">{fmtRupiah(row.getValue("amount") as number)}</span>
    ),
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
    accessorKey: "created_at",
    header: "Tanggal",
    cell: ({ row }) => {
      const d = row.getValue("created_at") as string
      return (
        <span className="text-xs text-zinc-500">
          {new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const rec = row.original
      const meta = table.options.meta as {
        onApprove: (r: ReimburseRow) => void
        onReject: (r: ReimburseRow) => void
        onPay: (r: ReimburseRow) => void
        onDelete: (r: ReimburseRow) => void
      } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {rec.status === "pending" && (
              <>
                <DropdownMenuItem onClick={() => meta?.onApprove(rec)}>
                  <Check className="mr-2 h-4 w-4" /> Setujui
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => meta?.onReject(rec)}>
                  <X className="mr-2 h-4 w-4" /> Tolak
                </DropdownMenuItem>
              </>
            )}
            {rec.status === "approved" && (
              <DropdownMenuItem onClick={() => meta?.onPay(rec)}>
                <Banknote className="mr-2 h-4 w-4" /> Tandai Dibayar
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
  category: "transport" as ReimburseCategory,
  description: "",
  amount: "",
  notes: "",
}

interface ReimburseTabContentProps {
  initialData: ReimburseRow[]
  employees: EmployeeOption[]
}

export function ReimburseTabContent({ initialData, employees }: ReimburseTabContentProps) {
  const router = useRouter()
  const [data, setData] = useState<ReimburseRow[]>(initialData)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ReimburseRow | null>(null)
  const [actionTarget, setActionTarget] = useState<ReimburseRow | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | "pay" | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("semua")

  // Stats
  const pendingCount = data.filter((r) => r.status === "pending").length
  const approvedCount = data.filter((r) => r.status === "approved").length
  const totalAmount = data.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.amount, 0)

  const filtered = data.filter((r) => {
    if (statusFilter !== "semua" && r.status !== statusFilter) return false
    if (search) {
      const s = search.toLowerCase()
      return (
        (r.employee?.name ?? "").toLowerCase().includes(s) ||
        (r.description ?? "").toLowerCase().includes(s) ||
        categoryLabels[r.category]?.toLowerCase().includes(s)
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
    if (!form.employee_id || !form.amount) {
      setError("Karyawan dan jumlah wajib diisi")
      return
    }

    const result = await createReimbursement({
      employee_id: form.employee_id,
      category: form.category,
      description: form.description || undefined,
      amount: Number(form.amount),
      notes: form.notes || undefined,
    })

    if (result?.error) {
      setError(result.error)
      return
    }

    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    const fresh = await getReimbursements()
    setData(fresh)
  }

  async function handleAction() {
    if (!actionTarget || !actionType) return
    let result: { error?: string } | undefined
    if (actionType === "approve") result = await approveReimbursement(actionTarget.id)
    else if (actionType === "reject") result = await rejectReimbursement(actionTarget.id)
    else if (actionType === "pay") result = await markReimbursePaid(actionTarget.id)

    setActionTarget(null)
    setActionType(null)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getReimbursements()
      setData(fresh)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteReimbursement(deleteTarget.id)
    setDeleteTarget(null)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getReimbursements()
      setData(fresh)
    }
  }

  const actionLabels: Record<string, string> = {
    approve: "Setujui",
    reject: "Tolak",
    pay: "Tandai Dibayar",
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{pendingCount}</p>
              <p className="text-xs text-zinc-500">Pending</p>
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
              <Wallet className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{fmtRupiah(totalAmount)}</p>
              <p className="text-xs text-zinc-500">Total Dibayar</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <Receipt className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{data.length}</p>
              <p className="text-xs text-zinc-500">Total Pengajuan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Daftar Reimburse</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Ajukan Reimburse
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari reimburse..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {[
                { value: "semua", label: "Semua" },
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Disetujui" },
                { value: "paid", label: "Dibayar" },
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
            searchPlaceholder="Cari reimburse..."
            emptyTitle="Belum ada reimburse"
            emptyDescription="Ajukan reimburse pertama untuk memulai."
            meta={{
              onApprove: (r: ReimburseRow) => { setActionTarget(r); setActionType("approve") },
              onReject: (r: ReimburseRow) => { setActionTarget(r); setActionType("reject") },
              onPay: (r: ReimburseRow) => { setActionTarget(r); setActionType("pay") },
              onDelete: (r: ReimburseRow) => setDeleteTarget(r),
            }}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajukan Reimburse</DialogTitle>
            <DialogDescription>Buat pengajuan reimburse baru</DialogDescription>
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
                <Label>Kategori *</Label>
                <Select value={form.category} onValueChange={(v) => v && setForm({ ...form, category: v as ReimburseCategory })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medis">Medis</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="makan">Makan</SelectItem>
                    <SelectItem value="perdin">Perdin</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah (Rp) *</Label>
                <Input id="amount" type="number" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" placeholder="Deskripsi pengajuan..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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

      {/* Action Confirm (Approve/Reject/Pay) */}
      <AlertDialog open={!!actionTarget} onOpenChange={(open) => !open && (setActionTarget(null), setActionType(null))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionLabels[actionType ?? ""] ?? "Konfirmasi"}</AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve" && `Setujui reimburse "${actionTarget?.description ?? ""}" sebesar ${actionTarget ? fmtRupiah(actionTarget.amount) : ""}?`}
              {actionType === "reject" && `Tolak reimburse "${actionTarget?.description ?? ""}"?`}
              {actionType === "pay" && `Tandai reimburse "${actionTarget?.description ?? ""}" sebagai sudah dibayar?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={actionType === "reject" ? "bg-destructive text-white hover:bg-destructive/90" : "bg-zinc-900 text-white hover:bg-zinc-700"}
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
            <AlertDialogTitle>Hapus Reimburse?</AlertDialogTitle>
            <AlertDialogDescription>
              Data reimburse akan dihapus. Tindakan ini tidak dapat dibatalkan.
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