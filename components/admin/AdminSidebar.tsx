'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import {
  LayoutDashboard,
  Building2,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Users,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  user: User
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Immobilien',
    href: '/admin/immobilien',
    icon: Building2,
  },
  {
    name: 'Blog',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    name: 'Anfragen',
    href: '/admin/anfragen',
    icon: MessageSquare,
  },
  {
    name: 'Hausverwaltung',
    href: '/admin/hausverwaltung',
    icon: Home,
    children: [
      { name: 'Objekte', href: '/admin/hausverwaltung/objekte' },
      { name: 'Einheiten', href: '/admin/hausverwaltung/einheiten' },
      { name: 'Mieter', href: '/admin/hausverwaltung/mieter' },
    ],
  },
  {
    name: 'Benutzer',
    href: '/admin/benutzer',
    icon: Users,
  },
  {
    name: 'Einstellungen',
    href: '/admin/einstellungen',
    icon: Settings,
  },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-secondary-200">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/images/logomk.png"
            alt="MK Immobilien"
            width={150}
            height={34}
            className="h-8 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.includes(item.name)

          return (
            <div key={item.name}>
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-secondary-700 hover:bg-secondary-100'
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'block px-3 py-2 rounded-lg text-sm transition-colors',
                            pathname === child.href
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-secondary-600 hover:bg-secondary-100'
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-700 hover:bg-secondary-100'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-secondary-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-900 truncate">
              {user.email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Abmelden
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-md"
      >
        {mobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-secondary-200 transition-transform lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
