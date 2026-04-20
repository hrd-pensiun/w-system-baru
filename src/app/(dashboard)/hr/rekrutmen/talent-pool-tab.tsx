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
import { Plus, Star, Loader2 } from "lucide-react"
import {
  type ApplicantRow,
  type ApplicantSource,
  createApplicant,
  getApplicants,
} from "./actions"

const stageVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  melamar: "secondary",
  screening: "outline",
  interview: "default",
  assessment: "outline",
  offering: "default",
  dihiring: "default",
  ditolak: "destructive",
}

const stageLabels: Record<string, string> = {
  melamar: "Melamar",
  screening: "Screening",
  interview: "Interview",
  assessment: "Assessment",
  offering: "Offering",
  dihiring: "Dihiring",
  ditolak: "Ditolak",
}

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
  notes: "",
}

interface TalentPoolTabContentProps {
  initialApplicants: ApplicantRow[]
}

export function TalentPoolTabContent({ initialApplicants }: TalentPoolTabContentProps) {
  const router = useRouter()
  const [applicants, setApplicants] = useState<ApplicantRow[]>(initialApplicants)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedTalent, setSelectedTalent] = useState<ApplicantRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const talents = applicants.filter((a) => a.is_talent_pool)

  function getInitials(name: string): string {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  function openDetail(talent: ApplicantRow) {
    setSelectedTalent(talent)
    setDetailOpen(true)
  }

  async function handleSubmit() {
    setError(null)
    if (!form.full_name) {
      setError("Nama talent wajib diisi")
      return
    }

    const payload = {
      recruitment_id: form.recruitment_id || "00000000-0000-0000-0000-000000000000",
      full_name: form.full_name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      source: form.source,
      is_talent_pool: true,
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
        <h3 className="text-lg font-semibold">Talent Pool</h3>
        <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={() => { setForm(emptyForm); setError(null); setDialogOpen(true) }}>
          <Plus className="mr-1 h-4 w-4" /> Tambah Talent
        </Button>
      </div>

      {talents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-zinc-400">
            Belum ada talent di talent pool. Tambahkan talent pertama.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {talents.map((talent) => (
            <Card
              key={talent.id}
              className="cursor-pointer border-zinc-200 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all"
              onClick={() => openDetail(talent)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">
                    {getInitials(talent.full_name)}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-medium text-sm text-zinc-900 truncate">{talent.full_name}</p>
                    {talent.current_position && (
                      <p className="text-xs text-zinc-600 truncate">{talent.current_position}</p>
                    )}
                    {talent.current_company && (
                      <p className="text-xs text-zinc-400 truncate">{talent.current_company}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {talent.source && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                      {sourceLabels[talent.source] ?? talent.source}
                    </Badge>
                  )}
                  <Badge variant={stageVariantMap[talent.stage] ?? "secondary"} className="text-[10px] px-1 py-0">
                    {stageLabels[talent.stage] ?? talent.stage}
                  </Badge>
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={(e) => { e.stopPropagation(); openDetail(talent) }}>
                    Lihat Profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tambah Talent Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Talent</DialogTitle>
            <DialogDescription>Tambahkan talent baru ke talent pool</DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap *</Label>
              <Input id="full_name" placeholder="Nama talent" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
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

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profil Talent</DialogTitle>
            <DialogDescription>Detail informasi talent</DialogDescription>
          </DialogHeader>

          {selectedTalent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-base font-semibold text-zinc-700">
                  {getInitials(selectedTalent.full_name)}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">{selectedTalent.full_name}</p>
                  <Badge variant={stageVariantMap[selectedTalent.stage] ?? "secondary"} className="mt-1">
                    {stageLabels[selectedTalent.stage] ?? selectedTalent.stage}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {selectedTalent.email && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Email</span>
                    <span className="text-zinc-900">{selectedTalent.email}</span>
                  </div>
                )}
                {selectedTalent.phone && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Telepon</span>
                    <span className="text-zinc-900">{selectedTalent.phone}</span>
                  </div>
                )}
                {selectedTalent.current_position && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Posisi Saat Ini</span>
                    <span className="text-zinc-900">{selectedTalent.current_position}</span>
                  </div>
                )}
                {selectedTalent.current_company && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Perusahaan</span>
                    <span className="text-zinc-900">{selectedTalent.current_company}</span>
                  </div>
                )}
                {selectedTalent.source && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Sumber</span>
                    <span className="text-zinc-900">{sourceLabels[selectedTalent.source] ?? selectedTalent.source}</span>
                  </div>
                )}
                {selectedTalent.recruitment?.title && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Lowongan</span>
                    <span className="text-zinc-900">{selectedTalent.recruitment.title}</span>
                  </div>
                )}
                {selectedTalent.applied_at && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Tanggal Melamar</span>
                    <span className="text-zinc-900">
                      {new Date(selectedTalent.applied_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-sm text-zinc-500">Rating</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= (selectedTalent.rating ?? 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {selectedTalent.notes && (
                <div className="space-y-2">
                  <span className="text-sm text-zinc-500">Catatan</span>
                  <p className="text-sm text-zinc-700 rounded-md bg-zinc-50 p-3">{selectedTalent.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}