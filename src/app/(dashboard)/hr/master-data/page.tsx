import { Suspense } from "react"
import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShiftTabContent } from "./work-shifts/shift-tab"
import { CalendarTabContent } from "./work-calendars/calendar-tab"
import { UmrTabContent } from "./city-umr/umr-tab"

export const metadata: Metadata = {
  title: "Master Data HR · W System",
  description: "Kelola shift kerja, kalender kerja, dan UMR kota",
}

export default function MasterDataPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Data HR"
        description="Kelola shift kerja, kalender kerja, dan UMR kota"
      />

      <Tabs defaultValue="shifts" className="w-full">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="shifts">Shift Kerja</TabsTrigger>
          <TabsTrigger value="calendars">Kalender Kerja</TabsTrigger>
          <TabsTrigger value="umr">UMR / UMK</TabsTrigger>
        </TabsList>

        <TabsContent value="shifts" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data shift...</CardContent></Card>}>
            <ShiftTabContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="calendars" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data kalender...</CardContent></Card>}>
            <CalendarTabContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="umr" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data UMR...</CardContent></Card>}>
            <UmrTabContent />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
