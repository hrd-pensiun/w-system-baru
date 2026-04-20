import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LowonganTabContent } from './lowongan-tab'
import { PipelineTabContent } from './pipeline-tab'
import { TalentPoolTabContent } from './talent-pool-tab'
import { getRecruitments, getApplicants } from './actions'

export const metadata: Metadata = {
  title: 'Rekrutmen · W System',
  description: 'Kelola lowongan kerja, talent pool, dan proses rekrutmen',
}

export default async function RekrutmenPage() {
  const [recruitments, applicants] = await Promise.all([
    getRecruitments(),
    getApplicants(),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rekrutmen"
        description="Kelola lowongan kerja, talent pool, dan proses rekrutmen"
      />

      <Tabs defaultValue="lowongan" className="w-full">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="lowongan">Lowongan</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="talent">Talent Pool</TabsTrigger>
        </TabsList>

        <TabsContent value="lowongan" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data lowongan...</CardContent></Card>}>
            <LowonganTabContent initialRecruitments={recruitments} />
          </Suspense>
        </TabsContent>

        <TabsContent value="pipeline" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat pipeline...</CardContent></Card>}>
            <PipelineTabContent initialApplicants={applicants} recruitments={recruitments} />
          </Suspense>
        </TabsContent>

        <TabsContent value="talent" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat talent pool...</CardContent></Card>}>
            <TalentPoolTabContent initialApplicants={applicants} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}