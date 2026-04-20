import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrainingTabContent } from './training-tab'
import { ELearningTabContent } from './elearning-tab'
import { RiwayatTabContent } from './riwayat-tab'
import {
  getTrainingPrograms,
  getTrainingParticipants,
  getELearningCourses,
  getELearningEnrollments,
  getEmployees,
} from './actions'

export const metadata: Metadata = {
  title: 'Training & E-Learning · W System',
  description: 'Kelola program training, e-learning, dan riwayat pelatihan karyawan',
}

export default async function TrainingPage() {
  const [programs, participants, courses, enrollments, employees] = await Promise.all([
    getTrainingPrograms(),
    getTrainingParticipants(),
    getELearningCourses(),
    getELearningEnrollments(),
    getEmployees(),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training & E-Learning"
        description="Kelola program training, e-learning, dan riwayat pelatihan karyawan"
      />

      <Tabs defaultValue="training" className="w-full">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="training">Program Training</TabsTrigger>
          <TabsTrigger value="elearning">E-Learning</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Training</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data training...</CardContent></Card>}>
            <TrainingTabContent initialPrograms={programs} initialParticipants={participants} employees={employees} />
          </Suspense>
        </TabsContent>

        <TabsContent value="elearning" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data e-learning...</CardContent></Card>}>
            <ELearningTabContent initialCourses={courses} initialEnrollments={enrollments} employees={employees} />
          </Suspense>
        </TabsContent>

        <TabsContent value="riwayat" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat riwayat training...</CardContent></Card>}>
            <RiwayatTabContent initialParticipants={participants} initialPrograms={programs} employees={employees} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}