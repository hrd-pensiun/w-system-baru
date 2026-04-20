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
import { Plus, MoreHorizontal, Check, X, Trash2, Clock, Banknote, Loader2 } from "lucide-react"
import {
  getOvertimes,
  createOvertime,
  updateOvertimeStatus,
  deleteOvertime,
  type OvertimeRow,
  type OvertimeStatus,
  type OvertimeDayType,
} from "./overtime-actions"
import { type EmployeeWithRelations } from "../employees/employee-actions"

const overtimeStatusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Disetujui",
  rejected: "Ditolak",
  paid: "Dibayar",
}

const overtimeStatusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
  paid: "secondary",
}

const dayTypeLabels: Record<string, string> = {
  weekday: "Hari Kerja",
  weekend: "Weekend",
  national_holiday: "Hari Libur",
}

// ── Column definitions ──
const columns: ColumnDef<OvertimeRow>[] = [
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
    accessorKey: "overtime_date",
    header: "Tanggal",
    cell: ({ row }) => {
      const d = row.getValue("overtime_date") as string
      return <span className="text-zinc-500 text-xs">{d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</span>
    },
  },
  {
    id: "time_range",
    header: "Jam",
    cell: ({ row }) => {
      const o = row.original
      return (
        <span className="text-zinc-600 text-xs">
          {o.start_time?.slice(0, 5)} – {o.end_time?.slice(0, 5)}
        </span>
      )
    },
  },
  {
    accessorKey: "total_hours",
    header: "Jam Lembur",
    cell: ({ row }) => (
      <span className="font-medium text-center">{row.getValue("total_hours")} jam</span>
    ),
  },
  {
    accessorKey: "day_type",
    header: "Tipe Hari",
    cell: ({ row }) => {
      const d = row.getValue("day_type") as string
      return <Badge variant="outline">{dayTypeLabels[d] ?? d}</Badge>
    },
  },
  {
    accessorKey: "reason",
    header: "Alasan",
    cell: ({ row }) => {
      const r = row.getValue("reason") as string | null
      return <span className="text-zinc-500 text-xs max-w-[200px] truncate block">{r ?? "-"}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.getValue("status") as string
      return <Badge variant={overtimeStatusVariants[s] ?? "secondary"}>{overtimeStatusLabels[s] ?? s}</Badge>
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const ot = row.original
      const meta = table.options.meta as {
        onApprove: (o: OvertimeRow) => void
        onReject: (o: OvertimeRow) => void
        onMarkPaid: (o: OvertimeRow) => void
        onDelete: (o: OvertimeRow) => void
      } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {ot.status === "pending" && (
              <>
                <DropdownMenuItem onClick={() => meta?.onApprove(ot)}>
                  <Check className="mr-2 h-4 w-4 text-emerald-600" /> Setujui
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => meta?.onReject(ot)}>
                  <X className="mr-2 h-4 w-4" /> Tolak
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {ot.status === "approved" && (
              <>
                <DropdownMenuItem onClick={() => meta?.onMarkPaid(ot)}>
                  <Banknote className="mr-2 h-4 w-4 text-emerald-600" /> Tandai Dibayar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem className="text-destructive" onClick={() => meta?.onDelete(ot)}>
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
  overtime_date: "",
  start_time: "17:00",
  end_time: "20:00",
  total_hours: 3,
  day_type: "weekday" as OvertimeDayType,
  reason: "",
}

interface OvertimeTabContentProps {
  initialOvertimes: OvertimeRow[]
  employees: EmployeeWithRelations[]
}

export function OvertimeTabContent({ initialOvertimes, employees }: OvertimeTabContentProps) {
  const router = useRouter()
  const [overtimes, setOvertimes] = useState<OvertimeRow[]>(initialOvertimes)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<OvertimeRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // Stats
  const pendingCount = overtimes.filter((o) => o.status === "pending").length
  const approvedCount = overtimes.filter((o) => o.status === "approved").length
  const totalHours = overtimes
    .filter((o) => o.status === "approved" || o.status === "paid")
    .reduce((sum, o) => sum + (o.total_hours || 0), 0)

  function openCreate() {
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    setError(null)

    if (!form.employee_id || !form.overtime_date || !form.start_time || !form.end_time) {
      setError("Semua field wajib diisi")
      return
    }

    const result = await createOvertime({
      employee_id: form.employee_id,
      overtime_date: form.overtime_date,
      start_time: form.start_time,
      end_time: form.end_time,
      total_hours: form.total_hours,
      day_type: form.day_type,
      reason: form.reason || undefined,
    })

    if (result?.error) {
      setError(result.error)
      return
    }

    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    const fresh = await getOvertimes()
    setOvertimes(fresh)
  }

  async function handleApprove(ot: OvertimeRow) {
    const result = await updateOvertimeStatus(ot.id, "approved")
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getOvertimes()
      setOvertimes(fresh)
    }
  }

  async function handleReject(ot: OvertimeRow) {
    const result = await updateOvertimeStatus(ot.id, "rejected")
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getOvertimes()
      setOvertimes(fresh)
    }
  }

  async function handleMarkPaid(ot: OvertimeRow) {
    const result = await updateOvertimeStatus(ot.id, "paid")
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getOvertimes()
      setOvertimes(fresh)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteOvertime(deleteTarget.id)
    setDeleteTarget(null)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getOvertimes()
      setOvertimes(fresh)
    }
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
              <Clock className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{overtimes.length}</p>
              <p className="text-xs text-zinc-500">Total Lembur</p>
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
              <Banknote className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{totalHours}</p>
              <p className="text-xs text-zinc-500">Jam Disetujui</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Pengajuan Lembur</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Ajukan Lembur
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={overtimes}
            searchPlaceholder="Cari pengajuan lembur..."
            emptyTitle="Belum ada pengajuan lembur"
            emptyDescription="Ajukan lembur pertama untuk memulai."
            meta={{
              onApprove: handleApprove,
              onReject: handleReject,
              onMarkPaid: handleMarkPaid,
              onDelete: (o: OvertimeRow) => setDeleteTarget(o),
            }}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajukan Lembur</DialogTitle>
            <DialogDescription>Buat pengajuan lembur baru</DialogDescription>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="overtime_date">Tanggal Lembur *</Label>
                <Input id="overtime_date" type="date" value={form.overtime_date} onChange={(e) => setForm({ ...form, overtime_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Tipe Hari *</Label>
                <Select value={form.day_type} onValueChange={(v) => v && setForm({ ...form, day_type: v as OvertimeDayType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekday">Hari Kerja</SelectItem>
                    <SelectItem value="weekend">Weekend</SelectItem>
                    <SelectItem value="national_holiday">Hari Libur Nasional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Jam Mulai *</Label>
                <Input id="start_time" type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">Jam Selesai *</Label>
                <Input id="end_time" type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_hours">Total Jam Lembur</Label>
              <Input id="total_hours" type="number" min={0.5} step={0.5} value={form.total_hours} onChange={(e) => setForm({ ...form, total_hours: Number(e.target.value) })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Alasan</Label>
              <Input id="reason" placeholder="Alasan lembur" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
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

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengajuan Lembur?</AlertDialogTitle>
            <AlertDialogDescription>
              Pengajuan lembur {deleteTarget?.employee?.name} akan dihapus. Tindakan ini tidak dapat dibatalkan.
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