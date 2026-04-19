import type { Metadata } from 'next'
import { MockupBanner } from '@/components/shared/mockup-banner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Gift, Medal, Flame, Crown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mockup — Gamifikasi · Phase 7',
  description: 'Preview desain halaman Poin, Level, Badge & Reward',
}

const leaderboard = [
  { rank: 1, nama: 'Sita Permata', departemen: 'Design', poin: 4850, level: 'Platinum', badge: 8, streak: 15 },
  { rank: 2, nama: 'Ahmad Rizal', departemen: 'Teknologi', poin: 4200, level: 'Gold', badge: 7, streak: 12 },
  { rank: 3, nama: 'Nina Sari', departemen: 'Produk', poin: 3900, level: 'Gold', badge: 6, streak: 10 },
  { rank: 4, nama: 'Budi Santoso', departemen: 'Teknologi', poin: 3200, level: 'Silver', badge: 5, streak: 8 },
  { rank: 5, nama: 'Rudi Hartono', departemen: 'Teknologi', poin: 2800, level: 'Silver', badge: 4, streak: 5 },
  { rank: 6, nama: 'Putri Rahayu', departemen: 'SDM', poin: 2200, level: 'Bronze', badge: 3, streak: 3 },
  { rank: 7, nama: 'Fajar Nugroho', departemen: 'Keuangan', poin: 1800, level: 'Bronze', badge: 2, streak: 2 },
  { rank: 8, nama: 'Dewi Lestari', departemen: 'Pemasaran', poin: 1200, level: 'Bronze', badge: 1, streak: 1 },
]

const levelConfig: Record<string, { color: string; icon: typeof Crown }> = {
  Platinum: { color: 'text-violet-600 bg-violet-50', icon: Crown },
  Gold: { color: 'text-amber-600 bg-amber-50', icon: Trophy },
  Silver: { color: 'text-zinc-600 bg-zinc-100', icon: Medal },
  Bronze: { color: 'text-orange-600 bg-orange-50', icon: Star },
}

const badges = [
  { nama: 'First Step', deskripsi: 'Menyelesaikan onboarding', icon: '🏃', poin: 100, earners: 8 },
  { nama: 'Code Warrior', deskripsi: '1000 commit dalam setahun', icon: '⚔️', poin: 500, earners: 3 },
  { nama: 'Team Player', deskripsi: '5 project bersama tim', icon: '🤝', poin: 300, earners: 5 },
  { nama: 'Knowledge Sharer', deskripsi: 'Menulis 5 artikel KB', icon: '📚', poin: 250, earners: 4 },
  { nama: 'Perfect Attendance', deskripsi: 'Tidak absen 3 bulan berturut', icon: '📅', poin: 400, earners: 6 },
  { nama: 'Bug Hunter', deskripsi: 'Menemukan 50 bug', icon: '🐛', poin: 350, earners: 2 },
  { nama: 'Early Bird', deskripsi: 'Masuk sebelum 08:00 selama 30 hari', icon: '🌅', poin: 200, earners: 4 },
  { nama: 'Speed Runner', deskripsi: 'Task selesai sebelum deadline 10x', icon: '⚡', poin: 300, earners: 3 },
]

const rewards = [
  { nama: 'Voucher Makan Rp100.000', poin: 500, stok: 20, redeemed: 15 },
  { nama: 'Extra Cuti 1 Hari', poin: 1000, stok: 5, redeemed: 3 },
  { nama: 'Netflix 1 Bulan', poin: 800, stok: 10, redeemed: 8 },
  { nama: 'Toko Voucher Game Rp50.000', poin: 300, stok: 30, redeemed: 22 },
  { nama: 'Half Day Friday', poin: 1500, stok: 3, redeemed: 1 },
]

export default function GamifikasiPage() {
  return (
    <div className="space-y-6">
      <MockupBanner phase="Phase 7 — Gamifikasi" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><Trophy className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Total Poin Diedistribusikan</p><p className="text-xl font-semibold text-zinc-900">24.150</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Medal className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Badge Tersedia</p><p className="text-xl font-semibold text-zinc-900">8</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Gift className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Reward Diklaim</p><p className="text-xl font-semibold text-zinc-900">49</p></div>
        </div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600"><Flame className="h-5 w-5" /></div>
          <div><p className="text-sm text-zinc-500">Longest Streak</p><p className="text-xl font-semibold text-zinc-900">15 hari</p></div>
        </div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">Leaderboard</CardTitle><CardDescription>Peringkat berdasarkan poin</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((l, i) => {
              const lc = levelConfig[l.level]
              const LevelIcon = lc.icon
              return (
                <div key={i} className={`flex items-center gap-4 rounded-lg border p-3 ${l.rank <= 3 ? 'border-amber-200 bg-amber-50/30' : 'border-zinc-100'}`}>
                  <span className={`w-8 text-center font-bold ${l.rank === 1 ? 'text-amber-500' : l.rank === 2 ? 'text-zinc-400' : l.rank === 3 ? 'text-orange-400' : 'text-zinc-400'}`}>
                    {l.rank <= 3 ? ['🥇','🥈','🥉'][l.rank-1] : l.rank}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-800">{l.nama}</p>
                    <p className="text-xs text-zinc-500">{l.departemen} · 🔥 {l.streak} hari streak</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${lc.color}`}>
                      <LevelIcon className="h-3 w-3" />{l.level}
                    </div>
                    <span className="text-sm font-semibold text-zinc-700">{l.poin.toLocaleString()} pt</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Badge Collection</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((b, i) => (
                <div key={i} className="rounded-lg border border-zinc-200 p-3 text-center space-y-1">
                  <span className="text-2xl">{b.icon}</span>
                  <p className="text-sm font-medium text-zinc-700">{b.nama}</p>
                  <p className="text-[10px] text-zinc-500">{b.deskripsi}</p>
                  <Badge variant="secondary" className="text-[10px]">+{b.poin} pt · {b.earners}x</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Reward Redemption</CardTitle><CardDescription>Klaim reward dengan poin</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rewards.map((r, i) => {
                const sisa = r.stok - r.redeemed
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 p-3">
                    <div>
                      <p className="font-medium text-zinc-700">{r.nama}</p>
                      <p className="text-xs text-zinc-500">Sisa: {sisa}/{r.stok}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{r.poin} pt</Badge>
                      <span className={`text-xs ${sisa > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{sisa > 0 ? 'Tersedia' : 'Habis'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
