"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { formatRupiah } from "@/lib/utils/currency"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { getBpjsConfigs, createBpjsConfig, updateBpjsConfig, deleteBpjsConfig, type BpjsConfig } from "./bpjs-actions"

// Helper: format percentage rate (0.024 → "2.40%")
function fmtRate(rate: number): string {
  return (rate * 100).toFixed(2) + "%"
}

const defaultForm = {
  effective_year: new Date().getFullYear(),
  tk_jkk_rate: 0.0024,
  tk_jkm_rate: 0.003,
  tk_jht_employee_rate: 0.02,
  tk_jht_company_rate: 0.037,
  tk_jp_employee_rate: 0.01,
  tk_jp_company_rate: 0.02,
  tk_jp_max_salary: 9559600,
  kes_employee_rate: 0.01,
  kes_company_rate: 0.04,
  kes_max_salary: 12000000,
}

export function BpjsTabContent() {
  const router = useRouter()
  const [configs, setConfigs] = useState<BpjsConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<BpjsConfig | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BpjsConfig | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  async function loadData() {
    const data = await getBpjsConfigs()
    setConfigs(data)
    setLoading(false)
  }

  if (loading && configs.length === 0) loadData()

  function openCreate() {
    setEditingConfig(null)
    setForm(defaultForm)
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(cfg: BpjsConfig) {
    setEditingConfig(cfg)
    setForm({
      effective_year: cfg.effective_year,
      tk_jkk_rate: cfg.tk_jkk_rate,
      tk_jkm_rate: cfg.tk_jkm_rate,
      tk_jht_employee_rate: cfg.tk_jht_employee_rate,
      tk_jht_company_rate: cfg.tk_jht_company_rate,
      tk_jp_employee_rate: cfg.tk_jp_employee_rate,
      tk_jp_company_rate: cfg.tk_jp_company_rate,
      tk_jp_max_salary: cfg.tk_jp_max_salary,
      kes_employee_rate: cfg.kes_employee_rate,
      kes_company_rate: cfg.kes_company_rate,
      kes_max_salary: cfg.kes_max_salary,
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    const action = editingConfig ? updateBpjsConfig.bind(null, editingConfig.id) : createBpjsConfig
    const result = await action(formData)
    if (result?.error) { setError(result.error); return }
    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    await loadData()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteBpjsConfig(deleteTarget.id)
    setDeleteTarget(null)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      await loadData()
    }
  }

  // Rate fields grouped for the form
  const rateFields: { key: keyof typeof defaultForm; label: string; group: string }[] = [
    { key: "tk_jkk_rate", label: "JKK (Perusahaan)", group: "BPJS TK" },
    { key: "tk_jkm_rate", label: "JKM (Perusahaan)", group: "BPJS TK" },
    { key: "tk_jht_employee_rate", label: "JHT (Karyawan)", group: "BPJS TK" },
    { key: "tk_jht_company_rate", label: "JHT (Perusahaan)", group: "BPJS TK" },
    { key: "tk_jp_employee_rate", label: "JP (Karyawan)", group: "BPJS TK" },
    { key: "tk_jp_company_rate", label: "JP (Perusahaan)", group: "BPJS TK" },
    { key: "kes_employee_rate", label: "Kes (Karyawan)", group: "BPJS Kes" },
    { key: "kes_company_rate", label: "Kes (Perusahaan)", group: "BPJS Kes" },
  ]

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Konfigurasi BPJS</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Tahun
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-zinc-400">Memuat data...</div>
          ) : configs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-zinc-500">Belum ada konfigurasi BPJS</p>
              <p className="text-sm text-zinc-400 mt-1">Tambahkan konfigurasi untuk tahun berjalan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {configs.map((cfg) => (
                <div key={cfg.id} className="rounded-lg border border-zinc-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-zinc-900">Tahun {cfg.effective_year}</h3>
                      <Badge variant="default">Aktif</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cfg)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(cfg)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><span className="text-zinc-500">JKK:</span> <span className="font-medium">{fmtRate(cfg.tk_jkk_rate)}</span></div>
                    <div><span className="text-zinc-500">JKM:</span> <span className="font-medium">{fmtRate(cfg.tk_jkm_rate)}</span></div>
                    <div><span className="text-zinc-500">JHT Kar:</span> <span className="font-medium">{fmtRate(cfg.tk_jht_employee_rate)}</span></div>
                    <div><span className="text-zinc-500">JHT Per:</span> <span className="font-medium">{fmtRate(cfg.tk_jht_company_rate)}</span></div>
                    <div><span className="text-zinc-500">JP Kar:</span> <span className="font-medium">{fmtRate(cfg.tk_jp_employee_rate)}</span></div>
                    <div><span className="text-zinc-500">JP Per:</span> <span className="font-medium">{fmtRate(cfg.tk_jp_company_rate)}</span></div>
                    <div><span className="text-zinc-500">Max JP:</span> <span className="font-medium">{formatRupiah(cfg.tk_jp_max_salary)}</span></div>
                    <div className="col-span-2 md:col-span-1 border-t md:border-t-0 pt-2 md:pt-0"><span className="text-zinc-500">Maks Batas BPJS Kes:</span> <span className="font-medium">{fmtRate(cfg.kes_company_rate)}</span></div>
                    <div><span className="text-zinc-500">Kes Kar:</span> <span className="font-medium">{fmtRate(cfg.kes_employee_rate)}</span></div>
                    <div><span className="text-zinc-500">Kes Per:</span> <span className="font-medium">{fmtRate(cfg.kes_company_rate)}</span></div>
                    <div><span className="text-zinc-500">Max Kes:</span> <span className="font-medium">{formatRupiah(cfg.kes_max_salary)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingConfig ? "Edit Konfigurasi BPJS" : "Tambah Konfigurasi BPJS"}</DialogTitle>
            <DialogDescription>
              {editingConfig ? "Perbarui tarif BPJS untuk tahun yang dipilih" : "Atur tarif BPJS untuk tahun baru"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="effective_year">Tahun Efektif</Label>
              <Input id="effective_year" name="effective_year" type="number" defaultValue={form.effective_year} min={2020} max={2100} required />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm text-zinc-700">BPJS TK (Ketenagakerjaan)</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="tk_jkk_rate" className="text-xs">JKK % (Perusahaan)</Label>
                  <Input id="tk_jkk_rate" name="tk_jkk_rate" type="number" step="0.0001" defaultValue={form.tk_jkk_rate} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tk_jkm_rate" className="text-xs">JKM % (Perusahaan)</Label>
                  <Input id="tk_jkm_rate" name="tk_jkm_rate" type="number" step="0.0001" defaultValue={form.tk_jkm_rate} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tk_jht_employee_rate" className="text-xs">JHT % (Karyawan)</Label>
                  <Input id="tk_jht_employee_rate" name="tk_jht_employee_rate" type="number" step="0.0001" defaultValue={form.tk_jht_employee_rate} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tk_jht_company_rate" className="text-xs">JHT % (Perusahaan)</Label>
                  <Input id="tk_jht_company_rate" name="tk_jht_company_rate" type="number" step="0.0001" defaultValue={form.tk_jht_company_rate} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tk_jp_employee_rate" className="text-xs">JP % (Karyawan)</Label>
                  <Input id="tk_jp_employee_rate" name="tk_jp_employee_rate" type="number" step="0.0001" defaultValue={form.tk_jp_employee_rate} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tk_jp_company_rate" className="text-xs">JP % (Perusahaan)</Label>
                  <Input id="tk_jp_company_rate" name="tk_jp_company_rate" type="number" step="0.0001" defaultValue={form.tk_jp_company_rate} required />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="tk_jp_max_salary" className="text-xs">Batas Maks Gaji JP (Rp)</Label>
                <Input id="tk_jp_max_salary" name="tk_jp_max_salary" type="number" step="1" defaultValue={form.tk_jp_max_salary} required />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm text-zinc-700">BPJS Kes (Kesehatan)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="kes_employee_rate" className="text-xs">Iuran % (Karyawan)</Label>
                  <Input id="kes_employee_rate" name="kes_employee_rate" type="number" step="0.0001" defaultValue={form.kes_employee_rate} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="kes_company_rate" className="text-xs">Iuran % (Perusahaan)</Label>
                  <Input id="kes_company_rate" name="kes_company_rate" type="number" step="0.0001" defaultValue={form.kes_company_rate} required />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="kes_max_salary" className="text-xs">Batas Maks Gaji Kes (Rp)</Label>
                <Input id="kes_max_salary" name="kes_max_salary" type="number" step="1" defaultValue={form.kes_max_salary} required />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingConfig ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Konfigurasi BPJS?</AlertDialogTitle>
            <AlertDialogDescription>
              Konfigurasi BPJS tahun {deleteTarget?.effective_year} akan dihapus secara permanen.
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
