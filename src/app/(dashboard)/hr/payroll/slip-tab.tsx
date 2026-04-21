"use client"

import { useState, useTransition, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/data-table"
import { type ColumnDef } from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronUp,
  Printer,
  Download,
  Wallet,
} from "lucide-react"
import {
  type PayrollSlipRow,
  type PayrollPeriodRow,
  getPayrollSlips,
} from "./actions"

const fmtRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n)

interface SlipTabProps {
  periods: PayrollPeriodRow[]
}

export function SlipTab({ periods }: SlipTabProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedPeriod, setSelectedPeriod] = useState<string>("")
  const [slips, setSlips] = useState<PayrollSlipRow[]>([])
  const [expandedSlip, setExpandedSlip] = useState<string | null>(null)

  useEffect(() => {
    if (periods.length > 0 && !selectedPeriod) {
      const first = periods[0]
      setSelectedPeriod(first.id)
      startTransition(async () => {
        const data = await getPayrollSlips(first.id)
        setSlips(data)
      })
    }
  }, [periods, selectedPeriod])

  const handlePeriodChange = (periodId: string) => {
    setSelectedPeriod(periodId)
    setExpandedSlip(null)
    startTransition(async () => {
      const data = await getPayrollSlips(periodId)
      setSlips(data)
    })
  }

  const period = periods.find((p) => p.id === selectedPeriod)

  if (periods.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Wallet className="mx-auto h-10 w-10 text-zinc-300" />
          <p className="mt-2 text-sm text-zinc-500">Belum ada periode payroll</p>
          <p className="text-xs text-zinc-400">Buat periode dan generate payroll dulu</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Period selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-500">Periode:</span>
        <select
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm"
          value={selectedPeriod}
          onChange={(e) => handlePeriodChange(e.target.value)}
        >
          {periods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.status})
            </option>
          ))}
        </select>
      </div>

      {slips.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-zinc-500">Belum ada slip gaji untuk periode ini</p>
            <p className="text-xs text-zinc-400">Generate payroll dulu di tab Periode</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {slips.map((slip) => {
            const isExpanded = expandedSlip === slip.id
            const name = slip.employee_name || slip.employee?.name || "—"
            const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()

            return (
              <Card key={slip.id} className="rounded-xl border border-zinc-200">
                <CardContent className="p-0">
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50"
                    onClick={() => setExpandedSlip(isExpanded ? null : slip.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-600">
                        {initials}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">{name}</p>
                        <p className="text-xs text-zinc-400">
                          {slip.employee_nik} · {slip.job_grade || "—"} · {slip.department || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-zinc-900">{fmtRupiah(slip.thp)}</p>
                        <p className="text-xs text-zinc-400">THP</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-zinc-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-6 py-5 space-y-5">
                      {/* Employee info */}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
                        <div>
                          <span className="text-xs text-zinc-400">Nama Karyawan</span>
                          <p className="font-medium text-zinc-900">{name}</p>
                        </div>
                        <div>
                          <span className="text-xs text-zinc-400">NIK</span>
                          <p className="font-medium text-zinc-900">{slip.employee_nik || "—"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-zinc-400">Jabatan</span>
                          <p className="font-medium text-zinc-900">{slip.position || "—"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-zinc-400">Departemen</span>
                          <p className="font-medium text-zinc-900">{slip.department || "—"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-zinc-400">Grade</span>
                          <p className="font-medium text-zinc-900">{slip.job_grade || "—"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-zinc-400">Metode PPh</span>
                          <Badge variant="outline" className="text-xs">{slip.tax_method}</Badge>
                        </div>
                      </div>

                      <div className="border-t border-zinc-200" />

                      {/* Pendapatan & Potongan */}
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* PENDAPATAN */}
                        <div>
                          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Pendapatan</h4>
                          <div className="space-y-2">
                            {[
                              { label: "Gaji Pokok", value: slip.gaji_pokok },
                              { label: "Tunjangan Jabatan", value: slip.tunjangan_jabatan },
                              { label: "Tunjangan Transport", value: slip.tunjangan_transport },
                              { label: "Tunjangan Makan", value: slip.tunjangan_makan },
                              { label: "Tunjangan Lainnya", value: slip.tunjangan_lainnya },
                              { label: "Lembur", value: slip.lembur_amount },
                              { label: "Reimburse", value: slip.reimburse_amount },
                            ]
                              .filter((item) => item.value > 0)
                              .map((item) => (
                                <div key={item.label} className="flex items-center justify-between text-sm">
                                  <span className="text-zinc-600">{item.label}</span>
                                  <span className="font-medium text-zinc-900">{fmtRupiah(item.value)}</span>
                                </div>
                              ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3 text-sm font-semibold">
                            <span className="text-zinc-700">Total Pendapatan</span>
                            <span className="text-zinc-900">{fmtRupiah(slip.total_pendapatan)}</span>
                          </div>
                        </div>

                        {/* POTONGAN */}
                        <div>
                          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Potongan</h4>
                          <div className="space-y-2">
                            {[
                              { label: "JHT Karyawan 2%", value: slip.jht_karyawan },
                              { label: "JP Karyawan 1%", value: slip.jp_karyawan },
                              { label: "BPJS Kes 1%", value: slip.bpjs_kes_karyawan },
                              { label: "PPh 21", value: slip.pph21 },
                              { label: "Potongan Lainnya", value: slip.potongan_lainnya },
                            ]
                              .filter((item) => item.value > 0)
                              .map((item) => (
                                <div key={item.label} className="flex items-center justify-between text-sm">
                                  <span className="text-zinc-600">{item.label}</span>
                                  <span className="font-medium text-red-600">–{fmtRupiah(item.value)}</span>
                                </div>
                              ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3 text-sm font-semibold">
                            <span className="text-zinc-700">Total Potongan</span>
                            <span className="text-red-600">–{fmtRupiah(slip.total_potongan)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-zinc-200" />

                      {/* THP */}
                      <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-zinc-700">THP (Take Home Pay)</p>
                          <p className="text-xs text-zinc-400">Gaji bersih setelah potongan</p>
                        </div>
                        <p className="text-2xl font-bold text-zinc-900">{fmtRupiah(slip.thp)}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}