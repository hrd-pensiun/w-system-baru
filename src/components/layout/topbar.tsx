'use client'

import { useAuthStore } from '@/lib/auth-store'
import { useSidebar } from './sidebar-provider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Menu, LogOut, Building2 } from 'lucide-react'
import { logoutUser } from '@/app/(auth)/login/actions'
import { useRouter } from 'next/navigation'

export function TopBar() {
  const { user, setActiveEntity, setActiveBranch } = useAuthStore()
  const { isMobileOpen, setIsMobileOpen, isCollapsed } = useSidebar()
  const router = useRouter()

  // Entity/branch switcher - placeholder until we fetch from DB
  const entities = [
    { id: '00000000-0000-0000-0000-000000000010', name: 'PT W.System Indonesia' },
  ]
  const branches = [
    { id: '00000000-0000-0000-0000-000000000100', name: 'Kantor Pusat Jakarta' },
  ]

  const handleLogout = async () => {
    await logoutUser()
    useAuthStore.getState().logout()
    router.push('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <header className="fixed top-0 right-0 z-30 flex h-[56px] items-center border-b border-zinc-200 bg-white px-4"
      style={{ left: '0', }}
    >
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="mr-3 rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb placeholder */}
      <div className="hidden text-sm text-muted-foreground sm:block">
        <span className="font-medium text-zinc-900">W System</span>
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-3">
        {/* Entity switcher - hidden on mobile */}
        <div className="hidden items-center gap-2 md:flex">
          <Select
            value={user?.entityId ?? entities[0]?.id}
            onValueChange={(v) => setActiveEntity(v!)}
          >
            <SelectTrigger className="h-8 w-[200px] text-xs">
              <Building2 className="mr-1.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <SelectValue placeholder="Pilih entitas" />
            </SelectTrigger>
            <SelectContent>
              {entities.map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-100 outline-none">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-zinc-900 text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium md:block">
              {user?.name ?? 'Pengguna'}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name ?? 'Pengguna'}</span>
                <span className="text-xs text-muted-foreground">{user?.email ?? ''}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}