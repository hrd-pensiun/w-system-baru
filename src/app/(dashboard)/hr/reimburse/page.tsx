import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReimburseTabContent } from './reimburse-tab'
import { PerdinTabContent } from './perdin-tab'
import { getReimbursements, getBusinessTrips, getEmployees } from './actions'

export const metadata: Metadata = {
  title: 'Reimburse & Perdin · W System',
  description: 'Kelola pengajuan reimburse dan perjalanan dinas',
}

export default async function ReimbursePage() {
  const [reimbursements, businessTrips, employees] = await Promise.all([
    getReimbursements(),
    getBusinessTrips(),
    getEmployees(),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reimburse & Perdin"
        description="Kelola pengajuan reimburse dan perjalanan dinas"
      />

      <Tabs defaultValue="reimburse" className="w-full">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="reimburse">Reimburse</TabsTrigger>
          <TabsTrigger value="perdin">Perjalanan Dinas</TabsTrigger>
        </TabsList>

        <TabsContent value="reimburse" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data reimburse...</CardContent></Card>}>
            <ReimburseTabContent initialData={reimbursements} employees={employees} />
          </Suspense>
        </TabsContent>

        <TabsContent value="perdin" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data perjalanan dinas...</CardContent></Card>}>
            <PerdinTabContent initialData={businessTrips} employees={employees} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}