'use client'

import { useSidebar } from './sidebar-provider'
import { Sidebar } from './sidebar'
import { TopBar } from './topbar'
import { cn } from '@/lib/utils'

export function Shell({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Sidebar />
      <TopBar />
      <main
        className={cn(
          'pt-[56px] p-6 transition-all duration-200',
          isCollapsed ? 'lg:ml-[56px]' : 'lg:ml-[240px]'
        )}
      >
        {children}
      </main>
    </div>
  )
}