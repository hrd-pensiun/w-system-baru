'use client'

import { AlertTriangle } from 'lucide-react'

export function MockupBanner({ phase }: { phase: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>
        <strong>MOCKUP</strong> — {phase} · Ini adalah preview desain, bukan halaman produksi. Data ditampilkan menggunakan contoh statis.
      </span>
    </div>
  )
}