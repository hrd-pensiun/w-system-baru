import { Suspense } from "react"
import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { LeaveTabContent } from "./leave-tab"
import { OvertimeTabContent } from "./overtime-tab"
import { getLeaves } from "./leave-actions"
import { getOvertimes } from "./overtime-actions"
import { getEmployees, type EmployeeWithRelations } from "../employees/employee-actions"

export const metadata: Metadata = {
  title: "Cuti & Lembur · W System",
  description: "Kelola pengajuan cuti dan lembur karyawan",
}

export default async function LeaveOvertimePage() {
  const [leaves, overtimes, employees] = await Promise.all([
    getLeaves(),
    getOvertimes(),
    getEmployees(),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cuti & Lembur"
        description="Kelola pengajuan cuti dan lembur karyawan"
      />

      <Tabs defaultValue="cuti" className="w-full">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="cuti">Cuti</TabsTrigger>
          <TabsTrigger value="lembur">Lembur</TabsTrigger>
        </TabsList>

        <TabsContent value="cuti" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data cuti...</CardContent></Card>}>
            <LeaveTabContent initialLeaves={leaves} employees={employees} />
          </Suspense>
        </TabsContent>

        <TabsContent value="lembur" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data lembur...</CardContent></Card>}>
            <OvertimeTabContent initialOvertimes={overtimes} employees={employees} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}