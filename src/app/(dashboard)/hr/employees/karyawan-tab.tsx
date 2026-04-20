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
import { Plus, MoreHorizontal, Pencil, Trash2, Users, UserCheck, UserX, Loader2 } from "lucide-react"
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  type EmployeeWithRelations,
} from "./employee-actions"

const statusLabels: Record<string, string> = {
  aktif: "Aktif",
  resign: "Resign",
  phk: "PHK",
  pensiun: "Pensiun",
  cuti_panjang: "Cuti Panjang",
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  aktif: "default",
  resign: "secondary",
  phk: "destructive",
  pensiun: "secondary",
  cuti_panjang: "outline",
}

// ── Column definitions ──
const columns: ColumnDef<EmployeeWithRelations>[] = [
  {
    accessorKey: "nik",
    header: "NIK",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">{row.getValue("nik")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => (
      <span className="font-medium text-zinc-900">{row.getValue("name")}</span>
    ),
  },
  {
    id: "department",
    header: "Departemen",
    cell: ({ row }) => (
      <span className="text-zinc-600">{row.original.department?.name ?? "-"}</span>
    ),
  },
  {
    id: "position",
    header: "Jabatan",
    cell: ({ row }) => (
      <span className="text-zinc-600">{row.original.position?.name ?? "-"}</span>
    ),
  },
  {
    accessorKey: "employment_status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.getValue("employment_status") as string
      return (
        <Badge variant={statusVariants[s] ?? "secondary"}>
          {statusLabels[s] ?? s}
        </Badge>
      )
    },
  },
  {
    accessorKey: "hire_date",
    header: "Tgl Masuk",
    cell: ({ row }) => {
      const d = row.getValue("hire_date") as string
      return <span className="text-zinc-500 text-xs">{d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</span>
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const emp = row.original
      const meta = table.options.meta as { onEdit: (e: EmployeeWithRelations) => void; onDelete: (e: EmployeeWithRelations) => void } | undefined
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onEdit(emp)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => meta?.onDelete(emp)}>
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const emptyForm = {
  nik: "",
  name: "",
  entity_id: "",
  branch_id: "",
  department_id: "",
  position_id: "",
  grade_id: "",
  work_shift_id: "",
  email: "",
  phone: "",
  birth_date: "",
  gender: "",
  religion: "",
  marital_status: "",
  education_level: "",
  npwp: "",
  address: "",
  bank_name: "",
  bank_account: "",
  bank_account_name: "",
  hire_date: "",
  employment_status: "aktif",
  ptkp_status: "TK/0",
  base_salary: 0,
}

interface KaryawanTabContentProps {
  initialEmployees: EmployeeWithRelations[]
}

export function KaryawanTabContent({ initialEmployees }: KaryawanTabContentProps) {
  const router = useRouter()
  const [employees, setEmployees] = useState<EmployeeWithRelations[]>(initialEmployees)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<EmployeeWithRelations | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<EmployeeWithRelations | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // Stats
  const activeCount = employees.filter((e) => e.employment_status === "aktif").length
  const inactiveCount = employees.filter((e) => e.employment_status !== "aktif").length

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(emp: EmployeeWithRelations) {
    setEditing(emp)
    setForm({
      nik: emp.nik,
      name: emp.name,
      entity_id: emp.entity_id ?? "",
      branch_id: emp.branch_id ?? "",
      department_id: emp.department_id ?? "",
      position_id: emp.position_id ?? "",
      grade_id: emp.grade_id ?? "",
      work_shift_id: emp.work_shift_id ?? "",
      email: emp.email ?? "",
      phone: emp.phone ?? "",
      birth_date: emp.birth_date ?? "",
      gender: emp.gender ?? "",
      religion: emp.religion ?? "",
      marital_status: emp.marital_status ?? "",
      education_level: emp.education_level ?? "",
      npwp: emp.npwp ?? "",
      address: emp.address ?? "",
      bank_name: emp.bank_name ?? "",
      bank_account: emp.bank_account ?? "",
      bank_account_name: emp.bank_account_name ?? "",
      hire_date: emp.hire_date,
      employment_status: emp.employment_status,
      ptkp_status: emp.ptkp_status,
      base_salary: emp.base_salary,
    })
    setError(null)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    setError(null)

    if (!form.nik || !form.name || !form.hire_date) {
      setError("NIK, nama, dan tanggal masuk wajib diisi")
      return
    }

    const payload = {
      nik: form.nik,
      name: form.name,
      entity_id: form.entity_id || null,
      branch_id: form.branch_id || null,
      department_id: form.department_id || null,
      position_id: form.position_id || null,
      grade_id: form.grade_id || null,
      work_shift_id: form.work_shift_id || null,
      email: form.email || null,
      phone: form.phone || null,
      birth_date: form.birth_date || null,
      gender: form.gender || null,
      religion: form.religion || null,
      marital_status: form.marital_status || null,
      education_level: form.education_level || null,
      npwp: form.npwp || null,
      address: form.address || null,
      bank_name: form.bank_name || null,
      bank_account: form.bank_account || null,
      bank_account_name: form.bank_account_name || null,
      hire_date: form.hire_date,
      employment_status: form.employment_status || undefined,
      ptkp_status: form.ptkp_status || undefined,
      base_salary: form.base_salary || undefined,
    }

    const result = editing
      ? await updateEmployee(editing.id, payload)
      : await createEmployee(payload)

    if (result?.error) {
      setError(result.error)
      return
    }

    setDialogOpen(false)
    startTransition(() => {
      router.refresh()
    })
    // Refresh data
    const fresh = await getEmployees()
    setEmployees(fresh)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteEmployee(deleteTarget.id)
    setDeleteTarget(null)
    if (!result?.error) {
      startTransition(() => {
        router.refresh()
      })
      const fresh = await getEmployees()
      setEmployees(fresh)
    }
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
              <Users className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{employees.length}</p>
              <p className="text-xs text-zinc-500">Total Karyawan</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{activeCount}</p>
              <p className="text-xs text-zinc-500">Aktif</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
              <UserX className="h-5 w-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900">{inactiveCount}</p>
              <p className="text-xs text-zinc-500">Nonaktif</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Data Karyawan</CardTitle>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-700" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Karyawan
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={employees}
            searchPlaceholder="Cari karyawan..."
            emptyTitle="Belum ada data karyawan"
            emptyDescription="Tambahkan karyawan pertama untuk memulai."
            meta={{ onEdit: openEdit, onDelete: (e: EmployeeWithRelations) => setDeleteTarget(e) }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Karyawan" : "Tambah Karyawan"}</DialogTitle>
            <DialogDescription>
              {editing ? "Perbarui data karyawan" : "Tambahkan karyawan baru"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-4">
            {/* Row 1: NIK & Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nik">NIK *</Label>
                <Input id="nik" placeholder="WS-2026-001" value={form.nik} onChange={(e) => setForm({ ...form, nik: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input id="name" placeholder="Nama karyawan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>

            {/* Row 2: Entity/Company, Branch */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entity_id">Entitas / Perusahaan</Label>
                <Input id="entity_id" placeholder="ID Entitas" value={form.entity_id} onChange={(e) => setForm({ ...form, entity_id: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch_id">Cabang</Label>
                <Input id="branch_id" placeholder="ID Cabang" value={form.branch_id} onChange={(e) => setForm({ ...form, branch_id: e.target.value })} />
              </div>
            </div>

            {/* Row 3: Department, Position */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department_id">Departemen</Label>
                <Input id="department_id" placeholder="ID Departemen" value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position_id">Jabatan</Label>
                <Input id="position_id" placeholder="ID Jabatan" value={form.position_id} onChange={(e) => setForm({ ...form, position_id: e.target.value })} />
              </div>
            </div>

            {/* Row 4: Grade, Work Shift */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade_id">Grade</Label>
                <Input id="grade_id" placeholder="ID Grade" value={form.grade_id} onChange={(e) => setForm({ ...form, grade_id: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work_shift_id">Shift Kerja</Label>
                <Input id="work_shift_id" placeholder="ID Shift" value={form.work_shift_id} onChange={(e) => setForm({ ...form, work_shift_id: e.target.value })} />
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-zinc-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-3">Informasi Pribadi</p>
            </div>

            {/* Row 5: Email, Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@perusahaan.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" placeholder="08123456789" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            {/* Row 6: Birth date, Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birth_date">Tanggal Lahir</Label>
                <Input id="birth_date" type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Jenis Kelamin</Label>
                <Select value={form.gender} onValueChange={(v) => v && setForm({ ...form, gender: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 7: Religion, Marital Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Agama</Label>
                <Select value={form.religion} onValueChange={(v) => v && setForm({ ...form, religion: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Islam">Islam</SelectItem>
                    <SelectItem value="Kristen">Kristen</SelectItem>
                    <SelectItem value="Katolik">Katolik</SelectItem>
                    <SelectItem value="Hindu">Hindu</SelectItem>
                    <SelectItem value="Buddha">Buddha</SelectItem>
                    <SelectItem value="Konghucu">Konghucu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status Pernikahan</Label>
                <Select value={form.marital_status} onValueChange={(v) => v && setForm({ ...form, marital_status: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Belum Kawin">Belum Kawin</SelectItem>
                    <SelectItem value="Kawin">Kawin</SelectItem>
                    <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                    <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 8: Education, NPWP */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pendidikan</Label>
                <Select value={form.education_level} onValueChange={(v) => v && setForm({ ...form, education_level: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SD">SD</SelectItem>
                    <SelectItem value="SMP">SMP</SelectItem>
                    <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                    <SelectItem value="D3">D3</SelectItem>
                    <SelectItem value="S1">S1</SelectItem>
                    <SelectItem value="S2">S2</SelectItem>
                    <SelectItem value="S3">S3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="npwp">NPWP</Label>
                <Input id="npwp" placeholder="NPWP" value={form.npwp} onChange={(e) => setForm({ ...form, npwp: e.target.value })} />
              </div>
            </div>

            {/* Row 9: Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input id="address" placeholder="Alamat lengkap" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>

            {/* Separator */}
            <div className="border-t border-zinc-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-3">Kepegawaian</p>
            </div>

            {/* Row 10: Hire date, Employment status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hire_date">Tanggal Masuk *</Label>
                <Input id="hire_date" type="date" value={form.hire_date} onChange={(e) => setForm({ ...form, hire_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status Kepegawaian</Label>
                <Select value={form.employment_status} onValueChange={(v) => v && setForm({ ...form, employment_status: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="resign">Resign</SelectItem>
                    <SelectItem value="phk">PHK</SelectItem>
                    <SelectItem value="pensiun">Pensiun</SelectItem>
                    <SelectItem value="cuti_panjang">Cuti Panjang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 11: PTKP, Base Salary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status PTKP</Label>
                <Select value={form.ptkp_status} onValueChange={(v) => v && setForm({ ...form, ptkp_status: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TK/0">TK/0</SelectItem>
                    <SelectItem value="K/0">K/0</SelectItem>
                    <SelectItem value="K/1">K/1</SelectItem>
                    <SelectItem value="K/2">K/2</SelectItem>
                    <SelectItem value="K/3">K/3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_salary">Gaji Pokok</Label>
                <Input id="base_salary" type="number" placeholder="0" value={form.base_salary || ""} onChange={(e) => setForm({ ...form, base_salary: Number(e.target.value) })} />
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-zinc-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-3">Bank</p>
            </div>

            {/* Row 12: Bank */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank_name">Nama Bank</Label>
                <Input id="bank_name" placeholder="BCA" value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank_account">No. Rekening</Label>
                <Input id="bank_account" placeholder="1234567890" value={form.bank_account} onChange={(e) => setForm({ ...form, bank_account: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank_account_name">Nama di Rekening</Label>
                <Input id="bank_account_name" placeholder="Nama sesuai rekening" value={form.bank_account_name} onChange={(e) => setForm({ ...form, bank_account_name: e.target.value })} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-700" disabled={pending} onClick={handleSubmit}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Simpan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Karyawan?</AlertDialogTitle>
            <AlertDialogDescription>
              Data karyawan &quot;{deleteTarget?.name}&quot; akan dihapus. Tindakan ini tidak dapat dibatalkan.
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