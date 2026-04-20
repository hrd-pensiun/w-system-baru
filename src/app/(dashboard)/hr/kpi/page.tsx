import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KpiTabContent, DetailTabContent, RingkasanTabContent } from './kpi-tab'
import { getKpiIndicators, getKpiPeriods, getEmployees } from './actions'

export const metadata: Metadata = {
  title: 'KPI Karyawan · W System',
  description: 'Kelola Key Performance Indicator dan pantau pencapaian karyawan',
}

export default async function KpiPage() {
  const [indicators, periods, employees] = await Promise.all([
    getKpiIndicators(),
    getKpiPeriods(),
    getEmployees(),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="KPI Karyawan"
        description="Kelola Key Performance Indicator dan pantau pencapaian karyawan"
      />

      <Tabs defaultValue="daftar" className="w-full">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="daftar">Daftar KPI</TabsTrigger>
          <TabsTrigger value="detail">Detail Karyawan</TabsTrigger>
          <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
        </TabsList>

        <TabsContent value="daftar" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data KPI...</CardContent></Card>}>
            <KpiTabContent initialData={indicators} periods={periods} employees={employees} />
          </Suspense>
        </TabsContent>

        <TabsContent value="detail" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat detail KPI...</CardContent></Card>}>
            <DetailTabContent initialData={indicators} employees={employees} />
          </Suspense>
        </TabsContent>

        <TabsContent value="ringkasan" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat ringkasan...</CardContent></Card>}>
            <RingkasanTabContent initialData={indicators} employees={employees} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}