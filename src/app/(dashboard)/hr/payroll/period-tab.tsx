"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Loader2,
  DollarSign,
  Users,
  Wallet,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Banknote,
  Eye,
  ChevronDown,
  ChevronUp,
  Printer,
  Download,
  Play,
} from "lucide-react"
import {
  type PayrollPeriodRow,
  type PayrollSlipRow,
  getPayrollPeriods,
  getPayrollSlips,
  createPayrollPeriod,
  generatePayroll,
  approvePayrollPeriod,
  markPayrollPaid,
  cancelPayrollPeriod,
  deletePayrollPeriod,
} from "./actions"

const bulanLabels = [
  "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

const statusConfig: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
  draft: { label: "Draft", variant: "outline" },
  processing: { label: "Processing", variant: "secondary" },
  approved: { label: "Approved", variant: "default" },
  paid: { label: "Paid", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

const fmtRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n)

const fmtDate = (d: string | null) => {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

// ─── Period Columns ───
const periodColumns: ColumnDef<PayrollPeriodRow>[] = [
  {
    accessorKey: "period_month",
    header: "Periode",
    cell: ({ row }) => {
      const m = row.original.period_month
      const y = row.original.period_year
      return <span className="font-medium text-zinc-900">{bulanLabels[m]} {y}</span>
    },
  },
  {
    accessorKey: "entity_name",
    header: "Entity",
    cell: ({ row }) => row.original.entity_name ?? "—",
  },
  {
    accessorKey: "title",
    header: "Judul",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = statusConfig[row.original.status]
      return <Badge variant={s?.variant ?? "secondary"}>{s?.label ?? row.original.status}</Badge>
    },
  },
  {
    accessorKey: "pay_date",
    header: "Tgl Bayar",
    cell: ({ row }) => fmtDate(row.original.pay_date),
  },
  {
    accessorKey: "employee_count",
    header: "Karyawan",
    cell: ({ row }) => (
      <span className="text-center block">{row.original.employee_count || "—"}</span>
    ),
  },
  {
    accessorKey: "total_bruto",
    header: "Total Bruto",
    cell: ({ row }) => (
      <span className="text-right block">{row.original.total_bruto ? fmtRupiah(row.original.total_bruto) : "—"}</span>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: () => null, // handled via meta
  },
]

interface PeriodTabProps {
  initialData: PayrollPeriodRow[]
}

export function PeriodTab({ initialData }: PeriodTabProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [periods, setPeriods] = useState<PayrollPeriodRow[]>(initialData)
  const [showCreate, setShowCreate] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string; label: string } | null>(null)
  const [formData, setFormData] = useState({
    period_month: String(new Date().getMonth() + 1),
    period_year: String(new Date().getFullYear()),
    title: "",
    entity_name: "",
    notes: "",
  })

  useEffect(() => {
    startTransition(async () => {
      const data = await getPayrollPeriods()
      setPeriods(data)
    })
  }, [])

  const handleCreate = () => {
    const month = parseInt(formData.period_month)
    const year = parseInt(formData.period_year)
    const title = formData.title || `Gaji ${bulanLabels[month]} ${year}`
    startTransition(async () => {
      const result = await createPayrollPeriod({
        period_month: month,
        period_year: year,
        title,
        entity_name: formData.entity_name || undefined,
        notes: formData.notes || undefined,
      })
      if (result.success) {
        setShowCreate(false)
        const data = await getPayrollPeriods()
        setPeriods(data)
      } else {
        alert(result.error)
      }
    })
  }

  const handleAction = (type: string, id: string) => {
    const labels: Record<string, string> = {
      generate: "Generate payroll untuk periode ini?",
      approve: "Setujui payroll ini?",
      pay: "Tandai payroll ini sebagai sudah dibayar?",
      cancel: "Batalkan payroll ini?",
      delete: "Hapus periode payroll ini? Slip gaji juga akan dihapus.",
    }
    setConfirmAction({ type, id, label: labels[type] ?? "Lanjutkan?" })
  }

  const executeAction = () => {
    if (!confirmAction) return
    const { type, id } = confirmAction
    setConfirmAction(null)
    startTransition(async () => {
      let result: { success?: boolean; error?: string } = {}
      if (type === "generate") result = await generatePayroll(id)
      else if (type === "approve") result = await approvePayrollPeriod(id)
      else if (type === "pay") result = await markPayrollPaid(id)
      else if (type === "cancel") result = await cancelPayrollPeriod(id)
      else if (type === "delete") result = await deletePayrollPeriod(id)
      if (result.error) alert(result.error)
      const data = await getPayrollPeriods()
      setPeriods(data)
      router.refresh()
    })
  }

  // Metric cards
  const currentMonth = periods.find((p) => p.status === "draft")
  const totalPaidMonth = periods.find((p) => p.status === "paid")
  const approvedMonth = periods.find((p) => p.status === "approved")
  const totalSlipCount = periods.reduce((sum, p) => sum + p.employee_count, 0)

  const columnsWithMeta = [
    ...periodColumns.map((col) => {
      if (col.id === "actions") {
        return {
          ...col,
          cell: ({ row }: { row: { original: PayrollPeriodRow } }) => {
            const p = row.original
            return (
              <div className="flex items-center justify-end gap-1">
                {p.status === "draft" && p.employee_count === 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleAction("generate", p.id)}
                  >
                    <Play className="mr-1 h-3 w-3" />
                    Generate
                  </Button>
                )}
                {p.status === "draft" && p.employee_count > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleAction("approve", p.id)}
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Approve
                  </Button>
                )}
                {p.status === "approved" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleAction("pay", p.id)}
                  >
                    <Banknote className="mr-1 h-3 w-3" />
                    Bayar
                  </Button>
                )}
                {(p.status === "draft" || p.status === "approved") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-600"
                    onClick={() => handleAction("cancel", p.id)}
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                  </Button>
                )}
              </div>
            )
          },
        }
      }
      return col
    }),
  ]

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Gaji Bulan Ini", value: totalPaidMonth?.total_bruto ? fmtRupiah(totalPaidMonth.total_bruto) : "—", icon: DollarSign, sub: totalPaidMonth ? bulanLabels[totalPaidMonth.period_month] + " " + totalPaidMonth.period_year : "Belum ada" },
          { label: "Karyawan Diproses", value: String(totalSlipCount), icon: Users, sub: "total slip" },
          { label: "Rata-rata THP", value: totalPaidMonth?.total_netto && totalPaidMonth.employee_count ? fmtRupiah(Math.round(totalPaidMonth.total_netto / totalPaidMonth.employee_count)) : "—", icon: Wallet, sub: "per karyawan" },
          { label: "Payroll Belum Diproses", value: String(periods.filter((p) => p.status === "draft" && p.employee_count === 0).length), icon: AlertCircle, sub: "periode draft" },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{m.label}</p>
                <m.icon className="h-4 w-4 text-zinc-400" />
              </div>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{m.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Period table */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-zinc-900">Periode Payroll</h3>
        <Button
          size="sm"
          className="bg-zinc-900 text-white hover:bg-zinc-700"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Buat Periode
        </Button>
      </div>

      {periods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="mx-auto h-10 w-10 text-zinc-300" />
            <p className="mt-2 text-sm text-zinc-500">Belum ada periode payroll</p>
            <p className="text-xs text-zinc-400">Klik &quot;Buat Periode&quot; untuk mulai</p>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columnsWithMeta as ColumnDef<PayrollPeriodRow>[]}
          data={periods}
          searchPlaceholder="Cari periode..."
        />
      )}

      {/* Create Period Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Periode Payroll</DialogTitle>
            <DialogDescription>Pilih bulan dan tahun untuk periode payroll baru</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bulan</Label>
                <Select
                  value={formData.period_month}
                  onValueChange={(v) => { if (v) setFormData({ ...formData, period_month: v }) }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {bulanLabels.slice(1).map((b, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tahun</Label>
                <Input
                  type="number"
                  value={formData.period_year}
                  onChange={(e) => setFormData({ ...formData, period_year: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Judul (opsional)</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={`Gaji ${bulanLabels[parseInt(formData.period_month)]} ${formData.period_year}`}
              />
            </div>
            <div>
              <Label>Entity (opsional)</Label>
              <Input
                value={formData.entity_name}
                onChange={(e) => setFormData({ ...formData, entity_name: e.target.value })}
                placeholder="PT Contoh Indonesia"
              />
            </div>
            <div>
              <Label>Catatan</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Catatan tambahan..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Batal</Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={handleCreate} disabled={isPending}>
              {isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Buat Periode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Action Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => { if (!open) setConfirmAction(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
            <AlertDialogDescription>{confirmAction?.label}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={executeAction}>Ya, Lanjutkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}