import { Suspense } from "react"
import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { KaryawanTabContent } from "./karyawan-tab"
import { ContractTabContent } from "./contract-tab"
import { getEmployees } from "./employee-actions"
import { getContracts } from "./contract-actions"

export const metadata: Metadata = {
  title: "Karyawan · W System",
  description: "Kelola data karyawan dan kontrak",
}

export default async function KaryawanPage() {
  const employees = await getEmployees()
  const contracts = await getContracts()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Karyawan"
        description="Kelola data karyawan, kontrak, dan status kepegawaian"
      />

      <Tabs defaultValue="karyawan" className="w-full">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="karyawan">Data Karyawan</TabsTrigger>
          <TabsTrigger value="kontrak">Kontrak</TabsTrigger>
        </TabsList>

        <TabsContent value="karyawan" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data karyawan...</CardContent></Card>}>
            <KaryawanTabContent initialEmployees={employees} />
          </Suspense>
        </TabsContent>

        <TabsContent value="kontrak" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data kontrak...</CardContent></Card>}>
            <ContractTabContent initialContracts={contracts} employees={employees} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}