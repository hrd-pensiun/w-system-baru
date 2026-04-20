'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  Wallet,
  Database,
  PiggyBank,
  Briefcase,
  ShoppingCart,
  FolderKanban,
  Landmark,
  Package,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronLeft,
  X,
} from 'lucide-react'
import { useSidebar } from './sidebar-provider'
import { cn } from '@/lib/utils'

const navGroups = [
  {
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'HR',
    items: [
      { href: '/hr/karyawan', label: 'Karyawan', icon: Users },
      { href: '/hr/master-data', label: 'Master Data', icon: Database },
      { href: '/hr/salary-config', label: 'Komponen Gaji', icon: PiggyBank },
      { href: '/hr/payroll-config', label: 'Payroll Config', icon: Wallet },
      { href: '/hr/presensi', label: 'Presensi', icon: Clock },
      { href: '/hr/cuti', label: 'Cuti & Lembur', icon: CalendarDays },
    ],
  },
  {
    items: [
      { href: '/crm', label: 'CRM', icon: Briefcase },
      { href: '/sales', label: 'Sales', icon: ShoppingCart },
      { href: '/project', label: 'Project', icon: FolderKanban },
      { href: '/finance', label: 'Finance', icon: Landmark },
      { href: '/aset', label: 'Aset', icon: Package },
      { href: '/laporan', label: 'Laporan', icon: BarChart3 },
      { href: '/pengaturan', label: 'Pengaturan', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['HR'])

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    )
  }

  const isActive = (href: string) => pathname.startsWith(href)

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-[56px] items-center gap-3 border-b border-zinc-200 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
          <span className="text-sm font-bold text-white">W</span>
        </div>
        {!isCollapsed && (
          <span className="text-sm font-semibold tracking-tight">W System</span>
        )}
        {/* Desktop collapse button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto hidden rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 lg:block"
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform', isCollapsed && 'rotate-180')}
          />
        </button>
        {/* Mobile close */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="ml-auto rounded-md p-1 text-zinc-400 hover:bg-zinc-100 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {navGroups.map((group, gi) => (
          <div key={gi} className="mb-2">
            {group.title && !isCollapsed && (
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400 hover:text-zinc-600"
              >
                {group.title}
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform',
                    expandedGroups.includes(group.title) && 'rotate-180'
                  )}
                />
              </button>
            )}
            {group.title && isCollapsed && (
              <div className="my-2 border-t border-zinc-200" />
            )}
            {(!group.title || expandedGroups.includes(group.title) || isCollapsed) &&
              group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive(item.href)
                      ? 'bg-zinc-100 font-medium text-zinc-900'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              ))}
          </div>
        ))}
      </nav>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-zinc-200 bg-zinc-50 transition-all duration-200 lg:flex',
          isCollapsed ? 'w-[56px]' : 'w-[240px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col border-r border-zinc-200 bg-zinc-50 transition-transform duration-200 lg:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

