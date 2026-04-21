import { Suspense } from "react"
import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { PeriodTab } from "./period-tab"
import { SlipTab } from "./slip-tab"
import { ThrTab } from "./thr-tab"
import { getPayrollPeriods } from "./actions"

export const metadata: Metadata = {
  title: "Payroll · W System",
  description: "Kelola periode payroll, slip gaji, dan THR",
}

export default async function PayrollPage() {
  const periods = await getPayrollPeriods()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll & THR"
        description="Kelola periode payroll, slip gaji, dan THR"
      />

      <Tabs defaultValue="periode" className="w-full">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="periode">Periode Payroll</TabsTrigger>
          <TabsTrigger value="slip">Slip Gaji</TabsTrigger>
          <TabsTrigger value="thr">THR</TabsTrigger>
        </TabsList>

        <TabsContent value="periode" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data periode...</CardContent></Card>}>
            <PeriodTab initialData={periods} />
          </Suspense>
        </TabsContent>

        <TabsContent value="slip" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data slip...</CardContent></Card>}>
            <SlipTab periods={periods} />
          </Suspense>
        </TabsContent>

        <TabsContent value="thr" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data THR...</CardContent></Card>}>
            <ThrTab periods={periods} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}