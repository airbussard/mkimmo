'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DEFAULT_NAVIGATION,
  MAKLER_NAVIGATION,
  HAUSVERWALTUNG_NAVIGATION,
  COMPANY_INFO,
  NavItem,
} from '@/config/navigation'
import { cn } from '@/lib/utils'

function getNavigationForPath(pathname: string): NavItem[] {
  if (pathname.startsWith('/makler')) {
    return MAKLER_NAVIGATION
  }
  if (pathname.startsWith('/hausverwaltung')) {
    return HAUSVERWALTUNG_NAVIGATION
  }
  return DEFAULT_NAVIGATION
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary-600',
        isActive ? 'text-primary-600' : 'text-secondary-600'
      )}
    >
      {item.titel}
    </Link>
  )
}

function NavDropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const isChildActive = item.children?.some(
    (child) => pathname === child.href || pathname.startsWith(child.href)
  )

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={cn(
          'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary-600',
          isChildActive ? 'text-primary-600' : 'text-secondary-600'
        )}
      >
        {item.titel}
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-secondary-200 py-2 min-w-[240px]">
            {item.children?.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  'block px-4 py-2 hover:bg-secondary-50 transition-colors',
                  pathname === child.href || pathname.startsWith(child.href)
                    ? 'text-primary-600'
                    : 'text-secondary-700'
                )}
              >
                <div className="font-medium">{child.titel}</div>
                {child.beschreibung && (
                  <div className="text-xs text-secondary-500 mt-0.5">{child.beschreibung}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const navigation = getNavigationForPath(pathname)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logomk.png"
              alt={COMPANY_INFO.name}
              width={360}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) =>
              item.children ? (
                <NavDropdown key={item.titel} item={item} pathname={pathname} />
              ) : (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                />
              )
            )}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild>
              <Link href="/kontakt">Kontakt aufnehmen</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-secondary-600 hover:text-primary-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-[600px] pb-4' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col space-y-2 pt-4">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.titel} className="space-y-1">
                  <div className="py-2 text-sm font-medium text-secondary-500">{item.titel}</div>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'block py-2 pl-4 text-sm font-medium transition-colors hover:text-primary-600',
                        pathname === child.href || pathname.startsWith(child.href)
                          ? 'text-primary-600'
                          : 'text-secondary-600'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {child.titel}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block py-2 text-sm font-medium transition-colors hover:text-primary-600',
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                      ? 'text-primary-600'
                      : 'text-secondary-600'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.titel}
                </Link>
              )
            )}
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/kontakt" onClick={() => setMobileMenuOpen(false)}>
                  Kontakt aufnehmen
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
