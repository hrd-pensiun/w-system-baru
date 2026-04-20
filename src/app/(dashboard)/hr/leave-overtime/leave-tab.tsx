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
  DropdownMenuSeparator,
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
import { Plus, MoreHorizontal, Check, X, Trash2, CalendarDays, Clock, AlertTriangle, Loader2 } from "lucide-react"
import {
  getLeaves,
  createLeave,
  updateLeaveStatus,
  deleteLeave,
  type LeaveRow,
  type LeaveStatus,
} from "./leave-actions"
import { type EmployeeWithRelations } from "../employees/employee-actions"

const leaveStatusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Disetujui",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
}

const leaveStatusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
  cancelled: "secondary",
}

// ── Column definitions ──
const columns: ColumnDef<LeaveRow>[] = [
  {
    id: "employee",
    header: "Karyawan",
    cell: ({ row }) => {
      const emp = row.original.employee
      return (
        <div>
          <span className="font-medium text-zinc-900">{emp?.name ?? "-"}</span>
          <span className="ml-2 font-mono text-xs text-zinc-400">{emp?.nik ?? ""}</span>
        </div>
      )
    },
  },
  {
    id: "leave_type",
    header: "Tipe Cuti",
    cell: ({ row }) => (
      <span className="text-zinc-600">{row.original.leave_type?.name ?? "-"}</span>
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
      const d = row.getValue("end_date") as string
      return <span className="text-zinc-500 text-xs">{d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</span>
    },
  },
  {
    accessorKey: "total_days",
    header: "Hari",
    cell: ({ row }) => (
      <span className="text-center font-medium">{row.getValue("total_days")}</span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Alasan",
    cell: ({ row }) => {
      const r = row.getValue("reason") as string | null
      return (
        <span className="text-zinc-500 text-xs max-w-[200px] truncate block">{r ?? "-"}</span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.getValue("status") as string
      return <Badge variant={leaveStatusVariants[s] ?? "secondary"}>{leaveStatusLabels[s] ?? s}</Badge>
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const leave = row.original
      const meta = table.options.meta as {
        onApprove: (l: LeaveRow) => void
        onReject: (l: LeaveRow) => void
        onDelete: (l: LeaveRow) => void
      } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {leave.status === "pending" && (
              <>
                <DropdownMenuItem onClick={() => meta?.onApprove(leave)}>
                  <Check className="mr-2 h-4 w-4 text-emerald-600" /> Setujui
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => meta?.onReject(leave)}>
                  <X className="mr-2 h-4 w-4" /> Tolak
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem className="text-destructive" onClick={() => meta?.onDelete(leave)}>
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
  leave_type_id: "",
  start_date: "",
  end_date: "",
  total_days: 1,
  reason: "",
}

interface LeaveTabContentProps {
  initialLeaves: LeaveRow[]
  employees: EmployeeWithRelations[]
}

// Leave types from DB (English codes mapped to Indonesian display)
const leaveTypeOptions = [
  { id: "ANNUAL", label: "Cuti Tahunan" },
  { id: "SICK", label: "Cuti Sakit" },
  { id: "MATERNITY", label: "Cuti Melahirkan" },
  { id: "PATERNITY", label: "Cuti Ayah" },
  { id: "MARRIAGE", label: "Cuti Menikah" },
  { id: "BEREAVEMENT", label: "Cuti Duka" },
  { id: "PERSONAL", label: "Cuti Pribadi" },
  { id: "UNPAID", label: "Cuti Tanpa Gaji" },
]

export function LeaveTabContent({ initialLeaves, employees }: LeaveTabContentProps) {
  const router = useRouter()
  const [leaves, setLeaves] = useState<LeaveRow[]>(initialLeaves)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<LeaveRow | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<LeaveRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // Stats
  const pendingCount = leaves.filter((l) => l.status === "pending").length
  const approvedCount = leaves.filter((l) => l.status === "approved").length

  function openCreate() {
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    setError(null)

    if (!form.employee_id || !form.leave_type_id || !form.start_date || !form.end_date) {
      setError("Semua field wajib diisi")
      return
    }

    const result = await createLeave({
      employee_id: form.employee_id,
      leave_type_id: form.leave_type_id,
      start_date: form.start_date,
      end_date: form.end_date,
      total_days: form.total_days,
      reason: form.reason || undefined,
    })

    if (result?.error) {
      setError(result.error)
      return
    }

    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    const fresh = await getLeaves()
    setLeaves(fresh)
  }

  async function handleApprove(leave: LeaveRow) {
    const result = await updateLeaveStatus(leave.id, "approved")
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getLeaves()
      setLeaves(fresh)
    }
  }

  async function handleReject() {
    if (!rejectTarget) return
    const result = await updateLeaveStatus(rejectTarget.id, "rejected", undefined, rejectReason || undefined)
    setRejectTarget(null)
    setRejectReason("")
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getLeaves()
      setLeaves(fresh)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteLeave(deleteTarget.id)
    setDeleteTarget(null)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getLeaves()
      setLeaves(fresh)
    }
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
              <CalendarDays className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{leaves.length}</p>
              <p className="text-xs text-zinc-500">Total Pengajuan</p>
            </div>
          </CardContent>
        </Card>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Check className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{approvedCount}</p>
              <p className="text-xs text-zinc-500">Disetujui</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Pengajuan Cuti</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Ajukan Cuti
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={leaves}
            searchPlaceholder="Cari pengajuan cuti..."
            emptyTitle="Belum ada pengajuan cuti"
            emptyDescription="Ajukan cuti pertama untuk memulai."
            meta={{
              onApprove: handleApprove,
              onReject: (l: LeaveRow) => { setRejectTarget(l); setRejectReason("") },
              onDelete: (l: LeaveRow) => setDeleteTarget(l),
            }}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajukan Cuti</DialogTitle>
            <DialogDescription>Buat pengajuan cuti baru</DialogDescription>
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
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.nik} — {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipe Cuti *</Label>
              <Select value={form.leave_type_id} onValueChange={(v) => v && setForm({ ...form, leave_type_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih tipe cuti" /></SelectTrigger>
                <SelectContent>
                  {leaveTypeOptions.map((lt) => (
                    <SelectItem key={lt.id} value={lt.id}>{lt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Tanggal Mulai *</Label>
                <Input id="start_date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Tanggal Selesai *</Label>
                <Input id="end_date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_days">Jumlah Hari</Label>
              <Input id="total_days" type="number" min={1} value={form.total_days} onChange={(e) => setForm({ ...form, total_days: Number(e.target.value) })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Alasan</Label>
              <Input id="reason" placeholder="Alasan cuti" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
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

      {/* Reject Dialog */}
      <Dialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tolak Pengajuan Cuti</DialogTitle>
            <DialogDescription>
              Berikan alasan penolakan untuk pengajuan cuti {rejectTarget?.employee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject_reason">Alasan Penolakan</Label>
            <Input id="reject_reason" placeholder="Alasan penolakan..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Batal</Button>
            <Button variant="destructive" onClick={handleReject}>Tolak</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengajuan Cuti?</AlertDialogTitle>
            <AlertDialogDescription>
              Pengajuan cuti {deleteTarget?.employee?.name} akan dihapus. Tindakan ini tidak dapat dibatalkan.
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