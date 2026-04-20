'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Clock, BookOpen, Monitor, PlayCircle, CheckCircle2, Plus } from 'lucide-react'
import {
  createELearningCourse,
  enrollEmployee,
  type ELearningCourseRow,
  type ELearningEnrollmentRow,
  type EmployeeOption,
} from './actions'

const categoryMap: Record<string, { label: string; color: string }> = {
  teknis: { label: 'Teknis', color: 'bg-blue-100 text-blue-700' },
  soft_skill: { label: 'Soft Skill', color: 'bg-purple-100 text-purple-700' },
  compliance: { label: 'Compliance', color: 'bg-amber-100 text-amber-700' },
  leadership: { label: 'Leadership', color: 'bg-emerald-100 text-emerald-700' },
}

const courseStatusMap: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' }> = {
  baru: { label: 'Baru', variant: 'outline' },
  sedang: { label: 'Sedang Dipelajari', variant: 'default' },
  selesai: { label: 'Selesai', variant: 'secondary' },
}

export function ELearningTabContent({
  initialCourses,
  initialEnrollments,
  employees,
}: {
  initialCourses: ELearningCourseRow[]
  initialEnrollments: ELearningEnrollmentRow[]
  employees: EmployeeOption[]
}) {
  const [courses, setCourses] = useState(initialCourses)
  const [enrollments, setEnrollments] = useState(initialEnrollments)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [pending, startTransition] = useTransition()

  // Create form
  const [form, setForm] = useState({ title: '', description: '', category: 'teknis', duration_hours: '', module_count: '' })
  const handleCreate = () => {
    startTransition(async () => {
      const res = await createELearningCourse({
        title: form.title,
        description: form.description || undefined,
        category: form.category as 'teknis' | 'soft_skill' | 'compliance' | 'leadership',
        duration_hours: Number(form.duration_hours),
        module_count: Number(form.module_count),
      })
      if (res?.error) { alert(res.error); return }
      setDialogOpen(false)
      window.location.reload()
    })
  }

  // Enroll form
  const [enrollForm, setEnrollForm] = useState({ course_id: '', employee_id: '' })
  const handleEnroll = () => {
    startTransition(async () => {
      const res = await enrollEmployee({ course_id: enrollForm.course_id, employee_id: enrollForm.employee_id })
      if (res?.error) { alert(res.error); return }
      setEnrollDialogOpen(false)
      window.location.reload()
    })
  }

  // Get enrollment for a course
  const getCompletion = (courseId: string, empId?: string) => {
    const enr = enrollments.find((e) => e.course_id === courseId && (!empId || e.employee_id === empId))
    return enr?.completion_pct ?? 0
  }

  const getStatus = (courseId: string, empId?: string) => {
    const enr = enrollments.find((e) => e.course_id === courseId && (!empId || e.employee_id === empId))
    return enr?.status ?? 'baru'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-zinc-900">E-Learning Courses</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEnrollDialogOpen(true)}>
            <Plus className="mr-1 h-3 w-3" /> Enroll Karyawan
          </Button>
          <Button className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-1 h-3 w-3" /> Buat Course
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => {
          const cat = categoryMap[c.category] ?? categoryMap.teknis
          const completion = getCompletion(c.id)
          const status = getStatus(c.id)
          const st = courseStatusMap[status] ?? courseStatusMap.baru

          return (
            <Card key={c.id} className="rounded-xl border border-zinc-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.color}`}>
                    {cat.label}
                  </span>
                  <Badge variant={st.variant}>{st.label}</Badge>
                </div>
                <h4 className="mt-3 font-medium text-zinc-900">{c.title}</h4>
                {c.description && <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{c.description}</p>}
                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />{c.duration_hours} jam
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Monitor className="h-3 w-3" />{c.module_count} modul
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Progres</span>
                    <span className={`font-medium ${completion === 100 ? 'text-emerald-600' : completion === 0 ? 'text-zinc-400' : 'text-blue-600'}`}>
                      {completion}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className={`h-full rounded-full transition-all ${completion === 100 ? 'bg-emerald-500' : completion === 0 ? 'bg-zinc-200' : 'bg-blue-500'}`}
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    {status === 'baru' ? 'Mulai Belajar' : status === 'selesai' ? 'Review Materi' : 'Lanjutkan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {courses.length === 0 && (
          <div className="col-span-3 py-12 text-center text-zinc-400">Belum ada course e-learning</div>
        )}
      </div>

      {/* Create Course Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Course E-Learning Baru</DialogTitle>
            <DialogDescription>Tambahkan modul pembelajaran daring</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Judul</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Dasar-Dasar Cybersecurity" /></div>
            <div><Label>Deskripsi</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Opsional..." /></div>
            <div>
              <Label>Kategori</Label>
              <Select value={form.category} onValueChange={(v) => v && setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="teknis">Teknis</SelectItem>
                  <SelectItem value="soft_skill">Soft Skill</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Durasi (jam)</Label><Input type="number" value={form.duration_hours} onChange={(e) => setForm({ ...form, duration_hours: e.target.value })} placeholder="8" /></div>
              <div><Label>Jumlah Modul</Label><Input type="number" value={form.module_count} onChange={(e) => setForm({ ...form, module_count: e.target.value })} placeholder="12" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={handleCreate} disabled={pending}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enroll Dialog */}
      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll Karyawan</DialogTitle>
            <DialogDescription>Daftarkan karyawan ke course e-learning</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Course</Label>
              <Select value={enrollForm.course_id} onValueChange={(v) => v && setEnrollForm({ ...enrollForm, course_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih course" /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (<SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Karyawan</Label>
              <Select value={enrollForm.employee_id} onValueChange={(v) => v && setEnrollForm({ ...enrollForm, employee_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih karyawan" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name} ({e.nik})</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>Batal</Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={handleEnroll} disabled={pending}>Enroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}