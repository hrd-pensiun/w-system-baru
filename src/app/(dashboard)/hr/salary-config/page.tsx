import { Suspense } from "react"
import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ComponentTabContent } from "./components/component-tab"
import { MatrixTabContent } from "./matrix/matrix-tab"
import { OvertimeTabContent } from "./overtime/overtime-tab"

export const metadata: Metadata = {
  title: "Konfigurasi Gaji · W System",
  description: "Kelola komponen gaji, salary matrix, dan aturan lembur",
}

export default function SalaryConfigPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Konfigurasi Gaji"
        description="Kelola komponen gaji, salary matrix, dan aturan lembur"
      />

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="components">Komponen Gaji</TabsTrigger>
          <TabsTrigger value="matrix">Salary Matrix</TabsTrigger>
          <TabsTrigger value="overtime">Aturan Lembur</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat komponen gaji...</CardContent></Card>}>
            <ComponentTabContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="matrix" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat salary matrix...</CardContent></Card>}>
            <MatrixTabContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="overtime" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat aturan lembur...</CardContent></Card>}>
            <OvertimeTabContent />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
