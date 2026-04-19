import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, BarChart3, PieChart, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — CRM Analitik · Phase 2',
  description: 'Preview desain halaman CRM Analitik & Funnel',
}

// ── Mock Data ──
const funnelData = [
  { stage: 'Baru', count: 45, value: 'Rp2.250.000.000', color: 'bg-blue-500' },
  { stage: 'Kontak', count: 32, value: 'Rp1.600.000.000', color: 'bg-indigo-500' },
  { stage: 'Proposal', count: 18, value: 'Rp900.000.000', color: 'bg-violet-500' },
  { stage: 'Negosiasi', count: 10, value: 'Rp500.000.000', color: 'bg-amber-500' },
  { stage: 'Menang', count: 6, value: 'Rp300.000.000', color: 'bg-emerald-500' },
  { stage: 'Kalah', count: 4, value: 'Rp200.000.000', color: 'bg-red-500' },
]

const stageConvRate = [
  { from: 'Baru → Kontak', rate: '71%', trend: 'up' },
  { from: 'Kontak → Proposal', rate: '56%', trend: 'up' },
  { from: 'Proposal → Negosiasi', rate: '56%', trend: 'down' },
  { from: 'Negosiasi → Menang', rate: '60%', trend: 'up' },
]

const pipelineByMonth = [
  { bulan: 'Jan 2025', lead: 12, won: 3, lost: 2, value: 'Rp180.000.000' },
  { bulan: 'Feb 2025', lead: 15, won: 4, lost: 1, value: 'Rp240.000.000' },
  { bulan: 'Mar 2025', lead: 18, won: 5, lost: 3, value: 'Rp300.000.000' },
  { bulan: 'Apr 2025', lead: 10, won: 2, lost: 1, value: 'Rp120.000.000' },
]

const sourceData = [
  { sumber: 'Referral', jumlah: 18, persen: '36%', wonRate: '44%' },
  { sumber: 'Website', jumlah: 12, persen: '24%', wonRate: '25%' },
  { sumber: 'Cold Call', jumlah: 8, persen: '16%', wonRate: '13%' },
  { sumber: 'Event', jumlah: 7, persen: '14%', wonRate: '29%' },
  { sumber: 'Lainnya', jumlah: 5, persen: '10%', wonRate: '20%' },
]

const salesRepData = [
  { nama: 'Andi Wibowo', leads: 15, won: 6, lost: 2, winRate: '40%', pipeline: 'Rp750.000.000' },
  { nama: 'Sari Dewi', leads: 12, won: 4, lost: 3, winRate: '33%', pipeline: 'Rp600.000.000' },
  { nama: 'Budi Hartono', leads: 10, won: 3, lost: 1, winRate: '30%', pipeline: 'Rp500.000.000' },
  { nama: 'Maya Putri', leads: 8, won: 2, lost: 2, winRate: '25%', pipeline: 'Rp400.000.000' },
]

export default function CRMAnalitikPage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 2 — CRM & Sales" />

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Pipeline Value</p>
                <p className="text-xl font-semibold text-zinc-900">Rp5.450.000.000</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Win Rate</p>
                <p className="text-xl font-semibold text-emerald-600">33.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Avg Deal Size</p>
                <p className="text-xl font-semibold text-zinc-900">Rp50.000.000</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Avg Sales Cycle</p>
                <p className="text-xl font-semibold text-zinc-900">28 Hari</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Sales Funnel ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sales Funnel</CardTitle>
          <CardDescription>Visualisasi pipeline dari lead hingga closing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {funnelData.map((stage, i) => {
            const widthPct = (stage.count / funnelData[0].count) * 100
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-700">{stage.stage}</span>
                    <Badge variant="secondary" className="text-xs">{stage.count} leads</Badge>
                  </div>
                  <span className="text-zinc-500">{stage.value}</span>
                </div>
                <div className="h-8 w-full rounded-full bg-zinc-100">
                  <div className={`h-8 rounded-full ${stage.color} flex items-center justify-end pr-3 transition-all`} style={{ width: `${widthPct}%` }}>
                    <span className="text-xs font-medium text-white">{stage.count}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* ── Conversion Rate & Pipeline per Bulan ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Rate per Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stageConvRate.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3">
                  <span className="text-sm text-zinc-700">{s.from}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900">{s.rate}</span>
                    {s.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pipeline per Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="pb-2 font-medium">Bulan</th>
                    <th className="pb-2 font-medium text-center">Lead</th>
                    <th className="pb-2 font-medium text-center">Won</th>
                    <th className="pb-2 font-medium text-center">Lost</th>
                    <th className="pb-2 font-medium text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {pipelineByMonth.map((m, i) => (
                    <tr key={i}>
                      <td className="py-2 font-medium text-zinc-700">{m.bulan}</td>
                      <td className="py-2 text-center">{m.lead}</td>
                      <td className="py-2 text-center text-emerald-600">{m.won}</td>
                      <td className="py-2 text-center text-red-500">{m.lost}</td>
                      <td className="py-2 text-right font-medium">{m.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Lead Source & Sales Rep Performance ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lead by Source</CardTitle>
            <CardDescription>Distribusi sumber lead dan win rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sourceData.map((s, i) => {
                const pct = parseInt(s.persen)
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-zinc-700">{s.sumber}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500">{s.jumlah} lead</span>
                        <Badge variant="outline" className="text-xs">Win: {s.wonRate}</Badge>
                      </div>
                    </div>
                    <div className="h-3 w-full rounded-full bg-zinc-100">
                      <div className="h-3 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performa Sales Rep</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="pb-2 font-medium">Nama</th>
                    <th className="pb-2 font-medium text-center">Leads</th>
                    <th className="pb-2 font-medium text-center">Won</th>
                    <th className="pb-2 font-medium text-center">Win Rate</th>
                    <th className="pb-2 font-medium text-right">Pipeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {salesRepData.map((r, i) => (
                    <tr key={i}>
                      <td className="py-2 font-medium text-zinc-700">{r.nama}</td>
                      <td className="py-2 text-center">{r.leads}</td>
                      <td className="py-2 text-center text-emerald-600">{r.won}</td>
                      <td className="py-2 text-center">
                        <Badge variant={parseInt(r.winRate) >= 35 ? 'default' : 'secondary'}>{r.winRate}</Badge>
                      </td>
                      <td className="py-2 text-right font-medium">{r.pipeline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
