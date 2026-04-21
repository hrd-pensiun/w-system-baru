"use client"

import { useState, useTransition, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/data-table"
import { type ColumnDef } from "@tanstack/react-table"
import { DollarSign, Wallet } from "lucide-react"
import {
  type PayrollSlipRow,
  type PayrollPeriodRow,
  getAllPayrollSlips,
} from "./actions"

const fmtRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n)

const fmtDate = (d: string | null) => {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

const statusConfig: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
  draft: { label: "Draft", variant: "outline" },
  approved: { label: "Approved", variant: "default" },
  paid: { label: "Paid", variant: "secondary" },
}

interface ThrTabProps {
  periods: PayrollPeriodRow[]
}

export function ThrTab({ periods }: ThrTabProps) {
  const [isPending, startTransition] = useTransition()
  const [slips, setSlips] = useState<PayrollSlipRow[]>([])

  useEffect(() => {
    startTransition(async () => {
      const data = await getAllPayrollSlips()
      setSlips(data)
    })
  }, [])

  // Aggregate by employee for THR view
  const thrData = slips.reduce<Map<string, { name: string; nik: string; totalBruto: number; totalPph: number; count: number }>>((map, slip) => {
    const eid = slip.employee_id
    const existing = map.get(eid) ?? {
      name: slip.employee_name || slip.employee?.name || "—",
      nik: slip.employee_nik || "—",
      totalBruto: 0,
      totalPph: 0,
      count: 0,
    }
    existing.totalBruto += slip.total_pendapatan
    existing.totalPph += slip.pph21
    existing.count += 1
    map.set(eid, existing)
    return map
  }, new Map())

  const thrRows = Array.from(thrData.values())

  const columns: ColumnDef<typeof thrRows[0]>[] = [
    {
      accessorKey: "name",
      header: "Karyawan",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-zinc-900">{row.original.name}</p>
          <p className="text-xs text-zinc-400">{row.original.nik}</p>
        </div>
      ),
    },
    {
      accessorKey: "count",
      header: "Periode",
      cell: ({ row }) => <span>{row.original.count} bulan</span>,
    },
    {
      accessorKey: "totalBruto",
      header: "Total Bruto",
      cell: ({ row }) => <span className="text-right block">{fmtRupiah(row.original.totalBruto)}</span>,
    },
    {
      accessorKey: "totalPph",
      header: "Total PPh 21",
      cell: ({ row }) => <span className="text-right block text-red-600">–{fmtRupiah(row.original.totalPph)}</span>,
    },
    {
      id: "thrNetto",
      header: "Est. THR Netto",
      cell: ({ row }) => {
        const netto = row.original.totalBruto / 12 - row.original.totalPph / 12
        return <span className="text-right block font-medium text-zinc-900">{fmtRupiah(Math.round(netto))}</span>
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">Total Karyawan</p>
              <DollarSign className="h-4 w-4 text-zinc-400" />
            </div>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">{thrRows.length}</p>
            <p className="mt-1 text-xs text-zinc-400">dengan data payroll</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">Estimasi THR Total</p>
              <DollarSign className="h-4 w-4 text-zinc-400" />
            </div>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">
              {fmtRupiah(Math.round(thrRows.reduce((s, r) => s + r.totalBruto / 12, 0)))}
            </p>
            <p className="mt-1 text-xs text-zinc-400">1 bulan gaji rata-rata</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">Total PPh THR</p>
              <Wallet className="h-4 w-4 text-zinc-400" />
            </div>
            <p className="mt-1 text-2xl font-semibold text-red-600">
              –{fmtRupiah(Math.round(thrRows.reduce((s, r) => s + r.totalPph / 12, 0)))}
            </p>
            <p className="mt-1 text-xs text-zinc-400">estimasi pajak THR</p>
          </CardContent>
        </Card>
      </div>

      {/* THR Table */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-zinc-900">THR (Tunjangan Hari Raya)</h3>
        <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" disabled>
          <DollarSign className="mr-1.5 h-3.5 w-3.5" />
          Generate THR
        </Button>
      </div>

      {thrRows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="mx-auto h-10 w-10 text-zinc-300" />
            <p className="mt-2 text-sm text-zinc-500">Belum ada data payroll</p>
            <p className="text-xs text-zinc-400">Generate payroll dulu untuk lihat estimasi THR</p>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={thrRows}
          searchPlaceholder="Cari karyawan..."
        />
      )}
    </div>
  )
}