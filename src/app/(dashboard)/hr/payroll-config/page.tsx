import { Suspense } from "react"
import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { BpjsTabContent } from "./bpjs/bpjs-tab"
import { Pph21TabContent } from "./pph21/pph21-tab"
import { TerTabContent } from "./ter/ter-tab"

export const metadata: Metadata = {
  title: "Payroll Config · W System",
  description: "Konfigurasi BPJS, PPh21, dan TER",
}

export default function PayrollConfigPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Konfigurasi Payroll"
        description="Kelola konfigurasi BPJS, PPh21, dan TER"
      />

      <Tabs defaultValue="bpjs" className="w-full">
        <TabsList className="bg-zinc-100">
          <TabsTrigger value="bpjs">BPJS</TabsTrigger>
          <TabsTrigger value="pph21">PPh21</TabsTrigger>
          <TabsTrigger value="ter">TER</TabsTrigger>
        </TabsList>

        <TabsContent value="bpjs" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data BPJS...</CardContent></Card>}>
            <BpjsTabContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="pph21" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data PPh21...</CardContent></Card>}>
            <Pph21TabContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="ter" className="mt-4">
          <Suspense fallback={<Card><CardContent className="p-12 text-center text-zinc-400">Memuat data TER...</CardContent></Card>}>
            <TerTabContent />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
