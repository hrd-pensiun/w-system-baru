import type { Metadata } from 'next'
import { SidebarProvider } from '@/components/layout/sidebar-provider'
import { Shell } from '@/components/layout/shell'

export const metadata: Metadata = {
  title: 'Dashboard — W System',
  description: 'Workforce Intelligence System — Dashboard manajemen bisnis',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Shell>{children}</Shell>
    </SidebarProvider>
  )
}