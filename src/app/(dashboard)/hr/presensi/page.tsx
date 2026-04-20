import { Suspense } from "react"
import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { AttendanceTabContent } from "./attendance-tab"
import { SettingsTabContent } from "./settings-tab"
import { getAttendances, getAttendanceSettings } from "./actions"
import { getEmployees } from "../employees/employee-actions"

export const metadata: Metadata = {
  title: "Presensi · W System",
  description: "Kelola data absensi dan kehadiran karyawan",
}

export default async function PresensiPage() {
  const [attendances, settings, employees] = await Promise.all([
    getAttendances(),
    getAttendanceSettings(),
    getEmployees(),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Presensi"
        description="Kelola data absensi dan kehadiran karyawan"
      />

      <Tabs defaultValue="riwayat" className="w-full">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="riwayat">Riwayat Presensi</TabsTrigger>
          <TabsTrigger value="pengaturan">Pengaturan</TabsTrigger>
        </TabsList>

        <TabsContent value="riwayat" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data presensi...</CardContent></Card>}>
            <AttendanceTabContent initialAttendances={attendances} employees={employees} />
          </Suspense>
        </TabsContent>

        <TabsContent value="pengaturan" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat pengaturan...</CardContent></Card>}>
            <SettingsTabContent initialSettings={settings} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}