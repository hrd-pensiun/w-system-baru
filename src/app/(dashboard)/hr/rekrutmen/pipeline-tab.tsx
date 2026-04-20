"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
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
import { Plus, MoreHorizontal, ArrowRight, X, Trash2, Loader2 } from "lucide-react"
import {
  type RecruitmentRow,
  type ApplicantRow,
  type ApplicantStage,
  type ApplicantSource,
  createApplicant,
  updateApplicantStage,
  deleteApplicant,
  getApplicants,
} from "./actions"

const stages: { key: ApplicantStage; label: string; variant: "default" | "secondary" | "destructive" | "outline" }[] = [
  { key: "melamar", label: "Melamar", variant: "secondary" },
  { key: "screening", label: "Screening", variant: "outline" },
  { key: "interview", label: "Interview", variant: "default" },
  { key: "assessment", label: "Assessment", variant: "outline" },
  { key: "offering", label: "Offering", variant: "default" },
  { key: "dihiring", label: "Dihiring", variant: "default" },
]

const sourceLabels: Record<string, string> = {
  website: "Website",
  linkedin: "LinkedIn",
  referral: "Referral",
  job_board: "Job Board",
  walk_in: "Walk-in",
  other: "Lainnya",
}

const emptyForm = {
  recruitment_id: "",
  full_name: "",
  email: "",
  phone: "",
  source: "website" as ApplicantSource,
  is_talent_pool: false,
  notes: "",
}

interface PipelineTabContentProps {
  initialApplicants: ApplicantRow[]
  recruitments: RecruitmentRow[]
}

export function PipelineTabContent({ initialApplicants, recruitments }: PipelineTabContentProps) {
  const router = useRouter()
  const [applicants, setApplicants] = useState<ApplicantRow[]>(initialApplicants)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<ApplicantRow | null>(null)

  const pipelineStages = stages.map((stage) => ({
    ...stage,
    applicants: applicants.filter((a) => a.stage === stage.key),
  }))

  const ditolakApplicants = applicants.filter((a) => a.stage === "ditolak")

  function getRecruitmentTitle(recruitmentId: string): string {
    return recruitments.find((r) => r.id === recruitmentId)?.title ?? "—"
  }

  function getNextStage(currentStage: string): ApplicantStage | null {
    const idx = stages.findIndex((s) => s.key === currentStage)
    if (idx < 0 || idx >= stages.length - 1) return null
    return stages[idx + 1].key
  }

  async function handleMoveStage(applicant: ApplicantRow, newStage: ApplicantStage) {
    const result = await updateApplicantStage(applicant.id, newStage)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getApplicants()
      setApplicants(fresh)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteApplicant(deleteTarget.id)
    setDeleteTarget(null)
    if (!result?.error) {
      startTransition(() => { router.refresh() })
      const fresh = await getApplicants()
      setApplicants(fresh)
    }
  }

  async function handleSubmit() {
    setError(null)
    if (!form.recruitment_id || !form.full_name) {
      setError("Lowongan dan nama pelamar wajib diisi")
      return
    }

    const payload = {
      recruitment_id: form.recruitment_id,
      full_name: form.full_name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      source: form.source,
      is_talent_pool: form.is_talent_pool,
      notes: form.notes || undefined,
    }

    const result = await createApplicant(payload)
    if (result?.error) {
      setError(result.error)
      return
    }

    setDialogOpen(false)
    setForm(emptyForm)
    startTransition(() => { router.refresh() })
    const fresh = await getApplicants()
    setApplicants(fresh)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Pipeline Rekrutmen</h3>
        <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={() => { setForm(emptyForm); setError(null); setDialogOpen(true) }}>
          <Plus className="mr-1 h-4 w-4" /> Tambah Pelamar
        </Button>
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => (
          <div key={stage.key} className="min-w-[240px] flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={stage.variant}>{stage.label}</Badge>
              <span className="text-xs text-zinc-400">{stage.applicants.length}</span>
            </div>
            <div className="space-y-2">
              {stage.applicants.length === 0 && (
                <div className="rounded-lg border border-dashed border-zinc-200 p-4 text-center text-xs text-zinc-400">
                  Belum ada pelamar
                </div>
              )}
              {stage.applicants.map((applicant) => {
                const nextStage = getNextStage(applicant.stage)
                return (
                  <Card key={applicant.id} className="border-zinc-200 shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium text-sm text-zinc-900">{applicant.full_name}</p>
                          <p className="text-xs text-zinc-500">{applicant.recruitment?.title ?? getRecruitmentTitle(applicant.recruitment_id)}</p>
                          {applicant.source && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                              {sourceLabels[applicant.source] ?? applicant.source}
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {nextStage && (
                              <DropdownMenuItem onClick={() => handleMoveStage(applicant, nextStage)}>
                                <ArrowRight className="mr-2 h-4 w-4" /> Pindah ke {stages.find((s) => s.key === nextStage)?.label}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive" onClick={() => handleMoveStage(applicant, "ditolak")}>
                              <X className="mr-2 h-4 w-4" /> Tolak
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(applicant)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        {/* Ditolak Column */}
        {ditolakApplicants.length > 0 && (
          <div className="min-w-[240px] flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="destructive">Ditolak</Badge>
              <span className="text-xs text-zinc-400">{ditolakApplicants.length}</span>
            </div>
            <div className="space-y-2">
              {ditolakApplicants.map((applicant) => (
                <Card key={applicant.id} className="border-zinc-200 shadow-sm opacity-70">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-sm text-zinc-900 line-through">{applicant.full_name}</p>
                        <p className="text-xs text-zinc-500">{applicant.recruitment?.title ?? "—"}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(applicant)}>
                            <X className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tambah Pelamar Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Pelamar</DialogTitle>
            <DialogDescription>Tambahkan pelamar baru ke pipeline rekrutmen</DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Lowongan *</Label>
              <Select value={form.recruitment_id} onValueChange={(v) => v && setForm({ ...form, recruitment_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih lowongan" /></SelectTrigger>
                <SelectContent>
                  {recruitments.filter((r) => r.status === "buka").map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap *</Label>
              <Input id="full_name" placeholder="Nama pelamar" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@contoh.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" placeholder="+62..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sumber</Label>
              <Select value={form.source} onValueChange={(v) => v && setForm({ ...form, source: v as ApplicantSource })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="job_board">Job Board</SelectItem>
                  <SelectItem value="walk_in">Walk-in</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
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
              Tambah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pelamar?</AlertDialogTitle>
            <AlertDialogDescription>
              Data pelamar &quot;{deleteTarget?.full_name}&quot; akan dihapus. Tindakan ini tidak dapat dibatalkan.
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