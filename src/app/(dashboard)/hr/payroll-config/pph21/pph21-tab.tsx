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
import { getPph21Configs, createPph21Config, updatePph21Config, deletePph21Config, type Pph21Config } from "./pph21-actions"

const ptkpLabels: Record<string, string> = {
  ptkp_tk0: "TK/0",
  ptkp_k0: "K/0",
  ptkp_k1: "K/1",
  ptkp_k2: "K/2",
  ptkp_k3: "K/3",
}

const defaultForm = {
  effective_year: new Date().getFullYear(),
  ptkp_tk0: 54000000,
  ptkp_k0: 58500000,
  ptkp_k1: 63000000,
  ptkp_k2: 67500000,
  ptkp_k3: 72000000,
  jabatan_rate: 0.05,
  jabatan_max_annual: 6000000,
  non_npwp_surcharge: 0.20,
}

export function Pph21TabContent() {
  const router = useRouter()
  const [configs, setConfigs] = useState<Pph21Config[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<Pph21Config | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Pph21Config | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  async function loadData() {
    const data = await getPph21Configs()
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

  function openEdit(cfg: Pph21Config) {
    setEditingConfig(cfg)
    setForm({
      effective_year: cfg.effective_year,
      ptkp_tk0: cfg.ptkp_tk0,
      ptkp_k0: cfg.ptkp_k0,
      ptkp_k1: cfg.ptkp_k1,
      ptkp_k2: cfg.ptkp_k2,
      ptkp_k3: cfg.ptkp_k3,
      jabatan_rate: cfg.jabatan_rate,
      jabatan_max_annual: cfg.jabatan_max_annual,
      non_npwp_surcharge: cfg.non_npwp_surcharge,
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    // Preserve existing progressive_brackets when editing
    if (editingConfig?.progressive_brackets) {
      formData.set("progressive_brackets", JSON.stringify(editingConfig.progressive_brackets))
    }
    const action = editingConfig ? updatePph21Config.bind(null, editingConfig.id) : createPph21Config
    const result = await action(formData)
    if (result?.error) { setError(result.error); return }
    setDialogOpen(false)
    startTransition(() => { router.refresh() })
    await loadData()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deletePph21Config(deleteTarget.id)
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
          <CardTitle className="text-lg">Konfigurasi PPh21</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Tahun
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-zinc-400">Memuat data...</div>
          ) : configs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-zinc-500">Belum ada konfigurasi PPh21</p>
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

                  <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">PTKP (Penghasilan Tidak Kena Pajak)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm mb-4">
                    {Object.entries(ptkpLabels).map(([key, label]) => (
                      <div key={key}>
                        <span className="text-zinc-500">{label}:</span>{" "}
                        <span className="font-medium">{formatRupiah(cfg[key as keyof typeof cfg] as number)}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Biaya Jabatan & Surcharge</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div><span className="text-zinc-500">Biaya Jabatan:</span> <span className="font-medium">{(cfg.jabatan_rate * 100).toFixed(0)}%</span></div>
                    <div><span className="text-zinc-500">Maks Tahunan:</span> <span className="font-medium">{formatRupiah(cfg.jabatan_max_annual)}</span></div>
                    <div><span className="text-zinc-500">Non-NPWP Surcharge:</span> <span className="font-medium">{(cfg.non_npwp_surcharge * 100).toFixed(0)}%</span></div>
                  </div>

                  {Array.isArray(cfg.progressive_brackets) && cfg.progressive_brackets.length > 0 && (
                    <>
                      <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Tarif Progresif</h4>
                      <div className="rounded-md border border-zinc-200 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-zinc-50 text-xs text-zinc-500 uppercase">
                              <th className="px-3 py-2 text-left">Penghasilan Min</th>
                              <th className="px-3 py-2 text-left">Penghasilan Max</th>
                              <th className="px-3 py-2 text-right">Tarif</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100">
                            {cfg.progressive_brackets.map((b, i) => (
                              <tr key={i} className="hover:bg-zinc-50">
                                <td className="px-3 py-2">{formatRupiah(b.min)}</td>
                                <td className="px-3 py-2">{b.max ? formatRupiah(b.max) : "∞"}</td>
                                <td className="px-3 py-2 text-right font-medium">{(b.rate * 100).toFixed(0)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
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
            <DialogTitle>{editingConfig ? "Edit Konfigurasi PPh21" : "Tambah Konfigurasi PPh21"}</DialogTitle>
            <DialogDescription>
              {editingConfig ? "Perbarui PTKP dan setelan PPh21" : "Atur PTKP dan setelan PPh21 untuk tahun baru"}
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

            <h4 className="font-medium text-sm text-zinc-700">PTKP (Penghasilan Tidak Kena Pajak)</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(ptkpLabels).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={key} className="text-xs">{label}</Label>
                  <Input id={key} name={key} type="number" step="1" defaultValue={form[key as keyof typeof form] as number} required />
                </div>
              ))}
            </div>

            <h4 className="font-medium text-sm text-zinc-700">Biaya Jabatan & Surcharge</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="jabatan_rate" className="text-xs">Tarif Biaya Jabatan (%)</Label>
                <Input id="jabatan_rate" name="jabatan_rate" type="number" step="0.01" defaultValue={form.jabatan_rate} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="jabatan_max_annual" className="text-xs">Maks Tahunan (Rp)</Label>
                <Input id="jabatan_max_annual" name="jabatan_max_annual" type="number" step="1" defaultValue={form.jabatan_max_annual} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="non_npwp_surcharge" className="text-xs">Non-NPWP Surcharge (%)</Label>
                <Input id="non_npwp_surcharge" name="non_npwp_surcharge" type="number" step="0.01" defaultValue={form.non_npwp_surcharge} required />
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
            <AlertDialogTitle>Hapus Konfigurasi PPh21?</AlertDialogTitle>
            <AlertDialogDescription>
              Konfigurasi PPh21 tahun {deleteTarget?.effective_year} akan dihapus secara permanen.
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
